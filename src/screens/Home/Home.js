
// import React, { useEffect, useRef, useState } from 'react'
// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Animated,
//   TouchableWithoutFeedback,
//   TextInput,
//   BackHandler,
//   Alert,
//   Platform,
//   PermissionsAndroid,
//   Linking,
// } from 'react-native'
// import CustomText from '../../components/TextComponent'
// import IMG from '../../assets/Images'
// import Row from '../../components/wrapper/row'
// import LocationManager from '../../utils/LocationManager'
// import {
//   AddStoryIcon,
//   BellIcon,
//   CameraButton,
//   NotiFication,
//   SpeakerOff,
// } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import { useDispatch, useSelector } from 'react-redux'
// import Video from 'react-native-video'
// import { apiDelete, apiGet, apiPost, apiPut, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import { theme, white } from '../../common/Colors/colors'
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import useLoader from '../../utils/LoaderHook'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import CommentModal from './CommentModel'
// import moment from 'moment'
// import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
// import messaging from '@react-native-firebase/messaging'
// import PostDetailModal from './PostDetailModel'
// import { setUser } from '../../redux/reducer/user'
// import GradientIcon from '../../components/GradientIcon'
// import LinearGradient from 'react-native-linear-gradient'
// import { formatInstagramDate } from '../../utils/DateFormat'



// const Home = ({ navigation }) => {
//   const { isDarkMode } = useSelector(state => state.theme)
//   const storyOpacity = useRef(new Animated.Value(0)).current
//   const feedTranslateY = useRef(new Animated.Value(20)).current
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [allStories, setAllStories] = useState([])
//   const [followedStories, setFollowedStories] = useState([])
//   const [doubleTapIndex, setDoubleTapIndex] = useState(null)
//   const heartOpacity = useRef(new Animated.Value(0)).current
//   const [modalVisible, setModalVisible] = useState(false)
//   const [postId, setPostId] = useState(null)
//   const [commentText, setCommentText] = useState('')
//   const [comments, setComments] = useState([])
//   const [isMuted, setIsMuted] = useState(true)
//   const [visibleVideoIndex, setVisibleVideoIndex] = useState(0)
//   const [pausedVideos, setPausedVideos] = useState({})
//   const loaderVisible = useSelector(state => state?.loader?.loader)
//   const dispatch = useDispatch()

//   const { showLoader, hideLoader } = useLoader()

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   const [selectedPost, setSelectedPost] = useState(null)
//   const [postDetailVisible, setPostDetailVisible] = useState(false)
//   const [locationStatus, setLocationStatus] = useState('idle')
//   const [selectedTab, setSelectedTab] = useState('home')
//   // NEW: State for advertisements and news
//   const [advertisements, setAdvertisements] = useState([])
//   const [mergedFeedData, setMergedFeedData] = useState([])
//   const [currentAdImageIndex, setCurrentAdImageIndex] = useState({})
//   const [newsData, setNewsData] = useState([])

//   // NEW: Fetch advertisements
//   const fetchAdvertisements = async () => {
//     try {
//       const res = await apiGet('/api/admin/GetAllActiveAdvertisement')
//       if (res?.data) {
//         setAdvertisements(res.data)
//         const initialAdImageIndex = {}
//         res.data.forEach(ad => {
//           initialAdImageIndex[ad._id] = 0
//         })
//         setCurrentAdImageIndex(initialAdImageIndex)
//       }
//     } catch (error) {
//       console.error('Error fetching advertisements:', error)
//     }
//   }
//   // NEW: Fetch news data
//   const fetchNewsData = async () => {
//     try {
//       const res = await apiGet('/api/admin/GetAllPublishedNews')
//       if (res?.data) {
//         setNewsData(res.data)
//       }
//     } catch (error) {
//       console.error('Error fetching news:', error)
//     }
//   }
//   // NEW: Function to merge posts and ads
//   const mergeFeedWithAds = (posts, ads) => {
//     if (!ads || ads.length === 0) {
//       return posts.map(post => ({ type: 'post', data: post }))
//     }

//     const merged = []
//     const adInterval = 3 // Show ad after every 3 posts
//     let adIndex = 0

//     posts.forEach((post, index) => {
//       merged.push({ type: 'post', data: post })
//       // Insert ad after every adInterval posts
//       if ((index + 1) % adInterval === 0 && adIndex < ads.length) {
//         merged.push({ type: 'ad', data: ads[adIndex] })
//         adIndex = (adIndex + 1) % ads.length // Cycle through ads
//       }
//     })

//     return merged
//   }
//   // NEW: Handle ad image carousel
//   const handleAdImageNext = (adId, totalImages) => {
//     setCurrentAdImageIndex(prev => ({
//       ...prev,
//       [adId]: (prev[adId] + 1) % totalImages
//     }))
//   }

//   const handleAdImagePrev = (adId, totalImages) => {
//     setCurrentAdImageIndex(prev => ({
//       ...prev,
//       [adId]: prev[adId] === 0 ? totalImages - 1 : prev[adId] - 1
//     }))
//   }

//   // NEW: Handle ad click
//   const handleAdClick = (ad) => {
//     if (ad.url) {
//       Linking.openURL(ad.url).catch(err =>
//         console.error('Failed to open URL:', err)
//       )
//     }
//   }

//   const handlePostClick = item => {
//     console.log('_______________+')
//     setSelectedPost(item)
//     setPostDetailVisible(true)
//     fetchCommentDataOfaPost(item._id)
//   }



//   useFocusEffect(() => {
//     const backAction = () => {
//       Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
//         {
//           text: 'Cancel',
//           onPress: () => null,
//           style: 'cancel',
//         },
//         {
//           text: 'EXIT',
//           onPress: () => BackHandler.exitApp(),
//         },
//       ])
//       return true
//     }
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     )
//     return () => backHandler.remove()
//   })

//   useEffect(() => {
//     initializeFirebase()
//   }, [])

//   const initializeFirebase = async () => {
//     try {
//       console.log('Initializing Firebase...')
//       await requestNotificationPermission()
//     } catch (error) {
//       console.error('Firebase initialization error:', error)
//       Alert.alert('Error', `Firebase setup failed: ${error.message}`)
//     }
//   }

//   const requestNotificationPermission = async () => {
//     try {
//       let hasPermission = false

//       if (Platform.OS === 'android') {
//         if (Platform.Version >= 33) {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           )
//           hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED
//         } else {
//           hasPermission = true
//         }
//       } else {
//         const authStatus = await messaging().requestPermission()
//         hasPermission =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL
//       }

//       if (hasPermission) {
//         console.log('Permission granted')
//         await getFCMToken()
//       } else {
//         console.log('Permission denied')
//         Alert.alert('Permission Required', 'Please enable notifications')
//       }
//     } catch (error) {
//       console.error('Permission error:', error)
//       Alert.alert('Error', `Permission failed: ${error.message}`)
//     }
//   }

//   const getFCMToken = async () => {
//     try {
//       console.log('Getting FCM token...')

//       if (!messaging().isDeviceRegisteredForRemoteMessages) {
//         await messaging().registerDeviceForRemoteMessages()
//       }

//       const fcmToken = await messaging().getToken()

//       if (fcmToken) {
//         console.log('FCM Token:', fcmToken)
//       } else {
//         throw new Error('No FCM token received')
//       }
//     } catch (error) {
//       console.error('FCM Token Error:', error)
//     }
//   }

//   const triggerHeartAnimation = index => {
//     setDoubleTapIndex(index)

//     heartOpacity.setValue(0)
//     heartScale.setValue(0)

//     Animated.parallel([
//       Animated.sequence([
//         Animated.timing(heartOpacity, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(heartOpacity, {
//           toValue: 0,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ]),

//       Animated.sequence([
//         Animated.timing(heartScale, {
//           toValue: 1.2,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(heartScale, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start()
//   }

//   const heartScale = useRef(new Animated.Value(0)).current

//   let lastTap = null


//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       setVisibleVideoIndex(viewableItems[0].index)
//     }
//   }).current

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 50,
//   }).current

//   const isFocused = useIsFocused()

//   useEffect(() => {
//     Animated.timing(storyOpacity, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start()

//     Animated.timing(feedTranslateY, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start()
//   }, [])

//   useEffect(() => {
//     fetchData()
//     getCurrentStories()
//     getFollwedStories()
//     initializeLocation()
//     fetchAdvertisements()
//     fetchNewsData()
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = await getItem('token');
//       setLoading(true);

//       try {
//         if (token) {
//           const getUserDetails = await apiGet(urls.userProfile);
//           dispatch(setUser(JSON.stringify(getUserDetails?.data)));
//           setLoading(false);
//         } else {
//           navigation.replace('Onboarding');
//           setLoading(false);
//         }
//       } catch (error) {
//         console.log('Fetch data error:', error);
//         navigation.replace('Onboarding');
//         setLoading(false);
//       }
//     };

//     LocationManager.setLocationUpdateCallback(fetchData);
//     LocationManager.initializeLocationTracking();

//     return () => {
//       LocationManager.setLocationUpdateCallback(null);
//       LocationManager.stopLocationTracking();
//     };
//   }, []);

//   const initializeLocation = async () => {
//     try {
//       setLocationStatus('updating');
//       await LocationManager.initializeLocationTracking();
//       setLocationStatus('updated');

//       setTimeout(() => setLocationStatus('idle'), 2000);
//     } catch (error) {
//       console.log('Location initialization failed:', error);
//       setLocationStatus('error');
//       setTimeout(() => setLocationStatus('idle'), 3000);
//     }
//   }

//   const updateLocationOnFocus = async () => {
//     try {
//       await LocationManager.checkAndUpdateLocation();
//     } catch (error) {
//       console.log('Foreground location update failed:', error);
//     }
//   }

//   useEffect(() => {
//     return () => {
//       LocationManager.stopLocationTracking();
//     }
//   }, [])

//   useEffect(() => {
//     getCurrentStories()
//     getFollwedStories()
//     if (isFocused) {
//       updateLocationOnFocus()
//     }
//   }, [isFocused])

//   useEffect(() => {
//     let dataToMerge = []

//     if (selectedTab === 'News') {
//       // Use news data for News tab
//       dataToMerge = newsData
//     } else {
//       // Use filtered posts for Home and Top25 tabs
//       const filteredPosts = allPosts.filter(item => {
//         const hasImage = item?.media && !item?.media.toLowerCase().includes('.mp4');
//         const isTop25 = selectedTab === 'Top25' ? item?.TotalLikes > 25 : true;
//         return hasImage && isTop25;
//       });
//       dataToMerge = filteredPosts
//     }

//     const merged = mergeFeedWithAds(dataToMerge, advertisements);
//     setMergedFeedData(merged);
//   }, [allPosts, advertisements, selectedTab, newsData]);

//   const onRefresh = async () => {
//     setLoading(true)
//     await fetchData()
//     await getCurrentStories()
//     await getFollwedStories()
//     await fetchAdvertisements()
//     await fetchNewsData()
//     setLoading(false)
//   }

//   const fetchCommentDataOfaPost = async id => {
//     const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
//     setComments(res?.data)
//   }

//   const sendComments = async (id, text) => {
//     const data = {
//       Post: id,
//       text: text,
//     }
//     const res = await apiPost(`${urls.sendCommentOnPost}`, data)
//     fetchCommentDataOfaPost(id)
//   }

//   const editComments = async (id, text) => {
//     const data = {
//       text: text,
//     }
//     const res = await apiPut(`${urls.editComment}/${id}`, data)
//     fetchCommentDataOfaPost(postId)
//   }



//   const fetchData = async () => {
//     setLoading(true)
//     const res = await apiGet(urls.getAllPost)
//     setAllPosts(res?.data)
//     setLoading(false)
//   }

//   const getCurrentStories = async () => {
//     console.log('Selector', selector?._id)
//     try {
//       const res = await apiGet(urls.getCurrentStories)
//       setAllStories(res?.data)
//     } catch (error) {
//       console.error('Error fetching stories:', error)
//     }
//   }

//   const getFollwedStories = async () => {
//     console.log('Selector', selector?._id)
//     try {
//       const res = await apiGet(urls.followedUserStories)
//       setFollowedStories(res?.data)
//     } catch (error) {
//       console.error('Error fetching stories:', error)
//     }
//   }

//   const SavePost = async item => {
//     const postId = item._id
//     const userId = selector?._id
//     setAllPosts(prevPosts => {
//       return prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadySaved = post.SavedBy.includes(userId)
//           const updatedSavedBy = alreadySaved
//             ? post.SavedBy.filter(id => id !== userId)
//             : [...post.SavedBy, userId]

//           return {
//             ...post,
//             SavedBy: updatedSavedBy,
//           }
//         }
//         return post
//       })
//     })

//     try {
//       const endPoint = item?.SavedBy?.includes(userId)
//         ? `${urls.removeSavedPost}/${postId}`
//         : `${urls.SavePost}/${postId}`

//       const res = await apiGet(endPoint)
//     } catch (error) {
//       console.log('Save Post Error:', error)
//       setAllPosts(prevPosts => {
//         return prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasSaved = item.SavedBy.includes(userId)
//             const revertedSavedBy = wasSaved
//               ? [...post.SavedBy, userId]
//               : post.SavedBy.filter(id => id !== userId)

//             return {
//               ...post,
//               SavedBy: revertedSavedBy,
//             }
//           }
//           return post
//         })
//       })
//     }
//   }

//   const onLikeUnlike = async item => {
//     console.log('+++++++++++++++++++++++++++++++++++', item?._id)

//     const postId = item._id
//     const userId = selector?._id
//     setAllPosts(prevPosts => {
//       return prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadyLiked = post.likes.includes(userId)
//           const updatedLikes = alreadyLiked
//             ? post.likes.filter(id => id !== userId)
//             : [...post.likes, userId]

//           return {
//             ...post,
//             likes: updatedLikes,
//             TotalLikes: alreadyLiked
//               ? post.TotalLikes - 1
//               : post.TotalLikes + 1,
//           }
//         }
//         return post
//       })
//     })
//     try {
//       await apiGet(`${urls.likeUnlike}/${postId}`)
//     } catch (error) {
//       console.log('Error in like/unlike', error)
//       setAllPosts(prevPosts => {
//         return prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasLiked = item.likes.includes(userId)
//             const revertedLikes = wasLiked
//               ? [...post.likes, userId]
//               : post.likes.filter(id => id !== userId)

//             return {
//               ...post,
//               likes: revertedLikes,
//               TotalLikes: wasLiked ? post.TotalLikes + 1 : post.TotalLikes - 1,
//             }
//           }
//           return post
//         })
//       })
//     }
//   }

//   const onDisLikes = async item => {
//     const postId = item._id
//     const userId = selector?._id
//     setAllPosts(prevPosts => {
//       return prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadyLiked = post.Unlikes.includes(userId)
//           const updatedLikes = alreadyLiked
//             ? post.Unlikes.filter(id => id !== userId)
//             : [...post.Unlikes, userId]

//           return {
//             ...post,
//             Unlikes: updatedLikes,
//             TotalUnLikes: alreadyLiked
//               ? post.TotalUnLikes - 1
//               : post.TotalUnLikes + 1,
//           }
//         }
//         return post
//       })
//     })
//     try {
//       await apiGet(`${urls.disLikePost}/${postId}`)
//     } catch (error) {
//       console.log('Error in like/unlike', error)
//       setAllPosts(prevPosts => {
//         return prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasLiked = item.Unlikes.includes(userId)
//             const revertedLikes = wasLiked
//               ? [...post.Unlikes, userId]
//               : post.Unlikes.filter(id => id !== userId)

//             return {
//               ...post,
//               Unlikes: revertedLikes,
//               TotalUnLikes: wasLiked
//                 ? post.TotalUnLikes + 1
//                 : post.TotalUnLikes - 1,
//             }
//           }
//           return post
//         })
//       })
//     }
//   }

