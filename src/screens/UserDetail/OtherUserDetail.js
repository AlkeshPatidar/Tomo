// import React, { useCallback, useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, StatusBar, ScrollView } from 'react-native';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import { AddUserIcon, Menu, OtionsButtons, PrimaryBackArrow, PrimaryBackWhite, ThreeDotIcon } from '../../assets/SVGs';
// import Row from '../../components/wrapper/row';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import CustomText from '../../components/TextComponent';
// import LinearGradient from 'react-native-linear-gradient';
// import CustomDrawer from '../../components/DrawerModal';
// import { useSelector } from 'react-redux';
// import IMG from '../../assets/Images';
// import { apiGet, apiPost } from '../../utils/Apis';
// import urls from '../../config/urls';
// import { useFocusEffect, useIsFocused } from '@react-navigation/native';
// import useLoader from '../../utils/LoaderHook';
// import { ToastMsg } from '../../utils/helperFunctions';
// import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer';

// const OtherUserDetail = ({ navigation, route }) => {
//     const [isDrawerVisible, setDrawerVisible] = useState(false);
//     const { isDarkMode } = useSelector(state => state.theme);
//     const [UserDetails, setUserDetails] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [allPosts, setAllPosts] = useState([]);
//     const { showLoader, hideLoader } = useLoader();

//     const isFocused = useIsFocused()

//     // console.log('++++++++++++++++++UserId', route?.params?.userId);

//     // console.log('++++++++++++++++++UserId', route?.params?.userId);

//     // useFocusEffect(
//     //     useCallback(() => {
//     //         // Clear params when leaving the screen
//     //         return () => {
//     //             navigation.setParams({ userId: undefined });
//     //             setUserDetails(null);
//     //             setAllPosts([]);
//     //         };
//     //     }, [navigation])
//     // );

//     let selector = useSelector(state => state?.user?.userData);
//     if (Object.keys(selector).length != 0) {
//         selector = JSON.parse(selector);
//     }

//     useEffect(() => {
//         fetchData()
//         fetchMyPost()
//     }, [isFocused])

//     const fetchData = async () => {
//         setLoading(true)
//         const endPoint = `${urls.getUserById}/${route?.params?.userId}`;
//         const res = await apiGet(endPoint)
//         setUserDetails(res?.data)
//         console.log(res?.data, 'UserDetails from api');

//         setLoading(false)
//     }

//     const fetchMyPost = async () => {
//         setLoading(true)
//         const res = await apiGet(`${urls.getAllPostsOfAUser}/${route?.params?.userId}`);
//         setAllPosts(res?.data)
//         console.log(res?.data, 'AllMy Posts from api');

//         setLoading(false)
//     }

// const sendFollowRequest = async (id) => {
//     console.log(id);
//     showLoader();

//     try {
//         const res = await apiPost(`${urls.sendFollowRequest}/${route?.params?.userId}`);
//         console.log(res, '+++++++++++++++++res from follow request');

//         if (res?.status === 200) {
//             fetchData();
//             ToastMsg('Follow request sent successfully');
//         } else {
//             // Handle non-200 status codes
//             ToastMsg(res?.data?.message || 'Something went wrong');
//         }
//     } catch (error) {
//         console.log('Error in follow request:', error);

//         // Handle the 400 error case you're getting
//         if (error?.response?.status === 400) {
//             ToastMsg(error?.message || 'Follow request already sent');
//         } else if (error?.response) {
//             // Server responded with error status
//             console.log('+++++++++++++++++++++++++', error);

//             ToastMsg(error?.message || 'Follow request Already sent');
//         } else if (error?.request) {
//             // Network error
//             ToastMsg('Network error. Please check your connection.');
//         } else {
//             // Other errors
//             ToastMsg('Follow request Already sent');
//         }
//     } finally {
//         hideLoader();
//     }
// };

//     const highlights = [
//         { id: '1', title: 'UX Course', image: 'https://picsum.photos/id/237/200/300' },
//         { id: '2', title: 'UX Portfolio', image: 'https://picsum.photos/id/237/200/300' },
//         { id: '3', title: 'Desk setup', image: 'https://picsum.photos/id/237/200/300' },
//         { id: '4', title: 'UX Guide', image: 'https://picsum.photos/id/237/200/300' },
//     ];

