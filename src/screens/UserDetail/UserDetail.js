import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, StatusBar, ScrollView, Alert, TextInput, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { AddUserIcon, Menu, OtionsButtons, PrimaryBackArrow, PrimaryBackWhite, ThreeDotIcon } from '../../assets/SVGs';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import LinearGradient from 'react-native-linear-gradient';
import CustomDrawer from '../../components/DrawerModal';
import { useSelector } from 'react-redux';
import IMG from '../../assets/Images';
import { apiGet, apiPost, getItem } from '../../utils/Apis';
import urls from '../../config/urls';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import useLoader from '../../utils/LoaderHook';

import Feather from 'react-native-vector-icons/Feather';

import { ToastMsg } from '../../utils/helperFunctions';
import { white } from '../../common/Colors/colors';
import ProfileShimmer from '../../components/Skeletons/ProfilePageShimmer';

const OtherUserDetail = ({ navigation, route }) => {
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [isBioModalVisible, setBioModalVisible] = useState(false);
    const { isDarkMode } = useSelector(state => state.theme);
    const [UserDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [bioText, setBioText] = useState('');
    const { showLoader, hideLoader } = useLoader();

    const isFocused = useIsFocused()

    console.log('++++++++++++++++++UserId', route?.params?.userId);

    useFocusEffect(
        useCallback(() => {
            // Clear params when leaving the screen
            return () => {
                navigation.setParams({ userId: undefined });
                setUserDetails(null);
                setAllPosts([]);
            };
        }, [navigation])
    );

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }


    useEffect(() => {
        fetchData()
        fetchMyPost()
    }, [isFocused])

    const fetchData = async () => {
        setLoading(true)
        const endPoint = route?.params?.userId ? `${urls.getUserById}/${route?.params?.userId}` : urls.userProfile;
        const res = await apiGet(endPoint)
        setUserDetails(res?.data)
        setBioText(res?.data?.Bio || '');
        console.log(res?.data, 'UserDetails from api');
        setLoading(false)
    }

    const fetchMyPost = async () => {
        setLoading(true)
        const res = await apiGet(`${urls.getAllPostsOfAUser}/${route?.params?.userId || selector?._id}`);
        setAllPosts(res?.data)
        console.log(res?.data, 'AllMy Posts from api');
        setLoading(false)
    }

    const sendFollowRequest = async (id) => {
        console.log(id);
        const res = await apiPost(`${urls.sendFollowRequest}/${route?.params?.userId}`,);
        console.log(res, '+++++++++++++++++res from follow request');
    }

    // Image picker options
    const imagePickerOptions = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
    };

    // Update user profile function
    const updateUserProfile = async (imageType, imageUri, bio = null) => {
        try {
            showLoader();

            const formData = new FormData();

            if (imageUri) {
                formData.append(imageType, {
                    uri: imageUri,
                    type: 'image/jpeg',
                    name: `${imageType.toLowerCase()}.jpg`,
                });
            }

            if (bio !== null) {
                formData.append('bio', bio);
            }

            const token = await getItem('token');
            const response = await fetch('https://tomo-backend-app.vercel.app/api/user/UpdateUser', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const result = await response.json();
            console.log('Update result:', result);

            if (response.ok) {
                ToastMsg('Profile updated successfully!');
                fetchData(); // Refresh user data
            } else {
                ToastMsg('Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            ToastMsg('Failed to update profile');
        } finally {
            hideLoader();
        }
    };

    // Handle profile image update
    const handleProfileImageUpdate = () => {
        Alert.alert(
            'Update Profile Picture',
            'Choose an option',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Choose from Gallery',
                    onPress: () => {
                        launchImageLibrary(imagePickerOptions, (response) => {
                            if (response.didCancel || response.error) {
                                return;
                            }

                            if (response.assets && response.assets[0]) {
                                updateUserProfile('Image', response.assets[0].uri);
                            }
                        });
                    }
                },
            ]
        );
    };

    // Handle cover image update
    const handleCoverImageUpdate = () => {
        Alert.alert(
            'Update Cover Photo',
            'Choose an option',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Choose from Gallery',
                    onPress: () => {
                        launchImageLibrary(imagePickerOptions, (response) => {
                            if (response.didCancel || response.error) {
                                return;
                            }

                            if (response.assets && response.assets[0]) {
                                updateUserProfile('CoverImage', response.assets[0].uri);
                            }
                        });
                    }
                },
            ]
        );
    };

    // Handle bio update
    const handleBioUpdate = () => {
        setBioModalVisible(true);
    };

    const saveBio = () => {
        updateUserProfile(null, null, bioText);
        setBioModalVisible(false);
    };

 

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
            color: isDarkMode ? "white" : 'black',
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
        addCoverPhotoButton: {
            position: 'absolute',
            bottom: 15,
            right: 15,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
        },
        addCoverPhotoText: {
            color: 'white',
            fontSize: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        // Profile Card Section
        profileCard: {
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            marginTop: -50,
            marginHorizontal: 16,
            borderRadius: 12,
            padding: 20,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        profileHeader: {
            alignItems: 'center',
            marginBottom: 20,
        },
        profileImageContainer: {
            position: 'relative',
            marginBottom: 15,
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: isDarkMode ? '#252525' : '#ffffff',
        },
        editProfileImageButton: {
            position: 'absolute',
            bottom: 5,
            right: 5,
            backgroundColor: '#0073b1',
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        profileInfo: {
            alignItems: 'center',
        },
        profileName: {
            fontSize: 24,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : '#000',
            marginBottom: 5,
        },
        profileTitle: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#ccc' : '#666',
            textAlign: 'center',
            marginBottom: 8,
            position: 'relative',
        },
        editBioButton: {
            position: 'absolute',
            right: -25,
            top: 0,
            padding: 5,
        },
        editBioText: {
            color: '#0073b1',
            fontSize: 12,
        },
        profileLocation: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#999' : '#666',
            marginBottom: 15,
        },
        // Action Buttons
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
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
        // Stats Section
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 15,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : '#000',
        },
        statLabel: {
            fontSize: 12,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#999' : '#666',
            marginTop: 2,
        },
        // About Section
        aboutSection: {
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 12,
            padding: 20,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
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
        // Posts Section
        postsSection: {
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 20,
            borderRadius: 12,
            padding: 20,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            marginBottom: 100,
        },
        postsGrid: {
            paddingTop: 10,
        },
        postImage: {
            width: '31%',
            height: 100,
            margin: '1%',
            borderRadius: 8,
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
    });

    const renderHeader = () => (
        <SpaceBetweenRow style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Tab', { screen: 'Home' })}>
                {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
            </TouchableOpacity>
            <Text style={styles.headerText}>
                {UserDetails?.FullName}
            </Text>
            <TouchableOpacity onPress={() => setDrawerVisible(true)}>
                {
                    isDarkMode ?
                        // <Image source={IMG.menuIcon}
                        //     style={{
                        //         height: 30,
                        //         width: 30
                        //     }}
                        // />
                        <Feather name={'menu'} size={30} color={white}/>
                         :
                        <Menu fill={'white'} />
                }
            </TouchableOpacity>
        </SpaceBetweenRow>
    );

    const renderCoverPhoto = () => (
        <View style={styles.coverPhotoContainer}>
            <TouchableOpacity onPress={handleCoverImageUpdate}>
            <Image
                source={{ uri: UserDetails?.CoverImage ? UserDetails?.CoverImage : 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80' }}
                style={styles.coverPhoto}
            />

            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.addCoverPhotoButton} >
                <Text style={styles.addCoverPhotoText}>Edit cover photo</Text>
            </TouchableOpacity> */}
        </View>
    );

    const renderPost = ({ item }) => (
        <TouchableOpacity onPress={()=>navigation.navigate('AllPostOfAUser', {userId:item?.User?._id})}
        style={{
                width: '31%',
            height: 100,
            margin: '1%',
        }}
        >
            {console.log('++++++++++++++++++ITEM++++', item,)}
            <Image source={{ uri: item?.media }} style={{
                height:100,
                width:'100%',
            borderRadius: 8,

            }} />
        </TouchableOpacity>
    );
    if (loading) {
        return <ProfileShimmer />;
    }
    return (
        <View style={styles.container}>
            <StatusBar translucent={true} backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* HEADER SECTION */}
                {renderHeader()}

                {renderCoverPhoto()}

                <View style={styles.profileCard}>
                    <View style={styles.profileHeader}>
                        <View style={styles.profileImageContainer}>
                            <Image
                                source={{ uri: UserDetails?.Image ? UserDetails?.Image : 'https://picsum.photos/id/237/200/300' }}
                                style={styles.profileImage}
                            />
                            {!route?.params?.userId && (
                                <TouchableOpacity style={styles.editProfileImageButton} onPress={handleProfileImageUpdate}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>📷</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{UserDetails?.FullName}</Text>
                            <View style={styles.profileTitle}>
                                <Text style={styles.profileTitle}>
                                    {UserDetails?.Bio}
                                </Text>
                                    <TouchableOpacity style={styles.editBioButton} onPress={handleBioUpdate}>
                                        <Text style={styles.editBioText}>✏️</Text>
                                    </TouchableOpacity>
                            </View>
                            <Text style={styles.profileLocation}>📍 San Francisco, CA</Text>
                        </View>

                        {route?.params?.userId && <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.followButton}
                                onPress={() => sendFollowRequest(UserDetails?._id)}
                            >
                                <Text style={styles.followButtonText}>Follow</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.messageButton}
                                onPress={() => navigation.navigate('Chat')}
                            >
                                <Text style={styles.messageButtonText}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.moreButton}>
                                <Text style={{ color: isDarkMode ? '#ccc' : '#666' }}>•••</Text>
                            </TouchableOpacity>
                        </View>}
                    </View>

                    {/* STATS SECTION */}
                    <View style={styles.statsContainer}>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => navigation.navigate("Followers")}
                        >
                            <Text style={styles.statNumber}>{UserDetails?.Follower?.length || 0}</Text>
                            <Text style={styles.statLabel}>Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.statItem}
                            onPress={() => navigation.navigate('Followings')}
                        >
                            <Text style={styles.statNumber}>{UserDetails?.Following?.length || 0}</Text>
                            <Text style={styles.statLabel}>Following</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ABOUT SECTION */}
                <View style={styles.aboutSection}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.aboutText}>
                        {UserDetails?.Bio || "Passionate UX/UI Designer with 5+ years of experience creating user-centered digital experiences. I specialize in mobile app design, web interfaces, and design systems. Always eager to collaborate on innovative projects that make a difference."}
                    </Text>
                </View>

                {/* POSTS SECTION */}
                <View style={styles.postsSection}>
                    <Text style={styles.sectionTitle}>Recent Posts</Text>
                    <FlatList
                        data={allPosts}
                        numColumns={3}
                        renderItem={renderPost}
                        keyExtractor={(item) => item?._id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.postsGrid}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>

            {/* Bio Edit Modal */}
            <Modal
                visible={isBioModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setBioModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Bio</Text>
                        <TextInput
                            style={styles.bioInput}
                            value={bioText}
                            onChangeText={setBioText}
                            placeholder="Write your bio..."
                            placeholderTextColor={isDarkMode ? '#999' : '#666'}
                            multiline
                            maxLength={500}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setBioModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={saveBio}
                            >
                                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save</Text>
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
    );
};

export default OtherUserDetail;