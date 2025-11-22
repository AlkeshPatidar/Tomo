

// import React, { useEffect, useState } from 'react'
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
//   TextInput,
//   KeyboardAvoidingView,
//   ScrollView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   SafeAreaView,
// } from 'react-native'
// import { CameraRoll } from '@react-native-camera-roll/camera-roll'
// import Icon from 'react-native-vector-icons/Ionicons'
// import { BASE_URL, getItem } from '../../utils/Apis'
// import useLoader from '../../utils/LoaderHook'
// import { ToastMsg } from '../../utils/helperFunctions'
// import { useSelector } from 'react-redux'
// import Row from '../../components/wrapper/row'
// import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
// import { FONTS_FAMILY } from '../../assets/Fonts'
// import CustomText from '../../components/TextComponent'
// import { launchCamera } from 'react-native-image-picker'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import ImageZoom from 'react-native-image-pan-zoom'
// import ImagePicker from 'react-native-image-crop-picker'
// import Video from 'react-native-video'
// import LinearGradient from 'react-native-linear-gradient'
// import { App_Primary_color } from '../../common/Colors/colors'

// const screenWidth = Dimensions.get('window').width
// const imageSize = screenWidth / 3 - 10
// const { width, height } = Dimensions.get('window')

// const GalleryForAddPost = ({ navigation }) => {
//   const [photos, setPhotos] = useState([])
//   const [videos, setVideos] = useState([])
//   const [errorMsg, setErrorMsg] = useState('')
//   const [selectedImage, setSelectedImage] = useState(null)
//   const [caption, setCaption] = useState('')
//   const [activeTab, setActiveTab] = useState('Images')
//   const [selectedMediaType, setSelectedMediaType] = useState('image') // Track media type
//   const { isDarkMode } = useSelector(state => state.theme)
//   const [isPreviewVisible, setIsPreviewVisible] = useState(false)
//   const { showLoader, hideLoader } = useLoader()

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
//             },
//           )

//           const videoPermission = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//             {
//               title: 'Video Permission Required',
//               message: 'App needs access to your videos',
//               buttonPositive: 'OK',
//             },
//           )

//           const legacy = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           )

//           if (
//             permission !== PermissionsAndroid.RESULTS.GRANTED &&
//             videoPermission !== PermissionsAndroid.RESULTS.GRANTED &&
//             legacy !== PermissionsAndroid.RESULTS.GRANTED
//           ) {
//             setErrorMsg('Permission denied')
//             return
//           }
//         }

//         // Load images
//         const imageResult = await CameraRoll.getPhotos({
//           first: 50,
//           assetType: 'Photos',
//         })
//         setPhotos(imageResult.edges)

//         // Load videos
//         const videoResult = await CameraRoll.getPhotos({
//           first: 50,
//           assetType: 'Videos',
//         })
//         setVideos(videoResult.edges)

//         if (imageResult.edges.length === 0 && videoResult.edges.length === 0) {
//           setErrorMsg('No media found in gallery.')
//         }
//       } catch (error) {
//         setErrorMsg(error.message || 'Something went wrong')
//         Alert.alert('Error', error.message || 'Something went wrong')
//       }
//     }

//     requestPermissionAndLoad()
//   }, [])

//   const onSubmit = async selectedMedia => {
//     try {
//       const token = await getItem('token')
//       showLoader()

//       if (!selectedMedia) {
//         ToastMsg('No media selected')
//         hideLoader()
//         return
//       }

//       const fileName = selectedMedia.split('/').pop()
//       const formData = new FormData()

//       // Set type based on selected media type
//       formData.append('type', selectedMediaType)

//       const fileObject = {
//         uri:
//           Platform.OS === 'android'
//             ? selectedMedia
//             : selectedMedia.replace('file://', ''),
//         name:
//           fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
//       }

//       // Set appropriate MIME type based on media type
//       if (selectedMediaType === 'video') {
//         fileObject.type = 'video/mp4'
//       } else {
//         fileObject.type = 'image/jpeg'
//       }

//       formData.append('file', fileObject)
//       formData.append('Caption', caption || 'No caption')

//       const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       })

//       if (!response.ok)
//         throw new Error(`Server responded with status ${response.status}`)
//       const text = await response.text()

//       try {
//         const result = JSON.parse(text)
//         ToastMsg(result?.message)
//         navigation.navigate('Tab')
//       } catch (err) {
//         console.error('Error parsing response:', err)
//         ToastMsg('Upload failed: Invalid server response')
//       } finally {
//         hideLoader()
//       }
//     } catch (error) {
//       console.log('Upload failed:', error.message || error)
//       ToastMsg('Something went wrong')
//       hideLoader()
//     }
//   }

//   const handleSelect = uri => {
//     setSelectedImage(prev => (prev === uri ? null : uri))
//     // Set media type based on active tab
//     setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//     setIsPreviewVisible(true)
//   }

//   const handlePostStory = () => {
//     onSubmit(selectedImage)
//   }

//   const handleOpenCamera = () => {
//     const options = {
//       mediaType: activeTab === 'Videos' ? 'video' : 'photo',
//       cameraType: 'back',
//       maxWidth: 100,
//       maxHeight: 100,
//       quality: 0.4,
//       videoQuality: 'medium',
//       durationLimit: 60,
//     }

