



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
    TextInput,
    Modal,
    ScrollView,
    FlatList,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import Row from '../../components/wrapper/row';
import { useSelector } from 'react-redux';
import StoryViewModel from './StoryViewersModel';
import { apiGet, apiPost } from '../../utils/Apis';
import urls from '../../config/urls';
import { ToastMsg } from '../../utils/helperFunctions';



const { width, height } = Dimensions.get('window');

const StoryScreen = ({ route, navigation }) => {
    const storyImage = (route.params?.storyImage || []).slice().reverse();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showViewers, setShowViewers] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [selectedEmoji, setSelectedEmoji] = useState('');
    const [animatedEmojis, setAnimatedEmojis] = useState([]);
    const [storyViewers, setStoryViewers] = useState([]); // Dynamic state for viewers
    const [loadingViewers, setLoadingViewers] = useState(false);
    const progressBars = useRef(storyImage.map(() => new Animated.Value(0))).current;
    const animation = useRef(null);
    const inputRef = useRef(null);

    let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    // Instagram-style emoji reactions
    const emojiReactions = [
        { emoji: '❤️', isSelected: false },
        { emoji: '😂', isSelected: false },
        { emoji: '😮', isSelected: false },
        { emoji: '😢', isSelected: false },
        { emoji: '😍', isSelected: false },
        { emoji: '😡', isSelected: false },
        { emoji: '👏', isSelected: false },
        { emoji: '🔥', isSelected: false },
    ];

    const isMyStory = route.params?.User?._id == selector?._id || false;

    useEffect(() => {
        if (isMyStory && storyImage.length > 0) {
            getStoryViewers();
        }
        else {
            watchStory()
        }
    }, [currentIndex, isMyStory]);

    const getStoryViewers = async () => {
        if (!isMyStory || currentIndex >= storyImage.length) return;

        try {
            setLoadingViewers(true);
            const currentStoryId = storyImage[currentIndex]?._id;

            if (currentStoryId) {
                const res = await apiGet(`${urls?.getStoryViewers}/${currentStoryId}`);

                if (res?.success && res?.data) {
                    setStoryViewers(res.data);
                } else {
                    const currentStoryViewers = storyImage[currentIndex]?.viewers || [];
                    setStoryViewers(currentStoryViewers);
                }
            }
        } catch (error) {
            console.error('Error fetching story viewers:', error);
            const currentStoryViewers = storyImage[currentIndex]?.viewers || [];
            setStoryViewers(currentStoryViewers);
        } finally {
            setLoadingViewers(false);
        }
    };


    const watchStory = async () => {
        try {
            setLoadingViewers(true);
            const currentStoryId = storyImage[currentIndex]?._id;

            if (currentStoryId) {
                const res = await apiGet(`${urls?.watchStory}/${currentStoryId}`);
                console.log(res, '+++++++++++++++++++++++++++++++++++>>>>>>>>>>');

            }
        } catch (error) {
            console.error('Error fetching story viewers:', error);
            const currentStoryViewers = storyImage[currentIndex]?.viewers || [];
            setStoryViewers(currentStoryViewers);
        } finally {
            setLoadingViewers(false);
        }
    };

    // API call for emoji reaction
    const callReactToStoryAPI = async (emoji) => {
        try {
            const currentStoryId = storyImage[currentIndex]?._id;
            if (!currentStoryId) return;

            const payload = {
                emoji: emoji
            };

            const response = await apiPost(`${urls?.reactToStory}/${currentStoryId}`, payload);
            console.log('Emoji reaction sent successfully:', response);

        } catch (error) {
            console.error('Error sending emoji reaction:', error);
        }
    };

    // API call for reply
    const callReplyToStoryAPI = async (message) => {
        try {
            const currentStoryId = storyImage[currentIndex]?._id;
            if (!currentStoryId) return;

            const payload = {
                message: message
            };
            const response = await apiPost(`${urls?.replyOnOthersStory}/${currentStoryId}`, payload);
            console.log('Reply sent successfully:', response);
            ToastMsg("Reply Sent")
        } catch (error) {
            console.error('Error sending reply:', error);
        }
    };

    const AnimatedEmojiReaction = ({ emoji, id, onAnimationComplete }) => {
        const translateY = useRef(new Animated.Value(0)).current;
        const translateX = useRef(new Animated.Value(Math.random() * 100 - 50)).current;
        const opacity = useRef(new Animated.Value(1)).current;
        const scale = useRef(new Animated.Value(0.2)).current;

        useEffect(() => {
            Animated.sequence([
                Animated.spring(scale, {
                    toValue: 1.5,
                    useNativeDriver: true,
                    tension: 200,
                    friction: 3,
                }),
                Animated.parallel([
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 6,
                    }),
                    Animated.timing(translateY, {
                        toValue: -150,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -300,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateX, {
                        toValue: translateX._value + (Math.random() * 20 - 10),
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                setTimeout(() => {
                    onAnimationComplete(id);
                    resume();
                }, 1000);
            });
        }, []);

        return (
            <Animated.View
                style={[
                    styles.animatedEmojiContainer,
                    {
                        transform: [
                            { translateX },
                            { translateY },
                            { scale }
                        ],
                        opacity,
                    },
                ]}
            >
                <Text style={styles.animatedEmojiText}>{emoji}</Text>
            </Animated.View>
        );
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener?.remove();
            keyboardDidHideListener?.remove();
        };
    }, []);

    useEffect(() => {
        if (currentIndex >= storyImage.length) {
            navigation.goBack();
            return;
        }

        setImageLoaded(false);
        resetAllProgress();
        fillPreviousProgress();
    }, [currentIndex]);

    useEffect(() => {
        if (imageLoaded && !isPaused) {
            setTimeout(() => {
                animateCurrent();
            }, 100);
        }

        return () => {
            animation.current?.stop();
        };
    }, [imageLoaded, isPaused, currentIndex]);

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

    const handleSendReply = async () => {
        if (replyText.trim()) {
            console.log('Reply sent:', replyText);

            // Call reply API
            await callReplyToStoryAPI(replyText.trim());

            setReplyText('');
            setIsInputFocused(false);
            setShowEmojiPicker(false);
            inputRef.current?.blur();
            resume();
        }
    };

    const handleEmojiReaction = async (emoji) => {
        console.log('Emoji selected:', emoji);

        // Call react API
        await callReactToStoryAPI(emoji);

        const newEmojiId = Date.now() + Math.random();
        setAnimatedEmojis(prev => [...prev, { id: newEmojiId, emoji }]);

        setShowEmojiPicker(false);
        setIsInputFocused(false);

        if (inputRef.current) {
            inputRef.current.blur();
        }

        pause();
    };

    const handleEmojiSelect = (emoji) => {
        handleEmojiReaction(emoji);
    };

    const handleHeartPress = (emoji) => {
        handleEmojiReaction(emoji);
    };

    const removeAnimatedEmoji = (id) => {
        setAnimatedEmojis(prev => prev.filter(item => item.id !== id));
    };

    const handleInputFocus = () => {
        setIsInputFocused(true);
        setShowEmojiPicker(true);
        pause();
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            if (!showEmojiPicker) {
                setIsInputFocused(false);
                resume();
            }
        }, 100);
    };

    const handleViewersPress = () => {
        setShowViewers(true);
        pause();
    };

    const closeViewersModal = () => {
        setShowViewers(false);
        resume();
    };

    const closeEmojiPicker = () => {
        setShowEmojiPicker(false);
        setIsInputFocused(false);
        inputRef.current?.blur();
        resume();
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
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
                onLoad={handleImageLoad}
                onLoadStart={() => setImageLoaded(false)}
            >
                <View style={styles.overlay} />

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
                            onLoad={handleImageLoad}
                            onLoadStart={() => setImageLoaded(false)}
                        />
                    </View>

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

                    {/* Animated Emoji Reactions */}
                    {animatedEmojis.map((item) => (
                        <AnimatedEmojiReaction
                            key={item.id}
                            emoji={item.emoji}
                            id={item.id}
                            onAnimationComplete={removeAnimatedEmoji}
                        />
                    ))}

                    {/* Selected Emoji (brief display) */}
                    {selectedEmoji && (
                        <View style={styles.selectedEmojiContainer}>
                            <Text style={styles.selectedEmojiText}>{selectedEmoji}</Text>
                        </View>
                    )}
                </SafeAreaView>
            </ImageBackground>

            {/* Bottom Actions */}
            <View style={[
                styles.bottomActionsContainer,
                { bottom: keyboardHeight > 0 ? keyboardHeight : 0 }
            ]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <View style={styles.bottomActions}>
                        {isMyStory ? (
                            <TouchableOpacity
                                style={styles.viewersButton}
                                onPress={handleViewersPress}
                                disabled={loadingViewers}
                            >
                                <Text style={styles.viewersButtonText}>
                                    {loadingViewers ? '...' : `👁 ${storyViewers.length}`}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.replyContainer}>
                                <TextInput
                                    ref={inputRef}
                                    style={styles.replyInput}
                                    placeholder="Reply..."
                                    placeholderTextColor="rgba(255, 255, 255, 0.6)"
                                    value={replyText}
                                    onChangeText={setReplyText}
                                    onFocus={handleInputFocus}
                                    onBlur={handleInputBlur}
                                    multiline={false}
                                    maxLength={200}
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendReply}
                                />
                                <TouchableOpacity
                                    style={styles.heartButton}
                                    onPress={() => handleHeartPress('❤️')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.heartButtonText}>❤️</Text>
                                </TouchableOpacity>
                                {replyText?.length > 0 && (
                                    <TouchableOpacity
                                        style={styles.sendButton}
                                        onPress={handleSendReply}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.sendButtonText}>Send</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>

            {/* Emoji Picker */}
            {showEmojiPicker && !isMyStory && (
                <View style={[
                    styles.emojiPickerContainer,
                    { bottom: keyboardHeight > 0 ? keyboardHeight + 70 : 70 }
                ]}>
                    <View style={styles.emojiPickerBackground}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.emojiScrollContent}
                        >
                            {emojiReactions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.emojiButton}
                                    onPress={() => handleHeartPress(item.emoji)}
                                    activeOpacity={0.6}
                                    delayPressIn={0}
                                >
                                    <Text style={styles.emojiText}>{item.emoji}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* Story Viewers Modal */}
            <StoryViewModel
                showViewers={showViewers}
                storyViewers={storyViewers}
                closeViewersModal={closeViewersModal}
            />
        </View>
    );
};

export default StoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        marginTop: 40
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    progressContainer: {
        position: 'absolute',
        top: 15,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 2,
        height: 2,
        zIndex: 20,
    },
    progressBarBackground: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 1.5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 1.5,
    },
    userInfoContainer: {
        position: 'absolute',
        top: 30,
        left: 15,
        right: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 15,
    },
    userInfoRow: {
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    userAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
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
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    timeAgo: {
        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    closeButton: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    touchableContainer: {
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        bottom: 100,
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
        paddingTop: 80,
        paddingBottom: 100,
    },
    storyImage: {
        width: width,
        height: height * 0.7,
        maxWidth: '100%',
        maxHeight: '100%',
    },
    selectedEmojiContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 25,
    },
    selectedEmojiText: {
        fontSize: 50,
        textAlign: 'center',
    },
    // Animated Emoji Styles - Enhanced for better animation
    animatedEmojiContainer: {
        position: 'absolute',
        top: '50%', // Start from center
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -30 }],
        zIndex: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
    },
    animatedEmojiText: {
        fontSize: 45, // Slightly smaller for better animation
        textAlign: 'center',
        // Enhanced shadow for better visibility
        textShadowColor: 'rgba(0, 0, 0, 0.9)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    // Bottom Actions Container
    bottomActionsContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'transparent',
    },
    keyboardAvoidingView: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    bottomActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    // Viewers button styles
    viewersButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    viewersButtonText: {
        color: 'gray',
        fontSize: 14,
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
        fontWeight: '600',
    },
    // Reply input styles - Instagram style
    replyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 25,
        paddingHorizontal: 5,
        paddingVertical: 5,
        flex: 1,
        borderWidth: 1,
        borderColor: 'white',
    },
    replyInput: {
        flex: 1,
        color: 'white',
        fontSize: 14,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontFamily: FONTS_FAMILY.SourceSans3_Regular,
        minHeight: 40,
        textAlignVertical: 'center',
    },
    heartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: 5,
    },
    heartButtonText: {
        fontSize: 18,
    },
    sendButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 5,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    // Emoji picker styles - Instagram style
    emojiPickerContainer: {
        position: 'absolute',
        left: 15,
        right: 15,
        zIndex: 20,
    },
    emojiPickerBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 25,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
    },
    emojiScrollContent: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    emojiButton: {
        marginHorizontal: 5,
        padding: 8,
        borderRadius: 15,
        backgroundColor: 'transparent',
    },
    emojiText: {
        fontSize: 24,
    },
});