// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

// import { useSelector } from 'react-redux';
// import { AddShopBtn, BackBlackSimple, BackIcon, BackOuterWhite, BellIcon, CameraButton, LocationIcon, Mic, NotiFication, Search } from '../../assets/SVGs';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import CustomText from '../../components/TextComponent';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import IMG from '../../assets/Images';
// import { nanoid } from '@reduxjs/toolkit';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { useIsFocused } from '@react-navigation/native';
// import useKeyboardStatus from '../../utils/KeyBoardHook';
// import ShopsShimmerLoader from '../../components/Skeletons/ShopsShimmer';
// import GradientIcon from '../../components/GradientIcon';
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';

// const Shops = ({ navigation }) => {

//     const [allShops, setAllShops] = useState([])
//     const [filteredShops, setFilteredShops] = useState([])
//     const [searchQuery, setSearchQuery] = useState('')
//     const { showLoader, hideLoader } = useLoader()
//     const isFocused = useIsFocused()

//     const [loading, setLoading] = useState(false)
//     const { isKeyboardOpen, keyboardHeight } = useKeyboardStatus()


//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length != 0) {
//         selector = JSON.parse(selector);
//     }

//     useEffect(() => {
//         fetchData()
//     }, [])

//     // Real-time search filter
//     useEffect(() => {
//         if (searchQuery.trim() === '') {
//             setFilteredShops(allShops)
//         } else {
//             const filtered = allShops.filter(shop => {
//                 const shopName = shop?.Name?.toLowerCase() || ''
//                 const shopAddress = shop?.Address?.[0]?.LocationName?.toLowerCase() || ''
//                 const query = searchQuery.toLowerCase()

//                 return shopName.includes(query) || shopAddress.includes(query)
//             })
//             setFilteredShops(filtered)
//         }
//     }, [searchQuery, allShops])

//     const fetchData = async () => {
//         setLoading(true)
//         const res = await apiGet(urls.getAllShops)
//         // console.log("------------Notifications-----", res.data);
//         setAllShops(res?.data)
//         setFilteredShops(res?.data) // Initialize filtered shops
//         setLoading(false)
//     }

//     const handleSearch = (text) => {
//         setSearchQuery(text)
//     }

//     const { isDarkMode } = useSelector(state => state.theme);

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             // backgroundColor: '#fff',
//             backgroundColor: isDarkMode ? 'black' : '#fff',

//         },
//         searchContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
//             borderRadius: 30,
//             margin: 10,
//             padding: 4,
//             marginTop: 10,
//             paddingHorizontal: 15,
//             gap: 10
//         },
//         icon: {
//             marginRight: 10,
//         },
//         searchInput: {
//             flex: 1,
//             fontSize: 16,
//             color: isDarkMode ? 'white' : 'black',
//         },
//         imageWrapper: {
//             flex: 1,
//             margin: 1,
//         },
//         largeItem: {
//             flex: 2,
//         },
//         image: {
//             width: '100%',
//             height: 120,
//             resizeMode: 'cover',
//         },
//         cardContainer: {
//             backgroundColor: isDarkMode ? '#252525' : '#fff',
//             borderRadius: 10,
//             margin: 3,
//             flex: 1,
//             // elevation: 3,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             // borderWidth: 1,
//             padding: 7,
//             borderColor: isDarkMode ? 'gray' : '#E4E4E4'
//         }
//     });

//     const renderHeader = () => {
//         return (
//             <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
//                 </TouchableOpacity>
//                 <CustomText style={{
//                     fontSize: 20,
//                     fontFamily: FONTS_FAMILY.SourceSans3_Bold
//                 }}>Market Place</CustomText>

//                 <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
//                     {/* <BellIcon /> */}
//                     <GradientIcon
//                         // colors={['#4F52FE', '#FC14CB']}
//                         colors={['#21B7FF', '#0084F8']}
//                         size={20}
//                         iconType='FontAwesome5'
//                         name={'bell'}
//                     />
//                 </TouchableOpacity>

//             </SpaceBetweenRow>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             {/* Search Bar */}

//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
//             {renderHeader()}
//             {
//                 loading ? <ShopsShimmerLoader isDarkMode={isDarkMode} shopCount={8} /> :
//                     <>

//                         (


