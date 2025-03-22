import React, { version } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import CustomText from './TextComponent';
import { App_Primary_color } from '../common/Colors/colors';
import { FONTS_FAMILY } from '../assets/Fonts';

const CustomInputField = ({ icon, value, onChangeText, Lefticon, editable, secureTextEntry, keyboardType, placeholder, label, ...props }) => {
  return (
    <>
      <CustomText style={{
        color: 'rgba(151, 150, 161, 1)',
        fontFamily: FONTS_FAMILY.Alatsi_Regular, fontSize: 16,
        alignSelf: 'flex-start'
      }}>{label}</CustomText>
      <View style={styles.container}>
        {Lefticon}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="rgba(137, 138, 131, 0.4)"
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          editable={editable}
          value={value}

          secureTextEntry={secureTextEntry}
          {...props}
        />
        {icon}
      </View>
    </>

  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: App_Primary_color,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(137, 138, 131, 0.05)',
    width: '100%',  // Ensure it takes full width
    height: verticalScale(52),
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    color: '#333',
    fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    //  fontSize: 16, 
  },

  icon: {
    marginRight: 10,
  },
});

export default CustomInputField;

