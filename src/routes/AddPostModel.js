import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, ImageBackground } from 'react-native';
import { AddPostIcon, AddstoryIconTabs, TabCloseBtn } from '../assets/SVGs';
import IMG from '../assets/Images';
import Row from '../components/wrapper/row';
import SpaceBetweenRow from '../components/wrapper/spacebetween';
import CustomText from '../components/TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OptionModal = ({ visible, onClose }) => {
    const handleAddPost = () => {
        console.log('Add Post');
        // Open gallery logic for Add Post
        onClose();
    };

    const handleAddStory = () => {
        console.log('Add Story');
        // Open gallery logic for Add Story
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity style={styles.overlay} onPress={onClose} />

                {/* <Animated.View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.option} onPress={handleAddPost}>
                        <Text style={styles.optionText}>Add Post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={handleAddStory}>
                        <Text style={styles.optionText}>Add Story</Text>
                    </TouchableOpacity>
                </Animated.View> */}
                <ImageBackground source={IMG.AddPostModelImage}
                    // style={{ height: 30, width: 40, bottom:100 }}
                    style={styles.modalContainer}
                >
                    <View style={{ gap: 10, top: 15 }}>
                        <TouchableOpacity style={styles.option} onPress={handleAddPost}>
                            <Text style={styles.optionText}>Add Post</Text>
                            <AddPostIcon />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.option} onPress={handleAddStory}>
                            <Text style={styles.optionText}>Add Story</Text>
                            <AddstoryIconTabs />

                        </TouchableOpacity>

                    </View>

                </ImageBackground>

                {/* Close button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <TabCloseBtn />
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    overlay: {
        flex: 1,
        width: '100%',
    },
    modalContainer: {
        // backgroundColor: '#fff',
        // paddingVertical: 20,
        paddingHorizontal: 20,
        // borderRadius: 12,
        marginBottom: 20,
        width: 190,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        // elevation: 5,
        height: 184,

    },
    option: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        // paddingVertical: 12,
        // borderBottomWidth: 0.5,
        // borderBottomColor: '#ddd',
        gap: 20,
        paddingLeft: 20
    },
    optionText: {
        fontSize: 15,
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        color: '#000',
    },
    closeButton: {
        // backgroundColor: '#ff3b30',
        // padding: 15,
        // borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 50,
        // marginTop: 10,
    },
});

export default OptionModal;
