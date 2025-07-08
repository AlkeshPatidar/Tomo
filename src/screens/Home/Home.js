import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, TextInput, BackHandler, Alert } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { AddStoryIcon, CameraButton, CommentIcon, CommentWhite, NotiFication, PostShareWhite, ShareIcon, SpeakerOff, ThreeDotIcon, WhiteThreeDot } from "../../assets/SVGs";
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
import CommentModal from "./CommentModel";
import moment from "moment";
import FeedShimmerLoader from "../../components/Skeletons/FeedsShimmer";
import ProfileShimmer from "../../components/Skeletons/ProfilePageShimmer";

const Home = ({ navigation }) => {
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
    const [isMuted, setIsMuted] = useState(true);
    const [visibleVideoIndex, setVisibleVideoIndex] = useState(0); // Track which video should play
    const [pausedVideos, setPausedVideos] = useState({}); // Track paused state for each video
    const loaderVisible = useSelector(state => state?.loader?.loader);

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
        
        // Reset values for fresh animation
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
            
            Animated.sequence([
                Animated.timing(heartScale, {
                    toValue: 1.2,
                    duration: 300, 
                    useNativeDriver: true,
                }),
                Animated.timing(heartScale, {
                    toValue: 0,
                    duration: 500, 
                    useNativeDriver: true,
                })
            ])
        ]).start();
    };

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

    // Handle video visibility in FlatList
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
        Animated.timing(storyOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        Animated.timing(feedTranslateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        fetchData()
        getCurrentStories()
        getFollwedStories()
    }, [])

    useEffect(() => {
        getCurrentStories()
        getFollwedStories()
    }, [isFocused])

    const onRefresh = async () => {
        setLoading(true)
        await fetchData()
        await getCurrentStories()
        await getFollwedStories()
        setLoading(false)
    }

    const fetchCommentDataOfaPost = async (id) => {
        const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
        setComments(res?.data)
    }

    const sendComments = async (id, text) => {
        const data = {
            Post: id,
            text: text
        }
        const res = await apiPost(`${urls.sendCommentOnPost}`, data)
        fetchCommentDataOfaPost(id)
    }

    const editComments = async (id, text) => {
        const data = {
            text: text
        }
        const res = await apiPut(`${urls.editComment}/${id}`, data)
        fetchCommentDataOfaPost(postId)
    }

    const formatInstagramDate = (dateString) => {
        const date = moment(dateString);
        const now = moment();

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
        const res = await apiGet(urls.getAllPost)
        setAllPosts(res?.data)
        setLoading(false)
    }

    const getCurrentStories = async () => {
        console.log("Selector", selector?._id);
        try {
            const res = await apiGet(urls.getCurrentStories);
            setAllStories(res?.data)
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    };

    const getFollwedStories = async () => {
        console.log("Selector", selector?._id);
        try {
            const res = await apiGet(urls.followedUserStories);
            setFollowedStories(res?.data)
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    };

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

        try {
            const endPoint = item?.SavedBy?.includes(userId)
                ? `${urls.removeSavedPost}/${postId}`
                : `${urls.SavePost}/${postId}`;

            const res = await apiGet(endPoint);
        } catch (error) {
            console.log("Save Post Error:", error);
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
                    onPress={() => navigation.navigate('GalleryForAddPost')}
                >
                    <CameraButton />
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Explore</CustomText>

                <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
                    <NotiFication />
                </TouchableOpacity>
            </SpaceBetweenRow>
        )
    }

    const renderStories = () => {
        return (
            <Row style={{
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: 'rgba(219, 219, 219, 1)',
            }}>
                <Animated.View
                    style={{
                        paddingVertical: 10,
                        backgroundColor: isDarkMode ? 'black' : 'rgba(245, 245, 248, 1)',
                        opacity: storyOpacity,
                    }}
                >
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10 }}

                    >
                        {/* Your Story */}
                        <View style={styles.storyContainer}>
                            <TouchableOpacity
                                style={[styles.storyBorder, styles.ownStoryBorder]}
                                onPress={() => navigation.navigate('StoryScreen', { storyImage: allStories, User: selector })}
                            >
                                <Image
                                    source={
                                        allStories[0]?.media ? { uri: allStories[0]?.media } : IMG.AddStoryImage
                                    }
                                    style={styles.storyImage}
                                />
                            </TouchableOpacity>
                            <Text style={styles.storyText} numberOfLines={1}>{'Your Story'}</Text>
                            <TouchableOpacity
                                style={{ position: 'absolute', bottom: 20, right: 10 }}
                                onPress={() => navigation.navigate('GalleryPickerScreen')}
                            >
                                <AddStoryIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Followed Stories */}
                        {followedStories?.map((item, index) => {
                             const key = item?._id || `story-${index}`;
                            if (item?.User?.Stories?.length > 0) {
                                return (
                                    <View key={key} style={styles.storyContainer} >
                                        <TouchableOpacity
                                            style={[styles.storyBorder, item.isOwn && styles.ownStoryBorder]}
                                            onPress={() => navigation.navigate('StoryScreen', { storyImage: item.User?.Stories, User: item?.User })}
                                             key={key}
                                        >
                                            <Image
                                                source={
                                                    item.User?.Stories?.length > 0
                                                        ? { uri: item.User?.Stories[0]?.media }
                                                        : IMG.AddStoryImage
                                                }
                                                style={styles.storyImage}
                                            />
                                        </TouchableOpacity>
                                        <Text style={styles.storyText} numberOfLines={1}>
                                            {item?.User?.UserName}
                                        </Text>
                                    </View>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ScrollView>
                </Animated.View>
            </Row>
        );
    };

    const renderFeeds = () => {
        return (
            <FlatList
                data={allPosts}
                style={{ marginBottom: 90 }}
                keyExtractor={(item, index) => `${item._id}-${index}`} // Better key extractor
                showsVerticalScrollIndicator={false}
                onRefresh={onRefresh}
                refreshing={loading}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item, index }) => {
                    const mediaUrl = item.media;
                    const isVideo = typeof mediaUrl === "string" && 
                        (mediaUrl.includes('.mp4') || mediaUrl.includes('.mov') || 
                         mediaUrl.includes('video') || mediaUrl.includes('.avi'));

                    return (
                        <View style={styles.feedContainer} key={`${item._id}-${index}`}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.userInfo}>
                                    <Image 
                                        source={item?.User?.Image ? { uri: item?.User?.Image } : IMG.MessageProfile} 
                                        style={styles.profileImage} 
                                    />
                                    <TouchableOpacity onPress={() => navigation.navigate('OtherUserDetail', { userId: item?.User?._id })}>
                                        <Text style={styles.username}>{item?.User?.UserName}</Text>
                                        {isVideo && <Text style={styles.audio}>{'Original audio'}</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableWithoutFeedback onPress={() => handleDoubleTap(item, index)}>
                                <View style={{ position: 'relative' }}>
                                    {isVideo ? (
                                        <Video
                                            source={{ uri: mediaUrl }}
                                            style={styles.postImage}
                                            resizeMode="cover"
                                            repeat={true}
                                            muted={isMuted}
                                            paused={visibleVideoIndex !== index || pausedVideos[index]}
                                            onLoad={() => console.log(`Video ${index} loaded`)}
                                            onError={(error) => console.log(`Video ${index} error:`, error)}
                                            onBuffer={() => console.log(`Video ${index} buffering`)}
                                        />
                                    ) : (
                                        <Image 
                                            source={{ uri: mediaUrl }} 
                                            style={styles.postImage}
                                            onError={(error) => console.log(`Image ${index} error:`, error)}
                                            resizeMode="cover"
                                        />
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
                                        <>
                                            {/* Play/Pause Button */}
                                            {/* <TouchableOpacity
                                                style={[styles.soundButton, { left: 20 }]}
                                                onPress={() => {
                                                    setPausedVideos(prev => ({
                                                        ...prev,
                                                        [index]: !prev[index]
                                                    }));
                                                }}
                                            >
                                                <MaterialIcons 
                                                    name={pausedVideos[index] ? "play-arrow" : "pause"} 
                                                    size={20} 
                                                    color="white" 
                                                />
                                            </TouchableOpacity> */}

                                            {/* Sound Button */}
                                            <TouchableOpacity
                                                style={styles.soundButton}
                                                onPress={() => setIsMuted(!isMuted)}
                                            >
                                                {isMuted ? <SpeakerOff /> : (
                                                    <AntDesign
                                                        name={'sound'}
                                                        color="white"
                                                        size={14}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        </>
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
                                        {item?.likes?.includes(selector?._id) ? (
                                            <MaterialIcons name={'favorite'} color={'red'} size={25} />
                                        ) : (
                                            <MaterialIcons name={'favorite-border'} color={isDarkMode ? 'white' : 'black'} size={25} />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setModalVisible(true);
                                            fetchCommentDataOfaPost(item?._id)
                                            setPostId(item?._id)
                                        }}
                                    >
                                        {isDarkMode ? <CommentWhite /> : <CommentIcon />}
                                    </TouchableOpacity>
                                </View>

                                <Row style={{ gap: 20 }}>
                                    <TouchableOpacity style={{ alignItems: 'center', gap: 0, flexDirection: 'row' }}
                                        onPress={() => onDisLikes(item)}
                                    >
                                        <Foundation name={'dislike'} color={isDarkMode ? 'white' : 'black'} size={30} />
                                        <Text style={styles.likes}>{item?.TotalUnLikes}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{ right: 0 }}
                                        onPress={() => SavePost(item)}
                                    >
                                        {item?.SavedBy?.includes(selector?._id) ? (
                                            <FontAwesome name={'bookmark'} color={isDarkMode ? 'white' : 'black'} size={24} />
                                        ) : (
                                            <FontAwesome name={'bookmark-o'} color={isDarkMode ? 'white' : 'black'} size={24} />
                                        )}
                                    </TouchableOpacity>
                                </Row>
                            </View>
                            <Text style={styles.likes}>{item?.TotalLikes} {item?.TotalLikes > 1 ? 'likes' : 'like'}</Text>
                            <Text style={styles.caption}>
                                <Text style={styles.username}>{item?.caption || 'No Caption Added'}</Text>
                            </Text>
                            <Text style={styles.comments}>{item?.TotalComents} comments</Text>
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
            {renderStories()}
            {loading ? <FeedShimmerLoader isDarkMode={isDarkMode} count={5} /> :
                renderFeeds()}
            {renderCommentModal()}

        </View>
    )
}

export default Home;


