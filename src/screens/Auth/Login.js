// import React, { useEffect, useRef, useState } from "react";
// import {
//     Animated,
//     Easing,
//     ImageBackground,
//     ScrollView,
//     StatusBar,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import Row from "../../components/wrapper/row";
// import {
//     Back,
//     BackOuterWhite,
//     EmailIcon,
//     EmailWhite,
//     EyeIcon,
//     EyeIconWhite,
//     LockIcon,
//     LockWhite,
//     LoginBtn,
// } from "../../assets/SVGs";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import CustomInputField from "../../components/CustomInputField";
// import { useDispatch, useSelector } from "react-redux";
// import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { apiGet, apiPost, getItem, setItem } from "../../utils/Apis";
// import urls from "../../config/urls";
// import useLoader from "../../utils/LoaderHook";
// import { setUser } from "../../redux/reducer/user";
// import useKeyboardStatus from "../../utils/KeyBoardHook";

// const Login = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const { showLoader, hideLoader } = useLoader()
//     const dispatch = useDispatch()
//     const { isKeyboardOpen } = useKeyboardStatus();

//     // Animation Refs
//     const slideAnim = useRef(new Animated.Value(100)).current;
//     const fadeAnim = useRef(new Animated.Value(0)).current;
//     const buttonScale = useRef(new Animated.Value(1)).current;

//     const [userInfo, setUserInfor] = useState({})

//     useEffect(() => {
//         Animated.parallel([
//             Animated.timing(slideAnim, {
//                 toValue: 0,
//                 duration: 600,
//                 easing: Easing.out(Easing.ease),
//                 useNativeDriver: true,
//             }),
//             Animated.timing(fadeAnim, {
//                 toValue: 1,
//                 duration: 600,
//                 useNativeDriver: true,
//             }),
//         ]).start();
//     }, []);

//     const handleButtonPressIn = () => {
//         Animated.spring(buttonScale, {
//             toValue: 0.95,
//             useNativeDriver: true,
//             speed: 15,
//             bounciness: 10,
//         }).start();
//     };

//     const handleButtonPressOut = () => {
//         Animated.spring(buttonScale, {
//             toValue: 1,
//             useNativeDriver: true,
//             speed: 15,
//             bounciness: 10,
//         }).start();
//     };

//     const handleInputChange = (name, value) => {
//         setUserInfor({ ...userInfo, [name]: value });
//     };

//     const onLogin = async () => {
//         console.log('Isss::::::::::::::::::::::::::::::::::::', userInfo?.Email, userInfo?.Password);

//         const emailError = inValidEmail(userInfo?.Email);
//         if (emailError) {
//             // return showWarning(emailError);
//             return ToastMsg(emailError);
//         }
//         const passwordError = inValidPassword(userInfo?.Password);
//         if (passwordError) {
//             // return showWarning(emailError);
//             return ToastMsg(passwordError);
//         }
//         try {
//             showLoader();
//             const data = {
//                 Email: userInfo.Email,
//                 Password: userInfo?.Password
//             };
//             console.log(data, 'DATA');
//             const response = await apiPost(urls.userLogin, data, {
//                 headers: { 'Content-Type': 'application/json' }
//             });
//             console.log("response", response);

//             if (response?.statusCode === 200) {
//                 ToastMsg(response?.message)

//                 // Store token
//                 setItem('token', response?.data?.token);
//                 const token = await getItem('token');

//                 if (token) {
//                     const getUserDetails = await apiGet(urls.userProfile);
//                     if (getUserDetails?.statusCode === 200) {
//                         dispatch(setUser(JSON.stringify(getUserDetails?.data)));
//                         navigation.navigate('Tab');
//                     }
//                     hideLoader();
//                     setUserInfor({})
//                 }
//             }
//         } catch (error) {
//             hideLoader();
//             if (error?.message) {
//                 ToastMsg(error?.message);
//                 // response?.message
//             } else {
//                 ToastMsg('Network Error');
//             }
//         }
//     };

//     const renderHeader = () => {
//         return (
//             <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
//                 <Row>
//                     <TouchableOpacity>
//                         {isDarkMode ? <BackOuterWhite /> : <Back />}

//                     </TouchableOpacity>
//                     <CustomText style={styles.backText}>Back</CustomText>
//                 </Row>
//                 <CustomText style={styles.signInText}>Sign In</CustomText>
//             </Animated.View>
//         );
//     };

//     const renderItems = () => {
//         return (
//             <Animated.ScrollView
//                 contentContainerStyle={styles.scrollContainer}
//                 style={{
//                     transform: [{ translateY: slideAnim }],
//                     opacity: fadeAnim,
//                 }}>
//                 <CustomText style={styles.welcomeText}>Welcome</CustomText>

