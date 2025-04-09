import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { AddStoryIcon, Back, BackBlackSimple, BackIcon, BookMarkIcon, BookMarkWhite, BottomIndicator, CameraButton, CommentIcon, CommentWhite, EmailIcon, EyeIcon, LikeIcon, LikeWhite, LockIcon, LoginBtn, NotiFication, PostShareWhite, PrimaryBackArrow, PrimaryBackWhite, ShareIcon, SpeakerOff, ThreeDotIcon, ThreeDotWhite, WhiteThreeDot } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import { useSelector } from "react-redux";

import Video from "react-native-video";
import { apiGet } from "../../utils/Apis";
import urls from "../../config/urls";
import { white } from "../../common/Colors/colors";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useLoader from "../../utils/LoaderHook";
import { useIsFocused } from "@react-navigation/native";



const SavedPosts = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const storyOpacity = useRef(new Animated.Value(0)).current;
    const feedTranslateY = useRef(new Animated.Value(20)).current;

    const animatedValues = useRef(feedData.map(() => new Animated.Value(0))).current;
    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState([])
    const [allStories, setAllStories] = useState([])

    const [isMuted, setIsMuted] = useState(false);
  const loaderVisible = useSelector(state => state?.loader?.loader);

    const {showLoader, hideLoader}=useLoader()

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    const handleAnimation = (index) => {
        Animated.timing(animatedValues[index], {
            toValue: 1,
            duration: 400, // Duration of animation
            delay: index * 100, // Staggered delay for each item
            useNativeDriver: true,
        }).start();
    };

    const isFocused=useIsFocused()

    useEffect(() => {
        // Animate Stories (Fade-in)
        Animated.timing(storyOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Animate Feeds (Slide-in)
        Animated.timing(feedTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        fetchData()
    }, [])



    const fetchData = async () => {
        showLoader()
        const res = await apiGet(urls.getAllSavedPosts)
        console.log("-------SAVED POST DATA----------", res.data);

        setAllPosts(res?.data)
      hideLoader()
    }





    const SavePost = async (item) => {
        console.log('Item,', item?._id);
        
        setLoading(true)
        const endPoint = item?.Post?.SavedBy?.includes(selector?._id) ? `${urls.removeSavedPost}/${item?.Post?._id}` : `${urls.SavePost}/${item?.Post?._id}`
        const res = await apiGet(endPoint)
        console.log("-------------SAVE----", res.data);
        setLoading(false)
        fetchData()
    }

    const onLikeUnlike = async (item) => {

        console.log(item?._id, 'ITEM ITDD');

        setLoading(true)
        const endPoint = item?.Post?.likes?.includes(selector?._id) ? `${urls.likeUnlike}/${item?.Post?._id}` : `${urls.likeUnlike}/${item?.Post?._id}`
        const res = await apiGet(`${urls.likeUnlike}/${item?.Post?._id}`)
        console.log("------------ONLSSSSSSSSSSSSSS-----", res.data);
        setLoading(false)
        fetchData()
    }

    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                  {isDarkMode? <PrimaryBackWhite /> : <PrimaryBackArrow />}
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Saved</CustomText>

                <TouchableOpacity onPress={{}}>
                    {/* <NotiFication /> */}
                </TouchableOpacity>

            </SpaceBetweenRow>
        )
    }
   

 


    const renderFeeds = () => {
        return (
            <FlatList
                data={allPosts}
                style={{ marginBottom: 90 }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    handleAnimation(index);

                    const animatedStyle = {
                        opacity: animatedValues[index],
                        transform: [
                            {
                                translateY: animatedValues[index].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [20, 0], // Slide up effect
                                }),
                            },
                        ],
                    };
                    const mediaUrl = item.Post?.media; // Use a consistent key for media
                    const isVideo = typeof mediaUrl === "string" && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov"));

                    return (
                        <Animated.View style={[styles.feedContainer, animatedStyle]}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.userInfo}>
                                    <Image source={item?.Post?.User?.Image ? { uri: item?.Post?.User?.Image } : IMG.MessageProfile} style={styles.profileImage} />
                                    <TouchableOpacity onPress={()=>navigation.navigate('OtherUserDetail')}>
                                        <Text style={styles.username}>{item?.Post?.User?.UserName}</Text>
                                        <Text style={styles.audio}>{isVideo ? 'Original audio' : ''}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity>
                                    {isDarkMode ? <WhiteThreeDot /> : <ThreeDotIcon />}
                                </TouchableOpacity>
                            </View>

                            {/* Post Media (Image or Video) */}
                            {isVideo ? (
                                <View>
                                    <Video
                                        source={{ uri: item?.Post?.media }}
                                        style={styles.postImage}
                                        resizeMode="cover"
                                        // controls // Show Play/Pause controls
                                        repeat // Loop the video
                                        // muted // Auto-play muted
                                        muted={isMuted}
                                    />
                                    <TouchableOpacity
                                        style={styles.soundButton}
                                        onPress={() => setIsMuted(!isMuted)}
                                    >
                                        {isMuted ? <SpeakerOff /> : <AntDesign name={'sound'} color={isDarkMode ? 'white' : 'black'}
                                            size={14}
                                        />}
                                    </TouchableOpacity>

                                </View>
                            ) : (
                                <Image source={{ uri: item?.Post?.media }} style={styles.postImage} />
                            )}

                            {/* Actions */}
                            <View style={styles.actions}>
                                <View style={styles.leftIcons}>

                                    <TouchableOpacity style={{ right: 0 }}
                                        onPress={() => onLikeUnlike(item)}
                                    >
                                        {item?.Post?.likes?.includes(selector?._id) ? (
                                            isDarkMode ? <MaterialIcons name={'favorite'} color={'white'}
                                                size={24}
                                            />
                                                : <MaterialIcons name={'favorite-border'} color={'black'}
                                                    size={24} />
                                        ) : (
                                            isDarkMode ? <MaterialIcons name={'favorite-border'} color={'white'} size={24}
                                            /> : <MaterialIcons name={'favorite-border'} color={'black'} size={24}
                                            />
                                        )}
                                    </TouchableOpacity>

                                    {/* <TouchableOpacity>
                                        {isDarkMode ? <LikeWhite /> : <LikeIcon />}
                                    </TouchableOpacity> */}



                                    <TouchableOpacity>
                                        {isDarkMode ? <CommentWhite /> : <CommentIcon />}
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        {isDarkMode ? <PostShareWhite /> : <ShareIcon />}
                                    </TouchableOpacity>
                                </View>


                                <TouchableOpacity style={{ right: 0 }}
                                    onPress={() => SavePost(item)}
                                >
                                    {item?.Post?.SavedBy?.includes(selector?._id) ? (
                                        isDarkMode ? <FontAwesome name={'bookmark'} color={'white'}
                                            size={24}
                                        />
                                            : <FontAwesome name={'bookmark'} color={'black'}
                                                size={24} />
                                    ) : (
                                        isDarkMode ? <FontAwesome name={'bookmark-o'} color={'white'} size={24}
                                        /> : <FontAwesome name={'bookmark-o'} color={'black'} size={24}
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Likes */}
                            <Text style={styles.likes}>{item?.Post?.TotalLikes} likes</Text>

                            {/* Caption */}
                            <Text style={styles.caption}>
                                <Text style={styles.username}>{item?.caption || 'View from Falcon 9’s second stage during an orbital sunset'} </Text>
                                {item.caption}
                            </Text>

                            {/* Comments */}
                            <Text style={styles.comments}>View all{item?.TotalComents}comments</Text>

                            {/* Time */}
                            <Text style={styles.time}>{item?.createdAt}</Text>
                        </Animated.View>
                    );
                }}
                ListEmptyComponent={!loaderVisible &&<CustomText style={{
                    color: isDarkMode ? 'white' : 'black',
                    alignSelf: 'center',
                    marginTop: 50,
                    fontFamily: FONTS_FAMILY.OpenSans_Condensed_Medium
                }}>No Post Found!</CustomText>}
            />
        );
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : white
        },
        storyContainer: {
            alignItems: 'center',
            marginRight: 12,
        },
        storyBorder: {
            width: 65,
            height: 65,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: '#0084ff',
            justifyContent: 'center',
            alignItems: 'center',
        },
        ownStoryBorder: {
            borderColor: 'transparent',
        },
        soundButton: {
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: 10,
            borderRadius: 20,
        },
        storyImage: {
            width: 55,
            height: 55,
            borderRadius: 50,
        },
        storyText: {
            fontSize: 14,
            marginTop: 5,
            color: isDarkMode ? 'white' : '#000',
            width: 70,
            textAlign: 'center',
            fontFamily: FONTS_FAMILY.SourceSans3_Bold
        },
        plusIcon: {
            position: 'absolute',
            bottom: 25,
            right: 5,
            backgroundColor: '#0084ff',
            width: 20,
            height: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#fff',
        },
        plusText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },

        feedContainer: {
            // marginBottom: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: '#ccc',
            paddingBottom: 10,
            backgroundColor: isDarkMode ? 'black' : 'white'
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        profileImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
        },
        username: {
            fontWeight: 'bold',
            color: isDarkMode ? 'white' : 'black'
        },
        audio: {
            color: isDarkMode ? 'white' : 'gray',
            fontSize: 12,
        },
        postImage: {
            width: '100%',
            height: 210,
            resizeMode: 'cover',
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            // left:15
            marginHorizontal: 10
        },
        leftIcons: {
            flexDirection: 'row',
            gap: 15,
        },
        likes: {
            fontWeight: 'bold',
            paddingHorizontal: 10,
            color: isDarkMode ? 'white' : 'black'
        },
        caption: {
            paddingHorizontal: 10,
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? 'white' : 'black'

        },
        comments: {
            paddingHorizontal: 10,
            color: isDarkMode ? 'white' : 'gray',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular

        },
        time: {
            paddingHorizontal: 10,
            color: 'gray',
            fontSize: 12,
            marginTop: 5,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular

        },
    })

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            {renderHeader()}
            {/* {renderStories()} */}
            {renderFeeds()}

        </View>
    )
}

