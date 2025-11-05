
import React, { useEffect, useRef, useState } from 'react'
import {
  FlatList,
  Image,
  ImageBackground,
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
import Row from '../../components/wrapper/row'
import LocationManager from '../../utils/LocationManager'
import {
  AddStoryIcon,
  BellIcon,
  CameraButton,
  NotiFication,
  SpeakerOff,
} from '../../assets/SVGs'
import { FONTS_FAMILY } from '../../assets/Fonts'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import { useDispatch, useSelector } from 'react-redux'
import Video from 'react-native-video'
import { apiDelete, apiGet, apiPost, apiPut, getItem } from '../../utils/Apis'
import urls from '../../config/urls'
import { theme, white } from '../../common/Colors/colors'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import useLoader from '../../utils/LoaderHook'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import CommentModal from './CommentModel'
import moment from 'moment'
import FeedShimmerLoader from '../../components/Skeletons/FeedsShimmer'
import messaging from '@react-native-firebase/messaging'
import PostDetailModal from './PostDetailModel'
import { setUser } from '../../redux/reducer/user'
import GradientIcon from '../../components/GradientIcon'
import LinearGradient from 'react-native-linear-gradient'
import { formatInstagramDate } from '../../utils/DateFormat'



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

  const { showLoader, hideLoader } = useLoader()

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  const [selectedPost, setSelectedPost] = useState(null)
  const [postDetailVisible, setPostDetailVisible] = useState(false)
  const [locationStatus, setLocationStatus] = useState('idle')
  const [selectedTab, setSelectedTab] = useState('home')
  // NEW: State for advertisements and news
  const [advertisements, setAdvertisements] = useState([])
  const [mergedFeedData, setMergedFeedData] = useState([])
  const [currentAdImageIndex, setCurrentAdImageIndex] = useState({})
  const [newsData, setNewsData] = useState([])

  // NEW: Fetch advertisements
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
  // NEW: Fetch news data
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
  // NEW: Function to merge posts and ads
  const mergeFeedWithAds = (posts, ads) => {
    if (!ads || ads.length === 0) {
      return posts.map(post => ({ type: 'post', data: post }))
    }

    const merged = []
    const adInterval = 3 // Show ad after every 3 posts
    let adIndex = 0

    posts.forEach((post, index) => {
      merged.push({ type: 'post', data: post })
      // Insert ad after every adInterval posts
      if ((index + 1) % adInterval === 0 && adIndex < ads.length) {
        merged.push({ type: 'ad', data: ads[adIndex] })
        adIndex = (adIndex + 1) % ads.length // Cycle through ads
      }
    })

    return merged
  }
  // NEW: Handle ad image carousel
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

  // NEW: Handle ad click
  const handleAdClick = (ad) => {
    if (ad.url) {
      Linking.openURL(ad.url).catch(err =>
        console.error('Failed to open URL:', err)
      )
    }
  }

  const handlePostClick = item => {
    console.log('_______________+')
    setSelectedPost(item)
    setPostDetailVisible(true)
    fetchCommentDataOfaPost(item._id)
  }



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
      console.log('Initializing Firebase...')
      await requestNotificationPermission()
    } catch (error) {
      console.error('Firebase initialization error:', error)
      Alert.alert('Error', `Firebase setup failed: ${error.message}`)
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
        console.log('Permission granted')
        await getFCMToken()
      } else {
        console.log('Permission denied')
        Alert.alert('Permission Required', 'Please enable notifications')
      }
    } catch (error) {
      console.error('Permission error:', error)
      Alert.alert('Error', `Permission failed: ${error.message}`)
    }
  }

  const getFCMToken = async () => {
    try {
      console.log('Getting FCM token...')

      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages()
      }

      const fcmToken = await messaging().getToken()

      if (fcmToken) {
        console.log('FCM Token:', fcmToken)
      } else {
        throw new Error('No FCM token received')
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

  const heartScale = useRef(new Animated.Value(0)).current

  let lastTap = null


  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setVisibleVideoIndex(viewableItems[0].index)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const isFocused = useIsFocused()

  useEffect(() => {
    Animated.timing(storyOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()

    Animated.timing(feedTranslateY, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    fetchData()
    getCurrentStories()
    getFollwedStories()
    initializeLocation()
    fetchAdvertisements()
    fetchNewsData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const token = await getItem('token');
      setLoading(true);

      try {
        if (token) {
          const getUserDetails = await apiGet(urls.userProfile);
          dispatch(setUser(JSON.stringify(getUserDetails?.data)));
          setLoading(false);
        } else {
          navigation.replace('Onboarding');
          setLoading(false);
        }
      } catch (error) {
        console.log('Fetch data error:', error);
        navigation.replace('Onboarding');
        setLoading(false);
      }
    };

    LocationManager.setLocationUpdateCallback(fetchData);
    LocationManager.initializeLocationTracking();

    return () => {
      LocationManager.setLocationUpdateCallback(null);
      LocationManager.stopLocationTracking();
    };
  }, []);

  const initializeLocation = async () => {
    try {
      setLocationStatus('updating');
      await LocationManager.initializeLocationTracking();
      setLocationStatus('updated');

      setTimeout(() => setLocationStatus('idle'), 2000);
    } catch (error) {
      console.log('Location initialization failed:', error);
      setLocationStatus('error');
      setTimeout(() => setLocationStatus('idle'), 3000);
    }
  }

  const updateLocationOnFocus = async () => {
    try {
      await LocationManager.checkAndUpdateLocation();
    } catch (error) {
      console.log('Foreground location update failed:', error);
    }
  }

  useEffect(() => {
    return () => {
      LocationManager.stopLocationTracking();
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
      // Use news data for News tab
      dataToMerge = newsData
    } else {
      // Use filtered posts for Home and Top25 tabs
      const filteredPosts = allPosts.filter(item => {
        const hasImage = item?.media && !item?.media.toLowerCase().includes('.mp4');
        const isTop25 = selectedTab === 'Top25' ? item?.TotalLikes > 25 : true;
        return hasImage && isTop25;
      });
      dataToMerge = filteredPosts
    }

    const merged = mergeFeedWithAds(dataToMerge, advertisements);
    setMergedFeedData(merged);
  }, [allPosts, advertisements, selectedTab, newsData]);

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
    const res = await apiGet(urls.getAllPost)
    setAllPosts(res?.data)
    setLoading(false)
  }

  const getCurrentStories = async () => {
    console.log('Selector', selector?._id)
    try {
      const res = await apiGet(urls.getCurrentStories)
      setAllStories(res?.data)
    } catch (error) {
      console.error('Error fetching stories:', error)
    }
  }

  const getFollwedStories = async () => {
    console.log('Selector', selector?._id)
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
    console.log('+++++++++++++++++++++++++++++++++++', item?._id)

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
          backgroundColor: isDarkMode ? '#252525' : 'white',
        }}
      >
        <SpaceBetweenRow
          style={{
            paddingTop: 50,
            paddingHorizontal: 20,
            backgroundColor: isDarkMode ? '#252525' : 'white',
            paddingBottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('GalleryForAddPost')}>
            {/* <CameraButton /> */}
            <GradientIcon
              colors={['#4F52FE', '#FC14CB']}
              size={18}
              iconType='FontAwesome5'
              name={'sliders-h'}
            />
          </TouchableOpacity>
          <SpaceBetweenRow style={{
            paddingHorizontal: 50,
            backgroundColor: isDarkMode ? '#252525' : 'white',
            paddingVertical: 10,
            flex:1,
            height:40
          }}>
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 5 }}
              onPress={() => setSelectedTab('home')}
            >
              <CustomText
                style={{
                  fontSize: 15,
                  fontFamily: FONTS_FAMILY.SourceSans3_Medium,

                }}
              >Home</CustomText>
              {selectedTab == 'home' &&
               
                <LinearGradient
                  colors={['#FF00FF', '#4B6BFF']} // your gradient colors (pink → blue like your button)
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 2,
                    width: 50,
                    borderRadius: 5,
                    // top:5
                  }}
                />
              }


            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 5 }}
              onPress={() => setSelectedTab('Top25')}

            >
              <CustomText
                style={{
                  fontSize: 15,
                  fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                }}
              >Top25</CustomText>
              {selectedTab == 'Top25' &&
               
                <LinearGradient
                  colors={['#FF00FF', '#4B6BFF']} // your gradient colors (pink → blue like your button)
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 2,
                    width: 50,
                    borderRadius: 5,
                  }}
                />
              }
            </TouchableOpacity>
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 5 }}
              onPress={() => setSelectedTab('News')}

            >
              <CustomText
                style={{
                  fontSize: 15,
                  fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                }}
              >News</CustomText>
              {selectedTab == 'News' &&
                <LinearGradient
                  colors={['#FF00FF', '#4B6BFF']} // your gradient colors (pink → blue like your button)
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    height: 2,
                    width: 50,
                    borderRadius: 5,
                  }}
                />
              }
            </TouchableOpacity>
          </SpaceBetweenRow>

          <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
            {/* <NotiFication /> */}
            <BellIcon />
          </TouchableOpacity>
        </SpaceBetweenRow>

      </View>
    )
  }

  const renderStories = () => {
    return (
      <Row
        style={{
          borderBottomWidth: 0.4,
          // borderTopWidth: 1,
          borderColor: 'rgba(219, 219, 219, 1)',
          // flex:1
        }}>
        <Animated.View
          style={{
            paddingVertical: 10,
            backgroundColor: isDarkMode ? 'black' : 'white',
            opacity: storyOpacity,
            flex:1
          }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}>
            <View style={styles.storyContainer}>
              <TouchableOpacity
                style={[styles.storyBorder, styles.ownStoryBorder]}
                onPress={() =>
                  navigation.navigate('StoryScreen', {
                    storyImage: allStories,
                    User: selector,
                  })
                }>
                <Image
                  source={
                    allStories[0]?.media
                      ? { uri: allStories[0]?.media }
                      : IMG.AddStoryImage
                  }
                  style={styles.storyImage}
                />
              </TouchableOpacity>
              <Text style={styles.storyText} numberOfLines={1}>
                {'Your Story'}
              </Text>
              <TouchableOpacity
                style={{ position: 'absolute', bottom: 20, right: 10 }}
                onPress={() => navigation.navigate('GalleryPickerScreen')}>
                <AddStoryIcon />
              </TouchableOpacity>
            </View>

            {followedStories?.map((item, index) => {
              const key = item?._id || `story-${index}`
              if (item?.User?.Stories?.length > 0) {
                return (
                  <View key={key} style={styles.storyContainer}>
                    <TouchableOpacity
                      style={[
                        styles.storyBorder,
                        item.isOwn && styles.ownStoryBorder,
                      ]}
                      onPress={() =>
                        navigation.navigate('StoryScreen', {
                          storyImage: item.User?.Stories,
                          User: item?.User,
                        })
                      }
                      key={key}>
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
                )
              } else {
                return null
              }
            })}
          </ScrollView>
        </Animated.View>
      </Row>
    )
  }

  // NEW: Render advertisement item
  const renderAdvertisement = (ad, index) => {
    const currentImageIndex = currentAdImageIndex[ad._id] || 0
    const currentMedia = ad.media[currentImageIndex]
    const totalImages = ad.media.length

    return (
      <TouchableOpacity
        style={styles.feedContainer}
        key={`ad-${ad._id}-${index}`}
        onPress={() => handleAdClick(ad)}
        activeOpacity={0.9}
      >
        {/* Ad Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.adBadgeContainer}>
              <CustomText style={styles.adBadge}>Sponsored</CustomText>
            </View>
            <TouchableOpacity>
              <Row style={{ gap: 5 }}>
                <Text style={styles.username}>{ad.name}</Text>
              </Row>
              <Text style={styles.caption}>{ad.location}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ad Image/Video with Navigation */}
        <View style={{ position: 'relative' }}>
          {currentMedia.type === 'image' ? (
            <Image
              source={{ uri: currentMedia.url }}
              style={{ ...styles.postImage }}
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
                >
                  <AntDesign name="left" size={20} color="white" />
                </TouchableOpacity>
              )}

              {currentImageIndex < totalImages - 1 && (
                <TouchableOpacity
                  style={[styles.adNavButton, styles.adNavButtonRight]}
                  onPress={() => handleAdImageNext(ad._id, totalImages)}>
                  <AntDesign name="right" size={20} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        {/* Ad CTA */}
        <TouchableOpacity style={styles.adCtaContainer}>
          <CustomText style={styles.adCtaText}>
            Learn More →
          </CustomText>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  const renderFeeds = () => {
    return (
      <FlatList
        data={mergedFeedData}
        style={{ marginBottom: 90 }}
        keyExtractor={(item, index) =>
          item.type === 'post'
            ? `post-${item.data._id}-${index}`
            : `ad-${item.data._id}-${index}`
        }
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={loading}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => {
          // NEW: Check if item is an advertisement
          if (item.type === 'ad') {
            return renderAdvertisement(item.data, index)
          }

          // Existing post rendering logic
          const post = item.data

          // Check if this is a news item
          const isNewsItem = selectedTab === 'News'

          const mediaUrl = post.media
          const isVideo = isNewsItem
            ? post.mediatype === 'video'
            : typeof mediaUrl === 'string' &&
            (mediaUrl.includes('.mp4') ||
              mediaUrl.includes('.mov') ||
              mediaUrl.includes('video') ||
              mediaUrl.includes('.avi'))

          return (
            <TouchableOpacity
              style={styles.feedContainer}
              key={`post-${post._id}-${index}`}
              onPress={() => !isNewsItem && handlePostClick(post)}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <Image
                    source={
                      isNewsItem
                        ? IMG.MessageProfile
                        : post?.User?.Image
                          ? { uri: post?.User?.Image }
                          : IMG.MessageProfile
                    }
                    style={{ ...styles.profileImage, bottom: isNewsItem ? 0 : 0 }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (!isNewsItem) {
                        navigation.navigate('OtherUserDetail', {
                          userId: post?.User?._id,
                        })
                      }
                    }}>
                    <Row
                      style={{
                        gap: 5,
                      }}>
                      <Text style={styles.username}>
                        {isNewsItem ? post?.title : post?.User?.UserName}
                      </Text>
                      {!isNewsItem && (
                        <Text style={styles.time}>
                          {formatInstagramDate(post?.createdAt)}
                        </Text>
                      )}
                    </Row>

                    <Text style={styles.caption}>
                      <Text style={styles.caption}>
                        {isNewsItem
                          ? post?.description?.replace(/<[^>]*>/g, '')
                          : post?.caption}
                      </Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (isNewsItem) return;

                    const now = Date.now()
                    const DOUBLE_PRESS_DELAY = 200

                    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
                      triggerHeartAnimation(index)
                      onLikeUnlike(post)
                    } else {
                      lastTap = now
                      handlePostClick(post)
                    }
                  }}>
                  <View style={{ position: 'relative', borderRadius: 13 }}>
                    {isVideo ? (
                      <View style={styles.videoContainer}>
                        <Video
                          source={{ uri: mediaUrl }}
                          style={[
                            styles.postImage,
                            {
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

                    {!isNewsItem && (
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
                    )}

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
              {!isNewsItem && <View style={styles.actions}>
                <View style={styles.leftIcons}>
                  <Row
                    style={{
                      borderColor: isDarkMode ? 'gray' : 'gray',
                      borderRadius: 18,
                      paddingHorizontal: 5,
                      gap: 5,
                      alignItems: 'center'
                    }}>
                    <TouchableOpacity
                      style={{ right: 0 }}
                      onPress={() => onLikeUnlike(post)}>
                      {post?.likes?.includes(selector?._id) ? (
                        <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='Ionicons'
                          name={'triangle'}
                        />
                      ) : (
                        <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='Feather'
                          name={'triangle'}
                        />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.likes}>
                      {post?.TotalLikes}{' '}
                    </Text>

                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        gap: 5,
                        flexDirection: 'row',
                        borderColor: isDarkMode ? 'gray' : 'gray',
                        borderRadius: 18,
                        paddingHorizontal: 10,
                      }}
                      onPress={() => onDisLikes(post)}>
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
                        {post?.TotalUnLikes}
                      </Text>
                    </TouchableOpacity>
                  </Row>
                  <Row
                    style={{
                      borderColor: isDarkMode ? 'gray' : 'gray',
                      borderRadius: 18,
                      paddingHorizontal: 5,
                      gap: 5
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(true)
                        fetchCommentDataOfaPost(post?._id)
                        setPostId(post?._id)
                      }}>
                      {isDarkMode ? (
                        <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='FontAwesome'
                          name={'comment-o'}
                        />
                      ) : (
                        <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='FontAwesome'
                          name={'comment-o'}
                        />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.comments}>{post?.TotalComents}</Text>
                  </Row>
                </View>

                <Row style={{ gap: 20, marginRight: 6 }}>
                  <TouchableOpacity
                    style={{ right: 0 }}
                    onPress={() => SavePost(post)}>
                    {post?.SavedBy?.includes(selector?._id) ? (
                      <GradientIcon
                        colors={['#4F52FE', '#FC14CB']}
                        size={18}
                        iconType='FontAwesome'
                        name={'bookmark'}
                      />
                    ) : (
                      <GradientIcon
                        colors={['#4F52FE', '#FC14CB']}
                        size={18}
                        iconType='FontAwesome'
                        name={'bookmark-o'}
                      />
                    )}
                  </TouchableOpacity>
                </Row>
              </View>}
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
      overflow: 'hidden',
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
      width: '100%',
      height: 300,
      marginRight: 10,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
      marginHorizontal: 10,
      paddingBottom: 10,
    },
    leftIcons: {
      flexDirection: 'row',
      gap: 15,
    },
    likes: {
      paddingHorizontal: 3,
      color: isDarkMode ? 'white' : 'black',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      fontSize: 13,
    },
    caption: {
      paddingHorizontal: 2,
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? 'white' : 'black',
      width: 280,
    },
    comments: {
      paddingHorizontal: 3,
      color: isDarkMode ? 'white' : 'black',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      fontSize: 13,
    },
    time: {
      color: 'gray',
      fontSize: 12,
      marginTop: 0,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    // NEW: Advertisement specific styles
    adBadgeContainer: {
      backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 10,
    },
    adBadge: {
      fontSize: 12,
      fontWeight: '600',
      color: isDarkMode ? '#aaa' : '#666',
    },
    adDotsContainer: {
      position: 'absolute',
      bottom: 10,
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
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    adDotActive: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
      width: 8,
      height: 8,
      borderRadius: 4,
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
    },
    adNavButtonLeft: {
      left: 10,
    },
    adNavButtonRight: {
      right: 10,
    },
    adCtaContainer: {
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
      padding: 12,
      marginHorizontal: 10,
      marginTop: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    adCtaText: {
      color: '#0084ff',
      fontWeight: '600',
      fontSize: 14,
    },
  })

  const renderCommentModal = () => {
    return (
      <>
        <CommentModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onBackButtonPress={() => setModalVisible(false)}
          comments={comments}
          isDarkMode={isDarkMode}
          commentText={commentText}
          onChangeText={setCommentText}
          onSendPress={() => {
            console.log('Send:', commentText)
            sendComments(postId, commentText)
            setCommentText('')
          }}
          onDeleteComments={id => onDeleteComments(id)}
          onEditComment={(id, text) => editComments(id, text)}
        />
      </>
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
      {selectedTab == 'home' && renderStories()}
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
        onAddComment={(id, commentText) => { sendComments(postId, commentText); setCommentText('') }}
        formatInstagramDate={formatInstagramDate}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
       <TouchableOpacity
            onPress={() => navigation.navigate('GalleryForAddPost')}
            style={{
              position:'absolute',
              bottom:100,
              right:20
            }}
            >
            <CameraButton />
            {/* <GradientIcon
              colors={['#4F52FE', '#FC14CB']}
              size={18}
              iconType='FontAwesome5'
              name={'sliders-h'}
            /> */}
          </TouchableOpacity>
    </View>
  )
}

export default Home