//     const posts = [
//         { id: '1', image: 'https://picsum.photos/200/300/?blur=2' },
//         { id: '2', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '3', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '4', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '5', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '6', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '7', image: 'https://picsum.photos/200/300/?blur=2' },
//         { id: '8', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '9', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '10', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '11', image: 'https://picsum.photos/seed/picsum/200/300' },
//         { id: '12', image: 'https://picsum.photos/seed/picsum/200/300' },
//     ];

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
//         },
//         header: {
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//             paddingBottom: 16,
//         },
//         headerText: {
//             fontSize: 20,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? "white" : 'black',
//         },
//         // Cover Photo Section
//         coverPhotoContainer: {
//             height: 200,
//             backgroundColor: isDarkMode ? '#333' : '#ddd',
//             position: 'relative',
//         },
//         coverPhoto: {
//             width: '100%',
//             height: '100%',
//             resizeMode: 'cover',
//         },
//         addCoverPhotoButton: {
//             position: 'absolute',
//             bottom: 15,
//             right: 15,
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             paddingHorizontal: 12,
//             paddingVertical: 8,
//             borderRadius: 20,
//         },
//         addCoverPhotoText: {
//             color: 'white',
//             fontSize: 12,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//         },
//         // Profile Card Section
//         profileCard: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginTop: -50,
//             marginHorizontal: 16,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 3,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//         },
//         profileHeader: {
//             alignItems: 'center',
//             marginBottom: 20,
//         },
//         profileImageContainer: {
//             position: 'relative',
//             marginBottom: 15,
//         },
//         profileImage: {
//             width: 120,
//             height: 120,
//             borderRadius: 60,
//             borderWidth: 4,
//             borderColor: isDarkMode ? '#252525' : '#ffffff',
//         },
//         editProfileImageButton: {
//             position: 'absolute',
//             bottom: 5,
//             right: 5,
//             backgroundColor: '#0073b1',
//             width: 30,
//             height: 30,
//             borderRadius: 15,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         profileInfo: {
//             alignItems: 'center',
//         },
//         profileName: {
//             fontSize: 24,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'white' : '#000',
//             marginBottom: 5,
//         },
//         profileTitle: {
//             fontSize: 16,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#ccc' : '#666',
//             textAlign: 'center',
//             marginBottom: 8,
//         },
//         profileLocation: {
//             fontSize: 14,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#999' : '#666',
//             marginBottom: 15,
//         },
//         // Action Buttons
//         actionButtons: {
//             flexDirection: 'row',
//             justifyContent: 'center',
//             gap: 12,
//             marginBottom: 20,
//         },
//         followButton: {
//             backgroundColor: '#0073b1',
//             paddingVertical: 10,
//             paddingHorizontal: 24,
//             borderRadius: 25,
//             minWidth: 100,
//             alignItems: 'center',
//         },
//         messageButton: {
//             backgroundColor: 'transparent',
//             borderWidth: 1,
//             borderColor: '#0073b1',
//             paddingVertical: 10,
//             paddingHorizontal: 24,
//             borderRadius: 25,
//             minWidth: 100,
//             alignItems: 'center',
//         },
//         moreButton: {
//             backgroundColor: 'transparent',
//             borderWidth: 1,
//             borderColor: isDarkMode ? '#666' : '#ddd',
//             paddingVertical: 10,
//             paddingHorizontal: 16,
//             borderRadius: 25,
//             justifyContent: 'center',
//             alignItems: 'center',
//         },
//         followButtonText: {
//             color: 'white',
//             fontSize: 14,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },
//         messageButtonText: {
//             color: '#0073b1',
//             fontSize: 14,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },
//         // Stats Section
//         statsContainer: {
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             paddingVertical: 15,
//             borderTopWidth: 1,
//             borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
//         },
//         statItem: {
//             alignItems: 'center',
//         },
//         statNumber: {
//             fontSize: 18,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'white' : '#000',
//         },
//         statLabel: {
//             fontSize: 12,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#999' : '#666',
//             marginTop: 2,
//         },
//         // About Section
//         aboutSection: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginHorizontal: 16,
//             marginTop: 16,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//         },
//         sectionTitle: {
//             fontSize: 18,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             color: isDarkMode ? 'white' : '#000',
//             marginBottom: 12,
//         },
//         aboutText: {
//             fontSize: 14,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#ccc' : '#333',
//             lineHeight: 20,
//         },
//         // Featured Section (Highlights)
//         featuredSection: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginHorizontal: 16,
//             marginTop: 16,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//         },
//         highlightsList: {
//             paddingTop: 10,
//         },
//         highlightContainer: {
//             alignItems: 'center',
//             marginRight: 16,
//             width: 80,
//         },
//         highlightImage: {
//             width: 64,
//             height: 64,
//             borderRadius: 8,
//             marginBottom: 8,
//         },
//         highlightText: {
//             fontSize: 12,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: isDarkMode ? '#ccc' : '#333',
//             textAlign: 'center',
//         },
//         // Posts Section
//         postsSection: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginHorizontal: 16,
//             marginTop: 16,
//             marginBottom: 20,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//             marginBottom: 100,
//         },
//         postsGrid: {
//             paddingTop: 10,
//         },
//         postImage: {
//             width: '31%',
//             height: 100,
//             margin: '1%',
//             borderRadius: 8,
//         },
//     });