//   const onDeleteComments = async id => {
//     try {
//       showLoader()
//       const response = await apiDelete(`/api/user/DeleteComment/${id}`)
//       fetchCommentDataOfaPost(postId)
//     } catch (error) {
//       console.log(
//         'DeleteComment Error:',
//         error?.response?.data || error.message,
//       )
//     } finally {
//       hideLoader()
//     }
//   }

//   const renderHeader = () => {
//     return (
//       <View
//         style={{
//           backgroundColor: isDarkMode ? '#252525' : 'white',
//         }}
//       >
//         <SpaceBetweenRow
//           style={{
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             backgroundColor: isDarkMode ? '#252525' : 'white',
//             paddingBottom: 15,
//           }}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('GalleryForAddPost')}>
//             {/* <CameraButton /> */}
//             <GradientIcon
//               colors={['#4F52FE', '#FC14CB']}
//               size={18}
//               iconType='FontAwesome5'
//               name={'sliders-h'}
//             />
//           </TouchableOpacity>
//           <SpaceBetweenRow style={{
//             paddingHorizontal: 50,
//             backgroundColor: isDarkMode ? '#252525' : 'white',
//             paddingVertical: 10,
//             flex:1,
//             height:40
//           }}>
//             <TouchableOpacity
//               style={{ alignItems: 'center', gap: 5 }}
//               onPress={() => setSelectedTab('home')}
//             >
//               <CustomText
//                 style={{
//                   fontSize: 15,
//                   fontFamily: FONTS_FAMILY.SourceSans3_Medium,

//                 }}
//               >Home</CustomText>
//               {selectedTab == 'home' &&
               
