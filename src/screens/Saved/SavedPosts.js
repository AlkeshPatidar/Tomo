import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { AddStoryIcon, Back, BackBlackSimple, BackIcon, BookMarkIcon, BookMarkWhite, BottomIndicator, CameraButton, CommentIcon, CommentWhite, EmailIcon, EyeIcon, LikeIcon, LikeWhite, LockIcon, LoginBtn, NotiFication, PostShareWhite, PrimaryBackArrow, PrimaryBackWhite, ShareIcon, SpeakerOff, ThreeDotIcon, ThreeDotWhite, WhiteThreeDot } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import { useSelector } from "react-redux";

import Video from "react-native-video";
import { apiGet, apiPost, apiPut } from "../../utils/Apis";
import urls from "../../config/urls";
import { white } from "../../common/Colors/colors";

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useLoader from "../../utils/LoaderHook";
import { useIsFocused } from "@react-navigation/native";
import CommentModal from "../Home/CommentModel";

import moment from "moment";
import FeedShimmerLoader from "../../components/Skeletons/FeedsShimmer";
import AntDesign from 'react-native-vector-icons/AntDesign';



const SavedPosts = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const storyOpacity = useRef(new Animated.Value(0)).current;
    const feedTranslateY = useRef(new Animated.Value(20)).current;

    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState([])
    const heartOpacity = useRef(new Animated.Value(0)).current;
    const [doubleTapIndex, setDoubleTapIndex] = useState(null);


    const [modalVisible, setModalVisible] = useState(false);
    const [postId, setPostId] = useState(null);

    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([])

    const [isMuted, setIsMuted] = useState(false);
    const loaderVisible = useSelector(state => state?.loader?.loader);
      const [visibleVideoIndex, setVisibleVideoIndex] = useState(0); // Track which video should play
        const [pausedVideos, setPausedVideos] = useState({});

    const { showLoader, hideLoader } = useLoader()

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

      const onViewableItemsChanged = useRef(({ viewableItems }) => {
            if (viewableItems.length > 0) {
                setVisibleVideoIndex(viewableItems[0].index);
            }
        }).current;
    
        const viewabilityConfig = useRef({
            itemVisiblePercentThreshold: 50, // Video plays when 50% visible
        }).current;


    const isFocused = useIsFocused()

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



    const fetchCommentDataOfaPost = async (id) => {
        // console.log('--------------', id);

        const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
        setComments(res?.data)
        // console.log(res, 'Coemments data');

    }

    const sendComments = async (id, text) => {
        // console.log('---------___++++++++++++-----', id);

        const data = {
            Post: id,
            text: text
        }
        const res = await apiPost(`${urls.sendCommentOnPost}`, data)
        fetchCommentDataOfaPost(id)

    }
      const editComments = async (id, text) => {
            console.log('---------___++++++++++++-----', id, text);
    
            const data = {
                text: text
            }
            const res = await apiPut(`${urls.editComment}/${id}`, data)
            console.log(res,'+++++++++++++++++++++++++++res Of edit');
            
            fetchCommentDataOfaPost(postId)
    
        }


    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(urls.getAllSavedPosts)
        console.log("-------SAVED POST DATA----------", res.data);

        setAllPosts(res?.data)
        setLoading(false)
    }





    const SavePost = async (item) => {
        console.log('Item,', item?._id);

        setLoading(true)
        const endPoint = item?.Post?.SavedBy?.includes(selector?._id) ? `${urls.removeSavedPost}/${item?.Post?._id}` : `${urls.SavePost}/${item?.Post?._id}`
        const res = await apiGet(endPoint)
        fetchData()
        setLoading(false)
    }

 

    const onLikeUnlike = async (item) => {
        const postId = item?.Post?._id;
        const userId = selector?._id;

        // Optimistic UI Update
        setAllPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.Post?._id === postId) {
                    const alreadyLiked = post.Post?.likes.includes(userId);
                    const updatedLikes = alreadyLiked
                        ? post.Post.likes.filter(id => id !== userId)
                        : [...post.Post.likes, userId];

                    const updatedTotalLikes = alreadyLiked
                        ? post.Post.TotalLikes - 1
                        : post.Post.TotalLikes + 1;

                    return {
                        ...post,
                        Post: {
                            ...post.Post,
                            likes: updatedLikes,
                            TotalLikes: updatedTotalLikes,
                        }
                    };
                }
                return post;
            })
        );

        try {
            await apiGet(`${urls.likeUnlike}/${postId}`);
        } catch (error) {
            console.log("Error in like/unlike", error);

            // Revert optimistic UI change
            setAllPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.Post?._id === postId) {
                        const originallyLiked = item.Post.likes.includes(userId);
                        const revertedLikes = originallyLiked
                            ? [...post.Post.likes, userId]
                            : post.Post.likes.filter(id => id !== userId);

                        const revertedTotalLikes = originallyLiked
                            ? post.Post.TotalLikes + 1
                            : post.Post.TotalLikes - 1;

                        return {
                            ...post,
                            Post: {
                                ...post.Post,
                                likes: revertedLikes,
                                TotalLikes: revertedTotalLikes,
                            }
                        };
                    }
                    return post;
                })
            );
        }
    };




    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Saved Posts</CustomText>

                <TouchableOpacity onPress={{}}>
                    {/* <NotiFication /> */}
                </TouchableOpacity>

            </SpaceBetweenRow>
        )
    }


    const formatInstagramDate = (dateString) => {
        const date = moment(dateString);
        const now = moment();

        // Calculate difference
        const diffInSeconds = now.diff(date, 'seconds');
        const diffInMinutes = now.diff(date, 'minutes');
        const diffInHours = now.diff(date, 'hours');
        const diffInDays = now.diff(date, 'days');
        const diffInWeeks = now.diff(date, 'weeks');

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s`;
        }

        if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        }

        if (diffInHours < 24) {
            return `${diffInHours}h`;
        }

        if (diffInDays < 7) {
            return `${diffInDays}d`;
        }

        if (diffInWeeks < 4) {
            return `${diffInWeeks}w`;
        }

        if (date.year() === now.year()) {
            return date.format('MMM D');
        } else {
            return date.format('MMM D, YYYY');
        }
    };

      const triggerHeartAnimation = (index) => {
        setDoubleTapIndex(index);
        
       
        heartOpacity.setValue(0);
        heartScale.setValue(0); 
      
        Animated.parallel([
            
            Animated.sequence([
                Animated.timing(heartOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(heartOpacity, {
                    toValue: 0,
                    duration: 600, 
                    useNativeDriver: true,
                })
            ]),
            
            // Scale: 0 -> 1.2 -> 0 (grow from center then shrink)
            Animated.sequence([
                Animated.timing(heartScale, {
                    toValue: 1.2,
                    duration: 300, // Grow to slightly bigger
                    useNativeDriver: true,
                }),
                Animated.timing(heartScale, {
                    toValue: 0,
                    duration: 500, // Shrink back to 0
                    useNativeDriver: true,
                })
            ])
        ]).start();
    };
    
    // Don't forget to add heartScale to your state
    const heartScale = useRef(new Animated.Value(0)).current;
    
    let lastTap = null;
    const handleDoubleTap = (item, index) => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
    
        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            triggerHeartAnimation(index);
            onLikeUnlike(item);
        } else {
            lastTap = now;
        }
    };

    const renderFeeds = () => {
        return (
            <FlatList
                data={allPosts}
                style={{ marginBottom: 90 }}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}

                // onRefresh={onRefresh}
                // refreshing={loading}
                renderItem={({ item, index }) => {
                    const mediaUrl = item.Post?.media // Use a consistent key for media
                    const isVideo = typeof mediaUrl === "string" && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov"));

                    return (
                        <View style={styles.feedContainer} key={item?._id}>
                        
                            <View style={styles.header}>
                                <View style={styles.userInfo}>
                                    <Image source={item?.User?.Image ? { uri: item?.User?.Image } : IMG.MessageProfile} style={styles.profileImage} />
                                    <TouchableOpacity onPress={() => navigation.navigate('OtherUserDetail', { userId: item?.User?._id })}>
                                        <Text style={styles.username}>{item?.Post?.User?.UserName}</Text>
                                        {isVideo && <Text style={styles.audio}>{'Original audio'}</Text>}
                                    </TouchableOpacity>
                                </View>
                                {/* <TouchableOpacity>
                                    {isDarkMode ? <WhiteThreeDot /> : <ThreeDotIcon />}
                                </TouchableOpacity> */}
                            </View>

                            <TouchableWithoutFeedback onPress={() => handleDoubleTap(item, index)}>
                                <View style={{ position: 'relative' }}>
                                    {isVideo ? (
                                        <Video
                                            source={{ uri: item?.Post?.media }}
                                            style={styles.postImage}
                                            resizeMode="cover"
                                            repeat
                                            muted={isMuted}
                                             paused={visibleVideoIndex !== index || pausedVideos[index]}
                                               onLoad={() => console.log(`Video ${index} loaded`)}
                                            onError={(error) => console.log(`Video ${index} error:`, error)}
                                            onBuffer={() => console.log(`Video ${index} buffering`)}
                                        />
                                    ) : (
                                        <Image source={{ uri: item?.Post?.media }} style={styles.postImage} />
                                    )}

                                    {/* Heart Animation */}
                                    <Animated.View
                                        pointerEvents="none"
                                        style={{
                                            position: 'absolute',
                                            top: '40%',
                                            left: '40%',
                                            opacity: doubleTapIndex === index ? heartOpacity : 0,
                                            transform: [{ scale: heartOpacity }],
                                        }}
                                    >
                                        <MaterialIcons name="favorite" size={100} color="red" />
                                    </Animated.View>

                                    {isVideo && (
                                        <TouchableOpacity
                                            style={styles.soundButton}
                                            onPress={() => setIsMuted(!isMuted)}
                                        >
                                            {isMuted ? <SpeakerOff /> : (
                                                <AntDesign
                                                    name={'sound'}
                                                    color={isDarkMode ? 'white' : 'black'}
                                                    size={14}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </TouchableWithoutFeedback>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <View style={styles.leftIcons}>
                                    <TouchableOpacity
                                        style={{ right: 0 }}
                                        onPress={() => onLikeUnlike(item)}
                                    >
                                        {item?.Post?.likes?.includes(selector?._id) ? (
                                            isDarkMode ? <MaterialIcons name={'favorite'} color={'red'} size={25} />
                                                : <MaterialIcons name={'favorite-border'} color={'red'} size={25} />
                                        ) : (
                                            isDarkMode ? <MaterialIcons name={'favorite-border'} color={'white'} size={25} />
                                                : <MaterialIcons name={'favorite-border'} color={'black'} size={25} />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible(true);
                                            fetchCommentDataOfaPost(item?.Post?._id)
                                            setPostId(item?.Post?._id)
                                        }}
                                    >
                                        {isDarkMode ? <CommentWhite /> : <CommentIcon />}
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity>
                                        {isDarkMode ? <PostShareWhite /> : <ShareIcon />}
                                    </TouchableOpacity> */}
                                </View>

                                <Row style={{ gap: 20 }}>
                                    {/* <TouchableOpacity>
                                        {
                                            isDarkMode ?
                                                <TouchableOpacity style={{ alignItems: 'center', gap: 0, flexDirection: 'row' }}
                                                    onPress={() => onDisLikes(item)}
                                                >
                                                    <Foundation name={'dislike'} color={'white'} size={30} />
                                                    <Text style={styles.likes}>{item?.TotalUnLikes}</Text>
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{ alignItems: 'center', gap: 0, flexDirection: 'row' }}
                                                    onPress={() => onDisLikes(item)}

                                                >
                                                    <Foundation name={'dislike'} color={'black'} size={30} />
                                                    <Text style={styles.likes}>{item?.TotalUnLikes}</Text>
                                                </TouchableOpacity>
                                        }

                                    </TouchableOpacity> */}

                                    <TouchableOpacity
                                        style={{ right: 0 }}
                                        onPress={() => SavePost(item)}
                                    >
                                        {item?.Post?.SavedBy?.includes(selector?._id) ? (
                                            isDarkMode ? <FontAwesome name={'bookmark'} color={'white'} size={24} />
                                                : <FontAwesome name={'bookmark'} color={'black'} size={24} />
                                        ) : (
                                            isDarkMode ? <FontAwesome name={'bookmark-o'} color={'white'} size={24} />
                                                : <FontAwesome name={'bookmark-o'} color={'black'} size={24} />
                                        )}
                                    </TouchableOpacity>

                                </Row>
                            </View>
                            <Text style={styles.likes}>{item?.Post?.TotalLikes} {item?.Post?.TotalLikes > 1 ? 'likes' : 'like'}</Text>
                            <Text style={styles.caption}>
                                <Text style={styles.username}>{item?.caption || 'No Caption Added'}</Text>
                                {item.caption}
                            </Text>
                            <Text style={styles.comments}>{item?.Post?.TotalComents} comments</Text>
                            <Text style={styles.time}>{formatInstagramDate(item?.createdAt)}</Text>

                        </View>
                    );
                }}
                ListEmptyComponent={!loaderVisible && <CustomText style={{
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
            height: 310,
            // resizeMode: 'cover',
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 8,
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
    const renderCommentModal = () => {
        return (
            <>
                <CommentModal
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onBackButtonPress={() => setModalVisible(false)} // ✅ handles Android back
                    comments={comments}
                    isDarkMode={isDarkMode}
                    commentText={commentText}
                    onChangeText={setCommentText}
                    onSendPress={() => {
                        console.log('Send:', commentText);
                        sendComments(postId, commentText);
                        setCommentText('');
                    }}
                    onDeleteComments={(id) => onDeleteComments(id)}
                    onEditComment={(id, text)=>editComments(id, text)}

                />

            </>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            {renderHeader()}
            {/* {renderStories()} */}
            {loading ? <FeedShimmerLoader isDarkMode={isDarkMode} count={5} /> :
                renderFeeds()}
            {renderCommentModal()}

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
