import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { setSpecificTheme } from '../redux/actions/themeActions';
import { white } from '../common/Colors/colors';

const ThemeToggle = () => {
  const { isDarkMode } = useSelector(state => state.theme);

  const handleThemeToggle = () => {
    setSpecificTheme(!isDarkMode);
  };

  return (
    <TouchableOpacity onPress={handleThemeToggle} style={styles.container}>
      <View style={styles.content}>
        <CustomText style={styles.text}>Dark Mode</CustomText>
        <View style={[styles.toggleContainer, isDarkMode && styles.toggleActive]}>
          <View style={[styles.toggleButton, isDarkMode && styles.toggleButtonActive]} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  text: {
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_Bold,
    fontSize: 18,
  },
  toggleContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E4E4E4',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: 'black',
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: white,
    position: 'absolute',
    left: 2,
    transition: '0.3s',
  },
  toggleButtonActive: {
    transform: [{ translateX: 22 }],
  },
});

export default ThemeToggle;