//                         <View style={styles.searchContainer}>
//                             {/* <Search /> */}
//                             <GradientIcon
//                                 // colors={['#4F52FE', '#FC14CB']}
//                                 colors={['#21B7FF', '#0084F8']}
//                                 size={18}
//                                 iconType='FontAwesome5'
//                                 name={'search'}
//                             />
//                             <TextInput
//                                 style={styles.searchInput}
//                                 placeholder="Search shops..."
//                                 placeholderTextColor="#A0A0A0"
//                                 value={searchQuery}
//                                 onChangeText={handleSearch}
//                             />
//                             {/* <TouchableOpacity>
//                     <Mic />
//                 </TouchableOpacity> */}
//                         </View>

//                         {/* Grid View */}
//                         <FlatList
//                             style={{}}
//                             data={filteredShops}
//                             keyExtractor={(item) => item?._id.toString()}
//                             numColumns={2}

//                             contentContainerStyle={{ paddingHorizontal: 10 }}
//                             showsVerticalScrollIndicator={false}
//                             renderItem={({ item }) => (
//                                 <GlowWrapper
//                                     isDarkMode={isDarkMode}
//                                     borderRadius={10}
//                                     showStars={true}
//                                     starCount={12}
//                                     showShinePatches={true}
//                                     intensity="medium"
//                                     containerStyle={{

//                                         borderRadius: 10,
//                                         margin: 10,
//                                         flex: 1,

//                                     }}
//                                 >
//                                     <TouchableOpacity style={styles.cardContainer}
//                                         onPress={() => navigation.navigate('AllProductsOfAShops', { shopId: item?._id })}
//                                     >

//                                         <Image
//                                             source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
//                                             style={{
//                                                 height: 100,
//                                                 width: '100%',
//                                                 borderRadius: 10
//                                             }}
//                                             resizeMode="cover"
//                                         />
//                                         <View style={{ marginTop: 6 }}>
//                                             <CustomText style={{
//                                                 fontSize: 16,
//                                                 fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//                                                 marginBottom: 5,
//                                             }}>
//                                                 {item?.Name}
//                                             </CustomText>
//                                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//                                                 {/* <LocationIcon /> */}
//                                                 <GradientIcon
//                                                     // colors={['#4F52FE', '#FC14CB']}
//                                                     colors={['#21B7FF', '#0084F8']}
//                                                     size={16}
//                                                     iconType='FontAwesome6'
//                                                     name={'location-dot'}
//                                                 />
//                                                 <CustomText style={{ fontSize: 10, color: isDarkMode ? 'white' : '#7d7d7d', flex: 1 }}>
//                                                     {item?.Address[0]?.LocationName}
//                                                 </CustomText>
//                                             </View>
//                                         </View>
//                                     </TouchableOpacity>
//                                 </GlowWrapper>
//                             )}
//                         />

//                         {
//                             selector?.
//                                 SellerStatus == 'Approved' &&
//                             <TouchableOpacity onPress={() => navigation?.navigate('AddShops')}>
//                                 <AddShopBtn />
//                             </TouchableOpacity>}

//                         {!isKeyboardOpen && <View style={{ height: 100 }} />}
//                         )
//                     </>

//             }


//         </View>
//     );
// };



// export default Shops;

// import React, { useEffect, useState, useCallback } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar , Text} from 'react-native';
// import { useSelector } from 'react-redux';
// import { AddShopBtn, BackBlackSimple, BackIcon } from '../../assets/SVGs';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import CustomText from '../../components/TextComponent';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import IMG from '../../assets/Images';
// import useLoader from '../../utils/LoaderHook';
// import { apiGet } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { useIsFocused } from '@react-navigation/native';
// import useKeyboardStatus from '../../utils/KeyBoardHook';
// import ShopsShimmerLoader from '../../components/Skeletons/ShopsShimmer';
// import GradientIcon from '../../components/GradientIcon';
// import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
// import LinearGradient from 'react-native-linear-gradient';