//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled camera')
//       } else if (response.errorCode) {
//         console.log('Camera error:', response.errorMessage)
//         ToastMsg('Camera error: ' + response.errorMessage)
//       } else {
//         const uri = response?.assets?.[0]?.uri
//         if (uri) {
//           setSelectedImage(uri)
//           setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
//           setIsPreviewVisible(true)
//         }
//       }
//     })
//   }

//   const handleCropImage = async () => {
//     // Only allow cropping for images
//     if (selectedMediaType !== 'image') {
//       ToastMsg('Cropping is only available for images')
//       return
//     }

//     try {
//       const cropped = await ImagePicker.openCropper({
//         path: selectedImage,
//         width: 300,
//         height: 200,
//         cropping: true,
//         cropperCircleOverlay: false,
//         freeStyleCropEnabled: true,
//         hideBottomControls: false,
//         enableRotationGesture: true,
//         statusBarTranslucent: false,
//         cropperStatusBarColor: isDarkMode ? '#000000' : '#ffffff',
//         cropperToolbarColor: isDarkMode ? '#1a1a1a' : '#ffffff',
//         cropperActiveWidgetColor: '#1e90ff',
//         cropperToolbarWidgetColor: isDarkMode ? '#ffffff' : '#000000',
//         cropperToolbarTitle: 'Edit Photo',
//         includeBase64: false,
//         includeExif: false,
//         avoidEmptySpaceAroundImage: true,
//         showCropGuidelines: true,
//         showCropFrame: true,
//         compressImageQuality: 1,

//         forceJpg: true,
//         useFrontCamera: false,
//         writeTempFile: true,
//         ...(Platform.OS === 'android' && {
//           mediaType: 'photo',
//           smartAlbums: [
//             'UserLibrary',
//             'PhotoStream',
//             'Panoramas',
//             'Videos',
//             'Bursts',
//           ],
//         }),
//       })

//       if (cropped?.path) {
//         setSelectedImage(cropped.path)
//       }
//     } catch (err) {
//       console.log('Crop cancelled or failed:', err?.message)
//       ToastMsg('Crop cancelled')
//     }
//   }

//   const handleVideoTrim = async () => {
//     // Video trimming functionality can be added here
//     // For now, just show a message
//     ToastMsg('Video trimming feature coming soon')
//   }

//   const getCurrentData = () => {
//     return activeTab === 'Images' ? photos : videos
//   }

//   const renderItem = ({ item, index }) => {
//     if (index === 0) {
//       return (
//         <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
//           <View style={styles.cameraTile}>
//             <FontAwesome
//               name={activeTab === 'Videos' ? 'video-camera' : 'camera'}
//               size={20}
//               color='#fff'
//             />
//             <Text style={styles.cameraText}>
//               {activeTab === 'Videos' ? 'Record' : 'Camera'}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       )
//     }

//     const uri = item.node.image.uri
//     const isSelected = selectedImage === uri
//     const isVideo = activeTab === 'Videos'

//     return (
//       <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
//         <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
//           <Image source={{ uri }} style={styles.image} resizeMode='cover' />
//           {/* Video play icon overlay */}
//           {isVideo && (
//             <View style={styles.videoOverlay}>
//               <Icon
//                 name='play-circle'
//                 size={24}
//                 color='rgba(255,255,255,0.8)'
//               />
//             </View>
//           )}
//           {isSelected && (
//             <View style={styles.checkIconContainer}>
//               <Icon name='checkmark' size={16} color='#fff' />
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     )
//   }

//   const renderTabBar = () => (
//     <View
//       style={[
//         styles.tabContainer,
//         // {backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa'},
//       ]}>
//       <TouchableOpacity
//         style={[
//           styles.tabButton,
//           activeTab === 'Images' && styles.activeTab,
//           // { backgroundColor: activeTab === 'Images' ? '#1e90ff' : 'transparent' }
//         ]}
//         onPress={() => setActiveTab('Images')}>
//         <LinearGradient
//           colors={['#FC14CB', '#4F52FE']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={[styles.tabButton, { borderRadius: 8 }]}>
//           <Icon
//             name='image-outline'
//             size={20}
//             color={
//               activeTab === 'Images' ? '#fff' : isDarkMode ? '#fff' : '#333'
//             }
//           />
//           <Text
//             style={[
//               styles.tabText,
//               {
//                 color:
//                   activeTab === 'Images'
//                     ? '#fff'
//                     : isDarkMode
//                       ? '#fff'
//                       : '#333',
//               },
//             ]}>
//             Images
//           </Text>
//         </LinearGradient>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={[
//           styles.tabButton,
//           activeTab === 'Videos' && styles.activeTab,
//           // { backgroundColor: activeTab === 'Videos' ? '#1e90ff' : 'transparent' }
//         ]}
//         onPress={() => setActiveTab('Videos')}>
//         <LinearGradient
//           colors={['#FC14CB', '#4F52FE']}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={[styles.tabButton, { borderRadius: 8 }]}>
//           <Icon
//             name='videocam-outline'
//             size={20}
//             color={
//               activeTab === 'Videos' ? '#fff' : isDarkMode ? '#fff' : '#333'
//             }
//           />
//           <Text
//             style={[
//               styles.tabText,
//               {
//                 color:
//                   activeTab === 'Videos'
//                     ? '#fff'
//                     : isDarkMode
//                       ? '#fff'
//                       : '#333',
//               },
//             ]}>
//             Videos
//           </Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   )

