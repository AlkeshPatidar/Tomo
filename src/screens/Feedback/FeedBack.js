// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   ScrollView,
// } from 'react-native';

// import { useSelector } from 'react-redux';
// // import { BackIcon } from '../assets/SVGs';
// // import SpaceBetweenRow from '../components/wrapper/spacebetween';
// // import CustomText from '../components/TextComponent';
// // import { FONTS_FAMILY } from '../assets/Fonts';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import { BackIcon, PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import CustomText from '../../components/TextComponent';

// const FeedBack = ({ navigation }) => {
//   const { isDarkMode } = useSelector(state => state.theme);

//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
//     },
//     headerContainer: {
//       backgroundColor: isDarkMode ? '#252525' : 'white',
//       paddingTop: 50,
//       paddingBottom: 15,
//     },
//     contentContainer: {
//       padding: 16,
//       backgroundColor: isDarkMode ? '#121212' : 'white',
//       margin: 8,
//       borderRadius: 8,
//     },
//     backButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//     },
//     headerTitle: {
//       fontSize: 20,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//       marginLeft: 10,
//     },
//     title: {
//       fontSize: 24,
//       fontFamily: FONTS_FAMILY.SourceSans3_Bold,
//       color: isDarkMode ? 'white' : 'black',
//       marginBottom: 20,
//     },

//   });

//   const renderHeader = () => {
//     return (
//       <View style={styles.headerContainer}>
//         <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
//           <View style={styles.backButton}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
//             </TouchableOpacity>
//             <CustomText style={styles.headerTitle}>Feed Back</CustomText>
//           </View>
//         </SpaceBetweenRow>
//       </View>
//     );
//   };

//   const renderBulletPoint = (text) => {
//     return (
//       <View style={styles.bullet}>
//         <CustomText style={styles.bulletDot}>•</CustomText>
//         <CustomText style={styles.bulletText}>{text}</CustomText>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar
//         translucent={true}
//         backgroundColor="transparent"
//         barStyle={isDarkMode ? "light-content" : "dark-content"}
//       />

//       {renderHeader()}


//     </View>
//   );
// };

// export default FeedBack;

import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    TextInput,
    ActivityIndicator,
    Text,
} from 'react-native';
import { useSelector } from 'react-redux';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import { apiPost } from '../../utils/Apis';
import { ToastMsg } from '../../utils/helperFunctions';
import LinearGradient from 'react-native-linear-gradient';