// // Separate component for shop card to optimize rendering
// const ShopCard = React.memo(({ item, isDarkMode, onPress }) => {
//     return (
//         <GlowWrapper
//             isDarkMode={isDarkMode}
//             borderRadius={10}
//             showStars={true}
//             starCount={100}
//             showShinePatches={false}
//             intensity="low"
//             containerStyle={{
//                 flex: 1,
//                 margin: 5,
//             }}
//         >
//             <TouchableOpacity
//                 style={[
//                     styles.cardContainer,
//                     { backgroundColor: isDarkMode ? '#252525' : '#fff' }
//                 ]}
//                 onPress={onPress}
//                 activeOpacity={0.8}
//             >
//                 <Image
//                     source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
//                     style={styles.shopImage}
//                     resizeMode="cover"
//                 />
//                 <View style={styles.shopInfo}>
//                     <CustomText style={styles.shopName} numberOfLines={1}>
//                         {item?.Name}
//                     </CustomText>
//                     <View style={styles.locationRow}>
//                         <GradientIcon
//                             colors={['#21B7FF', '#0084F8']}
//                             size={14}
//                             iconType='FontAwesome6'
//                             name={'location-dot'}
//                         />
//                         <CustomText
//                             style={[
//                                 styles.locationText,
//                                 { color: isDarkMode ? 'white' : '#7d7d7d' }
//                             ]}
//                             numberOfLines={1}
//                         >
//                             {item?.Address[0]?.LocationName}
//                         </CustomText>
//                     </View>
//                 </View>
//             </TouchableOpacity>
//         </GlowWrapper>
//     );
// });

// const Shops = ({ navigation }) => {
//     const [allShops, setAllShops] = useState([]);
//     const [filteredShops, setFilteredShops] = useState([]);
//     const [searchQuery, setSearchQuery] = useState('');
//     const { showLoader, hideLoader } = useLoader();
//     const isFocused = useIsFocused();
//     const [loading, setLoading] = useState(false);
//     const { isKeyboardOpen } = useKeyboardStatus();
//     const { isDarkMode } = useSelector(state => state.theme);

//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length !== 0) {
//         selector = JSON.parse(selector);
//     }

//     useEffect(() => {
//         if (isFocused) {
//             fetchData();
//         }
//     }, [isFocused]);

//     // Real-time search filter
//     useEffect(() => {
//         if (searchQuery.trim() === '') {
//             setFilteredShops(allShops);
//         } else {
//             const filtered = allShops.filter(shop => {
//                 const shopName = shop?.Name?.toLowerCase() || '';
//                 const shopAddress = shop?.Address?.[0]?.LocationName?.toLowerCase() || '';
//                 const query = searchQuery.toLowerCase();

//                 return shopName.includes(query) || shopAddress.includes(query);
//             });
//             setFilteredShops(filtered);
//         }
//     }, [searchQuery, allShops]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const res = await apiGet(urls.getAllShops);
//             setAllShops(res?.data || []);
//             setFilteredShops(res?.data || []);
//         } catch (error) {
//             console.error('Error fetching shops:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSearch = useCallback((text) => {
//         setSearchQuery(text);
//     }, []);

//     const handleShopPress = useCallback((shopId) => {
//         navigation.navigate('AllProductsOfAShops', { shopId });
//     }, [navigation]);

//     const renderHeader = () => {
//         return (
//             <SpaceBetweenRow
//                 style={[
//                     styles.header,
//                     { backgroundColor: isDarkMode ? '#252525' : 'white' }
//                 ]}
//             >
//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
//                 </TouchableOpacity>
//                 <CustomText style={styles.headerTitle}>
//                     Market Place
//                 </CustomText>
//                 <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
//                     <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={20}
//                         iconType='FontAwesome5'
//                         name={'bell'}
//                     />
//                 </TouchableOpacity>
//             </SpaceBetweenRow>
//         );
//     };

//     const renderItem = useCallback(({ item }) => (
//         <ShopCard
//             item={item}
//             isDarkMode={isDarkMode}
//             onPress={() => handleShopPress(item?._id)}
//         />
//     ), [isDarkMode, handleShopPress]);

//     const keyExtractor = useCallback((item) => item?._id, []);

//     const getItemLayout = useCallback((data, index) => ({
//         length: 180,
//         offset: 180 * Math.floor(index / 2),
//         index,
//     }), []);

//     return (
//         <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : '#fff' }]}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
//             {renderHeader()}

//             {loading ? (
//                 <ShopsShimmerLoader isDarkMode={isDarkMode} shopCount={8} />
//             ) : (
//                 <>

