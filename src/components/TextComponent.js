// CustomText.js
import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {FONTS_FAMILY} from '../assets/Fonts';
import { useSelector } from 'react-redux';

const CustomText = ({style, children, ...props}) => {
  const { isDarkMode } = useSelector(state => state.theme);

  const styles = StyleSheet.create({
    defaultText: {
      fontFamily: FONTS_FAMILY.Nunito_Regular,
      fontSize: 16,
      color: isDarkMode?'white':'#000',
    },
  });
  return (
    <Text style={[styles.defaultText, style]} {...props}>
      {children}
    </Text>
  );
};


export default CustomText;
