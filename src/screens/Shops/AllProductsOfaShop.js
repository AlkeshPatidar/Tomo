// import React, { useEffect, useState } from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';

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
// import LinearGradient from 'react-native-linear-gradient';





// const AllProductsOfAShops = ({ navigation, route }) => {

//     const [allProducts, setAllProducts] = useState([])
//     const { showLoader, hideLoader } = useLoader()
//     const isFocused = useIsFocused()
//        let selector = useSelector(state => state?.user?.userData);
//           if (Object.keys(selector).length != 0) {
//             selector = JSON.parse(selector);
//           }

//     useEffect(() => {
//         fetchData()
//     }, [
//         // isFocused
//     ])



//     const fetchData = async () => {
//         showLoader()
//         const res = await apiGet(`${urls.getAllProductsOfAShop}/${route?.params?.shopId}`)
//         // console.log("------------Notifications-----", res.data);
//         setAllProducts(res?.data)
//         hideLoader()

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
//             paddingHorizontal: 15
//         },
//         icon: {
//             marginRight: 10,
//         },
//         searchInput: {
//             flex: 1,
//             fontSize: 16,
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
//             margin: 8,
//             flex: 1,
//             // elevation: 3,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 3,
//             borderWidth: 1,
//             padding: 7,
//             borderColor: isDarkMode ? 'gray' : '#E4E4E4'
//         },
//         followButton: {
//             paddingVertical: 15,
//             paddingHorizontal: 16,
//             borderRadius: 8,
//             marginHorizontal:20
//         },
//         followText: {
//             fontSize: 16,
//             fontWeight: '600',
//             fontFamily:FONTS_FAMILY.SourceSans3_Bold
//         },

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
//                 }}>Products</CustomText>

//                 <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
//                     <BellIcon />
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
//             <View style={styles.searchContainer}>
//                 <Search />
//                 <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#A0A0A0" />
//             </View>

//             {/* Grid View */}
//             <FlatList
//                 style={{}}
//                 data={allProducts}
//                 keyExtractor={(item) => item?._id.toString()}
//                 numColumns={2}
//                 contentContainerStyle={{ paddingHorizontal: 10 }}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({ item }) => (
//                     <TouchableOpacity style={styles.cardContainer}
//                         onPress={() => navigation.navigate('ProductDetail',{productId:item?._id})}
//                     >
//                         {console.log('+++++++++++++++++>', item)
//                         }
//                         <Image
//                             source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
//                             style={{
//                                 height: 100,
//                                 width: '100%',
//                                 borderRadius: 10
//                             }}
//                             resizeMode="cover"
//                         />
//                         <View style={{ marginTop: 6 }}>
//                             <CustomText style={{
//                                 fontSize: 16,
//                                 fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//                                 marginBottom: 5,
//                             }}>
//                                 {item?.ProductName}
//                             </CustomText>
//                             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
//                                 <LocationIcon />
//                                 <CustomText style={{ fontSize: 10, color: isDarkMode ? 'white' : '#7d7d7d', flex: 1 }}>
//                                     {item?.ProductDetails}
//                                 </CustomText>
//                             </View>
//                         </View>
//                     </TouchableOpacity>
//                 )}
//                 ListEmptyComponent={<CustomText style={{
//                     fontFamily:FONTS_FAMILY.SourceSans3_Medium,
//                     alignSelf:'center',
//                     paddingVertical:20
//                 }}>No Products found!</CustomText>}
//             />

//             {/* <TouchableOpacity onPress={()=>navigation?.navigate('CreateProducts',{shopId:route?.params?.shopId})}>
//                 <AddShopBtn/>
//             </TouchableOpacity> */}
//        {
//            selector?.
//           SellerStatus == 'Approved' && 
//        <TouchableOpacity
//                 onPress={() => navigation?.navigate('CreateProducts', { shopId: route?.params?.shopId })}            >
//                 <LinearGradient
//                     colors={['#ff00ff', '#6a5acd']}
//                     start={{ x: 1, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={styles.followButton}
//                 >
//                     <Text style={[
//                         styles.followText,
//                         { color: isDarkMode ? '#fff' : '#000' }

//                     ]}>
//                         {'Create Product'}
//                     </Text>
//                 </LinearGradient>
//             </TouchableOpacity>}

//             <View style={{ height: 100 }} />

//         </View>
//     );
// };



// export default AllProductsOfAShops;

import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { BackBlackSimple, BackIcon, BellIcon, LocationIcon, Search } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper';
import GradientIcon from '../../components/GradientIcon';

// Separate ProductCard component for optimization


