// import React, { useEffect, useRef, useState } from 'react';
// import { View, Image, Animated, Dimensions } from 'react-native';

// const { width } = Dimensions.get('window');

// const StoryScreen = ({ route, navigation }) => {
//     const { storyImage } = route.params; // Pass image URL via navigation
//     const progress = useRef(new Animated.Value(0)).current;
//     const [isFinished, setIsFinished] = useState(false);

//     console.log('ROUT E PARAMS', storyImage[0]);


//     useEffect(() => {
//         Animated.timing(progress, {
//             toValue: 1,
//             duration: 5000, // Adjust duration for the progress bar
//             useNativeDriver: false,
//         }).start(() => {
//             setIsFinished(true);
//         });
//     }, []);

//     useEffect(() => {
//         if (isFinished) {
//             navigation.goBack(); // Close story after progress completes
//         }
//     }, [isFinished]);

//     return (
//         <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
//             {/* Progress Bar */}
//             <View style={{ position: 'absolute', top: 40, width: '90%', height: 3, backgroundColor: 'gray', borderRadius: 5 }}>
//                 <Animated.View style={{ height: 3, width: progress.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: ['0%', '100%'],
//                 }), backgroundColor: 'white' }} />
//             </View>

//             {/* Story Image */}
//             <Image source={{ uri: storyImage[0]?.media }} style={{ width, height: '90%', resizeMode: 'contain' }} />
//         </View>
//     );
// };

// export default StoryScreen;

import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, Dimensions, StyleSheet, Text } from 'react-native';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import Row from '../../components/wrapper/row';

const { width, height } = Dimensions.get('window');

const StoryScreen = ({ route, navigation }) => {
    const storyImage = route.params?.storyImage || [];
    console.log(route?.params?.User, "+++++++++++++++++++++++++++");



    const [currentIndex, setCurrentIndex] = useState(0);
    const progressBars = useRef(storyImage.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        if (currentIndex >= storyImage.length) {
            navigation.goBack();
            return;
        }

        Animated.timing(progressBars[currentIndex], {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false,
        }).start(() => {
            setCurrentIndex((prev) => prev + 1);
        });
    }, [currentIndex]);

    if (storyImage.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>No Story to Show</Text>
            </View>
        );
    }

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d`;
        }
    };


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

            <View>

                {route?.params?.User && <View style={{
                    // marginTop:100,
                    position: 'absolute',
                    top: 70,
                    left: 15
                }}>
                    <Row style={{
                        gap:10
                    }}>
                        <CustomText
                            style={{
                                // color:'red'
                                fontFamily: FONTS_FAMILY.SourceSans3_Medium
                            }}
                        >{route?.params?.User?.FullName}</CustomText>
                        <CustomText
                            style={{
                                // color:'red'
                                fontFamily: FONTS_FAMILY.SourceSans3_Regular,
                                fontSize:14
                            }}
                        >  {getTimeAgo(storyImage[currentIndex]?.createdAt)}</CustomText>
                    </Row>
                </View>}

                {/* Story Image */}
                <Image
                    source={{ uri: storyImage[currentIndex]?.media }}
                    style={styles.storyImage}
                    resizeMode="cover"
                />
            </View>
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
        top: 40,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 5,
        height: 4,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 4,
        backgroundColor: 'white',
    },
    storyImage: {
        width: 300,
        height: 300,
        alignSelf: 'center',
        top: 200
    },
});
