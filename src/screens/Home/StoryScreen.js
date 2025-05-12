
// import React, { useEffect, useRef, useState } from 'react';
// import { View, Image, Animated, Dimensions, StyleSheet, Text } from 'react-native';
// import CustomText from '../../components/TextComponent';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import Row from '../../components/wrapper/row';

// const { width, height } = Dimensions.get('window');

// const StoryScreen = ({ route, navigation }) => {
//     const storyImage = route.params?.storyImage || [];
//     console.log(route?.params?.User, "+++++++++++++++++++++++++++");



//     const [currentIndex, setCurrentIndex] = useState(0);
//     const progressBars = useRef(storyImage.map(() => new Animated.Value(0))).current;

//     useEffect(() => {
//         if (currentIndex >= storyImage.length) {
//             navigation.goBack();
//             return;
//         }

//         Animated.timing(progressBars[currentIndex], {
//             toValue: 1,
//             duration: 5000,
//             useNativeDriver: false,
//         }).start(() => {
//             setCurrentIndex((prev) => prev + 1);
//         });
//     }, [currentIndex]);

//     if (storyImage.length === 0) {
//         return (
//             <View style={styles.container}>
//                 <Text style={{ color: 'white' }}>No Story to Show</Text>
//             </View>
//         );
//     }

//     const getTimeAgo = (dateString) => {
//         const date = new Date(dateString);
//         const now = new Date();
//         const diffInSeconds = Math.floor((now - date) / 1000);

//         if (diffInSeconds < 60) {
//             return `${diffInSeconds}s`;
//         } else if (diffInSeconds < 3600) {
//             const minutes = Math.floor(diffInSeconds / 60);
//             return `${minutes}m`;
//         } else if (diffInSeconds < 86400) {
//             const hours = Math.floor(diffInSeconds / 3600);
//             return `${hours}h`;
//         } else {
//             const days = Math.floor(diffInSeconds / 86400);
//             return `${days}d`;
//         }
//     };


//     return (
//         <View style={styles.container}>
//             {/* Progress Bars */}
//             <View style={styles.progressContainer}>
//                 {progressBars.map((animVal, index) => (
//                     <View key={index} style={styles.progressBarBackground}>
//                         <Animated.View
//                             style={[
//                                 styles.progressBarFill,
//                                 {
//                                     width: animVal.interpolate({
//                                         inputRange: [0, 1],
//                                         outputRange: ['0%', '100%'],
//                                     }),
//                                 },
//                             ]}
//                         />
//                     </View>
//                 ))}
//             </View>

//             <View>

//                 {route?.params?.User && <View style={{
//                     // marginTop:100,
//                     position: 'absolute',
//                     top: 70,
//                     left: 15
//                 }}>
//                     <Row style={{
//                         gap:10
//                     }}>
//                         <CustomText
//                             style={{
//                                 // color:'red'
//                                 fontFamily: FONTS_FAMILY.SourceSans3_Medium
//                             }}
//                         >{route?.params?.User?.FullName}</CustomText>
//                         <CustomText
//                             style={{
//                                 // color:'red'
//                                 fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//                                 fontSize:14
//                             }}
//                         >  {getTimeAgo(storyImage[currentIndex]?.createdAt)}</CustomText>
//                     </Row>
//                 </View>}

//                 {/* Story Image */}
//                 <Image
//                     source={{ uri: storyImage[currentIndex]?.media }}
//                     style={styles.storyImage}
//                     resizeMode="contain"
//                 />
//             </View>
//         </View>
//     );
// };

// export default StoryScreen;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'black',
//     },
//     progressContainer: {
//         position: 'absolute',
//         top: 42,
//         left: 10,
//         right: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         gap: 5,
//         height: 2,
//     },
//     progressBarBackground: {
//         flex: 1,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         borderRadius: 5,
//         overflow: 'hidden',
//     },
//     progressBarFill: {
//         height: 2,
//         backgroundColor: 'white',
//     },
//     storyImage: {
//         width: 300,
//         height: 300,
//         alignSelf: 'center',
//         top: 200
//     },
// });


import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    Pressable,
} from 'react-native';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import Row from '../../components/wrapper/row';

const { width } = Dimensions.get('window');

const StoryScreen = ({ route, navigation }) => {
    const storyImage = route.params?.storyImage || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const progressBars = useRef(storyImage.map(() => new Animated.Value(0))).current;
    const animation = useRef(null);

    useEffect(() => {
        if (currentIndex >= storyImage.length) {
            navigation.goBack();
            return;
        }

        resetAllProgress();
        fillPreviousProgress();
        animateCurrent();

        return () => {
            animation.current?.stop();
        };
    }, [currentIndex]);

    const resetAllProgress = () => {
        progressBars.forEach((bar, index) => {
            if (index > currentIndex) {
                bar.setValue(0);
            } else if (index < currentIndex) {
                bar.setValue(1);
            }
        });
    };

    const fillPreviousProgress = () => {
        if (currentIndex < progressBars.length) {
            progressBars[currentIndex].setValue(0);
        }
    };

    const animateCurrent = () => {
        if (currentIndex >= storyImage.length) return;

        animation.current?.stop();

        animation.current = Animated.timing(progressBars[currentIndex], {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
        });

        if (!isPaused) {
            animation.current.start(({ finished }) => {
                if (finished) {
                    setCurrentIndex((prev) => prev + 1);
                }
            });
        }
    };

    const pause = () => {
        setIsPaused(true);
        animation.current?.stop();
    };

    const resume = () => {
        if (isPaused) {
            setIsPaused(false);
            animateCurrent();
        }
    };

    const goToNext = () => {
        animation.current?.stop();
        setCurrentIndex((prev) => {
            if (prev < storyImage.length - 1) return prev + 1;
            navigation.goBack();
            return prev;
        });
    };

    const goToPrevious = () => {
        animation.current?.stop();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : 0));
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        return `${Math.floor(diffInSeconds / 86400)}d`;
    };

    if (storyImage.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>No Story to Show</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Progress Bars */}
            <View style={styles.progressContainer}>
                {progressBars.map((animVal, index) => (
                    <View key={index} style={styles.progressBarBackground}>
                        <Animated.View
                            style={[
                                styles.progressBarFill,
                                {
                                    width: animVal.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]}
                        />
                    </View>
                ))}
            </View>

            {/* Touchable Zones */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Pressable
                    style={{ flex: 1 }}
                    onPress={goToPrevious}
                    onLongPress={pause}
                    onPressOut={resume}
                />
                <Image
                    source={{ uri: storyImage[currentIndex]?.media }}
                    style={styles.storyImage}
                    resizeMode="contain"
                />
                <Pressable
                    style={{ flex: 1 }}
                    onPress={goToNext}
                    onLongPress={pause}
                    onPressOut={resume}
                />
            </View>

            {/* User Info */}
            {route?.params?.User && (
                <View style={{ position: 'absolute', top: 70, left: 15 }}>
                    <Row style={{ gap: 10 }}>
                        <CustomText style={{ fontFamily: FONTS_FAMILY.SourceSans3_Medium }}>
                            {route?.params?.User?.FullName}
                        </CustomText>
                        <CustomText style={{ fontFamily: FONTS_FAMILY.SourceSans3_Regular, fontSize: 14 }}>
                            {getTimeAgo(storyImage[currentIndex]?.createdAt)}
                        </CustomText>
                    </Row>
                </View>
            )}

            {/* Story Image */}

        </View>
    );
};

export default StoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    progressContainer: {
        position: 'absolute',
        top: 42,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        height: 2,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 2,
        backgroundColor: 'white',
    },
    storyImage: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        // top: 200,
    },
});
