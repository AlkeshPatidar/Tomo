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

import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
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

// Separate component for shop card to optimize rendering
const ShopCard = React.memo(({ item, isDarkMode, onPress }) => {
    return (
        <GlowWrapper
            isDarkMode={isDarkMode}
            borderRadius={10}
            showStars={true}
            starCount={6}
            showShinePatches={true}
            intensity="low"
            containerStyle={{
                flex: 1,
                margin: 5,
            }}
        >
            <TouchableOpacity
                style={[
                    styles.cardContainer,
                    { backgroundColor: isDarkMode ? '#252525' : '#fff' }
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Image
                    source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
                    style={styles.shopImage}
                    resizeMode="cover"
                />
                <View style={styles.shopInfo}>
                    <CustomText style={styles.shopName} numberOfLines={1}>
                        {item?.Name}
                    </CustomText>
                    <View style={styles.locationRow}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={14}
                            iconType='FontAwesome6'
                            name={'location-dot'}
                        />
                        <CustomText
                            style={[
                                styles.locationText,
                                { color: isDarkMode ? 'white' : '#7d7d7d' }
                            ]}
                            numberOfLines={1}
                        >
                            {item?.Address[0]?.LocationName}
                        </CustomText>
                    </View>
                </View>
            </TouchableOpacity>
        </GlowWrapper>
    );
});

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

    // Real-time search filter
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

    const keyExtractor = useCallback((item) => item?._id?.toString(), []);

    const getItemLayout = useCallback((data, index) => ({
        length: 180,
        offset: 180 * Math.floor(index / 2),
        index,
    }), []);

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
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        initialNumToRender={6}
                        getItemLayout={getItemLayout}
                    />

                    {selector?.SellerStatus === 'Approved' && (
                        <TouchableOpacity onPress={() => navigation?.navigate('AddShops')}>
                            <AddShopBtn />
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
        paddingHorizontal: 5,
        paddingBottom: 20,
    },
    cardContainer: {
        borderRadius: 10,
        padding: 7,
    },
    shopImage: {
        height: 100,
        width: '100%',
        borderRadius: 10,
    },
    shopInfo: {
        marginTop: 6,
    },
    shopName: {
        fontSize: 16,
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        marginBottom: 5,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    locationText: {
        fontSize: 10,
        flex: 1,
    },
});

export default Shops;