


import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn, SubmitBtn, Upload } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { apiPost, BASE_URL, getItem } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';
import axios from "axios";

const RequestBecomSeller = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const slideAnim = useRef(new Animated.Value(300)).current;

    const [fileName, setFileName] = useState({});

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const [userInfo, setUserInfor] = useState({})


    const { showLoader, hideLoader } = useLoader()


    const onSubmit = async () => {
        console.log('--------', fileName);

        try {
            const token = await getItem('token');
            showLoader();

            if (!fileName || !fileName.uri) {
              ToastMsg('No file selected');
                hideLoader();
                return;
            }

            const formData = new FormData();
            formData.append("AadharCard", {
                uri: Platform.OS === "android" ? fileName.uri : fileName.uri.replace('file://', ''),
                type: fileName.type || "application/octet-stream",
                name: fileName.fileName || fileName.name || "upload.pdf",
            });

            const response = await fetch(
                `${BASE_URL}/api/user/CreateBecomeSellerReq`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: formData,
                }
            );
            const result = await response.json();
            ToastMsg(result?.message);
            navigation.goBack()
            hideLoader();

        } catch (error) {
            hideLoader();
            console.log('Upload Failed:', error?.response?.data || error.message);
        }
    };





    const handleFilePick = () => {
        const options = {
            mediaType: 'photo', // photo only
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('Image Picker Error:', response.errorMessage);
            } else {
                const asset = response.assets[0];
                setFileName({
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName,
                });
            }
        });
    };




    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 20 }}>
                <Row>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                    <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Request For Become Seller</CustomText>
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
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
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

                        <TouchableOpacity onPress={handleFilePick}>
                            <CustomInputField
                                placeholder={'Upload Aadhar Card* '}
                                icon={<Upload />}
                                editable={false}
                                value={fileName?.uri}
                            // onChangeText={(value) => handleInputChange('Confirm', value)}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginTop: 30 }}
                            // onPress={() => navigation.navigate('Tab')}
                            onPress={onSubmit}
                        >
                            <SubmitBtn width={380} height={65} />
                        </TouchableOpacity>

                        {/* <CustomText style={{
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
                        </CustomText> */}
                    </View>

                    {/* <View style={{ alignItems: 'center', marginTop: 20 }}>
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
                    </View> */}
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

export default RequestBecomSeller;
