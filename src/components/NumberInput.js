import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Row from './wrapper/row';
import color from '../common/colors';
import CustomText from './TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
import { Arrowleft } from '../assets/SVGs';

const MobileNumberInput = () => {
    const [countryCode, setCountryCode] = useState('+1');
    const [mobileNumber, setMobileNumber] = useState('');

    return (
        <View style={styles.container}>
           
            <Row style={{
                alignItems: 'center',
                gap: 20,
                justifyContent: 'center'
            }}>
                <CustomText style={styles.countryInput}>IN +91</CustomText>

                <TextInput
                    style={styles.mobileInput}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    value={mobileNumber}

                    onChangeText={setMobileNumber}
                />
            </Row>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        // marginHorizontal: 30
    },

    countryCodeContainer: {
        // flex: 1,
    },
    separator: {
        paddingHorizontal: 5,
        fontSize: 18,
        color: '#000',
    },
    mobileInput: {
        // flex: 4,
        // width: '100%',
        fontSize: 16,
        padding: 0,
        borderBottomWidth: 1.5,
        borderColor: color.Primary_color,
        width: '69%',
        paddingBottom: 8,
        color: color.font_gray
    },
    countryInput: {
        fontSize: 16,
        padding: 0,
        borderBottomWidth: 2,
        borderColor: color.font_gray,
        width: '20%',
        paddingBottom: 8,
        color: color.black,
        fontFamily: FONTS_FAMILY.Nunito_Bold,
        top: 3

    }
});



export default MobileNumberInput;
