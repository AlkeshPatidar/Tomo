import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, TouchableWithoutFeedback, TextInput } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { AddStoryIcon, CameraButton, CommentIcon, CommentWhite, NotiFication, PostShareWhite, ShareIcon, SpeakerOff, ThreeDotIcon, WhiteThreeDot } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import { useSelector } from "react-redux";
import Video from "react-native-video";
import { apiDelete, apiGet, apiPost } from "../../utils/Apis";
import urls from "../../config/urls";
import { white } from "../../common/Colors/colors";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useLoader from "../../utils/LoaderHook";
import { useIsFocused } from "@react-navigation/native";
import CommentModal from "./CommentModel";


const Home = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    // const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
    const storyOpacity = useRef(new Animated.Value(0)).current;
    const feedTranslateY = useRef(new Animated.Value(20)).current;

    // const animatedValues = useRef(feedData.map(() => new Animated.Value(0))).current;
    // Ensure feedData is available and has valid items

    const [loading, setLoading] = useState(false)
    const [allPosts, setAllPosts] = useState([])
    const [allStories, setAllStories] = useState([])
    const [followedStories, setFollowedStories] = useState([])

    const [doubleTapIndex, setDoubleTapIndex] = useState(null);
    const heartOpacity = useRef(new Animated.Value(0)).current;

    const [modalVisible, setModalVisible] = useState(false);
    const [postId, setPostId] = useState(null);

    const [commentText, setCommentText] = useState('');

    const animatedValues = useRef(feedData?.map(() => new Animated.Value(0)) ?? []).current;


    const [comments, setComments] = useState([])


    const [isMuted, setIsMuted] = useState(false);
    const loaderVisible = useSelector(state => state?.loader?.loader);

    const { showLoader, hideLoader } = useLoader()

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
        getCurrentStories()
        getFollwedStories()
    }, [isFocused])


    const fetchCommentDataOfaPost = async (id) => {
        console.log('--------------', id);

        const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
        setComments(res?.data)
        console.log(res, 'Coemments data');

    }

    const sendComments = async (id, text) => {
        console.log('---------___++++++++++++-----', id);

        const data = {
            Post: id,
            text: text
        }
        const res = await apiPost(`${urls.sendCommentOnPost}`, data)
        fetchCommentDataOfaPost(id)

    }



    const fetchData = async () => {
        showLoader()
        const res = await apiGet(urls.getAllPost)
        console.log(res,'=================');
        
        setAllPosts(res?.data)
        hideLoader()
    }

    const getCurrentStories = async () => {
        console.log("Selector", selector?._id);

        setLoading(true);
        try {
            const res = await apiGet(urls.getCurrentStories);
            console.log("Fetched Stories:::::::::::", res.data);
            setAllStories(res?.data)




        } catch (error) {
            console.error("Error fetching stories:", error);
        }
        setLoading(false);
    };

    const getFollwedStories = async () => {
        console.log("Selector", selector?._id);

        setLoading(true);
        try {
            const res = await apiGet(urls.followedUserStories);
            console.log("Fetched Stories:::::::::::", res.data);
            setFollowedStories(res?.data)

        } catch (error) {
            console.error("Error fetching stories:", error);
        }
        setLoading(false);
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

        // Call API in background
        try {
            const endPoint = item?.SavedBy?.includes(userId)
                ? `${urls.removeSavedPost}/${postId}`
                : `${urls.SavePost}/${postId}`;

            const res = await apiGet(endPoint);
            console.log("-------------SAVE API SUCCESS----", res.data);
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
            console.log("Like/Unlike updated on server");
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

    const onDeleteComments = async (id) => {
        try {
            showLoader();
            const response = await apiDelete(`/api/user/DeleteComment/${id}`);
            console.log('DeletePost::', response);
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
                                onPress={() => navigation.navigate('StoryScreen', { storyImage: allStories })}
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
                        {followedStories?.map((item) => {
                            if (item?.User?.Stories?.length > 0) {
                                return (
                                    <View key={item.id} style={styles.storyContainer}>
                                        <TouchableOpacity
                                            style={[styles.storyBorder, item.isOwn && styles.ownStoryBorder]}
                                            onPress={() => navigation.navigate('StoryScreen', { storyImage: item.User?.Stories, User: item?.User })}
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

    // const renderFeeds = () => {
    //     return (
    //         <FlatList
    //             data={allPosts}
    //             style={{ marginBottom: 90 }}
    //             keyExtractor={(item) => item.id}
    //             showsVerticalScrollIndicator={false}
    //             renderItem={({ item, index }) => {
    //                 handleAnimation(index);

    //                 const animatedStyle = {
    //                     opacity: animatedValues[index],
    //                     transform: [
    //                         {
    //                             translateY: animatedValues[index].interpolate({
    //                                 inputRange: [0, 1],
    //                                 outputRange: [20, 0], // Slide up effect
    //                             }),
    //                         },
    //                     ],
    //                 };
    //                 const mediaUrl = item.media; // Use a consistent key for media
    //                 const isVideo = typeof mediaUrl === "string" && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov"));

    //                 return (
    //                     <Animated.View style={[styles.feedContainer, animatedStyle]}>
    //                         {/* Header */}
    //                         <View style={styles.header}>
    //                             <View style={styles.userInfo}>
    //                                 <Image source={item?.User?.Image ? { uri: item?.User?.Image } : IMG.MessageProfile} style={styles.profileImage} />
    //                                 <TouchableOpacity onPress={() => navigation.navigate('OtherUserDetail')}>
    //                                     <Text style={styles.username}>{item?.User?.UserName}</Text>
    //                                     <Text style={styles.audio}>{isVideo ? 'Original audio' : ''}</Text>
    //                                 </TouchableOpacity>
    //                             </View>
    //                             <TouchableOpacity>
    //                                 {isDarkMode ? <WhiteThreeDot /> : <ThreeDotIcon />}
    //                             </TouchableOpacity>
    //                         </View>
    //                         <TouchableWithoutFeedback onPress={() => handleDoubleTap(item, index)}>
    //                             <View style={{ position: 'relative' }}>
    //                                 {isVideo ? (
    //                                     <Video
    //                                         source={{ uri: item?.media }}
    //                                         style={styles.postImage}
    //                                         resizeMode="cover"
    //                                         repeat
    //                                         muted={isMuted}
    //                                     />
    //                                 ) : (
    //                                     <Image source={{ uri: item?.media }} style={styles.postImage} />
    //                                 )}

    //                                 <Animated.View
    //                                     pointerEvents="none"
    //                                     style={{
    //                                         position: 'absolute',
    //                                         top: '40%',
    //                                         left: '40%',
    //                                         opacity: doubleTapIndex === index ? heartOpacity : 0,
    //                                         transform: [{ scale: heartOpacity }],
    //                                     }}
    //                                 >
    //                                     <MaterialIcons name="favorite" size={100} color="red" />
    //                                 </Animated.View>

    //                                 {isVideo && (
    //                                     <TouchableOpacity
    //                                         style={styles.soundButton}
    //                                         onPress={() => setIsMuted(!isMuted)}
    //                                     >
    //                                         {isMuted ? <SpeakerOff /> : (
    //                                             <AntDesign
    //                                                 name={'sound'}
    //                                                 color={isDarkMode ? 'white' : 'black'}
    //                                                 size={14}
    //                                             />
    //                                         )}
    //                                     </TouchableOpacity>
    //                                 )}
    //                             </View>
    //                         </TouchableWithoutFeedback>


    //                         {/* Actions */}
    //                         <View style={styles.actions}>
    //                             <View style={styles.leftIcons}>

    //                                 <TouchableOpacity style={{ right: 0 }}
    //                                     onPress={() => onLikeUnlike(item)}
    //                                 >
    //                                     {item?.likes?.includes(selector?._id) ? (
    //                                         isDarkMode ? <MaterialIcons name={'favorite'} color={'white'}
    //                                             size={24}
    //                                         />
    //                                             : <MaterialIcons name={'favorite-border'} color={'black'}
    //                                                 size={24} />
    //                                     ) : (
    //                                         isDarkMode ? <MaterialIcons name={'favorite-border'} color={'white'} size={24}
    //                                         /> : <MaterialIcons name={'favorite-border'} color={'black'} size={24}
    //                                         />
    //                                     )}
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity
    //                                     onPress={() => {
    //                                         // setSelectedPost(item);
    //                                         setModalVisible(true);
    //                                         fetchCommentDataOfaPost(item?._id)
    //                                         setPostId(item?._id)

    //                                     }}
    //                                 >
    //                                     {isDarkMode ? <CommentWhite /> : <CommentIcon />}
    //                                 </TouchableOpacity>
    //                                 <TouchableOpacity>
    //                                     {isDarkMode ? <PostShareWhite /> : <ShareIcon />}
    //                                 </TouchableOpacity>
    //                             </View>


    //                             <TouchableOpacity style={{ right: 0 }}
    //                                 onPress={() => SavePost(item)}
    //                             >
    //                                 {item?.SavedBy?.includes(selector?._id) ? (
    //                                     isDarkMode ? <FontAwesome name={'bookmark'} color={'white'}
    //                                         size={24}
    //                                     />
    //                                         : <FontAwesome name={'bookmark'} color={'black'}
    //                                             size={24} />
    //                                 ) : (
    //                                     isDarkMode ? <FontAwesome name={'bookmark-o'} color={'white'} size={24}
    //                                     /> : <FontAwesome name={'bookmark-o'} color={'black'} size={24}
    //                                     />
    //                                 )}
    //                             </TouchableOpacity>
    //                         </View>

    //                         {/* Likes */}
    //                         <Text style={styles.likes}>{item?.TotalLikes} likes</Text>

    //                         {/* Caption */}
    //                         <Text style={styles.caption}>
    //                             <Text style={styles.username}>{item?.caption || 'View from Falcon 9’s second stage during an orbital sunset'} </Text>
    //                             {item.caption}
    //                         </Text>

    //                         {/* Comments */}
    //                         <Text style={styles.comments}>View all{item?.TotalComents}comments</Text>

    //                         {/* Time */}
    //                         <Text style={styles.time}>{item?.createdAt}</Text>
    //                     </Animated.View>
    //                 );
    //             }}
    //             ListEmptyComponent={!loaderVisible && <CustomText style={{
    //                 color: isDarkMode ? 'white' : 'black',
    //                 alignSelf: 'center',
    //                 marginTop: 50,
    //                 fontFamily: FONTS_FAMILY.OpenSans_Condensed_Medium
    //             }}>No Post Found!</CustomText>}
    //         />
    //     );
    // };

    const renderFeeds = () => {
        return (
            <FlatList
                data={allPosts}
                style={{ marginBottom: 90 }}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    const mediaUrl = item.media; // Use a consistent key for media
                    const isVideo = typeof mediaUrl === "string" && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov"));
    
                    return (
                        <View style={styles.feedContainer}>
                            {/* Header */}
                            <View style={styles.header}>
                                <View style={styles.userInfo}>
                                    <Image source={item?.User?.Image ? { uri: item?.User?.Image } : IMG.MessageProfile} style={styles.profileImage} />
                                    <TouchableOpacity onPress={() => navigation.navigate('OtherUserDetail')}>
                                        <Text style={styles.username}>{item?.User?.UserName}</Text>
                                        <Text style={styles.audio}>{isVideo ? 'Original audio' : ''}</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity>
                                    {isDarkMode ? <WhiteThreeDot /> : <ThreeDotIcon />}
                                </TouchableOpacity>
                            </View>
    
                            <TouchableWithoutFeedback onPress={() => handleDoubleTap(item, index)}>
                                <View style={{ position: 'relative' }}>
                                    {isVideo ? (
                                        <Video
                                            source={{ uri: item?.media }}
                                            style={styles.postImage}
                                            resizeMode="cover"
                                            repeat
                                            muted={isMuted}
                                        />
                                    ) : (
                                        <Image source={{ uri: item?.media }} style={styles.postImage} />
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
                                        {item?.likes?.includes(selector?._id) ? (
                                            isDarkMode ? <MaterialIcons name={'favorite'} color={'white'} size={24} />
                                                : <MaterialIcons name={'favorite-border'} color={'black'} size={24} />
                                        ) : (
                                            isDarkMode ? <MaterialIcons name={'favorite-border'} color={'white'} size={24} />
                                                : <MaterialIcons name={'favorite-border'} color={'black'} size={24} />
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
                                    <TouchableOpacity>
                                        {isDarkMode ? <PostShareWhite /> : <ShareIcon />}
                                    </TouchableOpacity>
                                </View>
    
                                <TouchableOpacity
                                    style={{ right: 0 }}
                                    onPress={() => SavePost(item)}
                                >
                                    {item?.SavedBy?.includes(selector?._id) ? (
                                        isDarkMode ? <FontAwesome name={'bookmark'} color={'white'} size={24} />
                                            : <FontAwesome name={'bookmark'} color={'black'} size={24} />
                                    ) : (
                                        isDarkMode ? <FontAwesome name={'bookmark-o'} color={'white'} size={24} />
                                            : <FontAwesome name={'bookmark-o'} color={'black'} size={24} />
                                    )}
                                </TouchableOpacity>
                            </View>
    
                            {/* Likes */}
                            <Text style={styles.likes}>{item?.TotalLikes} likes</Text>
    
                            {/* Caption */}
                            <Text style={styles.caption}>
                                <Text style={styles.username}>{item?.caption || 'View from Falcon 9’s second stage during an orbital sunset'}</Text>
                                {item.caption}
                            </Text>
    
                            {/* Comments */}
                            <Text style={styles.comments}>View all {item?.TotalComents} comments</Text>
    
                            {/* Time */}
                            <Text style={styles.time}>{item?.createdAt}</Text>
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




    const renderCommentModal = () => {
        return (
            <>
                <CommentModal
                    isVisible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    comments={comments}
                    isDarkMode={isDarkMode}
                    commentText={commentText}
                    onChangeText={setCommentText}
                    onSendPress={() => {
                        console.log('Send:', commentText);
                        // Add logic to post comment here
                        setCommentText('');
                        sendComments(postId, commentText)
                    }}
                    onDeleteComments={(id) => { onDeleteComments(id) }}
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
            {renderFeeds()}
            {renderCommentModal()}

        </View>
    )
}

export default Home;






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
