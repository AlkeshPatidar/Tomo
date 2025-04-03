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
    BottomIndicator,
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

const Login = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const { showLoader, hideLoader } = useLoader()
    const dispatch = useDispatch()

    // Animation Refs
    const slideAnim = useRef(new Animated.Value(100)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    const [userInfo, setUserInfor] = useState({})

    useEffect(() => {
        // Slide-In and Fade-In Animation
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
    }, []);

    // Button Press Animation
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

    const onLogin = async () => {
        console.log('Isss::::::::::::::::::::::::::::::::::::', userInfo?.Email, userInfo?.Password);
        
        const emailError = inValidEmail(userInfo?.Email);
        if (emailError) {
            // return showWarning(emailError);
            return ToastMsg(emailError);
        }

        const passwordError = inValidPassword(userInfo?.Password);
        if (passwordError) {
            // return showWarning(emailError);
            return ToastMsg(passwordError);
        }
        try {
            showLoader();
            const data = { 
                Email: userInfo.Email, 
                Password: userInfo?.Password
            };
            console.log(data,'DATA');
                const response = await apiPost(urls.userLogin, data, {
                    headers: { 'Content-Type': 'application/json' }
                });
            console.log("response", response);

            if (response?.statusCode === 200) {
                ToastMsg(response?.message)

                // Store token
                setItem('token', response?.data?.token);
                const token = await getItem('token');

                if (token) {
                    const getUserDetails = await apiGet(urls.userProfile);
                    if (getUserDetails?.statusCode === 200) {
                        dispatch(setUser(JSON.stringify(getUserDetails?.data)));
                            navigation.navigate('Tab');
                    }
                    hideLoader();
                    setUserInfor({})
                }
            }
        } catch (error) {
            hideLoader();
            if (error?.message) {
                ToastMsg(error?.message);
                // response?.message
            } else {
                ToastMsg('Network Error');
            }
        }
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
                            // onPress={() => navigation.navigate('Singnup')}
                            onPress={() => onLogin()}

                            >
                            <LoginBtn />
                        </TouchableOpacity>
                    </Animated.View>

                    <CustomText style={styles.signupText}>
                        Don't you have an account?{' '}
                        <TouchableOpacity
                        onPress={() => navigation.navigate('Singnup')}
                        >
                        <CustomText style={styles.signupLink}>Sign up</CustomText>
                        </TouchableOpacity>
                    </CustomText>
                </View>

                <View style={styles.termsContainer}>
                    <CustomText style={styles.termsText}>
                        By creating an account, you agree to our{' '}
                        <CustomText style={styles.linkText}>Terms & Conditions</CustomText> and agree to{' '}
                        <CustomText style={styles.linkText}>Privacy Policy</CustomText>
                    </CustomText>
                </View>

                <BottomIndicator style={styles.bottomIndicator} />
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
        signupText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        },
        signupLink: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color: 'green',
        },
        termsContainer: {
            alignItems: 'center',
            position: 'absolute',
            bottom: 50,
            alignSelf: 'center',
        },
        termsText: {
            fontSize: 15,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            textAlign: 'center',
        },
        linkText: {
            fontSize: 15,
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
