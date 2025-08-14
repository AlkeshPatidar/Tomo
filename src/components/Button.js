import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import {FONTS_FAMILY} from '../assets/Fonts';
import {moderateScale, verticalScale} from 'react-native-size-matters';
import color from '../common/Colors/colors';
import LinearGradient from 'react-native-linear-gradient';
import {TouchableRipple} from 'react-native-paper';

const CustomButton = ({
  title,
  onPress,
  leftIcon,
  style,
  rightIcon,
  txtColor,
  gradient,
}) => {
  return (
    <TouchableRipple
      style={{...styles.button, ...style}}
      onPress={onPress}
      rippleColor="#BDBDBD">
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
          {leftIcon && leftIcon}

          <Text style={{...styles.buttonText, ...txtColor}}>{title}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 20,
          }}>
          {rightIcon && rightIcon}
        </View>
      </>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: moderateScale(12),
    backgroundColor: color.theme,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: 'white',
    fontFamily: FONTS_FAMILY.Poppins_Medium,
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomButton;
