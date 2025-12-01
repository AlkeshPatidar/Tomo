import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ShimmerPlaceholder = ({ width, height, borderRadius = 4, style }) => {
    const shimmerValue = useRef(new Animated.Value(0)).current;

    const isFocused = useIsFocused();



    // useEffect(() => {
    //     const shimmerAnimation = Animated.loop(
    //         Animated.sequence([
    //             Animated.timing(shimmerValue, {
    //                 toValue: 1,
    //                 duration: 1000,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(shimmerValue, {
    //                 toValue: 0,
    //                 duration: 1000,
    //                 useNativeDriver: true,
    //             }),
    //         ])
    //     );
    //     shimmerAnimation.start();

    //     return () => shimmerAnimation.stop();
    // }, [shimmerValue]);

    // const isFocused = useIsFocused();

useEffect(() => {
    const shimmerAnimation = Animated.loop(
        Animated.sequence([
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(shimmerValue, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
        ])
    );

    if (isFocused) {
        shimmerAnimation.start();  // 🔥 Screen visible → animation ON
    } else {
        shimmerAnimation.stop();   // 🛑 Screen background → animation OFF
    }

    return () => shimmerAnimation.stop(); // Unmount → full cleanup
}, [isFocused, shimmerValue]);


    const opacity = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });



    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: '#E0E0E0',
                    opacity,
                },
                style,
            ]}
        />
    );
};

const ShimmerPlaceholderDark = ({ width, height, borderRadius = 4, style }) => {
    const shimmerValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, [shimmerValue]);

    const opacity = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.1, 0.3],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: 'lightgray',
                    opacity,
                },
                style,
            ]}
        />
    );
};

const FeedShimmerItem = ({ isDarkMode }) => {
    const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;
    
    return (
        <View style={[styles.feedContainer, { backgroundColor: isDarkMode ? 'black' : 'white' }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {/* Profile Image */}
                    <ShimmerComponent width={40} height={40} borderRadius={20} />
                    <View style={{ marginLeft: 10 }}>
                        {/* Username */}
                        <ShimmerComponent width={120} height={16} borderRadius={8} />
                        {/* Audio text placeholder */}
                        <ShimmerComponent width={80} height={12} borderRadius={6} style={{ marginTop: 4 }} />
                    </View>
                </View>
            </View>

            {/* Post Image/Video */}
            <ShimmerComponent width="100%" height={210} borderRadius={0} />

            {/* Actions */}
            <View style={styles.actions}>
                <View style={styles.leftIcons}>
                    {/* Like, Comment, Share icons */}
                    <ShimmerComponent width={24} height={24} borderRadius={12} />
                    <ShimmerComponent width={24} height={24} borderRadius={12} />
                </View>
                <View style={styles.rightIcons}>
                    {/* Dislike and Save icons */}
                    <ShimmerComponent width={24} height={24} borderRadius={12} />
                    <ShimmerComponent width={24} height={24} borderRadius={12} style={{ marginLeft: 20 }} />
                </View>
            </View>

            {/* Likes count */}
            <View style={styles.likesContainer}>
                <ShimmerComponent width={80} height={16} borderRadius={8} />
            </View>

            {/* Caption */}
            <View style={styles.captionContainer}>
                <ShimmerComponent width="90%" height={14} borderRadius={7} />
                <ShimmerComponent width="70%" height={14} borderRadius={7} style={{ marginTop: 4 }} />
            </View>

            {/* Comments count */}
            <View style={styles.commentsContainer}>
                <ShimmerComponent width={100} height={14} borderRadius={7} />
            </View>

            {/* Time */}
            <View style={styles.timeContainer}>
                <ShimmerComponent width={60} height={12} borderRadius={6} />
            </View>
        </View>
    );
};

const FeedShimmerLoader = ({ isDarkMode, count = 3 }) => {
    return (
        <View style={{ marginBottom: 90 }}>
            {Array.from({ length: count }).map((_, index) => (
                <FeedShimmerItem key={index} isDarkMode={isDarkMode} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    feedContainer: {
        // borderBottomWidth: 0.5,
        // borderBottomColor: 'lightgray',
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
        marginHorizontal: 10,
    },
    leftIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    rightIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likesContainer: {
        paddingHorizontal: 10,
        marginTop: 8,
    },
    captionContainer: {
        paddingHorizontal: 10,
        marginTop: 8,
    },
    commentsContainer: {
        paddingHorizontal: 10,
        marginTop: 8,
    },
    timeContainer: {
        paddingHorizontal: 10,
        marginTop: 5,
    },
});

export default FeedShimmerLoader;