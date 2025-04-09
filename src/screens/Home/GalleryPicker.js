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
} from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Icon from 'react-native-vector-icons/Ionicons';
import { BASE_URL, getItem } from '../../utils/Apis';
import useLoader from '../../utils/LoaderHook';
import { ToastMsg } from '../../utils/helperFunctions';
import { useSelector } from 'react-redux';
import Row from '../../components/wrapper/row';
import { BackBlackSimple, BackIcon, PrimaryBackArrow } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';

const screenWidth = Dimensions.get('window').width;
const imageSize = screenWidth / 3 - 10;

const GalleryScreen = ({ navigation }) => {
  const [photos, setPhotos] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { isDarkMode } = useSelector(state => state.theme);


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


  const { showLoader, hideLoader } = useLoader()


  const onSubmit = async (selectedImage) => {
    try {
      const token = await getItem('token');
      showLoader();

      if (!selectedImage) {
        ToastMsg('No image selected');
        hideLoader();
        return;
      }

      const fileName = selectedImage.split('/').pop(); // extract filename from URI

      const formData = new FormData();
      formData.append("type", 'image');
      formData.append("file", {
        uri: Platform.OS === "android" ? selectedImage : selectedImage.replace('file://', ''),
        type: "image/jpeg", // you can add detection logic if needed
        name: fileName || "upload.jpg",
      });

      const response = await fetch(
        `${BASE_URL}/api/user/AddStory`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();
      ToastMsg(result?.message);
      navigation.goBack();
      hideLoader();
    } catch (error) {
      hideLoader();
      console.log('Upload Failed:', error?.response?.data || error.message);
    }
  };


  const handleSelect = (uri) => {
    setSelectedImage(prev => (prev === uri ? null : uri));
  };

  const handlePostStory = () => {
    // Alert.alert('Story Posted!', `You posted this story: ${selectedImage}`);
    // setSelectedImage(null); // Clear selection after posting
    onSubmit(selectedImage)
  };

  const renderItem = ({ item }) => {
    const uri = item.node.image.uri;
    const isSelected = selectedImage === uri;

    return (
      <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
        <View
          style={{
            width: imageSize,
            height: imageSize,
            margin: 5,
            borderRadius: 8,
            overflow: 'hidden',
            borderWidth: isSelected ? 3 : 0,
            borderColor: isSelected ? '#1e90ff' : 'transparent',
          }}
        >
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {isSelected && (
            <View
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                backgroundColor: '#1e90ff',
                borderRadius: 12,
                padding: 2,
              }}
            >
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
      <CustomText style={{
        fontSize: 20,
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      }}>
        Select Image
      </CustomText>
    </Row>
  );

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      {/* <View style={{ height: 30 }} /> */}
      {renderHeader()}
      {errorMsg ? (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>
          {errorMsg}
        </Text>
      ) : (
        <>
          <FlatList
            data={photos}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {selectedImage && (
            <TouchableOpacity
              style={{
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
              }}
              onPress={handlePostStory}
            >
              <Icon name="arrow-up-circle-outline" size={20} color="#fff" />
              <Text style={{ color: '#fff', marginLeft: 8, fontSize: 16 }}>
                Post Story
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default GalleryScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    gap: 90,
    paddingBottom: 20
  },
  headerText: {
    fontSize: 20,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
  },
})
