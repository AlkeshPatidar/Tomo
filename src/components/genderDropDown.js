import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Arrowup, BlueDownChevron } from "../assets/SVGs";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { FONTS_FAMILY } from "../assets/Fonts";
// import { ArrowDown, ArrowUp } from "../../assets/SVGs"; // Assume you have these icons

const genders = ["male", "female", "Other"];

const CustomGenderDropdown = ({ selectedGender, onSelectGender }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectGender = (gender) => {
        onSelectGender(gender);
        setIsOpen(false);
    };

    return (
        <View>
            <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() => setIsOpen(!isOpen)}
            >
                <Text style={styles.selectedText}>
                    {selectedGender || "Choose Gender"}
                </Text>
                {isOpen ? <BlueDownChevron height={verticalScale(20)} width={moderateScale(20)} />
                    : <BlueDownChevron height={verticalScale(20)} width={moderateScale(20)} />
                }
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdownList}>
                    {genders.map((gender, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.dropdownItem}
                            onPress={() => handleSelectGender(gender)}
                        >
                            <Text style={styles.dropdownText}>{gender}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "gray",
        paddingVertical: 10,
    },
    selectedText: {
        fontSize: moderateScale(16),
        fontFamily: FONTS_FAMILY.Nunito_Regular,
        color: "rgba(142, 142, 142, 1)",
    },
    dropdownList: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "gray",
        marginTop: 3,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    dropdownText: {
        fontSize: moderateScale(16),
        fontFamily: FONTS_FAMILY.Nunito_Regular,
    },
});

export default CustomGenderDropdown;