const FeedBack = ({ navigation }) => {
    const { isDarkMode } = useSelector(state => state.theme);

    const categories = {
        "App Performance": [
            "Loading Speed",
            "App Crashes",
            "Notification Issues",
            "Slow Image/Video Rendering",
            "Login/Signup Problems",
            "Other"
        ],
        "User Interface & Design": [
            "Navigation/Layout",
            "Profile Page Design",
            "Home Feed Layout",
            "Buttons/Icons Not Clear",
            "Dark/Light Mode Preferences",
            "Other"
        ],
        "Content & Feed Relevance": [
            "Irrelevant Posts",
            "Too Many Ads",
            "Not Enough Car Content",
            "Repetitive Recommendations",
            "Missing Regions/Brands in Feed",
            "Other"
        ],
        "Car Profile & Vehicle Data": [
            "Add/Remove Car Details",
            "Difficulty Uploading Photos",
            "Missing Car Brands/Models",
            "Wrong Specs Shown",
            "Need More Customization Options",
            "Other"
        ],
        "Social & Community Features": [
            "Comments/Replies",
            "Follow/Unfollow Issues",
            "Messaging/DM Problems",
            "Groups/Communities",
            "Reporting/Blocking Users",
            "Other"
        ],
        "Business Listings (India focus)": [
            "Wrong Business Info",
            "Missing Workshops/Detailers",
            "Difficult to Contact Vendor",
            "Need More Categories",
            "Location/Map Issues",
            "Other"
        ],
        "Navigation Tools (Germany focus)": [
            "TUV Locator Issues",
            "Map Accuracy",
            "Missing Centers",
            "Slow Location Detection",
            "Wrong Distance Shown",
            "Other"
        ],
        "Media Uploads": [
            "Photo Quality Loss",
            "Video Not Uploading",
            "Audio Not Working",
            "Slow Uploads",
            "Gallery Permissions Issues",
            "Other"
        ],
        "Notifications & Privacy": [
            "Too Many Notifications",
            "Missing Important Alerts",
            "Privacy Settings Confusing",
            "Account Security Issues",
            "Data Sharing Concerns",
            "Other"
        ],
        "Things I DON'T Want in the App": [
            "Too Many Ads",
            "Complicated UI",
            "Unnecessary Features",
            "Forced Permissions",
            "Irrelevant Pop-ups",
            "Other"
        ]
    };

    const [answers, setAnswers] = useState({});
    const [otherTexts, setOtherTexts] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [country, setCountry] = useState("");

    useEffect(() => {
        const fetchCountry = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                const data = await res.json();
                setCountry(data?.country_name || "Unknown");
            } catch (error) {
                console.error("Country fetch failed:", error);
                setCountry("Unknown");
            }
        };

        fetchCountry();
    }, []);

    const handleSelect = (category, sub) => {
        setAnswers({ ...answers, [category]: sub });

        if (sub !== "Other") {
            setOtherTexts({ ...otherTexts, [category]: "" });
        }
    };

    const handleSubmit = async () => {
        const formatted = Object.keys(answers)?.map((cat) => ({
            Category: cat,
            SubCategory: answers[cat],
            Other: answers[cat] === "Other" ? otherTexts[cat] : null
        }));

        try {
            setIsUploading(true);
            if (formatted.length === 0) {
                // Replace with react-native-toast-message if needed
                ToastMsg("Please select at least one Feedback");
                setIsUploading(false);
                return;
            }
            const Data = {
                Country: country,
                Feedback: formatted
            };
            const response = await apiPost("/api/user/UserCreateFeedback", Data);
            if (response?.statusCode === 200) {
                setIsUploading(false);
                ToastMsg(response?.message || "Feedback submitted successfully");
                navigation.goBack();
            } else {
                setIsUploading(false);
                console.error("Failed to submit feedback");
            }
        } catch (error) {
            setIsUploading(false);
            console.error('Error submitting feedback:', error);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
        },
        headerContainer: {
            backgroundColor: isDarkMode ? '#252525' : 'white',
            paddingTop: 50,
            paddingBottom: 15,
        },
        backButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
            marginLeft: 10,
        },
        scrollContent: {
            padding: 16,
        },
        formTitle: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : '#1f2937',
            marginBottom: 16,
        },
        categoryCard: {
            backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: isDarkMode ? '#333' : '#e5e7eb',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        categoryTitle: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: isDarkMode ? 'white' : '#374151',
            marginBottom: 12,
        },
        optionRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        radioOuter: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: isDarkMode ? '#666' : '#9ca3af',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
        },
        radioOuterSelected: {
            borderColor: '#1DA1F2',
        },
        radioInner: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#1DA1F2',
        },
        optionText: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? '#d1d5db' : '#374151',
            flex: 1,
        },
        otherInput: {
            marginTop: 8,
            borderWidth: 1,
            borderColor: isDarkMode ? '#444' : '#d1d5db',
            borderRadius: 6,
            padding: 10,
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Regular,
            color: isDarkMode ? 'white' : 'black',
            backgroundColor: isDarkMode ? '#2a2a2a' : 'white',
        },
        submitButton: {
            marginTop: 8,
            marginBottom: 32,
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1DA1F2',
        },
        submitButtonDisabled: {
            opacity: 0.6,
        },
        submitButtonText: {
            fontSize: 16,
            fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
            color: 'white',
        },
        postBtn: {
            backgroundColor: '#1e90ff',
            paddingVertical: 12,
            paddingHorizontal: 20,
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
        postText: {
            color: '#fff',
            fontSize: 19,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            fontWeight: '600',
        },
    });

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
                    <View style={styles.backButton}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
                        </TouchableOpacity>
                        <CustomText style={styles.headerTitle}>Feed Back</CustomText>
                    </View>
                </SpaceBetweenRow>
            </View>
        );
    };

    const renderRadioButton = (category, option) => {
        const isSelected = answers[category] === option;
        return (
            <TouchableOpacity
                key={option}
                style={styles.optionRow}
                onPress={() => handleSelect(category, option)}
                activeOpacity={0.7}
            >
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                </View>
                <CustomText style={styles.optionText}>{option}</CustomText>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />

            {renderHeader()}

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <CustomText style={styles.formTitle}>
                    Tomo Feedback Form
                </CustomText>

                {Object.keys(categories).map((category, index) => (
                    <View key={index} style={styles.categoryCard}>
                        <CustomText style={styles.categoryTitle}>
                            {index + 1}. {category}
                        </CustomText>

                        {categories[category].map((option) => renderRadioButton(category, option))}

                        {answers[category] === "Other" && (
                            <TextInput
                                style={styles.otherInput}
                                placeholder="Write your suggestion..."
                                placeholderTextColor={isDarkMode ? '#666' : '#9ca3af'}
                                value={otherTexts[category] || ""}
                                onChangeText={(text) =>
                                    setOtherTexts({
                                        ...otherTexts,
                                        [category]: text
                                    })
                                }
                                multiline
                            />
                        )}
                    </View>
                ))}

                {/* <TouchableOpacity
          style={[styles.submitButton, isUploading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isUploading}
          activeOpacity={0.8}
        >
          {isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <CustomText style={styles.submitButtonText}>
              Submit Feedback
            </CustomText>
          )}
        </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isUploading}
                >
                    <LinearGradient
                        colors={['#FC14CB', '#4F52FE']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            { borderRadius: 8 },
                            styles.postBtn,
                        ]}>
                        {isUploading ? (
                            <ActivityIndicator color="white" />
                        ) :
                            <Text style={styles.postText}>
                                Submit Feedback
                            </Text>}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default FeedBack;