//     const renderHighlight = ({ item }) => (
//         <View style={styles.highlightContainer}>
//             <Image source={{ uri: item.image }} style={styles.highlightImage} />
//             <Text style={styles.highlightText}>{item.title}</Text>
//         </View>
//     );

//     const renderHeader = () => (
//         <SpaceBetweenRow style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
//                 {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//             </TouchableOpacity>
//             <Text style={styles.headerText}>
//                 {UserDetails?.FullName}
//             </Text>
//             <TouchableOpacity onPress={() => setDrawerVisible(true)}>
//                 {
//                     isDarkMode ?
//                         <Image source={IMG.menuIcon}
//                             style={{
//                                 height: 30,
//                                 width: 30
//                             }}
//                         /> :
//                         <Menu fill={'white'} />
//                 }
//             </TouchableOpacity>
//         </SpaceBetweenRow>
//     );

//     const renderCoverPhoto = () => (
//         <View style={styles.coverPhotoContainer}>
//             <Image
//                 source={{ uri: UserDetails?.CoverImage ? UserDetails?.CoverImage : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80' }}
//                 style={styles.coverPhoto}
//             />
//             <TouchableOpacity style={styles.addCoverPhotoButton}>
//                 <Text style={styles.addCoverPhotoText}>Edit cover photo</Text>
//             </TouchableOpacity>
//         </View>
//     );

//     const renderPost = ({ item }) => (
//         <>
//                <TouchableOpacity onPress={()=>navigation.navigate('AllPostOfAUser', {userId:item?.User?._id})}
//                    style={{
//                            width: '31%',
//                        height: 100,
//                        margin: '1%',
//                    }}
//                    >
//                        {/* {console.log('++++++++++++++++++ITEM Of Other++++', item,)} */}
//                        <Image source={{ uri: item?.media }} style={{
//                            height:100,
//                            width:'100%',
//                        borderRadius: 8,

//                        }} />
//                    </TouchableOpacity>
//         </>
//     );

//        if (loading) {
//         return <ProfileShimmer />;
//     }
//     return (
//         <View style={styles.container}>
//             <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {/* HEADER SECTION */}
//                 {renderHeader()}

//                 {/* COVER PHOTO SECTION */}
//                 {renderCoverPhoto()}

//                 {/* PROFILE CARD SECTION */}
//                 <View style={styles.profileCard}>
//                     <View style={styles.profileHeader}>
//                         <View style={styles.profileImageContainer}>
//                             <Image
//                                 source={{ uri: UserDetails?.Image ? UserDetails?.Image : 'https://picsum.photos/id/237/200/300' }}
//                                 style={styles.profileImage}
//                             />
//                             <TouchableOpacity style={styles.editProfileImageButton}>
//                                 <Text style={{ color: 'white', fontSize: 12 }}>+</Text>
//                             </TouchableOpacity>
//                         </View>

//                         <View style={styles.profileInfo}>
//                             <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
//                             <Text style={styles.profileTitle}>
//                                 {/* Yamaha Lover • Rider • Tech Enthusiast */}
//                                 {UserDetails?.Bio}
//                             </Text>
//                             <Text style={styles.profileLocation}>📍 San Francisco, CA</Text>
//                         </View>

//                         {route?.params?.userId && <View style={styles.actionButtons}>
//                             <TouchableOpacity style={{...styles.followButton,opacity: UserDetails?.Follower?.includes(selector?._id) ? 0.5 : 1}}
//                             disabled={UserDetails?.Follower?.includes(selector?._id)}
//                                 onPress={() => sendFollowRequest(route?.params?.userId)}
//                             >
//                                 <Text style={styles.followButtonText}>{UserDetails?.
//                                     Follower?.includes(selector?._id) ? 'Follow' : 'Follow'
//                                 }</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={styles.messageButton}
//                                 // onPress={() => navigation.navigate('Chat')}
//                             >
//                                 <Text style={styles.messageButtonText}>Message</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.moreButton}>
//                                 <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
//                             </TouchableOpacity>
//                         </View>}
//                     </View>