//                 <CustomText style={styles.descriptionText}>
//                     Create Account to keep exploring amazing destinations around the world!
//                 </CustomText>

//                 <View style={styles.inputContainer}>
//                     <CustomInputField
//                         placeholder="Enter your Email address"
//                         Lefticon={isDarkMode ? <EmailWhite /> : <EmailIcon />}
//                         value={userInfo?.Email}
//                         onChangeText={(value) => handleInputChange('Email', value)}
//                     />
//                     <CustomInputField
//                         placeholder="Enter Password"
//                         Lefticon={isDarkMode ? <LockWhite /> : <LockIcon />}
//                         icon={isDarkMode ? <EyeIconWhite /> : <EyeIcon />}
//                         value={userInfo?.Password}
//                         onChangeText={(value) => handleInputChange('Password', value)}
//                     />
//                     <Animated.View
//                         style={[
//                             styles.loginButton,
//                             { transform: [{ scale: buttonScale }] },
//                         ]}>
//                         <TouchableOpacity
//                             activeOpacity={0.7}
//                             onPressIn={handleButtonPressIn}
//                             onPressOut={handleButtonPressOut}
//                             // onPress={() => navigation.navigate('Singnup')}
//                             onPress={() => onLogin()}

//                         >
//                             <LoginBtn width={320} />
//                         </TouchableOpacity>
//                     </Animated.View>

//                     {!isKeyboardOpen && <CustomText style={styles.signupText}>
//                         Don't you have an account?{' '}
//                         <TouchableOpacity
//                             onPress={() => navigation.navigate('Singnup')}
//                         >
//                             <CustomText style={styles.signupLink}>Sign up</CustomText>
//                         </TouchableOpacity>
//                     </CustomText>}
//                 </View>

//                 {!isKeyboardOpen && <View style={styles.termsContainer}>
//                     <CustomText style={styles.termsText}>
//                         By creating an account, you agree to our{' '}
//                             <CustomText style={styles.linkText} onPress={()=>navigation.navigate('TermsAndConditions')}>Terms & Conditions  </CustomText>
//                         and agree to{'  '}
//                             <CustomText style={styles.linkText} onPress={()=>navigation.navigate('PrivacyPolicy')}>Privacy Policy</CustomText>
//                     </CustomText>
//                 </View>}

//                 {/* { !isKeyboardOpen &&<BottomIndicator style={styles.bottomIndicator} />} */}
//             </Animated.ScrollView>
//         );
//     };
//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : 'white'
//         },
//         headerContainer: {
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//         },
//         backText: {
//             fontSize: 16,
//             fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//         },
//         signInText: {
//             fontSize: 18,
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//         },
//         scrollContainer: {
//             marginTop: 30,
//             backgroundColor: '#fff',
//             flex: 1,
//             padding: 26,
//             borderTopLeftRadius: 30,
//             borderTopRightRadius: 30,
//             backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
//         },
//         welcomeText: {
//             fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//             fontSize: 32,
//         },
//         descriptionText: {
//             fontSize: 16,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             color: 'rgba(137, 138, 131, 1)',
//         },
//         inputContainer: {
//             marginTop: 35,
//             alignItems: 'center',
//         },
//         loginButton: {
//             marginTop: 30,
//         },
//         signupText: {
//             fontSize: 16,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             bottom: 10
//         },
//         signupLink: {
//             fontSize: 16,
//             fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//             color: 'green',
//             top: 5
//         },
//         termsContainer: {
//             alignItems: 'center',
//             position: 'absolute',
//             bottom: 50,
//             alignSelf: 'center',
//         },
//         termsText: {
//             fontSize: 13,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             textAlign: 'center',
//         },
//         linkText: {
//             fontSize: 13,
//             fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//             textAlign: 'center',
//             color: 'green',
//         },
//         bottomIndicator: {
//             position: 'absolute',
//             bottom: 10,
//             alignSelf: 'center',
//         },
//     });

//     return (
//         <ImageBackground source={IMG.bgShadow} style={styles.container}>
//             <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
//             {renderHeader()}
//             {renderItems()}
//         </ImageBackground>
//     );
// };



// export default Login;


