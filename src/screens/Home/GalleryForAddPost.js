


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   FlatList,
//   Image,
//   PermissionsAndroid,
//   Platform,
//   Text,
//   Alert,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import { CameraRoll } from '@react-native-camera-roll/camera-roll';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { BASE_URL, getItem } from '../../utils/Apis';
// import useLoader from '../../utils/LoaderHook';
// import { ToastMsg } from '../../utils/helperFunctions';
// import { useSelector } from 'react-redux';
// import Row from '../../components/wrapper/row';
// import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import CustomText from '../../components/TextComponent';
// import { launchCamera } from 'react-native-image-picker';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import ImageZoom from 'react-native-image-pan-zoom';
// import ImagePicker from 'react-native-image-crop-picker';


// const screenWidth = Dimensions.get('window').width;
// const imageSize = screenWidth / 3 - 10;
// const { width, height } = Dimensions.get('window');

// const GalleryForAddPost = ({ navigation }) => {
//   const [photos, setPhotos] = useState([]);
//   const [errorMsg, setErrorMsg] = useState('');
//   const [selectedImage, setSelectedImage] = useState(null);
//   const { isDarkMode } = useSelector(state => state.theme);
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false);
//   const { showLoader, hideLoader } = useLoader();

//   useEffect(() => {
//     const requestPermissionAndLoad = async () => {
//       try {
//         if (Platform.OS === 'android') {
//           const permission = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//             {
//               title: 'Permission Required',
//               message: 'App needs access to your gallery',
//               buttonPositive: 'OK',
//             }
//           );
//           const legacy = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
//           );

//           if (
//             permission !== PermissionsAndroid.RESULTS.GRANTED &&
//             legacy !== PermissionsAndroid.RESULTS.GRANTED
//           ) {
//             setErrorMsg('Permission denied');
//             return;
//           }
//         }

//         const result = await CameraRoll.getPhotos({ first: 50 });
//         setPhotos(result.edges);
//         if (result.edges.length === 0) {
//           setErrorMsg('No photos found in gallery.');
//         }
//       } catch (error) {
//         setErrorMsg(error.message || 'Something went wrong');
//         Alert.alert('Error', error.message || 'Something went wrong');
//       }
//     };

//     requestPermissionAndLoad();
//   }, []);

//   const onSubmit = async (selectedImage) => {
//     try {
//       const token = await getItem('token');
//       showLoader();

//       if (!selectedImage) {
//         ToastMsg('No image selected');
//         hideLoader();
//         return;
//       }

//       const fileName = selectedImage.split('/').pop();
//       const formData = new FormData();
//       formData.append('type', 'image');
//       formData.append('file', {
//         uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
//         type: 'image/jpeg',
//         name: fileName || 'upload.jpg',
//       });
//       formData.append('caption', 'caption');


//       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
//       const text = await response.text();

//       try {
//         const result = JSON.parse(text);
//         ToastMsg(result?.message);
//         navigation.navigate('Tab');
//       } catch (err) {
//         console.error('Error parsing response:', err);
//         ToastMsg('Upload failed: Invalid server response');
//       } finally {
//         hideLoader();
//       }
//     } catch (error) {
//       console.log('Upload failed:', error.message || error);
//       ToastMsg('Something went wrong');
//       hideLoader();
//     }
//   };

//   const handleSelect = (uri) => {
//     setSelectedImage(prev => (prev === uri ? null : uri));
//     setIsPreviewVisible(true);
//   };

//   const handlePostStory = () => {
//     onSubmit(selectedImage);
//   };

//   const handleOpenCamera = () => {
//     const options = {
//       mediaType: 'photo',
//       cameraType: 'back',
//       maxWidth: 100,
//       maxHeight: 100,
//       quality: 0.4,
//     };

//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled camera');
//       } else if (response.errorCode) {
//         console.log('Camera error:', response.errorMessage);
//         ToastMsg('Camera error: ' + response.errorMessage);
//       } else {
//         const uri = response?.assets?.[0]?.uri;
//         if (uri) {
//           onSubmit(uri);
//         }
//       }
//     });
//   };

//   const handleCropImage = async () => {
//     try {
//       const cropped = await ImagePicker.openCropper({
//         path: selectedImage,
//         width: 300,
//         height: 400,
//         cropping: true,
//         cropperCircleOverlay: false,
//         freeStyleCropEnabled: true,
//       });
  
//       if (cropped?.path) {
//         setSelectedImage(cropped.path);
//       }
//     } catch (err) {
//       console.log('Crop cancelled or failed:', err?.message);
//       ToastMsg('Crop cancelled');
//     }
//   };
  

//   const renderItem = ({ item, index }) => {
//     if (index === 0) {
//       return (
//         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
//           <View style={styles.cameraTile}>
//             <FontAwesome name="camera" size={20} color="#fff" />
//           </View>
//         </TouchableOpacity>
//       );
//     }

//     const uri = item.node.image.uri;
//     const isSelected = selectedImage === uri;

