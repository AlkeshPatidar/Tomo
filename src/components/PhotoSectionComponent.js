import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { moderateScale } from "react-native-size-matters";
// import CustomText from "../../components/TextComponent";
import CustomText from "./TextComponent";
import { useSelector } from "react-redux";
import { CameraIcon } from "../assets/SVGs";
// import IMG from "../../assets/Images";
// import { AddPhotoIcon, RemovePhotoIcon } from "../../assets/SVGs";

const PhotoSelectionComponent = (
    { takePhotos, inputData }
) => {
    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    const [photos, setPhotos] = useState({
        img1: selector.image1,
        img2: selector.image2,
        img3: selector.image3,
        img4: selector.image4,
        img5: selector.image5,
    });

   
    const handleAddPhoto = (img) => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                if (img === 'image1') {
                    takePhotos(response.assets[0].uri, img);
                    setPhotos(prev => ({ ...prev, img1: response.assets[0].uri }));
                } else if (img === 'image2') {
                    takePhotos(response.assets[0].uri, img);
                    setPhotos(prev => ({ ...prev, img2: response.assets[0].uri }));
                } else if (img === 'image3') {
                    takePhotos(response.assets[0].uri, img);
                    setPhotos(prev => ({ ...prev, img3: response.assets[0].uri }));
                } else if (img === 'image4') {
                    takePhotos(response.assets[0].uri, img);
                    setPhotos(prev => ({ ...prev, img4: response.assets[0].uri }));
                } else if (img === 'image5') {
                    takePhotos(response.assets[0].uri, img);
                    setPhotos(prev => ({ ...prev, img5: response.assets[0].uri }));
                }
            }
        });
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.photoContainer}>
                {!photos?.img1 ?
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddPhoto('image1')}>
                        <CustomText>ADD</CustomText>
                    </TouchableOpacity>
                    :
                    <View style={styles.photoWrapper}>
                        <TouchableOpacity onPress={() => handleAddPhoto('image1')}>
                            <Image source={{ uri: photos?.img1 }} style={styles.photo} />
                            <CameraIcon style={styles.cameraIcon} />
                        </TouchableOpacity>
                    </View>
                }
                {!photos?.img2 ?
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddPhoto('image2')}>
                        <CustomText>ADD</CustomText>
                    </TouchableOpacity>
                    :
                    <View style={styles.photoWrapper}>
                        <TouchableOpacity onPress={() => handleAddPhoto('image2')}>
                            <Image source={{ uri: photos?.img2 }} style={styles.photo} />
                            <CameraIcon style={styles.cameraIcon} />
                        </TouchableOpacity>
                    </View>
                }
                {!photos?.img3 ?
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddPhoto('image3')}>
                        <CustomText>ADD</CustomText>
                    </TouchableOpacity>
                    :
                    <View style={styles.photoWrapper}>
                        <TouchableOpacity onPress={() => handleAddPhoto('image3')}>
                            <Image source={{ uri: photos?.img3 }} style={styles.photo} />
                            <CameraIcon style={styles.cameraIcon} />
                        </TouchableOpacity>
                    </View>
                }
                {!photos?.img4 ?
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddPhoto('image4')}>
                        <CustomText>ADD</CustomText>
                    </TouchableOpacity>
                    :
                    <View style={styles.photoWrapper}>
                        <TouchableOpacity onPress={() => handleAddPhoto('image4')}>
                            <Image source={{ uri: photos?.img4 }} style={styles.photo} />
                            <CameraIcon style={styles.cameraIcon} />
                        </TouchableOpacity>
                    </View>
                }
                {!photos?.img5 ?
                    <TouchableOpacity style={styles.addButton} onPress={() => handleAddPhoto('image5')}>
                        <CustomText>ADD</CustomText>
                    </TouchableOpacity>
                    :
                    <View style={styles.photoWrapper}>
                        <TouchableOpacity onPress={() => handleAddPhoto('image5')}>
                            <Image source={{ uri: photos?.img5 }} style={styles.photo} />
                            <CameraIcon style={styles.cameraIcon} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
            <CustomText style={styles.instructionText}>You can add up to 5 photos</CustomText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: moderateScale(10),
    },
    photoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: moderateScale(10),
    },
    photoWrapper: {
        position: 'relative',
        margin: moderateScale(5),
    },
    photo: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(10),
    },
    addButton: {
        width: moderateScale(80),
        height: moderateScale(80),
        borderRadius: moderateScale(10),
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        margin: moderateScale(5),
    },
    instructionText: {
        marginTop: moderateScale(10),
        color: '#555',
    },
    cameraIcon: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
});

export default PhotoSelectionComponent;