//                     <View style={[
//                         styles.searchContainer,
//                         { backgroundColor: isDarkMode ? '#252525' : '#F0F0F0' }
//                     ]}>
//                         <GradientIcon
//                             colors={['#21B7FF', '#0084F8']}
//                             size={18}
//                             iconType='FontAwesome5'
//                             name={'search'}
//                         />
//                         <TextInput
//                             style={[
//                                 styles.searchInput,
//                                 { color: isDarkMode ? 'white' : 'black' }
//                             ]}
//                             placeholder="Search shops..."
//                             placeholderTextColor="#A0A0A0"
//                             value={searchQuery}
//                             onChangeText={handleSearch}
//                         />
//                     </View>

//                     <FlatList
//                         data={filteredShops}
//                         keyExtractor={keyExtractor}
//                         renderItem={renderItem}
//                         numColumns={2}
//                         contentContainerStyle={styles.listContent}
//                         showsVerticalScrollIndicator={false}
//                         // removeClippedSubviews={true}
//                         maxToRenderPerBatch={10}
//                         windowSize={5}
//                         initialNumToRender={6}
//                         // getItemLayout={getItemLayout}
//                     />

//                     {selector?.SellerStatus === 'Approved' && (
//                         // <TouchableOpacity onPress={() => navigation?.navigate('AddShops')}>
//                         //     <AddShopBtn />
//                         // </TouchableOpacity>
//                         <TouchableOpacity
//                             onPress={() => navigation?.navigate('AddShops')}
//                         >
//                             <LinearGradient
//                                 // colors={['#ff00ff', '#6a5acd']}
//                                 colors={['#21B7FF', '#0084F8']}
//                                 start={{ x: 1, y: 0 }}
//                                 end={{ x: 1, y: 1 }}
//                                 style={styles.followButton}
//                             >
//                                 <Text style={[
//                                     styles.followText,
//                                     { color: '#fff' }
//                                 ]}>
//                                     Add shop
//                                 </Text>
//                             </LinearGradient>
//                         </TouchableOpacity>
//                     )}

//                     {!isKeyboardOpen && <View style={{ height: 100 }} />}
//                 </>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     header: {
//         paddingTop: 50,
//         paddingHorizontal: 20,
//         paddingBottom: 15,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderRadius: 30,
//         margin: 10,
//         padding: 4,
//         marginTop: 10,
//         paddingHorizontal: 15,
//         gap: 10,
//     },
//     searchInput: {
//         flex: 1,
//         fontSize: 16,
//     },
//     listContent: {
//         paddingHorizontal: 5,
//         paddingBottom: 20,
//     },
//     cardContainer: {
//         borderRadius: 10,
//         padding: 7,
//     },
//     shopImage: {
//         height: 100,
//         width: '100%',
//         borderRadius: 10,
//     },
//     shopInfo: {
//         marginTop: 6,
//     },
//     shopName: {
//         fontSize: 16,
//         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         marginBottom: 5,
//     },
//     locationRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 5,
//     },
//     locationText: {
//         fontSize: 10,
//         flex: 1,
//     },
//     followButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 16,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginHorizontal:30
//     },
//     followText: {
//         fontSize: 16,
//         fontWeight: '600',
//         fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     },
// });

// // export default ;
// export default React.memo(Shops);


import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { AddShopBtn, BackBlackSimple, BackIcon } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { useIsFocused } from '@react-navigation/native';
import useKeyboardStatus from '../../utils/KeyBoardHook';
import ShopsShimmerLoader from '../../components/Skeletons/ShopsShimmer';
import GradientIcon from '../../components/GradientIcon';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import LinearGradient from 'react-native-linear-gradient';

