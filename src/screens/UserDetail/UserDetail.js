

import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import SpaceBetweenRow from '../../components/wrapper/spacebetween'
import {
  AddUserIcon,
  Menu,
  OtionsButtons,
  PrimaryBackArrow,
  PrimaryBackWhite,
  ThreeDotIcon,
} from '../../assets/SVGs'
import Row from '../../components/wrapper/row'
import { FONTS_FAMILY } from '../../assets/Fonts'
import CustomText from '../../components/TextComponent'
import LinearGradient from 'react-native-linear-gradient'
import CustomDrawer from '../../components/DrawerModal'
import { useSelector } from 'react-redux'
import IMG from '../../assets/Images'
import { apiGet, apiPost, getItem } from '../../utils/Apis'
import urls from '../../config/urls'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import useLoader from '../../utils/LoaderHook'

import Feather from 'react-native-vector-icons/Feather'

import { ToastMsg } from '../../utils/helperFunctions'
import { white } from '../../common/Colors/colors'
import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
import GradientIcon from '../../components/GradientIcon'
import GlowWrapper from '../../components/GlowWrapper/GlowWrapper'

const OtherUserDetail = ({ navigation, route }) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false)
  const [isBioModalVisible, setBioModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'saved'
  const { isDarkMode } = useSelector(state => state.theme)
  const [UserDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [savedPosts, setSavedPosts] = useState([]) // For saved posts
  const [bioText, setBioText] = useState('')
  const { showLoader, hideLoader } = useLoader()
  const [allProducts, setAllProducts] = useState([])

  const isFocused = useIsFocused()

  console.log('++++++++++++++++++UserId', route?.params?.userId)

  useFocusEffect(
    useCallback(() => {
      // Clear params when leaving the screen
      return () => {
        navigation.setParams({ userId: undefined })
        setUserDetails(null)
        setAllPosts([])
        setSavedPosts([])
      }
    }, [navigation]),
  )

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  useEffect(() => {
    fetchData()
    fetchMyPost()
    fetchSavedPosts()
    fetchAllProducts()
  }, [isFocused])

  const fetchData = async () => {
    setLoading(true)
    const endPoint = route?.params?.userId
      ? `${urls.getUserById}/${route?.params?.userId}`
      : urls.userProfile
    const res = await apiGet(endPoint)
    setUserDetails(res?.data)
    setBioText(res?.data?.Bio || '')
    console.log(res?.data, 'UserDetails from api')
    setLoading(false)
  }

  const fetchMyPost = async () => {
    setLoading(true)
    const res = await apiGet(
      `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
    )
    setAllPosts(res?.data)
    console.log(res?.data, 'AllMy Posts from api')
    setLoading(false)
  }

  const fetchSavedPosts = async () => {
    // For now, using same posts - you can change this API endpoint later

    const res = await apiGet(
      // `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
      `${urls.getAllSavedPosts}`
    )
    setSavedPosts(res?.data || [])
  }

  const fetchAllProducts = async () => {
    // For now, using same posts - you can change this API endpoint later

    const res = await apiGet(
      // `${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`,
      `/api/admin/AllProducts`
    )
    setAllProducts(res?.data || [])
    // console.log('res?.data::::::', res?.data);

  }

  const sendFollowRequest = async id => {
    console.log(id)
    const res = await apiPost(
      `${urls.sendFollowRequest}/${route?.params?.userId}`,
    )
    console.log(res, '+++++++++++++++++res from follow request')
  }

  // Image picker options
  const imagePickerOptions = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8,
  }

  // Update user profile function
  const updateUserProfile = async (imageType, imageUri, bio = null) => {
    try {
      showLoader()

      const formData = new FormData()

      if (imageUri) {
        formData.append(imageType, {
          uri: imageUri,
          type: 'image/jpeg',
          name: `${imageType.toLowerCase()}.jpg`,
        })
      }

      if (bio !== null) {
        formData.append('bio', bio)
      }

      const token = await getItem('token')
      const response = await fetch(
        'https://tomo-backend-app.vercel.app/api/user/UpdateUser',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      )

      const result = await response.json()
      console.log('Update result:', result)

      if (response.ok) {
        ToastMsg('Profile updated successfully!')
        fetchData() // Refresh user data
      } else {
        ToastMsg('Failed to update profile')
      }
    } catch (error) {
      console.error('Update error:', error)
      ToastMsg('Failed to update profile')
    } finally {
      hideLoader()
    }
  }

  // Handle profile image update
  const handleProfileImageUpdate = () => {
    Alert.alert('Update Profile Picture', 'Choose an option', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary(imagePickerOptions, response => {
            if (response.didCancel || response.error) {
              return
            }

            if (response.assets && response.assets[0]) {
              updateUserProfile('Image', response.assets[0].uri)
            }
          })
        },
      },
    ])
  }

  // Handle cover image update
  const handleCoverImageUpdate = () => {
    Alert.alert('Update Cover Photo', 'Choose an option', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Choose from Gallery',
        onPress: () => {
          launchImageLibrary(imagePickerOptions, response => {
            if (response.didCancel || response.error) {
              return
            }

            if (response.assets && response.assets[0]) {
              updateUserProfile('CoverImage', response.assets[0].uri)
            }
          })
        },
      },
    ])
  }

  // Handle bio update
  const handleBioUpdate = () => {
    setBioModalVisible(true)
  }

  const saveBio = () => {
    updateUserProfile(null, null, bioText)
    setBioModalVisible(false)
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      paddingBottom: 16,
    },
    headerText: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
    },
    // Cover Photo Section
    coverPhotoContainer: {
      height: 200,
      backgroundColor: isDarkMode ? '#333' : '#ddd',
      position: 'relative',
    },
    coverPhoto: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    editProfileButton: {
      //   position: 'absolute',
      bottom: 15,
      right: 15,
      // backgroundColor: '#FC14CB',
      backgroundColor:'#21B7FF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    editProfileButtonText: {
      color: 'white',
      fontSize: 12,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    // Profile Image Section
    profileImageContainer: {
      position: 'absolute',
      bottom: -50,
      left: 20,
      alignItems: 'center',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 4,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    editImageButton: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      backgroundColor: '#4F52FE',
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDarkMode ? '#1b1b1b' : '#ffffff',
    },
    // Profile Info Section
    profileInfoSection: {
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 20,
    },
    profileName: {
      fontSize: 24,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? 'white' : '#000',
      //   marginBottom: 5,
    },
    profileUsername: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
      marginBottom: 15,
    },
    // Stats Section
    statsContainer: {
      flexDirection: 'row',
      //   paddingHorizontal: 20,
      marginBottom: 9,
    },
    statItem: {
      marginRight: 30,
    },
    statNumber: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
    },
    statLabel: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    // Status Section
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //   paddingHorizontal: 20,
      marginBottom: 20,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00D4AA',
      marginRight: 8,
    },
    statusText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    joinedText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
      marginLeft: 15,
    },
    // Action Buttons (for other users)
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    followButton: {
      backgroundColor: '#0073b1',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    messageButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#0073b1',
      paddingVertical: 10,
      paddingHorizontal: 24,
      borderRadius: 25,
      minWidth: 100,
      alignItems: 'center',
    },
    moreButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDarkMode ? '#666' : '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    followButtonText: {
      color: 'white',
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    messageButtonText: {
      color: '#0073b1',
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    // Tab Section
    tabContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#e0e0e0',
      marginHorizontal: 10,
      marginBottom: 20,
    },
    tabButton: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      // marginRight: 30,
    },
    activeTabButton: {
      // borderBottomWidth: 2,
      borderBottomColor: isDarkMode ? 'white' : '#000',
    },
    tabText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#888' : '#666',
    },
    activeTabText: {
      color: isDarkMode ? 'white' : '#000',
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    // Posts Grid Section
    postsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 100,
    },
    postItem: {
      width: '47%',
      height: 120,
      margin: '1%',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
    postImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      // padding:1,
      borderRadius:8
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 50,
    },
    emptyStateText: {
      fontSize: 16,
      color: isDarkMode ? '#888' : '#666',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      textAlign: 'center',
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      margin: 20,
      borderRadius: 12,
      padding: 20,
      width: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginBottom: 15,
    },
    bioInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#444' : '#ddd',
      borderRadius: 8,
      padding: 12,
      color: isDarkMode ? 'white' : '#000',
      minHeight: 100,
      textAlignVertical: 'top',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 15,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#444' : '#ddd',
    },
    saveButton: {
      backgroundColor: '#0073b1',
    },
    modalButtonText: {
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      fontSize: 14,
    },
    cancelButtonText: {
      color: isDarkMode ? 'white' : '#000',
    },
    saveButtonText: {
      color: 'white',
    },
  })

  const renderHeader = () => (
    <SpaceBetweenRow style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
        {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <Text style={styles.headerText}>
        {UserDetails?.UserName || UserDetails?.FullName}
      </Text>
      <TouchableOpacity onPress={() => setDrawerVisible(true)}>
        {/* <Feather
          name={'settings'}
          size={24}
          color={isDarkMode ? white : '#000'}
        /> */}
        <GradientIcon
          // colors={['#4F52FE', '#FC14CB']}
          colors={['#21B7FF', '#0084F8']}
          size={18}
          iconType='Feather'
          name={'settings'}
        />
      </TouchableOpacity>
    </SpaceBetweenRow>
  )

  const renderCoverPhoto = () => (
    <View style={styles.coverPhotoContainer}>
      {/* <TouchableOpacity
        onPress={handleCoverImageUpdate}
        disabled={route?.params?.userId}
        > */}
      <Image
        source={{
          uri:
            UserDetails?.CoverImage ||
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        }}
        style={styles.coverPhoto}
      />
      {/* </TouchableOpacity> */}

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: UserDetails?.Image || 'https://picsum.photos/id/237/200/300',
          }}
          style={styles.profileImage}
        />
        {!route?.params?.userId && (
          <TouchableOpacity
            style={styles.editImageButton}
            // onPress={handleProfileImageUpdate}
            onPress={handleCoverImageUpdate}
            disabled={route?.params?.userId}

          >
            <Feather name='camera' size={14} color='white' />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={{ ...styles.editImageButton, right: 20, bottom: 10 }}
        onPress={handleProfileImageUpdate}>
        <Feather name='camera' size={14} color='white' />
      </TouchableOpacity>
      {/* Edit Profile Button (only for own profile) */}
    </View>
  )

  const renderProfileInfo = () => (
    <View style={styles.profileInfoSection}>
      <SpaceBetweenRow>
        <View>
          <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
          <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>
        </View>
        {!route?.params?.userId && (
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleBioUpdate}>
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
          </TouchableOpacity>
        )}
      </SpaceBetweenRow>
      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => navigation.navigate('Followers')}>
          <Text style={styles.statNumber}>
            {UserDetails?.Follower?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => navigation.navigate('Followings')}>
          <Text style={styles.statNumber}>
            {UserDetails?.Following?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Status and Join Date */}
      <View style={styles.statusContainer}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>just now</Text>
        <Text style={styles.joinedText}>📅 Joined Aug 5, 2025</Text>
      </View>

      {/* Action Buttons for other users */}
      {route?.params?.userId && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => sendFollowRequest(UserDetails?._id)}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => navigation.navigate('Chat')}>
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'all' && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab('all')}>
        <Text
          style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
          All posts
        </Text>
        {activeTab === 'all' && <LinearGradient
          // colors={['#FF00FF', '#4B6BFF']} 
          colors={['#21B7FF', '#0084F8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 2,
            width: 50,
            borderRadius: 5,
            top: 18
          }}
        />}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'saved' && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab('saved')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'saved' && styles.activeTabText,
          ]}>
          Saved
        </Text>
        {activeTab === 'saved' && <LinearGradient
          // colors={['#FF00FF', '#4B6BFF']} 
          colors={['#21B7FF', '#0084F8']}

          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 2,
            width: 50,
            borderRadius: 5,
            top: 18
          }}
        />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'Marketplace' && styles.activeTabButton,
        ]}
        onPress={() => setActiveTab('Marketplace')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'Marketplace' && styles.activeTabText,
          ]}>
          Marketplace Products
        </Text>
        {activeTab === 'Marketplace' && <LinearGradient
          // colors={['#FF00FF', '#4B6BFF']} 
          colors={['#21B7FF', '#0084F8']}

          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 2,
            width: 150,
            borderRadius: 5,
            top: 18
          }}
        />}
      </TouchableOpacity>



    </View>
  )

  const renderPost = ({ item }) => (
    <GlowWrapper 
    containerStyle={{
      width:'47%',
      margin:'1%',
         height: 120,
      margin: '1%',
    }}
    borderRadius={8}
    >
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(activeTab === 'all' ? 'AllPostOfAUser' : activeTab === 'saved' ? 'SavedPosts' : 'ProductDetail', { userId: item?.User?._id })
      }
      // style={styles.postItem}
      >

      <Image source={{ uri: activeTab === 'all' ? item?.media : activeTab === 'saved' ? item?.Post?.media : item?.Image }} style={styles.postImage} />
    </TouchableOpacity>

    </GlowWrapper>
  )

  const renderPostsGrid = () => {
    const currentPosts = activeTab === 'all' ? allPosts : activeTab == 'saved' ? savedPosts : allProducts;

    if (currentPosts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {activeTab === 'all' ? 'No posts yet' : activeTab == 'saved' ? 'No saved posts' : 'No products found'}
          </Text>
        </View>
      )
    }

    return (
      <FlatList
        // data={currentPosts}
        data={activeTab == 'all' ? currentPosts.filter(item =>
          item?.media && !item?.media.toLowerCase().includes('.mp4')
        ) :
          activeTab == 'saved' ?
            currentPosts.filter(item =>
              item?.Post?.media && !item?.Post?.media.toLowerCase().includes('.mp4')
            ) :
            currentPosts.filter(item =>
              item?.Image && !item?.Image.toLowerCase().includes('.mp4')
            )

        }
        numColumns={2}
        renderItem={renderPost}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    )
  }

  if (loading) {
    return <ProfileShimmer />
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER SECTION */}
        {renderHeader()}

        {/* COVER PHOTO & PROFILE IMAGE */}
        {renderCoverPhoto()}

        {/* PROFILE INFO */}
        {renderProfileInfo()}

        {/* TABS */}
        {renderTabs()}

        {/* POSTS GRID */}
        <View style={styles.postsContainer}>{renderPostsGrid()}</View>
      </ScrollView>

      {/* Bio Edit Modal */}
      <Modal
        visible={isBioModalVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setBioModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Bio</Text>
            <TextInput
              style={styles.bioInput}
              value={bioText}
              onChangeText={setBioText}
              placeholder='Write your bio...'
              placeholderTextColor={isDarkMode ? '#999' : '#666'}
              multiline
              maxLength={500}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBioModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveBio}>
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />
    </View>
  )
}

export default OtherUserDetail
