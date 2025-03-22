import React from "react";
import { TouchableOpacity, View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import color from "../common/colors";
import SpaceBetweenRow from "./wrapper/spacebetween";
import CustomText from "./TextComponent";
import { WhiteCheck } from "../assets/SVGs";

const GenderTile = ({ title, selected, onPress, icon}) => {
    return (
        <TouchableOpacity onPress={onPress}>

        <SpaceBetweenRow style={{
            height: verticalScale(58),
            backgroundColor: selected? color.Primary_color: 'white',
            borderRadius: moderateScale(15),
            paddingHorizontal:20,
            borderWidth:0.5,
            borderColor:color.font_gray
        }}>
            <CustomText style={{color:selected?color.white: color.black}}>
                {title}
            </CustomText>
            {/* <WhiteCheck fill={selected?'white':'black'}/> */}
            {icon}

        </SpaceBetweenRow>
        </TouchableOpacity>

    )
}

export default GenderTile;