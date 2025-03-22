import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import color, { black } from '../common/colors';
import { moderateScale } from 'react-native-size-matters';

const OTPInput = ({ numInputs, onChangeText }) => {
    const [otp, setOTP] = useState(new Array(numInputs).fill(''));
    const inputRefs = useRef([]);

    const handleChangeText = (text, index) => {
        const newOTP = [...otp];
        newOTP[index] = text;
        setOTP(newOTP);

        // String
        onChangeText(newOTP);
        // Auto move to the next input field
        if (text && index < numInputs - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Auto move to the previous input field on backspace
        if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleInputPress = index => {
        const newOTP = [...otp];
        newOTP[index] = '';
        setOTP(newOTP);
        inputRefs.current[index].focus();
    };

    return (
        <View>

            <View style={styles.container}>
                {Array(numInputs)
                    .fill()
                    .map((_, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleInputPress(index)}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                maxLength={1}
                                onChangeText={text => handleChangeText(text, index)}
                                onKeyPress={e => handleKeyPress(e, index)}
                                ref={ref => (inputRefs.current[index] = ref)}
                                value={otp[index]}
                            />
                        </TouchableOpacity>
                    ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: moderateScale(20),
        marginVertical: 30,
        alignSelf: 'center',
    },

    input: {
        width: 45,
        height: 60,
        borderBottomWidth: 2.5,
        borderColor: 'rgba(142, 142, 142, 1)',
        textAlign: 'center',
        fontSize: 18,
        color:black
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    text: {
        fontFamily: FONTS_FAMILY.Poppins_Regular,
        fontSize: 16,
        color: color.font_gray,
    },
});

export default OTPInput;