//   const renderHeader = () => (
//     <Row style={styles.header}>
//       <TouchableOpacity onPress={() => navigation.goBack()}>
//         {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
//       </TouchableOpacity>
//       <CustomText style={styles.headerText}>Select Media</CustomText>
//     </Row>
//   )

//   const renderPreviewMedia = () => {
//     if (selectedMediaType === 'video') {
//       return (
//         <View style={styles.videoPreviewContainer}>
//           <Video
//             source={{ uri: selectedImage }}
//             style={styles.previewVideo}
//             resizeMode='contain'
//             controls={true}
//             paused={false}
//             repeat={true}
//             muted={false}
//             onError={error => {
//               console.log('Video error:', error)
//               ToastMsg('Error loading video')
//             }}
//           />
//         </View>
//       )
//     } else {
//       return (
//         <View style={styles.imagePreviewContainer}>
//           <View
//             style={[
//               styles.imageWrapper,
//               { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
//             ]}>
//             <ImageZoom
//               cropWidth={width}
//               cropHeight={width}
//               imageWidth={width}
//               imageHeight={width}
//               enableSwipeDown={false}
//               enableDoubleClickZoom={true}
//               minScale={0.8}
//               maxScale={3}>
//               <Image
//                 source={{ uri: selectedImage }}
//                 style={styles.previewImage}
//                 resizeMode='contain'
//               />
//             </ImageZoom>
//           </View>
//         </View>
//       )
//     }
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
//         <StatusBar
//           backgroundColor='transparent'
//           translucent
//           barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         />
//         {renderHeader()}
//         {renderTabBar()}

//         {errorMsg ? (
//           <Text style={styles.errorText}>{errorMsg}</Text>
//         ) : (
//           <>
//             <FlatList
//               data={getCurrentData()}
//               keyExtractor={(item, index) => index.toString()}
//               numColumns={3}
//               renderItem={renderItem}
//               contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
//               key={activeTab} // Force re-render when tab changes
//             />

//             {selectedImage && !isPreviewVisible && (
//               <TouchableOpacity
//                 style={styles.postButton}
//                 onPress={() => setIsPreviewVisible(true)}>
//                 <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
//                 <Text style={styles.postButtonText}>Next</Text>
//               </TouchableOpacity>
//             )}
//           </>
//         )}

//         {isPreviewVisible && selectedImage && (
//           <View
//             style={[
//               styles.previewContainer,
//               { backgroundColor: isDarkMode ? '#000' : '#fff' },
//             ]}>
//             <KeyboardAvoidingView
//               style={{ flex: 1 }}
//               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//               keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
//               <View
//                 style={[
//                   styles.previewHeader,
//                   { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
//                 ]}>
//                 <TouchableOpacity
//                   onPress={() => {
//                     setIsPreviewVisible(false)
//                     setCaption('')
//                   }}
//                   style={styles.headerButton}>
//                   <Icon
//                     name='chevron-back'
//                     size={24}
//                     color={isDarkMode ? '#fff' : '#333'}
//                   />
//                   <Text
//                     style={[
//                       styles.headerButtonText,
//                       { color: isDarkMode ? '#fff' : '#333' },
//                     ]}>
//                     Back
//                   </Text>
//                 </TouchableOpacity>

//                 <Text
//                   style={[
//                     styles.previewTitle,
//                     { color: isDarkMode ? '#fff' : '#333' },
//                   ]}>
//                   Create Post
//                 </Text>

//                 <TouchableOpacity
//                   onPress={
//                     selectedMediaType === 'video'
//                       ? handleVideoTrim
//                       : handleCropImage
//                   }
//                   style={styles.headerButton}>
//                   <Icon
//                     name={selectedMediaType === 'video' ? 'cut' : 'crop'}
//                     size={20}
//                     color={isDarkMode ? '#fff' : '#333'}
//                   />
//                   <Text
//                     style={[
//                       styles.headerButtonText,
//                       { color: isDarkMode ? '#fff' : '#333' },
//                     ]}>
//                     {selectedMediaType === 'video' ? 'Trim' : 'Crop'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <ScrollView
//                 style={styles.previewContent}
//                 showsVerticalScrollIndicator={false}
//                 keyboardShouldPersistTaps='handled'
//                 contentContainerStyle={{ paddingBottom: 200 }}>
//                 {renderPreviewMedia()}

//                 <View
//                   style={[
//                     styles.captionContainer,
//                     { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
//                   ]}>
//                   <View style={styles.captionHeader}>
//                     <Icon
//                       name='create-outline'
//                       size={20}
//                       color={isDarkMode ? '#fff' : '#333'}
//                     />
//                     <Text
//                       style={[
//                         styles.captionTitle,
//                         { color: isDarkMode ? '#fff' : '#333' },
//                       ]}>
//                       Write a caption
//                     </Text>
//                   </View>

//                   <View
//                     style={[
//                       styles.captionInputContainer,

