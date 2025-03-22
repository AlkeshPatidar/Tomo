import React, { useState, useRef, useEffect, memo } from 'react';
import { View, TextInput, Text, StyleSheet, Animated ,TouchableOpacity} from 'react-native';
import color from '../common/colors';
import { verticalScale } from 'react-native-size-matters';
import { BlueDownChevron } from '../assets/SVGs';

const FloatingLabelInput = ({ placeholder, onChangeText, value, keyboardType, editable, rightIcon, onGenderPress }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    setInputValue(value);
    Animated.timing(animatedIsFocused, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    if(rightIcon){
      onGenderPress()
    }
    Animated.timing(animatedIsFocused, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!inputValue) {
      setIsFocused(false);
      Animated.timing(animatedIsFocused, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleChangeText = (text) => {
    setInputValue(text);
    onChangeText(text);
  };

  const labelStyle = {
    position: 'absolute',
    left: 20,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 9]
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(142, 142, 142, 1)', 'rgba(142, 142, 142, 1)'],
    }),
    backgroundColor: 'white',
    paddingHorizontal: 5,
    zIndex: 1000
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={labelStyle}>
        {placeholder}
      </Animated.Text>
      <TextInput
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        value={inputValue}
        keyboardType={keyboardType}
        editable={editable}
      />
      {rightIcon &&
        <TouchableOpacity style={{position:'absolute', right:0, bottom:15}}
        onPress={onGenderPress}
        >
          <BlueDownChevron height={30}width={50}/>
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginVertical: 0,
  },
  input: {
    height: verticalScale(50),
    borderWidth: 0.8,
    borderColor: color.font_gray,
    borderRadius: 14,
    fontSize: 16,
    paddingHorizontal: 10,
    color: color.black,
    alignItems: 'center',
  },
});

export default memo(FloatingLabelInput);
