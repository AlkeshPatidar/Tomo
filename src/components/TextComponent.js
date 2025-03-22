// CustomText.js
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {FONTS_FAMILY} from '../assets/Fonts';

const CustomText = ({style, children, ...props}) => {
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: FONTS_FAMILY.Nunito_Regular,
    fontSize: 16,
    color: '#000',
  },
});

export default CustomText;