//                       {
//                         backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
//                         borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
//                       },
//                     ]}>
//                     <TextInput
//                       style={[
//                         styles.captionInput,
//                         { color: isDarkMode ? '#fff' : '#333' },
//                       ]}
//                       placeholder="What's on your mind?"
//                       placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                       value={caption}
//                       onChangeText={setCaption}
//                       multiline
//                       maxLength={2200}
//                       textAlignVertical='top'
//                       autoCorrect={true}
//                       spellCheck={true}
//                     />
//                   </View>

//                   <View style={styles.captionFooter}>
//                     <Text
//                       style={[
//                         styles.characterCount,
//                         { color: isDarkMode ? '#888' : '#666' },
//                       ]}>
//                       {caption.length}/2200
//                     </Text>
//                     <View style={styles.captionActions}>
//                       <TouchableOpacity style={styles.emojiButton}>
//                         <Icon
//                           name='happy-outline'
//                           size={20}
//                           color={isDarkMode ? '#888' : '#666'}
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.tagButton}>
//                         <Icon
//                           name='pricetag-outline'
//                           size={20}
//                           color={isDarkMode ? '#888' : '#666'}
//                         />
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>

//                 <View
//                   style={[
//                     styles.captionContainer,
//                     {
//                       borderWidth: 1,
//                       borderRadius: 12,
//                       padding: 16,
//                       minHeight: 80,
//                       maxHeight: 120,
//                     },
//                     { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
//                   ]}>
//                   <View style={styles.captionHeader}>
//                     <Icon
//                       name='create-outline'
//                       size={20}
//                       color={isDarkMode ? '#fff' : '#333'}
//                     />
//                     <Text
//                       style={[
//                         styles.captionTitle,
//                         { color: isDarkMode ? '#fff' : '#333' },
//                       ]}>
//                       Type hastag
//                     </Text>
//                   </View>
//                   <Row style={{ width: '100%' , gap:10, alignItems:'center'}}>
//                     <View
//                       style={[
//                         styles.captionInputContainer,
//                         {
//                           borderWidth: 1,
//                           borderRadius: 12,
//                           padding: 3,
//                           minHeight: 48,
//                           // maxHeight: 300,
//                           flex: 1,
//                         },
//                         {
//                           backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
//                           borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
//                         },
//                       ]}>
//                       <Row>
//                         <TextInput
//                           style={[
//                             styles.captionInput,
//                             { color: isDarkMode ? '#fff' : '#333' },
//                           ]}
//                           placeholder="Enter hastags?"
//                           placeholderTextColor={isDarkMode ? '#888' : '#666'}
//                           value={caption}
//                           onChangeText={setCaption}
//                           multiline
//                           maxLength={100}
//                           textAlignVertical='top'
//                           autoCorrect={true}
//                           spellCheck={true}
//                         />


//                       </Row>
//                     </View>

//                     <TouchableOpacity
//                     style={{ 
//                       backgroundColor: '#12208B',
//                       paddingVertical:12,
//                       paddingHorizontal:16,
//                       borderRadius:8
//                      }}
//                     >
//                       <CustomText
//                       style={{
//                         fontFamily:FONTS_FAMILY.SourceSans3_Medium
//                       }}
//                       >Add</CustomText>
//                     </TouchableOpacity>

//                   </Row>

//                   <View style={styles.captionFooter}>
//                     {/* <Text
//                       style={[
//                         styles.characterCount,
//                         { color: isDarkMode ? '#888' : '#666' },
//                       ]}>
//                       {caption.length}/2200
//                     </Text> */}
//                     {/* <View style={styles.captionActions}>
//                       <TouchableOpacity style={styles.emojiButton}>
//                         <Icon
//                           name='happy-outline'
//                           size={20}
//                           color={isDarkMode ? '#888' : '#666'}
//                         />
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.tagButton}>
//                         <Icon
//                           name='pricetag-outline'
//                           size={20}
//                           color={isDarkMode ? '#888' : '#666'}
//                         />
//                       </TouchableOpacity>
//                     </View> */}
//                   </View>
//                 </View>
//               </ScrollView>

//               <View
//                 style={[
//                   styles.postButtonContainer,
//                   {
//                     backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
//                     borderTopColor: isDarkMode ? '#333' : '#e1e5e9',
//                   },
//                 ]}>
//                 <TouchableOpacity
//                   onPress={handlePostStory}
//                   // style={[styles.postBtn, {opacity: selectedImage ? 1 : 0.5}]}
//                   disabled={!selectedImage}>
//                   <LinearGradient
//                     colors={['#FC14CB', '#4F52FE']}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 1 }}
//                     style={[{ borderRadius: 8 }, styles.postBtn, { opacity: selectedImage ? 1 : 0.5 }]}>
//                     <Icon
//                       name='send'
//                       size={18}
//                       color='#fff'
//                       style={styles.postIcon}
//                     />
//                     <Text style={styles.postText}>
//                       Share {selectedMediaType === 'video' ? 'Video' : 'Post'}
//                     </Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         )}
//       </View>
//     </TouchableWithoutFeedback>
//   )
// }

