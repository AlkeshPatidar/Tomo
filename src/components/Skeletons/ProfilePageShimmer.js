// import React, { useEffect, useRef } from 'react';
// import { View, StyleSheet, Animated, Dimensions } from 'react-native';
// import { useSelector } from 'react-redux';

// const { width } = Dimensions.get('window');

// const ProfileShimmer = () => {
//     const { isDarkMode } = useSelector(state => state.theme);
//     const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         const shimmerAnimation = Animated.loop(
//             Animated.sequence([
//                 Animated.timing(shimmerAnimatedValue, {
//                     toValue: 1,
//                     duration: 1000,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(shimmerAnimatedValue, {
//                     toValue: 0,
//                     duration: 1000,
//                     useNativeDriver: true,
//                 }),
//             ])
//         );
//         shimmerAnimation.start();

//         return () => shimmerAnimation.stop();
//     }, []);

//     const shimmerOpacity = shimmerAnimatedValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0.3, 0.7],
//     });

//     const shimmerTranslate = shimmerAnimatedValue.interpolate({
//         inputRange: [0, 1],
//         outputRange: [-width, width],
//     });

//     const ShimmerBox = ({ style }) => (
//         <View style={[styles.shimmerContainer, style]}>
//             <View style={[
//                 styles.shimmerBox,
//                 { backgroundColor: isDarkMode ? 'gray' : '#e0e0e0' },
//                 style
//             ]}>
//                 <Animated.View
//                     style={[
//                         styles.shimmerOverlay,
//                         {
//                             opacity: shimmerOpacity,
//                             transform: [{ translateX: shimmerTranslate }],
//                             backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
//                         },
//                     ]}
//                 />
//             </View>
//         </View>
//     );

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
//         },
//         shimmerContainer: {
//             overflow: 'hidden',
//         },
//         shimmerBox: {
//             overflow: 'hidden',
//         },
//         shimmerOverlay: {
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             width: '100%',
//             height: '100%',
//         },
//         // Header shimmer
//         header: {
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//             paddingBottom: 16,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//         },
//         headerButton: {
//             width: 30,
//             height: 30,
//             borderRadius: 15,
//         },
//         headerText: {
//             width: 150,
//             height: 24,
//             borderRadius: 12,
//         },
//         // Cover photo shimmer
//         coverPhoto: {
//             width: '100%',
//             height: 200,
//             borderRadius: 0,
//         },
//         // Profile card shimmer
//         profileCard: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginTop: -50,
//             marginHorizontal: 16,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 3,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//         },
//         profileImage: {
//             width: 120,
//             height: 120,
//             borderRadius: 60,
//             alignSelf: 'center',
//             marginBottom: 15,
//         },
//         profileName: {
//             width: 180,
//             height: 28,
//             borderRadius: 14,
//             alignSelf: 'center',
//             marginBottom: 8,
//         },
//         profileTitle: {
//             width: 120,
//             height: 18,
//             borderRadius: 9,
//             alignSelf: 'center',
//             marginBottom: 8,
//         },
//         profileLocation: {
//             width: 140,
//             height: 16,
//             borderRadius: 8,
//             alignSelf: 'center',
//             marginBottom: 20,
//         },
//         // Action buttons shimmer
//         actionButtons: {
//             flexDirection: 'row',
//             justifyContent: 'center',
//             gap: 12,
//             marginBottom: 20,
//         },
//         actionButton: {
//             width: 80,
//             height: 40,
//             borderRadius: 20,
//         },
//         // Stats shimmer
//         statsContainer: {
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             paddingVertical: 15,
//             borderTopWidth: 1,
//             borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
//         },
//         statItem: {
//             alignItems: 'center',
//         },
//         statNumber: {
//             width: 40,
//             height: 20,
//             borderRadius: 10,
//             marginBottom: 5,
//         },
//         statLabel: {
//             width: 60,
//             height: 14,
//             borderRadius: 7,
//         },
//         // About section shimmer
//         aboutSection: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginHorizontal: 16,
//             marginTop: 16,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//         },
//         sectionTitle: {
//             width: 80,
//             height: 20,
//             borderRadius: 10,
//             marginBottom: 12,
//         },
//         aboutText: {
//             width: '100%',
//             height: 16,
//             borderRadius: 8,
//             marginBottom: 8,
//         },
//         aboutTextShort: {
//             width: '70%',
//             height: 16,
//             borderRadius: 8,
//         },
//         // Posts section shimmer
//         postsSection: {
//             backgroundColor: isDarkMode ? '#252525' : '#ffffff',
//             marginHorizontal: 16,
//             marginTop: 16,
//             marginBottom: 100,
//             borderRadius: 12,
//             padding: 20,
//             elevation: 2,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 1 },
//             shadowOpacity: 0.1,
//             shadowRadius: 2,
//         },
//         postsGrid: {
//             flexDirection: 'row',
//             flexWrap: 'wrap',
//             justifyContent: 'space-between',
//             marginTop: 10,
//         },
//         postImage: {
//             width: '31%',
//             height: 100,
//             marginBottom: 8,
//             borderRadius: 8,
//         },
//     });

