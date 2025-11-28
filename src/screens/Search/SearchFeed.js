

// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     TextInput,
//     FlatList,
//     Image,
//     StyleSheet,
//     TouchableOpacity,
//     StatusBar,
//     Text,
//     ScrollView,
//     Modal,
//     Alert,
//     Dimensions
// } from 'react-native';
// import { LocationIcon, LocationNewTheme, Mic, Search, } from '../../assets/SVGs';
// import { useSelector } from 'react-redux';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';
// import { App_Primary_color } from '../../common/Colors/colors';
// import { ToastMsg } from '../../utils/helperFunctions';
// import GradientIcon from '../../components/GradientIcon';

// const { width } = Dimensions.get('window');

// const SearchScreen = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const { showLoader, hideLoader } = useLoader();

//     // Existing states
//     const [allShops, setAllShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
//     const [isSearching, setIsSearching] = useState(false);
//     const [searchFocused, setSearchFocused] = useState(false);
//     const [loading, setLoading] = useState(false);

//     // New location-based states
//     const [nearbyUsers, setNearbyUsers] = useState([]);
//     const [userLocation, setUserLocation] = useState(null);
//     const [searchRadius, setSearchRadius] = useState(5000); // Default 10km (in meters for API)
//     const [showRadiusModal, setShowRadiusModal] = useState(false);
//     const [locationPermission, setLocationPermission] = useState(false);
//     const [nearbyLoading, setNearbyLoading] = useState(false);

//     // Browse categories
//     const browseCategories = [
//         // { id: 'meetups', title: 'Meetups', icon: '👥' },
//         // { id: 'people', title: 'People', icon: '👤' },
//         { id: 'marketplace', title: 'Marketplace', icon: '🛒' },
//         // { id: 'collections', title: 'Collections', icon: '📚' },
//         // { id: 'reviews', title: 'Reviews', icon: '⭐' },
//         // { id: 'timegrapher', title: 'Timegrapher', icon: '⏱️' },
//         // { id: 'news', title: 'News', icon: '📰' },
//         // { id: 'nwa', title: 'NWA', icon: '🔧' },
//     ];

//     useEffect(() => {
//         fetchData();
//         // Simulate location permission
//         setTimeout(() => {
//             setLocationPermission(true);
//             setUserLocation({ latitude: 23.2599, longitude: 77.4126 }); // Bhopal coordinates
//         }, 1000);
//     }, []);

//     useEffect(() => {
//         if (userLocation && locationPermission) {
//             fetchNearbyUsers();
//         }
//     }, [userLocation, searchRadius]);

//     useEffect(() => {
//         if (searchQuery.trim()) {
//             setIsSearching(true);
//             const timeoutId = setTimeout(() => {
//                 filterShops();
//                 setIsSearching(false);
//             }, 300);
//             return () => clearTimeout(timeoutId);
//         } else {
//             setFilteredShops(allShops);
//             setIsSearching(false);
//         }
//     }, [searchQuery, allShops]);

//     // Dummy function - replace with actual location permission request
//     const requestLocationPermission = async () => {
//         // Simulate permission granted
//         setLocationPermission(true);
//         setUserLocation({ latitude: 23.2599, longitude: 77.4126 }); // Bhopal coordinates
//     };

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const res = await apiGet(urls.getAllUsers);
//             setAllShops(res?.data || []);
//             setFilteredShops(res?.data || []);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//         setLoading(false);
//     };

//     const fetchNearbyUsers = async () => {
//         setNearbyLoading(true);
//         try {
//             const res = await apiGet(`/api/user/FindNearestUser?distance=${searchRadius}`);
//             if (res?.statusCode === 200 && res?.data) {
//                 setNearbyUsers(res.data);
//                 // console.log('Nearest',JSON.stringify(nearbyUsers) );

//             } else {
//                 setNearbyUsers([]);
//             }
//         } catch (error) {
//             console.error('Error fetching nearby users:', error);
//             setNearbyUsers([]);
//         }
//         setNearbyLoading(false);
//     };



//     const filterShops = () => {
//         const filtered = allShops.filter(shop => {
//             const UserName = (shop.UserName || '').toLowerCase();
//             const FullName = (shop.FullName || '').toLowerCase();
//             const query = searchQuery.toLowerCase();
//             return UserName.includes(query) || FullName.includes(query);
//         });
//         setFilteredShops(filtered);
//     };

