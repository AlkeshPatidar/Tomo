


// import React, { useEffect, useRef, useState } from "react";
// import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import Row from "../../components/wrapper/row";
// import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn, SubmitBtn, Upload } from "../../assets/SVGs";
// import { FONTS_FAMILY } from "../../assets/Fonts";
// import CustomInputField from "../../components/CustomInputField";
// import { useSelector } from "react-redux";
// import { apiPost, BASE_URL, getItem } from "../../utils/Apis";
// import useLoader from "../../utils/LoaderHook";
// import urls from "../../config/urls";
// import { ToastMsg } from "../../utils/helperFunctions";
// import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
// import { launchImageLibrary } from 'react-native-image-picker';
// import { Platform, PermissionsAndroid } from 'react-native';
// import axios from "axios";

// const AddShops = ({ navigation }) => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const slideAnim = useRef(new Animated.Value(300)).current;

//     const [fileName, setFileName] = useState({});
//     const [shopName, setShopName] = useState(null);
//     const [shopAddress, setShopAddress] = useState(null);
//     const [shopServices, setShopServices] = useState(null);
//     const [location, setLocation] = useState(null);






//     useEffect(() => {
//         Animated.timing(slideAnim, {
//             toValue: 0,
//             duration: 500,
//             useNativeDriver: true,
//         }).start();
//     }, []);

//     const [userInfo, setUserInfor] = useState({})


//     const { showLoader, hideLoader } = useLoader()


//     const onSubmit = async () => {
//         console.log('--------', fileName);

//         try {
//             const token = await getItem('token');
//             showLoader();

//             if (!fileName || !fileName.uri) {
//                 ToastMsg('No file selected');
//                 hideLoader();
//                 return;
//             }

//             const formData = new FormData();
//             formData.append("Image", {
//                 uri: Platform.OS === "android" ? fileName.uri : fileName.uri.replace('file://', ''),
//                 type: fileName.type || "application/octet-stream",
//                 name: fileName.fileName || fileName.name || "upload.pdf",
//             });

//             formData.append("Name", shopName);
//             formData.append("Address", shopAddress);
//             formData.append("Services", shopServices);
//             formData.append("Location", '[75.8577,22.7196]"');




//             const response = await fetch(
//                 `${BASE_URL}/api/user/CreateShop`,
//                 {
//                     method: "POST",
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                     },
//                     body: formData,
//                 }
//             );
//             const result = await response.json();
//             ToastMsg(result?.message);
//             navigation.goBack()
//             hideLoader();

//         } catch (error) {
//             hideLoader();
//             console.log('Upload Failed:', error?.response?.data || error.message);
//         }
//     };





//     const handleFilePick = () => {
//         const options = {
//             mediaType: 'photo', // photo only
//             selectionLimit: 1,
//         };

//         launchImageLibrary(options, (response) => {
//             if (response.didCancel) {
//                 console.log('User cancelled image picker');
//             } else if (response.errorMessage) {
//                 console.error('Image Picker Error:', response.errorMessage);
//             } else {
//                 const asset = response.assets[0];
//                 setFileName({
//                     uri: asset.uri,
//                     type: asset.type,
//                     name: asset.fileName,
//                 });
//             }
//         });
//     };




//     const renderHeader = () => {
//         return (
//             <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
//                 <Row>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         {isDarkMode ? <BackOuterWhite /> : <Back />}
//                     </TouchableOpacity>
//                     <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText>
//                 </Row>
//                 <CustomText style={{
//                     fontSize: 18,
//                     fontFamily: FONTS_FAMILY.SourceSans3_Bold
//                 }}>Add Shop</CustomText>
//             </Row>
//         )
//     }

