import React, { useEffect } from "react";
import { ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BottomIndicator, EmailIcon, EyeIcon, LockIcon, LoginBtn } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";


const Login = ({ navigation }) => {


    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 80 }}>
                <Row>
                    <TouchableOpacity>
                        <Back />
                    </TouchableOpacity>
                    <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Sign In</CustomText>

            </Row>
        )
    }

    const renderItems = () => {
        return (
            <ScrollView contentContainerStyle={{
                marginTop: 30,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                flex: 1,
                padding: 26,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>

                <CustomText style={{
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                    fontSize: 32
                }}>Welcome</CustomText>

                <CustomText
                    style={{
                        fontSize: 16,
                        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                        color: 'rgba(137, 138, 131, 1)'
                    }}
                >Create Account to keep exploring amazing destinations around the world!</CustomText>

                <View style={{ marginTop: 35, alignItems: 'center' }}>
                    <CustomInputField
                        placeholder={'Enter your Email address'}
                        Lefticon={<EmailIcon />}
                    />

                    <CustomInputField
                        placeholder={'Enter Password '}
                        Lefticon={<LockIcon />}
                        icon={<EyeIcon />}
                    />

                    <TouchableOpacity style={{ marginTop: 30 }}
                    onPress={()=>navigation.navigate('Singnup')}
                    >
                        <LoginBtn />
                    </TouchableOpacity>
                    <CustomText style={{
                        fontSize: 16,
                        fontFamily: FONTS_FAMILY.SourceSans3_Regular
                    }}>Don't you have an account? <CustomText style={{
                        fontSize: 16,
                        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                        color: 'green'
                    }}>Sign up</CustomText></CustomText>
                </View>

                <View style={{ alignItems: 'center', position: 'absolute', bottom: 50, alignSelf: 'center' }}>
                    <CustomText style={{
                        fontSize: 15,
                        fontFamily: FONTS_FAMILY.SourceSans3_Regular, textAlign: 'center'
                    }}>By creating an account, you agree to our
                        <CustomText style={{
                            fontSize: 15,
                            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                            textAlign: 'center',
                            color: 'green'
                        }}> Terms & Conditions</CustomText>  and agree to <CustomText style={{
                            fontSize: 15,
                            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                            textAlign: 'center',
                            color: 'green'
                        }}>Privacy Policy</CustomText> </CustomText>
                </View>
                <BottomIndicator style={{position:'absolute', bottom:10, alignSelf:'center'}} />

            </ScrollView>
        )
    }

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {renderHeader()}
            {renderItems()}

        </ImageBackground>
    )
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})