//     const handleSearchChange = (text) => {
//         setSearchQuery(text);
//     };

//     const handleSearchSubmit = () => {
//         if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
//             setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
//         }
//     };

//     const handleRecentSearchPress = (query) => {
//         setSearchQuery(query);
//         setSearchFocused(false);
//     };

//     const clearSearch = () => {
//         setSearchQuery('');
//         setFilteredShops(allShops);
//     };

//     const removeRecentSearch = (searchToRemove) => {
//         setRecentSearches(prev => prev.filter(search => search !== searchToRemove));
//     };

//     const handleCategoryPress = (category) => {
//         navigation.navigate('Tab', { screen: 'MarketPlace' });
//     };

//     // Convert meters to km for display
//     const formatDistance = (distanceInMeters) => {
//         if (distanceInMeters < 1000) {
//             return `${Math.round(distanceInMeters)}m`;
//         }
//         return `${(distanceInMeters / 1000).toFixed(1)}km`;
//     };

//     const renderUserCard = ({ item, index }) => (
//         <TouchableOpacity
//             style={styles.cardContainer}
//             activeOpacity={0.8}
//             onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
//         >
//             <Image
//                 source={{ uri: item.Image || 'https://picsum.photos/536/354' }}
//                 style={styles.cardImage}
//             />
//             <View style={styles.overlay} />
//             <View style={styles.textContainer}>
//                 <Text style={styles.cardTitle} numberOfLines={1}>
//                     {item.UserName || 'Unknown'}
//                 </Text>
//                 {item.distance && (
//                     <Text style={styles.distanceText}>
//                         {formatDistance(item.distance)} away
//                     </Text>
//                 )}
//             </View>
//         </TouchableOpacity>
//     );

//     const renderNearbyUser = ({ item, index }) => (
//         <TouchableOpacity
//             style={styles.nearbyUserContainer}
//             onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
//         >
//             {/* {console.log('+++++++++++++++++++++', item)
//             } */}
//             <Image
//                 source={{
//                     uri: item.Image && item.Image.startsWith('http')
//                         ? item.Image
//                         : 'https://picsum.photos/100/100'
//                 }}
//                 style={styles.nearbyUserImage}
//             />
//             <Text style={[styles.nearbyUserName, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                 {item.UserName || 'Unknown'}
//             </Text>
//             <View style={styles.locationBadge}>
//                 <LocationIcon width={10} height={10} color="#fff" />
//                 <Text style={styles.locationText}>
//                     {item?.Location?.City ? item?.Location?.City : formatDistance(item.distance || 0)}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );



//     const RadiusModal = () => (
//         <Modal
//             visible={showRadiusModal}
//             transparent={true}
//             animationType="slide"
//         >
//             <View style={styles.modalOverlay}>
//                 <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
//                     <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
//                         Search Radius
//                     </Text>
//                     <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#888' : '#666' }]}>
//                         How far should we look for nearby users?
//                     </Text>

//                     {[1000, 3000, 5000, 10000, 25000, 50000].map(radius => (
//                         <TouchableOpacity
//                             key={radius}
//                             style={[
//                                 styles.radiusOption,
//                                 { backgroundColor: searchRadius === radius ? '#4F52FE' : 'transparent' }
//                             ]}
//                             onPress={() => {
//                                 setSearchRadius(radius);
//                                 setShowRadiusModal(false);
//                             }}
//                         >
//                             <Text style={[
//                                 styles.radiusText,
//                                 { color: searchRadius === radius ? '#fff' : (isDarkMode ? '#fff' : '#000') }
//                             ]}>
//                                 {radius >= 1000 ? `${radius / 1000} km` : `${radius}m`}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}