// export default GalleryForAddPost

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
//   tabContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//     // paddingVertical: 10,
//     // borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//     marginBottom: 10,
//   },
//   tabButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     borderRadius: 25,
//     // marginBottom:10
//     // marginHorizontal: 5,
//   },
//   activeTab: {
//     elevation: 2,
//     // shadowColor: '#1e90ff',
//     // shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: '#4F52FE',
//   },
//   tabText: {
//     fontSize: 16,
//     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     marginLeft: 8,
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
//   cameraText: {
//     color: '#fff',
//     fontSize: 10,
//     marginTop: 4,
//     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
//   },
//   imageTile: {
//     width: imageSize,
//     height: 170,
//     margin: 1,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   selectedTile: {
//     borderWidth: 3,
//     borderColor: '#1e90ff',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   videoOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
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
//     zIndex: 999,
//     flex: 1,
//   },
//   previewHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingTop: 50,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255,255,255,0.1)',
//   },
//   headerButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     minWidth: 60,
//   },
//   headerButtonText: {
//     marginLeft: 4,
//     fontSize: 14,
//     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
//   },
//   previewTitle: {
//     fontSize: 18,
//     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     textAlign: 'center',
//   },
//   previewContent: {
//     flex: 1,
//   },
//   imagePreviewContainer: {
//     padding: 16,
//   },
//   imageWrapper: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   previewImage: {
//     width: width,
//     height: width,
//   },
//   videoPreviewContainer: {
//     padding: 16,
//   },
//   previewVideo: {
//     width: width - 32,
//     height: width - 32,
//     borderRadius: 16,
//     backgroundColor: '#000',
//   },
//   captionContainer: {
//     margin: 16,
//     marginTop: 0,
//     borderRadius: 16,
//     padding: 16,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   captionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   captionTitle: {
//     fontSize: 16,
//     fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//     marginLeft: 8,
//   },
//   captionInputContainer: {
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 16,
//     minHeight: 120,
//     maxHeight: 200,
//   },
//   captionInput: {
//     fontSize: 16,
//     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
//     lineHeight: 22,
//     flex: 1,
//     textAlignVertical: 'top',
//   },
//   captionFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 12,
//   },
//   characterCount: {
//     fontSize: 12,
//     fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
//   },
//   captionActions: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   emojiButton: {
//     padding: 8,
//   },
//   tagButton: {
//     padding: 8,
//   },
//   postButtonContainer: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     backgroundColor: 'transparent',
//   },
//   postBtn: {
//     backgroundColor: '#1e90ff',
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//     shadowColor: '#1e90ff',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   postIcon: {
//     marginRight: 8,
//   },
//   postText: {
//     color: '#fff',
//     fontSize: 19,
//     fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     fontWeight: '600',
//   },
// })


import React, { useEffect, useState } from 'react'
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
} from 'react-native'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import Icon from 'react-native-vector-icons/Ionicons'
import { BASE_URL, getItem } from '../../utils/Apis'
import useLoader from '../../utils/LoaderHook'
import { ToastMsg } from '../../utils/helperFunctions'
import { useSelector } from 'react-redux'
import Row from '../../components/wrapper/row'
import { BackIcon, PrimaryBackArrow } from '../../assets/SVGs'
import { FONTS_FAMILY } from '../../assets/Fonts'
import CustomText from '../../components/TextComponent'
import { launchCamera } from 'react-native-image-picker'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ImageZoom from 'react-native-image-pan-zoom'
import ImagePicker from 'react-native-image-crop-picker'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient'
import { App_Primary_color } from '../../common/Colors/colors'

const screenWidth = Dimensions.get('window').width
const imageSize = screenWidth / 3 - 10
const { width, height } = Dimensions.get('window')