//     return (
//         <View style={styles.container}>
//             {/* Header Shimmer */}
//             <View style={styles.header}>
//                 <ShimmerBox style={styles.headerButton} />
//                 <ShimmerBox style={styles.headerText} />
//                 <ShimmerBox style={styles.headerButton} />
//             </View>

//             {/* Cover Photo Shimmer */}
//             <ShimmerBox style={styles.coverPhoto} />

//             {/* Profile Card Shimmer */}
//             <View style={styles.profileCard}>
//                 <ShimmerBox style={styles.profileImage} />
//                 <ShimmerBox style={styles.profileName} />
//                 <ShimmerBox style={styles.profileTitle} />
//                 <ShimmerBox style={styles.profileLocation} />

//                 {/* Action Buttons Shimmer */}
//                 <View style={styles.actionButtons}>
//                     <ShimmerBox style={styles.actionButton} />
//                     <ShimmerBox style={styles.actionButton} />
//                     <ShimmerBox style={styles.actionButton} />
//                 </View>

//                 {/* Stats Shimmer */}
//                 <View style={styles.statsContainer}>
//                     <View style={styles.statItem}>
//                         <ShimmerBox style={styles.statNumber} />
//                         <ShimmerBox style={styles.statLabel} />
//                     </View>
//                     <View style={styles.statItem}>
//                         <ShimmerBox style={styles.statNumber} />
//                         <ShimmerBox style={styles.statLabel} />
//                     </View>
//                 </View>
//             </View>

//             {/* About Section Shimmer */}
//             <View style={styles.aboutSection}>
//                 <ShimmerBox style={styles.sectionTitle} />
//                 <ShimmerBox style={styles.aboutText} />
//                 <ShimmerBox style={styles.aboutText} />
//                 <ShimmerBox style={styles.aboutText} />
//                 <ShimmerBox style={styles.aboutTextShort} />
//             </View>

//             {/* Posts Section Shimmer */}
//             <View style={styles.postsSection}>
//                 <ShimmerBox style={styles.sectionTitle} />
//                 <View style={styles.postsGrid}>
//                     {[...Array(6)].map((_, index) => (
//                         <ShimmerBox key={index} style={styles.postImage} />
//                     ))}
//                 </View>
//             </View>
//         </View>
//     );
// };

// export default ProfileShimmer;

import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useSelector } from 'react-redux';

