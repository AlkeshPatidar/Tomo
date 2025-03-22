import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { moderateScale } from 'react-native-size-matters';
import { FONTS_FAMILY } from '../assets/Fonts';
import color from '../common/colors';

const CustomDatePicker = ({ visible, onClose, onSave, selectedDate }) => {
    const [date, setDate] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    useEffect(() => {
        if (selectedDate) {
            const [d, m, y] = selectedDate.split('-');
            setDate(d);
            setMonth(m);
            setYear(y);
        }
    }, [selectedDate]);

    const generateNumbersArray = (min, max) => {
        const array = [];
        for (let i = min; i <= max; i++) {
            array.push(i.toString());
        }
        return array;
    };

    const dates = generateNumbersArray(1, 31);
    const months = generateNumbersArray(1, 12);
    const currentYear = new Date().getFullYear();
    const years = generateNumbersArray(currentYear - 100, currentYear);

    const handleSave = () => {
        const dob = `${date}-${month}-${year}`;
        onSave(dob);
        onClose();
    };

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.pickerContainer}>
                    <Text style={styles.title}>Select Date of Birth</Text>
                    <View style={styles.pickerRow}>
                        <View style={styles.pickerItem}>
                            <View>
                                <Text style={styles.lab}>Date</Text>
                                <Picker
                                    selectedValue={date}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setDate(itemValue)}
                                >
                                    {dates.map((d) => (
                                        <Picker.Item key={d} label={d} value={d} />
                                    ))}
                                </Picker>
                            </View>
                            <Text style={styles.selectedValue}>{date}</Text>
                        </View>
                        <View style={styles.pickerItem}>
                            <View>
                                <Text style={styles.lab}>Month</Text>
                                <Picker
                                    selectedValue={month}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setMonth(itemValue)}
                                >
                                    {months.map((m) => (
                                        <Picker.Item key={m} label={m} value={m} />
                                    ))}
                                </Picker>
                            </View>
                            <Text style={styles.selectedValue}>{month}</Text>
                        </View>
                        <View style={styles.pickerItem}>
                            <View>
                                <Text style={styles.lab}>Year</Text>
                                <Picker
                                    selectedValue={year}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setYear(itemValue)}
                                >
                                    {years.map((y) => (
                                        <Picker.Item key={y} label={y} value={y} />
                                    ))}
                                </Picker>
                            </View>
                            <Text style={styles.selectedValue}>{year}</Text>
                        </View>
                    </View>
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

export default CustomDatePicker;

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
        fontFamily: FONTS_FAMILY.Nunito_Bold,
        color: color.Primary_color
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    pickerItem: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    picker: {
        height: 40,
        width: Dimensions.get('window').width * 0.2,
        right: 10,
        top: -12
    },
    selectedValue: {
        fontSize: 14,
        color: 'black',
        marginTop: -28,
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
    lab: {
        left: moderateScale(20),
        color: color.black,
        fontFamily: FONTS_FAMILY.Nunito_SemiBold
    }
});
