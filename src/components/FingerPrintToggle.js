import React,{useState, useEffect} from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { setSpecificTheme } from '../redux/actions/themeActions';
import { white } from '../common/Colors/colors';
import { getItem, setItem } from '../utils/Apis';

const FingerPrintToggle = () => {
  const { isDarkMode } = useSelector(state => state.theme);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    const loadBiometricSetting = async () => {
      const storedValue = await getItem('user_biometric_enabled');
      setIsBiometricEnabled(storedValue === 'true');
    };
    loadBiometricSetting();
  }, []);

  const handleThemeToggle = async () => {
    const newValue = !isBiometricEnabled;
    setIsBiometricEnabled(newValue);
    await setItem('user_biometric_enabled', newValue.toString());
  };

  return (
    <TouchableOpacity onPress={handleThemeToggle} style={styles.container}>
      <View style={styles.content}>
        <CustomText style={styles.text}>Finger Print</CustomText>
        <View style={[styles.toggleContainer, isBiometricEnabled &&  styles.toggleActive]}>
          <View style={[styles.toggleButton, isBiometricEnabled && styles.toggleButtonActive]} />
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

export default FingerPrintToggle;