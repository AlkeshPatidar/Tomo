// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text, ScrollView } from 'react-native';
// import { Mic, Search, } from '../../assets/SVGs';
// import { useSelector } from 'react-redux';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';

// const SearchScreen = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const { showLoader, hideLoader } = useLoader();
//     const [allShops, setAllShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
//     const [isSearching, setIsSearching] = useState(false);
//     const [searchFocused, setSearchFocused] = useState(false);
//     const [loading, setLoading]=useState(false)

//     useEffect(() => {
//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (searchQuery.trim()) {
//             setIsSearching(true);
//             const timeoutId = setTimeout(() => {
//                 filterShops();
//                 setIsSearching(false);
//             }, 300); // Debounce search
//             return () => clearTimeout(timeoutId);
//         } else {
//             setFilteredShops(allShops);
//             setIsSearching(false);
//         }
//     }, [searchQuery, allShops]);

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

//     const renderUserCard = ({ item, index }) => (
//         <TouchableOpacity
//             style={[
//                 styles.imageWrapper,
//                styles.largeItem
//             ]}
//             activeOpacity={0.8}
//             // onPress={() => navigation.navigate('Tab', {
//             //     screen: 'last',
//             //     params: { userId: item?._id }
//             // })}   
//             onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
//                  >

//             <Image
//                 source={{ uri: item.Image || 'https://picsum.photos/536/354' }}
//                 style={styles.image}
//             />
//             <View style={styles.userInfo}>
//                 <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                     {item.UserName || 'Unknown'}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );

//     const renderRecentSearches = () => (
//         <View style={styles.recentContainer}>
//             <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
//                 Recent
//             </Text>
//             {recentSearches.map((search, index) => (
//                 <TouchableOpacity
//                     key={index}
//                     style={styles.recentItem}
//                     onPress={() => handleRecentSearchPress(search)}
//                 >
//                     {/* <Clock width={16} height={16} color={isDarkMode ? '#888' : '#666'} /> */}
//                     <Text style={[styles.recentText, { color: isDarkMode ? '#fff' : '#000' }]}>
//                         {search}
//                     </Text>
//                     <TouchableOpacity
//                         onPress={() => removeRecentSearch(search)}
//                         style={styles.removeButton}
//                     >
//                         {/* <X width={14} height={14} color={isDarkMode ? '#888' : '#666'} /> */}
//                     </TouchableOpacity>
//                 </TouchableOpacity>
//             ))}
//         </View>
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
//         recentContainer: {
//             padding: 16,
//         },
//         sectionTitle: {
//             fontSize: 17,
//             fontWeight: '600',
//             marginBottom: 12,
//             fontFamily:FONTS_FAMILY.SourceSans3_Bold
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
//         },
//         removeButton: {
//             padding: 4,
//         },
//         gridContainer: {
//             flex: 1,
//             paddingHorizontal: 2,
//             marginBottom: 100
//         },
//         imageWrapper: {
//             flex: 1,
//             margin: 1,
//             backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9',
//             borderRadius: 8,
//             overflow: 'hidden',
//         },
//         largeItem: {
//             flex: 2,
//         },
//         image: {
//             width: '100%',
//             height: 120,
//             resizeMode: 'cover',
//         },
//         userInfo: {
//             padding: 8,
//             alignItems: 'center',
//         },
//         username: {
//             fontSize: 12,
//             fontWeight: '500',
//             fontFamily:FONTS_FAMILY.SourceSans3_Medium
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
//     });

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

// {
//     loading? <SearchShimmerLoader />:

//     (
//        <>
//            {/* Search Bar */}
//             <View style={styles.searchContainer}>
//                 <Search
//                     style={styles.searchIcon}
//                     width={20}
//                     height={20}
//                     color={isDarkMode ? '#888' : '#666'}
//                 />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search users..."
//                     placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                     value={searchQuery}
//                     onChangeText={handleSearchChange}
//                     onFocus={() => setSearchFocused(true)}
//                     onBlur={() => setSearchFocused(false)}
//                     onSubmitEditing={handleSearchSubmit}
//                     returnKeyType="search"
//                 />
//                 {searchQuery.length > 0 && (
//                     <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
//                         {/* <X width={16} height={16} color={isDarkMode ? '#888' : '#666'} /> */}
//                     </TouchableOpacity>
//                 )}
//                 {/* <TouchableOpacity style={{ marginLeft: 8 }}>
//                     <Mic width={20} height={20} color={isDarkMode ? '#888' : '#666'} />
//                 </TouchableOpacity> */}
//             </View>

