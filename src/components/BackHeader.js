import React from 'react';
import CustomText from './TextComponent';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {BackArrow} from '../assets/SVGs';
import Row from './wrapper/row';
import {FONTS_FAMILY} from '../assets/Fonts';
import color from '../common/Colors/colors';
import {useNavigation} from '@react-navigation/native';

const BackHeader = ({text = ''}) => {
  const navigation = useNavigation();
  return (
    <Row style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <BackArrow />
      </TouchableOpacity>
      <CustomText style={styles.text}>{text}</CustomText>
    </Row>
  );
};

export default BackHeader;
const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginTop: 18,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  text: {
    fontSize: 22,
    fontFamily: FONTS_FAMILY.OpenSans_SemiBold,
    color: '#32343E',
  },
});