const AllProductsOfAShops = ({ navigation, route }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { showLoader, hideLoader } = useLoader();
    const isFocused = useIsFocused();
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
            setFilteredProducts(allProducts);
        } else {
            const filtered = allProducts.filter(product => {
                const productName = product?.ProductName?.toLowerCase() || '';
                const productDetails = product?.ProductDetails?.toLowerCase() || '';
                const query = searchQuery.toLowerCase();

                return productName.includes(query) || productDetails.includes(query);
            });
            setFilteredProducts(filtered);
        }
    }, [searchQuery, allProducts]);

    const fetchData = async () => {
        showLoader();
        try {
            const res = await apiGet(`${urls.getAllProductsOfAShop}/${route?.params?.shopId}`);
            setAllProducts(res?.data || []);
            setFilteredProducts(res?.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            hideLoader();
        }
    };

    const handleSearch = useCallback((text) => {
        setSearchQuery(text);
    }, []);

    const handleProductPress = useCallback((productId) => {
        navigation.navigate('ProductDetail', { productId });
    }, [navigation]);


    const ProductCard = React.memo(({ item, onPress}) => {
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
                    { 
                        backgroundColor: isDarkMode ? '#252525' : '#fff',
                        borderColor: isDarkMode ? 'gray' : '#E4E4E4'
                    }
                ]}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Image
                    source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
                    style={styles.productImage}
                    resizeMode="cover"
                />
                <View style={styles.productInfo}>
                    <CustomText 
                        style={styles.productName}
                        numberOfLines={1}
                    >
                        {item?.ProductName}
                    </CustomText>
                    <View style={styles.detailsRow}>
                        <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={12}
                            iconType='FontAwesome6'
                            name={'circle-info'}
                        />
                        <CustomText 
                            style={[
                                styles.productDetails,
                                { color: isDarkMode ? 'white' : '#7d7d7d' }
                            ]}
                            numberOfLines={2}
                        >
                            {item?.ProductDetails}
                        </CustomText>
                    </View>
                </View>
            </TouchableOpacity>
        </GlowWrapper>
    );
});
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
                    Products
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
        <ProductCard
            item={item}
            isDarkMode={isDarkMode}
            onPress={() => handleProductPress(item?._id)}
            styles={styles}
            // isDarkMode={isDarkMode}
        />
    ), [isDarkMode, handleProductPress]);

    const keyExtractor = useCallback((item) => item?._id?.toString(), []);

    const getItemLayout = useCallback((data, index) => ({
        length: 180,
        offset: 180 * Math.floor(index / 2),
        index,
    }), []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
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
            backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
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
            color: isDarkMode ? 'white' : 'black',
        },
        listContent: {
            paddingHorizontal: 5,
            paddingBottom: 20,
        },
        cardContainer: {
            borderRadius: 10,
            padding: 7,
            borderWidth: 1,
        },
        productImage: {
            height: 100,
            width: '100%',
            borderRadius: 10,
        },
        productInfo: {
            marginTop: 6,
        },
        productName: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            marginBottom: 5,
        },
        detailsRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 5,
        },
        productDetails: {
            fontSize: 10,
            flex: 1,
        },
        emptyText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            alignSelf: 'center',
            paddingVertical: 20,
        },
        createButtonWrapper: {
            marginHorizontal: 20,
            marginBottom: 10,
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
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            {renderHeader()}

            <View style={styles.searchContainer}>
                <GradientIcon
                    colors={['#21B7FF', '#0084F8']}
                    size={18}
                    iconType='FontAwesome5'
                    name={'search'}
                />
                <TextInput 
                    style={styles.searchInput} 
                    placeholder="Search products..." 
                    placeholderTextColor="#A0A0A0" 
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <FlatList
                data={filteredProducts}
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
                ListEmptyComponent={
                    <CustomText style={styles.emptyText}>
                        No Products found!
                    </CustomText>
                }
            />

            {selector?.SellerStatus === 'Approved' && (
                <View style={styles.createButtonWrapper}>
                    {/* <GlowWrapper
                        isDarkMode={isDarkMode}
                        borderRadius={8}
                        showStars={true}
                        starCount={8}
                        showShinePatches={false}
                        intensity="medium"
                    > */}
                        <TouchableOpacity
                            onPress={() => navigation?.navigate('CreateProducts', { 
                                shopId: route?.params?.shopId 
                            })}
                        >
                            <LinearGradient
                                colors={['#ff00ff', '#6a5acd']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.followButton}
                            >
                                <Text style={[
                                    styles.followText,
                                    { color: '#fff' }
                                ]}>
                                    Create Product
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    {/* </GlowWrapper> */}
                </View>
            )}

            <View style={{ height: 100 }} />
        </View>
    );
};

export default AllProductsOfAShops;
