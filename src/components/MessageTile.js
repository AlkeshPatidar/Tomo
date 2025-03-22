import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import IMG from "../assets/Images";
import CustomText from "./TextComponent";
import { FONTS_FAMILY } from "../assets/Fonts";
import Row from "./wrapper/row";
import color from "../common/colors";


const MessageTile = ({ Img, name, description, time, number, onPress}) => {
    return (
        <TouchableOpacity style={{ marginBottom: 20 }}
        onPress={onPress}
        >
            <Row style={{ alignItems: 'center', gap: 12 }}>
                <Image
                    style={{ height: moderateScale(60), width: moderateScale(60), borderRadius: 100 }}
                    source={IMG.MsgMatchHori} />
                <View>
                    <CustomText style={{
                        fontSize: moderateScale(18),
                        fontFamily: FONTS_FAMILY.Nunito_Bold
                    }}>{name}</CustomText>
                    <CustomText
                        style={{
                            fontSize: moderateScale(12),
                            fontFamily: FONTS_FAMILY.Nunito_Bold
                        }}
                    >What about that new jacket if I ..</CustomText>
                </View>
                <View style={{
                    gap: 5

                }}>

                    <View style={{
                        height: 10,
                        width: 10,
                        backgroundColor: color.Primary_color,
                        borderRadius: 100,
                    }} />
                    <CustomText style={{
                        fontSize: moderateScale(10),
                        color: 'rgba(158, 163, 174, 1)'
                    }}>09:18</CustomText>
                    <View style={{
                        height: 20,
                        width: 20,
                        backgroundColor: 'rgba(233, 64, 87, 1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 100
                    }}>
                        <CustomText style={{
                            color: 'white',
                            fontSize: 12,
                            fontFamily: FONTS_FAMILY.Nunito_Bold
                        }}>1</CustomText>
                    </View>
                </View>

            </Row>

        </TouchableOpacity >
    )
}

export default MessageTile;