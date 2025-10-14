import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

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
import useKeyboardStatus from '../../utils/KeyBoardHook';
import ShopsShimmerLoader from '../../components/Skeletons/ShopsShimmer';

const Shops = ({ navigation }) => {

    const [allShops, setAllShops] = useState([])
    const [filteredShops, setFilteredShops] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const { showLoader, hideLoader } = useLoader()
    const isFocused = useIsFocused()

    const [loading, setLoading] = useState(false)
    const { isKeyboardOpen, keyboardHeight } = useKeyboardStatus()

    
      let selector = useSelector(state => state?.user?.userData);
      if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
      }

    useEffect(() => {
        fetchData()
    }, [])

    // Real-time search filter
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredShops(allShops)
        } else {
            const filtered = allShops.filter(shop => {
                const shopName = shop?.Name?.toLowerCase() || ''
                const shopAddress = shop?.Address?.[0]?.LocationName?.toLowerCase() || ''
                const query = searchQuery.toLowerCase()

                return shopName.includes(query) || shopAddress.includes(query)
            })
            setFilteredShops(filtered)
        }
    }, [searchQuery, allShops])

    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(urls.getAllShops)
        // console.log("------------Notifications-----", res.data);
        setAllShops(res?.data)
        setFilteredShops(res?.data) // Initialize filtered shops
        setLoading(false)
    }

    const handleSearch = (text) => {
        setSearchQuery(text)
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
            paddingHorizontal: 15,
            gap: 10
        },
        icon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: isDarkMode ? 'white' : 'black',
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
        }
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
                }}>Market Place</CustomText>

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
            {
                loading ? <ShopsShimmerLoader isDarkMode={isDarkMode} shopCount={8} /> :
                    <>

                        (


                        <View style={styles.searchContainer}>
                            <Search />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search shops..."
                                placeholderTextColor="#A0A0A0"
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                            {/* <TouchableOpacity>
                    <Mic />
                </TouchableOpacity> */}
                        </View>

                        {/* Grid View */}
                        <FlatList
                            style={{}}
                            data={filteredShops}
                            keyExtractor={(item) => item?._id.toString()}
                            numColumns={2}

                            contentContainerStyle={{ paddingHorizontal: 10 }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.cardContainer}
                                    onPress={() => navigation.navigate('AllProductsOfAShops', { shopId: item?._id })}
                                >

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
                                            {item?.Name}
                                        </CustomText>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <LocationIcon />
                                            <CustomText style={{ fontSize: 10, color: isDarkMode ? 'white' : '#7d7d7d', flex: 1 }}>
                                                {item?.Address[0]?.LocationName}
                                            </CustomText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        {
                             selector?.
          SellerStatus == 'Approved' && 
                            <TouchableOpacity onPress={() => navigation?.navigate('AddShops')}>
                            <AddShopBtn />
                        </TouchableOpacity>}

                        {!isKeyboardOpen && <View style={{ height: 100 }} />}
                        )
                    </>

            }


        </View>
    );
};



export default Shops;