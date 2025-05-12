import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    ScrollView,
    Share,
} from 'react-native';
import Modal from 'react-native-modal';
import { Forward, } from '../assets/SVGs/index';
import Row from './wrapper/row';
import { FONTS_FAMILY } from '../assets/Fonts';
import CustomText from './TextComponent';
import SpaceBetweenRow from './wrapper/spacebetween';
import { clearAsyncStorage } from '../utils/Apis';
import { showError } from '../utils/helperFunctions';
import { navigationRef } from '../routes/StackNavigation/route';
import IMG from '../assets/Images';
import ThemeToggle from './ThemeToggle';
import { useSelector } from 'react-redux';



const CustomDrawer = ({ isVisible, onClose, navigation }) => {

    const handleLogout = async () => {
        // console.log("navigationRef", navigationRef);

        Alert.alert(
            'Logout', // Title
            'Do you really want to logout?', // Message
            [
                {
                    text: 'Cancel',
                    style: 'cancel', // Cancel button style
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            await clearAsyncStorage();
                            navigation?.navigate('Login');
                            // na.getParent()?.navigate('Login');
                        } catch (error) {
                            showError('Error while logging out');
                        }
                    },
                },
            ],
            { cancelable: true } // Dismiss by tapping outside
        );
    };

    const handleOperation = async (label) => {
        if (label == 'Log Out') {
            handleLogout()
            onClose()
        }
        if (label == 'Terms & Conditions') {
            navigation.navigate('TermsAndConditions')
            onClose()

        }

        if (label == 'Help Center') {
            navigation.navigate('ContactUs')
            onClose()

        }
        if (label == 'Privacy Policy') {

            navigation.navigate('PrivacyPolicy')
            onClose()


        }
        if (label == 'FAQ') {
            navigation.navigate('FAQs')
            onClose()
            
        }
        if (label == 'Followers') {
            navigation.navigate('Followers')
            onClose()
            
        }

        if (label == 'Request to become Seller') {
            navigation.navigate('RequestBecomSeller')
            onClose()
            
        }

        if (label == 'Saved') {
            navigation.navigate('SavedPosts')
            onClose()
            
        }

        

        if (label == 'All Shops') {
            navigation.navigate('Shops')
            onClose()
            
        }

        
        

        if (label == 'Invite a Freind') {
            const inviteLink = 'https://www.example.com/invite';
        
            try {
                const result = await Share.share({
                    message: `Hey! Check out this amazing app: ${inviteLink}`,
                    url: inviteLink,
                    title: 'Invite a Friend',
                });
        
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        console.log('Shared with activity type:', result.activityType);
                    } else {
                        console.log('Shared successfully');
                        onClose()
                    }
                } else if (result.action === Share.dismissedAction) {
                    console.log('Share dismissed');
                    onClose()

                }
            } catch (error) {
                console.error('Error sharing invite:', error.message);
            }
        }
        
    }
    const { isDarkMode } = useSelector(state => state.theme);

    const styles = StyleSheet.create({
        modal: {
            margin: 0,
            justifyContent: 'flex-end',
        },
        drawerContainer: {
            width: '80%',
            height: '100%',
            backgroundColor:isDarkMode?'#252525': 'rgba(248, 248, 248, 1)',
            // paddingVertical: 10,
            paddingHorizontal: 15,
            alignSelf: 'flex-end',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginBottom: 20,
            marginTop: 20
        },
        closeButton: {
            // padding: 10,
            position: 'absolute',
            right: -30
        },
        closeText: {
            fontSize: 24,
            color: '#000',
        },
        shopOwnerButton: {
            backgroundColor: 'white',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 6,
            borderWidth: 0.5,
            borderColor: 'rgba(226, 113, 39, 1)',
            flexDirection: 'row',
            gap: 5,
        },
        shopOwnerText: {
            color: 'rgba(226, 113, 39, 1)',
            fontFamily: FONTS_FAMILY.Inter_Regular,
            fontSize: 12,
        },
        profileSection: {
            alignItems: 'center',
            flexDirection: 'row',
            borderWidth: 1,
            padding: 10,
            justifyContent: 'space-between',
            borderRadius: 8,
            borderColor: 'rgba(221, 221, 221, 1)',
        },
        profileImage: {
            width: 50,
            height: 50,
            borderRadius: 40,
            // marginBottom: 10,
        },
        profileName: {
            fontSize: 17,
            fontFamily: FONTS_FAMILY.Inter_SemiBold,
            color: 'black',
        },
        accountType: {
            fontSize: 12,
            color: 'gray',
            fontFamily: FONTS_FAMILY.Inter_Regular,
        },
        options: {
            marginTop: 20,
        },
        optionItem: {
            paddingVertical: 6,
            flexDirection: 'row',
            justifyContent: 'space-between',
            // borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            // backgroundColor:'white'
        },
        optionText: {
            fontSize: 14,
            color: '#000',
            fontFamily: FONTS_FAMILY.Inter_SemiBold,
        },
        logoutButton: {
            marginTop: 30,
            alignSelf: 'center',
        },
        logoutText: {
            fontSize: 16,
            color: 'red',
            fontWeight: 'bold',
        },
        qrCode: {
            width: 140,
            height: 140,
            alignSelf: 'center',
            marginTop: 20,
        },
    });

    const OptionItem = ({ label, icon, tc }) => (
        <TouchableOpacity style={styles.optionItem}
            onPress={() => handleOperation(label)}
        >
            <SpaceBetweenRow style={{
                backgroundColor:isDarkMode?'black': 'white',
                 borderRadius: 10,
                width: '100%',
                padding: 8
            }}>
                <Row style={{ gap: 18, }}>
                    {icon}
                    <Text style={{ ...styles.optionText, color:isDarkMode?'white': 'black', fontFamily: FONTS_FAMILY.SourceSans3_Medium, fontSize: 14 }}>
                        {label}
                    </Text>
                </Row>
                {/* <Forward /> */}

            </SpaceBetweenRow>
        </TouchableOpacity>
    );

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            style={styles.modal}>
            <View style={styles.drawerContainer}>

                {/* Options */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <Image source={IMG.Applogo}
                    style={{
                        height:100, 
                        width:100,
                        alignSelf:'center',
                        marginVertical:20

                    }}
                    />
                      <ThemeToggle />

                    <View style={styles.options}>
                        <OptionItem label="Followers" nav={'Followers'} />
                        <OptionItem label="Request to become Seller" />
                        <OptionItem label="All Shops" />
                        <OptionItem label="Saved" />


                        <OptionItem label="Privacy Policy"  />
                        <OptionItem label="Terms & Conditions" />
                        <OptionItem label="Help Center"  />
                        <OptionItem label="Invite a Freind"  />
                        <OptionItem label="FAQ" />

                        <OptionItem label="Log Out" />

                        <View
                            style={{
                                height: 0.5,
                                backgroundColor: 'rgba(221, 221, 221, 1)',
                                width: '90%',
                                marginVertical: 10,
                            }}
                        />

                    </View>

                </ScrollView>

            </View>
        </Modal>
    );

};





export default CustomDrawer;
