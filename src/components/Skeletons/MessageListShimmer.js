import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';

const { width } = Dimensions.get('window');

const MessageListShimmer = () => {
    const { isDarkMode } = useSelector(state => state.theme);
    const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnimatedValue, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnimatedValue, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, []);

    const shimmerOpacity = shimmerAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    const shimmerTranslate = shimmerAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    const ShimmerBox = ({ style }) => (
        <View style={[styles.shimmerContainer, style]}>
            <View style={[
                styles.shimmerBox,
                { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' },
                style
            ]}>
                <Animated.View
                    style={[
                        styles.shimmerOverlay,
                        {
                            opacity: shimmerOpacity,
                            transform: [{ translateX: shimmerTranslate }],
                            backgroundColor: isDarkMode ? '#555' : '#f5f5f5',
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
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        headerButton: {
            width: 24,
            height: 24,
            borderRadius: 12,
        },
        headerTitle: {
            width: 80,
            height: 24,
            borderRadius: 12,
        },
        // Search bar shimmer
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDarkMode ? '#252525' : '#F0F0F0',
            borderRadius: 30,
            margin: 10,
            padding: 4,
            marginTop: 30,
            paddingHorizontal: 15,
            height: 50,
        },
        searchIcon: {
            width: 20,
            height: 20,
            borderRadius: 10,
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            height: 20,
            borderRadius: 10,
        },
        // Message card shimmer
        messageCard: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: isDarkMode ? '#333' : "#EEE",
            padding: 16,
            paddingVertical: 15,
        },
        profileContainer: {
            marginRight: 12,
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
        },
        detailsContainer: {
            flex: 1,
        },
        nameShimmer: {
            width: '60%',
            height: 16,
            borderRadius: 8,
            marginBottom: 8,
        },
        messageShimmer: {
            width: '80%',
            height: 14,
            borderRadius: 7,
        },
        // List container
        listContainer: {
            flex: 1,
            marginTop: 10,
        },
    });

    // Generate shimmer message cards
    const shimmerMessageCards = Array.from({ length: 10 }, (_, index) => (
        <View key={index} style={styles.messageCard}>
            {/* Profile Image */}
            <View style={styles.profileContainer}>
                <ShimmerBox style={styles.avatar} />
            </View>

            {/* Message Details */}
            <View style={styles.detailsContainer}>
                <ShimmerBox style={styles.nameShimmer} />
                <ShimmerBox style={styles.messageShimmer} />
            </View>
        </View>
    ));

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            
            {/* Header Shimmer */}
            <SpaceBetweenRow style={styles.header}>
                <ShimmerBox style={styles.headerButton} />
                <ShimmerBox style={styles.headerTitle} />
                <ShimmerBox style={styles.headerButton} />
            </SpaceBetweenRow>

            {/* Search Bar Shimmer */}
            <View style={styles.searchContainer}>
                <ShimmerBox style={styles.searchIcon} />
                <ShimmerBox style={styles.searchInput} />
            </View>

            {/* Messages List Shimmer */}
            <View style={styles.listContainer}>
                {shimmerMessageCards}
            </View>
        </View>
    );
};

export default MessageListShimmer;