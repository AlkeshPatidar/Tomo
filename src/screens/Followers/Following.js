import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar, Text, Animated } from 'react-native';
import { BackBlackSimple, BackOuterWhite, PrimaryBackArrow, PrimaryBackWhite, Search } from '../../assets/SVGs';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import IMG from '../../assets/Images';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import useLoader from '../../utils/LoaderHook';
import { apiGet } from '../../utils/Apis';
import urls from '../../config/urls';
import CustomText from '../../components/TextComponent';
import MessageListShimmer from '../../components/Skeletons/MessageListShimmer';

const Follwing = ({ navigation }) => {
    const [data, setData] = useState(DATA);
    const [searchText, setSearchText] = useState('');
    const [animatedValue] = useState(new Animated.Value(0));
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader()
    const [Allfollowers, setAllFollowers] = useState([])
        const [loading, setLoading] = useState(false)
    

    useEffect(() => {
        // Animation for fade in effect
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
        fetchData()
    }, []);


    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(urls.getAllFollowings)
        console.log(res, '===FOwlings==============');
        setAllFollowers(res?.data)
        setLoading(false)
    }


    // Grouping data
    const groupedData = {
        "This month": data.filter((item) => item.type === 'This month'),
        "Earlier": data.filter((item) => item.type === 'Earlier'),
        "Suggested for you": data.filter((item) => item.type === 'Suggested for you'),
    };

    // Follow button state
    const handleFollowToggle = (id) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.id === id
                    ? { ...item, isFollowing: !item.isFollowing }
                    : item
            )
        );
    };

    // Render header
    const renderHeader = () => (
        <Row style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                {isDarkMode ? <BackOuterWhite /> : <PrimaryBackArrow />}

            </TouchableOpacity>
            <CustomText style={styles.headerText}>
                Following
            </CustomText>
        </Row>
    );

    // Render card
    const Card = ({ item }) => (
        <Animated.View style={[styles.cardContainer, { opacity: animatedValue }]}>
            <Image source={{ uri: item?.Image }} style={styles.profileImage} />
            <TouchableOpacity style={styles.textContainer}
                onPress={() => navigation.navigate('UserDetail')}
            >
                {/* <Text style={styles.name}>{item.user.name}</Text> */}
                <CustomText style={styles.name}>{item?.UserName}</CustomText>

                <Row>

                    {/* <Text style={styles.action}>{item.user.action}</Text>
                    <Text style={styles.time}>{item.user.time}</Text> */}
                </Row>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => handleFollowToggle(item.id)}>
                <LinearGradient
                    colors={item.isFollowing ? ['#e0e0e0', '#e0e0e0'] : ['#ff00ff', '#6a5acd']}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.followButton}
                >
                    <Text style={[
                        styles.followText,
                        { color: item.isFollowing ? '#000' : '#fff' }
                    ]}>
                        {item.isFollowing ? 'Following' : 'Follow'}
                    </Text>
                </LinearGradient>
            </TouchableOpacity> */}

        </Animated.View>
    );

    // Render section header
    const renderSectionHeader = (title) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
        },
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            gap: 90,
        },
        headerText: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,

        },
        highlightedText: {
            color: 'rgba(79, 82, 254, 1)',
        },

        icon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
        },
        sectionHeader: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: '#000',
            paddingVertical: 8,
            paddingHorizontal: 16,
            // backgroundColor: '#f9f9f9',
        },
        cardContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: isDarkMode ? '#252525' : null,
            marginBottom: 5,

            // borderBottomWidth: 1,
            // borderBottomColor: '#e0e0e0',
        },
        profileImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
        },
        textContainer: {
            flex: 1,
        },
        name: {
            fontSize: 14,
            // color: '#000',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold
        },
        action: {
            fontSize: 13,
            color: '#555',
            marginVertical: 2,
        },
        time: {
            fontSize: 12,
            color: '#999',
        },
        followButton: {
            paddingVertical: 6,
            paddingHorizontal: 16,
            borderRadius: 8,
        },
        followText: {
            fontSize: 14,
            fontWeight: '600',
        },
    });

            if (loading) {
    return <MessageListShimmer/>;

}

    return (
        <View style={styles.container}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            {renderHeader()}
            <FlatList
                style={{ marginTop: 20, paddingHorizontal: 10 }}
                // data={Object.keys(groupedData).flatMap((key) => [
                //     { type: 'header', key }, // Add header with unique key
                //     ...groupedData[key].map((item) => ({ ...item, key: `${key}-${item.id}` })), // Add unique key to each item
                // ])}
                data={Allfollowers}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) =>
                    item.type === 'header' ? (
                        // renderSectionHeader(item.key)
                        <></>
                    ) : (
                        <Card item={item} />
                    )
                }
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<CustomText
                    style={{
                        alignSelf: 'center',
                        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                        marginTop: 20
                    }}
                >No Data Found!</CustomText>}
            />

        </View>
    );
};

// ✅ Styling


const DATA = [
    // This month
    {
        id: '1',
        type: 'This month',
        user: {
            name: 'Lorem Ipsum',
            action: 'started following you.',
            time: '6 w',
            image: IMG.MessageProfile,
        },
        isFollowing: false,
    },
    {
        id: '5',
        type: 'This month',
        user: {
            name: 'John Doe',
            action: 'liked your post.',
            time: '2 w',
            image: IMG.MessageProfile,
        },
        isFollowing: true,
    },
    {
        id: '6',
        type: 'This month',
        user: {
            name: 'Jane Smith',
            action: 'commented on your photo.',
            time: '3 w',
            image: IMG.MessageProfile,
        },
        isFollowing: false,
    },

    // Earlier
    {
        id: '2',
        type: 'Earlier',
        user: {
            name: 'Lorenzo_matterh',
            action: 'is on Instagram.',
            time: '10 w',
            image: IMG.MessageProfile,
        },
        isFollowing: false,
    },
    {
        id: '7',
        type: 'Earlier',
        user: {
            name: 'Alice Johnson',
            action: 'tagged you in a story.',
            time: '8 w',
            image: IMG.MessageProfile,
        },
        isFollowing: false,
    },
    {
        id: '8',
        type: 'Earlier',
        user: {
            name: 'David Lee',
            action: 'started following you.',
            time: '12 w',
            image: IMG.MessageProfile,
        },
        isFollowing: true,
    },

    // Suggested for you
    {
        id: '3',
        type: 'Suggested for you',
        user: {
            name: 'Lorem_aa',
            action: 'is on Instagram.',
            time: '11 w',
            image: IMG.MessageProfile,
        },
        isFollowing: true,
    },
    {
        id: '4',
        type: 'Suggested for you',
        user: {
            name: 'Lorem_bb',
            action: 'is on Instagram.',
            time: '9 w',
            image: IMG.MessageProfile,
        },
        isFollowing: false,
    },
    {
        id: '9',
        type: 'Suggested for you',
        user: {
            name: 'Chris Evans',
            action: 'started following you.',
            time: '4 w',
            image: IMG.MessageProfile,
        },
        isFollowing: false,
    },
];



export default Follwing;
