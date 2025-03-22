import React from "react";
import { TouchableOpacity, View } from "react-native";
import Row from "./wrapper/row";
import { Click } from "../assets/SVGs";
import CustomText from "./TextComponent";
import { moderateScale } from "react-native-size-matters";
import color, { font_gray } from "../common/colors";

const InterestTile = ({ title, icon, selected, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
        <View style={{
            borderWidth: 0.8,
            alignItems: 'center',
            justifyContent: 'center',
            padding: moderateScale(10),
            borderRadius: 15,
            paddingHorizontal:moderateScale(12),
            borderColor:color.font_gray,
            backgroundColor:selected? color.Primary_color:'white'
        }}>
            {/* <Click /> */}
            <CustomText style={{
                color:selected?'white':'black',

            }}>{title}</CustomText>
        </View>
        </TouchableOpacity>

    )
}

export default InterestTile;