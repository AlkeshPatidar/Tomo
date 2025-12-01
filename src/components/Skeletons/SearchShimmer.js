import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const SearchShimmerLoader = () => {
    const { isDarkMode } = useSelector(state => state.theme);
    const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     const shimmerAnimation = Animated.loop(
    //         Animated.sequence([
    //             Animated.timing(shimmerAnimatedValue, {
    //                 toValue: 1,
    //                 duration: 1000,
    //                 useNativeDriver: true,
    //             }),
    //             Animated.timing(shimmerAnimatedValue, {
    //                 toValue: 0,
    //                 duration: 1000,
    //                 useNativeDriver: true,
    //             }),
    //         ])
    //     );

    //     shimmerAnimation.start();

    //     return () => shimmerAnimation.stop();
    // }, []);

    const isFocused = useIsFocused();

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

    if (isFocused) {
        shimmerAnimation.start();   // 🔥 Screen visible → Start animation
    } else {
        shimmerAnimation.stop();    // 🛑 Screen hidden → Stop animation
    }

    return () => shimmerAnimation.stop(); // Component unmount → Cleanup
}, [isFocused]);


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
                styles.shimmerBase,
                { backgroundColor: isDarkMode ? '#1a1a1a' : '#f0f0f0' }
            ]}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        {
                            backgroundColor: isDarkMode ? '#333' : '#fff',
                            opacity: shimmerOpacity,
                            transform: [{ translateX: shimmerTranslate }],
                        },
                    ]}
                />
            </View>
        </View>
    );

    const UserCardShimmer = () => (
        <View style={[
            styles.userCardContainer,
            { backgroundColor: isDarkMode ? '#1a1a1a' : '#f9f9f9' }
        ]}>
            <ShimmerBox style={styles.userImage} />
            <View style={styles.userInfo}>
                <ShimmerBox style={styles.username} />
            </View>
        </View>
    );

    const renderShimmerGrid = () => {
        const shimmerItems = Array.from({ length: 9 }, (_, index) => (
            <UserCardShimmer key={index} />
        ));

        return (
            <View style={styles.gridContainer}>
                {shimmerItems}
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#000' : '#fff',
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f1f1f1',
            borderRadius: 12,
            margin: 16,
            padding: 12,
            marginTop: 60,
            height: 48,
        },
        searchIcon: {
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            height: 20,
            borderRadius: 4,
        },
        micIcon: {
            marginLeft: 8,
        },
        sectionTitle: {
            height: 20,
            width: 150,
            borderRadius: 4,
            marginBottom: 12,
            marginHorizontal: 16,
        },
        gridContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 2,
            marginBottom: 100,
        },
        userCardContainer: {
            width: (width - 16) / 3 - 4,
            margin: 1,
            borderRadius: 8,
            overflow: 'hidden',
        },
        userImage: {
            width: '100%',
            height: 120,
        },
        userInfo: {
            padding: 8,
            alignItems: 'center',
        },
        username: {
            width: '80%',
            height: 14,
            borderRadius: 4,
        },
        shimmerContainer: {
            overflow: 'hidden',
        },
        shimmerBase: {
            width: '100%',
            height: '100%',
            borderRadius: 4,
        },
        shimmerOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '50%',
        },
        iconShimmer: {
            width: 20,
            height: 20,
            borderRadius: 10,
        },
    });

    return (
        <View style={styles.container}>
            {/* Search Bar Shimmer */}
            <View style={styles.searchContainer}>
                <ShimmerBox style={[styles.iconShimmer, styles.searchIcon]} />
                <ShimmerBox style={styles.searchInput} />
                <ShimmerBox style={[styles.iconShimmer, styles.micIcon]} />
            </View>

            {/* Section Title Shimmer */}
            <ShimmerBox style={styles.sectionTitle} />

            {/* Grid Shimmer */}
            {renderShimmerGrid()}
        </View>
    );
};

export default SearchShimmerLoader;