//                     {/* STATS SECTION */}
//                     <View style={styles.statsContainer}>
//                         <TouchableOpacity
//                             style={styles.statItem}
//                             onPress={() => navigation.navigate("Followers")}
//                         >
//                             <Text style={styles.statNumber}>{UserDetails?.Follower?.length || 0}</Text>
//                             <Text style={styles.statLabel}>Followers</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.statItem}
//                             onPress={() => navigation.navigate('Followings')}
//                         >
//                             <Text style={styles.statNumber}>{UserDetails?.Following?.length || 0}</Text>
//                             <Text style={styles.statLabel}>Following</Text>
//                         </TouchableOpacity>
//                         {/* <View style={styles.statItem}>
//                             <Text style={styles.statNumber}>500+</Text>
//                             <Text style={styles.statLabel}>Connections</Text>
//                         </View> */}
//                     </View>
//                 </View>

//                 {/* ABOUT SECTION */}
//                 <View style={styles.aboutSection}>
//                     <Text style={styles.sectionTitle}>About</Text>
//                     <Text style={styles.aboutText}>
//                         {UserDetails?.Bio || "Passionate UX/UI Designer with 5+ years of experience creating user-centered digital experiences. I specialize in mobile app design, web interfaces, and design systems. Always eager to collaborate on innovative projects that make a difference."}
//                     </Text>
//                 </View>

//                 {/* FEATURED SECTION */}
//                 {/* <View style={styles.featuredSection}>
//                     <Text style={styles.sectionTitle}>Featured</Text>
//                     <FlatList
//                         data={highlights}
//                         horizontal
//                         renderItem={renderHighlight}
//                         keyExtractor={(item) => item.id}
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.highlightsList}
//                     />
//                 </View> */}

//                 {/* POSTS SECTION */}
//                 <View style={styles.postsSection}>
//                     <Text style={styles.sectionTitle}>Recent Posts</Text>
//                     <FlatList
//                         data={allPosts}
//                         numColumns={3}
//                         renderItem={renderPost}
//                         keyExtractor={(item) => item?._id}
//                         showsVerticalScrollIndicator={false}
//                         contentContainerStyle={styles.postsGrid}
//                         scrollEnabled={false}
//                     />

//                 </View>
//             </ScrollView>

//             <CustomDrawer
//                 isVisible={isDrawerVisible}
//                 onClose={() => setDrawerVisible(false)}
//                 navigation={navigation}
//             />
//         </View>
//     );
// };

// export default OtherUserDetail;

import React, {useCallback, useEffect, useState} from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ScrollView,
} from 'react-native'
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
import {FONTS_FAMILY} from '../../assets/Fonts'
import CustomText from '../../components/TextComponent'
import LinearGradient from 'react-native-linear-gradient'
import CustomDrawer from '../../components/DrawerModal'
import {useSelector} from 'react-redux'
import IMG from '../../assets/Images'
import {apiGet, apiPost} from '../../utils/Apis'
import urls from '../../config/urls'
import {useFocusEffect, useIsFocused} from '@react-navigation/native'
import useLoader from '../../utils/LoaderHook'
import {ToastMsg} from '../../utils/helperFunctions'
import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer'
import Feather from 'react-native-vector-icons/Feather'
import {white} from '../../common/Colors/colors'