const ProfileShimmer = () => {
    const { isDarkMode } = useSelector(state => state.theme);
    const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    // useEffect(() => {
    //     const shimmerAnimation = Animated.loop(
    //         Animated.timing(shimmerAnimatedValue, {
    //             toValue: 1,
    //             duration: 1500,
    //             useNativeDriver: true,
    //         })
    //     );
    //     shimmerAnimation.start();

    //     return () => shimmerAnimation.stop();
    // }, []);

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
            shimmerAnimation.start();  // 🔥 Screen visible → animation ON
        } else {
            shimmerAnimation.stop();   // 🛑 Screen background → animation OFF
        }
    
        return () => shimmerAnimation.stop(); // Unmount → full cleanup
    }, [isFocused, shimmerAnimatedValue]);

    const shimmerOpacity = shimmerAnimatedValue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.6, 0.3],
    });

    const ShimmerBox = ({ style }) => (
        <View style={[
            styles.shimmerBox,
            { backgroundColor: isDarkMode ? '#2a2a2a' : '#e0e0e0' },
            style
        ]}>
            <Animated.View
                style={[
                    styles.shimmerOverlay,
                    {
                        opacity: shimmerOpacity,
                        backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0',
                    },
                ]}
            />
        </View>
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? '#1b1b1b' : '#f3f2ef',
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
        },
        // Header shimmer
        header: {
            paddingTop: 50,
            paddingHorizontal: 20,
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            paddingBottom: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        headerButton: {
            width: 30,
            height: 30,
            borderRadius: 15,
        },
        headerText: {
            width: 150,
            height: 24,
            borderRadius: 12,
        },
        // Cover photo shimmer
        coverPhoto: {
            width: '100%',
            height: 200,
        },
        // Profile card shimmer
        profileCard: {
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            marginTop: -50,
            marginHorizontal: 16,
            borderRadius: 12,
            padding: 20,
        },
        profileImage: {
            width: 120,
            height: 120,
            borderRadius: 60,
            alignSelf: 'center',
            marginBottom: 15,
        },
        profileName: {
            width: 180,
            height: 28,
            borderRadius: 14,
            alignSelf: 'center',
            marginBottom: 8,
        },
        profileTitle: {
            width: 120,
            height: 18,
            borderRadius: 9,
            alignSelf: 'center',
            marginBottom: 8,
        },
        profileLocation: {
            width: 140,
            height: 16,
            borderRadius: 8,
            alignSelf: 'center',
            marginBottom: 20,
        },
        // Action buttons shimmer
        actionButtons: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 20,
        },
        actionButton: {
            width: 80,
            height: 40,
            borderRadius: 20,
        },
        // Stats shimmer
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingVertical: 15,
            borderTopWidth: 1,
            borderTopColor: isDarkMode ? '#333' : '#e0e0e0',
        },
        statItem: {
            alignItems: 'center',
        },
        statNumber: {
            width: 40,
            height: 20,
            borderRadius: 10,
            marginBottom: 5,
        },
        statLabel: {
            width: 60,
            height: 14,
            borderRadius: 7,
        },
        // About section shimmer
        aboutSection: {
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 12,
            padding: 20,
        },
        sectionTitle: {
            width: 80,
            height: 20,
            borderRadius: 10,
            marginBottom: 12,
        },
        aboutText: {
            width: '100%',
            height: 16,
            borderRadius: 8,
            marginBottom: 8,
        },
        aboutTextShort: {
            width: '70%',
            height: 16,
            borderRadius: 8,
        },
        // Posts section shimmer
        postsSection: {
            backgroundColor: isDarkMode ? '#252525' : '#ffffff',
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 100,
            borderRadius: 12,
            padding: 20,
        },
        postsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        postImage: {
            width: '31%',
            height: 100,
            marginBottom: 8,
            borderRadius: 8,
        },
    });

    return (
        <View style={styles.container}>
            {/* Header Shimmer */}
            <View style={styles.header}>
                <ShimmerBox style={styles.headerButton} />
                <ShimmerBox style={styles.headerText} />
                <ShimmerBox style={styles.headerButton} />
            </View>

            {/* Cover Photo Shimmer */}
            <ShimmerBox style={styles.coverPhoto} />

            {/* Profile Card Shimmer */}
            <View style={styles.profileCard}>
                <ShimmerBox style={styles.profileImage} />
                <ShimmerBox style={styles.profileName} />
                <ShimmerBox style={styles.profileTitle} />
                <ShimmerBox style={styles.profileLocation} />

                {/* Action Buttons Shimmer */}
                <View style={styles.actionButtons}>
                    <ShimmerBox style={styles.actionButton} />
                    <ShimmerBox style={styles.actionButton} />
                    <ShimmerBox style={styles.actionButton} />
                </View>

                {/* Stats Shimmer */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <ShimmerBox style={styles.statNumber} />
                        <ShimmerBox style={styles.statLabel} />
                    </View>
                    <View style={styles.statItem}>
                        <ShimmerBox style={styles.statNumber} />
                        <ShimmerBox style={styles.statLabel} />
                    </View>
                </View>
            </View>

            {/* About Section Shimmer */}
            <View style={styles.aboutSection}>
                <ShimmerBox style={styles.sectionTitle} />
                <ShimmerBox style={styles.aboutText} />
                <ShimmerBox style={styles.aboutText} />
                <ShimmerBox style={styles.aboutText} />
                <ShimmerBox style={styles.aboutTextShort} />
            </View>

            {/* Posts Section Shimmer */}
            <View style={styles.postsSection}>
                <ShimmerBox style={styles.sectionTitle} />
                <View style={styles.postsGrid}>
                    {[...Array(6)].map((_, index) => (
                        <ShimmerBox key={index} style={styles.postImage} />
                    ))}
                </View>
            </View>
        </View>
    );
};

export default ProfileShimmer;