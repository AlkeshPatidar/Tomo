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

   



const Shops = ({navigation}) => {

    const [allShops, setAllShops] = useState([])
    const { showLoader, hideLoader } = useLoader()
const isFocused=useIsFocused()

   useEffect(() => {
        fetchData()
    }, [isFocused])



    const fetchData = async () => {
        showLoader()
        const res = await apiGet(urls.getAllShops)
        console.log("------------Notifications-----", res.data);
        setAllShops(res?.data)
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
        cardContainer:{
            backgroundColor: isDarkMode?'#252525': '#fff',
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
            borderColor:isDarkMode?'gray':'#E4E4E4'
        }
    });

    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    {isDarkMode ? <BackIcon /> : <BackBlackSimple />}
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Shop</CustomText>

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
                data={allShops}
                keyExtractor={(item) => item?._id.toString()}
                numColumns={2}

                contentContainerStyle={{ paddingHorizontal: 10 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        {console.log('+++++++++++++++++>', item)
                        }
                        <Image
                            source={item?.Image?{uri:item?.Image}:IMG.PostImage}
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
                                <CustomText style={{ fontSize: 10, color:isDarkMode?'white': '#7d7d7d', flex: 1 }}>
                                   {item?.Address}
                                </CustomText>
                            </View>
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity onPress={()=>navigation?.navigate('AddShops')}>
                <AddShopBtn/>
            </TouchableOpacity>

        </View>
    );
};



export default Shops;
