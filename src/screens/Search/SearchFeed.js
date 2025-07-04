import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text, ScrollView } from 'react-native';
import { Mic, Search, } from '../../assets/SVGs';
import { useSelector } from 'react-redux';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { FONTS_FAMILY } from '../../assets/Fonts';
import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';

const SearchScreen = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader();
    const [allShops, setAllShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
    const [isSearching, setIsSearching] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [loading, setLoading]=useState(false)

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            const timeoutId = setTimeout(() => {
                filterShops();
                setIsSearching(false);
            }, 300); // Debounce search
            return () => clearTimeout(timeoutId);
        } else {
            setFilteredShops(allShops);
            setIsSearching(false);
        }
    }, [searchQuery, allShops]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiGet(urls.getAllUsers);
            setAllShops(res?.data || []);
            setFilteredShops(res?.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const filterShops = () => {
        const filtered = allShops.filter(shop => {
            const UserName = (shop.UserName || '').toLowerCase();
            const FullName = (shop.FullName || '').toLowerCase();
            const query = searchQuery.toLowerCase();

            return UserName.includes(query) || FullName.includes(query);
        });
        setFilteredShops(filtered);
    };

    const handleSearchChange = (text) => {
        setSearchQuery(text);
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
            setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
        }
    };

    const handleRecentSearchPress = (query) => {
        setSearchQuery(query);
        setSearchFocused(false);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredShops(allShops);
    };

    const removeRecentSearch = (searchToRemove) => {
        setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
    };

    const renderUserCard = ({ item, index }) => (
        <TouchableOpacity
            style={[
                styles.imageWrapper,
               styles.largeItem
            ]}
            activeOpacity={0.8}
            // onPress={() => navigation.navigate('Tab', {
            //     screen: 'last',
            //     params: { userId: item?._id }
            // })}   
            onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
                 >

            <Image
                source={{ uri: item.Image || 'https://picsum.photos/536/354' }}
                style={styles.image}
            />
            <View style={styles.userInfo}>
                <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
                    {item.UserName || 'Unknown'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderRecentSearches = () => (
        <View style={styles.recentContainer}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                Recent
            </Text>
            {recentSearches.map((search, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.recentItem}
                    onPress={() => handleRecentSearchPress(search)}
                >
                    {/* <Clock width={16} height={16} color={isDarkMode ? '#888' : '#666'} /> */}
                    <Text style={[styles.recentText, { color: isDarkMode ? '#fff' : '#000' }]}>
                        {search}
                    </Text>
                    <TouchableOpacity
                        onPress={() => removeRecentSearch(search)}
                        style={styles.removeButton}
                    >
                        {/* <X width={14} height={14} color={isDarkMode ? '#888' : '#666'} /> */}
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#000' : '#fff',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1',
            borderRadius: 12,
            margin: 16,
            padding: 12,
            marginTop: 60,
            borderWidth: searchFocused ? 1 : 0,
            borderColor: isDarkMode ? '#333' : '#ddd',
        },
        searchIcon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: isDarkMode ? '#fff' : '#000',
            paddingVertical: 0,
        },
        clearButton: {
            padding: 4,
        },
        recentContainer: {
            padding: 16,
        },
        sectionTitle: {
            fontSize: 17,
            fontWeight: '600',
            marginBottom: 12,
            fontFamily:FONTS_FAMILY.SourceSans3_Bold
        },
        recentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 4,
        },
        recentText: {
            flex: 1,
            fontSize: 15,
            marginLeft: 12,
        },
        removeButton: {
            padding: 4,
        },
        gridContainer: {
            flex: 1,
            paddingHorizontal: 2,
            marginBottom: 100
        },
        imageWrapper: {
            flex: 1,
            margin: 1,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
            borderRadius: 8,
            overflow: 'hidden',
        },
        largeItem: {
            flex: 2,
        },
        image: {
            width: '100%',
            height: 120,
            resizeMode: 'cover',
        },
        userInfo: {
            padding: 8,
            alignItems: 'center',
        },
        username: {
            fontSize: 12,
            fontWeight: '500',
            fontFamily:FONTS_FAMILY.SourceSans3_Medium
        },
        noResults: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
        },
        noResultsText: {
            fontSize: 16,
            color: isDarkMode ? '#888' : '#666',
            textAlign: 'center',
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        loadingText: {
            color: isDarkMode ? '#888' : '#666',
            marginTop: 10,
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

{
    loading? <SearchShimmerLoader />:

    (
       <>
           {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search
                    style={styles.searchIcon}
                    width={20}
                    height={20}
                    color={isDarkMode ? '#888' : '#666'}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search users..."
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                        {/* <X width={16} height={16} color={isDarkMode ? '#888' : '#666'} /> */}
                    </TouchableOpacity>
                )}
                {/* <TouchableOpacity style={{ marginLeft: 8 }}>
                    <Mic width={20} height={20} color={isDarkMode ? '#888' : '#666'} />
                </TouchableOpacity> */}
            </View>

            {/* Content */}
            {searchQuery.trim() === '' ? (
                <ScrollView style={{ flex: 1 }}>
                    {/* {renderRecentSearches()} */}
                    <View style={styles.gridContainer}>
                        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000', paddingHorizontal: 16 }]}>
                            Discover People
                        </Text>
                        <FlatList
                            data={allShops}
                            keyExtractor={item => item._id}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            renderItem={renderUserCard}
                        />
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.gridContainer}>
                    {isSearching ? (
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Searching...</Text>
                        </View>
                    ) : filteredShops.length > 0 ? (
                        <FlatList
                            data={filteredShops}
                            keyExtractor={item => item._id}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            renderItem={renderUserCard}
                        />
                    ) : (
                        <View style={styles.noResults}>
                            <Text style={styles.noResultsText}>
                                No results found for "{searchQuery}"
                            </Text>
                        </View>
                    )}
                </View>
            )}
       </> 
    )
}
        
        </View>
    );
};

export default SearchScreen;