//     return (
//       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
//         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
//           <Image source={{ uri }} style={styles.image} resizeMode="cover" />
//           {isSelected && (
//             <View style={styles.checkIconContainer}>
//               <Icon name="checkmark" size={16} color="#fff" />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderHeader = () => (
//     <Row style={styles.header}>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
//       </TouchableOpacity>
//       <CustomText style={styles.headerText}>Select Image</CustomText>
//     </Row>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
//       <StatusBar
//         translucent
//         backgroundColor="transparent"
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//       />
//       {renderHeader()}

//       {errorMsg ? (
//         <Text style={styles.errorText}>{errorMsg}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={photos}
//             keyExtractor={(item, index) => index.toString()}
//             numColumns={3}
//             renderItem={renderItem}
//             contentContainerStyle={{ paddingBottom: 100 }}
//           />

//           {selectedImage && (
//             <TouchableOpacity style={styles.postButton} onPress={handlePostStory}>
//               <Icon name="arrow-up-circle-outline" size={20} color="#fff" />
//               <Text style={styles.postButtonText}>Post</Text>
//             </TouchableOpacity>
//           )}
//         </>
//       )}

//       {isPreviewVisible && selectedImage && (
//         <View style={styles.previewContainer}>
//           <ImageZoom cropWidth={width} cropHeight={height} imageWidth={width} imageHeight={height}>
//             <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
//           </ImageZoom>

//           <TouchableOpacity onPress={() => { handlePostStory(); setIsPreviewVisible(false); }} style={styles.postBtn}>
//             <Text style={styles.postText}>Post</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={() => setIsPreviewVisible(false)} style={styles.closeBtn}>
//             <Icon name="close" size={30} color="#fff" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={handleCropImage}
//             style={{
//               position: 'absolute',
//               top: 40,
//               left: 20,
//               backgroundColor: '#1e90ff',
//               padding: 10,
//               borderRadius: 30,
//             }}
//           >
//             <Icon name="crop" size={24} color="#fff" />
//           </TouchableOpacity>

//         </View>
//       )}
//     </View>
//   );
// };

// export default GalleryForAddPost;

// const styles = StyleSheet.create({
//   header: {
//     paddingTop: 50,
//     paddingHorizontal: 20,
//     gap: 90,
//     paddingBottom: 20,
//   },
//   headerText: {
//     fontSize: 20,
//     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//   },
//   errorText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: 'red',
//   },
//   cameraTile: {
//     width: imageSize,
//     height: 170,
//     margin: 1,
//     backgroundColor: 'black',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   imageTile: {
//     width: imageSize,
//     height: 170,
//     margin: 1,
//     overflow: 'hidden',
//   },
//   selectedTile: {
//     borderWidth: 3,
//     borderColor: '#1e90ff',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   checkIconContainer: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: '#1e90ff',
//     borderRadius: 12,
//     padding: 2,
//   },
//   postButton: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     backgroundColor: '#1e90ff',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     elevation: 5,
//   },
//   postButtonText: {
//     color: '#fff',
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   previewContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//     padding: 20,
//   },
//   previewImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   postBtn: {
//     position: 'absolute',
//     bottom: 100,
//     backgroundColor: '#1e90ff',
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//   },
//   postText: {
//     color: '#fff',
//     fontSize: 14,
//     fontFamily:FONTS_FAMILY.OpenSans_Condensed_SemiBold
//   },
//   closeBtn: {
//     position: 'absolute',
//     top: 40,
//     right: 20,
//   },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL, getItem } from '../../utils/Apis';
import useLoader from '../../utils/LoaderHook';
import { ToastMsg } from '../../utils/helperFunctions';
import { useSelector } from 'react-redux';
import Row from '../../components/wrapper/row';
import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import { launchCamera } from 'react-native-image-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageZoom from 'react-native-image-pan-zoom';
import ImagePicker from 'react-native-image-crop-picker';

const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3 - 10;
const { width, height } = Dimensions.get('window');

