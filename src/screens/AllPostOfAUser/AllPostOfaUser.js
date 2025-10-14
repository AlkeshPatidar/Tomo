import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, TextInput, BackHandler, Alert } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { AddStoryIcon, CameraButton, CommentIcon, CommentWhite, NotiFication, PostShareWhite, PrimaryBackArrow, PrimaryBackWhite, ShareIcon, SpeakerOff, ThreeDotIcon, WhiteThreeDot } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import { useSelector } from "react-redux";
import Video from "react-native-video";
import { apiDelete, apiGet, apiPost, apiPut } from "../../utils/Apis";
import urls from "../../config/urls";
import { white } from "../../common/Colors/colors";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useLoader from "../../utils/LoaderHook";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import moment from "moment";
import FeedShimmerLoader from "../../components/Skeletons/FeedsShimmer";
import CommentModal from "../Home/CommentModel";
import GradientIcon from "../../components/GradientIcon";
import PostDetailModal from "../Home/PostDetailModel";


const AllPostOfAUser = ({ navigation, route }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const storyOpacity = useRef(new Animated.Value(0)).current;
    const feedTranslateY = useRef(new Animated.Value(20)).current;
    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState([])
    const [allStories, setAllStories] = useState([])
    const [followedStories, setFollowedStories] = useState([])
    const [doubleTapIndex, setDoubleTapIndex] = useState(null);
    const heartOpacity = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [postId, setPostId] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([])
    const [isMuted, setIsMuted] = useState(false);
    const loaderVisible = useSelector(state => state?.loader?.loader);
    const [visibleVideoIndex, setVisibleVideoIndex] = useState(0) // Track which video should play
    const [postDetailVisible, setPostDetailVisible] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)


    const { showLoader, hideLoader } = useLoader()

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    useFocusEffect(() => {
        const backAction = () => {
            Alert.alert(
                "Exit App",
                "Are you sure you want to exit the app?",
                [
                    {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel"
                    },
                    {
                        text: "EXIT",
                        onPress: () => BackHandler.exitApp()
                    }
                ]
            );
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    });


    const triggerHeartAnimation = (index) => {
        setDoubleTapIndex(index);
        heartOpacity.setValue(1);

        Animated.timing(heartOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

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



    const onRefresh = async () => {
        setLoading(true)
        await fetchData()

        setLoading(false)

    }


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
        console.log(res, '+++++++++++++++++++++++++++res Of edit');

        fetchCommentDataOfaPost(postId)

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



    const fetchData = async () => {
        setLoading(true)
        const res = await apiGet(`/api/user/GetAllPostofaUser/${route?.params?.userId}`)
        // console.log(res, '=================');
        setAllPosts(res?.data)
        setLoading(false)
    }








    const SavePost = async (item) => {
        const postId = item._id;
        const userId = selector?._id;
        setAllPosts(prevPosts => {
            return prevPosts.map(post => {
                if (post._id === postId) {
                    const alreadySaved = post.SavedBy.includes(userId);
                    const updatedSavedBy = alreadySaved
                        ? post.SavedBy.filter(id => id !== userId)
                        : [...post.SavedBy, userId];

                    return {
                        ...post,
                        SavedBy: updatedSavedBy
                    };
                }
                return post;
            });
        });

        // Call API in background
        try {
            const endPoint = item?.SavedBy?.includes(userId)
                ? `${urls.removeSavedPost}/${postId}`
                : `${urls.SavePost}/${postId}`;

            const res = await apiGet(endPoint);
            // console.log("-------------SAVE API SUCCESS----", res.data);
        } catch (error) {
            console.log("Save Post Error:", error);

            // Revert UI on error
            setAllPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === postId) {
                        const wasSaved = item.SavedBy.includes(userId);
                        const revertedSavedBy = wasSaved
                            ? [...post.SavedBy, userId]
                            : post.SavedBy.filter(id => id !== userId);

                        return {
                            ...post,
                            SavedBy: revertedSavedBy
                        };
                    }
                    return post;
                });
            });
        }
    };


    const handlePostClick = item => {
        console.log('_______________+')

        setSelectedPost(item)
        setPostDetailVisible(true)
        // Fetch comments for this post
        fetchCommentDataOfaPost(item._id)
    }

    const onLikeUnlike = async (item) => {
        const postId = item._id;
        const userId = selector?._id;
        setAllPosts(prevPosts => {
            return prevPosts.map(post => {
                if (post._id === postId) {
                    const alreadyLiked = post.likes.includes(userId);
                    const updatedLikes = alreadyLiked
                        ? post.likes.filter(id => id !== userId)
                        : [...post.likes, userId];

                    return {
                        ...post,
                        likes: updatedLikes,
                        TotalLikes: alreadyLiked ? post.TotalLikes - 1 : post.TotalLikes + 1
                    };
                }
                return post;
            });
        });
        try {
            await apiGet(`${urls.likeUnlike}/${postId}`);
            // console.log("Like/Unlike updated on server");
        } catch (error) {
            console.log("Error in like/unlike", error);

            setAllPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === postId) {
                        const wasLiked = item.likes.includes(userId);
                        const revertedLikes = wasLiked
                            ? [...post.likes, userId]
                            : post.likes.filter(id => id !== userId);

                        return {
                            ...post,
                            likes: revertedLikes,
                            TotalLikes: wasLiked ? post.TotalLikes + 1 : post.TotalLikes - 1
                        };
                    }
                    return post;
                });
            });
        }
    };


    const onDisLikes = async (item) => {
        const postId = item._id;
        const userId = selector?._id;
        setAllPosts(prevPosts => {
            return prevPosts.map(post => {
                if (post._id === postId) {
                    const alreadyLiked = post.Unlikes.includes(userId);
                    const updatedLikes = alreadyLiked
                        ? post.Unlikes.filter(id => id !== userId)
                        : [...post.Unlikes, userId];

                    return {
                        ...post,
                        Unlikes: updatedLikes,
                        TotalUnLikes: alreadyLiked ? post.TotalUnLikes - 1 : post.TotalUnLikes + 1
                    };
                }
                return post;
            });
        });
        try {
            await apiGet(`${urls.disLikePost}/${postId}`);
            // console.log("Like/Unlike updated on server");
        } catch (error) {
            console.log("Error in like/unlike", error);

            setAllPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === postId) {
                        const wasLiked = item.Unlikes.includes(userId);
                        const revertedLikes = wasLiked
                            ? [...post.Unlikes, userId]
                            : post.Unlikes.filter(id => id !== userId);

                        return {
                            ...post,
                            Unlikes: revertedLikes,
                            TotalUnLikes: wasLiked ? post.TotalUnLikes + 1 : post.TotalUnLikes - 1
                        };
                    }
                    return post;
                });
            });
        }
    };

    const onDeleteComments = async (id) => {
        try {
            showLoader();
            const response = await apiDelete(`/api/user/DeleteComment/${id}`);
            // console.log('DeletePost::', response);
            fetchCommentDataOfaPost(postId);
        } catch (error) {
            console.log('DeleteComment Error:', error?.response?.data || error.message);
        } finally {
            hideLoader();
        }
    };



    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>My Posts</CustomText>

                <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                    {/* <NotiFication /> */}
                </TouchableOpacity>

            </SpaceBetweenRow>
        )
    }

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setVisibleVideoIndex(viewableItems[0].index)
        }
    }).current

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50, // Video plays when 50% visible
    }).current


    const renderFeeds = () => {
        return (
            <FlatList
                // data={allPosts}
                data={allPosts.filter(
                    item => item?.media && !item?.media.toLowerCase().includes('.mp4'),
                )}
                // style={{ marginBottom: 90 }}
                keyExtractor={(item, index) => `${item._id}-${index}`}
                showsVerticalScrollIndicator={false}
                onRefresh={onRefresh}
                refreshing={loading}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item, index }) => {
                    const mediaUrl = item.media
                    const isVideo =
                        typeof mediaUrl === 'string' &&
                        (mediaUrl.includes('.mp4') ||
                            mediaUrl.includes('.mov') ||
                            mediaUrl.includes('video') ||
                            mediaUrl.includes('.avi'))

                    return (
                        <TouchableOpacity
                            style={styles.feedContainer}
                            key={`${item._id}-${index}`}
                            onPress={() => handlePostClick(item)}
                        // activeOpacity={0.9}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.userInfo}>
                                    <Image
                                        source={
                                            item?.User?.Image
                                                ? { uri: item?.User?.Image }
                                                : IMG.MessageProfile
                                        }
                                        style={styles.profileImage}
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('OtherUserDetail', {
                                                userId: item?.User?._id,
                                            })
                                        }>
                                        <Row
                                            style={{
                                                gap: 5,
                                            }}>
                                            <Text style={styles.username}>
                                                {item?.User?.UserName}
                                            </Text>
                                            <Text style={styles.time}>
                                                {formatInstagramDate(item?.createdAt)}
                                            </Text>
                                        </Row>
                                        {/* {isVideo && (
                      <Text style={styles.audio}>{'Original audio'}</Text>
                    )} */}

                                        <Text style={styles.caption}>
                                            <Text style={styles.caption}>
                                                {item?.caption || 'No Caption Added'}
                                            </Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity
                            // onPress={() => }
                            >
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        // handleDoubleTap(item, index)

                                        const now = Date.now()
                                        const DOUBLE_PRESS_DELAY = 200

                                        if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
                                            triggerHeartAnimation(index)
                                            onLikeUnlike(item)
                                        } else {
                                            lastTap = now
                                            handlePostClick(item)
                                        }
                                    }}>
                                    <View style={{ position: 'relative', borderRadius: 13 }}>
                                        {isVideo ? (
                                            <View style={styles.videoContainer}>
                                                <Video
                                                    source={{ uri: mediaUrl }}
                                                    // style={styles.postImage}
                                                    style={[
                                                        styles.postImage,
                                                        {
                                                            // borderRadius: 13,
                                                            height: 170,
                                                        },
                                                    ]}
                                                    resizeMode='cover'
                                                    repeat={true}
                                                    muted={isMuted}
                                                    paused={
                                                        visibleVideoIndex !== index || pausedVideos[index]
                                                    }
                                                    onLoad={() => console.log(`Video ${index} loaded`)}
                                                    onError={error =>
                                                        console.log(`Video ${index} error:`, error)
                                                    }
                                                    onBuffer={() =>
                                                        console.log(`Video ${index} buffering`)
                                                    }
                                                />
                                            </View>
                                        ) : (
                                            <Image
                                                source={{ uri: mediaUrl }}
                                                style={styles.postImage}
                                                onError={error =>
                                                    console.log(`Image ${index} error:`, error)
                                                }
                                                resizeMode='cover'
                                            />
                                        )}

                                        <Animated.View
                                            pointerEvents='none'
                                            style={{
                                                position: 'absolute',
                                                top: '40%',
                                                left: '40%',
                                                opacity: doubleTapIndex === index ? heartOpacity : 0,
                                                transform: [{ scale: heartOpacity }],
                                            }}>
                                            <MaterialIcons name='favorite' size={100} color='red' />
                                        </Animated.View>

                                        {isVideo && (
                                            <>
                                                <TouchableOpacity
                                                    style={styles.soundButton}
                                                    onPress={() => setIsMuted(!isMuted)}>
                                                    {isMuted ? (
                                                        <SpeakerOff />
                                                    ) : (
                                                        <AntDesign name={'sound'} color='white' size={14} />
                                                    )}
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                </TouchableWithoutFeedback>
                            </TouchableOpacity>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <View style={styles.leftIcons}>
                                    <Row
                                        style={{
                                            // borderWidth: 0.5,
                                            borderColor: isDarkMode ? 'gray' : 'gray',
                                            borderRadius: 18,
                                            paddingHorizontal: 5,
                                            gap: 5,
                                            alignItems: 'center'
                                        }}>
                                        <TouchableOpacity
                                            style={{ right: 0 }}
                                            onPress={() => onLikeUnlike(item)}>
                                            {item?.likes?.includes(selector?._id) ? (
                                                // <MaterialIcons
                                                //   name={'favorite'}
                                                //   color={'red'}
                                                //   size={16}
                                                // />

                                                //                        name, 
                                                // size = 24, 
                                                // colors = ['#FF6B6B', '#4ECDC4'], 
                                                // iconType = 'MaterialIcons',
                                                <GradientIcon
                                                    colors={['#4F52FE', '#FC14CB']}
                                                    size={18}
                                                    iconType='Ionicons'
                                                    name={'triangle'}
                                                />
                                            ) : (
                                                // <MaterialIcons
                                                //   name={'favorite-border'}
                                                //   color={isDarkMode ? 'white' : 'black'}
                                                //   size={16}
                                                // />
                                                <GradientIcon
                                                    colors={['#4F52FE', '#FC14CB']}
                                                    size={18}
                                                    iconType='Feather'
                                                    name={'triangle'}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        <Text style={styles.likes}>
                                            {item?.TotalLikes}{' '}
                                            {/* {item?.TotalLikes > 1 ? 'likes' : 'like'} */}
                                        </Text>

                                        <TouchableOpacity
                                            style={{
                                                alignItems: 'center',
                                                gap: 5,
                                                flexDirection: 'row',
                                                // borderWidth: 0.5,
                                                borderColor: isDarkMode ? 'gray' : 'gray',
                                                borderRadius: 18,
                                                paddingHorizontal: 10,
                                            }}
                                            onPress={() => onDisLikes(item)}>
                                            {/* <Foundation
                      name={'dislike'}
                      color={isDarkMode ? 'white' : 'black'}
                      size={18}
                    /> */}
                                            <GradientIcon
                                                colors={['#4F52FE', '#FC14CB']}
                                                size={18}
                                                iconType='Feather'
                                                name={'triangle'}
                                                style={{
                                                    transform: [{ rotate: '180deg' }],
                                                }}
                                            />
                                            <Text style={{ ...styles.likes, fontSize: 13 }}>
                                                {item?.TotalUnLikes}
                                            </Text>
                                        </TouchableOpacity>
                                    </Row>
                                    <Row
                                        style={{
                                            // borderWidth: 0.5,
                                            borderColor: isDarkMode ? 'gray' : 'gray',
                                            borderRadius: 18,
                                            paddingHorizontal: 5,
                                            gap: 5
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalVisible(true)
                                                fetchCommentDataOfaPost(item?._id)
                                                setPostId(item?._id)
                                            }}>
                                            {isDarkMode ? (
                                                // <CommentWhite height={16} width={16} />
                                                <GradientIcon
                                                    colors={['#4F52FE', '#FC14CB']}
                                                    size={18}
                                                    iconType='FontAwesome'
                                                    name={'comment-o'}
                                                />
                                            ) : (
                                                // <CommentIcon height={16} width={16} />
                                                <GradientIcon
                                                    colors={['#4F52FE', '#FC14CB']}
                                                    size={18}
                                                    iconType='FontAwesome'
                                                    name={'comment-o'}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        <Text style={styles.comments}>{item?.TotalComents}</Text>
                                    </Row>
                                </View>

                                <Row style={{ gap: 20, marginRight: 6 }}>


                                    <TouchableOpacity
                                        style={{ right: 0 }}
                                        onPress={() => SavePost(item)}>
                                        {item?.SavedBy?.includes(selector?._id) ? (
                                            // <FontAwesome
                                            //   name={'bookmark'}
                                            //   // color={isDarkMode ? theme : theme}
                                            //   color={isDarkMode ? 'white' : 'black'}
                                            //   size={18}
                                            // />
                                            <GradientIcon
                                                colors={['#4F52FE', '#FC14CB']}
                                                size={18}
                                                iconType='FontAwesome'
                                                name={'bookmark'}

                                            />
                                        ) : (
                                            // <FontAwesome
                                            //   name={'bookmark-o'}
                                            //   color={isDarkMode ? 'white' : 'black'}
                                            //   size={18}
                                            // />
                                            <GradientIcon
                                                colors={['#4F52FE', '#FC14CB']}
                                                size={18}
                                                iconType='FontAwesome'
                                                name={'bookmark-o'}

                                            />
                                        )}
                                    </TouchableOpacity>
                                </Row>

                            </View>
                        </TouchableOpacity>
                    )
                }}
                ListEmptyComponent={
                    !loaderVisible && (
                        <CustomText
                            style={{
                                color: isDarkMode ? 'white' : 'black',
                                alignSelf: 'center',
                                marginTop: 50,
                                fontFamily: FONTS_FAMILY.OpenSans_Condensed_Medium,
                            }}>
                            No Post Found!
                        </CustomText>
                    )
                }
            />
        )
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : white,
        },
        storyContainer: {
            alignItems: 'center',
            marginRight: 12,
        },
        storyBorder: {
            width: 65,
            height: 65,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: '#0084ff',
            // borderColor: '#10B981',
            justifyContent: 'center',
            alignItems: 'center',
        },
        ownStoryBorder: {
            borderColor: 'transparent',
        },
        soundButton: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 10,
            borderRadius: 20,
        },
        storyImage: {
            width: 55,
            height: 55,
            borderRadius: 50,
        },
        storyText: {
            fontSize: 13,
            marginTop: 5,
            color: isDarkMode ? 'white' : '#000',
            width: 70,
            textAlign: 'center',
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
        videoContainer: {
            borderRadius: 20,
            // borderTopLeftRadius: 20,
            overflow: 'hidden', // This is crucial!
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
            borderBottomWidth: 0.3,
            borderBottomColor: '#ccc',
            paddingBottom: 10,
            backgroundColor: isDarkMode ? 'black' : 'white',
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
            color: isDarkMode ? 'white' : 'black',
        },
        audio: {
            color: isDarkMode ? 'white' : 'gray',
            fontSize: 12,
        },
        postImage: {
            width: '81%',
            height: 170,
            // resizeMode: 'cover',
            borderRadius: 13,
            alignSelf: 'flex-end',
            marginRight: 10,
        },
        actions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 8,
            marginHorizontal: 10,
            paddingBottom: 10,
            width: '81%',
            alignSelf: 'flex-end',
        },
        leftIcons: {
            flexDirection: 'row',
            gap: 15,
        },
        likes: {
            // fontWeight: 'bold',
            paddingHorizontal: 3,
            color: isDarkMode ? 'white' : 'black',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            // bottom: 2,
            fontSize: 13,
        },
        caption: {
            paddingHorizontal: 2,
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? 'white' : 'black',
            width: 280,
            // padding: 10,
        },
        comments: {
            paddingHorizontal: 3,
            color: isDarkMode ? 'white' : 'black',
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            fontSize: 13,
        },
        time: {
            // paddingHorizontal: 10,
            color: 'gray',
            fontSize: 12,
            marginTop: 0,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
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
                    onEditComment={(id, text) => editComments(id, text)}
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
            <PostDetailModal
                visible={postDetailVisible}
                onClose={() => {
                    setPostDetailVisible(false)
                    setSelectedPost(null)
                }}
                setPost={setSelectedPost}
                post={selectedPost}
                comments={comments}
                isDarkMode={isDarkMode}
                selector={selector}
                onLikeUnlike={post => onLikeUnlike(post)}
                onDisLikes={onDisLikes}
                SavePost={SavePost}
                onAddComment={(id, commentText) => { sendComments(postId, commentText); setCommentText('') }}
                formatInstagramDate={formatInstagramDate}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
            />

        </View>
    )
}

export default AllPostOfAUser;