//             {/* Content */}
//             {searchQuery.trim() === '' ? (
//                 <ScrollView style={{ flex: 1 }}>
//                     {/* {renderRecentSearches()} */}
//                     <View style={styles.gridContainer}>
//                         <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000', paddingHorizontal: 16 }]}>
//                             Discover People
//                         </Text>
//                         <FlatList
//                             data={allShops}
//                             keyExtractor={item => item._id}
//                             numColumns={3}
//                             showsVerticalScrollIndicator={false}
//                             scrollEnabled={false}
//                             renderItem={renderUserCard}
//                         />
//                     </View>
//                 </ScrollView>
//             ) : (
//                 <View style={styles.gridContainer}>
//                     {isSearching ? (
//                         <View style={styles.loadingContainer}>
//                             <Text style={styles.loadingText}>Searching...</Text>
//                         </View>
//                     ) : filteredShops.length > 0 ? (
//                         <FlatList
//                             data={filteredShops}
//                             keyExtractor={item => item._id}
//                             numColumns={3}
//                             showsVerticalScrollIndicator={false}
//                             renderItem={renderUserCard}
//                         />
//                     ) : (
//                         <View style={styles.noResults}>
//                             <Text style={styles.noResultsText}>
//                                 No results found for "{searchQuery}"
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             )}
//        </> 
//     )
// }
        
//         </View>
//     );
// };

// export default SearchScreen;


// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text, ScrollView } from 'react-native';
// import { Mic, Search, } from '../../assets/SVGs';
// import { useSelector } from 'react-redux';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';

// const SearchScreen = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const { showLoader, hideLoader } = useLoader();
//     const [allShops, setAllShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
//     const [isSearching, setIsSearching] = useState(false);
//     const [searchFocused, setSearchFocused] = useState(false);
//     const [loading, setLoading]=useState(false)

//     useEffect(() => {
//         fetchData();
//     }, []);

//     useEffect(() => {
//         if (searchQuery.trim()) {
//             setIsSearching(true);
//             const timeoutId = setTimeout(() => {
//                 filterShops();
//                 setIsSearching(false);
//             }, 300); // Debounce search
//             return () => clearTimeout(timeoutId);
//         } else {
//             setFilteredShops(allShops);
//             setIsSearching(false);
//         }
//     }, [searchQuery, allShops]);

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
//             </View>
//         </TouchableOpacity>
//     );

//     const renderRecentSearches = () => (
//         <View style={styles.recentContainer}>
//             <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
//                 Recent
//             </Text>
//             {recentSearches.map((search, index) => (
//                 <TouchableOpacity
//                     key={index}
//                     style={styles.recentItem}
//                     onPress={() => handleRecentSearchPress(search)}
//                 >
//                     {/* <Clock width={16} height={16} color={isDarkMode ? '#888' : '#666'} /> */}
//                     <Text style={[styles.recentText, { color: isDarkMode ? '#fff' : '#000' }]}>
//                         {search}
//                     </Text>
//                     <TouchableOpacity
//                         onPress={() => removeRecentSearch(search)}
//                         style={styles.removeButton}
//                     >
//                         {/* <X width={14} height={14} color={isDarkMode ? '#888' : '#666'} /> */}
//                     </TouchableOpacity>
//                 </TouchableOpacity>
//             ))}
//         </View>
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
//         recentContainer: {
//             padding: 16,
//         },
//         sectionTitle: {
//             fontSize: 17,
//             fontWeight: '600',
//             marginBottom: 12,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold
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
//         },
//         removeButton: {
//             padding: 4,
//         },
//         gridContainer: {
//             flex: 1,
//             paddingHorizontal: 8,
//             marginBottom: 100
//         },
//         // New card styles matching WatchCrunch design
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
//             height: '23%',
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
//     });

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

// {
//     loading? <SearchShimmerLoader />:

//     (
//        <>
//            {/* Search Bar */}
//             <View style={styles.searchContainer}>
//                 <Search
//                     style={styles.searchIcon}
//                     width={20}
//                     height={20}
//                     color={isDarkMode ? '#888' : '#666'}
//                 />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search users..."
//                     placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                     value={searchQuery}
//                     onChangeText={handleSearchChange}
//                     onFocus={() => setSearchFocused(true)}
//                     onBlur={() => setSearchFocused(false)}
//                     onSubmitEditing={handleSearchSubmit}
//                     returnKeyType="search"
//                 />
//                 {searchQuery.length > 0 && (
//                     <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
//                         {/* <X width={16} height={16} color={isDarkMode ? '#888' : '#666'} /> */}
//                     </TouchableOpacity>
//                 )}
//                 {/* <TouchableOpacity style={{ marginLeft: 8 }}>
//                     <Mic width={20} height={20} color={isDarkMode ? '#888' : '#666'} />
//                 </TouchableOpacity> */}
//             </View>