//                     <TouchableOpacity
//                         style={styles.modalCloseButton}
//                         onPress={() => setShowRadiusModal(false)}
//                     >
//                         <Text style={styles.modalCloseText}>Cancel</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//         },
//         searchContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1',
//             borderRadius: 12,
//             margin: 16,
//             padding: 12,
//             marginTop: 60,
//             borderWidth: searchFocused ? 1 : 0,
//             borderColor: isDarkMode ? '#333' : '#ddd',
//         },
//         searchIcon: {
//             marginRight: 10,
//         },
//         searchInput: {
//             flex: 1,
//             fontSize: 16,
//             color: isDarkMode ? '#fff' : '#000',
//             paddingVertical: 0,
//         },
//         clearButton: {
//             padding: 4,
//         },
//         headerSection: {
//             paddingHorizontal: 16,
//             marginBottom: 12,
//         },
//         sectionHeader: {
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: 12,
//         },
//         sectionTitle: {
//             fontSize: 18,
//             fontWeight: '700',
//             color: isDarkMode ? '#fff' : '#000',
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold
//         },
//         radiusButton: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingHorizontal: 12,
//             paddingVertical: 6,
//             backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
//             borderRadius: 16,
//         },
//         radiusButtonText: {
//             fontSize: 12,
//             color: isDarkMode ? '#fff' : '#000',
//             marginLeft: 4,
//         },
//         nearbyContainer: {
//             paddingLeft: 16,
//             marginBottom: 20,
//         },
//         nearbyUserContainer: {
//             alignItems: 'center',
//             marginRight: 12,
//             width: 80,
//         },
//         nearbyUserImage: {
//             width: 60,
//             height: 60,
//             borderRadius: 30,
//             marginBottom: 6,
//         },
//         nearbyUserName: {
//             fontSize: 12,
//             fontWeight: '500',
//             textAlign: 'center',
//             marginBottom: 4,
//         },
//         locationBadge: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: !isDarkMode ? 'gray' : '#252525',
//             paddingHorizontal: 6,
//             paddingVertical: 2,
//             borderRadius: 8,
//         },
//         locationText: {
//             fontSize: 10,
//             color: '#fff',
//             marginLeft: 2,
//         },
//         browseSection: {
//             paddingHorizontal: 16,
//             marginBottom: 20,
//         },
//         categoriesGrid: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             justifyContent: 'space-between',
//         },
//         categoryContainer: {
//             width: (width - 48) / 2,
//             height: 120,
//             borderRadius: 12,
//             marginBottom: 12,
//             position: 'relative',
//             overflow: 'hidden',
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         categoryImageContainer: {
//             position: 'absolute',
//             top: 20,
//             left: 20,
//         },
//         categoryEmoji: {
//             fontSize: 24,
//         },
//         categoryOverlay: {
//             position: 'absolute',
//             bottom: 0,
//             left: 0,
//             right: 0,
//             height: '30%',
//             backgroundColor: 'rgba(0, 0, 0, 0.1)',
//         },
//         categoryTitle: {
//             position: 'absolute',
//             bottom: 12,
//             left: 12,
//             color: isDarkMode ? '#fff' : '#000',
//             fontSize: 16,
//             fontWeight: '600',
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },
//         gridContainer: {
//             flex: 1,
//             paddingHorizontal: 8,
//             marginBottom: 100
//         },
//         cardContainer: {
//             flex: 1,
//             height: 160,
//             margin: 4,
//             borderRadius: 12,
//             overflow: 'hidden',
//             position: 'relative',
//             backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//         },
//         cardImage: {
//             width: '100%',
//             height: '100%',
//             resizeMode: 'cover',
//         },
//         overlay: {
//             position: 'absolute',
//             bottom: 0,
//             left: 0,
//             right: 0,
//             height: '35%',
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             borderBottomLeftRadius: 12,
//             borderBottomRightRadius: 12,
//         },
//         textContainer: {
//             position: 'absolute',
//             bottom: 12,
//             left: 12,
//             right: 12,
//         },
//         cardTitle: {
//             color: '#fff',
//             fontSize: 16,
//             fontWeight: '600',
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             textShadowColor: 'rgba(0, 0, 0, 0.8)',
//             textShadowOffset: { width: 0, height: 1 },
//             textShadowRadius: 3,
//             marginBottom: 2,
//         },
//         distanceText: {
//             color: '#ccc',
//             fontSize: 12,
//             fontWeight: '400',
//         },
//         noResults: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//             paddingTop: 100,
//         },
//         noResultsText: {
//             fontSize: 16,
//             color: isDarkMode ? '#888' : '#666',
//             textAlign: 'center',
//         },
//         loadingContainer: {
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         loadingText: {
//             color: isDarkMode ? '#888' : '#666',
//             marginTop: 10,
//         },
//         // Modal styles
//         modalOverlay: {
//             flex: 1,
//             backgroundColor: 'rgba(0, 0, 0, 0.5)',
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         modalContainer: {
//             width: width * 0.8,
//             borderRadius: 16,
//             padding: 20,
//         },
//         modalTitle: {
//             fontSize: 20,
//             fontWeight: '700',
//             textAlign: 'center',
//             marginBottom: 8,
//         },
//         modalSubtitle: {
//             fontSize: 14,
//             textAlign: 'center',
//             marginBottom: 20,
//         },
//         radiusOption: {
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 8,
//             alignItems: 'center',
//         },
//         radiusText: {
//             fontSize: 16,
//             fontWeight: '500',
//         },
//         modalCloseButton: {
//             marginTop: 10,
//             padding: 12,
//             alignItems: 'center',
//         },
//         modalCloseText: {
//             color: '#007AFF',
//             fontSize: 16,
//             fontWeight: '500',
//         },
//         recentContainer: {
//             padding: 16,
//         },
//         recentItem: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             paddingVertical: 12,
//             paddingHorizontal: 4,
//         },
//         recentText: {
//             flex: 1,
//             fontSize: 15,
//             marginLeft: 12,
//             color: isDarkMode ? '#fff' : '#000',
//         },
//         removeButton: {
//             padding: 4,
//         },
//     });

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

//             {loading ? <SearchShimmerLoader /> : (
//                 <>
//                     {/* Search Bar */}
//                     <View style={styles.searchContainer}>
//                         {/* <Search
//                             style={styles.searchIcon}
//                             width={20}
//                             height={20}
//                             color={isDarkMode ? '#888' : '#666'}
//                         /> */}
//                            <GradientIcon
//                                 // colors={['#4F52FE', '#FC14CB']}
//                                 colors={['#21B7FF', '#0084F8']}
//                                 size={18}
//                                 iconType='FontAwesome5'
//                                 name={'search'}
//                             />
//                         <TextInput
//                             style={styles.searchInput}
//                             placeholder="Search..."
//                             placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                             value={searchQuery}
//                             onChangeText={handleSearchChange}
//                             onFocus={() => setSearchFocused(true)}
//                             onBlur={() => setSearchFocused(false)}
//                             onSubmitEditing={handleSearchSubmit}
//                             returnKeyType="search"
//                         />
//                         {searchQuery.length > 0 && (
//                             <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
//                                 <Text style={{ color: isDarkMode ? '#888' : '#666' }}>✕</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>

//                     {/* Content */}
//                     {searchQuery.trim() === '' ? (
//                         <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//                             {/* People near you section */}
//                             {locationPermission && (
//                                 <View style={styles.headerSection}>
//                                     <View style={styles.sectionHeader}>
//                                         <Text style={styles.sectionTitle}>People near you</Text>
//                                         <TouchableOpacity
//                                             style={styles.radiusButton}
//                                             onPress={() => {
//                                                 ToastMsg('This feature is coming soon!')
//                                                 // setShowRadiusModal(true)
//                                             }}
//                                         >
//                                             <Text style={styles.radiusButtonText}>
//                                                 {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
//                                             </Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                     {nearbyLoading ? (
//                                         <View style={styles.loadingContainer}>
//                                             <Text style={styles.loadingText}>Loading nearby users...</Text>
//                                         </View>
//                                     ) : nearbyUsers.length > 0 ? (
//                                         <FlatList
//                                             data={nearbyUsers}
//                                             horizontal
//                                             showsHorizontalScrollIndicator={false}
//                                             keyExtractor={item => `nearby-${item._id}`}
//                                             renderItem={renderNearbyUser}
//                                             contentContainerStyle={styles.nearbyContainer}
//                                         />
//                                     ) : (
//                                         <View style={styles.loadingContainer}>
//                                             <Text style={styles.loadingText}>No nearby users found</Text>
//                                         </View>
//                                     )}
//                                 </View>
//                             )}

//                             {/* Browse section */}
//                             <View style={styles.browseSection}>
//                                 <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Browse</Text>
//                                 <View style={styles.categoriesGrid}>
//                                     {browseCategories.map((category, index) => (
//                                         <TouchableOpacity
//                                             key={category.id}
//                                             style={[styles.categoryContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}
//                                             onPress={() => handleCategoryPress(category)}
//                                         >
//                                             <View style={styles.categoryImageContainer}>
//                                                 <Text style={styles.categoryEmoji}>{category.icon}</Text>
//                                             </View>
//                                             <Text style={styles.categoryTitle}>{category.title}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </View>
//                             </View>

//                             {/* Discover People section */}
//                             <View style={styles.gridContainer}>
//                                 <Text style={[styles.sectionTitle, { paddingHorizontal: 8, marginTop: 8, marginBottom: 16 }]}>
//                                     Discover People
//                                 </Text>
//                                 <FlatList
//                                     data={allShops}
//                                     keyExtractor={item => item._id}
//                                     numColumns={2}
//                                     showsVerticalScrollIndicator={false}
//                                     scrollEnabled={false}
//                                     renderItem={renderUserCard}
//                                     contentContainerStyle={{ paddingTop: 8 }}
//                                 />
//                             </View>
//                         </ScrollView>
//                     ) : (
//                         <View style={styles.gridContainer}>
//                             {isSearching ? (
//                                 <View style={styles.loadingContainer}>
//                                     <Text style={styles.loadingText}>Searching...</Text>
//                                 </View>
//                             ) : filteredShops.length > 0 ? (
//                                 <FlatList
//                                     data={filteredShops}
//                                     keyExtractor={item => item._id}
//                                     numColumns={2}
//                                     showsVerticalScrollIndicator={false}
//                                     renderItem={renderUserCard}
//                                     contentContainerStyle={{ paddingTop: 8 }}
//                                 />
//                             ) : (
//                                 <View style={styles.noResults}>
//                                     <Text style={styles.noResultsText}>
//                                         No results found for "{searchQuery}"
//                                     </Text>
//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* Radius Selection Modal */}
//                     <RadiusModal />
//                 </>
//             )}
//         </View>
//     );
// };

// export default SearchScreen;

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Text,
    ScrollView,
    Modal,
    Dimensions
} from 'react-native';
import { LocationIcon, Search } from '../../assets/SVGs';
import { useSelector } from 'react-redux';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { FONTS_FAMILY } from '../../assets/Fonts';
import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';
import { ToastMsg } from '../../utils/helperFunctions';
import GradientIcon from '../../components/GradientIcon';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';

const { width } = Dimensions.get('window');

;

const SearchScreen = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader();

    const [allShops, setAllShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
    const [isSearching, setIsSearching] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const [nearbyUsers, setNearbyUsers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchRadius, setSearchRadius] = useState(5000);
    const [showRadiusModal, setShowRadiusModal] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const [nearbyLoading, setNearbyLoading] = useState(false);

    const browseCategories = [
        { id: 'marketplace', title: 'Marketplace', icon: '🛒' },
    ];

    useEffect(() => {
        fetchData();
        setTimeout(() => {
            setLocationPermission(true);
            setUserLocation({ latitude: 23.2599, longitude: 77.4126 });
        }, 1000);
    }, []);

    useEffect(() => {
        if (userLocation && locationPermission) {
            fetchNearbyUsers();
        }
    }, [userLocation, searchRadius]);

    useEffect(() => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            const timeoutId = setTimeout(() => {
                filterShops();
                setIsSearching(false);
            }, 300);
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

    const fetchNearbyUsers = async () => {
        setNearbyLoading(true);
        try {
            const res = await apiGet(`/api/user/FindNearestUser?distance=${searchRadius}`);
            if (res?.statusCode === 200 && res?.data) {
                setNearbyUsers(res.data);
            } else {
                setNearbyUsers([]);
            }
        } catch (error) {
            console.error('Error fetching nearby users:', error);
            setNearbyUsers([]);
        }
        setNearbyLoading(false);
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

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredShops(allShops);
    };

    const handleCategoryPress = (category) => {
        navigation.navigate('Tab', { screen: 'MarketPlace' });
    };

    const handleUserPress = useCallback((userId) => {
        if (userId) {
            navigation.navigate('OtherUserDetail', { userId });
        }
    }, [navigation]);

    // Browse Category Card Component with GlowWrapper
const BrowseCategoryCard = React.memo(({ category, isDarkMode, onPress }) => {
    return (
        <GlowWrapper
            isDarkMode={isDarkMode}
            borderRadius={12}
            showStars={true}
            starCount={6}
            showShinePatches={false}
            intensity="low"
            containerStyle={{
                width: (width - 48) / 2,
                marginBottom: 12,
            }}
        >
            <TouchableOpacity
                style={[
                    styles.categoryContainer,
                    { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <View style={styles.categoryImageContainer}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                </View>
                <Text style={[styles.categoryTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                    {category.title}
                </Text>
            </TouchableOpacity>
        </GlowWrapper>
    );
});

// User Card Component with GlowWrapper
const UserCard = React.memo(({ item, isDarkMode, onPress }) => {
    if (!item || !item._id) return null;

    return (
        <GlowWrapper
            isDarkMode={isDarkMode}
            borderRadius={12}
            showStars={true}
            starCount={5}
            showShinePatches={true}
            intensity="low"
            containerStyle={{
                flex: 1,
                margin: 4,
            }}
        >
            <TouchableOpacity
                style={styles.cardContainer}
                activeOpacity={0.8}
                onPress={onPress}
            >
                <Image
                    source={{ uri: item.Image || 'https://picsum.photos/536/354' }}
                    style={styles.cardImage}
                />
                <View style={styles.overlay} />
                <View style={styles.textContainer}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                        {item.UserName || 'Unknown'}
                    </Text>
                    {item.distance && (
                        <Text style={styles.distanceText}>
                            {formatDistance(item.distance)} away
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </GlowWrapper>
    );
});

BrowseCategoryCard.displayName = 'BrowseCategoryCard';
UserCard.displayName = 'UserCard';

// Helper function
const formatDistance = (distanceInMeters) => {
    if (distanceInMeters < 1000) {
        return `${Math.round(distanceInMeters)}m`;
    }
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
}

    const renderNearbyUser = ({ item }) => (
        <TouchableOpacity
            style={styles.nearbyUserContainer}
            onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
        >
            <Image
                source={{
                    uri: item.Image && item.Image.startsWith('http')
                        ? item.Image
                        : 'https://picsum.photos/100/100'
                }}
                style={styles.nearbyUserImage}
            />
            <Text style={[styles.nearbyUserName, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
                {item.UserName || 'Unknown'}
            </Text>
            <View style={styles.locationBadge}>
                <LocationIcon width={10} height={10} color="#fff" />
                <Text style={styles.locationText}>
                    {item?.Location?.City ? item?.Location?.City : formatDistance(item.distance || 0)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderUserCard = useCallback(({ item }) => (
        <UserCard
            item={item}
            isDarkMode={isDarkMode}
            onPress={() => handleUserPress(item?._id)}
        />
    ), [isDarkMode, handleUserPress]);

    const renderBrowseCategory = useCallback(({ item }) => (
        <BrowseCategoryCard
            category={item}
            isDarkMode={isDarkMode}
            onPress={() => handleCategoryPress(item)}
        />
    ), [isDarkMode]);

    const keyExtractor = useCallback((item, index) => {
        return item?._id?.toString() || `item-${index}`;
    }, []);

    const RadiusModal = () => (
        <Modal
            visible={showRadiusModal}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }]}>
                    <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                        Search Radius
                    </Text>
                    <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#888' : '#666' }]}>
                        How far should we look for nearby users?
                    </Text>

                    {[1000, 3000, 5000, 10000, 25000, 50000].map(radius => (
                        <TouchableOpacity
                            key={radius}
                            style={[
                                styles.radiusOption,
                                { backgroundColor: searchRadius === radius ? '#4F52FE' : 'transparent' }
                            ]}
                            onPress={() => {
                                setSearchRadius(radius);
                                setShowRadiusModal(false);
                            }}
                        >
                            <Text style={[
                                styles.radiusText,
                                { color: searchRadius === radius ? '#fff' : (isDarkMode ? '#fff' : '#000') }
                            ]}>
                                {radius >= 1000 ? `${radius / 1000} km` : `${radius}m`}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setShowRadiusModal(false)}
                    >
                        <Text style={styles.modalCloseText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
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
            gap: 10,
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
        headerSection: {
            paddingHorizontal: 16,
            marginBottom: 12,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: isDarkMode ? '#fff' : '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold
        },
        radiusButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
            borderRadius: 16,
        },
        radiusButtonText: {
            fontSize: 12,
            color: isDarkMode ? '#fff' : '#000',
            marginLeft: 4,
        },
        nearbyContainer: {
            paddingLeft: 16,
            marginBottom: 20,
        },
        nearbyUserContainer: {
            alignItems: 'center',
            marginRight: 12,
            width: 80,
        },
        nearbyUserImage: {
            width: 60,
            height: 60,
            borderRadius: 30,
            marginBottom: 6,
        },
        nearbyUserName: {
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
            marginBottom: 4,
        },
        locationBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#252525',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
        },
        locationText: {
            fontSize: 10,
            color: '#fff',
            marginLeft: 2,
        },
        browseSection: {
            paddingHorizontal: 16,
            marginBottom: 20,
        },
        categoriesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        categoryContainer: {
            height: 120,
            borderRadius: 12,
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoryImageContainer: {
            position: 'absolute',
            top: 20,
            left: 20,
        },
        categoryEmoji: {
            fontSize: 24,
        },
        categoryTitle: {
            position: 'absolute',
            bottom: 12,
            left: 12,
            fontSize: 16,
            fontWeight: '600',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        gridContainer: {
            flex: 1,
            paddingHorizontal: 8,
            marginBottom: 100
        },
        cardContainer: {
            height: 160,
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
        },
        cardImage: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        overlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
        },
        textContainer: {
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
        },
        cardTitle: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            textShadowColor: 'rgba(0, 0, 0, 0.8)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 3,
            marginBottom: 2,
        },
        distanceText: {
            color: '#ccc',
            fontSize: 12,
            fontWeight: '400',
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
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContainer: {
            width: width * 0.8,
            borderRadius: 16,
            padding: 20,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: 8,
        },
        modalSubtitle: {
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 20,
        },
        radiusOption: {
            padding: 12,
            borderRadius: 8,
            marginBottom: 8,
            alignItems: 'center',
        },
        radiusText: {
            fontSize: 16,
            fontWeight: '500',
        },
        modalCloseButton: {
            marginTop: 10,
            padding: 12,
            alignItems: 'center',
        },
        modalCloseText: {
            color: '#007AFF',
            fontSize: 16,
            fontWeight: '500',
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            {loading ? <SearchShimmerLoader /> : (
                <>
                    <View style={styles.searchContainer}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={18}
                            iconType='FontAwesome5'
                            name={'search'}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search..."
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
                                <Text style={{ color: isDarkMode ? '#888' : '#666' }}>✕</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {searchQuery.trim() === '' ? (
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                            {locationPermission && (
                                <View style={styles.headerSection}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>People near you</Text>
                                        <TouchableOpacity
                                            style={styles.radiusButton}
                                            onPress={() => {
                                                ToastMsg('This feature is coming soon!')
                                            }}
                                        >
                                            <Text style={styles.radiusButtonText}>
                                                {searchRadius >= 1000 ? `${searchRadius / 1000}km` : `${searchRadius}m`}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {nearbyLoading ? (
                                        <View style={styles.loadingContainer}>
                                            <Text style={styles.loadingText}>Loading nearby users...</Text>
                                        </View>
                                    ) : nearbyUsers.length > 0 ? (
                                        <FlatList
                                            data={nearbyUsers}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            keyExtractor={item => `nearby-${item._id}`}
                                            renderItem={renderNearbyUser}
                                            contentContainerStyle={styles.nearbyContainer}
                                        />
                                    ) : (
                                        <View style={styles.loadingContainer}>
                                            <Text style={styles.loadingText}>No nearby users found</Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Browse section with GlowWrapper */}
                            <View style={styles.browseSection}>
                                <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Browse</Text>
                                <FlatList
                                    data={browseCategories}
                                    numColumns={2}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderBrowseCategory}
                                    scrollEnabled={false}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                />
                            </View>

                            {/* Discover People section with GlowWrapper */}
                            <View style={styles.gridContainer}>
                                <Text style={[styles.sectionTitle, { paddingHorizontal: 8, marginTop: 8, marginBottom: 16 }]}>
                                    Discover People
                                </Text>
                                <FlatList
                                    data={allShops}
                                    keyExtractor={keyExtractor}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    scrollEnabled={false}
                                    renderItem={renderUserCard}
                                    contentContainerStyle={{ paddingTop: 8 }}
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
                                    keyExtractor={keyExtractor}
                                    numColumns={2}
                                    showsVerticalScrollIndicator={false}
                                    renderItem={renderUserCard}
                                    contentContainerStyle={{ paddingTop: 8 }}
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

                    <RadiusModal />
                </>
            )}
        </View>
    );
};

export default SearchScreen;