//                 <LinearGradient
//                   colors={['#FF00FF', '#4B6BFF']} // your gradient colors (pink → blue like your button)
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={{
//                     height: 2,
//                     width: 50,
//                     borderRadius: 5,
//                     // top:5
//                   }}
//                 />
//               }


//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{ alignItems: 'center', gap: 5 }}
//               onPress={() => setSelectedTab('Top25')}

//             >
//               <CustomText
//                 style={{
//                   fontSize: 15,
//                   fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//                 }}
//               >Top25</CustomText>
//               {selectedTab == 'Top25' &&
               
//                 <LinearGradient
//                   colors={['#FF00FF', '#4B6BFF']} // your gradient colors (pink → blue like your button)
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={{
//                     height: 2,
//                     width: 50,
//                     borderRadius: 5,
//                   }}
//                 />
//               }
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={{ alignItems: 'center', gap: 5 }}
//               onPress={() => setSelectedTab('News')}

//             >
//               <CustomText
//                 style={{
//                   fontSize: 15,
//                   fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//                 }}
//               >News</CustomText>
//               {selectedTab == 'News' &&
//                 <LinearGradient
//                   colors={['#FF00FF', '#4B6BFF']} // your gradient colors (pink → blue like your button)
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={{
//                     height: 2,
//                     width: 50,
//                     borderRadius: 5,
//                   }}
//                 />
//               }
//             </TouchableOpacity>
//           </SpaceBetweenRow>

//           <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
//             {/* <NotiFication /> */}
//             <BellIcon />
//           </TouchableOpacity>
//         </SpaceBetweenRow>

//       </View>
//     )
//   }

//   const renderStories = () => {
//     return (
//       <Row
//         style={{
//           borderBottomWidth: 0.4,
//           // borderTopWidth: 1,
//           borderColor: 'rgba(219, 219, 219, 1)',
//           // flex:1
//         }}>
//         <Animated.View
//           style={{
//             paddingVertical: 10,
//             backgroundColor: isDarkMode ? 'black' : 'white',
//             opacity: storyOpacity,
//             flex:1
//           }}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 10 }}>
//             <View style={styles.storyContainer}>
//               <TouchableOpacity
//                 style={[styles.storyBorder, styles.ownStoryBorder]}
//                 onPress={() =>
//                   navigation.navigate('StoryScreen', {
//                     storyImage: allStories,
//                     User: selector,
//                   })
//                 }>
//                 <Image
//                   source={
//                     allStories[0]?.media
//                       ? { uri: allStories[0]?.media }
//                       : IMG.AddStoryImage
//                   }
//                   style={styles.storyImage}
//                 />
//               </TouchableOpacity>
//               <Text style={styles.storyText} numberOfLines={1}>
//                 {'Your Story'}
//               </Text>
//               <TouchableOpacity
//                 style={{ position: 'absolute', bottom: 20, right: 10 }}
//                 onPress={() => navigation.navigate('GalleryPickerScreen')}>
//                 <AddStoryIcon />
//               </TouchableOpacity>
//             </View>

//             {followedStories?.map((item, index) => {
//               const key = item?._id || `story-${index}`
//               if (item?.User?.Stories?.length > 0) {
//                 return (
//                   <View key={key} style={styles.storyContainer}>
//                     <TouchableOpacity
//                       style={[
//                         styles.storyBorder,
//                         item.isOwn && styles.ownStoryBorder,
//                       ]}
//                       onPress={() =>
//                         navigation.navigate('StoryScreen', {
//                           storyImage: item.User?.Stories,
//                           User: item?.User,
//                         })
//                       }
//                       key={key}>
//                       <Image
//                         source={
//                           item.User?.Stories?.length > 0
//                             ? { uri: item.User?.Stories[0]?.media }
//                             : IMG.AddStoryImage
//                         }
//                         style={styles.storyImage}
//                       />
//                     </TouchableOpacity>
//                     <Text style={styles.storyText} numberOfLines={1}>
//                       {item?.User?.UserName}
//                     </Text>
//                   </View>
//                 )
//               } else {
//                 return null
//               }
//             })}
//           </ScrollView>
//         </Animated.View>
//       </Row>
//     )
//   }

//   // NEW: Render advertisement item
//   const renderAdvertisement = (ad, index) => {
//     const currentImageIndex = currentAdImageIndex[ad._id] || 0
//     const currentMedia = ad.media[currentImageIndex]
//     const totalImages = ad.media.length

//     return (
//       <TouchableOpacity
//         style={styles.feedContainer}
//         key={`ad-${ad._id}-${index}`}
//         onPress={() => handleAdClick(ad)}
//         activeOpacity={0.9}
//       >
//         {/* Ad Header */}
//         <View style={styles.header}>
//           <View style={styles.userInfo}>
//             <View style={styles.adBadgeContainer}>
//               <CustomText style={styles.adBadge}>Sponsored</CustomText>
//             </View>
//             <TouchableOpacity>
//               <Row style={{ gap: 5 }}>
//                 <Text style={styles.username}>{ad.name}</Text>
//               </Row>
//               <Text style={styles.caption}>{ad.location}</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Ad Image/Video with Navigation */}
//         <View style={{ position: 'relative' }}>
//           {currentMedia.type === 'image' ? (
//             <Image
//               source={{ uri: currentMedia.url }}
//               style={{ ...styles.postImage }}
//               resizeMode='cover'
//             />
//           ) : (
//             <Video
//               source={{ uri: currentMedia.url }}
//               style={styles.postImage}
//               resizeMode='cover'
//               repeat={true}
//               muted={isMuted}
//             />
//           )}

//           {/* Image Navigation Dots */}
//           {totalImages > 1 && (
//             <>
//               <View style={styles.adDotsContainer}>
//                 {ad.media.map((_, idx) => (
//                   <View
//                     key={idx}
//                     style={[
//                       styles.adDot,
//                       currentImageIndex === idx && styles.adDotActive
//                     ]}
//                   />
//                 ))}
//               </View>

//               {/* Navigation Arrows */}
//               {currentImageIndex > 0 && (
//                 <TouchableOpacity
//                   style={[styles.adNavButton, styles.adNavButtonLeft]}
//                   onPress={() => handleAdImagePrev(ad._id, totalImages)}
//                 >
//                   <AntDesign name="left" size={20} color="white" />
//                 </TouchableOpacity>
//               )}

//               {currentImageIndex < totalImages - 1 && (
//                 <TouchableOpacity
//                   style={[styles.adNavButton, styles.adNavButtonRight]}
//                   onPress={() => handleAdImageNext(ad._id, totalImages)}>
//                   <AntDesign name="right" size={20} color="white" />
//                 </TouchableOpacity>
//               )}
//             </>
//           )}
//         </View>

//         {/* Ad CTA */}
//         <TouchableOpacity style={styles.adCtaContainer}>
//           <CustomText style={styles.adCtaText}>
//             Learn More →
//           </CustomText>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     )
//   }

//   const renderFeeds = () => {
//     return (
//       <FlatList
//         data={mergedFeedData}
//         style={{ marginBottom: 90 }}
//         keyExtractor={(item, index) =>
//           item.type === 'post'
//             ? `post-${item.data._id}-${index}`
//             : `ad-${item.data._id}-${index}`
//         }
//         showsVerticalScrollIndicator={false}
//         onRefresh={onRefresh}
//         refreshing={loading}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         renderItem={({ item, index }) => {
//           // NEW: Check if item is an advertisement
//           if (item.type === 'ad') {
//             return renderAdvertisement(item.data, index)
//           }

//           // Existing post rendering logic
//           const post = item.data

//           // Check if this is a news item
//           const isNewsItem = selectedTab === 'News'

//           const mediaUrl = post.media
//           const isVideo = isNewsItem
//             ? post.mediatype === 'video'
//             : typeof mediaUrl === 'string' &&
//             (mediaUrl.includes('.mp4') ||
//               mediaUrl.includes('.mov') ||
//               mediaUrl.includes('video') ||
//               mediaUrl.includes('.avi'))

//           return (
//             <TouchableOpacity
//               style={styles.feedContainer}
//               key={`post-${post._id}-${index}`}
//               onPress={() => !isNewsItem && handlePostClick(post)}
//             >
//               {/* Header */}
//               <View style={styles.header}>
//                 <View style={styles.userInfo}>
//                   <Image
//                     source={
//                       isNewsItem
//                         ? IMG.MessageProfile
//                         : post?.User?.Image
//                           ? { uri: post?.User?.Image }
//                           : IMG.MessageProfile
//                     }
//                     style={{ ...styles.profileImage, bottom: isNewsItem ? 0 : 0 }}
//                   />
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (!isNewsItem) {
//                         navigation.navigate('OtherUserDetail', {
//                           userId: post?.User?._id,
//                         })
//                       }
//                     }}>
//                     <Row
//                       style={{
//                         gap: 5,
//                       }}>
//                       <Text style={styles.username}>
//                         {isNewsItem ? post?.title : post?.User?.UserName}
//                       </Text>
//                       {!isNewsItem && (
//                         <Text style={styles.time}>
//                           {formatInstagramDate(post?.createdAt)}
//                         </Text>
//                       )}
//                     </Row>

//                     <Text style={styles.caption}>
//                       <Text style={styles.caption}>
//                         {isNewsItem
//                           ? post?.description?.replace(/<[^>]*>/g, '')
//                           : post?.caption}
//                       </Text>
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               <TouchableOpacity>
//                 <TouchableWithoutFeedback
//                   onPress={() => {
//                     if (isNewsItem) return;

//                     const now = Date.now()
//                     const DOUBLE_PRESS_DELAY = 200

//                     if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
//                       triggerHeartAnimation(index)
//                       onLikeUnlike(post)
//                     } else {
//                       lastTap = now
//                       handlePostClick(post)
//                     }
//                   }}>
//                   <View style={{ position: 'relative', borderRadius: 13 }}>
//                     {isVideo ? (
//                       <View style={styles.videoContainer}>
//                         <Video
//                           source={{ uri: mediaUrl }}
//                           style={[
//                             styles.postImage,
//                             {
//                               height: 170,
//                             },
//                           ]}
//                           resizeMode='cover'
//                           repeat={true}
//                           muted={isMuted}
//                           paused={
//                             visibleVideoIndex !== index || pausedVideos[index]
//                           }
//                           onLoad={() => console.log(`Video ${index} loaded`)}
//                           onError={error =>
//                             console.log(`Video ${index} error:`, error)
//                           }
//                           onBuffer={() =>
//                             console.log(`Video ${index} buffering`)
//                           }
//                         />
//                       </View>
//                     ) : (
//                       <Image
//                         source={{ uri: mediaUrl }}
//                         style={styles.postImage}
//                         onError={error =>
//                           console.log(`Image ${index} error:`, error)
//                         }
//                         resizeMode='cover'
//                       />
//                     )}

//                     {!isNewsItem && (
//                       <Animated.View
//                         pointerEvents='none'
//                         style={{
//                           position: 'absolute',
//                           top: '40%',
//                           left: '40%',
//                           opacity: doubleTapIndex === index ? heartOpacity : 0,
//                           transform: [{ scale: heartOpacity }],
//                         }}>
//                         <MaterialIcons name='favorite' size={100} color='red' />
//                       </Animated.View>
//                     )}

//                     {isVideo && (
//                       <>
//                         <TouchableOpacity
//                           style={styles.soundButton}
//                           onPress={() => setIsMuted(!isMuted)}>
//                           {isMuted ? (
//                             <SpeakerOff />
//                           ) : (
//                             <AntDesign name={'sound'} color='white' size={14} />
//                           )}
//                         </TouchableOpacity>
//                       </>
//                     )}
//                   </View>
//                 </TouchableWithoutFeedback>
//               </TouchableOpacity>

//               {/* Actions */}
//               {!isNewsItem && <View style={styles.actions}>
//                 <View style={styles.leftIcons}>
//                   <Row
//                     style={{
//                       borderColor: isDarkMode ? 'gray' : 'gray',
//                       borderRadius: 18,
//                       paddingHorizontal: 5,
//                       gap: 5,
//                       alignItems: 'center'
//                     }}>
//                     <TouchableOpacity
//                       style={{ right: 0 }}
//                       onPress={() => onLikeUnlike(post)}>
//                       {post?.likes?.includes(selector?._id) ? (
//                         <GradientIcon
//                           colors={['#4F52FE', '#FC14CB']}
//                           size={18}
//                           iconType='Ionicons'
//                           name={'triangle'}
//                         />
//                       ) : (
//                         <GradientIcon
//                           colors={['#4F52FE', '#FC14CB']}
//                           size={18}
//                           iconType='Feather'
//                           name={'triangle'}
//                         />
//                       )}
//                     </TouchableOpacity>
//                     <Text style={styles.likes}>
//                       {post?.TotalLikes}{' '}
//                     </Text>

//                     <TouchableOpacity
//                       style={{
//                         alignItems: 'center',
//                         gap: 5,
//                         flexDirection: 'row',
//                         borderColor: isDarkMode ? 'gray' : 'gray',
//                         borderRadius: 18,
//                         paddingHorizontal: 10,
//                       }}
//                       onPress={() => onDisLikes(post)}>
//                       <GradientIcon
//                         colors={['#4F52FE', '#FC14CB']}
//                         size={18}
//                         iconType='Feather'
//                         name={'triangle'}
//                         style={{
//                           transform: [{ rotate: '180deg' }],
//                         }}
//                       />
//                       <Text style={{ ...styles.likes, fontSize: 13 }}>
//                         {post?.TotalUnLikes}
//                       </Text>
//                     </TouchableOpacity>
//                   </Row>
//                   <Row
//                     style={{
//                       borderColor: isDarkMode ? 'gray' : 'gray',
//                       borderRadius: 18,
//                       paddingHorizontal: 5,
//                       gap: 5
//                     }}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         setModalVisible(true)
//                         fetchCommentDataOfaPost(post?._id)
//                         setPostId(post?._id)
//                       }}>
//                       {isDarkMode ? (
//                         <GradientIcon
//                           colors={['#4F52FE', '#FC14CB']}
//                           size={18}
//                           iconType='FontAwesome'
//                           name={'comment-o'}
//                         />
//                       ) : (
//                         <GradientIcon
//                           colors={['#4F52FE', '#FC14CB']}
//                           size={18}
//                           iconType='FontAwesome'
//                           name={'comment-o'}
//                         />
//                       )}
//                     </TouchableOpacity>
//                     <Text style={styles.comments}>{post?.TotalComents}</Text>
//                   </Row>
//                 </View>

//                 <Row style={{ gap: 20, marginRight: 6 }}>
//                   <TouchableOpacity
//                     style={{ right: 0 }}
//                     onPress={() => SavePost(post)}>
//                     {post?.SavedBy?.includes(selector?._id) ? (
//                       <GradientIcon
//                         colors={['#4F52FE', '#FC14CB']}
//                         size={18}
//                         iconType='FontAwesome'
//                         name={'bookmark'}
//                       />
//                     ) : (
//                       <GradientIcon
//                         colors={['#4F52FE', '#FC14CB']}
//                         size={18}
//                         iconType='FontAwesome'
//                         name={'bookmark-o'}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </Row>
//               </View>}
//             </TouchableOpacity>
//           )
//         }}
//         ListEmptyComponent={
//           !loaderVisible && (
//             <CustomText
//               style={{
//                 color: isDarkMode ? 'white' : 'black',
//                 alignSelf: 'center',
//                 marginTop: 50,
//                 fontFamily: FONTS_FAMILY.OpenSans_Condensed_Medium,
//               }}>
//               No Post Found!
//             </CustomText>
//           )
//         }
//       />
//     )
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? 'black' : white,
//     },
//     storyContainer: {
//       alignItems: 'center',
//       marginRight: 12,
//     },
//     storyBorder: {
//       width: 65,
//       height: 65,
//       borderRadius: 50,
//       borderWidth: 2,
//       borderColor: '#0084ff',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     ownStoryBorder: {
//       borderColor: 'transparent',
//     },
//     soundButton: {
//       position: 'absolute',
//       bottom: 20,
//       right: 20,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       padding: 10,
//       borderRadius: 20,
//     },
//     storyImage: {
//       width: 55,
//       height: 55,
//       borderRadius: 50,
//     },
//     storyText: {
//       fontSize: 13,
//       marginTop: 5,
//       color: isDarkMode ? 'white' : '#000',
//       width: 70,
//       textAlign: 'center',
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//     videoContainer: {
//       borderRadius: 20,
//       overflow: 'hidden',
//     },
//     plusIcon: {
//       position: 'absolute',
//       bottom: 25,
//       right: 5,
//       backgroundColor: '#0084ff',
//       width: 20,
//       height: 20,
//       borderRadius: 10,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: '#fff',
//     },
//     plusText: {
//       color: '#fff',
//       fontSize: 16,
//       fontWeight: 'bold',
//     },
//     feedContainer: {
//       borderBottomWidth: 0.3,
//       borderBottomColor: '#ccc',
//       paddingBottom: 10,
//       backgroundColor: isDarkMode ? 'black' : 'white',
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       padding: 10,
//     },
//     userInfo: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     profileImage: {
//       width: 40,
//       height: 40,
//       borderRadius: 20,
//       marginRight: 10,
//     },
//     username: {
//       fontWeight: 'bold',
//       color: isDarkMode ? 'white' : 'black',
//     },
//     audio: {
//       color: isDarkMode ? 'white' : 'gray',
//       fontSize: 12,
//     },
//     postImage: {
//       width: '100%',
//       height: 300,
//       marginRight: 10,
//     },
//     actions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       paddingTop: 8,
//       marginHorizontal: 10,
//       paddingBottom: 10,
//     },
//     leftIcons: {
//       flexDirection: 'row',
//       gap: 15,
//     },
//     likes: {
//       paddingHorizontal: 3,
//       color: isDarkMode ? 'white' : 'black',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       fontSize: 13,
//     },
//     caption: {
//       paddingHorizontal: 2,
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? 'white' : 'black',
//       width: 280,
//     },
//     comments: {
//       paddingHorizontal: 3,
//       color: isDarkMode ? 'white' : 'black',
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       fontSize: 13,
//     },
//     time: {
//       color: 'gray',
//       fontSize: 12,
//       marginTop: 0,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     // NEW: Advertisement specific styles
//     adBadgeContainer: {
//       backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
//       paddingHorizontal: 8,
//       paddingVertical: 4,
//       borderRadius: 4,
//       marginRight: 10,
//     },
//     adBadge: {
//       fontSize: 12,
//       fontWeight: '600',
//       color: isDarkMode ? '#aaa' : '#666',
//     },
//     adDotsContainer: {
//       position: 'absolute',
//       bottom: 10,
//       left: 0,
//       right: 0,
//       flexDirection: 'row',
//       justifyContent: 'center',
//       alignItems: 'center',
//       gap: 6,
//     },
//     adDot: {
//       width: 6,
//       height: 6,
//       borderRadius: 3,
//       backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     },
//     adDotActive: {
//       backgroundColor: 'rgba(255, 255, 255, 1)',
//       width: 8,
//       height: 8,
//       borderRadius: 4,
//     },
//     adNavButton: {
//       position: 'absolute',
//       top: '50%',
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       justifyContent: 'center',
//       alignItems: 'center',
//       transform: [{ translateY: -18 }],
//     },
//     adNavButtonLeft: {
//       left: 10,
//     },
//     adNavButtonRight: {
//       right: 10,
//     },
//     adCtaContainer: {
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//       padding: 12,
//       marginHorizontal: 10,
//       marginTop: 10,
//       borderRadius: 8,
//       alignItems: 'center',
//     },
//     adCtaText: {
//       color: '#0084ff',
//       fontWeight: '600',
//       fontSize: 14,
//     },
//   })

//   const renderCommentModal = () => {
//     return (
//       <>
//         <CommentModal
//           isVisible={modalVisible}
//           onClose={() => setModalVisible(false)}
//           onBackButtonPress={() => setModalVisible(false)}
//           comments={comments}
//           isDarkMode={isDarkMode}
//           commentText={commentText}
//           onChangeText={setCommentText}
//           onSendPress={() => {
//             console.log('Send:', commentText)
//             sendComments(postId, commentText)
//             setCommentText('')
//           }}
//           onDeleteComments={id => onDeleteComments(id)}
//           onEditComment={(id, text) => editComments(id, text)}
//         />
//       </>
//     )
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor='transparent'
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />
//       {renderHeader()}
//       {selectedTab == 'home' && renderStories()}
//       {loading ? (
//         <FeedShimmerLoader isDarkMode={isDarkMode} count={5} />
//       ) : (
//         renderFeeds()
//       )}

//       {renderCommentModal()}

//       <PostDetailModal
//         visible={postDetailVisible}
//         onClose={() => {
//           setPostDetailVisible(false)
//           setSelectedPost(null)
//         }}
//         setPost={setSelectedPost}
//         post={selectedPost}
//         comments={comments}
//         isDarkMode={isDarkMode}
//         selector={selector}
//         onLikeUnlike={post => onLikeUnlike(post)}
//         onDisLikes={onDisLikes}
//         SavePost={SavePost}
//         onAddComment={(id, commentText) => { sendComments(postId, commentText); setCommentText('') }}
//         formatInstagramDate={formatInstagramDate}
//         isMuted={isMuted}
//         setIsMuted={setIsMuted}
//       />
//        <TouchableOpacity
//             onPress={() => navigation.navigate('GalleryForAddPost')}
//             style={{
//               position:'absolute',
//               bottom:100,
//               right:20
//             }}
//             >
//             <CameraButton />
//             {/* <GradientIcon
//               colors={['#4F52FE', '#FC14CB']}
//               size={18}
//               iconType='FontAwesome5'
//               name={'sliders-h'}
//             /> */}
//           </TouchableOpacity>
//     </View>
//   )
// }

// export default Home


// import React, { useEffect, useRef, useState } from 'react'
// import {
//   FlatList,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Animated,
//   TouchableWithoutFeedback,
//   TextInput,
//   BackHandler,
//   Alert,
//   Platform,
//   PermissionsAndroid,
//   Linking,
// } from 'react-native'
// import CustomText from '../../components/TextComponent'
// import IMG from '../../assets/Images'
// import Row from '../../components/wrapper/row'
// import LocationManager from '../../utils/LocationManager'
// import {
//   AddStoryIcon,
//   BellIcon,
//   CameraButton,
//   NotiFication,
//   SpeakerOff,
// } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import SpaceBetweenRow from '../../components/wrapper/spacebetween'
// import { useDispatch, useSelector } from 'react-redux'
// import Video from 'react-native-video'
// import { apiDelete, apiGet, apiPost, apiPut, getItem } from '../../utils/Apis'
// import urls from '../../config/urls'
// import { theme, white } from '../../common/Colors/colors'
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import useLoader from '../../utils/LoaderHook'
// import { useFocusEffect, useIsFocused } from '@react-navigation/native'
// import CommentModal from './CommentModel'
// import moment from 'moment'
// import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
// import messaging from '@react-native-firebase/messaging'
// import PostDetailModal from './PostDetailModel'
// import { setUser } from '../../redux/reducer/user'
// import GradientIcon from '../../components/GradientIcon'
// import LinearGradient from 'react-native-linear-gradient'
// import { formatInstagramDate } from '../../utils/DateFormat'

// const Home = ({ navigation }) => {
//   const { isDarkMode } = useSelector(state => state.theme)
//   const storyOpacity = useRef(new Animated.Value(0)).current
//   const feedTranslateY = useRef(new Animated.Value(20)).current
//   const [loading, setLoading] = useState(false)
//   const [allPosts, setAllPosts] = useState([])
//   const [allStories, setAllStories] = useState([])
//   const [followedStories, setFollowedStories] = useState([])
//   const [doubleTapIndex, setDoubleTapIndex] = useState(null)
//   const heartOpacity = useRef(new Animated.Value(0)).current
//   const [modalVisible, setModalVisible] = useState(false)
//   const [postId, setPostId] = useState(null)
//   const [commentText, setCommentText] = useState('')
//   const [comments, setComments] = useState([])
//   const [isMuted, setIsMuted] = useState(true)
//   const [visibleVideoIndex, setVisibleVideoIndex] = useState(0)
//   const [pausedVideos, setPausedVideos] = useState({})
//   const loaderVisible = useSelector(state => state?.loader?.loader)
//   const dispatch = useDispatch()

//     const [searchText, setSearchText] = useState("");

//   const { showLoader, hideLoader } = useLoader()

//   let selector = useSelector(state => state?.user?.userData)
//   if (Object.keys(selector).length != 0) {
//     selector = JSON.parse(selector)
//   }

//   const [selectedPost, setSelectedPost] = useState(null)
//   const [postDetailVisible, setPostDetailVisible] = useState(false)
//   const [locationStatus, setLocationStatus] = useState('idle')
//   const [selectedTab, setSelectedTab] = useState('home')
//   const [advertisements, setAdvertisements] = useState([])
//   const [mergedFeedData, setMergedFeedData] = useState([])
//   const [currentAdImageIndex, setCurrentAdImageIndex] = useState({})
//   const [newsData, setNewsData] = useState([])

//   const fetchAdvertisements = async () => {
//     try {
//       const res = await apiGet('/api/admin/GetAllActiveAdvertisement')
//       if (res?.data) {
//         setAdvertisements(res.data)
//         const initialAdImageIndex = {}
//         res.data.forEach(ad => {
//           initialAdImageIndex[ad._id] = 0
//         })
//         setCurrentAdImageIndex(initialAdImageIndex)
//       }
//     } catch (error) {
//       console.error('Error fetching advertisements:', error)
//     }
//   }

//   const fetchNewsData = async () => {
//     try {
//       const res = await apiGet('/api/admin/GetAllPublishedNews')
//       if (res?.data) {
//         setNewsData(res.data)
//       }
//     } catch (error) {
//       console.error('Error fetching news:', error)
//     }
//   }

//   const mergeFeedWithAds = (posts, ads) => {
//     if (!ads || ads.length === 0) {
//       return posts.map(post => ({ type: 'post', data: post }))
//     }

//     const merged = []
//     const adInterval = 3
//     let adIndex = 0

//     posts.forEach((post, index) => {
//       merged.push({ type: 'post', data: post })
//       if ((index + 1) % adInterval === 0 && adIndex < ads.length) {
//         merged.push({ type: 'ad', data: ads[adIndex] })
//         adIndex = (adIndex + 1) % ads.length
//       }
//     })

//     return merged
//   }

//   const handleAdImageNext = (adId, totalImages) => {
//     setCurrentAdImageIndex(prev => ({
//       ...prev,
//       [adId]: (prev[adId] + 1) % totalImages
//     }))
//   }

//   const handleAdImagePrev = (adId, totalImages) => {
//     setCurrentAdImageIndex(prev => ({
//       ...prev,
//       [adId]: prev[adId] === 0 ? totalImages - 1 : prev[adId] - 1
//     }))
//   }

//   const handleAdClick = (ad) => {
//     if (ad.url) {
//       Linking.openURL(ad.url).catch(err =>
//         console.error('Failed to open URL:', err)
//       )
//     }
//   }

//   const handlePostClick = item => {
//     console.log('_______________+')
//     setSelectedPost(item)
//     setPostDetailVisible(true)
//     fetchCommentDataOfaPost(item._id)
//   }

//   useFocusEffect(() => {
//     const backAction = () => {
//       Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
//         {
//           text: 'Cancel',
//           onPress: () => null,
//           style: 'cancel',
//         },
//         {
//           text: 'EXIT',
//           onPress: () => BackHandler.exitApp(),
//         },
//       ])
//       return true
//     }
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     )
//     return () => backHandler.remove()
//   })

//   useEffect(() => {
//     initializeFirebase()
//   }, [])

//   const initializeFirebase = async () => {
//     try {
//       console.log('Initializing Firebase...')
//       await requestNotificationPermission()
//     } catch (error) {
//       console.error('Firebase initialization error:', error)
//       Alert.alert('Error', `Firebase setup failed: ${error.message}`)
//     }
//   }

//   const requestNotificationPermission = async () => {
//     try {
//       let hasPermission = false

//       if (Platform.OS === 'android') {
//         if (Platform.Version >= 33) {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//           )
//           hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED
//         } else {
//           hasPermission = true
//         }
//       } else {
//         const authStatus = await messaging().requestPermission()
//         hasPermission =
//           authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//           authStatus === messaging.AuthorizationStatus.PROVISIONAL
//       }

//       if (hasPermission) {
//         console.log('Permission granted')
//         await getFCMToken()
//       } else {
//         console.log('Permission denied')
//         Alert.alert('Permission Required', 'Please enable notifications')
//       }
//     } catch (error) {
//       console.error('Permission error:', error)
//       Alert.alert('Error', `Permission failed: ${error.message}`)
//     }
//   }

//   const getFCMToken = async () => {
//     try {
//       console.log('Getting FCM token...')

//       if (!messaging().isDeviceRegisteredForRemoteMessages) {
//         await messaging().registerDeviceForRemoteMessages()
//       }

//       const fcmToken = await messaging().getToken()

//       if (fcmToken) {
//         console.log('FCM Token:', fcmToken)
//       } else {
//         throw new Error('No FCM token received')
//       }
//     } catch (error) {
//       console.error('FCM Token Error:', error)
//     }
//   }

//   const triggerHeartAnimation = index => {
//     setDoubleTapIndex(index)

//     heartOpacity.setValue(0)
//     heartScale.setValue(0)

//     Animated.parallel([
//       Animated.sequence([
//         Animated.timing(heartOpacity, {
//           toValue: 1,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(heartOpacity, {
//           toValue: 0,
//           duration: 600,
//           useNativeDriver: true,
//         }),
//       ]),

//       Animated.sequence([
//         Animated.timing(heartScale, {
//           toValue: 1.2,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(heartScale, {
//           toValue: 0,
//           duration: 500,
//           useNativeDriver: true,
//         }),
//       ]),
//     ]).start()
//   }

//   const heartScale = useRef(new Animated.Value(0)).current

//   let lastTap = null

//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems.length > 0) {
//       setVisibleVideoIndex(viewableItems[0].index)
//     }
//   }).current

//   const viewabilityConfig = useRef({
//     itemVisiblePercentThreshold: 50,
//   }).current

//   const isFocused = useIsFocused()

//   useEffect(() => {
//     Animated.timing(storyOpacity, {
//       toValue: 1,
//       duration: 500,
//       useNativeDriver: true,
//     }).start()

//     Animated.timing(feedTranslateY, {
//       toValue: 0,
//       duration: 500,
//       useNativeDriver: true,
//     }).start()
//   }, [])

//   useEffect(() => {
//     fetchData()
//     getCurrentStories()
//     getFollwedStories()
//     initializeLocation()
//     fetchAdvertisements()
//     fetchNewsData()
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = await getItem('token');
//       setLoading(true);

//       try {
//         if (token) {
//           const getUserDetails = await apiGet(urls.userProfile);
//           dispatch(setUser(JSON.stringify(getUserDetails?.data)));
//           setLoading(false);
//         } else {
//           navigation.replace('Onboarding');
//           setLoading(false);
//         }
//       } catch (error) {
//         console.log('Fetch data error:', error);
//         navigation.replace('Onboarding');
//         setLoading(false);
//       }
//     };

//     LocationManager.setLocationUpdateCallback(fetchData);
//     LocationManager.initializeLocationTracking();

//     return () => {
//       LocationManager.setLocationUpdateCallback(null);
//       LocationManager.stopLocationTracking();
//     };
//   }, []);

//   const initializeLocation = async () => {
//     try {
//       setLocationStatus('updating');
//       await LocationManager.initializeLocationTracking();
//       setLocationStatus('updated');

//       setTimeout(() => setLocationStatus('idle'), 2000);
//     } catch (error) {
//       console.log('Location initialization failed:', error);
//       setLocationStatus('error');
//       setTimeout(() => setLocationStatus('idle'), 3000);
//     }
//   }

//   const updateLocationOnFocus = async () => {
//     try {
//       await LocationManager.checkAndUpdateLocation();
//     } catch (error) {
//       console.log('Foreground location update failed:', error);
//     }
//   }

//   useEffect(() => {
//     return () => {
//       LocationManager.stopLocationTracking();
//     }
//   }, [])

//   useEffect(() => {
//     getCurrentStories()
//     getFollwedStories()
//     if (isFocused) {
//       updateLocationOnFocus()
//     }
//   }, [isFocused])

//   useEffect(() => {
//     let dataToMerge = []

//     if (selectedTab === 'News') {
//       dataToMerge = newsData
//     } else {
//       const filteredPosts = allPosts.filter(item => {
//         const hasImage = item?.media && !item?.media.toLowerCase().includes('.mp4');
//         const isTop25 = selectedTab === 'Top25' ? item?.TotalLikes > 25 : true;
//         return hasImage && isTop25;
//       });
//       dataToMerge = filteredPosts
//     }

//     const merged = mergeFeedWithAds(dataToMerge, advertisements);
//     setMergedFeedData(merged);
//   }, [allPosts, advertisements, selectedTab, newsData]);

//   const onRefresh = async () => {
//     setLoading(true)
//     await fetchData()
//     await getCurrentStories()
//     await getFollwedStories()
//     await fetchAdvertisements()
//     await fetchNewsData()
//     setLoading(false)
//   }

//   const fetchCommentDataOfaPost = async id => {
//     const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
//     setComments(res?.data)
//   }

//   const sendComments = async (id, text) => {
//     const data = {
//       Post: id,
//       text: text,
//     }
//     const res = await apiPost(`${urls.sendCommentOnPost}`, data)
//     fetchCommentDataOfaPost(id)
//   }

//   const editComments = async (id, text) => {
//     const data = {
//       text: text,
//     }
//     const res = await apiPut(`${urls.editComment}/${id}`, data)
//     fetchCommentDataOfaPost(postId)
//   }

//   const fetchData = async () => {
//     setLoading(true)
//     const res = await apiGet(urls.getAllPost)
//     setAllPosts(res?.data)
//     setLoading(false)
//   }

//   const getCurrentStories = async () => {
//     console.log('Selector', selector?._id)
//     try {
//       const res = await apiGet(urls.getCurrentStories)
//       setAllStories(res?.data)
//     } catch (error) {
//       console.error('Error fetching stories:', error)
//     }
//   }

//   const getFollwedStories = async () => {
//     console.log('Selector', selector?._id)
//     try {
//       const res = await apiGet(urls.followedUserStories)
//       setFollowedStories(res?.data)
//     } catch (error) {
//       console.error('Error fetching stories:', error)
//     }
//   }

//   const SavePost = async item => {
//     const postId = item._id
//     const userId = selector?._id
//     setAllPosts(prevPosts => {
//       return prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadySaved = post.SavedBy.includes(userId)
//           const updatedSavedBy = alreadySaved
//             ? post.SavedBy.filter(id => id !== userId)
//             : [...post.SavedBy, userId]

//           return {
//             ...post,
//             SavedBy: updatedSavedBy,
//           }
//         }
//         return post
//       })
//     })

//     try {
//       const endPoint = item?.SavedBy?.includes(userId)
//         ? `${urls.removeSavedPost}/${postId}`
//         : `${urls.SavePost}/${postId}`

//       const res = await apiGet(endPoint)
//     } catch (error) {
//       console.log('Save Post Error:', error)
//       setAllPosts(prevPosts => {
//         return prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasSaved = item.SavedBy.includes(userId)
//             const revertedSavedBy = wasSaved
//               ? [...post.SavedBy, userId]
//               : post.SavedBy.filter(id => id !== userId)

//             return {
//               ...post,
//               SavedBy: revertedSavedBy,
//             }
//           }
//           return post
//         })
//       })
//     }
//   }

//   const onLikeUnlike = async item => {
//     console.log('+++++++++++++++++++++++++++++++++++', item?._id)

//     const postId = item._id
//     const userId = selector?._id
//     setAllPosts(prevPosts => {
//       return prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadyLiked = post.likes.includes(userId)
//           const updatedLikes = alreadyLiked
//             ? post.likes.filter(id => id !== userId)
//             : [...post.likes, userId]

//           return {
//             ...post,
//             likes: updatedLikes,
//             TotalLikes: alreadyLiked
//               ? post.TotalLikes - 1
//               : post.TotalLikes + 1,
//           }
//         }
//         return post
//       })
//     })
//     try {
//       await apiGet(`${urls.likeUnlike}/${postId}`)
//     } catch (error) {
//       console.log('Error in like/unlike', error)
//       setAllPosts(prevPosts => {
//         return prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasLiked = item.likes.includes(userId)
//             const revertedLikes = wasLiked
//               ? [...post.likes, userId]
//               : post.likes.filter(id => id !== userId)

//             return {
//               ...post,
//               likes: revertedLikes,
//               TotalLikes: wasLiked ? post.TotalLikes + 1 : post.TotalLikes - 1,
//             }
//           }
//           return post
//         })
//       })
//     }
//   }

//   const onDisLikes = async item => {
//     const postId = item._id
//     const userId = selector?._id
//     setAllPosts(prevPosts => {
//       return prevPosts.map(post => {
//         if (post._id === postId) {
//           const alreadyLiked = post.Unlikes.includes(userId)
//           const updatedLikes = alreadyLiked
//             ? post.Unlikes.filter(id => id !== userId)
//             : [...post.Unlikes, userId]

//           return {
//             ...post,
//             Unlikes: updatedLikes,
//             TotalUnLikes: alreadyLiked
//               ? post.TotalUnLikes - 1
//               : post.TotalUnLikes + 1,
//           }
//         }
//         return post
//       })
//     })
//     try {
//       await apiGet(`${urls.disLikePost}/${postId}`)
//     } catch (error) {
//       console.log('Error in like/unlike', error)
//       setAllPosts(prevPosts => {
//         return prevPosts.map(post => {
//           if (post._id === postId) {
//             const wasLiked = item.Unlikes.includes(userId)
//             const revertedLikes = wasLiked
//               ? [...post.Unlikes, userId]
//               : post.Unlikes.filter(id => id !== userId)

//             return {
//               ...post,
//               Unlikes: revertedLikes,
//               TotalUnLikes: wasLiked
//                 ? post.TotalUnLikes + 1
//                 : post.TotalUnLikes - 1,
//             }
//           }
//           return post
//         })
//       })
//     }
//   }

//   const onDeleteComments = async id => {
//     try {
//       showLoader()
//       const response = await apiDelete(`/api/user/DeleteComment/${id}`)
//       fetchCommentDataOfaPost(postId)
//     } catch (error) {
//       console.log(
//         'DeleteComment Error:',
//         error?.response?.data || error.message,
//       )
//     } finally {
//       hideLoader()
//     }
//   }

//   const renderHeader = () => {
//     return (
//       <View
//         style={{
//           backgroundColor: isDarkMode ? '#000' : '#fff',
//           paddingBottom: 8,
//         }}
//       >
//         <SpaceBetweenRow
//           style={{
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             paddingBottom: 12,
//           }}>
//           <TouchableOpacity
//             onPress={() => navigation.navigate('GalleryForAddPost')}
//             style={styles.headerIconContainer}>
//             <GradientIcon
//               colors={['#4F52FE', '#FC14CB']}
//               size={20}
//               iconType='FontAwesome5'
//               name={'sliders-h'}
//             />
//           </TouchableOpacity>

//           <View style={styles.tabsContainer}>
//             <TouchableOpacity
//               style={styles.tabButton}
//               onPress={() => setSelectedTab('home')}
//               activeOpacity={0.7}
//             >
//               <CustomText
//                 style={[
//                   styles.tabText,
//                   selectedTab === 'home' && styles.tabTextActive
//                 ]}
//               >Home</CustomText>
//               {selectedTab === 'home' && (
//                 <LinearGradient
//                   colors={['#FF00FF', '#4B6BFF']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.tabIndicator}
//                 />
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.tabButton}
//               onPress={() => setSelectedTab('Top25')}
//               activeOpacity={0.7}
//             >
//               <CustomText
//                 style={[
//                   styles.tabText,
//                   selectedTab === 'Top25' && styles.tabTextActive
//                 ]}
//               >Top25</CustomText>
//               {selectedTab === 'Top25' && (
//                 <LinearGradient
//                   colors={['#FF00FF', '#4B6BFF']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.tabIndicator}
//                 />
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.tabButton}
//               onPress={() => setSelectedTab('News')}
//               activeOpacity={0.7}
//             >
//               <CustomText
//                 style={[
//                   styles.tabText,
//                   selectedTab === 'News' && styles.tabTextActive
//                 ]}
//               >News</CustomText>
//               {selectedTab === 'News' && (
//                 <LinearGradient
//                   colors={['#FF00FF', '#4B6BFF']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 0 }}
//                   style={styles.tabIndicator}
//                 />
//               )}
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity 
//             onPress={() => navigation.navigate('Activity')}
//             style={styles.headerIconContainer}>
//             <BellIcon />
//           </TouchableOpacity>
//         </SpaceBetweenRow>
//       </View>
//     )
//   }

//   const renderStories = () => {
//     return (
//       <View
//         style={{
//           borderBottomWidth: 0.5,
//           borderBottomColor: isDarkMode ? '#333' : '#E5E5E5',
//         }}>
//         <Animated.View
//           style={{
//             paddingVertical: 5,
//             backgroundColor: isDarkMode ? '#000' : '#fff',
//             opacity: storyOpacity,
//           }}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingHorizontal: 16 }}>
            
//             {/* Your Story */}
//             <View style={styles.storyContainer}>
//               <TouchableOpacity
//                 style={styles.yourStoryWrapper}
//                 onPress={() =>
//                   navigation.navigate('StoryScreen', {
//                     storyImage: allStories,
//                     User: selector,
//                   })
//                 }
//                 activeOpacity={0.8}>
//                 <LinearGradient
//                   colors={allStories[0]?.media ? ['#FF00FF', '#4B6BFF'] : ['#E5E5E5', '#E5E5E5']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.storyGradientBorder}>
//                   <View style={styles.storyImageContainer}>
//                     <Image
//                       source={
//                         allStories[0]?.media
//                           ? { uri: allStories[0]?.media }
//                           : IMG.AddStoryImage
//                       }
//                       style={styles.storyImage}
//                     />
//                   </View>
//                 </LinearGradient>
//                 <TouchableOpacity
//                   style={styles.addStoryButton}
//                   onPress={() => navigation.navigate('GalleryPickerScreen')}
//                   activeOpacity={0.9}>
//                   <LinearGradient
//                     colors={['#FF00FF', '#4B6BFF']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.addStoryGradient}>
//                     <AddStoryIcon />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </TouchableOpacity>
//               <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                 Your Story
//               </Text>
//             </View>

//             {/* Other Stories */}
//             {followedStories?.map((item, index) => {
//               const key = item?._id || `story-${index}`
//               if (item?.User?.Stories?.length > 0) {
//                 return (
//                   <View key={key} style={styles.storyContainer}>
//                     <TouchableOpacity
//                       onPress={() =>
//                         navigation.navigate('StoryScreen', {
//                           storyImage: item.User?.Stories,
//                           User: item?.User,
//                         })
//                       }
//                       activeOpacity={0.8}>
//                       <LinearGradient
//                         colors={['#FF00FF', '#4B6BFF']}
//                         start={{ x: 0, y: 0 }}
//                         end={{ x: 1, y: 1 }}
//                         style={styles.storyGradientBorder}>
//                         <View style={styles.storyImageContainer}>
//                           <Image
//                             source={
//                               item.User?.Stories?.length > 0
//                                 ? { uri: item.User?.Stories[0]?.media }
//                                 : IMG.AddStoryImage
//                             }
//                             style={styles.storyImage}
//                           />
//                         </View>
//                       </LinearGradient>
//                     </TouchableOpacity>
//                     <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
//                       {item?.User?.UserName}
//                     </Text>
//                   </View>
//                 )
//               } else {
//                 return null
//               }
//             })}
//           </ScrollView>
//         </Animated.View>
//       </View>
//     )
//   }

//   const renderAdvertisement = (ad, index) => {
//     const currentImageIndex = currentAdImageIndex[ad._id] || 0
//     const currentMedia = ad.media[currentImageIndex]
//     const totalImages = ad.media.length

//     return (
//       <TouchableOpacity
//         style={styles.feedContainer}
//         key={`ad-${ad._id}-${index}`}
//         onPress={() => handleAdClick(ad)}
//         activeOpacity={0.95}
//       >
//         {/* Ad Header */}
//         <View style={styles.feedHeader}>
//           <View style={styles.feedUserInfo}>
//             <View style={styles.adBadgeContainer}>
//               <LinearGradient
//                 colors={['#FF00FF', '#4B6BFF']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.adBadgeGradient}>
//                 <CustomText style={styles.adBadge}>Sponsored</CustomText>
//               </LinearGradient>
//             </View>
//             <View style={{ marginLeft: 8 }}>
//               <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>{ad.name}</Text>
//               <Text style={[styles.caption, { fontSize: 12, color: isDarkMode ? '#999' : '#666' }]}>{ad.location}</Text>
//             </View>
//           </View>
//         </View>

//         {/* Ad Image/Video with Navigation */}
//         <View style={styles.mediaContainer}>
//           {currentMedia.type === 'image' ? (
//             <Image
//               source={{ uri: currentMedia.url }}
//               style={styles.postImage}
//               resizeMode='cover'
//             />
//           ) : (
//             <Video
//               source={{ uri: currentMedia.url }}
//               style={styles.postImage}
//               resizeMode='cover'
//               repeat={true}
//               muted={isMuted}
//             />
//           )}

//           {/* Image Navigation Dots */}
//           {totalImages > 1 && (
//             <>
//               <View style={styles.adDotsContainer}>
//                 {ad.media.map((_, idx) => (
//                   <View
//                     key={idx}
//                     style={[
//                       styles.adDot,
//                       currentImageIndex === idx && styles.adDotActive
//                     ]}
//                   />
//                 ))}
//               </View>

//               {/* Navigation Arrows */}
//               {currentImageIndex > 0 && (
//                 <TouchableOpacity
//                   style={[styles.adNavButton, styles.adNavButtonLeft]}
//                   onPress={() => handleAdImagePrev(ad._id, totalImages)}
//                   activeOpacity={0.8}
//                 >
//                   <AntDesign name="left" size={18} color="white" />
//                 </TouchableOpacity>
//               )}

//               {currentImageIndex < totalImages - 1 && (
//                 <TouchableOpacity
//                   style={[styles.adNavButton, styles.adNavButtonRight]}
//                   onPress={() => handleAdImageNext(ad._id, totalImages)}
//                   activeOpacity={0.8}>
//                   <AntDesign name="right" size={18} color="white" />
//                 </TouchableOpacity>
//               )}
//             </>
//           )}
//         </View>

//         {/* Ad CTA */}
//         <TouchableOpacity style={styles.adCtaContainer} activeOpacity={0.8}>
//           <LinearGradient
//             colors={['#FF00FF', '#4B6BFF']}
//             start={{ x: 0, y:0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.adCtaGradient}>
//             <CustomText style={styles.adCtaText}>
//               Learn More →
//             </CustomText>
//           </LinearGradient>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     )
//   }

//   const renderFeeds = () => {
//     return (
//       <FlatList
//         data={mergedFeedData}
//         style={{ marginBottom: 40, flex:1 }}
//         // pagingEnabled
//         keyExtractor={(item, index) =>
//           item.type === 'post'
//             ? `post-${item.data._id}-${index}`
//             : `ad-${item.data._id}-${index}`
//         }
//         showsVerticalScrollIndicator={false}
//         onRefresh={onRefresh}
//         refreshing={loading}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         renderItem={({ item, index }) => {
//           if (item.type === 'ad') {
//             return renderAdvertisement(item.data, index)
//           }

//           const post = item.data
//           const isNewsItem = selectedTab === 'News'

//           const mediaUrl = post.media
//           const isVideo = isNewsItem
//             ? post.mediatype === 'video'
//             : typeof mediaUrl === 'string' &&
//             (mediaUrl.includes('.mp4') ||
//               mediaUrl.includes('.mov') ||
//               mediaUrl.includes('video') ||
//               mediaUrl.includes('.avi'))

//           return (
//             <TouchableOpacity
//               style={styles.feedContainer}
//               key={`post-${post._id}-${index}`}
//               onPress={() => !isNewsItem && handlePostClick(post)}
//               activeOpacity={0.98}
//             >
//               {/* Header */}
//               <View style={styles.feedHeader}>
//                 <View style={styles.feedUserInfo}>
//                   <View style={styles.profileImageWrapper}>
//                     <Image
//                       source={
//                         isNewsItem
//                           ? IMG.MessageProfile
//                           : post?.User?.Image
//                             ? { uri: post?.User?.Image }
//                             : IMG.MessageProfile
//                       }
//                       style={styles.profileImage}
//                     />
//                   </View>
//                   <TouchableOpacity
//                     onPress={() => {
//                       if (!isNewsItem) {
//                         navigation.navigate('OtherUserDetail', {
//                           userId: post?.User?._id,
//                         })
//                       }
//                     }}
//                     style={{ flex: 1 }}
//                     activeOpacity={0.7}>
//                     <View style={styles.userNameRow}>
//                       <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
//                         {isNewsItem ? post?.title : post?.User?.UserName}
//                       </Text>
//                       {!isNewsItem && (
//                         <Text style={styles.timeText}>
//                           • {formatInstagramDate(post?.createdAt)}
//                         </Text>
//                       )}
//                     </View>
//                     <Text style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={2}>
//                       {isNewsItem
//                         ? post?.description?.replace(/<[^>]*>/g, '')
//                         : post?.caption}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>

//               {/* Post Media */}
//               <TouchableWithoutFeedback
//                 onPress={() => {
//                   if (isNewsItem) return;

//                   const now = Date.now()
//                   const DOUBLE_PRESS_DELAY = 300

//                   if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
//                     triggerHeartAnimation(index)
//                     onLikeUnlike(post)
//                   } else {
//                     lastTap = now
//                     handlePostClick(post)
//                   }
//                 }}>
//                 <View style={styles.mediaContainer}>
//                   {isVideo ? (
//                     <View style={styles.videoContainer}>
//                       <Video
//                         source={{ uri: mediaUrl }}
//                         style={styles.postImage}
//                         resizeMode='cover'
//                         repeat={true}
//                         muted={isMuted}
//                         paused={
//                           visibleVideoIndex !== index || pausedVideos[index]
//                         }
//                         onLoad={() => console.log(`Video ${index} loaded`)}
//                         onError={error =>
//                           console.log(`Video ${index} error:`, error)
//                         }
//                         onBuffer={() =>
//                           console.log(`Video ${index} buffering`)
//                         }
//                       />
//                     </View>
//                   ) : (
//                     <Image
//                       source={{ uri: mediaUrl }}
//                       style={styles.postImage}
//                       onError={error =>
//                         console.log(`Image ${index} error:`, error)
//                       }
//                       resizeMode='cover'
//                     />
//                   )}

//                   <View style={{
//                     height:40,
//                     width:'100%',
//                     backgroundColor:'rgba(0, 0, 0, 0.2)',
//                     position:'absolute',
//                     bottom:0,
//                     justifyContent:'center',
//                     borderBottomLeftRadius:20,
//                     borderBottomRightRadius:20
//                   }}>
//   {/* Actions */}
//               {!isNewsItem && (
//                 <View style={styles.actions}>
//                   <View style={styles.leftActions}>
//                     {/* Like Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity
//                         onPress={() => onLikeUnlike(post)}
//                         activeOpacity={0.7}>
//                         {post?.likes?.includes(selector?._id) ? (
//                           <GradientIcon
//                             colors={['#4F52FE', '#FC14CB']}
//                             size={20}
//                             iconType='Ionicons'
//                             name={'triangle'}
//                           />
//                         ) : (
//                           <GradientIcon
//                             colors={['#999', '#999']}
//                             size={16}
//                             iconType='Feather'
//                             name={'triangle'}
//                           />
//                         )}
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, {  color: '#7078e2ff' }]}>
//                         {post?.TotalLikes}
//                       </Text>
//                     </View>

//                     {/* Dislike Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity
//                         onPress={() => onDisLikes(post)}
//                         activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={post?.Unlikes?.includes(selector?._id) ? ['#4F52FE', '#FC14CB'] : ['#999', '#999']}
//                           size={16}
//                           iconType='Feather'
//                           name={'triangle'}
//                           style={{
//                             transform: [{ rotate: '180deg' }],
//                           }}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, {  color: '#7078e2ff'  }]}>
//                         {post?.TotalUnLikes}
//                       </Text>
//                     </View>

//                     {/* Comment Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           setModalVisible(true)
//                           fetchCommentDataOfaPost(post?._id)
//                           setPostId(post?._id)
//                         }}
//                         activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={['#4F52FE', '#FC14CB']}
//                           size={16}
//                           iconType='FontAwesome'
//                           name={'comment-o'}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalComents}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Bookmark Button */}
//                   <TouchableOpacity
//                     onPress={() => SavePost(post)}
//                     activeOpacity={0.7}>
//                     {post?.SavedBy?.includes(selector?._id) ? (
//                       <GradientIcon
//                         colors={['#4F52FE', '#FC14CB']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark'}
//                       />
//                     ) : (
//                       <GradientIcon
//                         colors={['#999', '#999']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark-o'}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               )}

//                   </View>

//                   {!isNewsItem && (
//                     <Animated.View
//                       pointerEvents='none'
//                       style={styles.heartAnimation}>
//                       <Animated.View
//                         style={{
//                           opacity: doubleTapIndex === index ? heartOpacity : 0,
//                           transform: [{ scale: heartScale }],
//                         }}>
//                         <MaterialIcons name='favorite' size={100} color='#FF1493' />
//                       </Animated.View>
//                     </Animated.View>
//                   )}

//                   {isVideo && (
//                     <TouchableOpacity
//                       style={styles.soundButton}
//                       onPress={() => setIsMuted(!isMuted)}
//                       activeOpacity={0.8}>
//                       <View style={styles.soundButtonInner}>
//                         {isMuted ? (
//                           <SpeakerOff />
//                         ) : (
//                           <AntDesign name={'sound'} color='white' size={16} />
//                         )}
//                       </View>
//                     </TouchableOpacity>
//                   )}
//                 </View>
//               </TouchableWithoutFeedback>

            
//             </TouchableOpacity>
//           )
//         }}
//         ListEmptyComponent={
//           !loaderVisible && (
//             <View style={styles.emptyContainer}>
//               <CustomText
//                 style={[styles.emptyText, { color: isDarkMode ? '#666' : '#999' }]}>
//                 No Posts Found
//               </CustomText>
//             </View>
//           )
//         }
//       />
//     )
//   }

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? '#000' : '#fff',
//     },
    
//     // Header Styles
//     headerIconContainer: {
//       width: 40,
//       height: 40,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderRadius: 20,
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//     },
//     tabsContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 24,
//       flex: 1,
//       justifyContent: 'center',
//     },
//     tabButton: {
//       alignItems: 'center',
//       gap: 6,
//     },
//     tabText: {
//       fontSize: 15,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       color: isDarkMode ? '#666' : '#999',
//     },
//     tabTextActive: {
//       color: isDarkMode ? '#fff' : '#000',
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//     },
//     tabIndicator: {
//       height: 3,
//       width: 50,
//       borderRadius: 2,
//     },

//     // Story Styles
//     storyContainer: {
//       alignItems: 'center',
//       marginRight: 16,
//       width: 70,
//     },
//     yourStoryWrapper: {
//       position: 'relative',
//     },
//     storyGradientBorder: {
//       width: 62,
//       height: 62,
//       borderRadius: 36,
//       padding: 3,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     storyImageContainer: {
//       width: 56,
//       height: 56,
//       borderRadius: 33,
//       overflow: 'hidden',
//       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
//     },
//     storyImage: {
//       width: '100%',
//       height: '100%',
//     },
//     addStoryButton: {
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//     },
//     addStoryGradient: {
//       width: 24,
//       height: 24,
//       borderRadius: 12,
//       justifyContent: 'center',
//       alignItems: 'center',
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#000' : '#fff',
//     },
//     storyText: {
//       fontSize: 12,
//       marginTop: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       textAlign: 'center',
//     },

//     // Feed Container
//     feedContainer: {
//       // borderBottomWidth: 8,
//       // borderBottomColor: isDarkMode ? '#0a0a0a' : '#f8f8f8',
//       paddingBottom: 12,
//       // backgroundColor: isDarkMode ? '#000' : '#fff',
//       backgroundColor:isDarkMode?'#161C1C': '#e4edeeff',
//       // elevation:1,
//       margin:10,
//       borderRadius:30,
//       borderWidth:1,
//       marginBottom:10,
//       borderColor:isDarkMode?'#333': '#E0E0E0',
//       paddingHorizontal:10
//       // elevation:1,
//     },

//     // Feed Header
//     feedHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       paddingHorizontal: 0,
//       paddingVertical: 12,
//     },
//     feedUserInfo: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     profileImageWrapper: {
//       marginRight: 12,
//     },
//     profileImage: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//     },
//     userNameRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 2,
//     },
//     username: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 15,
//     },
//     timeText: {
//       color: '#999',
//       fontSize: 12,
//       marginLeft: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     caption: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       lineHeight: 18,
//       color:isDarkMode?'#252525':'white'
//     },

//     // Media Container
//     mediaContainer: {
//       position: 'relative',
//       marginTop: 8,
//     },
//     postImage: {
//       width: '100%',
//       height: 350,
//       borderRadius:20
//     },
//     videoContainer: {
//       borderRadius: 0,
//       overflow: 'hidden',
//     },
//     heartAnimation: {
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: [{ translateX: -50 }, { translateY: -50 }],
//     },
//     soundButton: {
//       position: 'absolute',
//       bottom: 16,
//       right: 16,
//     },
//     soundButtonInner: {
//       backgroundColor: 'rgba(0, 0, 0, 0.6)',
//       padding: 8,
//       borderRadius: 20,
//       backdropFilter: 'blur(10px)',
//     },

//     // Actions
//     actions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//       // paddingTop: 12,
//     },
//     leftActions: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 16,
//     },
//     actionButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 6,
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 16,
//       backgroundColor: '#E0E0E0',
//       // backgroundColor:'rgba(0, 0, 0, 0.4)'
//     },
//     actionText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
   
//     },

//     // Advertisement Styles
//     adBadgeContainer: {
//       marginRight: 12,
//     },
//     adBadgeGradient: {
//       paddingHorizontal: 10,
//       paddingVertical: 5,
//       borderRadius: 6,
//     },
//     adBadge: {
//       fontSize: 11,
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       color: '#fff',
//       letterSpacing: 0.5,
//     },
//     adDotsContainer: {
//       position: 'absolute',
//       bottom: 12,
//       left: 0,
//       right: 0,
//       flexDirection: 'row',
//       justifyContent: 'center',
//       alignItems: 'center',
//       gap: 6,
//     },
//     adDot: {
//       width: 6,
//       height: 6,
//       borderRadius: 3,
//       backgroundColor: 'rgba(255, 255, 255, 0.4)',
//     },
//     adDotActive: {
//       backgroundColor: '#fff',
//       width: 20,
//       height: 6,
//       borderRadius: 3,
//     },
//     adNavButton: {
//       position: 'absolute',
//       top: '50%',
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       justifyContent: 'center',
//       alignItems: 'center',
//       transform: [{ translateY: -18 }],
//       backdropFilter: 'blur(10px)',
//     },
//     adNavButtonLeft: {
//       left: 12,
//     },
//     adNavButtonRight: {
//       right: 12,
//     },
//     adCtaContainer: {
//       marginHorizontal: 16,
//       marginTop: 12,
//       borderRadius: 12,
//       overflow: 'hidden',
//     },
//     adCtaGradient: {
//       padding: 14,
//       alignItems: 'center',
//     },
//     adCtaText: {
//       color: '#fff',
//       fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//       fontSize: 15,
//       letterSpacing: 0.5,
//     },

//     // Empty State
//     emptyContainer: {
//       alignItems: 'center',
//       justifyContent: 'center',
//       paddingVertical: 60,
//     },
//     emptyText: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 16,
//     },
//   })

//   const renderCommentModal = () => {
//     return (
//       <CommentModal
//         isVisible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onBackButtonPress={() => setModalVisible(false)}
//         comments={comments}
//         isDarkMode={isDarkMode}
//         commentText={commentText}
//         onChangeText={setCommentText}
//         onSendPress={() => {
//           console.log('Send:', commentText)
//           sendComments(postId, commentText)
//           setCommentText('')
//         }}
//         onDeleteComments={id => onDeleteComments(id)}
//         onEditComment={(id, text) => editComments(id, text)}
//       />
//     )
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor='transparent'
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />
//       {renderHeader()}
//       {selectedTab === 'home' && renderStories()}
//       {loading ? (
//         <FeedShimmerLoader isDarkMode={isDarkMode} count={5} />
//       ) : (
//         renderFeeds()
//       )}

//       {renderCommentModal()}

//       <PostDetailModal
//         visible={postDetailVisible}
//         onClose={() => {
//           setPostDetailVisible(false)
//           setSelectedPost(null)
//         }}
//         setPost={setSelectedPost}
//         post={selectedPost}
//         comments={comments}
//         isDarkMode={isDarkMode}
//         selector={selector}
//         onLikeUnlike={post => onLikeUnlike(post)}
//         onDisLikes={onDisLikes}
//         SavePost={SavePost}
//         onAddComment={(id, commentText) => { 
//           sendComments(postId, commentText); 
//           setCommentText('') 
//         }}
//         formatInstagramDate={formatInstagramDate}
//         isMuted={isMuted}
//         setIsMuted={setIsMuted}
//       />

//       {/* Floating Action Button */}
//       <TouchableOpacity
//         onPress={() => navigation.navigate('GalleryForAddPost')}
//         style={additionalStyles.fabContainer}
//         activeOpacity={0.9}>
      
//           <CameraButton />
//       </TouchableOpacity>
//     </View>
//   )
// }

// // Add these styles at the end of the styles object in renderFeeds():
// const additionalStyles = {
//   fabContainer: {
//     position: 'absolute',
//     bottom: 100,
//     right: 20,
//     // borderRadius: 30,
//     // elevation: 8,
//     // shadowColor: '#FF00FF',
//     // shadowOffset: { width: 0, height: 4 },
//     // shadowOpacity: 0.3,
//     // shadowRadius: 8,
//   },
//   fabGradient: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// }

// export default Home


import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  TouchableWithoutFeedback,
  TextInput,
  BackHandler,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native'
import CustomText from '../../components/TextComponent'
import IMG from '../../assets/Images'
import LocationManager from '../../utils/LocationManager'
import {
  AddPostBtn,
  AddStoryIcon,
  BellIcon,
  CameraButton,
  SpeakerOff,
} from '../../assets/SVGs'
import { FONTS_FAMILY } from '../../assets/Fonts'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import { useDispatch, useSelector } from 'react-redux'
import Video from 'react-native-video'
import { apiDelete, apiGet, apiPost, apiPut, getItem } from '../../utils/Apis'
import urls from '../../config/urls'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import useLoader from '../../utils/LoaderHook'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import CommentModal from './CommentModel'
import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
import messaging from '@react-native-firebase/messaging'
import PostDetailModal from './PostDetailModel'
import { setUser } from '../../redux/reducer/user'
import GradientIcon from '../../components/GradientIcon'
import LinearGradient from 'react-native-linear-gradient'
import { formatInstagramDate } from '../../utils/DateFormat'
import FeedCard from './FeedsCards'

const Home = ({ navigation }) => {
  const { isDarkMode } = useSelector(state => state.theme)
  const storyOpacity = useRef(new Animated.Value(0)).current
  const feedTranslateY = useRef(new Animated.Value(20)).current
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [allStories, setAllStories] = useState([])
  const [followedStories, setFollowedStories] = useState([])
  const [doubleTapIndex, setDoubleTapIndex] = useState(null)
  const heartOpacity = useRef(new Animated.Value(0)).current
  const [modalVisible, setModalVisible] = useState(false)
  const [postId, setPostId] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [isMuted, setIsMuted] = useState(true)
  const [visibleVideoIndex, setVisibleVideoIndex] = useState(0)
  const [pausedVideos, setPausedVideos] = useState({})
  const loaderVisible = useSelector(state => state?.loader?.loader)
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [tagLoading, setTagLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { showLoader, hideLoader } = useLoader()

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  const [selectedPost, setSelectedPost] = useState(null)
  const [postDetailVisible, setPostDetailVisible] = useState(false)
  const [locationStatus, setLocationStatus] = useState('idle')
  const [selectedTab, setSelectedTab] = useState('home')
  const [advertisements, setAdvertisements] = useState([])
  const [mergedFeedData, setMergedFeedData] = useState([])
  const [currentAdImageIndex, setCurrentAdImageIndex] = useState({})
  const [newsData, setNewsData] = useState([])

  const heartScale = useRef(new Animated.Value(0)).current
  let lastTap = null

  const fetchAdvertisements = async () => {
    try {
      const res = await apiGet('/api/admin/GetAllActiveAdvertisement')
      if (res?.data) {
        setAdvertisements(res.data)
        const initialAdImageIndex = {}
        res.data.forEach(ad => {
          initialAdImageIndex[ad._id] = 0
        })
        setCurrentAdImageIndex(initialAdImageIndex)
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error)
    }
  }

  const fetchNewsData = async () => {
    try {
      const res = await apiGet('/api/admin/GetAllPublishedNews')
      if (res?.data) {
        setNewsData(res.data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    }
  }

  const SearchTags = async (tag) => {
    try {
      if (!tag.trim()) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }
      setTagLoading(true)
      const response = await apiGet(`/api/admin/SearchHashtags?query=${tag}`)
      setSuggestions(response?.data || [])
      setShowSuggestions(true)
      setTagLoading(false)
    } catch (error) {
      setTagLoading(false)
      console.error("Error fetching tags:", error)
    }
  }

  const mergeFeedWithAds = (posts, ads) => {
    if (!ads || ads.length === 0) {
      return posts.map(post => ({ type: 'post', data: post }))
    }

    const merged = []
    const adInterval = 3
    let adIndex = 0

    posts.forEach((post, index) => {
      merged.push({ type: 'post', data: post })
      if ((index + 1) % adInterval === 0 && adIndex < ads.length) {
        merged.push({ type: 'ad', data: ads[adIndex] })
        adIndex = (adIndex + 1) % ads.length
      }
    })

    return merged
  }

  const handleAdImageNext = (adId, totalImages) => {
    setCurrentAdImageIndex(prev => ({
      ...prev,
      [adId]: (prev[adId] + 1) % totalImages
    }))
  }

  const handleAdImagePrev = (adId, totalImages) => {
    setCurrentAdImageIndex(prev => ({
      ...prev,
      [adId]: prev[adId] === 0 ? totalImages - 1 : prev[adId] - 1
    }))
  }

  const handleAdClick = (ad) => {
    if (ad.url) {
      Linking.openURL(ad.url).catch(err =>
        console.error('Failed to open URL:', err)
      )
    }
  }

  const handlePostClick = item => {
    setSelectedPost(item)
    setPostDetailVisible(true)
    fetchCommentDataOfaPost(item._id)
  }

  console.log('--------------');
  

  useFocusEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'EXIT',
          onPress: () => BackHandler.exitApp(),
        },
      ])
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )
    return () => backHandler.remove()
  })

  useEffect(() => {
    initializeFirebase()
  }, [])

  const initializeFirebase = async () => {
    try {
      await requestNotificationPermission()
    } catch (error) {
      console.error('Firebase initialization error:', error)
    }
  }

  const requestNotificationPermission = async () => {
    try {
      let hasPermission = false

      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          )
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED
        } else {
          hasPermission = true
        }
      } else {
        const authStatus = await messaging().requestPermission()
        hasPermission =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
      }

      if (hasPermission) {
        await getFCMToken()
      }
    } catch (error) {
      console.error('Permission error:', error)
    }
  }

  const getFCMToken = async () => {
    try {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages()
      }
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
        console.log('FCM Token:', fcmToken)
      }
    } catch (error) {
      console.error('FCM Token Error:', error)
    }
  }

  const triggerHeartAnimation = index => {
    setDoubleTapIndex(index)
    heartOpacity.setValue(0)
    heartScale.setValue(0)

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
        }),
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
        }),
      ]),
    ]).start()
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleVideoIndex(viewableItems[0].index)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const isFocused = useIsFocused()

  // useEffect(() => {
  //   Animated.timing(storyOpacity, {
  //     toValue: 1,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start()

  //   Animated.timing(feedTranslateY, {
  //     toValue: 0,
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start()
  // }, [])

  useEffect(() => {
    fetchData()
    getCurrentStories()
    getFollwedStories()
    initializeLocation()
    fetchAdvertisements()
    fetchNewsData()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await getItem('token')
      setLoading(true)

      try {
        if (token) {
          const getUserDetails = await apiGet(urls.userProfile)
          dispatch(setUser(JSON.stringify(getUserDetails?.data)))
          setLoading(false)
        } else {
          navigation.replace('Onboarding')
          setLoading(false)
        }
      } catch (error) {
        console.log('Fetch data error:', error)
        navigation.replace('Onboarding')
        setLoading(false)
      }
    }

    LocationManager.setLocationUpdateCallback(fetchUserData)
    LocationManager.initializeLocationTracking()

    return () => {
      LocationManager.setLocationUpdateCallback(null)
      LocationManager.stopLocationTracking()
    }
  }, [])

  const initializeLocation = async () => {
    try {
      setLocationStatus('updating')
      await LocationManager.initializeLocationTracking()
      setLocationStatus('updated')
      setTimeout(() => setLocationStatus('idle'), 2000)
    } catch (error) {
      console.log('Location initialization failed:', error)
      setLocationStatus('error')
      setTimeout(() => setLocationStatus('idle'), 3000)
    }
  }

  const updateLocationOnFocus = async () => {
    try {
      await LocationManager.checkAndUpdateLocation()
    } catch (error) {
      console.log('Foreground location update failed:', error)
    }
  }

  useEffect(() => {
    return () => {
      LocationManager.stopLocationTracking()
    }
  }, [])

  useEffect(() => {
    getCurrentStories()
    getFollwedStories()
    if (isFocused) {
      updateLocationOnFocus()
    }
  }, [isFocused])

  useEffect(() => {
    let dataToMerge = []

    if (selectedTab === 'News') {
      dataToMerge = newsData
    } else {
      const filteredPosts = allPosts.filter(item => {
        const hasImage = item?.media && !item?.media.toLowerCase().includes('.mp4')
        const isTop25 = selectedTab === 'Top25' ? item?.TotalLikes > 25 : true
        return hasImage && isTop25
      })
      dataToMerge = filteredPosts
    }

    const merged = mergeFeedWithAds(dataToMerge, advertisements)
    setMergedFeedData(merged)
  }, [allPosts, advertisements, selectedTab, newsData])

  const onRefresh = async () => {
    setLoading(true)
    await fetchData()
    await getCurrentStories()
    await getFollwedStories()
    await fetchAdvertisements()
    await fetchNewsData()
    setLoading(false)
  }

  const fetchCommentDataOfaPost = async id => {
    const res = await apiGet(`${urls.getAllCommentofaPost}/${id}`)
    setComments(res?.data)
  }

  const sendComments = async (id, text) => {
    const data = {
      Post: id,
      text: text,
    }
    const res = await apiPost(`${urls.sendCommentOnPost}`, data)
    fetchCommentDataOfaPost(id)
  }

  const editComments = async (id, text) => {
    const data = {
      text: text,
    }
    const res = await apiPut(`${urls.editComment}/${id}`, data)
    fetchCommentDataOfaPost(postId)
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const endpoint = searchText.trim() 
        ? `/api/user/SearchPostsByHashtag?tag=${searchText}`
        : urls.getAllPost
      const res = await apiGet(endpoint)
      setAllPosts(res?.data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [searchText])

  const getCurrentStories = async () => {
    try {
      const res = await apiGet(urls.getCurrentStories)
      setAllStories(res?.data)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  const getFollwedStories = async () => {
    try {
      const res = await apiGet(urls.followedUserStories)
      setFollowedStories(res?.data)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  const SavePost = async item => {
    const postId = item._id
    const userId = selector?._id
    setAllPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post._id === postId) {
          const alreadySaved = post.SavedBy.includes(userId)
          const updatedSavedBy = alreadySaved
            ? post.SavedBy.filter(id => id !== userId)
            : [...post.SavedBy, userId]

          return {
            ...post,
            SavedBy: updatedSavedBy,
          }
        }
        return post
      })
    })

    try {
      const endPoint = item?.SavedBy?.includes(userId)
        ? `${urls.removeSavedPost}/${postId}`
        : `${urls.SavePost}/${postId}`

      const res = await apiGet(endPoint)
    } catch (error) {
      console.log('Save Post Error:', error)
      setAllPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post._id === postId) {
            const wasSaved = item.SavedBy.includes(userId)
            const revertedSavedBy = wasSaved
              ? [...post.SavedBy, userId]
              : post.SavedBy.filter(id => id !== userId)

            return {
              ...post,
              SavedBy: revertedSavedBy,
            }
          }
          return post
        })
      })
    }
  }

  const onLikeUnlike = async item => {
    const postId = item._id
    const userId = selector?._id
    setAllPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post._id === postId) {
          const alreadyLiked = post.likes.includes(userId)
          const updatedLikes = alreadyLiked
            ? post.likes.filter(id => id !== userId)
            : [...post.likes, userId]

          return {
            ...post,
            likes: updatedLikes,
            TotalLikes: alreadyLiked
              ? post.TotalLikes - 1
              : post.TotalLikes + 1,
          }
        }
        return post
      })
    })
    try {
      await apiGet(`${urls.likeUnlike}/${postId}`)
    } catch (error) {
      console.log('Error in like/unlike', error)
      setAllPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post._id === postId) {
            const wasLiked = item.likes.includes(userId)
            const revertedLikes = wasLiked
              ? [...post.likes, userId]
              : post.likes.filter(id => id !== userId)

            return {
              ...post,
              likes: revertedLikes,
              TotalLikes: wasLiked ? post.TotalLikes + 1 : post.TotalLikes - 1,
            }
          }
          return post
        })
      })
    }
  }

  const onDisLikes = async item => {
    const postId = item._id
    const userId = selector?._id
    setAllPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post._id === postId) {
          const alreadyLiked = post.Unlikes.includes(userId)
          const updatedLikes = alreadyLiked
            ? post.Unlikes.filter(id => id !== userId)
            : [...post.Unlikes, userId]

          return {
            ...post,
            Unlikes: updatedLikes,
            TotalUnLikes: alreadyLiked
              ? post.TotalUnLikes - 1
              : post.TotalUnLikes + 1,
          }
        }
        return post
      })
    })
    try {
      await apiGet(`${urls.disLikePost}/${postId}`)
    } catch (error) {
      console.log('Error in like/unlike', error)
      setAllPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post._id === postId) {
            const wasLiked = item.Unlikes.includes(userId)
            const revertedLikes = wasLiked
              ? [...post.Unlikes, userId]
              : post.Unlikes.filter(id => id !== userId)

            return {
              ...post,
              Unlikes: revertedLikes,
              TotalUnLikes: wasLiked
                ? post.TotalUnLikes + 1
                : post.TotalUnLikes - 1,
            }
          }
          return post
        })
      })
    }
  }

  const onDeleteComments = async id => {
    try {
      showLoader()
      const response = await apiDelete(`/api/user/DeleteComment/${id}`)
      fetchCommentDataOfaPost(postId)
    } catch (error) {
      console.log(
        'DeleteComment Error:',
        error?.response?.data || error.message,
      )
    } finally {
      hideLoader()
    }
  }

  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: isDarkMode ? '#000' : '#fff',
          // paddingBottom: 8,
        }}
      >
        <SpaceBetweenRow
          style={{
            paddingTop: 50,
            paddingHorizontal: 20,
            paddingBottom:selectedTab === 'home'?0: 12,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('GalleryForAddPost')}
            style={styles.headerIconContainer}>
            <GradientIcon
              // colors={['#4F52FE', '#FC14CB']}
                colors={['#21B7FF', '#0084F8']}
              size={20}
              iconType='FontAwesome5'
              name={'sliders-h'}
            />
          </TouchableOpacity>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setSelectedTab('home')}
              activeOpacity={0.7}
            >
              <CustomText
                style={[
                  styles.tabText,
                  selectedTab === 'home' && styles.tabTextActive
                ]}
              >Home</CustomText>
              {selectedTab === 'home' && (
                <LinearGradient
                  // colors={['#FF00FF', '#4B6BFF']}
                    colors={['#21B7FF', '#0084F8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setSelectedTab('Top25')}
              activeOpacity={0.7}
            >
              <CustomText
                style={[
                  styles.tabText,
                  selectedTab === 'Top25' && styles.tabTextActive
                ]}
              >Top25</CustomText>
              {selectedTab === 'Top25' && (
                <LinearGradient
                  // colors={['#FF00FF', '#4B6BFF']}
                    colors={['#21B7FF', '#0084F8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setSelectedTab('News')}
              activeOpacity={0.7}
            >
              <CustomText
                style={[
                  styles.tabText,
                  selectedTab === 'News' && styles.tabTextActive
                ]}
              >News</CustomText>
              {selectedTab === 'News' && (
                <LinearGradient
                  // colors={['#FF00FF', '#4B6BFF']}
                    colors={['#21B7FF', '#0084F8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Activity')}
            style={styles.headerIconContainer}>
            {/* <BellIcon /> */}
                <GradientIcon
              // colors={['#4F52FE', '#FC14CB']}
                colors={['#21B7FF', '#0084F8']}
              size={20}
              iconType='FontAwesome5'
              name={'bell'}
            />
          </TouchableOpacity>
        </SpaceBetweenRow>
      </View>
    )
  }

  const renderSearchBar = () => {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather 
            name="search" 
            size={18} 
            color={isDarkMode ? '#666' : '#999'} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { 
                color: isDarkMode ? '#fff' : '#000',
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
              }
            ]}
            placeholder="Search posts, hashtags..."
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text)
              SearchTags(text)
            }}
            onFocus={() => searchText && setShowSuggestions(true)}
          />
          {searchText !== '' && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('')
                setSuggestions([])
                setShowSuggestions(false)
              }}
              style={styles.clearButton}
            >
              <AntDesign name="closecircle" size={16} color={isDarkMode ? '#666' : '#999'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={[
            styles.suggestionsContainer,
            { backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }
          ]}>
            {tagLoading ? (
              <View style={styles.suggestionItem}>
                <Text style={[styles.suggestionText, { color: isDarkMode ? '#666' : '#999' }]}>
                  Loading...
                </Text>
              </View>
            ) : (
              suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    setSearchText(item.Tag)
                    setShowSuggestions(false)
                    setSuggestions([])
                  }}
                  activeOpacity={0.7}
                >
                  <Feather name="hash" size={14} color="#4B6BFF" />
                  <Text style={[
                    styles.suggestionText,
                    { color: isDarkMode ? '#fff' : '#000' }
                  ]}>
                    {item.Tag}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </View>
    )
  }

  const renderStories = () => {
    return (
      <View
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: isDarkMode ? '#333' : '#E5E5E5',
        }}>
        <Animated.View
          style={{
            paddingVertical: 5,
            backgroundColor: isDarkMode ? '#000' : '#fff',
            // opacity: storyOpacity,
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}>
            
            {/* Your Story */}
            <View style={styles.storyContainer}>
              <TouchableOpacity
                style={styles.yourStoryWrapper}
                onPress={() =>
                  navigation.navigate('StoryScreen', {
                    storyImage: allStories,
                    User: selector,
                  })
                }
                activeOpacity={0.8}>
                <LinearGradient
                  colors={allStories[0]?.media ? 
                    // ['#FF00FF', '#4B6BFF'] 
                    ['#21B7FF', '#0084F8']
                    : ['#E5E5E5', '#E5E5E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.storyGradientBorder}>
                  <View style={styles.storyImageContainer}>
                    <Image
                      source={
                        allStories[0]?.media
                          ? { uri: allStories[0]?.media }
                          : IMG.TomoLogo
                      }
                      style={styles.storyImage}
                    />
                  </View>
                </LinearGradient>
                <TouchableOpacity
                  style={styles.addStoryButton}
                  onPress={() => navigation.navigate('GalleryPickerScreen')}
                  activeOpacity={0.9}>
                  <LinearGradient
                    // colors={['#FF00FF', '#4B6BFF']}
                      colors={['#21B7FF', '#0084F8']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.addStoryGradient}>
                    <AddStoryIcon />
                  </LinearGradient>
                </TouchableOpacity>
              </TouchableOpacity>
              <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
                Your Story
              </Text>
            </View>

            {/* Other Stories */}
            {followedStories?.map((item, index) => {
              const key = item?._id || `story-${index}`
              if (item?.User?.Stories?.length > 0) {
                return (
                  <View key={key} style={styles.storyContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('StoryScreen', {
                          storyImage: item.User?.Stories,
                          User: item?.User,
                        })
                      }
                      activeOpacity={0.8}>
                      <LinearGradient
                        // colors={['#FF00FF', '#4B6BFF']}
                          colors={['#21B7FF', '#0084F8']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.storyGradientBorder}>
                        <View style={styles.storyImageContainer}>
                          <Image
                            source={
                              item.User?.Stories?.length > 0
                                ? { uri: item.User?.Stories[0]?.media }
                                : IMG.AddStoryImage
                            }
                            style={styles.storyImage}
                          />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                    <Text style={[styles.storyText, { color: isDarkMode ? '#fff' : '#000' }]} numberOfLines={1}>
                      {item?.User?.UserName}
                    </Text>
                  </View>
                )
              } else {
                return null
              }
            })}
          </ScrollView>
        </Animated.View>
      </View>
    )
  }

  const renderAdvertisement = (ad, index) => {
    const currentImageIndex = currentAdImageIndex[ad._id] || 0
    const currentMedia = ad.media[currentImageIndex]
    const totalImages = ad.media.length

    return (
      <TouchableOpacity
        style={styles.feedContainer}
        key={`ad-${ad._id}-${index}`}
        onPress={() => handleAdClick(ad)}
        activeOpacity={0.95}
      >
        {/* Ad Header */}
        <View style={styles.feedHeader}>
          <View style={styles.feedUserInfo}>
            <View style={styles.adBadgeContainer}>
              <LinearGradient
                // colors={['#FF00FF', '#4B6BFF']}
                  colors={['#21B7FF', '#0084F8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.adBadgeGradient}>
                <CustomText style={styles.adBadge}>Sponsored</CustomText>
              </LinearGradient>
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>{ad.name}</Text>
              <Text style={[styles.caption, { fontSize: 12, color: isDarkMode ? '#999' : '#666' }]}>{ad.location}</Text>
            </View>
          </View>
        </View>

        {/* Ad Image/Video with Navigation */}
        <View style={styles.mediaContainer}>
          {currentMedia.type === 'image' ? (
            <Image
              source={{ uri: currentMedia.url }}
              style={styles.postImage}
              resizeMode='cover'
            />
          ) : (
            <Video
              source={{ uri: currentMedia.url }}
              style={styles.postImage}
              resizeMode='cover'
              repeat={true}
              muted={isMuted}
            />
          )}

          {/* Image Navigation Dots */}
          {totalImages > 1 && (
            <>
              <View style={styles.adDotsContainer}>
                {ad.media.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.adDot,
                      currentImageIndex === idx && styles.adDotActive
                    ]}
                  />
                ))}
              </View>

              {/* Navigation Arrows */}
              {currentImageIndex > 0 && (
                <TouchableOpacity
                  style={[styles.adNavButton, styles.adNavButtonLeft]}
                  onPress={() => handleAdImagePrev(ad._id, totalImages)}
                  activeOpacity={0.8}
                >
                  <AntDesign name="left" size={18} color="white" />
                </TouchableOpacity>
              )}

              {currentImageIndex < totalImages - 1 && (
                <TouchableOpacity
                  style={[styles.adNavButton, styles.adNavButtonRight]}
                  onPress={() => handleAdImageNext(ad._id, totalImages)}
                  activeOpacity={0.8}>
                  <AntDesign name="right" size={18} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Ad CTA */}
        <TouchableOpacity style={styles.adCtaContainer} activeOpacity={0.8}>
          <LinearGradient
            // colors={['#FF00FF', '#4B6BFF']}
              colors={['#21B7FF', '#0084F8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.adCtaGradient}>
            <CustomText style={styles.adCtaText}>
              Learn More →
            </CustomText>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

const renderFeeds = () => {
  return (
    <FlatList
      data={mergedFeedData}
      renderItem={({ item, index }) => {
        if (item.type === 'ad') {
          return renderAdvertisement(item.data, index);
        }

        const post = item.data;
        const isNewsItem = selectedTab === 'News';
        const mediaUrl = post.media;
        const isVideo = isNewsItem
          ? post.mediatype === 'video'
          : typeof mediaUrl === 'string' &&
            (mediaUrl.includes('.mp4') ||
             mediaUrl.includes('.mov') ||
             mediaUrl.includes('video') ||
             mediaUrl.includes('.avi'));

        return (
          <FeedCard
            post={post}
            index={index}
            styles={styles} // Parent styles pass kar rahe
            isDarkMode={isDarkMode}
            isNewsItem={isNewsItem}
            isVideo={isVideo}
            mediaUrl={mediaUrl}
            visibleVideoIndex={visibleVideoIndex}
            pausedVideos={pausedVideos}
            isMuted={isMuted}
            selector={selector}
            doubleTapIndex={doubleTapIndex}
            heartOpacity={heartOpacity}
            heartScale={heartScale}
            formatInstagramDate={formatInstagramDate}
            
            // Event Handlers
            onPostPress={() => !isNewsItem && handlePostClick(post)}
            onUserPress={() => {
              if (!isNewsItem) {
                navigation.navigate('OtherUserDetail', {
                  userId: post?.User?._id,
                });
              }
            }}
            onMediaPress={() => {
              if (isNewsItem) return;
              const now = Date.now();
              if (lastTap && now - lastTap < 300) {
                triggerHeartAnimation(index);
                onLikeUnlike(post);
              } else {
                lastTap = now;
                handlePostClick(post);
              }
            }}
            onLikePress={() => onLikeUnlike(post)}
            onDislikePress={() => onDisLikes(post)}
            onCommentPress={() => {
              setModalVisible(true);
              fetchCommentDataOfaPost(post?._id);
              setPostId(post?._id);
            }}
            onBookmarkPress={() => SavePost(post)}
            onMuteToggle={() => setIsMuted(!isMuted)}
          />
        );
      }}
      // ... baki FlatList props same rahenge
    />
  );
};



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    
    // Header Styles
    headerIconContainer: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    },
    tabsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 24,
      flex: 1,
      justifyContent: 'center',
    },
    tabButton: {
      alignItems: 'center',
      gap: 6,
    },
    tabText: {
      fontSize: 15,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? '#666' : '#999',
    },
    tabTextActive: {
      color: isDarkMode ? '#fff' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
    },
    tabIndicator: {
      height: 3,
      width: 50,
      borderRadius: 2,
    },

    // Search Bar Styles
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isDarkMode ? '#000' : '#fff',
      position: 'relative',
      zIndex: 1000,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      paddingHorizontal: 12,
      position: 'relative',
       backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 44,
      fontSize: 15,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      paddingVertical: 10,
      borderRadius: 12,
      paddingLeft: 36,
    },
    clearButton: {
      position: 'absolute',
      right: 12,
      padding: 4,
    },
    suggestionsContainer: {
      marginTop: 8,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
      maxHeight: 240,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: isDarkMode ? '#333' : '#f0f0f0',
    },
    suggestionText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },

    // Story Styles
    storyContainer: {
      alignItems: 'center',
      marginRight: 16,
      width: 70,
    },
    yourStoryWrapper: {
      position: 'relative',
    },
    storyGradientBorder: {
      width: 62,
      height: 62,
      borderRadius: 36,
      padding: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    storyImageContainer: {
      width: 56,
      height: 56,
      borderRadius: 33,
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
    },
    storyImage: {
      width: '100%',
      height: '100%',
    },
    addStoryButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    addStoryGradient: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDarkMode ? '#000' : '#fff',
    },
    storyText: {
      fontSize: 12,
      marginTop: 6,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      textAlign: 'center',
    },

    // Feed Container
    feedContainer: {
      paddingBottom: 12,
      backgroundColor: isDarkMode ? '#161C1C' : '#e4edeeff',
      margin: 10,
      borderRadius: 30,
      borderWidth: 1,
      marginBottom: 10,
      borderColor: isDarkMode ? '#333' : '#E0E0E0',
      paddingHorizontal: 10
    },

    // Feed Header
    feedHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 0,
      paddingVertical: 12,
    },
    feedUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    profileImageWrapper: {
      marginRight: 12,
    },
    profileImage: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 2,
      borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    username: {
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      fontSize: 15,
    },
    timeText: {
      color: '#999',
      fontSize: 12,
      marginLeft: 6,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    caption: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      lineHeight: 18,
      color: isDarkMode ? '#252525' : 'white'
    },

    // Media Container
    mediaContainer: {
      position: 'relative',
      marginTop: 8,
    },
    postImage: {
      width: '100%',
      height: 350,
      borderRadius: 20
    },
    videoContainer: {
      borderRadius: 0,
      overflow: 'hidden',
    },
    heartAnimation: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    soundButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
    },
    soundButtonInner: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 8,
      borderRadius: 20,
      backdropFilter: 'blur(10px)',
    },

    // Actions
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: '#E0E0E0',
    },
    actionText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    },

    // Advertisement Styles
    adBadgeContainer: {
      marginRight: 12,
    },
    adBadgeGradient: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    adBadge: {
      fontSize: 11,
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      color: '#fff',
      letterSpacing: 0.5,
    },
    adDotsContainer: {
      position: 'absolute',
      bottom: 12,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    adDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    adDotActive: {
      backgroundColor: '#fff',
      width: 20,
      height: 6,
      borderRadius: 3,
    },
    adNavButton: {
      position: 'absolute',
      top: '50%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateY: -18 }],
      backdropFilter: 'blur(10px)',
    },
    adNavButtonLeft: {
      left: 12,
    },
    adNavButtonRight: {
      right: 12,
    },
    adCtaContainer: {
      marginHorizontal: 16,
      marginTop: 12,
      borderRadius: 12,
      overflow: 'hidden',
    },
    adCtaGradient: {
      padding: 14,
      alignItems: 'center',
    },
    adCtaText: {
      color: '#fff',
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      fontSize: 15,
      letterSpacing: 0.5,
    },

    // Empty State
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      fontSize: 16,
    },
  })

  const renderCommentModal = () => {
    return (
      <CommentModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        comments={comments}
        isDarkMode={isDarkMode}
        commentText={commentText}
        onChangeText={setCommentText}
        onSendPress={() => {
          sendComments(postId, commentText)
          setCommentText('')
        }}
        onDeleteComments={id => onDeleteComments(id)}
        onEditComment={(id, text) => editComments(id, text)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {renderHeader()}
    
        {selectedTab === 'home' && renderSearchBar()}
      {selectedTab === 'home' && renderStories()}
      {loading ? (
        <FeedShimmerLoader isDarkMode={isDarkMode} count={5} />
      ) : (
        renderFeeds()
      )}

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
        onAddComment={(id, commentText) => { 
          sendComments(postId, commentText)
          setCommentText('') 
        }}
        formatInstagramDate={formatInstagramDate}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('GalleryForAddPost')}
        style={additionalStyles.fabContainer}
        activeOpacity={0.9}>
        {/* <CameraButton /> */}
        <AddPostBtn/>
      </TouchableOpacity>
    </View>
  )
}