//     const renderItems = () => {
//         return (
//             <Animated.View style={{
//                 transform: [{ translateX: slideAnim }],
//                 marginTop: 30,
//                 backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
//                 flexGrow: 1,
//                 padding: 20,
//                 borderTopLeftRadius: 30,
//                 borderTopRightRadius: 30
//             }}>
//                 <ScrollView contentContainerStyle={{ paddingBottom: 100 }}
//                     showsVerticalScrollIndicator={false}
//                 >
//                     <View style={{ marginTop: 15, alignItems: 'center', gap: 10 }}>
//                         <CustomInputField
//                             placeholder={'Enter'}
//                             // icon={<Upload />}
//                             // editable={false}
//                             label={'Shop Name'}
//                             value={shopName}
//                             onChangeText={setShopName}
//                         />
//                         <CustomInputField
//                             placeholder={'Shop Address'}
//                             // icon={<Upload />}
//                             // editable={false}
//                             label={'Shop Address'}
//                             value={shopAddress}
//                             onChangeText={setShopAddress}
//                         />
//                         <CustomInputField
//                             placeholder={'Shop Service'}
//                             // icon={<Upload />}
//                             // editable={false}
//                             label={'Shop Service'}
//                             value={shopServices}
//                             onChangeText={setShopServices}
//                         />
//                         <TouchableOpacity onPress={handleFilePick}
//                             style={{
//                                 marginTop: 10
//                             }}
//                         >
//                             <CustomInputField
//                                 placeholder={'Upload '}
//                                 icon={<Upload />}
//                                 editable={false}
//                                 label={'Shop License'}
//                                 lableStyle={true}

//                                 value={fileName?.uri}
//                             // onChangeText={(value) => handleInputChange('Confirm', value)}
//                             />
//                         </TouchableOpacity>



//                         <TouchableOpacity style={{ top: 100 }}
//                             // onPress={() => navigation.navigate('Tab')}
//                             onPress={onSubmit}
//                         >
//                             <SubmitBtn width={380} height={65} />
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>

//                 <BottomIndicator style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }} />
//             </Animated.View>
//         )
//     }

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : 'white'
//         }
//     });

//     return (
//         <ImageBackground source={IMG.bgShadow} style={styles.container}>
//             <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
//             {renderHeader()}
//             {renderItems()}
//         </ImageBackground>
//     )
// }

// export default AddShops;

import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Modal, FlatList } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { Back, BackOuterWhite, BottomIndicator, EmailIcon, EmailWhite, EyeIcon, EyeIconWhite, LockIcon, LockWhite, SignUpbtn, SubmitBtn, Upload } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import { useSelector } from "react-redux";
import { apiPost, BASE_URL, getItem } from "../../utils/Apis";
import useLoader from "../../utils/LoaderHook";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { inValidEmail, inValidPassword } from "../../utils/CheckValidation";
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";