export default SavedPosts;






const storiesData = [
    { id: '1', name: 'Your story', image: IMG.AddStoryImage, isOwn: true },
    { id: '2', name: 'mkbhd', image: IMG.StoryImage2 },
    { id: '3', name: 'lewisham...', image: IMG.StoryImage1 },
    { id: '4', name: 'defavours', image: IMG.StoryImage2 },
    { id: '5', name: 'leome', image: IMG.StoryImage1 },
];

const feedData = [
    {
        id: '1',
        username: 'spacex',
        profileImage: IMG.ProfileImagePost,
        postImage: 'https://res.cloudinary.com/dwewlzhdz/video/upload/v1743501862/Story/Video/gw9kaoshcsqij0ysabol.mp4',
        likes: '112,099',
        caption: 'View from Falcon 9’s second stage during an orbital sunset',
        comments: 'View all 534 comments',
        time: '1 DAY AGO',
    },
    {
        id: '2',
        username: 'spacex',
        profileImage: IMG.ProfileImagePost,
        postImage: IMG.PostImage,
        likes: '112,099',
        caption: 'View from Falcon 9’s second stage during an orbital sunset',
        comments: 'View all 534 comments',
        time: '1 DAY AGO',
    },
    {
        id: '3',
        username: 'spacex',
        profileImage: IMG.ProfileImagePost,
        postImage: IMG.PostImage,
        likes: '112,099',
        caption: 'View from Falcon 9’s second stage during an orbital sunset',
        comments: 'View all 534 comments',
        time: '1 DAY AGO',
    },
];