//             {/* Content */}
//             {searchQuery.trim() === '' ? (
//                 <ScrollView style={{ flex: 1 }}>
//                     {/* {renderRecentSearches()} */}
//                     <View style={styles.gridContainer}>
//                         <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000', paddingHorizontal: 8, marginTop: 8 }]}>
//                             Discover People
//                         </Text>
//                         <FlatList
//                             data={allShops}
//                             keyExtractor={item => item._id}
//                             numColumns={2}
//                             showsVerticalScrollIndicator={false}
//                             scrollEnabled={false}
//                             renderItem={renderUserCard}
//                             contentContainerStyle={{ paddingTop: 8 }}
//                         />
//                     </View>
//                 </ScrollView>
//             ) : (
//                 <View style={styles.gridContainer}>
//                     {isSearching ? (
//                         <View style={styles.loadingContainer}>
//                             <Text style={styles.loadingText}>Searching...</Text>
//                         </View>
//                     ) : filteredShops.length > 0 ? (
//                         <FlatList
//                             data={filteredShops}
//                             keyExtractor={item => item._id}
//                             numColumns={2}
//                             showsVerticalScrollIndicator={false}
//                             renderItem={renderUserCard}
//                             contentContainerStyle={{ paddingTop: 8 }}
//                         />
//                     ) : (
//                         <View style={styles.noResults}>
//                             <Text style={styles.noResultsText}>
//                                 No results found for "{searchQuery}"
//                             </Text>
//                         </View>
//                     )}
//                 </View>
//             )}
//        </> 
//     )
// }
        
//         </View>
//     );
// };

// export default SearchScreen;


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
// import { LocationIcon, LocationNewTheme, Mic, Search,  } from '../../assets/SVGs';
// import { useSelector } from 'react-redux';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';
// import { App_Primary_color } from '../../common/Colors/colors';

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
//     const [searchRadius, setSearchRadius] = useState(5); // Default 5km
//     const [showRadiusModal, setShowRadiusModal] = useState(false);
//     const [locationPermission, setLocationPermission] = useState(false);
    
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
//         // Simulate location permission and dummy nearby users
//         setTimeout(() => {
//             setLocationPermission(true);
//             setUserLocation({ latitude: 23.2599, longitude: 77.4126 }); // Bhopal coordinates
//             generateDummyNearbyUsers();
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

//     const generateDummyNearbyUsers = () => {
//         // Dummy nearby users data
//         const dummyUsers = [
//             { _id: '1', UserName: 'Agemo_3511', Image: 'https://picsum.photos/100/100?random=1', location: 'Bhopal', distance: 2.3 },
//             { _id: '2', UserName: 'bjornffm', Image: 'https://picsum.photos/100/100?random=2', location: 'Bhopal', distance: 3.1 },
//             { _id: '3', UserName: 'ChBaGer', Image: 'https://picsum.photos/100/100?random=3', location: 'Bhopal', distance: 4.2 },
//             { _id: '4', UserName: 'davekovsky', Image: 'https://picsum.photos/100/100?random=4', location: 'Bhopal', distance: 1.8 },
//             { _id: '5', UserName: 'DoAndr', Image: 'https://picsum.photos/100/100?random=5', location: 'Bhopal', distance: 2.9 },
//             { _id: '6', UserName: 'rahul_mp', Image: 'https://picsum.photos/100/100?random=6', location: 'Bhopal', distance: 3.7 },
//             { _id: '7', UserName: 'priya_b', Image: 'https://picsum.photos/100/100?random=7', location: 'Bhopal', distance: 4.5 },
//             { _id: '8', UserName: 'amit_123', Image: 'https://picsum.photos/100/100?random=8', location: 'Bhopal', distance: 1.2 },
//         ];
//         setNearbyUsers(dummyUsers);
//     };

//     // Dummy function - replace with actual location permission request
//     const requestLocationPermission = async () => {
//         // Simulate permission granted
//         setLocationPermission(true);
//         setUserLocation({ latitude: 23.2599, longitude: 77.4126 }); // Bhopal coordinates
//         generateDummyNearbyUsers();
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
//         // Dummy function - already have nearby users from generateDummyNearbyUsers
//         // Filter based on radius if needed
//         const filtered = nearbyUsers.filter(user => user.distance <= searchRadius);
//         setNearbyUsers(filtered);
//     };