const GalleryForAddPost = ({ navigation }) => {
  const [photos, setPhotos] = useState([])
  const [videos, setVideos] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [activeTab, setActiveTab] = useState('Images')
  const [selectedMediaType, setSelectedMediaType] = useState('image')
  const { isDarkMode } = useSelector(state => state.theme)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const { showLoader, hideLoader } = useLoader()
  
  // Hashtag states
  const [hashtagsInput, setHashtagsInput] = useState('')
  const [hashtags, setHashtags] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [tagLoading, setTagLoading] = useState(false)

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
            },
          )

          const videoPermission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            {
              title: 'Video Permission Required',
              message: 'App needs access to your videos',
              buttonPositive: 'OK',
            },
          )

          const legacy = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          )

          if (
            permission !== PermissionsAndroid.RESULTS.GRANTED &&
            videoPermission !== PermissionsAndroid.RESULTS.GRANTED &&
            legacy !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            setErrorMsg('Permission denied')
            return
          }
        }

        const imageResult = await CameraRoll.getPhotos({
          first: 50,
          assetType: 'Photos',
        })
        setPhotos(imageResult.edges)

        const videoResult = await CameraRoll.getPhotos({
          first: 50,
          assetType: 'Videos',
        })
        setVideos(videoResult.edges)

        if (imageResult.edges.length === 0 && videoResult.edges.length === 0) {
          setErrorMsg('No media found in gallery.')
        }
      } catch (error) {
        setErrorMsg(error.message || 'Something went wrong')
        Alert.alert('Error', error.message || 'Something went wrong')
      }
    }

    requestPermissionAndLoad()
  }, [])

  // Search hashtags function
  const SearchTags = async (tag) => {
    try {
      if (!tag.trim()) {
        setSuggestions([])
        return
      }
      setTagLoading(true)
      const token = await getItem('token')
      const response = await fetch(`${BASE_URL}/api/admin/SearchHashtags?query=${tag}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const result = await response.json()
      setSuggestions(result?.data || [])
      setTagLoading(false)
    } catch (error) {
      setTagLoading(false)
      console.error('Error fetching tags:', error)
    }
  }

  // Add hashtag
  const addHashtag = (tag) => {
    tag = tag.toLowerCase().trim()
    if (!tag || hashtags.includes(tag)) return
    setHashtags([...hashtags, tag])
    setHashtagsInput('')
    setSuggestions([])
  }

  // Remove hashtag
  const removeTag = (tag) => {
    setHashtags(hashtags.filter((t) => t !== tag))
  }

  const onSubmit = async selectedMedia => {
    try {
      const token = await getItem('token')
      showLoader()

      if (!selectedMedia) {
        ToastMsg('No media selected')
        hideLoader()
        return
      }

      const fileName = selectedMedia.split('/').pop()
      const formData = new FormData()

      formData.append('type', selectedMediaType)

      const fileObject = {
        uri:
          Platform.OS === 'android'
            ? selectedMedia
            : selectedMedia.replace('file://', ''),
        name:
          fileName || `upload.${selectedMediaType === 'video' ? 'mp4' : 'jpg'}`,
      }

      if (selectedMediaType === 'video') {
        fileObject.type = 'video/mp4'
      } else {
        fileObject.type = 'image/jpeg'
      }

      formData.append('file', fileObject)
      formData.append('Caption', caption || 'No caption')
      formData.append('Hashtags', JSON.stringify(hashtags))

      const response = await fetch(`${BASE_URL}/api/user/AddPost`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok)
        throw new Error(`Server responded with status ${response.status}`)
      const text = await response.text()

      try {
        const result = JSON.parse(text)
        ToastMsg(result?.message)
        navigation.navigate('Tab')
      } catch (err) {
        console.error('Error parsing response:', err)
        ToastMsg('Upload failed: Invalid server response')
      } finally {
        hideLoader()
      }
    } catch (error) {
      console.log('Upload failed:', error.message || error)
      ToastMsg('Something went wrong')
      hideLoader()
    }
  }

  const handleSelect = uri => {
    setSelectedImage(prev => (prev === uri ? null : uri))
    setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
    setIsPreviewVisible(true)
  }

  const handlePostStory = () => {
    onSubmit(selectedImage)
  }

  const handleOpenCamera = () => {
    const options = {
      mediaType: activeTab === 'Videos' ? 'video' : 'photo',
      cameraType: 'back',
      maxWidth: 100,
      maxHeight: 100,
      quality: 0.4,
      videoQuality: 'medium',
      durationLimit: 60,
    }

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera')
      } else if (response.errorCode) {
        console.log('Camera error:', response.errorMessage)
        ToastMsg('Camera error: ' + response.errorMessage)
      } else {
        const uri = response?.assets?.[0]?.uri
        if (uri) {
          setSelectedImage(uri)
          setSelectedMediaType(activeTab === 'Videos' ? 'video' : 'image')
          setIsPreviewVisible(true)
        }
      }
    })
  }

  const handleCropImage = async () => {
    if (selectedMediaType !== 'image') {
      ToastMsg('Cropping is only available for images')
      return
    }

    try {
      const cropped = await ImagePicker.openCropper({
        path: selectedImage,
        width: 300,
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
        compressImageQuality: 1,
        forceJpg: true,
        useFrontCamera: false,
        writeTempFile: true,
        ...(Platform.OS === 'android' && {
          mediaType: 'photo',
          smartAlbums: [
            'UserLibrary',
            'PhotoStream',
            'Panoramas',
            'Videos',
            'Bursts',
          ],
        }),
      })

      if (cropped?.path) {
        setSelectedImage(cropped.path)
      }
    } catch (err) {
      console.log('Crop cancelled or failed:', err?.message)
      ToastMsg('Crop cancelled')
    }
  }

  const handleVideoTrim = async () => {
    ToastMsg('Video trimming feature coming soon')
  }

  const getCurrentData = () => {
    return activeTab === 'Images' ? photos : videos
  }

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      return (
        <TouchableOpacity onPress={handleOpenCamera} activeOpacity={0.8}>
          <View style={styles.cameraTile}>
            <FontAwesome
              name={activeTab === 'Videos' ? 'video-camera' : 'camera'}
              size={20}
              color='#fff'
            />
            <Text style={styles.cameraText}>
              {activeTab === 'Videos' ? 'Record' : 'Camera'}
            </Text>
          </View>
        </TouchableOpacity>
      )
    }

    const uri = item.node.image.uri
    const isSelected = selectedImage === uri
    const isVideo = activeTab === 'Videos'

    return (
      <TouchableOpacity onPress={() => handleSelect(uri)} activeOpacity={0.8}>
        <View style={[styles.imageTile, isSelected && styles.selectedTile]}>
          <Image source={{ uri }} style={styles.image} resizeMode='cover' />
          {isVideo && (
            <View style={styles.videoOverlay}>
              <Icon
                name='play-circle'
                size={24}
                color='rgba(255,255,255,0.8)'
              />
            </View>
          )}
          {isSelected && (
            <View style={styles.checkIconContainer}>
              <Icon name='checkmark' size={16} color='#fff' />
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderTabBar = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'Images' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('Images')}>
        <LinearGradient
          colors={['#FC14CB', '#4F52FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.tabButton, { borderRadius: 8 }]}>
          <Icon
            name='image-outline'
            size={20}
            color={
              activeTab === 'Images' ? '#fff' : isDarkMode ? '#fff' : '#333'
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'Images'
                    ? '#fff'
                    : isDarkMode
                      ? '#fff'
                      : '#333',
              },
            ]}>
            Images
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'Videos' && styles.activeTab,
        ]}
        onPress={() => setActiveTab('Videos')}>
        <LinearGradient
          colors={['#FC14CB', '#4F52FE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.tabButton, { borderRadius: 8 }]}>
          <Icon
            name='videocam-outline'
            size={20}
            color={
              activeTab === 'Videos' ? '#fff' : isDarkMode ? '#fff' : '#333'
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'Videos'
                    ? '#fff'
                    : isDarkMode
                      ? '#fff'
                      : '#333',
              },
            ]}>
            Videos
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const renderHeader = () => (
    <Row style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isDarkMode ? <BackIcon /> : <PrimaryBackArrow />}
      </TouchableOpacity>
      <CustomText style={styles.headerText}>Select Media</CustomText>
    </Row>
  )

  const renderPreviewMedia = () => {
    if (selectedMediaType === 'video') {
      return (
        <View style={styles.videoPreviewContainer}>
          <Video
            source={{ uri: selectedImage }}
            style={styles.previewVideo}
            resizeMode='contain'
            controls={true}
            paused={false}
            repeat={true}
            muted={false}
            onError={error => {
              console.log('Video error:', error)
              ToastMsg('Error loading video')
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.imagePreviewContainer}>
          <View
            style={[
              styles.imageWrapper,
              { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
            ]}>
            <ImageZoom
              cropWidth={width}
              cropHeight={width}
              imageWidth={width}
              imageHeight={width}
              enableSwipeDown={false}
              enableDoubleClickZoom={true}
              minScale={0.8}
              maxScale={3}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.previewImage}
                resizeMode='contain'
              />
            </ImageZoom>
          </View>
        </View>
      )
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: isDarkMode ? '#252525' : '#fff' }}>
        <StatusBar
          backgroundColor='transparent'
          translucent
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        {renderHeader()}
        {renderTabBar()}

        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <>
            <FlatList
              data={getCurrentData()}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 100, alignSelf: 'center' }}
              key={activeTab}
            />

            {selectedImage && !isPreviewVisible && (
              <TouchableOpacity
                style={styles.postButton}
                onPress={() => setIsPreviewVisible(true)}>
                <Icon name='arrow-up-circle-outline' size={20} color='#fff' />
                <Text style={styles.postButtonText}>Next</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {isPreviewVisible && selectedImage && (
          <View
            style={[
              styles.previewContainer,
              { backgroundColor: isDarkMode ? '#000' : '#fff' },
            ]}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
              <View
                style={[
                  styles.previewHeader,
                  { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsPreviewVisible(false)
                    setCaption('')
                    setHashtags([])
                    setHashtagsInput('')
                  }}
                  style={styles.headerButton}>
                  <Icon
                    name='chevron-back'
                    size={24}
                    color={isDarkMode ? '#fff' : '#333'}
                  />
                  <Text
                    style={[
                      styles.headerButtonText,
                      { color: isDarkMode ? '#fff' : '#333' },
                    ]}>
                    Back
                  </Text>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.previewTitle,
                    { color: isDarkMode ? '#fff' : '#333' },
                  ]}>
                  Create Post
                </Text>

                <TouchableOpacity
                  onPress={
                    selectedMediaType === 'video'
                      ? handleVideoTrim
                      : handleCropImage
                  }
                  style={styles.headerButton}>
                  <Icon
                    name={selectedMediaType === 'video' ? 'cut' : 'crop'}
                    size={20}
                    color={isDarkMode ? '#fff' : '#333'}
                  />
                  <Text
                    style={[
                      styles.headerButtonText,
                      { color: isDarkMode ? '#fff' : '#333' },
                    ]}>
                    {selectedMediaType === 'video' ? 'Trim' : 'Crop'}
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.previewContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'
                contentContainerStyle={{ paddingBottom: 250 }}>
                {renderPreviewMedia()}

                <View
                  style={[
                    styles.captionContainer,
                    { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
                  ]}>
                  <View style={styles.captionHeader}>
                    <Icon
                      name='create-outline'
                      size={20}
                      color={isDarkMode ? '#fff' : '#333'}
                    />
                    <Text
                      style={[
                        styles.captionTitle,
                        { color: isDarkMode ? '#fff' : '#333' },
                      ]}>
                      Write a caption
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.captionInputContainer,
                      {
                        backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                        borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
                      },
                    ]}>
                    <TextInput
                      style={[
                        styles.captionInput,
                        { color: isDarkMode ? '#fff' : '#333' },
                      ]}
                      placeholder="What's on your mind?"
                      placeholderTextColor={isDarkMode ? '#888' : '#666'}
                      value={caption}
                      onChangeText={setCaption}
                      multiline
                      maxLength={2200}
                      textAlignVertical='top'
                      autoCorrect={true}
                      spellCheck={true}
                    />
                  </View>

                  <View style={styles.captionFooter}>
                    <Text
                      style={[
                        styles.characterCount,
                        { color: isDarkMode ? '#888' : '#666' },
                      ]}>
                      {caption.length}/2200
                    </Text>
                    <View style={styles.captionActions}>
                      <TouchableOpacity style={styles.emojiButton}>
                        <Icon
                          name='happy-outline'
                          size={20}
                          color={isDarkMode ? '#888' : '#666'}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.tagButton}>
                        <Icon
                          name='pricetag-outline'
                          size={20}
                          color={isDarkMode ? '#888' : '#666'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Hashtag Section */}
                <View
                  style={[
                    styles.captionContainer,
                    { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' },
                  ]}>
                  <View style={styles.captionHeader}>
                    <Icon
                      name='pricetag'
                      size={20}
                      color={isDarkMode ? '#fff' : '#333'}
                    />
                    <Text
                      style={[
                        styles.captionTitle,
                        { color: isDarkMode ? '#fff' : '#333' },
                      ]}>
                      Type hashtags
                    </Text>
                  </View>

                  {/* Display added hashtags */}
                  {hashtags.length > 0 && (
                    <View style={styles.hashtagsDisplay}>
                      {hashtags.map((tag, index) => (
                        <View
                          key={index}
                          style={[
                            styles.hashtagChip,
                            { backgroundColor: isDarkMode ? '#2a2a2a' : '#e8f4ff' },
                          ]}>
                          <Text
                            style={[
                              styles.hashtagText,
                              { color: isDarkMode ? '#fff' : '#1e90ff' },
                            ]}>
                            #{tag}
                          </Text>
                          <TouchableOpacity onPress={() => removeTag(tag)}>
                            <Icon name='close-circle' size={18} color='#ff4444' />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  <Row style={{ width: '100%', gap: 10, alignItems: 'center' }}>
                    <View
                      style={[
                        styles.captionInputContainer,
                        {
                          borderWidth: 1,
                          borderRadius: 12,
                          padding: 3,
                          minHeight: 48,
                          flex: 1,
                        },
                        {
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                          borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
                        },
                      ]}>
                      <TextInput
                        style={[
                          styles.captionInput,
                          { color: isDarkMode ? '#fff' : '#333' },
                        ]}
                        placeholder="Enter hashtags"
                        placeholderTextColor={isDarkMode ? '#888' : '#666'}
                        value={hashtagsInput}
                        onChangeText={(text) => {
                          setHashtagsInput(text)
                          SearchTags(text)
                        }}
                        maxLength={100}
                        textAlignVertical='center'
                        autoCorrect={false}
                        spellCheck={false}
                      />
                    </View>

                    <TouchableOpacity
                      style={{
                        backgroundColor: '#12208B',
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                      }}
                      onPress={() => addHashtag(hashtagsInput)}>
                      <CustomText
                        style={{
                          fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                        }}>
                        Add
                      </CustomText>
                    </TouchableOpacity>
                  </Row>

                  {/* Suggestions dropdown */}
                  {suggestions.length > 0 && (
                    <View
                      style={[
                        styles.suggestionsContainer,
                        {
                          backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                          borderColor: isDarkMode ? '#3a3a3a' : '#e1e5e9',
                        },
                      ]}>
                      <ScrollView
                        style={{ maxHeight: 150 }}
                        nestedScrollEnabled={true}>
                        {suggestions.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.suggestionItem}
                            onPress={() => addHashtag(item.Tag)}>
                            <Text
                              style={[
                                styles.suggestionText,
                                { color: isDarkMode ? '#fff' : '#333' },
                              ]}>
                              #{item.Tag}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View
                style={[
                  styles.postButtonContainer,
                  {
                    backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa',
                    borderTopColor: isDarkMode ? '#333' : '#e1e5e9',
                  },
                ]}>
                <TouchableOpacity
                  onPress={handlePostStory}
                  disabled={!selectedImage}>
                  <LinearGradient
                    colors={['#FC14CB', '#4F52FE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      { borderRadius: 8 },
                      styles.postBtn,
                      { opacity: selectedImage ? 1 : 0.5 },
                    ]}>
                    <Icon
                      name='send'
                      size={18}
                      color='#fff'
                      style={styles.postIcon}
                    />
                    <Text style={styles.postText}>
                      Share {selectedMediaType === 'video' ? 'Video' : 'Post'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default GalleryForAddPost

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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  activeTab: {
    elevation: 2,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#4F52FE',
  },
  tabText: {
    fontSize: 16,
    fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    marginLeft: 8,
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
  cameraText: {
    color: '#fff',
    fontSize: 10,
    marginTop: 4,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
  },
  imageTile: {
    width: imageSize,
    height: 170,
    margin: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  selectedTile: {
    borderWidth: 3,
    borderColor: '#1e90ff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  videoPreviewContainer: {
    padding: 16,
  },
  previewVideo: {
    width: width - 32,
    height: width - 32,
    borderRadius: 16,
    backgroundColor: '#000',
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
  hashtagsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  hashtagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  hashtagText: {
    fontSize: 14,
    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
  },
  suggestionsContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: FONTS_FAMILY.OpenSans_Condensed_SemiBold,
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
    fontSize: 19,
    fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    fontWeight: '600',
  },
})