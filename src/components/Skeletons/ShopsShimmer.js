import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ShimmerPlaceholder = ({ width, height, borderRadius = 4, style }) => {
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

const ShopCardShimmer = ({ isDarkMode }) => {
    const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;
    
    return (
        <View style={[styles.cardContainer, { 
            backgroundColor: isDarkMode ? '#252525' : '#fff',
            borderColor: isDarkMode ? 'gray' : '#E4E4E4'
        }]}>
            {/* Shop Image */}
            <ShimmerComponent 
                width="100%" 
                height={100} 
                borderRadius={10} 
            />
            
            {/* Shop Details */}
            <View style={{ marginTop: 6 }}>
                {/* Shop Name */}
                <ShimmerComponent 
                    width="80%" 
                    height={16} 
                    borderRadius={8} 
                    style={{ marginBottom: 8 }}
                />
                
                {/* Location Row */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    {/* Location Icon */}
                    <ShimmerComponent 
                        width={12} 
                        height={12} 
                        borderRadius={6} 
                    />
                    {/* Location Text */}
                    <ShimmerComponent 
                        width="60%" 
                        height={10} 
                        borderRadius={5} 
                    />
                </View>
            </View>
        </View>
    );
};

const SearchBarShimmer = ({ isDarkMode }) => {
    const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;
    
    return (
        <View style={[styles.searchContainer, { 
            backgroundColor: isDarkMode ? '#252525' : '#F0F0F0' 
        }]}>
            {/* Search Icon */}
            <ShimmerComponent 
                width={20} 
                height={20} 
                borderRadius={10} 
            />
            
            {/* Search Input Area */}
            <View style={{ flex: 1 }}>
                <ShimmerComponent 
                    width="70%" 
                    height={16} 
                    borderRadius={8} 
                />
            </View>
        </View>
    );
};

const ShopsShimmerLoader = ({ isDarkMode, shopCount = 8 }) => {
    const ShimmerComponent = isDarkMode ? ShimmerPlaceholderDark : ShimmerPlaceholder;
    
    // Create pairs of shop cards for the grid (2 columns)
    const shopPairs = [];
    for (let i = 0; i < shopCount; i += 2) {
        shopPairs.push([i, i + 1]);
    }

    return (
        <View style={[styles.container, { 
            backgroundColor: isDarkMode ? 'black' : '#fff' 
        }]}>
            {/* Search Bar Shimmer */}
            <SearchBarShimmer isDarkMode={isDarkMode} />
            
            {/* Shop Grid Shimmer */}
            <View style={styles.gridContainer}>
                {shopPairs.map((pair, index) => (
                    <View key={index} style={styles.rowContainer}>
                        <ShopCardShimmer isDarkMode={isDarkMode} />
                        {pair[1] < shopCount && (
                            <ShopCardShimmer isDarkMode={isDarkMode} />
                        )}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        margin: 10,
        padding: 4,
        marginTop: 10,
        paddingHorizontal: 15,
        gap: 10,
        height: 50,
    },
    gridContainer: {
        paddingHorizontal: 10,
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    cardContainer: {
        borderRadius: 10,
        margin: 8,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        borderWidth: 1,
        padding: 7,
        maxWidth: (width - 52) / 2, // Accounting for margins and padding
    },
});

export default ShopsShimmerLoader;