const GalleryForAddPost = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState(''); // Added caption state
  const { isDarkMode } = useSelector(state => state.theme);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const requestPermissionAndLoad = async () => {
      try {
        if (Platform.OS === 'android') {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Permission Required',
              message: 'App needs access to your gallery',
              buttonPositive: 'OK',
            }
          );
          const legacy = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );

          if (
            permission !== PermissionsAndroid.RESULTS.GRANTED &&
            legacy !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            setErrorMsg('Permission denied');
            return;
          }
        }

        const result = await CameraRoll.getPhotos({ first: 50 });
        setPhotos(result.edges);
        if (result.edges.length === 0) {
          setErrorMsg('No photos found in gallery.');
        }
      } catch (error) {
        setErrorMsg(error.message || 'Something went wrong');
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    };

    requestPermissionAndLoad();
  }, []);

  const onSubmit = async (selectedImage) => {
    try {
      const token = await getItem('token');
      showLoader();

      if (!selectedImage) {
        ToastMsg('No image selected');
        hideLoader();
        return;
      }

      const fileName = selectedImage.split('/').pop();
      const formData = new FormData();
      formData.append('type', 'image');
      formData.append('file', {
        uri: Platform.OS === 'android' ? selectedImage : selectedImage.replace('file://', ''),
        type: 'image/jpeg',
        name: fileName || 'upload.jpg',
      });
      // Use the caption from state instead of hardcoded value
      formData.append('caption', caption || 'No caption');

      const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      const text = await response.text();

      try {
        const result = JSON.parse(text);
        ToastMsg(result?.message);
        navigation.navigate('Tab');
      } catch (err) {
        console.error('Error parsing response:', err);
        ToastMsg('Upload failed: Invalid server response');
      } finally {
        hideLoader();
      }
    } catch (error) {
      console.log('Upload failed:', error.message || error);
      ToastMsg('Something went wrong');
      hideLoader();
    }
  };

  const handleSelect = (uri) => {
    setSelectedImage(prev => (prev === uri ? null : uri));
    setIsPreviewVisible(true);
  };

  const handlePostStory = () => {
    onSubmit(selectedImage);
  };

  const handleOpenCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      maxWidth: 100,
      maxHeight: 100,
      quality: 0.4,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error:', response.errorMessage);
        ToastMsg('Camera error: ' + response.errorMessage);
      } else {
        const uri = response?.assets?.[0]?.uri;
        if (uri) {
          setSelectedImage(uri);
          setIsPreviewVisible(true); // Show preview with caption input
        }
      }
    });
  };

  const handleCropImage = async () => {
    try {
      const cropped = await ImagePicker.openCropper({
        path: selectedImage,
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
      });
  
      if (cropped?.path) {
        setSelectedImage(cropped.path);
      }
    } catch (err) {
      console.log('Crop cancelled or failed:', err?.message);
      ToastMsg('Crop cancelled');
    }
  };

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
          <View style={styles.cameraTile}>
            <FontAwesome name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
      );
    }

    const uri = item.node.image.uri;
    const isSelected = selectedImage === uri;

    return (
      <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
        <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          {isSelected && (
            <View style={styles.checkIconContainer}>
              <Icon name="checkmark" size={16} color="#fff" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <Row style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <CustomText style={styles.headerText}>Select Image</CustomText>
    </Row>
  );

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {renderHeader()}

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          <FlatList
            data={photos}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {selectedImage && !isPreviewVisible && (
            <TouchableOpacity style={styles.postButton} onPress={() => setIsPreviewVisible(true)}>
              <Icon name="arrow-up-circle-outline" size={20} color="#fff" />
              <Text style={styles.postButtonText}>Next</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {isPreviewVisible && selectedImage && (
        <View style={styles.previewContainer}>
          <ScrollView contentContainerStyle={styles.previewScrollView}>
            <View style={styles.imagePreviewSection}>
              <ImageZoom cropWidth={width * 0.9} cropHeight={height * 0.5} imageWidth={width * 0.9} imageHeight={height * 0.5}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} resizeMode="contain" />
              </ImageZoom>
            </View>

            {/* Caption Input Section */}
            <View style={styles.captionSection}>
              <Text style={[styles.captionLabel, { color: isDarkMode ? '#fff' : '#333' }]}>
                Add Caption
              </Text>
              <TextInput
                style={[
                  styles.captionInput,
                  {
                    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
                    color: isDarkMode ? '#fff' : '#333',
                    borderColor: isDarkMode ? '#555' : '#ddd',
                  }
                ]}
                placeholder="Write a caption..."
                placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
                value={caption}
                onChangeText={setCaption}
                multiline
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={[styles.characterCount, { color: isDarkMode ? '#aaa' : '#666' }]}>
                {caption.length}/500
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity onPress={handlePostStory} style={styles.postBtn}>
              <Text style={styles.postText}>Post</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => { setIsPreviewVisible(false); setCaption(''); }} style={styles.closeBtn}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCropImage}
            style={styles.cropBtn}
          >
            <Icon name="crop" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default GalleryForAddPost;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    gap: 90,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  cameraTile: {
    width: imageSize,
    height: 170,
    margin: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageTile: {
    width: imageSize,
    height: 170,
    margin: 1,
    overflow: 'hidden',
  },
  selectedTile: {
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  checkIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    padding: 2,
  },
  postButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  postButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  previewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 999,
  },
  previewScrollView: {
    flexGrow: 1,
    padding: 20,
  },
  imagePreviewSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: height * 0.5,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    maxHeight: height * 0.4,
  },
  captionSection: {
    paddingTop: 20,
    paddingBottom: 80,
  },
  captionLabel: {
    fontSize: 16,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    marginBottom: 10,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
    minHeight: 100,
    maxHeight: 150,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: 5,
    fontSize: 12,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  postBtn: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  cropBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 30,
    zIndex: 1000,
  },
});