//     const calculateDistance = (lat1, lon1, lat2, lon2) => {
//         const R = 6371; // Radius of the Earth in kilometers
//         const dLat = (lat2 - lat1) * Math.PI / 180;
//         const dLon = (lon2 - lon1) * Math.PI / 180;
//         const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
//                   Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//                   Math.sin(dLon/2) * Math.sin(dLon/2);
//         const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//         return R * c;
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
//         navigation.navigate('Tab',{screen:'MarketPlace'});
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
//                         {item.distance.toFixed(1)} km away
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
//             <Image
//                 source={{ uri: item.Image || 'https://picsum.photos/100/100' }}
//                 style={styles.nearbyUserImage}
//             />
//             <Text style={[styles.nearbyUserName, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                 {item.UserName || 'Unknown'}
//             </Text>
//             <View style={styles.locationBadge}>
//                 <LocationIcon width={10} height={10} color="#fff" />
//                 <Text style={styles.locationText}>
//                     {item.location || 'Nearby'}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );

//     const renderBrowseCategory = ({ item, index }) => (
//         <TouchableOpacity
//             style={[styles.categoryContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}
//             onPress={() => handleCategoryPress(item)}
//         >
//             <View style={styles.categoryImageContainer}>
//                 <Text style={styles.categoryEmoji}>{item.icon}</Text>
//             </View>
//             <View style={styles.categoryOverlay} />
//             <Text style={styles.categoryTitle}>{item.title}</Text>
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
                    
//                     {[1, 3, 5, 10, 25, 50].map(radius => (
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
//                                 {radius} km
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
//             backgroundColor:!isDarkMode?'gray': '#252525',
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
//                         <Search
//                             style={styles.searchIcon}
//                             width={20}
//                             height={20}
//                             color={isDarkMode ? '#888' : '#666'}
//                         />
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
//                             {locationPermission && nearbyUsers.length > 0 && (
//                                 <View style={styles.headerSection}>
//                                     <View style={styles.sectionHeader}>
//                                         <Text style={styles.sectionTitle}>People near you</Text>
//                                         <TouchableOpacity
//                                             style={styles.radiusButton}
//                                             onPress={() => setShowRadiusModal(true)}
//                                         >
//                                             {/* <Settings width={12} height={12} color={isDarkMode ? '#fff' : '#000'} /> */}
//                                             <Text style={styles.radiusButtonText}>{searchRadius}km</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                     <FlatList
//                                         data={nearbyUsers}
//                                         horizontal
//                                         showsHorizontalScrollIndicator={false}
//                                         keyExtractor={item => `nearby-${item._id}`}
//                                         renderItem={renderNearbyUser}
//                                         contentContainerStyle={styles.nearbyContainer}
//                                     />
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

import React, { useEffect, useState } from 'react';
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
    Alert,
    Dimensions 
} from 'react-native';
import { LocationIcon, LocationNewTheme, Mic, Search,  } from '../../assets/SVGs';
import { useSelector } from 'react-redux';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { FONTS_FAMILY } from '../../assets/Fonts';
import SearchShimmerLoader from '../../components/Skeletons/SearchShimmer';
import { App_Primary_color } from '../../common/Colors/colors';