// EXACT COPY OF YOUR SEARCHSCREEN PATTERN
const ShopCard = React.memo(({ item, isDarkMode, onPress }) => {
    if (!item || !item._id) return null;

    return (
        <GlowWrapper
            isDarkMode={isDarkMode}
            borderRadius={10}
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
                style={[
                    styles.cardContainer,
                    { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }
                ]}
                activeOpacity={0.8}
                onPress={onPress}
            >
                <Image
                    source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
                    style={styles.shopImage}
                    resizeMode="cover"
                />
                <View style={styles.overlay} />
                <View style={styles.textContainer}>
                    <Text style={styles.shopName} numberOfLines={1}>
                        {item?.Name}
                    </Text>
                    <View style={styles.locationRow}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={12}
                            iconType='FontAwesome6'
                            name={'location-dot'}
                        />
                        <Text style={styles.locationText} numberOfLines={1}>
                            {item?.Address?.[0]?.LocationName || 'No location'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </GlowWrapper>
    );
});

ShopCard.displayName = 'ShopCard';

const Shops = ({ navigation }) => {
    const [allShops, setAllShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { showLoader, hideLoader } = useLoader();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const { isKeyboardOpen } = useKeyboardStatus();
    const { isDarkMode } = useSelector(state => state.theme);

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length !== 0) {
        selector = JSON.parse(selector);
    }

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredShops(allShops);
        } else {
            const filtered = allShops.filter(shop => {
                const shopName = shop?.Name?.toLowerCase() || '';
                const shopAddress = shop?.Address?.[0]?.LocationName?.toLowerCase() || '';
                const query = searchQuery.toLowerCase();
                return shopName.includes(query) || shopAddress.includes(query);
            });
            setFilteredShops(filtered);
        }
    }, [searchQuery, allShops]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await apiGet(urls.getAllShops);
            setAllShops(res?.data || []);
            setFilteredShops(res?.data || []);
        } catch (error) {
            console.error('Error fetching shops:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback((text) => {
        setSearchQuery(text);
    }, []);

    const handleShopPress = useCallback((shopId) => {
        navigation.navigate('AllProductsOfAShops', { shopId });
    }, [navigation]);

    const renderHeader = () => {
        return (
            <SpaceBetweenRow
                style={[
                    styles.header,
                    { backgroundColor: isDarkMode ? '#252525' : 'white' }
                ]}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
                </TouchableOpacity>
                <CustomText style={styles.headerTitle}>
                    Market Place
                </CustomText>
                <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                    <GradientIcon
                        colors={['#21B7FF', '#0084F8']}
                        size={20}
                        iconType='FontAwesome5'
                        name={'bell'}
                    />
                </TouchableOpacity>
            </SpaceBetweenRow>
        );
    };

    const renderItem = useCallback(({ item }) => (
        <ShopCard
            item={item}
            isDarkMode={isDarkMode}
            onPress={() => handleShopPress(item?._id)}
        />
    ), [isDarkMode, handleShopPress]);

    const keyExtractor = useCallback((item, index) => {
        return item?._id?.toString() || `item-${index}`;
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? 'black' : '#fff' }]}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            {renderHeader()}

            {loading ? (
                <ShopsShimmerLoader isDarkMode={isDarkMode} shopCount={8} />
            ) : (
                <>
                    <View style={[
                        styles.searchContainer,
                        { backgroundColor: isDarkMode ? '#252525' : '#F0F0F0' }
                    ]}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={18}
                            iconType='FontAwesome5'
                            name={'search'}
                        />
                        <TextInput
                            style={[
                                styles.searchInput,
                                { color: isDarkMode ? 'white' : 'black' }
                            ]}
                            placeholder="Search shops..."
                            placeholderTextColor="#A0A0A0"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>

                    <FlatList
                        data={filteredShops}
                        keyExtractor={keyExtractor}
                        renderItem={renderItem}
                        numColumns={2}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                    {selector?.SellerStatus === 'Approved' && (
                        <TouchableOpacity
                            onPress={() => navigation?.navigate('AddShops')}
                            style={styles.addShopButtonContainer}
                        >
                            <LinearGradient
                                colors={['#21B7FF', '#0084F8']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.followButton}
                            >
                                <Text style={styles.followText}>
                                    Add shop
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )}

                    {!isKeyboardOpen && <View style={{ height: 100 }} />}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        margin: 10,
        padding: 4,
        marginTop: 10,
        paddingHorizontal: 15,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    listContent: {
        paddingHorizontal: 8,
        paddingBottom: 20,
    },
    cardContainer: {
        height: 160,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    shopImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    textContainer: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
    },
    shopName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    locationText: {
        fontSize: 11,
        color: '#ccc',
        flex: 1,
    },
    addShopButtonContainer: {
        paddingHorizontal: 30,
        paddingBottom: 10,
    },
    followButton: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    followText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        color: '#fff',
    },
});

export default React.memo(Shops);