const AddShops = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);
    const slideAnim = useRef(new Animated.Value(300)).current;

    const [fileName, setFileName] = useState({});
    const [shopName, setShopName] = useState(null);
    const [shopServices, setShopServices] = useState(null);

    // Multiple addresses state
    const [addresses, setAddresses] = useState([
        { locationName: '', coordinates: [76.7794, 30.7333] } // Default with static coordinates
    ]);

    // Shop categories state
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Fetch categories on component mount
        fetchCategories();
    }, []);

    // Fetch all shop categories
    const fetchCategories = async () => {
        try {
            const response = await fetch("https://tomo-backend-app.vercel.app/api/admin/GetAllShopCategory", {
                method: "GET",
                redirect: "follow"
            });
            const result = await response.json();
            setAllCategories(result.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            ToastMsg('Failed to load categories');
        }
    };

    // Add new address field
    const addAddressField = () => {
        if (addresses.length < 5) {
            setAddresses([...addresses, { locationName: '', coordinates: [76.7794, 30.7333] }]);
        }
    };

    // Remove address field
    const removeAddressField = (index) => {
        if (addresses.length > 1) {
            const newAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(newAddresses);
        }
    };

    // Update address
    const updateAddress = (index, locationName) => {
        const newAddresses = [...addresses];
        newAddresses[index].locationName = locationName;
        setAddresses(newAddresses);
    };

    // Toggle category selection
    const toggleCategory = (category) => {
        const isSelected = selectedCategories.some(cat => cat._id === category._id);
        if (isSelected) {
            setSelectedCategories(selectedCategories.filter(cat => cat._id !== category._id));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const onSubmit = async () => {
        try {
            const token = await getItem('token');
            showLoader();

            // Validation
            if (!shopName) {
                ToastMsg('Shop name is required');
                hideLoader();
                return;
            }

            if (!fileName || !fileName.uri) {
                ToastMsg('Shop license image is required');
                hideLoader();
                return;
            }

            // Filter out empty addresses and ensure at least one address is provided
            const validAddresses = addresses.filter(addr => addr.locationName.trim() !== '');
            if (validAddresses.length === 0) {
                ToastMsg('At least one address is required');
                hideLoader();
                return;
            }

            if (selectedCategories.length === 0) {
                ToastMsg('Please select at least one category');
                hideLoader();
                return;
            }

            // Prepare address data in the required format (only valid addresses)
            const addressData = validAddresses.map(addr => ({
                LocationName: addr.locationName,
                type: "Point",
                coordinates: addr.coordinates
            }));

            // Prepare category data
            const categoryNames = selectedCategories.map(cat => cat.Name);
            console.log('categoryNames:::::', categoryNames);

            const formData = new FormData();
            formData.append("Image", {
                uri: Platform.OS === "android" ? fileName.uri : fileName.uri.replace('file://', ''),
                type: fileName.type || "application/octet-stream",
                name: fileName.fileName || fileName.name || "upload.pdf",
            });

            formData.append("Name", shopName);
            formData.append("Address", JSON.stringify(addressData));
            formData.append("Services", shopServices);
            formData.append("ShopCategory", JSON.stringify(categoryNames));

            const response = await fetch(
                `${BASE_URL}/api/user/CreateShop`,
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

    const handleFilePick = () => {
        const options = {
            mediaType: 'photo',
            selectionLimit: 1,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.error('Image Picker Error:', response.errorMessage);
            } else {
                const asset = response.assets[0];
                setFileName({
                    uri: asset.uri,
                    type: asset.type,
                    name: asset.fileName,
                });
            }
        });
    };

    const renderHeader = () => {
        return (
            <Row style={{ paddingTop: 50, paddingHorizontal: 20, gap: 70 }}>
                <Row>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {isDarkMode ? <BackOuterWhite /> : <Back />}
                    </TouchableOpacity>
                    {/* <CustomText style={{ fontSize: 16, fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>Back</CustomText> */}
                </Row>
                <CustomText style={{
                    fontSize: 18,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Add Shop</CustomText>
            </Row>
        )
    };

    const renderCategoryModal = () => {
        return (
            <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCategoryModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#252525' : 'white' }]}>
                        <Row style={{ justifyContent: 'space-between', marginBottom: 20 }}>
                            <CustomText style={[styles.modalTitle, { color: isDarkMode ? 'white' : 'black' }]}>
                                Select Categories
                            </CustomText>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <CustomText style={{ color: isDarkMode ? 'white' : 'black', fontSize: 18 }}>×</CustomText>
                            </TouchableOpacity>
                        </Row>

                        <FlatList
                            data={allCategories}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.categoryItem,
                                        {
                                            backgroundColor: selectedCategories.some(cat => cat._id === item._id)
                                                ? (isDarkMode ? '#404040' : '#e3f2fd')
                                                : 'transparent'
                                        }
                                    ]}
                                    onPress={() => toggleCategory(item)}
                                >
                                    <CustomText style={{ color: isDarkMode ? 'white' : 'black' }}>
                                        {item.Name}
                                    </CustomText>
                                    {selectedCategories.some(cat => cat._id === item._id) && (
                                        <CustomText style={{ color: '#2196f3' }}>✓</CustomText>
                                    )}
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#2196f3' }]}
                            onPress={() => setShowCategoryModal(false)}
                        >
                            <CustomText style={{ color: 'white', textAlign: 'center' }}>Done</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };

    const renderItems = () => {
        return (
            <Animated.View style={{
                transform: [{ translateX: slideAnim }],
                marginTop: 30,
                backgroundColor: isDarkMode ? '#252525' : 'rgba(255, 255, 255, 1)',
                flexGrow: 1,
                padding: 20,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30
            }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginTop: 15, alignItems: 'center', gap: 10 }}>
                        <CustomInputField
                            placeholder={'Enter Shop Name'}
                            label={'Shop Name'}
                            value={shopName}
                            onChangeText={setShopName}
                        />

                        {/* Multiple Address Fields */}
                        <View style={{ width: '100%', marginTop: 10 }}>
                            <CustomText style={{
                                fontSize: 16,
                                fontFamily: FONTS_FAMILY.SourceSans3_Medium,
                                color: isDarkMode ? 'white' : 'black',
                                marginBottom: 10
                            }}>
                                Shop Addresses ({addresses.length}/5)
                            </CustomText>

                            {addresses.map((address, index) => (
                                <View key={index} style={{ marginBottom: 10 }}>
                                    <Row style={{ alignItems: 'center', gap: 10 }}>
                                        <View style={{ flex: 1 }}>
                                            <CustomInputField
                                                placeholder={`Address ${index + 1}`}
                                                label={`Address ${index + 1}`}
                                                value={address.locationName}
                                                onChangeText={(text) => updateAddress(index, text)}
                                                 lableStyle={true}
                                            />
                                        </View>
                                        {addresses.length > 1 && (
                                            <TouchableOpacity
                                                onPress={() => removeAddressField(index)}
                                                style={styles.removeButton}
                                            >
                                                <CustomText style={{ color: 'red', fontSize: 18 }}>-</CustomText>
                                            </TouchableOpacity>
                                        )}
                                    </Row>
                                </View>
                            ))}

                            {addresses.length < 5 && (
                                <TouchableOpacity
                                    onPress={addAddressField}
                                    style={styles.addButton}
                                >
                                    <CustomText style={{ color: '#2196f3', textAlign: 'center' }}>
                                        + Add Address
                                    </CustomText>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Shop Categories */}
                        <TouchableOpacity
                            onPress={() => setShowCategoryModal(true)}
                            style={{ width: '100%', marginTop: 10 }}
                        >
                            <CustomInputField
                                placeholder={'Select Categories'}
                                label={'Shop Categories'}
                                value={selectedCategories.map(cat => cat.Name).join(', ')}
                                editable={false}
                                 lableStyle={true}
                            />
                        </TouchableOpacity>

                        <CustomInputField
                            placeholder={'Shop Services'}
                            label={'Shop Services'}
                            value={shopServices}
                            onChangeText={setShopServices}
                        />

                        <TouchableOpacity onPress={handleFilePick}
                            style={{ marginTop: 10 }}
                        >
                            <CustomInputField
                                placeholder={'Upload License'}
                                icon={<Upload />}
                                editable={false}
                                label={'Shop License'}
                                lableStyle={true}
                                value={fileName?.name || fileName?.fileName || (fileName?.uri ? 'File Selected' : '')}
                            />
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={{ top: 30 }}
                            onPress={onSubmit}
                        >
                            <SubmitBtn width={380} height={65} />
                        </TouchableOpacity> */}

                          <TouchableOpacity
                                                    onPress={onSubmit}
                                                >
                                                    <LinearGradient
                                                        // colors={['#ff00ff', '#6a5acd']}
                                                        colors={['#21B7FF', '#0084F8']}
                                                        start={{ x: 1, y: 0 }}
                                                        end={{ x: 1, y: 1 }}
                                                        style={styles.followButton}
                                                    >
                                                        <Text style={[
                                                            styles.followText,
                                                            { color: '#fff' }
                                                        ]}>
                                                            Add shop
                                                        </Text>
                                                    </LinearGradient>
                                                </TouchableOpacity>

                    </View>
                </ScrollView>

            </Animated.View>
        )
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : 'white'
        },
        addButton: {
            borderWidth: 1,
            borderColor: '#2196f3',
            borderStyle: 'dashed',
            borderRadius: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginTop: 10
        },
        removeButton: {
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20
        },
        modalContent: {
            width: '100%',
            maxHeight: '80%',
            borderRadius: 12,
            padding: 20
        },
        modalTitle: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold
        },
        categoryItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginBottom: 8
        },
        modalButton: {
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 20
        },
          followButton: {
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        // marginHorizontal:30
        width:300,
        marginTop:30
    },
    followText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    });

    return (
        <ImageBackground source={IMG.bgShadow} style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
            {renderHeader()}
            {renderItems()}
            {renderCategoryModal()}
        </ImageBackground>
    )
}

export default AddShops;
