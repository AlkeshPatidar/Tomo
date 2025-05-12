import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';

import { useSelector } from 'react-redux';
import { AddShopBtn, BackBlackSimple, BackIcon, BackOuterWhite, BellIcon, CameraButton, LocationIcon, Mic, NotiFication, Search } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import { nanoid } from '@reduxjs/toolkit';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';





const AllProductsOfAShops = ({ navigation, route }) => {

    const [allProducts, setAllProducts] = useState([])
    const { showLoader, hideLoader } = useLoader()
    const isFocused = useIsFocused()

    useEffect(() => {
        fetchData()
    }, [isFocused])



    const fetchData = async () => {
        showLoader()
        const res = await apiGet(`${urls.getAllProductsOfAShop}/${route?.params?.shopId}`)
        console.log("------------Notifications-----", res.data);
        setAllProducts(res?.data)
        hideLoader()

    }

    const { isDarkMode } = useSelector(state => state.theme);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor: '#fff',
            backgroundColor: isDarkMode ? 'black' : '#fff',

        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
            borderRadius: 30,
            margin: 10,
            padding: 4,
            marginTop: 10,
            paddingHorizontal: 15
        },
        icon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
        },
        imageWrapper: {
            flex: 1,
            margin: 1,
        },
        largeItem: {
            flex: 2,
        },
        image: {
            width: '100%',
            height: 120,
            resizeMode: 'cover',
        },
        cardContainer: {
            backgroundColor: isDarkMode ? '#252525' : '#fff',
            borderRadius: 10,
            margin: 8,
            flex: 1,
            // elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            borderWidth: 1,
            padding: 7,
            borderColor: isDarkMode ? 'gray' : '#E4E4E4'
        },
        followButton: {
            paddingVertical: 15,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginHorizontal:20
        },
        followText: {
            fontSize: 16,
            fontWeight: '600',
            fontFamily:FONTS_FAMILY.SourceSans3_Bold
        },

    });

    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Products</CustomText>

                <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                    <BellIcon />
                </TouchableOpacity>

            </SpaceBetweenRow>
        )
    }

    return (
        <View style={styles.container}>
            {/* Search Bar */}

            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            {renderHeader()}
            <View style={styles.searchContainer}>
                <Search />
                <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#A0A0A0" />
                <TouchableOpacity>
                    <Mic />
                </TouchableOpacity>
            </View>

            {/* Grid View */}
            <FlatList
                style={{}}
                data={allProducts}
                keyExtractor={(item) => item?._id.toString()}
                numColumns={2}

                contentContainerStyle={{ paddingHorizontal: 10 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardContainer}
                        onPress={() => navigation.navigate('ProductDetail')}
                    >
                        {console.log('+++++++++++++++++>', item)
                        }
                        <Image
                            source={item?.Image ? { uri: item?.Image } : IMG.PostImage}
                            style={{
                                height: 100,
                                width: '100%',
                                borderRadius: 10
                            }}
                            resizeMode="cover"
                        />
                        <View style={{ marginTop: 6 }}>
                            <CustomText style={{
                                fontSize: 16,
                                fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                                marginBottom: 5,
                            }}>
                                {item?.ProductName}
                            </CustomText>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <LocationIcon />
                                <CustomText style={{ fontSize: 10, color: isDarkMode ? 'white' : '#7d7d7d', flex: 1 }}>
                                    {item?.ProductDetails}
                                </CustomText>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* <TouchableOpacity onPress={()=>navigation?.navigate('CreateProducts',{shopId:route?.params?.shopId})}>
                <AddShopBtn/>
            </TouchableOpacity> */}
            <TouchableOpacity
                onPress={() => navigation?.navigate('CreateProducts', { shopId: route?.params?.shopId })}            >
                <LinearGradient
                    colors={['#ff00ff', '#6a5acd']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.followButton}
                >
                    <Text style={[
                        styles.followText,
                        { color: isDarkMode ? '#fff' : '#000' }

                    ]}>
                        {'Create Product'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={{ height: 100 }} />

        </View>
    );
};



export default AllProductsOfAShops;
