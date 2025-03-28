import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";

const SignUp = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const slideAnim = useRef(new Animated.Value(300)).current; // Start off-screen

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 80 }}>
                <Row>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                    <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Sign up</CustomText>
            </Row>
        )
    }

    const renderItems = () => {
        return (
            <Animated.View style={{
                transform: [{ translateX: slideAnim }],
                marginTop: 30,
                backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
                flexGrow: 1,
                padding: 20,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                    <CustomText style={{
                        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                        fontSize: 32
                    }}>Welcome</CustomText>

                    <CustomText style={{
                        fontSize: 16,
                        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                        color: 'rgba(137, 138, 131, 1)'
                    }}>
                        Create Account to keep exploring amazing destinations around the world!
                    </CustomText>

                    <View style={{ marginTop: 15, alignItems: 'center', }}>
                        <CustomInputField
                            placeholder={'Enter your full name'}
                        />
                        <CustomInputField
                            placeholder={'Enter your Email address'}
                            Lefticon={isDarkMode ? <EmailWhite /> : <EmailIcon />}
                        />
                        <CustomInputField
                            placeholder={'Enter Password '}
                            Lefticon={isDarkMode ? <LockWhite /> : <LockIcon />}
                            icon={isDarkMode ? <EyeIconWhite /> : <EyeIcon />}
                        />
                        <CustomInputField
                            placeholder={'Enter confirm Password '}
                            Lefticon={<LockIcon />}
                            icon={<EyeIcon />}
                        />
                        <TouchableOpacity style={{ marginTop: 30 }}
                            onPress={() => navigation.navigate('Tab')}
                        >
                            <SignUpbtn width={380} height={65} />
                        </TouchableOpacity>

                        <CustomText style={{
                            fontSize: 16,
                            fontFamily: FONTS_FAMILY.SourceSans3_Regular
                        }}>
                            Already have an account?{" "}
                            <CustomText style={{
                                fontSize: 16,
                                fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                                color: 'green'
                            }}>
                                Sign In
                            </CustomText>
                        </CustomText>
                    </View>

                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <CustomText style={{
                            fontSize: 15,
                            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                            textAlign: 'center'
                        }}>
                            By creating an account, you agree to our{" "}
                            <CustomText style={{
                                fontSize: 15,
                                fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                                color: 'green'
                            }}>
                                Terms & Conditions
                            </CustomText>{" "}and agree to{" "}
                            <CustomText style={{
                                fontSize: 15,
                                fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                                color: 'green'
                            }}>
                                Privacy Policy
                            </CustomText>
                        </CustomText>
                    </View>
                </ScrollView>

                <BottomIndicator style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }} />
            </Animated.View>
        )
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white'
        }
    });

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
            {renderHeader()}
            {renderItems()}
        </ImageBackground>
    )
}

export default SignUp;