const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader();
    
    // Existing states
    const [allShops, setAllShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState(['john', 'sarah', 'mike']);
    const [isSearching, setIsSearching] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // New location-based states
    const [nearbyUsers, setNearbyUsers] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [searchRadius, setSearchRadius] = useState(10000); // Default 10km (in meters for API)
    const [showRadiusModal, setShowRadiusModal] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const [nearbyLoading, setNearbyLoading] = useState(false);
    
    // Browse categories
    const browseCategories = [
        // { id: 'meetups', title: 'Meetups', icon: '👥' },
        // { id: 'people', title: 'People', icon: '👤' },
        { id: 'marketplace', title: 'Marketplace', icon: '🛒' },
        // { id: 'collections', title: 'Collections', icon: '📚' },
        // { id: 'reviews', title: 'Reviews', icon: '⭐' },
        // { id: 'timegrapher', title: 'Timegrapher', icon: '⏱️' },
        // { id: 'news', title: 'News', icon: '📰' },
        // { id: 'nwa', title: 'NWA', icon: '🔧' },
    ];

    useEffect(() => {
        fetchData();
        // Simulate location permission
        setTimeout(() => {
            setLocationPermission(true);
            setUserLocation({ latitude: 23.2599, longitude: 77.4126 }); // Bhopal coordinates
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

    // Dummy function - replace with actual location permission request
    const requestLocationPermission = async () => {
        // Simulate permission granted
        setLocationPermission(true);
        setUserLocation({ latitude: 23.2599, longitude: 77.4126 }); // Bhopal coordinates
    };

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
                // console.log('Nearest',JSON.stringify(nearbyUsers) );
                
            } else {
                setNearbyUsers([]);
            }
        } catch (error) {
            console.error('Error fetching nearby users:', error);
            setNearbyUsers([]);
        }
        setNearbyLoading(false);
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
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

    const handleCategoryPress = (category) => {
        navigation.navigate('Tab',{screen:'MarketPlace'});
    };

    // Convert meters to km for display
    const formatDistance = (distanceInMeters) => {
        if (distanceInMeters < 1000) {
            return `${Math.round(distanceInMeters)}m`;
        }
        return `${(distanceInMeters / 1000).toFixed(1)}km`;
    };

    const renderUserCard = ({ item, index }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
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
    );

    const renderNearbyUser = ({ item, index }) => (
        <TouchableOpacity
            style={styles.nearbyUserContainer}
            onPress={() => navigation.navigate('OtherUserDetail', { userId: item?._id })}
        >
            {/* {console.log('+++++++++++++++++++++', item)
            } */}
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
                    {item?.Location?.City? item?.Location?.City :formatDistance(item.distance || 0)}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderBrowseCategory = ({ item, index }) => (
        <TouchableOpacity
            style={[styles.categoryContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}
            onPress={() => handleCategoryPress(item)}
        >
            <View style={styles.categoryImageContainer}>
                <Text style={styles.categoryEmoji}>{item.icon}</Text>
            </View>
            <View style={styles.categoryOverlay} />
            <Text style={styles.categoryTitle}>{item.title}</Text>
        </TouchableOpacity>
    );

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
                                {radius >= 1000 ? `${radius/1000} km` : `${radius}m`}
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
            backgroundColor:!isDarkMode?'gray': '#252525',
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
            width: (width - 48) / 2,
            height: 120,
            borderRadius: 12,
            marginBottom: 12,
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
        categoryOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '30%',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        categoryTitle: {
            position: 'absolute',
            bottom: 12,
            left: 12,
            color: isDarkMode ? '#fff' : '#000',
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
            flex: 1,
            height: 160,
            margin: 4,
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
        // Modal styles
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
        recentContainer: {
            padding: 16,
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
            color: isDarkMode ? '#fff' : '#000',
        },
        removeButton: {
            padding: 4,
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            {loading ? <SearchShimmerLoader /> : (
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

                    {/* Content */}
                    {searchQuery.trim() === '' ? (
                        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                            {/* People near you section */}
                            {locationPermission && (
                                <View style={styles.headerSection}>
                                    <View style={styles.sectionHeader}>
                                        <Text style={styles.sectionTitle}>People near you</Text>
                                        <TouchableOpacity
                                            style={styles.radiusButton}
                                            onPress={() => setShowRadiusModal(true)}
                                        >
                                            <Text style={styles.radiusButtonText}>
                                                {searchRadius >= 1000 ? `${searchRadius/1000}km` : `${searchRadius}m`}
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

                            {/* Browse section */}
                            <View style={styles.browseSection}>
                                <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Browse</Text>
                                <View style={styles.categoriesGrid}>
                                    {browseCategories.map((category, index) => (
                                        <TouchableOpacity
                                            key={category.id}
                                            style={[styles.categoryContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f8f8' }]}
                                            onPress={() => handleCategoryPress(category)}
                                        >
                                            <View style={styles.categoryImageContainer}>
                                                <Text style={styles.categoryEmoji}>{category.icon}</Text>
                                            </View>
                                            <Text style={styles.categoryTitle}>{category.title}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Discover People section */}
                            <View style={styles.gridContainer}>
                                <Text style={[styles.sectionTitle, { paddingHorizontal: 8, marginTop: 8, marginBottom: 16 }]}>
                                    Discover People
                                </Text>
                                <FlatList
                                    data={allShops}
                                    keyExtractor={item => item._id}
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
                                    keyExtractor={item => item._id}
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

                    {/* Radius Selection Modal */}
                    <RadiusModal />
                </>
            )}
        </View>
    );
};

export default SearchScreen;