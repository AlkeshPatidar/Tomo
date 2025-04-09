import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { AddUserIcon, Menu, OtionsButtons, PrimaryBackArrow, PrimaryBackWhite, ThreeDotIcon } from '../../assets/SVGs';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import LinearGradient from 'react-native-linear-gradient';
import CustomDrawer from '../../components/DrawerModal';
import { useSelector } from 'react-redux';
import IMG from '../../assets/Images';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';


const OtherUserDetail = ({ navigation }) => {
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const { isDarkMode } = useSelector(state => state.theme);
    const [UserDetails, setUserDetails]=useState(null)
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        fetchData()
        // getCurrentStories()
    }, [])



    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(urls.userProfile)
        // console.log("-----------------", res.data);
        setUserDetails(res?.data)
        setLoading(false)
    }


    const highlights = [
        { id: '1', title: 'UX Course', image: 'https://picsum.photos/id/237/200/300' },
        { id: '2', title: 'UX Portfolio', image: 'https://picsum.photos/id/237/200/300' },
        { id: '3', title: 'Desk setup', image: 'https://picsum.photos/id/237/200/300' },
        { id: '4', title: 'UX Guide', image: 'https://picsum.photos/id/237/200/300' },
    ];

    const posts = [
        { id: '1', image: 'https://picsum.photos/200/300/?blur=2' },
        { id: '2', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '3', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '4', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '5', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '6', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '7', image: 'https://picsum.photos/200/300/?blur=2' },
        { id: '8', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '9', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '10', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '11', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '12', image: 'https://picsum.photos/seed/picsum/200/300' },
    ];



    


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
        },
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            // gap: 90,
        },
        headerText: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? "white" : 'black',
        },
        highlightedText: {
            color: 'rgba(79, 82, 254, 1)',
        },
        headerContainer: {
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center',
            gap: 18
        },
        profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
        },
        headerActions: {
            flexDirection: 'row',
            marginLeft: 'auto',
            gap: 10
        },
        followButton: {
            backgroundColor: '#F20089',
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginRight: 8,
        },
        messageButton: {
            backgroundColor: '#E5E5E5',
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 8,
        },
        buttonText: {
            fontSize: 14,
            color: '#ffffff',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold
        },
        bioContainer: {
            paddingHorizontal: 16,
        },
        bioName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : '#999999',

        },
        bioPronoun: {
            fontSize: 14,
            color: isDarkMode ? 'white' : '#999999',
        },
        bioDescription: {
            fontSize: 14,
            marginTop: 4,
            color: isDarkMode ? 'white' : '#333333',
        },
        highlightsList: {
            paddingVertical: 12,
            paddingHorizontal: 16,
        },
        highlightContainer: {
            alignItems: 'center',
            marginRight: 12,
        },
        highlightImage: {
            width: 56,
            height: 56,
            borderRadius: 35,
            borderWidth: 1,
            borderColor: '#ddd',
        },
        highlightText: {
            fontSize: 12,
            marginTop: 4,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? 'white' : null
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 12,
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 16,
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : null
        },
        statLabel: {
            fontSize: 12,
            color: '#777',
        },
        postsContainer: {
            paddingHorizontal: 4,
            marginTop: 7
        },
        postImage: {
            width: '32%',
            height: 100,
            margin: 1,
            // borderRadius: 6,
        },
    });

    const renderHighlight = ({ item }) => (
        <View style={styles.highlightContainer}>
            <Image source={{ uri: item.image }} style={styles.highlightImage} />
            <Text style={styles.highlightText}>{item.title}</Text>
        </View>
    );
    const renderHeader = () => (
        <SpaceBetweenRow style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Tab',{screen:'Home'})}>
                    {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {UserDetails?.FullName}
            </Text>
            <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                {
                    isDarkMode ?
                        <Image source={IMG.menuIcon}
                            style={{
                                height: 30,
                                width: 30
                            }}
                        /> :
                        <Menu fill={'white'} />
                }
            </TouchableOpacity>
        </SpaceBetweenRow>
    );

    const renderPost = ({ item }) => (
        <Image source={{ uri: item.image }} style={styles.postImage} />
    );

    return (
        <View style={styles.container}>
            {/* HEADER SECTION */}
            {renderHeader()}
            <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: 'https://picsum.photos/id/237/200/300' }}
                    style={styles.profileImage}
                />
                <View>
                    <Row style={{ marginBottom: 10, gap: 50 }}>
                        <CustomText style={{ color: isDarkMode ? "white" : 'black', fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>{UserDetails?.FullName}</CustomText>
                        {/* <TouchableOpacity>
                            <ThreeDotIcon />
                        </TouchableOpacity> */}
                    </Row>

                    <View style={styles.headerActions}>

                        <TouchableOpacity >
                            <LinearGradient
                                colors={['#ff00ff', '#6a5acd']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.followButton}
                            >
                                <Text style={styles.buttonText}>Follow</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.messageButton}
                            onPress={() => navigation.navigate('Chat')}
                        >
                            <Text style={{ ...styles.buttonText, color: 'black' }}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <AddUserIcon />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* BIO SECTION */}
            <View style={styles.bioContainer}>
                <Text style={styles.bioName}>Dyniza <Text style={styles.bioPronoun}>she</Text></Text>
                <Text style={styles.bioDescription}>
                    ✨ UX designer✨{'\n'}
                    🎯 Freelance Design • Lifestyle • Tech{'\n'}
                    📩 DM me for projects and collab{'\n'}
                    🌐 Grab your UX/UI Design guide below{'\n'}
                    🔗 drum.io/uxdyniza
                </Text>
            </View>

            {/* HIGHLIGHTS SECTION */}
            <View>
                <FlatList
                    data={highlights}
                    horizontal
                    renderItem={renderHighlight}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.highlightsList}
                />

            </View>

            {/* STATS SECTION */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>569</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
                <TouchableOpacity style={styles.statItem}
                    onPress={() => navigation.navigate("Followers")}
                >
                    <Text style={styles.statNumber}>16.7M</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </TouchableOpacity>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>

            <OtionsButtons />

            {/* POSTS SECTION */}
            <FlatList
                data={posts}
                numColumns={3}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.postsContainer}
            />
            <CustomDrawer
                isVisible={isDrawerVisible}
                onClose={() => setDrawerVisible(false)}
                navigation={navigation}
            />
        </View>
    );
};



export default OtherUserDetail;
