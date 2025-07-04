import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const ActivityShimmer = () => {
    const { isDarkMode } = useSelector(state => state.theme);
    const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnimatedValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnimatedValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, []);

    const shimmerOpacity = shimmerAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const shimmerTranslate = shimmerAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    const ShimmerBox = ({ style }) => (
        <View style={[styles.shimmerContainer, style]}>
            <View style={[
                styles.shimmerBox,
                { backgroundColor: isDarkMode ? 'gray' : '#e0e0e0' },
                style
            ]}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        {
                            opacity: shimmerOpacity,
                            transform: [{ translateX: shimmerTranslate }],
                            backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
                        },
                    ]}
                />
            </View>
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : '#fff',
        },
        shimmerContainer: {
            overflow: 'hidden',
        },
        shimmerBox: {
            overflow: 'hidden',
        },
        shimmerOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
        },
        // Header shimmer
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 90,
        },
        headerButton: {
            width: 30,
            height: 30,
            borderRadius: 15,
        },
        headerText: {
            width: 120,
            height: 24,
            borderRadius: 12,
        },
        // Card shimmer
        cardContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            marginHorizontal: 10,
            marginBottom: 8,
        },
        profileImage: {
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 12,
        },
        textContainer: {
            flex: 1,
        },
        actionText: {
            width: '80%',
            height: 16,
            borderRadius: 8,
            marginBottom: 6,
        },
        timeText: {
            width: '30%',
            height: 12,
            borderRadius: 6,
        },
        followButton: {
            width: 70,
            height: 32,
            borderRadius: 8,
        },
        // List container
        listContainer: {
            marginTop: 20,
            paddingHorizontal: 10,
        },
    });

    // Generate shimmer items
    const shimmerItems = Array.from({ length: 8 }, (_, index) => (
        <View key={index} style={styles.cardContainer}>
            <ShimmerBox style={styles.profileImage} />
            <View style={styles.textContainer}>
                <ShimmerBox style={styles.actionText} />
                <ShimmerBox style={styles.timeText} />
            </View>
            {/* Randomly show follow button on some items */}
            {index % 3 === 0 && (
                <ShimmerBox style={styles.followButton} />
            )}
        </View>
    ));

    return (
        <View style={styles.container}>
            {/* Header Shimmer */}
            <View style={styles.header}>
                <ShimmerBox style={styles.headerButton} />
                <ShimmerBox style={styles.headerText} />
            </View>

            {/* Notifications List Shimmer */}
            <View style={styles.listContainer}>
                {shimmerItems}
            </View>
        </View>
    );
};

export default ActivityShimmer;