import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Image,
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    Pressable,
    StatusBar,
    SafeAreaView,
    ImageBackground,
} from 'react-native';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import Row from '../../components/wrapper/row';

const { width, height } = Dimensions.get('window');

const StoryScreen = ({ route, navigation }) => {
    const storyImage = (route.params?.storyImage || []).slice().reverse();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const progressBars = useRef(storyImage.map(() => new Animated.Value(0))).current;
    const animation = useRef(null);

    console.log(route.params);
    

    useEffect(() => {
        if (currentIndex >= storyImage.length) {
            navigation.goBack();
            return;
        }

        resetAllProgress();
        fillPreviousProgress();
        setImageLoaded(false);
    }, [currentIndex]);

    useEffect(() => {
        if (imageLoaded && !isPaused) {
            animateCurrent();
        }

        return () => {
            animation.current?.stop();
        };
    }, [imageLoaded, isPaused]);

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

        animation.current.start(({ finished }) => {
            if (finished) {
                setCurrentIndex((prev) => prev + 1);
            }
        });
    };

    const pause = () => {
        setIsPaused(true);
        animation.current?.stop();
    };

    const resume = () => {
        setIsPaused(false);
        if (imageLoaded) {
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

    const currentStory = storyImage[currentIndex];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="black" />
            
            {/* Story Image Background */}
            <ImageBackground
                source={{ uri: currentStory?.media }}
                style={styles.backgroundImage}
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
            >
                {/* Overlay for better text readability */}
                <View style={styles.overlay} />
                
                {/* Safe Area for content */}
                <SafeAreaView style={styles.safeArea}>
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

                    {/* User Info Header */}
                    {route?.params?.User && (
                        <View style={styles.userInfoContainer}>
                            <Row style={styles.userInfoRow}>
                                <View style={styles.userAvatar}>
                                    <Image
                                        source={{ uri: route.params.User.Image || 'https://via.placeholder.com/40' }}
                                        style={styles.avatarImage}
                                    />
                                </View>
                                <View style={styles.userTextContainer}>
                                    <CustomText style={styles.userName}>
                                        {route.params.User.FullName}
                                    </CustomText>
                                    <CustomText style={styles.timeAgo}>
                                        {getTimeAgo(currentStory?.createdAt)}
                                    </CustomText>
                                </View>
                            </Row>
                            
                            {/* Close Button */}
                            <Pressable 
                                style={styles.closeButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Story Content Container */}
                    <View style={styles.storyContent}>
                        <Image
                            source={{ uri: currentStory?.media }}
                            style={styles.storyImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Touchable Zones for Navigation - MOVED TO BOTTOM */}
                    <View style={styles.touchableContainer}>
                        <Pressable
                            style={styles.leftTouchable}
                            onPress={goToPrevious}
                            onLongPress={pause}
                            onPressOut={resume}
                            delayLongPress={200}
                        />
                        <Pressable
                            style={styles.rightTouchable}
                            onPress={goToNext}
                            onLongPress={pause}
                            onPressOut={resume}
                            delayLongPress={200}
                        />
                    </View>

                    {/* Bottom Actions (Optional) */}
                    <View style={styles.bottomActions}>
                        {/* Add your bottom actions here like reply, share etc. */}
                    </View>
                </SafeAreaView>
            </ImageBackground>
        </View>
    );
};

export default StoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        // marginTop:40
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        marginTop:40

    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    progressContainer: {
        position: 'absolute',
        top: 20,
        left: 15,
        right: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 2,
        height: 2,
        zIndex: 10,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 1,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 1,
    },
    userInfoContainer: {
        position: 'absolute',
        top: 35,
        left: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    userInfoRow: {
        alignItems: 'center',
        gap: 12,
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    userTextContainer: {
        flex: 1,
    },
    userName: {
        fontFamily: FONTS_FAMILY.SourceSans3_Medium,
        color: 'white',
        fontSize: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    timeAgo: {
        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    touchableContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        zIndex: 5,
    },
    leftTouchable: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    rightTouchable: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    storyContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingBottom: 50,
    },
    storyImage: {
        width: width,
        height: height * 0.75,
        maxWidth: '100%',
        maxHeight: '100%',
    },
    bottomActions: {
        position: 'absolute',
        bottom: 30,
        left: 15,
        right: 15,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});