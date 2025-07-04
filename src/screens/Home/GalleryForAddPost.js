
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
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
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
      formData.append('Caption', caption || 'No caption');

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
        // cropperToolbarPadding:  50,
        height: 200,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
        hideBottomControls: false,
        enableRotationGesture: true,
        statusBarTranslucent: false,
        cropperStatusBarColor: isDarkMode ? '#000000' : '#ffffff',
        cropperToolbarColor: isDarkMode ? '#1a1a1a' : '#ffffff',
   
        cropperActiveWidgetColor: '#1e90ff',
        cropperToolbarWidgetColor: isDarkMode ? '#ffffff' : '#000000',
        cropperToolbarTitle: 'Edit Photo',
        includeBase64: false,
        includeExif: false,
        avoidEmptySpaceAroundImage: true,
        showCropGuidelines: true,
        showCropFrame: true,
        compressImageQuality: 0.8,
        forceJpg: true,
        // This is the key fix for Android status bar overlap
        useFrontCamera: false,
        writeTempFile: true,
        // Android specific fixes
        ...(Platform.OS === 'android' && {
          mediaType: 'photo',
          smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Videos', 'Bursts'],
        }),
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
        <StatusBar
          backgroundColor="transparent"
          translucent
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
              contentContainerStyle={{ paddingBottom: 100, alignSelf:'center' }}
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
          <View style={[styles.previewContainer, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
            {/* Header with controls */}
            <View style={[styles.previewHeader, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
              <TouchableOpacity onPress={() => { setIsPreviewVisible(false); setCaption(''); }} style={styles.headerButton}>
                <Icon name="chevron-back" size={24} color={isDarkMode ? '#fff' : '#333'} />
                <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>Back</Text>
              </TouchableOpacity>
              
              <Text style={[styles.previewTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                Create Post
              </Text>
              
              <TouchableOpacity onPress={handleCropImage} style={styles.headerButton}>
                <Icon name="crop" size={20} color={isDarkMode ? '#fff' : '#333'} />
                <Text style={[styles.headerButtonText, { color: isDarkMode ? '#fff' : '#333' }]}>Crop</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.previewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 80 }}
            >
              {/* Image Preview Section */}
              <View style={styles.imagePreviewContainer}>
                <View style={[styles.imageWrapper, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                  <ImageZoom 
                    cropWidth={width} 
                    cropHeight={width} 
                    imageWidth={width} 
                    imageHeight={width}
                    enableSwipeDown={false}
                    enableDoubleClickZoom={true}
                    minScale={0.8}
                    maxScale={3}
                  >
                    <Image 
                      source={{ uri: selectedImage }} 
                      style={styles.previewImage} 
                      resizeMode="contain" 
                    />
                  </ImageZoom>
                </View>
              </View>

              {/* Caption Section */}
              <View style={[styles.captionContainer, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
                <View style={styles.captionHeader}>
                  <Icon name="create-outline" size={20} color={isDarkMode ? '#fff' : '#333'} />
                  <Text style={[styles.captionTitle, { color: isDarkMode ? '#fff' : '#333' }]}>
                    Write a caption
                  </Text>
                </View>
                
                <View style={[styles.captionInputContainer, { 
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                  borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9'
                }]}>
                  <TextInput
                    style={[styles.captionInput, { color: isDarkMode ? '#fff' : '#333' }]}
                    placeholder="What's on your mind?"
                    placeholderTextColor={isDarkMode ? '#888' : '#666'}
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                    maxLength={2200}
                    textAlignVertical="top"
                    autoCorrect={true}
                    spellCheck={true}
                  />
                </View>
                
                <View style={styles.captionFooter}>
                  <Text style={[styles.characterCount, { color: isDarkMode ? '#888' : '#666' }]}>
                    {caption.length}/2200
                  </Text>
                  <View style={styles.captionActions}>
                    <TouchableOpacity style={styles.emojiButton}>
                      <Icon name="happy-outline" size={20} color={isDarkMode ? '#888' : '#666'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tagButton}>
                      <Icon name="pricetag-outline" size={20} color={isDarkMode ? '#888' : '#666'} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Post Button - Fixed positioning */}
            <View style={[styles.postButtonContainer, { 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
              borderTopColor: isDarkMode ? '#333' : '#e1e5e9'
            }]}>
              <TouchableOpacity 
                onPress={handlePostStory} 
                style={[styles.postBtn, { opacity: selectedImage ? 1 : 0.5 }]}
                disabled={!selectedImage}
              >
                <Icon name="send" size={18} color="#fff" style={styles.postIcon} />
                <Text style={styles.postText}>Share Post</Text>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
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
    zIndex: 999,
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 60,
  },
  headerButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
  },
  previewTitle: {
    fontSize: 18,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    textAlign: 'center',
  },
  previewContent: {
    flex: 1,
  },
  imagePreviewContainer: {
    padding: 16,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  previewImage: {
    width: width,
    height: width,
  },
  captionContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  captionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  captionTitle: {
    fontSize: 16,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    marginLeft: 8,
  },
  captionInputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    maxHeight: 200,
  },
  captionInput: {
    fontSize: 16,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
    lineHeight: 22,
    flex: 1,
    textAlignVertical: 'top',
  },
  captionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
  },
  captionActions: {
    flexDirection: 'row',
    gap: 16,
  },
  emojiButton: {
    padding: 8,
  },
  tagButton: {
    padding: 8,
  },
  postButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  postBtn: {
    backgroundColor: '#1e90ff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  postIcon: {
    marginRight: 8,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
    fontWeight: '600',
  },
});