import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import {
    Back,
    BackOuterWhite,
    EmailIcon,
    EmailWhite,
    EyeIcon,
    EyeIconWhite,
    LockIcon,
    LockWhite,
    LoginBtn,
} from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useDispatch, useSelector } from "react-redux";
import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
import { ToastMsg } from "../../utils/helperFunctions";
import { apiGet, apiPost, getItem, setItem } from "../../utils/Apis";
import urls from "../../config/urls";
import useLoader from "../../utils/LoaderHook";
import { setUser } from "../../redux/reducer/user";
import useKeyboardStatus from "../../utils/KeyBoardHook";
import ReactNativeBiometrics from 'react-native-biometrics';
import Entypo from 'react-native-vector-icons/Entypo';

const Login = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader()
    const dispatch = useDispatch()
    const { isKeyboardOpen } = useKeyboardStatus();

    // Animation Refs
    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const [userInfo, setUserInfor] = useState({})
    const [biometricAvailable, setBiometricAvailable] = useState(false)
    const [biometricEnabled, setBiometricEnabled] = useState(false)

    const rnBiometrics = new ReactNativeBiometrics()

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
        
        checkBiometricStatus();
    }, []);

    useEffect(() => {
        if (biometricAvailable && biometricEnabled) {
            handleBiometricLogin();
        }
    }, [biometricAvailable, biometricEnabled]);

    console.log('Biometric Available:', biometricAvailable);
    console.log('Biometric Enabled:', biometricEnabled);
    

    const checkBiometricStatus = async () => {
        try {
            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            const enabled = await getItem('user_biometric_enabled');
            console.log(enabled, 'Biometric Enabled Status::::::::::::');
            

            console.log('User Biometric Status:', { available, biometryType, enabled });

            setBiometricAvailable(available);
            setBiometricEnabled(enabled === 'true');
        } catch (error) {
            console.log('Biometric check error:', error);
        }
    };

    const setupBiometricLogin = async (email, password) => {
        try {
            const { success } = await rnBiometrics.simplePrompt({
                promptMessage: 'Do you want to enable fingerprint login for faster access?',
            });

            if (success) {
                await setItem('user_biometric_enabled', 'true');
                await setItem('user_saved_email', email);
                await setItem('user_saved_password', password);

                ToastMsg('Fingerprint login enabled successfully!');
                setBiometricEnabled(true);
            } else {
                ToastMsg('Fingerprint setup skipped');
            }
        } catch (error) {
            console.log('Error setting up biometric login:', error);
            ToastMsg('Fingerprint setup failed');
        }
    };

    const handleBiometricLogin = async () => {
        try {
            console.log('Starting user biometric authentication...');

            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Place your finger on the sensor to login',
                cancelButtonText: 'Cancel',
            });
            
            console.log('User Biometric result:', { success, error });
            
            if (success) {
                const savedEmail = await getItem('user_saved_email');
                const savedPassword = await getItem('user_saved_password');
                if (savedEmail && savedPassword) {
                    await performLogin(savedEmail, savedPassword, false);
                } else {
                    ToastMsg('No registered fingerprint found');
                }
            } else {
                ToastMsg('Fingerprint authentication cancelled');
            }
        } catch (error) {
            console.log('Biometric authentication error:', error);
            ToastMsg('Biometric authentication failed');
        }
    };

    const handleButtonPressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.95,
            useNativeDriver: true,
            speed: 15,
            bounciness: 10,
        }).start();
    };

    const handleButtonPressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 15,
            bounciness: 10,
        }).start();
    };

    const handleInputChange = (name, value) => {
        setUserInfor({ ...userInfo, [name]: value });
    };

    const performLogin = async (email, password, showBiometricSetup = true) => {
        try {
            showLoader();
            const data = {
                Email: email,
                Password: password
            };
            console.log(data, 'DATA');
            const response = await apiPost(urls.userLogin, data, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log("response", response);

            if (response?.statusCode === 200) {
                ToastMsg(response?.message);

                // Store token
                setItem('token', response?.data?.token);
                const token = await getItem('token');

                if (token) {
                    const getUserDetails = await apiGet(urls.userProfile);
                    if (getUserDetails?.statusCode === 200) {
                        dispatch(setUser(JSON.stringify(getUserDetails?.data)));
                        
                        // Setup biometric if available and not already enabled
                        if (showBiometricSetup && biometricAvailable && !biometricEnabled) {
                            setupBiometricLogin(email, password);
                        }
                        
                        navigation.navigate('Tab');
                    }
                    hideLoader();
                    setUserInfor({});
                }
            }
        } catch (error) {
            hideLoader();
            if (error?.message) {
                if (error?.message == 'Invalid credentials.' && biometricAvailable && biometricEnabled) {
                    ToastMsg('Biometric login is no longer valid due to recent changes. Please use your email and new password to log in.');
                } else {
                    ToastMsg(error?.message);
                }
            } else {
                ToastMsg('Network Error');
            }
        }
    };

    const onLogin = async () => {
        console.log('Isss::::::::::::::::::::::::::::::::::::', userInfo?.Email, userInfo?.Password);

        const emailError = inValidEmail(userInfo?.Email);
        if (emailError) {
            return ToastMsg(emailError);
        }
        const passwordError = inValidPassword(userInfo?.Password);
        if (passwordError) {
            return ToastMsg(passwordError);
        }

        await performLogin(userInfo?.Email, userInfo?.Password);
    };

    const renderHeader = () => {
        return (
            <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
                <Row>
                    <TouchableOpacity>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                    <CustomText style={styles.backText}>Back</CustomText>
                </Row>
                <CustomText style={styles.signInText}>Sign In</CustomText>
            </Animated.View>
        );
    };

    const renderItems = () => {
        return (
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContainer}
                style={{
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                }}>
                <CustomText style={styles.welcomeText}>Welcome</CustomText>

                <CustomText style={styles.descriptionText}>
                    Create Account to keep exploring amazing destinations around the world!
                </CustomText>

                <View style={styles.inputContainer}>
                    <CustomInputField
                        placeholder="Enter your Email address"
                        Lefticon={isDarkMode ? <EmailWhite /> : <EmailIcon />}
                        value={userInfo?.Email}
                        onChangeText={(value) => handleInputChange('Email', value)}
                    />
                    <CustomInputField
                        placeholder="Enter Password"
                        Lefticon={isDarkMode ? <LockWhite /> : <LockIcon />}
                        icon={isDarkMode ? <EyeIconWhite /> : <EyeIcon />}
                        value={userInfo?.Password}
                        onChangeText={(value) => handleInputChange('Password', value)}
                    />
                    <Animated.View
                        style={[
                            styles.loginButton,
                            { transform: [{ scale: buttonScale }] },
                        ]}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPressIn={handleButtonPressIn}
                            onPressOut={handleButtonPressOut}
                            onPress={() => onLogin()}
                        >
                            <LoginBtn width={320} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Fingerprint Login Button - Only show if biometric is enabled */}
                    {biometricAvailable && biometricEnabled && (
                        <TouchableOpacity
                            onPress={handleBiometricLogin}
                            style={styles.biometricButton}>
                            <Entypo name='fingerprint' size={24} color={isDarkMode ? '#fff' : '#438FCB'} />
                            <CustomText style={[styles.biometricText, { color: isDarkMode ? '#fff' : '#438FCB' }]}>
                                Login with Fingerprint
                            </CustomText>
                        </TouchableOpacity>
                    )}

                    {!isKeyboardOpen && <CustomText style={styles.signupText}>
                        Don't you have an account?{' '}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Singnup')}
                        >
                            <CustomText style={styles.signupLink}>Sign up</CustomText>
                        </TouchableOpacity>
                    </CustomText>}
                </View>

                {!isKeyboardOpen && <View style={styles.termsContainer}>
                    <CustomText style={styles.termsText}>
                        By creating an account, you agree to our{' '}
                        <CustomText style={styles.linkText} onPress={() => navigation.navigate('TermsAndConditions')}>Terms & Conditions  </CustomText>
                        and agree to{'  '}
                        <CustomText style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</CustomText>
                    </CustomText>
                </View>}
            </Animated.ScrollView>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white'
        },
        headerContainer: {
            paddingTop: 50,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        backText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        },
        signInText: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        },
        scrollContainer: {
            marginTop: 30,
            backgroundColor: '#fff',
            flex: 1,
            padding: 26,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
        },
        welcomeText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            fontSize: 32,
        },
        descriptionText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: 'rgba(137, 138, 131, 1)',
        },
        inputContainer: {
            marginTop: 35,
            alignItems: 'center',
        },
        loginButton: {
            marginTop: 30,
        },
        biometricButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width:'100%',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: isDarkMode ? '#fff' : '#438FCB',
            borderRadius: 12,
            marginTop: 15,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(67,143,203,0.1)',
        },
        biometricText: {
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            fontSize: 14,
            marginLeft: 8,
        },
        signupText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            // bottom: 10
            top:30
        },
        signupLink: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color: 'green',
            top: 5
        },
        termsContainer: {
            alignItems: 'center',
            position: 'absolute',
            bottom: 50,
            alignSelf: 'center',
        },
        termsText: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            textAlign: 'center',
        },
        linkText: {
            fontSize: 13,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            textAlign: 'center',
            color: 'green',
        },
        bottomIndicator: {
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
        },
    });

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
            {renderHeader()}
            {renderItems()}
        </ImageBackground>
    );
};

export default Login;