const OtherUserDetail = ({navigation, route}) => {
  const [isDrawerVisible, setDrawerVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('all') // 'all' or 'saved' (for consistency)
  const {isDarkMode} = useSelector(state => state.theme)
  const [UserDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const {showLoader, hideLoader} = useLoader()

  const isFocused = useIsFocused()

  let selector = useSelector(state => state?.user?.userData)
  if (Object.keys(selector).length != 0) {
    selector = JSON.parse(selector)
  }

  useEffect(() => {
    fetchData()
    fetchMyPost()
  }, [isFocused])

  const fetchData = async () => {
    setLoading(true)
    const endPoint = `${urls.getUserById}/${route?.params?.userId}`
    const res = await apiGet(endPoint)
    setUserDetails(res?.data)
    console.log(res?.data, 'UserDetails from api')
    setLoading(false)
  }

  const fetchMyPost = async () => {
    setLoading(true)
    const res = await apiGet(
      `${urls.getAllPostsOfAUser}/${route?.params?.userId}`,
    )
    setAllPosts(res?.data)
    console.log(res?.data, 'AllMy Posts from api')
    setLoading(false)
  }

  const sendFollowRequest = async id => {
    console.log(id)
    showLoader()

    try {
      const res = await apiPost(
        `${urls.sendFollowRequest}/${route?.params?.userId}`,
      )
      console.log(res, '+++++++++++++++++res from follow request')

      if (res?.status === 200) {
        fetchData()
        ToastMsg('Follow request sent successfully')
      } else {
        ToastMsg(res?.data?.message || 'Something went wrong')
      }
    } catch (error) {
      console.log('Error in follow request:', error)

      if (error?.response?.status === 400) {
        ToastMsg(error?.message || 'Follow request already sent')
      } else if (error?.response) {
        console.log('+++++++++++++++++++++++++', error)
        ToastMsg(error?.message || 'Follow request Already sent')
      } else if (error?.request) {
        ToastMsg('Network error. Please check your connection.')
      } else {
        ToastMsg('Follow request Already sent')
      }
    } finally {
      hideLoader()
    }
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
      shadowOffset: {width: 0, height: 2},
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
    // Profile Info Section
    profileInfoSection: {
      paddingHorizontal: 20,
      paddingTop: 60,
      //   paddingBottom: 20,
    },
    profileName: {
      fontSize: 24,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginBottom: 5,
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
      marginBottom: 20,
    },
    statItem: {
      marginRight: 10,
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
      marginBottom: 10,
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
    // Action Buttons
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 12,
      //   paddingHorizontal: 20,
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
      //   marginHorizontal: 20,
      marginBottom: 20,
    },
    tabButton: {
      paddingVertical: 15,
      paddingHorizontal: 20,
      marginRight: 30,
    },
    activeTabButton: {
      borderBottomWidth: 2,
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
      //   paddingBottom: 100,
    },
    postItem: {
      width: '47%',
      height: 120,
      margin: '1%',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center',
    },
    postImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
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
    // About Section (keeping for bio display)
    aboutSection: {
      backgroundColor: isDarkMode ? '#252525' : '#ffffff',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      padding: 20,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : '#000',
      marginBottom: 12,
    },
    aboutText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#ccc' : '#333',
      lineHeight: 20,
    },
  })

  const renderHeader = () => (
    <SpaceBetweenRow style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Tab', {screen: 'Home'})}>
        {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <Text style={styles.headerText}>
        {UserDetails?.UserName || UserDetails?.FullName}
      </Text>
      <TouchableOpacity onPress={() => setDrawerVisible(true)}>
        <Feather
          name={'settings'}
          size={24}
          color={isDarkMode ? white : '#000'}
        />
      </TouchableOpacity>
    </SpaceBetweenRow>
  )

  const renderCoverPhoto = () => (
    <View style={styles.coverPhotoContainer}>
      <Image
        source={{
          uri:
            UserDetails?.CoverImage ||
            'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        }}
        style={styles.coverPhoto}
      />

      {/* Profile Image */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{
            uri: UserDetails?.Image || 'https://picsum.photos/id/237/200/300',
          }}
          style={styles.profileImage}
        />
      </View>
    </View>
  )

  const renderProfileInfo = () => (
    <View style={styles.profileInfoSection}>
      <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
      <Text style={styles.profileUsername}>{UserDetails?.UserName}</Text>

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

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={{
            ...styles.followButton,
            opacity: UserDetails?.Follower?.includes(selector?._id) ? 0.5 : 1,
          }}
          disabled={UserDetails?.Follower?.includes(selector?._id)}
          onPress={() => sendFollowRequest(route?.params?.userId)}>
          <Text style={styles.followButtonText}>
            {UserDetails?.Follower?.includes(selector?._id)
              ? 'Following'
              : 'Follow'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.messageButton}
          // onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={{color: isDarkMode ? '#ccc' : '#666'}}>•••</Text>
        </TouchableOpacity>
      </View>
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
      </TouchableOpacity>
      {/* Keeping tab structure for consistency, but only showing all posts */}
    </View>
  )

  const renderPost = ({item}) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('AllPostOfAUser', {userId: item?.User?._id})
      }
      style={styles.postItem}>
      <Image source={{uri: item?.media}} style={styles.postImage} />
    </TouchableOpacity>
  )

  const renderPostsGrid = () => {
    if (allPosts.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No posts yet</Text>
        </View>
      )
    }

    return (
      <FlatList
        // data={allPosts}
        data={allPosts.filter(
          item => item?.media && !item?.media.toLowerCase().includes('.mp4'),
        )}
        numColumns={2}
        renderItem={renderPost}
        keyExtractor={item => item?._id}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{paddingBottom: 20}}
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

        {/* ABOUT SECTION (if bio exists) */}
        {UserDetails?.Bio && (
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{UserDetails?.Bio}</Text>
          </View>
        )}

        {/* POSTS GRID */}
        <View style={styles.postsContainer}>{renderPostsGrid()}</View>
      </ScrollView>

      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setDrawerVisible(false)}
        navigation={navigation}
      />
    </View>
  )
}

export default OtherUserDetail
