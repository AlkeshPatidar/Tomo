import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Share
} from 'react-native';
import Modal from 'react-native-modal'; // Modal package for drawer effect
import { moderateScale, verticalScale, } from 'react-native-size-matters';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { BookmarkSimple, Down, DownArrowCircle, Flag, Headset, Notepad, PencilLine, SignOut, Star } from '../assets/SVGs';
import Row from './wrapper/row';
// import { EditIcon, BookmarkIcon, RateIcon, HelpIcon, ContactIcon, TermsIcon, LogoutIcon, LanguageIcon } from './assets/icons'; // Use your icons here

const DrawerModal = ({
    isModalVisible,
    toggleModal,
    navigation
}) => {
    //   const [isModalVisible, setModalVisible] = useState(false);

    //   const toggleModal = () => {
    //     setModalVisible(!isModalVisible);
    //   };

    const onInvite = async () => {
        try {
          const result = await Share.share({
            message: 'Check out this cool app! https://example.com', // Your message or URL here
          }, {
            // Ensure this targets WhatsApp by specifying the package
            dialogTitle: 'Share via',
            excludedActivityTypes: [], // You can exclude other apps if needed
          });
      
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // Shared with activity type of result.activityType
              console.log('Shared with activity type:', result.activityType);
            } else {
              // Shared without specifying activity type
              console.log('Shared successfully');
            }
          } else if (result.action === Share.dismissedAction) {
            // Dismissed
            console.log('Share dismissed');
          }
        } catch (error) {
          console.error('Error while sharing:', error.message);
        }
      };
      

    const handleNavigation = (key) => {
        if (key == 'Edit Profile') {
            navigation.navigate('EditProfile')
        }
        if (key == 'Contact Us') {
            navigation.navigate('ContactUsScreen')

        }
        if (key == 'Send Feedback') {
            navigation.navigate('SendFeedBack')
        }
        if (key == 'Privacy Policy') {
            navigation.navigate('Privacy')
        }
        if (key == 'Terms & Condition') {
            navigation.navigate('TermsAndConditons')
        }
        if (key == 'Rate Us') {
            navigation.navigate('RatingScreen')
        }
        if (key == 'Invite Freinds') {
        onInvite()
        }
        if (key == 'Public Post') {
            navigation.navigate('News',{type:'Public Post'})
        }
        if (key == 'User Search') {
            navigation.navigate('UserSearch')
        }

        if (key == 'Questions') {
            navigation.navigate('QuestionsScreen')
        }
        
        if (key == 'Top News') {
            navigation.navigate('TopNews')
        }
        // if (key == 'My Contacts') {
        //     navigation.navigate('MyContacts')
        // }
        if (key == 'Survey') {
            navigation.navigate('Survey')
        }
        if (key == 'Influencers') {
            navigation.navigate('Influencers')
        }
        // TermsAndConditons
    }

    return (
        <View style={styles.container}>


            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                style={styles.modal}
                animationIn="slideInLeft"
                animationOut="slideOutLeft"
                hasBackdrop={true}
                backdropOpacity={0.7}
            >
                <View style={styles.drawer}>
                    {/* Profile Section */}
                    <TouchableOpacity style={styles.profileSection}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Image
                            source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder profile image
                            style={styles.profileImage}
                        />
                        <View>
                            <Text style={styles.userName}>Rahul Sharma</Text>
                            <Text style={styles.userEmail}>rahulsharma@gmail.com</Text>

                        </View>
                    </TouchableOpacity>

                    {/* Language Selector */}
                    <View style={styles.menuItem}>
                        <Flag />
                        <Text style={styles.menuText}>Language</Text>
                        <Row>
                            <Text style={styles.languageText}>English</Text>
                            <Down />
                        </Row>
                    </View>

                    {/* Menu Items */}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {menuData.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.menuItem}
                                onPress={()=>{
                                    handleNavigation(item?.title)
                                }}
                            >
                                {item.icon}
                                <Text style={styles.menuText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const menuData = [
    { title: 'Edit Profile', icon: <PencilLine /> },
    // { title: 'Bookmark', icon: <BookmarkSimple /> },
    { title: 'Send Feedback', icon: <Star /> },
    { title: 'Rate Us', icon: <Star /> },
    { title: 'Privacy Policy', icon: <Star /> },
    { title: 'Contact Us', icon: <Headset /> },
    { title: 'Public Post', icon: <Headset /> },
    // { title: 'Setting', icon: <Headset /> },
    // { title: 'Contact Us', icon: <Headset /> },
   
    { title: 'User Search', icon: <Notepad /> },
    { title: 'Top News', icon: <Notepad /> },
    // { title: 'My Contacts', icon: <Notepad /> },
    { title: 'Survey', icon: <Notepad /> },
    { title: 'Influencers', icon: <Notepad /> },

   
    { title: 'Questions', icon: <Notepad /> },
    { title: 'Terms & Condition', icon: <Notepad /> },
    { title: 'Invite Freinds', icon: <Notepad /> },
    // { title: 'Rate Us', icon: <SignOut /> },
    { title: 'Log-out', icon: <SignOut /> },

];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-start',
    },
    drawer: {
        width: '80%',
        height: '100%',
        backgroundColor: '#fff',
        padding: moderateScale(20),
        // borderTopRightRadius: moderateScale(10),
        // borderBottomRightRadius: moderateScale(10),
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(20),
        gap: 10
    },
    profileImage: {
        width: moderateScale(50),
        height: moderateScale(50),
        borderRadius: moderateScale(35),
        marginBottom: verticalScale(10),
    },
    userName: {
        fontSize: moderateScale(18),
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: moderateScale(14),
        color: '#8A8A8A',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: '#E6E6E6',
    },
    menuText: {
        fontSize: moderateScale(14),
        color: '#333',
        flex: 1,
        marginLeft: moderateScale(10),
        fontFamily: FONTS_FAMILY.Comfortaa_Regular
    },
    languageText: {
        fontSize: moderateScale(14),
        color: '#333',
    },
});

export default DrawerModal;
