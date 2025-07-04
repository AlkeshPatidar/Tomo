import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text } from 'react-native';
import { Editsq, Mic, PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from 'react-redux';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import useLoader from '../../utils/LoaderHook';
import MessageListShimmer from '../../components/Skeletons/MessageListShimmer';

const MessageList = ({ navigation }) => {

    const { isDarkMode } = useSelector(state => state.theme);
    const [allUser, setAllUsers] = useState([])
    const {showLoader, hideLoader}=useLoader()
    const [loading, setLoading]=useState(false)

    useEffect(() => {
        fetchData()
    }, [])



    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(urls.getAllChattedUsers)
        console.log("-----------------", res.data);
        setAllUsers(res?.data)
        setLoading(false)
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
        },
        Ftcontainer: {
            flex: 1
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
            borderRadius: 30,
            margin: 10,
            padding: 4,
            marginTop: 30,
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

        // Mesg card

        card: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#EEE",
            padding: 16,
            paddingVertical: 15
        },
        profileContainer: {
            position: "relative",
            marginRight: 12,
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
        },
        onlineDot: {
            width: 12,
            height: 12,
            backgroundColor: "#4CAF50", // Green dot for online status
            borderRadius: 6,
            position: "absolute",
            bottom: 0,
            right: 0,
            borderWidth: 2,
            borderColor: "#FFF",
        },
        detailsContainer: {
            flex: 1,
        },
        row: {
            flexDirection: "row",
            gap: 10,
            // justifyContent: "space-between",
            marginBottom: 2,
        },
        name: {
            fontSize: 16,
            color: isDarkMode ? 'white' : "#000",
            fontFamily: FONTS_FAMILY.SourceSans3_Bold
        },
        time: {
            fontSize: 13,
            color: "#999",
            fontFamily: FONTS_FAMILY.SourceSans3_Bold

        },
        message: {
            fontSize: 14,
            color: "rgba(79, 82, 254, 1)", // Blue for message text
            fontWeight: "600",
            fontFamily: FONTS_FAMILY.SourceSans3_Bold

        },
        unreadCount: {
            width: 24,
            height: 24,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        unreadText: {
            color: "#FFF",
            fontWeight: "bold",
            fontSize: 12,
        },
    });

    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}

                </TouchableOpacity>
                <CustomText style={{ fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>Message</CustomText>
                <TouchableOpacity>
                    <Editsq />
                </TouchableOpacity>
            </SpaceBetweenRow>
        )
    }

    const MessageCard = ({ item }) => {
        return (
            <TouchableOpacity style={styles.card}
                onPress={() => navigation.navigate('Chat', {userId:item?._id, userForChat:item})}
            >
                {/* Profile Image */}
                <View style={styles.profileContainer}>
                    <Image source={item?.Image?{uri:item?.Image}:IMG.MessageProfile} style={styles.avatar} />
                    {/* {item.isOnline && <View style={styles.onlineDot} />} */}
                </View>

                {/* Message Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.row}>
                        <Text style={styles.name}>{item.FullName}</Text>
                        {/* <Text style={styles.time}>{item.time}</Text> */}
                    </View>
                    {/* <Text style={styles.message}>{item.message}</Text> */}
                </View>

                {/* Unread Count */}
                {/* {item.unreadCount > 0 && (
                    <LinearGradient
                        colors={["#4A90E2", "#0039A6"]}
                        style={styles.unreadCount}
                    >
                        <Text style={styles.unreadText}>{item.unreadCount}</Text>
                    </LinearGradient>
                )} */}
            </TouchableOpacity>
        );
    };

    if (loading) {
    return <MessageListShimmer/>;

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
            </View>

            <View style={styles.Ftcontainer}>
                <FlatList
                    data={allUser}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <MessageCard item={item} />}
                    style={{ flex: 1 }}
                />
                <View style={{ height: 100 }} />
            </View>


        </View>
    );
};



export default MessageList;

