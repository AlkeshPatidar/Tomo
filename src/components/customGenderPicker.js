import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { FONTS_FAMILY } from '../assets/Fonts';
import color from '../common/colors';

const CustomGenderPicker = ({ visible, onClose, onSave, initialGender }) => {
    const [selectedGender, setSelectedGender] = useState(initialGender || '');

    useEffect(() => {
        if (initialGender) {
            setSelectedGender(initialGender);
        }
    }, [initialGender]);

    const handleSave = () => {
        onSave(selectedGender);
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.title}>Select Gender</Text>
                    <TouchableOpacity
                        style={[styles.option, selectedGender === 'male' && styles.selectedOption]}
                        onPress={() => setSelectedGender('male')}
                    >
                        <Text style={[styles.optionText, selectedGender === 'male' && styles.selectedOptionText]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.option, selectedGender === 'female' && styles.selectedOption]}
                        onPress={() => setSelectedGender('female')}
                    >
                        <Text style={[styles.optionText, selectedGender === 'female' && styles.selectedOptionText]}>Female</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.option, selectedGender === 'Other' && styles.selectedOption]}
                        onPress={() => setSelectedGender('Other')}
                    >
                        <Text style={[styles.optionText, selectedGender === 'Other' && styles.selectedOptionText]}>Other</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSave} style={styles.button}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomGenderPicker;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        width: Dimensions.get('window').width * 0.7,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily:FONTS_FAMILY.Nunito_Bold,
        color:color.Primary_color
    },
    option: {
        padding: 5,
        alignItems: 'center',
        width: '32%',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionText: {
        fontSize: 16,
    },
    selectedOption: {
        borderColor: '#007BFF',
        backgroundColor: '#E0F7FF',
    },
    selectedOptionText: {
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#d9534f',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
    },
});