const additionalStyles = {
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
}

// export default Home
export default React.memo(Home);





// Home.js glowing

// import React, { useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Animated,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
// } from 'react-native';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { 
//   App_Primary_color, 
//   dark33, 
//   dark55, 
//   darkMode25, 
//   white 
// } from '../../common/Colors/colors';
// import { useSelector } from 'react-redux';

// const { width } = Dimensions.get('window');

// // ============= ANIMATED STAR COMPONENT =============
// const Star = ({ delay, duration, startX, startY }) => {
//   const animatedValue = useRef(new Animated.Value(0)).current;
//   const opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const animate = () => {
//       animatedValue.setValue(0);
//       opacity.setValue(0);

//       Animated.parallel([
//         Animated.timing(animatedValue, {
//           toValue: 1,
//           duration: duration,
//           delay: delay,
//           useNativeDriver: true,
//         }),
//         Animated.sequence([
//           Animated.timing(opacity, {
//             toValue: 1,
//             duration: duration * 0.3,
//             delay: delay,
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacity, {
//             toValue: 0,
//             duration: duration * 0.3,
//             delay: duration * 0.4,
//             useNativeDriver: true,
//           }),
//         ]),
//       ]).start(() => animate());
//     };

//     animate();
//   }, []);

//   const translateX = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [startX, startX + (Math.random() - 0.5) * 100],
//   });

//   const translateY = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [startY, startY + Math.random() * 150],
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.star,
//         {
//           opacity,
//           transform: [{ translateX }, { translateY }],
//         },
//       ]}
//     />
//   );
// };

// // ============= MAGIC CARD COMPONENT =============
// const MagicCard = ({ title, description, colors, isDarkMode, index, totalCards }) => {
//   const glowAnim = useRef(new Animated.Value(0)).current;
//   const shimmerAnim = useRef(new Animated.Value(0)).current;
//   const borderAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Continuous glow animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 3000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 3000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();

//     // Shimmer effect
//     Animated.loop(
//       Animated.timing(shimmerAnim, {
//         toValue: 1,
//         duration: 4000,
//         useNativeDriver: true,
//       })
//     ).start();

//     // ONE BY ONE BORDER SHINE ANIMATION
//     const totalAnimationTime = totalCards * 900; // 800ms per card
//     const delayPerCard = 4000;
//     const cardDelay = index * delayPerCard;

//     const animateBorder = () => {
//       borderAnim.setValue(0);
      
//       Animated.sequence([
//         Animated.delay(cardDelay),
//         Animated.timing(borderAnim, {
//           toValue: 1,
//           duration: 600,
//           useNativeDriver: false,
//         }),
//         Animated.timing(borderAnim, {
//           toValue: 0,
//           duration: 5000,
//           useNativeDriver: false,
//         }),
//         Animated.delay(totalAnimationTime - cardDelay - 1000),
//       ]).start(() => animateBorder());
//     };

//     animateBorder();
//   }, [index, totalCards]);

//   const glowOpacity = glowAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.3, 0.6, 0.3],
//   });

//   const shimmerTranslate = shimmerAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-200, 400],
//   });

//   // Border shine animation interpolation
//   const borderOpacity = borderAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.3, 1, 0.3],
//   });

//   const borderWidth = borderAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [1.5, 3, 1.5],
//   });

//   const shadowRadius = borderAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0, 15],
//   });

//   // Generate random stars
//   const stars = Array.from({ length: 15 }, (_, i) => ({
//     id: i,
//     startX: Math.random() * (width - 40),
//     startY: Math.random() * 200,
//     delay: Math.random() * 2000,
//     duration: 2000 + Math.random() * 2000,
//   }));

//   return (
//     <View style={styles.cardContainer}>
//       <Animated.View 
//         style={[
//           styles.card, 
//           { 
//             backgroundColor: isDarkMode ? dark33 : '#1a1a1a',
//             shadowColor: colors?.border2 || '#fff',
//             shadowOpacity: shadowRadius.interpolate({
//               inputRange: [0, 15],
//               outputRange: [0, 0.8],
//             }),
//             shadowRadius: shadowRadius,
//             elevation: shadowRadius.interpolate({
//               inputRange: [0, 15],
//               outputRange: [3, 20],
//             }),
//           }
//         ]}
//       >
//         {/* Animated Stars */}
//         <View style={styles.starsContainer}>
//           {stars.map((star) => (
//             <Star
//               key={star.id}
//               delay={star.delay}
//               duration={star.duration}
//               startX={star.startX}
//               startY={star.startY}
//             />
//           ))}
//         </View>

//         {/* Glow Effect */}
//         <Animated.View
//           style={[
//             styles.glow,
//             {
//               opacity: glowOpacity,
//               backgroundColor: colors?.glow || 'rgba(100, 200, 255, 0.2)',
//             },
//           ]}
//           pointerEvents="none"
//         />

//         {/* Shimmer Effect */}
//         <Animated.View
//           style={[
//             styles.shimmer,
//             {
//               transform: [{ translateX: shimmerTranslate }],
//               backgroundColor: colors?.shimmer || 'rgba(255, 255, 255, 0.1)',
//             },
//           ]}
//           pointerEvents="none"
//         />

//         {/* ONE BY ONE ANIMATED BORDER - MAIN EFFECT */}
//         <Animated.View
//           style={[
//             StyleSheet.absoluteFill,
//             {
//               borderRadius: 16,
//               borderWidth: borderWidth,
//               borderColor: colors?.border2 || 'rgba(100, 200, 255, 0.9)',
//               opacity: borderOpacity,
//             },
//           ]}
//           pointerEvents="none"
//         />

//         {/* Static Border (Base) */}
//         <View
//           style={[
//             StyleSheet.absoluteFill,
//             {
//               borderRadius: 16,
//               borderWidth: 1,
//               borderColor: colors?.border1 || 'rgba(100, 200, 255, 0.2)',
//             },
//           ]}
//           pointerEvents="none"
//         />

//         {/* Content */}
//         <View style={styles.content}>
//           <Text style={[styles.title, { color: isDarkMode ? white : '#fff' }]}>
//             {title}
//           </Text>
//           <Text style={styles.description}>{description}</Text>
//         </View>
//       </Animated.View>
//     </View>
//   );
// };

// // ============= MAIN SCREEN =============
// const AnimatedCardsScreen = ({ navigation }) => {
//   const { isDarkMode } = useSelector(state => state.theme);

//   const cards = [
//     {
//       title: '🎨 Design',
//       description: 'Beautiful UI/UX that captivates users',
//       colors: {
//         glow: 'rgba(255, 100, 200, 0.2)',
//         shimmer: 'rgba(255, 100, 200, 0.15)',
//         border1: 'rgba(255, 100, 200, 0.3)',
//         border2: 'rgba(255, 100, 200, 0.9)',
//       },
//     },
//     {
//       title: '⚡ Performance',
//       description: 'Lightning fast 60fps animations',
//       colors: {
//         glow: 'rgba(100, 200, 255, 0.2)',
//         shimmer: 'rgba(100, 200, 255, 0.15)',
//         border1: 'rgba(100, 200, 255, 0.3)',
//         border2: 'rgba(100, 200, 255, 0.9)',
//       },
//     },
//     {
//       title: '🚀 Innovation',
//       description: 'Cutting-edge mobile features',
//       colors: {
//         glow: 'rgba(100, 255, 150, 0.2)',
//         shimmer: 'rgba(100, 255, 150, 0.15)',
//         border1: 'rgba(100, 255, 150, 0.3)',
//         border2: 'rgba(100, 255, 150, 0.9)',
//       },
//     },
//     {
//       title: '💎 Quality',
//       description: 'Premium crafted components',
//       colors: {
//         glow: 'rgba(255, 200, 100, 0.2)',
//         shimmer: 'rgba(255, 200, 100, 0.15)',
//         border1: 'rgba(255, 200, 100, 0.3)',
//         border2: 'rgba(255, 200, 100, 0.9)',
//       },
//     },
//     {
//       title: '🔥 Magic',
//       description: 'Delightful user interactions',
//       colors: {
//         glow: 'rgba(200, 100, 255, 0.2)',
//         shimmer: 'rgba(200, 100, 255, 0.15)',
//         border1: 'rgba(200, 100, 255, 0.3)',
//         border2: 'rgba(200, 100, 255, 0.9)',
//       },
//     },
//   ];

//   return (
//     <View style={[styles.container]}>
//       <View style={[styles.header, ]}>
//         <Text style={[styles.headerTitle, { fontFamily: FONTS_FAMILY.Poppins_Bold }]}>
//           Magic Cards ✨
//         </Text>
//         <Text style={[styles.subtitle, { fontFamily: FONTS_FAMILY.Poppins_Regular }]}>
//           Borders shine one by one continuously
//         </Text>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {cards.map((card, index) => (
//           <MagicCard
//             key={index}
//             index={index}
//             totalCards={cards.length}
//             title={card.title}
//             description={card.description}
//             colors={card.colors}
//             isDarkMode={isDarkMode}
//           />
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor:'black'
//   },
//   header: {
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     backgroundColor:'black'

//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#888',
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor:'black'
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   cardContainer: {
//     marginVertical: 10,
//     marginHorizontal: 20,
//   },
//   card: {
//     height: 200,
//     width: width - 40,
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowOffset: { width: 0, height: 4 },
//   },
//   starsContainer: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: 1000,
//   },
//   star: {
//     position: 'absolute',
//     width: 2,
//     height: 2,
//     backgroundColor: '#fff',
//     borderRadius: 1,
//     shadowColor: '#fff',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//   },
//   glow: {
//     position: 'absolute',
//     top: -50,
//     left: -50,
//     right: -50,
//     bottom: -50,
//     borderRadius: 100,
//     zIndex: 0,
//   },
//   shimmer: {
//     position: 'absolute',
//     top: -100,
//     bottom: -100,
//     width: 100,
//     transform: [{ rotate: '45deg' }],
//     zIndex: 2,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     zIndex: 3,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#aaa',
//     lineHeight: 20,
//   },
// });

// export default AnimatedCardsScreen;

// import React, { useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Animated,
//   ScrollView,
//   StyleSheet,
//   Dimensions,
//   Image,
// } from 'react-native';
// import IMG from '../../assets/Images';

// const { width } = Dimensions.get('window');

// // Star Component
// const Star = ({ delay, duration, startX, startY }) => {
//   const animatedValue = useRef(new Animated.Value(0)).current;
//   const opacity = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const animate = () => {
//       animatedValue.setValue(0);
//       opacity.setValue(0);

//       Animated.parallel([
//         Animated.timing(animatedValue, {
//           toValue: 1,
//           duration: duration,
//           delay: delay,
//           useNativeDriver: true,
//         }),
//         Animated.sequence([
//           Animated.timing(opacity, {
//             toValue: 1,
//             duration: duration * 0.3,
//             delay: delay,
//             useNativeDriver: true,
//           }),
//           Animated.timing(opacity, {
//             toValue: 0,
//             duration: duration * 0.3,
//             delay: duration * 0.4,
//             useNativeDriver: true,
//           }),
//         ]),
//       ]).start(() => animate());
//     };

//     animate();
//   }, []);

//   const translateX = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [startX, startX + (Math.random() - 0.5) * 100],
//   });

//   const translateY = animatedValue.interpolate({
//     inputRange: [0, 1],
//     outputRange: [startY, startY + Math.random() * 150],
//   });

//   return (
//     <Animated.View
//       style={[
//         styles.star,
//         {
//           opacity,
//           transform: [{ translateX }, { translateY }],
//         },
//       ]}
//     />
//   );
// };

// const MagicCard = ({ title, description, colors }) => {
//   const glowAnim = useRef(new Animated.Value(0)).current;
//   const shimmerAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Continuous glow animation
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     ).start();

//     // Shimmer effect
//     Animated.loop(
//       Animated.timing(shimmerAnim, {
//         toValue: 1,
//         duration: 3000,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const glowOpacity = glowAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [0.3, 0.6, 0.3],
//   });

//   const shimmerTranslate = shimmerAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [-200, 400],
//   });

//   // Generate random stars positions
//   const stars = Array.from({ length: 15 }, (_, i) => ({
//     id: i,
//     startX: Math.random() * (width - 40),
//     startY: Math.random() * 200,
//     delay: Math.random() * 2000,
//     duration: 2000 + Math.random() * 2000,
//   }));

//   return (
//     <View style={styles.cardContainer}>
//       <View style={styles.card}>
//         {/* Animated Stars */}
//         <View style={styles.starsContainer}>
//           {stars.map((star) => (
//             <Star
//               key={star.id}
//               delay={star.delay}
//               duration={star.duration}
//               startX={star.startX}
//               startY={star.startY}
//             />
//           ))}
//         </View>

//         {/* Continuous Glow Effect */}
//         {/* <Animated.View
//           style={[
//             styles.glow,
//             {
//               opacity: glowOpacity,
//               backgroundColor: colors?.glow || 'rgba(100, 200, 255, 0.2)',
//             },
//           ]}
//           pointerEvents="none"
//         /> */}

//         {/* Shimmer Effect */}
//         {/* <Animated.View
//           style={[
//             styles.shimmer,
//             {
//               transform: [{ translateX: shimmerTranslate }],
//               backgroundColor: colors?.shimmer || 'rgba(255, 255, 255, 0.1)',
//             },
//           ]}
//           pointerEvents="none"
//         /> */}

//         {/* Animated Border */}
//         <Animated.View
//           style={[
//             StyleSheet.absoluteFill,
//             {
//               borderRadius: 16,
//               borderWidth: 1.5,
//               borderColor: glowAnim.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [
//                   colors?.border1 || 'rgba(100, 200, 255, 0.3)',
//                   colors?.border2 || 'rgba(100, 200, 255, 0.7)',
//                 ],
//               }),
//             },
//           ]}
//           pointerEvents="none"
//         />

//         {/* Content */}
//         <View style={styles.content}>
//           <Text style={styles.title}>{title}</Text>
//           <Text style={styles.description}>{description}</Text>
//           {/* <Image source={IMG.OnBoardinDark}
//           style={{
//             height:180,
//             width:'100%',
//             zIndex:-1000
//           }}
//           /> */}
//         </View>
//       </View>
//     </View>
//   );
// };

// const Home = () => {
//   const cards = [
//     {
//       title: '🎨 Design',
//       description: 'Beautiful UI/UX that captivates users',
//       colors: {
//         glow: 'rgba(255, 100, 200, 0.2)',
//         shimmer: 'rgba(255, 100, 200, 0.15)',
//         border1: 'rgba(255, 100, 200, 0.3)',
//         border2: 'rgba(255, 100, 200, 0.8)',
//       },
//     },
//     {
//       title: '⚡ Performance',
//       description: 'Lightning fast 60fps animations',
//       colors: {
//         glow: 'rgba(100, 200, 255, 0.2)',
//         shimmer: 'rgba(100, 200, 255, 0.15)',
//         border1: 'rgba(100, 200, 255, 0.3)',
//         border2: 'rgba(100, 200, 255, 0.8)',
//       },
//     },
//     {
//       title: '🚀 Innovation',
//       description: 'Cutting-edge mobile features',
//       colors: {
//         glow: 'rgba(100, 255, 150, 0.2)',
//         shimmer: 'rgba(100, 255, 150, 0.15)',
//         border1: 'rgba(100, 255, 150, 0.3)',
//         border2: 'rgba(100, 255, 150, 0.8)',
//       },
//     },
//     {
//       title: '💎 Quality',
//       description: 'Premium crafted components',
//       colors: {
//         glow: 'rgba(255, 200, 100, 0.2)',
//         shimmer: 'rgba(255, 200, 100, 0.15)',
//         border1: 'rgba(255, 200, 100, 0.3)',
//         border2: 'rgba(255, 200, 100, 0.8)',
//       },
//     },
//     {
//       title: '🔥 Magic',
//       description: 'Delightful user interactions',
//       colors: {
//         glow: 'rgba(200, 100, 255, 0.2)',
//         shimmer: 'rgba(200, 100, 255, 0.15)',
//         border1: 'rgba(200, 100, 255, 0.3)',
//         border2: 'rgba(200, 100, 255, 0.8)',
//       },
//     },
//   ];

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Magic Cards ✨</Text>
//         <Text style={styles.subtitle}>Continuously animated with moving stars</Text>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {cards.map((card, index) => (
//           <MagicCard
//             key={index}
//             title={card.title}
//             description={card.description}
//             colors={card.colors}
//           />
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0a0a0a',
//   },
//   header: {
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     backgroundColor: '#0a0a0a',
//   },
//   headerTitle: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#888',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   cardContainer: {
//     marginVertical: 10,
//     marginHorizontal: 20,
//   },
//   card: {
//     height: 200,
//     width: width - 40,
//     backgroundColor: '#1a1a1a',
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   starsContainer: {
//     ...StyleSheet.absoluteFillObject,
//     zIndex: 1000,
//   },
//   star: {
//     position: 'absolute',
//     width: 2,
//     height: 2,
//     backgroundColor: '#fff',
//     borderRadius: 1,
//     shadowColor: '#fff',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.8,
//     shadowRadius: 2,
//   },
//   glow: {
//     position: 'absolute',
//     top: -50,
//     left: -50,
//     right: -50,
//     bottom: -50,
//     borderRadius: 100,
//     zIndex: 0,
//   },
//   shimmer: {
//     position: 'absolute',
//     top: -100,
//     bottom: -100,
//     width: 100,
//     transform: [{ rotate: '45deg' }],
//     zIndex: 2,
//   },
//   content: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     zIndex: 3,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#aaa',
//     lineHeight: 20,
//   },
// });

// export default Home;
