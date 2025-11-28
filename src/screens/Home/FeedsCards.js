// // FeedCard.js - Separate Component File
// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Animated,
//   StyleSheet
// } from 'react-native';
// import Video from 'react-native-video';
// import GradientIcon from '../../components/GradientIcon';
// import { SpeakerOff } from '../../assets/SVGs';
// import AntDesign from 'react-native-vector-icons/AntDesign'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { useSelector } from 'react-redux';
// import IMG from '../../assets/Images';


// const FeedCard = ({
//   post,
//   index,
// //   styles, 
// //   isDarkMode,
//   isNewsItem,
//   isVideo,
//   mediaUrl,
//   visibleVideoIndex,
//   pausedVideos,
//   isMuted,
//   selector,
//   doubleTapIndex,
//   heartOpacity,
//   heartScale,
  
//   // Event handlers
//   onPostPress,
//   onUserPress,
//   onMediaPress,
//   onLikePress,
//   onDislikePress,
//   onCommentPress,
//   onBookmarkPress,
//   onMuteToggle,
//   formatInstagramDate
// }) => {
//   const { isDarkMode } = useSelector(state => state.theme)

//       const styles = StyleSheet.create({
//          feedContainer: {
//       paddingBottom: 12,
//       backgroundColor: isDarkMode ? '#161C1C' : '#e4edeeff',
//       margin: 10,
//       borderRadius: 30,
//       borderWidth: 1,
//       marginBottom: 10,
//       borderColor: isDarkMode ? '#333' : '#E0E0E0',
//       paddingHorizontal: 10
//     },
//         // Feed Header
//         feedHeader: {
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'flex-start',
//           paddingHorizontal: 0,
//           paddingVertical: 12,
//         },
//         feedUserInfo: {
//           flexDirection: 'row',
//           alignItems: 'center',
//           flex: 1,
//         },
//         profileImageWrapper: {
//           marginRight: 12,
//         },
//         profileImage: {
//           width: 42,
//           height: 42,
//           borderRadius: 21,
//           borderWidth: 2,
//           borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//         },
//         userNameRow: {
//           flexDirection: 'row',
//           alignItems: 'center',
//           marginBottom: 2,
//         },
//         username: {
//           fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//           fontSize: 15,
//         },
//         timeText: {
//           color: '#999',
//           fontSize: 12,
//           marginLeft: 6,
//           fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//         },
//         caption: {
//           fontSize: 14,
//           fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//           lineHeight: 18,
//           color: isDarkMode ? '#252525' : 'white'
//         },
    
//         // Media Container
//         mediaContainer: {
//           position: 'relative',
//           marginTop: 8,
//         },
//         postImage: {
//           width: '100%',
//           height: 350,
//           borderRadius: 20
//         },
//         videoContainer: {
//           borderRadius: 0,
//           overflow: 'hidden',
//         },
//         heartAnimation: {
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: [{ translateX: -50 }, { translateY: -50 }],
//         },
//         soundButton: {
//           position: 'absolute',
//           bottom: 16,
//           right: 16,
//         },
//         soundButtonInner: {
//           backgroundColor: 'rgba(0, 0, 0, 0.6)',
//           padding: 8,
//           borderRadius: 20,
//           backdropFilter: 'blur(10px)',
//         },
    
//         // Actions
//         actions: {
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           paddingHorizontal: 16,
//         },
//         leftActions: {
//           flexDirection: 'row',
//           alignItems: 'center',
//           gap: 16,
//         },
//         actionButton: {
//           flexDirection: 'row',
//           alignItems: 'center',
//           gap: 6,
//           paddingVertical: 4,
//           paddingHorizontal: 8,
//           borderRadius: 16,
//           backgroundColor: '#E0E0E0',
//         },
//         actionText: {
//           fontSize: 14,
//           fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//         },
    
//         // Advertisement Styles
//         adBadgeContainer: {
//           marginRight: 12,
//         },
//         adBadgeGradient: {
//           paddingHorizontal: 10,
//           paddingVertical: 5,
//           borderRadius: 6,
//         },
//         adBadge: {
//           fontSize: 11,
//           fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//           color: '#fff',
//           letterSpacing: 0.5,
//         },
//         adDotsContainer: {
//           position: 'absolute',
//           bottom: 12,
//           left: 0,
//           right: 0,
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           gap: 6,
//         },
//         adDot: {
//           width: 6,
//           height: 6,
//           borderRadius: 3,
//           backgroundColor: 'rgba(255, 255, 255, 0.4)',
//         },
//         adDotActive: {
//           backgroundColor: '#fff',
//           width: 20,
//           height: 6,
//           borderRadius: 3,
//         },
//         adNavButton: {
//           position: 'absolute',
//           top: '50%',
//           backgroundColor: 'rgba(0, 0, 0, 0.5)',
//           width: 36,
//           height: 36,
//           borderRadius: 18,
//           justifyContent: 'center',
//           alignItems: 'center',
//           transform: [{ translateY: -18 }],
//           backdropFilter: 'blur(10px)',
//         },
//         adNavButtonLeft: {
//           left: 12,
//         },
//         adNavButtonRight: {
//           right: 12,
//         },
//         adCtaContainer: {
//           marginHorizontal: 16,
//           marginTop: 12,
//           borderRadius: 12,
//           overflow: 'hidden',
//         },
//         adCtaGradient: {
//           padding: 14,
//           alignItems: 'center',
//         },
//         adCtaText: {
//           color: '#fff',
//           fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
//           fontSize: 15,
//           letterSpacing: 0.5,
//         },
    
//         // Empty State
//         emptyContainer: {
//           alignItems: 'center',
//           justifyContent: 'center',
//           paddingVertical: 60,
//         },
//         emptyText: {
//           fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//           fontSize: 16,
//         },
//       })
//   return (
//     <TouchableOpacity
//       style={styles.feedContainer}
//       onPress={onPostPress}
//       activeOpacity={0.98}
//     >
//       {/* Header */}
//       <View style={styles.feedHeader}>
//         <View style={styles.feedUserInfo}>
//           <View style={styles.profileImageWrapper}>
//             <Image
//               source={
//                 isNewsItem
//                   ? IMG.MessageProfile
//                   : post?.User?.Image
//                     ? { uri: post?.User?.Image }
//                     : IMG.MessageProfile
//               }
//               style={styles.profileImage}
//             />
//           </View>
          
//           <TouchableOpacity
//             onPress={onUserPress}
//             style={{ flex: 1 }}
//             activeOpacity={0.7}
//           >
//             <View style={styles.userNameRow}>
//               <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
//                 {isNewsItem ? post?.title : post?.User?.UserName}
//               </Text>
//               {!isNewsItem && (
//                 <Text style={styles.timeText}>
//                   • {formatInstagramDate(post?.createdAt)}
//                 </Text>
//               )}
//             </View>
//             <Text 
//               style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} 
//               numberOfLines={2}
//             >
//               {isNewsItem
//                 ? post?.description?.replace(/<[^>]*>/g, '')
//                 : post?.caption}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Post Media */}
//       <TouchableWithoutFeedback onPress={onMediaPress}>
//         <View style={styles.mediaContainer}>
//           {isVideo ? (
//             <View style={styles.videoContainer}>
//               <Video
//                 source={{ uri: mediaUrl }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//                 repeat={true}
//                 muted={isMuted}
//                 paused={visibleVideoIndex !== index || pausedVideos[index]}
//               />
//             </View>
//           ) : (
//             <Image
//               source={{ uri: mediaUrl }}
//               style={styles.postImage}
//               resizeMode='cover'
//             />
//           )}

//           {/* Bottom Actions Bar */}
//           <View style={{
//             height: 40,
//             width: '100%',
//             backgroundColor: 'rgba(0, 0, 0, 0.2)',
//             position: 'absolute',
//             bottom: 0,
//             justifyContent: 'center',
//             borderBottomLeftRadius: 20,
//             borderBottomRightRadius: 20
//           }}>
//             {!isNewsItem && (
//               <View style={styles.actions}>
//                 <View style={styles.leftActions}>
//                   {/* Like Button */}
//                   <View style={styles.actionButton}>
//                     <TouchableOpacity onPress={onLikePress} activeOpacity={0.7}>
//                       {post?.likes?.includes(selector?._id) ? (
//                         <GradientIcon
//                           colors={['#21B7FF', '#0084F8']}
//                           size={20}
//                           iconType='Ionicons'
//                           name={'triangle'}
//                         />
//                       ) : (
//                         <GradientIcon
//                           colors={['#999', '#999']}
//                           size={16}
//                           iconType='Feather'
//                           name={'triangle'}
//                         />
//                       )}
//                     </TouchableOpacity>
//                     <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                       {post?.TotalLikes}
//                     </Text>
//                   </View>

//                   {/* Dislike Button */}
//                   <View style={styles.actionButton}>
//                     <TouchableOpacity onPress={onDislikePress} activeOpacity={0.7}>
//                       <GradientIcon
//                         colors={post?.Unlikes?.includes(selector?._id) 
//                           ? ['#21B7FF', '#0084F8']
//                           : ['#999', '#999']}
//                         size={16}
//                         iconType='Feather'
//                         name={'triangle'}
//                         style={{ transform: [{ rotate: '180deg' }] }}
//                       />
//                     </TouchableOpacity>
//                     <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                       {post?.TotalUnLikes}
//                     </Text>
//                   </View>

//                   {/* Comment Button */}
//                   <View style={styles.actionButton}>
//                     <TouchableOpacity onPress={onCommentPress} activeOpacity={0.7}>
//                       <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={16}
//                         iconType='FontAwesome'
//                         name={'comment-o'}
//                       />
//                     </TouchableOpacity>
//                     <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                       {post?.TotalComents}
//                     </Text>
//                   </View>
//                 </View>

//                 {/* Bookmark Button */}
//                 <TouchableOpacity onPress={onBookmarkPress} activeOpacity={0.7}>
//                   {post?.SavedBy?.includes(selector?._id) ? (
//                     <GradientIcon
//                       colors={['#21B7FF', '#0084F8']}
//                       size={22}
//                       iconType='FontAwesome'
//                       name={'bookmark'}
//                     />
//                   ) : (
//                     <GradientIcon
//                       colors={['#999', '#999']}
//                       size={22}
//                       iconType='FontAwesome'
//                       name={'bookmark-o'}
//                     />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           {/* Heart Animation */}
//           {!isNewsItem && (
//             <Animated.View pointerEvents='none' style={styles.heartAnimation}>
//               <Animated.View
//                 style={{
//                   opacity: doubleTapIndex === index ? heartOpacity : 0,
//                   transform: [{ scale: heartScale }],
//                 }}
//               >
//                 <MaterialIcons name='favorite' size={100} color='#FF1493' />
//               </Animated.View>
//             </Animated.View>
//           )}

//           {/* Mute/Unmute Button */}
//           {isVideo && (
//             <TouchableOpacity
//               style={styles.soundButton}
//               onPress={onMuteToggle}
//               activeOpacity={0.8}
//             >
//               <View style={styles.soundButtonInner}>
//                 {isMuted ? (
//                   <SpeakerOff />
//                 ) : (
//                   <AntDesign name={'sound'} color='white' size={16} />
//                 )}
//               </View>
//             </TouchableOpacity>
//           )}
//         </View>
//       </TouchableWithoutFeedback>
//     </TouchableOpacity>
//   );
// };

// export default FeedCard;

// FeedCard.js - Glassmorphism with Glowing Border & Stars
// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Animated,
//   StyleSheet,
//   Dimensions
// } from 'react-native';
// import Video from 'react-native-video';
// import GradientIcon from '../../components/GradientIcon';
// import { SpeakerOff } from '../../assets/SVGs';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';

// const { width: screenWidth } = Dimensions.get('window');

// const FeedCard = ({
//   post,
//   index,
//   isNewsItem,
//   isVideo,
//   mediaUrl,
//   visibleVideoIndex,
//   pausedVideos,
//   isMuted,
//   selector,
//   doubleTapIndex,
//   heartOpacity,
//   heartScale,
  
//   onPostPress,
//   onUserPress,
//   onMediaPress,
//   onLikePress,
//   onDislikePress,
//   onCommentPress,
//   onBookmarkPress,
//   onMuteToggle,
//   formatInstagramDate
// }) => {
//   const { isDarkMode } = useSelector(state => state.theme);

//   // Border glow animation
//   const glowAnim = useRef(new Animated.Value(0)).current;
  
//   // Stars animations
//   const star1X = useRef(new Animated.Value(25)).current;
//   const star1Y = useRef(new Animated.Value(40)).current;
//   const star1Opacity = useRef(new Animated.Value(0)).current;
//   const star1Scale = useRef(new Animated.Value(0.8)).current;
  
//   const star2X = useRef(new Animated.Value(screenWidth - 100)).current;
//   const star2Y = useRef(new Animated.Value(100)).current;
//   const star2Opacity = useRef(new Animated.Value(0)).current;
//   const star2Scale = useRef(new Animated.Value(0.8)).current;
  
//   const star3X = useRef(new Animated.Value(screenWidth / 2 - 20)).current;
//   const star3Y = useRef(new Animated.Value(180)).current;
//   const star3Opacity = useRef(new Animated.Value(0)).current;
//   const star3Scale = useRef(new Animated.Value(0.8)).current;

//   const star4X = useRef(new Animated.Value(60)).current;
//   const star4Y = useRef(new Animated.Value(250)).current;
//   const star4Opacity = useRef(new Animated.Value(0)).current;
//   const star4Scale = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     // Continuous border glow animation
//     const glowAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     );

//     // Star 1 animation
//     const star1Animation = Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(star1X, { toValue: 40, duration: 3000, useNativeDriver: true }),
//           Animated.timing(star1Y, { toValue: 30, duration: 3000, useNativeDriver: true }),
//           Animated.timing(star1Opacity, { toValue: 0.6, duration: 1500, useNativeDriver: true }),
//           Animated.timing(star1Scale, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
//         ]),
//         Animated.parallel([
//           Animated.timing(star1X, { toValue: 25, duration: 3000, useNativeDriver: true }),
//           Animated.timing(star1Y, { toValue: 40, duration: 3000, useNativeDriver: true }),
//           Animated.timing(star1Opacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
//           Animated.timing(star1Scale, { toValue: 0.8, duration: 1500, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     // Star 2 animation
//     const star2Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(800),
//         Animated.parallel([
//           Animated.timing(star2X, { toValue: screenWidth - 115, duration: 3500, useNativeDriver: true }),
//           Animated.timing(star2Y, { toValue: 90, duration: 3500, useNativeDriver: true }),
//           Animated.timing(star2Opacity, { toValue: 0.5, duration: 1750, useNativeDriver: true }),
//           Animated.timing(star2Scale, { toValue: 1.1, duration: 1750, useNativeDriver: true }),
//         ]),
//         Animated.parallel([
//           Animated.timing(star2X, { toValue: screenWidth - 100, duration: 3500, useNativeDriver: true }),
//           Animated.timing(star2Y, { toValue: 100, duration: 3500, useNativeDriver: true }),
//           Animated.timing(star2Opacity, { toValue: 0, duration: 1750, useNativeDriver: true }),
//           Animated.timing(star2Scale, { toValue: 0.8, duration: 1750, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     // Star 3 animation
//     const star3Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(1600),
//         Animated.parallel([
//           Animated.timing(star3X, { toValue: screenWidth / 2 - 10, duration: 3200, useNativeDriver: true }),
//           Animated.timing(star3Y, { toValue: 170, duration: 3200, useNativeDriver: true }),
//           Animated.timing(star3Opacity, { toValue: 0.7, duration: 1600, useNativeDriver: true }),
//           Animated.timing(star3Scale, { toValue: 1.3, duration: 1600, useNativeDriver: true }),
//         ]),
//         Animated.parallel([
//           Animated.timing(star3X, { toValue: screenWidth / 2 - 20, duration: 3200, useNativeDriver: true }),
//           Animated.timing(star3Y, { toValue: 180, duration: 3200, useNativeDriver: true }),
//           Animated.timing(star3Opacity, { toValue: 0, duration: 1600, useNativeDriver: true }),
//           Animated.timing(star3Scale, { toValue: 0.8, duration: 1600, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     // Star 4 animation
//     const star4Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(2200),
//         Animated.parallel([
//           Animated.timing(star4X, { toValue: 75, duration: 3400, useNativeDriver: true }),
//           Animated.timing(star4Y, { toValue: 240, duration: 3400, useNativeDriver: true }),
//           Animated.timing(star4Opacity, { toValue: 0.55, duration: 1700, useNativeDriver: true }),
//           Animated.timing(star4Scale, { toValue: 1.15, duration: 1700, useNativeDriver: true }),
//         ]),
//         Animated.parallel([
//           Animated.timing(star4X, { toValue: 60, duration: 3400, useNativeDriver: true }),
//           Animated.timing(star4Y, { toValue: 250, duration: 3400, useNativeDriver: true }),
//           Animated.timing(star4Opacity, { toValue: 0, duration: 1700, useNativeDriver: true }),
//           Animated.timing(star4Scale, { toValue: 0.8, duration: 1700, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     glowAnimation.start();
//     star1Animation.start();
//     star2Animation.start();
//     star3Animation.start();
//     star4Animation.start();

//     return () => {
//       glowAnimation.stop();
//       star1Animation.stop();
//       star2Animation.stop();
//       star3Animation.stop();
//       star4Animation.stop();
//     };
//   }, []);

//   const borderColor = glowAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [
//       isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
//       isDarkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.6)',
//       isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
//     ],
//   });

//   const shadowOpacity = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.2, 0.6],
//   });

//   const styles = StyleSheet.create({
//     feedContainer: {
//       paddingBottom: 12,
//       backgroundColor: isDarkMode ? 'rgba(22, 28, 28, 0.7)' : 'rgba(228, 237, 238, 0.7)',
//       margin: 10,
//       borderRadius: 30,
//       marginBottom: 10,
//       paddingHorizontal: 10,
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     feedHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       paddingHorizontal: 0,
//       paddingVertical: 12,
//     },
//     feedUserInfo: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     profileImageWrapper: {
//       marginRight: 12,
//     },
//     profileImage: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//     },
//     userNameRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 2,
//     },
//     username: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 15,
//     },
//     timeText: {
//       color: '#999',
//       fontSize: 12,
//       marginLeft: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     caption: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       lineHeight: 18,
//     },
//     mediaContainer: {
//       position: 'relative',
//       marginTop: 8,
//     },
//     postImage: {
//       width: '100%',
//       height: 350,
//       borderRadius: 20
//     },
//     videoContainer: {
//       borderRadius: 0,
//       overflow: 'hidden',
//     },
//     heartAnimation: {
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: [{ translateX: -50 }, { translateY: -50 }],
//     },
//     soundButton: {
//       position: 'absolute',
//       bottom: 16,
//       right: 16,
//     },
//     soundButtonInner: {
//       backgroundColor: 'rgba(0, 0, 0, 0.6)',
//       padding: 8,
//       borderRadius: 20,
//       backdropFilter: 'blur(10px)',
//     },
//     actions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//     },
//     leftActions: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 16,
//     },
//     actionButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 6,
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 16,
//       backgroundColor: '#E0E0E0',
//     },
//     actionText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//   });

//   return (
//     <Animated.View
//       style={{
//         margin: 10,
//         borderRadius: 30,
//         borderWidth: 1.5,
//         borderColor: borderColor,
//         shadowColor: isDarkMode ? '#8B5CF6' : '#8B5CF6',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: shadowOpacity,
//         shadowRadius: 15,
//         elevation: 8,
//       }}
//     >
//       <TouchableOpacity
//         style={styles.feedContainer}
//         onPress={onPostPress}
//         activeOpacity={0.98}
//       >
//         {/* Animated Stars */}
//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star1Opacity,
//             transform: [
//               { translateX: star1X },
//               { translateY: star1Y },
//               { scale: star1Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 8, color: isDarkMode ? '#9333ea' : '#7c3aed' }}>✦</Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star2Opacity,
//             transform: [
//               { translateX: star2X },
//               { translateY: star2Y },
//               { scale: star2Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 6, color: isDarkMode ? '#a855f7' : '#8b5cf6' }}>✦</Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star3Opacity,
//             transform: [
//               { translateX: star3X },
//               { translateY: star3Y },
//               { scale: star3Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 10, color: isDarkMode ? '#7c3aed' : '#9333ea' }}>✦</Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star4Opacity,
//             transform: [
//               { translateX: star4X },
//               { translateY: star4Y },
//               { scale: star4Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 7, color: isDarkMode ? '#8b5cf6' : '#a855f7' }}>✦</Text>
//         </Animated.View>

//         {/* Header */}
//         <View style={styles.feedHeader}>
//           <View style={styles.feedUserInfo}>
//             <View style={styles.profileImageWrapper}>
//               <Image
//                 source={
//                   isNewsItem
//                     ? IMG.MessageProfile
//                     : post?.User?.Image
//                       ? { uri: post?.User?.Image }
//                       : IMG.MessageProfile
//                 }
//                 style={styles.profileImage}
//               />
//             </View>
            
//             <TouchableOpacity
//               onPress={onUserPress}
//               style={{ flex: 1 }}
//               activeOpacity={0.7}
//             >
//               <View style={styles.userNameRow}>
//                 <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
//                   {isNewsItem ? post?.title : post?.User?.UserName}
//                 </Text>
//                 {!isNewsItem && (
//                   <Text style={styles.timeText}>
//                     • {formatInstagramDate(post?.createdAt)}
//                   </Text>
//                 )}
//               </View>
//               <Text 
//                 style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} 
//                 numberOfLines={2}
//               >
//                 {isNewsItem
//                   ? post?.description?.replace(/<[^>]*>/g, '')
//                   : post?.caption}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Post Media */}
//         <TouchableWithoutFeedback onPress={onMediaPress}>
//           <View style={styles.mediaContainer}>
//             {isVideo ? (
//               <View style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: mediaUrl }}
//                   style={styles.postImage}
//                   resizeMode='cover'
//                   repeat={true}
//                   muted={isMuted}
//                   paused={visibleVideoIndex !== index || pausedVideos[index]}
//                 />
//               </View>
//             ) : (
//               <Image
//                 source={{ uri: mediaUrl }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//               />
//             )}

//             {/* Bottom Actions Bar */}
//             <View style={{
//               height: 40,
//               width: '100%',
//               backgroundColor: 'rgba(0, 0, 0, 0.2)',
//               position: 'absolute',
//               bottom: 0,
//               justifyContent: 'center',
//               borderBottomLeftRadius: 20,
//               borderBottomRightRadius: 20
//             }}>
//               {!isNewsItem && (
//                 <View style={styles.actions}>
//                   <View style={styles.leftActions}>
//                     {/* Like Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onLikePress} activeOpacity={0.7}>
//                         {post?.likes?.includes(selector?._id) ? (
//                           <GradientIcon
//                             colors={['#21B7FF', '#0084F8']}
//                             size={20}
//                             iconType='Ionicons'
//                             name={'triangle'}
//                           />
//                         ) : (
//                           <GradientIcon
//                             colors={['#999', '#999']}
//                             size={16}
//                             iconType='Feather'
//                             name={'triangle'}
//                           />
//                         )}
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalLikes}
//                       </Text>
//                     </View>

//                     {/* Dislike Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onDislikePress} activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={post?.Unlikes?.includes(selector?._id) 
//                             ? ['#21B7FF', '#0084F8']
//                             : ['#999', '#999']}
//                           size={16}
//                           iconType='Feather'
//                           name={'triangle'}
//                           style={{ transform: [{ rotate: '180deg' }] }}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalUnLikes}
//                       </Text>
//                     </View>

//                     {/* Comment Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onCommentPress} activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={['#21B7FF', '#0084F8']}
//                           size={16}
//                           iconType='FontAwesome'
//                           name={'comment-o'}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalComents}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Bookmark Button */}
//                   <TouchableOpacity onPress={onBookmarkPress} activeOpacity={0.7}>
//                     {post?.SavedBy?.includes(selector?._id) ? (
//                       <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark'}
//                       />
//                     ) : (
//                       <GradientIcon
//                         colors={['#999', '#999']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark-o'}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Heart Animation */}
//             {!isNewsItem && (
//               <Animated.View pointerEvents='none' style={styles.heartAnimation}>
//                 <Animated.View
//                   style={{
//                     opacity: doubleTapIndex === index ? heartOpacity : 0,
//                     transform: [{ scale: heartScale }],
//                   }}
//                 >
//                   <MaterialIcons name='favorite' size={100} color='#FF1493' />
//                 </Animated.View>
//               </Animated.View>
//             )}

//             {/* Mute/Unmute Button */}
//             {isVideo && (
//               <TouchableOpacity
//                 style={styles.soundButton}
//                 onPress={onMuteToggle}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.soundButtonInner}>
//                   {isMuted ? (
//                     <SpeakerOff />
//                   ) : (
//                     <AntDesign name={'sound'} color='white' size={16} />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>
//         </TouchableWithoutFeedback>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// export default FeedCard;


// FeedCard.js - Glassmorphism with Glowing Border & Stars
// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Animated,
//   StyleSheet,
//   Dimensions
// } from 'react-native';
// import Video from 'react-native-video';
// import GradientIcon from '../../components/GradientIcon';
// import { SpeakerOff } from '../../assets/SVGs';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';

// const { width: screenWidth } = Dimensions.get('window');

// const FeedCard = ({
//   post,
//   index,
//   isNewsItem,
//   isVideo,
//   mediaUrl,
//   visibleVideoIndex,
//   pausedVideos,
//   isMuted,
//   selector,
//   doubleTapIndex,
//   heartOpacity,
//   heartScale,
  
//   onPostPress,
//   onUserPress,
//   onMediaPress,
//   onLikePress,
//   onDislikePress,
//   onCommentPress,
//   onBookmarkPress,
//   onMuteToggle,
//   formatInstagramDate
// }) => {
//   const { isDarkMode } = useSelector(state => state.theme);

//   // Border glow animation
//   const glowAnim = useRef(new Animated.Value(0)).current;
  
//   // Stars animations
//   const star1X = useRef(new Animated.Value(25)).current;
//   const star1Y = useRef(new Animated.Value(40)).current;
//   const star1Opacity = useRef(new Animated.Value(0)).current;
//   const star1Scale = useRef(new Animated.Value(0.8)).current;
  
//   const star2X = useRef(new Animated.Value(screenWidth - 100)).current;
//   const star2Y = useRef(new Animated.Value(100)).current;
//   const star2Opacity = useRef(new Animated.Value(0)).current;
//   const star2Scale = useRef(new Animated.Value(0.8)).current;
  
//   const star3X = useRef(new Animated.Value(screenWidth / 2 - 20)).current;
//   const star3Y = useRef(new Animated.Value(180)).current;
//   const star3Opacity = useRef(new Animated.Value(0)).current;
//   const star3Scale = useRef(new Animated.Value(0.8)).current;

//   const star4X = useRef(new Animated.Value(60)).current;
//   const star4Y = useRef(new Animated.Value(250)).current;
//   const star4Opacity = useRef(new Animated.Value(0)).current;
//   const star4Scale = useRef(new Animated.Value(0.8)).current;

//   useEffect(() => {
//     // Continuous border glow animation
//     const glowAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     );

//     // Star 1 animation - Bubble effect
//     const star1Animation = Animated.loop(
//       Animated.sequence([
//         Animated.parallel([
//           Animated.timing(star1X, { toValue: 45, duration: 2000, useNativeDriver: true }),
//           Animated.timing(star1Y, { toValue: 25, duration: 2000, useNativeDriver: true }),
//           Animated.timing(star1Opacity, { toValue: 0.7, duration: 1000, useNativeDriver: true }),
//           Animated.sequence([
//             Animated.timing(star1Scale, { toValue: 1.5, duration: 800, useNativeDriver: true }),
//             Animated.timing(star1Scale, { toValue: 1.2, duration: 600, useNativeDriver: true }),
//             Animated.timing(star1Scale, { toValue: 1.4, duration: 600, useNativeDriver: true }),
//           ]),
//         ]),
//         Animated.parallel([
//           Animated.timing(star1X, { toValue: 25, duration: 2000, useNativeDriver: true }),
//           Animated.timing(star1Y, { toValue: 40, duration: 2000, useNativeDriver: true }),
//           Animated.timing(star1Opacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
//           Animated.timing(star1Scale, { toValue: 0.5, duration: 1000, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     // Star 2 animation - Bubble effect
//     const star2Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(700),
//         Animated.parallel([
//           Animated.timing(star2X, { toValue: screenWidth - 120, duration: 2200, useNativeDriver: true }),
//           Animated.timing(star2Y, { toValue: 85, duration: 2200, useNativeDriver: true }),
//           Animated.timing(star2Opacity, { toValue: 0.6, duration: 1100, useNativeDriver: true }),
//           Animated.sequence([
//             Animated.timing(star2Scale, { toValue: 1.6, duration: 700, useNativeDriver: true }),
//             Animated.timing(star2Scale, { toValue: 1.3, duration: 600, useNativeDriver: true }),
//             Animated.timing(star2Scale, { toValue: 1.5, duration: 900, useNativeDriver: true }),
//           ]),
//         ]),
//         Animated.parallel([
//           Animated.timing(star2X, { toValue: screenWidth - 100, duration: 2200, useNativeDriver: true }),
//           Animated.timing(star2Y, { toValue: 100, duration: 2200, useNativeDriver: true }),
//           Animated.timing(star2Opacity, { toValue: 0, duration: 1100, useNativeDriver: true }),
//           Animated.timing(star2Scale, { toValue: 0.4, duration: 1100, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     // Star 3 animation - Bubble effect
//     const star3Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(1400),
//         Animated.parallel([
//           Animated.timing(star3X, { toValue: screenWidth / 2 - 5, duration: 2400, useNativeDriver: true }),
//           Animated.timing(star3Y, { toValue: 165, duration: 2400, useNativeDriver: true }),
//           Animated.timing(star3Opacity, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
//           Animated.sequence([
//             Animated.timing(star3Scale, { toValue: 1.8, duration: 900, useNativeDriver: true }),
//             Animated.timing(star3Scale, { toValue: 1.4, duration: 700, useNativeDriver: true }),
//             Animated.timing(star3Scale, { toValue: 1.6, duration: 800, useNativeDriver: true }),
//           ]),
//         ]),
//         Animated.parallel([
//           Animated.timing(star3X, { toValue: screenWidth / 2 - 20, duration: 2400, useNativeDriver: true }),
//           Animated.timing(star3Y, { toValue: 180, duration: 2400, useNativeDriver: true }),
//           Animated.timing(star3Opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
//           Animated.timing(star3Scale, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     // Star 4 animation - Bubble effect
//     const star4Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(2100),
//         Animated.parallel([
//           Animated.timing(star4X, { toValue: 80, duration: 2600, useNativeDriver: true }),
//           Animated.timing(star4Y, { toValue: 235, duration: 2600, useNativeDriver: true }),
//           Animated.timing(star4Opacity, { toValue: 0.65, duration: 1300, useNativeDriver: true }),
//           Animated.sequence([
//             Animated.timing(star4Scale, { toValue: 1.7, duration: 850, useNativeDriver: true }),
//             Animated.timing(star4Scale, { toValue: 1.35, duration: 750, useNativeDriver: true }),
//             Animated.timing(star4Scale, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
//           ]),
//         ]),
//         Animated.parallel([
//           Animated.timing(star4X, { toValue: 60, duration: 2600, useNativeDriver: true }),
//           Animated.timing(star4Y, { toValue: 250, duration: 2600, useNativeDriver: true }),
//           Animated.timing(star4Opacity, { toValue: 0, duration: 1300, useNativeDriver: true }),
//           Animated.timing(star4Scale, { toValue: 0.4, duration: 1300, useNativeDriver: true }),
//         ]),
//       ])
//     );

//     glowAnimation.start();
//     star1Animation.start();
//     star2Animation.start();
//     star3Animation.start();
//     star4Animation.start();

//     return () => {
//       glowAnimation.stop();
//       star1Animation.stop();
//       star2Animation.stop();
//       star3Animation.stop();
//       star4Animation.stop();
//     };
//   }, []);

//   const borderColor = glowAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [
//       isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
//       isDarkMode ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.6)',
//       isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
//     ],
//   });

//   const shadowOpacity = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.2, 0.6],
//   });

//   const styles = StyleSheet.create({
//     feedContainer: {
//       paddingBottom: 12,
//       backgroundColor: isDarkMode ? 'rgba(22, 28, 28, 0.7)' : 'rgba(228, 237, 238, 0.7)',
//       margin: 10,
//       borderRadius: 30,
//       marginBottom: 10,
//       paddingHorizontal: 10,
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     feedHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       paddingHorizontal: 0,
//       paddingVertical: 12,
//     },
//     feedUserInfo: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     profileImageWrapper: {
//       marginRight: 12,
//     },
//     profileImage: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//     },
//     userNameRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 2,
//     },
//     username: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 15,
//     },
//     timeText: {
//       color: '#999',
//       fontSize: 12,
//       marginLeft: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     caption: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       lineHeight: 18,
//     },
//     mediaContainer: {
//       position: 'relative',
//       marginTop: 8,
//     },
//     postImage: {
//       width: '100%',
//       height: 350,
//       borderRadius: 20
//     },
//     videoContainer: {
//       borderRadius: 0,
//       overflow: 'hidden',
//     },
//     heartAnimation: {
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: [{ translateX: -50 }, { translateY: -50 }],
//     },
//     soundButton: {
//       position: 'absolute',
//       bottom: 16,
//       right: 16,
//     },
//     soundButtonInner: {
//       backgroundColor: 'rgba(0, 0, 0, 0.6)',
//       padding: 8,
//       borderRadius: 20,
//       backdropFilter: 'blur(10px)',
//     },
//     actions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//     },
//     leftActions: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 16,
//     },
//     actionButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 6,
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 16,
//       backgroundColor: '#E0E0E0',
//     },
//     actionText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//   });

//   return (
//     <Animated.View
//       style={{
//         margin: 10,
//         borderRadius: 30,
//         borderWidth: 1.5,
//         borderColor: borderColor,
//         shadowColor: isDarkMode ? '#8B5CF6' : '#8B5CF6',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: shadowOpacity,
//         shadowRadius: 15,
//         elevation: 8,
//       }}
//     >
//       <TouchableOpacity
//         style={styles.feedContainer}
//         onPress={onPostPress}
//         activeOpacity={0.98}
//       >
//         {/* Animated Stars */}
//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star1Opacity,
//             transform: [
//               { translateX: star1X },
//               { translateY: star1Y },
//               { scale: star1Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 8, color: isDarkMode ? '#9333ea' : '#7c3aed' }}>✦</Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star2Opacity,
//             transform: [
//               { translateX: star2X },
//               { translateY: star2Y },
//               { scale: star2Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 6, color: isDarkMode ? '#a855f7' : '#8b5cf6' }}>✦</Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star3Opacity,
//             transform: [
//               { translateX: star3X },
//               { translateY: star3Y },
//               { scale: star3Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 10, color: isDarkMode ? '#7c3aed' : '#9333ea' }}>✦</Text>
//         </Animated.View>

//         <Animated.View
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             opacity: star4Opacity,
//             transform: [
//               { translateX: star4X },
//               { translateY: star4Y },
//               { scale: star4Scale },
//             ],
//           }}
//         >
//           <Text style={{ fontSize: 7, color: isDarkMode ? '#8b5cf6' : '#a855f7' }}>✦</Text>
//         </Animated.View>

//         {/* Header */}
//         <View style={styles.feedHeader}>
//           <View style={styles.feedUserInfo}>
//             <View style={styles.profileImageWrapper}>
//               <Image
//                 source={
//                   isNewsItem
//                     ? IMG.MessageProfile
//                     : post?.User?.Image
//                       ? { uri: post?.User?.Image }
//                       : IMG.MessageProfile
//                 }
//                 style={styles.profileImage}
//               />
//             </View>
            
//             <TouchableOpacity
//               onPress={onUserPress}
//               style={{ flex: 1 }}
//               activeOpacity={0.7}
//             >
//               <View style={styles.userNameRow}>
//                 <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
//                   {isNewsItem ? post?.title : post?.User?.UserName}
//                 </Text>
//                 {!isNewsItem && (
//                   <Text style={styles.timeText}>
//                     • {formatInstagramDate(post?.createdAt)}
//                   </Text>
//                 )}
//               </View>
//               <Text 
//                 style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} 
//                 numberOfLines={2}
//               >
//                 {isNewsItem
//                   ? post?.description?.replace(/<[^>]*>/g, '')
//                   : post?.caption}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Post Media */}
//         <TouchableWithoutFeedback onPress={onMediaPress}>
//           <View style={styles.mediaContainer}>
//             {isVideo ? (
//               <View style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: mediaUrl }}
//                   style={styles.postImage}
//                   resizeMode='cover'
//                   repeat={true}
//                   muted={isMuted}
//                   paused={visibleVideoIndex !== index || pausedVideos[index]}
//                 />
//               </View>
//             ) : (
//               <Image
//                 source={{ uri: mediaUrl }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//               />
//             )}

//             {/* Bottom Actions Bar */}
//             <View style={{
//               height: 40,
//               width: '100%',
//               backgroundColor: 'rgba(0, 0, 0, 0.2)',
//               position: 'absolute',
//               bottom: 0,
//               justifyContent: 'center',
//               borderBottomLeftRadius: 20,
//               borderBottomRightRadius: 20
//             }}>
//               {!isNewsItem && (
//                 <View style={styles.actions}>
//                   <View style={styles.leftActions}>
//                     {/* Like Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onLikePress} activeOpacity={0.7}>
//                         {post?.likes?.includes(selector?._id) ? (
//                           <GradientIcon
//                             colors={['#21B7FF', '#0084F8']}
//                             size={20}
//                             iconType='Ionicons'
//                             name={'triangle'}
//                           />
//                         ) : (
//                           <GradientIcon
//                             colors={['#999', '#999']}
//                             size={16}
//                             iconType='Feather'
//                             name={'triangle'}
//                           />
//                         )}
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalLikes}
//                       </Text>
//                     </View>

//                     {/* Dislike Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onDislikePress} activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={post?.Unlikes?.includes(selector?._id) 
//                             ? ['#21B7FF', '#0084F8']
//                             : ['#999', '#999']}
//                           size={16}
//                           iconType='Feather'
//                           name={'triangle'}
//                           style={{ transform: [{ rotate: '180deg' }] }}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalUnLikes}
//                       </Text>
//                     </View>

//                     {/* Comment Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onCommentPress} activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={['#21B7FF', '#0084F8']}
//                           size={16}
//                           iconType='FontAwesome'
//                           name={'comment-o'}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalComents}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Bookmark Button */}
//                   <TouchableOpacity onPress={onBookmarkPress} activeOpacity={0.7}>
//                     {post?.SavedBy?.includes(selector?._id) ? (
//                       <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark'}
//                       />
//                     ) : (
//                       <GradientIcon
//                         colors={['#999', '#999']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark-o'}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Heart Animation */}
//             {!isNewsItem && (
//               <Animated.View pointerEvents='none' style={styles.heartAnimation}>
//                 <Animated.View
//                   style={{
//                     opacity: doubleTapIndex === index ? heartOpacity : 0,
//                     transform: [{ scale: heartScale }],
//                   }}
//                 >
//                   <MaterialIcons name='favorite' size={100} color='#FF1493' />
//                 </Animated.View>
//               </Animated.View>
//             )}

//             {/* Mute/Unmute Button */}
//             {isVideo && (
//               <TouchableOpacity
//                 style={styles.soundButton}
//                 onPress={onMuteToggle}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.soundButtonInner}>
//                   {isMuted ? (
//                     <SpeakerOff />
//                   ) : (
//                     <AntDesign name={'sound'} color='white' size={16} />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>
//         </TouchableWithoutFeedback>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// export default FeedCard;



// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Animated,
//   StyleSheet,
//   Dimensions
// } from 'react-native';
// import Video from 'react-native-video';
// import GradientIcon from '../../components/GradientIcon';
// import { SpeakerOff } from '../../assets/SVGs';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import { useSelector } from 'react-redux';
// import LinearGradient from 'react-native-linear-gradient';
// import IMG from '../../assets/Images';

// const { width: screenWidth } = Dimensions.get('window');

// const FeedCard = ({
//   post,
//   index,
//   isNewsItem,
//   isVideo,
//   mediaUrl,
//   visibleVideoIndex,
//   pausedVideos,
//   isMuted,
//   selector,
//   doubleTapIndex,
//   heartOpacity,
//   heartScale,
  
//   onPostPress,
//   onUserPress,
//   onMediaPress,
//   onLikePress,
//   onDislikePress,
//   onCommentPress,
//   onBookmarkPress,
//   onMuteToggle,
//   formatInstagramDate
// }) => {
//   const { isDarkMode } = useSelector(state => state.theme);

//   // Border glow animation
//   const glowAnim = useRef(new Animated.Value(0)).current;
  
//   // Shine patches
//   const shine1 = useRef(new Animated.Value(0)).current;
//   const shine2 = useRef(new Animated.Value(0)).current;
//   const shine3 = useRef(new Animated.Value(0)).current;

//   // Create 12 stars for more visibility
//   const stars = Array.from({ length: 12 }, (_, i) => ({
//     x: useRef(new Animated.Value(Math.random() * screenWidth)).current,
//     y: useRef(new Animated.Value(50 + Math.random() * 250)).current,
//     opacity: useRef(new Animated.Value(0)).current,
//     scale: useRef(new Animated.Value(0.5)).current,
//   }));

//   useEffect(() => {
//     // Border glow animation
//     const glowAnimation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(glowAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//         Animated.timing(glowAnim, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: false,
//         }),
//       ])
//     );

//     // Shine patches animations
//     const shine1Animation = Animated.loop(
//       Animated.sequence([
//         Animated.timing(shine1, {
//           toValue: 1,
//           duration: 3000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(shine1, {
//           toValue: 0,
//           duration: 3000,
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     const shine2Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(1000),
//         Animated.timing(shine2, {
//           toValue: 1,
//           duration: 3500,
//           useNativeDriver: true,
//         }),
//         Animated.timing(shine2, {
//           toValue: 0,
//           duration: 3500,
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     const shine3Animation = Animated.loop(
//       Animated.sequence([
//         Animated.delay(2000),
//         Animated.timing(shine3, {
//           toValue: 1,
//           duration: 4000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(shine3, {
//           toValue: 0,
//           duration: 4000,
//           useNativeDriver: true,
//         }),
//       ])
//     );

//     // Create animations for all stars
//     const starAnimations = stars.map((star, i) => {
//       const delay = i * 1000;
//       const duration = 2000 + (i % 3) * 500;
//       const moveDistance = 5 + (i % 10);
      
//       return Animated.loop(
//         Animated.sequence([
//           Animated.delay(delay),
//           Animated.parallel([
//             Animated.timing(star.x, {
//               toValue: star.x._value + moveDistance,
//               duration: duration,
//               useNativeDriver: true,
//             }),
//             Animated.timing(star.y, {
//               toValue: star.y._value - moveDistance,
//               duration: duration,
//               useNativeDriver: true,
//             }),
//             Animated.timing(star.opacity, {
//               toValue: 0.8,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//             Animated.sequence([
//               Animated.timing(star.scale, {
//                 toValue: 1.8,
//                 duration: duration / 3,
//                 useNativeDriver: true,
//               }),
//               Animated.timing(star.scale, {
//                 toValue: 1.3,
//                 duration: duration / 4,
//                 useNativeDriver: true,
//               }),
//               Animated.timing(star.scale, {
//                 toValue: 1.6,
//                 duration: duration / 3,
//                 useNativeDriver: true,
//               }),
//             ]),
//           ]),
//           Animated.parallel([
//             Animated.timing(star.x, {
//               toValue: star.x._value,
//               duration: duration,
//               useNativeDriver: true,
//             }),
//             Animated.timing(star.y, {
//               toValue: star.y._value,
//               duration: duration,
//               useNativeDriver: true,
//             }),
//             Animated.timing(star.opacity, {
//               toValue: 0,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//             Animated.timing(star.scale, {
//               toValue: 0.5,
//               duration: duration / 2,
//               useNativeDriver: true,
//             }),
//           ]),
//         ])
//       );
//     });

//     glowAnimation.start();
//     shine1Animation.start();
//     shine2Animation.start();
//     shine3Animation.start();
//     starAnimations.forEach(anim => anim.start());

//     return () => {
//       glowAnimation.stop();
//       shine1Animation.stop();
//       shine2Animation.stop();
//       shine3Animation.stop();
//       starAnimations.forEach(anim => anim.stop());
//     };
//   }, []);

//   const borderColor = glowAnim.interpolate({
//     inputRange: [0, 0.5, 1],
//     outputRange: [
//       isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
//       isDarkMode ? 'rgba(139, 92, 246, 0.9)' : 'rgba(139, 92, 246, 0.7)',
//       isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
//     ],
//   });

//   const shadowOpacity = glowAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.3, 0.7],
//   });

//   const styles = StyleSheet.create({
//     feedContainer: {
//       paddingBottom: 12,
//       backgroundColor: isDarkMode ? 'rgba(22, 28, 28, 0.8)' : 'rgba(228, 237, 238, 0.8)',
//     //   margin: 10,
//       borderRadius: 30,
//       marginBottom: 10,
//       paddingHorizontal: 10,
//       position: 'relative',
//       overflow: 'hidden',
//     },
//     feedHeader: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'flex-start',
//       paddingHorizontal: 0,
//       paddingVertical: 12,
//     },
//     feedUserInfo: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       flex: 1,
//     },
//     profileImageWrapper: {
//       marginRight: 12,
//     },
//     profileImage: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       borderWidth: 2,
//       borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
//     },
//     userNameRow: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginBottom: 2,
//     },
//     username: {
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//       fontSize: 15,
//     },
//     timeText: {
//       color: '#999',
//       fontSize: 12,
//       marginLeft: 6,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//     },
//     caption: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Regular,
//       lineHeight: 18,
//     },
//     mediaContainer: {
//       position: 'relative',
//       marginTop: 8,
//     },
//     postImage: {
//       width: '100%',
//       height: 350,
//       borderRadius: 20
//     },
//     videoContainer: {
//       borderRadius: 0,
//       overflow: 'hidden',
//     },
//     heartAnimation: {
//       position: 'absolute',
//       top: '50%',
//       left: '50%',
//       transform: [{ translateX: -50 }, { translateY: -50 }],
//     },
//     soundButton: {
//       position: 'absolute',
//       bottom: 16,
//       right: 16,
//     },
//     soundButtonInner: {
//       backgroundColor: 'rgba(0, 0, 0, 0.6)',
//       padding: 8,
//       borderRadius: 20,
//       backdropFilter: 'blur(10px)',
//     },
//     actions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       paddingHorizontal: 16,
//     },
//     leftActions: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 16,
//     },
//     actionButton: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       gap: 6,
//       paddingVertical: 4,
//       paddingHorizontal: 8,
//       borderRadius: 16,
//       backgroundColor: '#E0E0E0',
//     },
//     actionText: {
//       fontSize: 14,
//       fontFamily: FONTS_FAMILY.SourceSans3_Medium,
//     },
//   });

//   const starColors = [
//     '#9333ea', '#a855f7', '#7c3aed', '#8b5cf6',
//     '#9333ea', '#a855f7', '#7c3aed', '#8b5cf6',
//     '#9333ea', '#a855f7', '#7c3aed', '#8b5cf6'
//   ];

// //   const starSizes = [10, 8, 12, 7, 9, 11, 8, 10, 9, 7, 11, 8];
//   const starSizes = [6, 5, 7, 4, 6, 8, 6, 7, 6, 4, 8, 6];


//   return (
//     <Animated.View
//       style={{
//         margin: 10,
//         borderRadius: 30,
//         borderWidth: 2,
//         borderColor: borderColor,
//         shadowColor: isDarkMode ? '#8B5CF6' : '#8B5CF6',
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: shadowOpacity,
//         shadowRadius: 20,
//         elevation: 5,
//       }}
//     >
//       <TouchableOpacity
//         style={styles.feedContainer}
//         onPress={onPostPress}
//         activeOpacity={0.98}
//       >
//         {/* Shine Patches */}
//         <Animated.View
//           style={{
//             position: 'absolute',
//             top: 60,
//             left: 40,
//             width: 80,
//             height: 80,
//             borderRadius: 40,
//             backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
//             opacity: shine1,
//             zIndex: 1,
//           }}
//         />
//         <Animated.View
//           style={{
//             position: 'absolute',
//             top: 180,
//             right: 30,
//             width: 100,
//             height: 100,
//             borderRadius: 50,
//             backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.08)',
//             opacity: shine2,
//             zIndex: 1,
//           }}
//         />
//         <Animated.View
//           style={{
//             position: 'absolute',
//             bottom: 100,
//             left: screenWidth / 2 - 60,
//             width: 120,
//             height: 120,
//             borderRadius: 60,
//             backgroundColor: isDarkMode ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.06)',
//             opacity: shine3,
//             zIndex: 1,
//           }}
//         />

//         {/* 12 Animated Stars */}
//         {stars.map((star, i) => (
//           <Animated.View
//             key={i}
//             style={{
//               position: 'absolute',
//               zIndex: 15,
//               opacity: star.opacity,
//               transform: [
//                 { translateX: star.x },
//                 { translateY: star.y },
//                 { scale: star.scale },
//               ],
//             }}
//           >
//             <Text style={{ 
//               fontSize: starSizes[i], 
//               color: starColors[i],
//               textShadowColor: 'rgba(139, 92, 246, 0.5)',
//               textShadowOffset: { width: 0, height: 0 },
//               textShadowRadius: 4,
//             }}>
//               ✦
//             </Text>
//           </Animated.View>
//         ))}

//         {/* Header */}
//         <View style={styles.feedHeader}>
//           <View style={styles.feedUserInfo}>
//             <View style={styles.profileImageWrapper}>
//               <Image
//                 source={
//                   isNewsItem
//                     ? IMG.MessageProfile
//                     : post?.User?.Image
//                       ? { uri: post?.User?.Image }
//                       : IMG.MessageProfile
//                 }
//                 style={styles.profileImage}
//               />
//             </View>
            
//             <TouchableOpacity
//               onPress={onUserPress}
//               style={{ flex: 1 }}
//               activeOpacity={0.7}
//             >
//               <View style={styles.userNameRow}>
//                 <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
//                   {isNewsItem ? post?.title : post?.User?.UserName}
//                 </Text>
//                 {!isNewsItem && (
//                   <Text style={styles.timeText}>
//                     • {formatInstagramDate(post?.createdAt)}
//                   </Text>
//                 )}
//               </View>
//               <Text 
//                 style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} 
//                 numberOfLines={2}
//               >
//                 {isNewsItem
//                   ? post?.description?.replace(/<[^>]*>/g, '')
//                   : post?.caption}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Post Media */}
//         <TouchableWithoutFeedback onPress={onMediaPress}>
//           <View style={styles.mediaContainer}>
//             {isVideo ? (
//               <View style={styles.videoContainer}>
//                 <Video
//                   source={{ uri: mediaUrl }}
//                   style={styles.postImage}
//                   resizeMode='cover'
//                   repeat={true}
//                   muted={isMuted}
//                   paused={visibleVideoIndex !== index || pausedVideos[index]}
//                 />
//               </View>
//             ) : (
//               <Image
//                 source={{ uri: mediaUrl }}
//                 style={styles.postImage}
//                 resizeMode='cover'
//               />
//             )}

//             {/* Bottom Actions Bar */}
//             <View style={{
//               height: 40,
//               width: '100%',
//               backgroundColor: 'rgba(0, 0, 0, 0.2)',
//               position: 'absolute',
//               bottom: 0,
//               justifyContent: 'center',
//               borderBottomLeftRadius: 20,
//               borderBottomRightRadius: 20
//             }}>
//               {!isNewsItem && (
//                 <View style={styles.actions}>
//                   <View style={styles.leftActions}>
//                     {/* Like Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onLikePress} activeOpacity={0.7}>
//                         {post?.likes?.includes(selector?._id) ? (
//                           <GradientIcon
//                             colors={['#21B7FF', '#0084F8']}
//                             size={20}
//                             iconType='Ionicons'
//                             name={'triangle'}
//                           />
//                         ) : (
//                           <GradientIcon
//                             colors={['#999', '#999']}
//                             size={16}
//                             iconType='Feather'
//                             name={'triangle'}
//                           />
//                         )}
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalLikes}
//                       </Text>
//                     </View>

//                     {/* Dislike Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onDislikePress} activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={post?.Unlikes?.includes(selector?._id) 
//                             ? ['#21B7FF', '#0084F8']
//                             : ['#999', '#999']}
//                           size={16}
//                           iconType='Feather'
//                           name={'triangle'}
//                           style={{ transform: [{ rotate: '180deg' }] }}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalUnLikes}
//                       </Text>
//                     </View>

//                     {/* Comment Button */}
//                     <View style={styles.actionButton}>
//                       <TouchableOpacity onPress={onCommentPress} activeOpacity={0.7}>
//                         <GradientIcon
//                           colors={['#21B7FF', '#0084F8']}
//                           size={16}
//                           iconType='FontAwesome'
//                           name={'comment-o'}
//                         />
//                       </TouchableOpacity>
//                       <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
//                         {post?.TotalComents}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Bookmark Button */}
//                   <TouchableOpacity onPress={onBookmarkPress} activeOpacity={0.7}>
//                     {post?.SavedBy?.includes(selector?._id) ? (
//                       <GradientIcon
//                         colors={['#21B7FF', '#0084F8']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark'}
//                       />
//                     ) : (
//                       <GradientIcon
//                         colors={['#999', '#999']}
//                         size={22}
//                         iconType='FontAwesome'
//                         name={'bookmark-o'}
//                       />
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Heart Animation */}
//             {!isNewsItem && (
//               <Animated.View pointerEvents='none' style={styles.heartAnimation}>
//                 <Animated.View
//                   style={{
//                     opacity: doubleTapIndex === index ? heartOpacity : 0,
//                     transform: [{ scale: heartScale }],
//                   }}
//                 >
//                   <MaterialIcons name='favorite' size={100} color='#FF1493' />
//                 </Animated.View>
//               </Animated.View>
//             )}

//             {/* Mute/Unmute Button */}
//             {isVideo && (
//               <TouchableOpacity
//                 style={styles.soundButton}
//                 onPress={onMuteToggle}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.soundButtonInner}>
//                   {isMuted ? (
//                     <SpeakerOff />
//                   ) : (
//                     <AntDesign name={'sound'} color='white' size={16} />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             )}
//           </View>
//         </TouchableWithoutFeedback>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// export default FeedCard;

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions
} from 'react-native';
import Video from 'react-native-video';
import GradientIcon from '../../components/GradientIcon';
import { SpeakerOff } from '../../assets/SVGs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FONTS_FAMILY } from '../../assets/Fonts';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import IMG from '../../assets/Images';

const { width: screenWidth } = Dimensions.get('window');

const FeedCard = ({
  post,
  index,
  isNewsItem,
  isVideo,
  mediaUrl,
  visibleVideoIndex,
  pausedVideos,
  isMuted,
  selector,
  doubleTapIndex,
  heartOpacity,
  heartScale,
  
  onPostPress,
  onUserPress,
  onMediaPress,
  onLikePress,
  onDislikePress,
  onCommentPress,
  onBookmarkPress,
  onMuteToggle,
  formatInstagramDate
}) => {
  const { isDarkMode } = useSelector(state => state.theme);

  // Border glow animation
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Shine patches
  const shine1 = useRef(new Animated.Value(0)).current;
  const shine2 = useRef(new Animated.Value(0)).current;
  const shine3 = useRef(new Animated.Value(0)).current;

  // Create 12 stars for more visibility
  const stars = Array.from({ length: 12 }, (_, i) => ({
    x: useRef(new Animated.Value(Math.random() * screenWidth)).current,
    y: useRef(new Animated.Value(50 + Math.random() * 250)).current,
    opacity: useRef(new Animated.Value(0)).current,
    scale: useRef(new Animated.Value(0.5)).current,
  }));

  useEffect(() => {
    // Border glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    // Shine patches animations
    const shine1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shine1, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shine1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );

    const shine2Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(shine2, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: true,
        }),
        Animated.timing(shine2, {
          toValue: 0,
          duration: 3500,
          useNativeDriver: true,
        }),
      ])
    );

    const shine3Animation = Animated.loop(
      Animated.sequence([
        Animated.delay(2000),
        Animated.timing(shine3, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(shine3, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );

    // Create animations for all stars
    const starAnimations = stars.map((star, i) => {
      const delay = i * 1000;
      const duration = 2000 + (i % 3) * 500;
      const moveDistance = 5 + (i % 10);
      
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(star.x, {
              toValue: star.x._value + moveDistance,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(star.y, {
              toValue: star.y._value - moveDistance,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(star.opacity, {
              toValue: 0.8,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(star.scale, {
                toValue: 1.8,
                duration: duration / 3,
                useNativeDriver: true,
              }),
              Animated.timing(star.scale, {
                toValue: 1.3,
                duration: duration / 4,
                useNativeDriver: true,
              }),
              Animated.timing(star.scale, {
                toValue: 1.6,
                duration: duration / 3,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.parallel([
            Animated.timing(star.x, {
              toValue: star.x._value,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(star.y, {
              toValue: star.y._value,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(star.opacity, {
              toValue: 0,
              duration: duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(star.scale, {
              toValue: 0.5,
              duration: duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    glowAnimation.start();
    shine1Animation.start();
    shine2Animation.start();
    shine3Animation.start();
    starAnimations.forEach(anim => anim.start());

    return () => {
      glowAnimation.stop();
      shine1Animation.stop();
      shine2Animation.stop();
      shine3Animation.stop();
      starAnimations.forEach(anim => anim.stop());
    };
  }, []);

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
      isDarkMode ? 'rgba(139, 92, 246, 0.9)' : 'rgba(139, 92, 246, 0.7)',
      isDarkMode ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.3)',
    ],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const styles = StyleSheet.create({
    feedContainer: {
      paddingBottom: 12,
      backgroundColor: isDarkMode ? 'rgba(22, 28, 28, 0.8)' : 'rgba(228, 237, 238, 0.8)',
      borderRadius: 30,
    //   marginBottom: 10,
      paddingHorizontal: 10,
      position: 'relative',
      overflow: 'hidden',
    },
    feedHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingHorizontal: 0,
      paddingVertical: 12,
    },
    feedUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    profileImageWrapper: {
      marginRight: 12,
    },
    profileImage: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 2,
      borderColor: isDarkMode ? '#1a1a1a' : '#f0f0f0',
    },
    userNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 2,
    },
    username: {
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      fontSize: 15,
    },
    timeText: {
      color: '#999',
      fontSize: 12,
      marginLeft: 6,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    caption: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      lineHeight: 18,
    },
    mediaContainer: {
      position: 'relative',
      marginTop: 8,
    },
    postImage: {
      width: '100%',
      height: 350,
      borderRadius: 20
    },
    videoContainer: {
      borderRadius: 0,
      overflow: 'hidden',
    },
    heartAnimation: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -50 }, { translateY: -50 }],
    },
    soundButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
    },
    soundButtonInner: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: 8,
      borderRadius: 20,
      backdropFilter: 'blur(10px)',
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    leftActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 16,
      backgroundColor: '#E0E0E0',
    },
    actionText: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
    },
  });

  const starColors = [
    '#9333ea', '#a855f7', '#7c3aed', '#8b5cf6',
    '#9333ea', '#a855f7', '#7c3aed', '#8b5cf6',
    '#9333ea', '#a855f7', '#7c3aed', '#8b5cf6'
  ];

  const starSizes = [6, 5, 7, 4, 6, 8, 6, 7, 6, 4, 8, 6];

  return (
    <Animated.View
      style={{
        margin: 10,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: borderColor,
        shadowColor: isDarkMode ? '#8B5CF6' : '#8B5CF6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: shadowOpacity,
        shadowRadius: 20,
        // elevation: 5,
        backgroundColor: isDarkMode 
          ? 'rgba(139, 92, 246, 0.05)' 
          : 'rgba(139, 92, 246, 0.03)',
      }}
    >
      {/* Glass reflection overlay - Top gradient */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.08)'
            : 'rgba(255, 255, 255, 0.25)',
          zIndex: 0,
        }}
      />
      
      {/* Glass border overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 28,
          borderWidth: 1,
          borderColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.3)',
          zIndex: 0,
        }}
      />

      <TouchableOpacity
        style={styles.feedContainer}
        onPress={onPostPress}
        activeOpacity={0.98}
      >
        {/* Shine Patches */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 60,
            left: 40,
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
            opacity: shine1,
            zIndex: 1,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 180,
            right: 30,
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: isDarkMode ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.08)',
            opacity: shine2,
            zIndex: 1,
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 100,
            left: screenWidth / 2 - 60,
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: isDarkMode ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.06)',
            opacity: shine3,
            zIndex: 1,
          }}
        />

        {/* 12 Animated Stars */}
        {stars.map((star, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              zIndex: 15,
              opacity: star.opacity,
              transform: [
                { translateX: star.x },
                { translateY: star.y },
                { scale: star.scale },
              ],
            }}
          >
            <Text style={{ 
              fontSize: starSizes[i], 
              color: starColors[i],
              textShadowColor: 'rgba(139, 92, 246, 0.5)',
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 4,
            }}>
              ✦
            </Text>
          </Animated.View>
        ))}

        {/* Header */}
        <View style={styles.feedHeader}>
          <View style={styles.feedUserInfo}>
            <View style={styles.profileImageWrapper}>
              <Image
                source={
                  isNewsItem
                    ? IMG.MessageProfile
                    : post?.User?.Image
                      ? { uri: post?.User?.Image }
                      : IMG.MessageProfile
                }
                style={styles.profileImage}
              />
            </View>
            
            <TouchableOpacity
              onPress={onUserPress}
              style={{ flex: 1 }}
              activeOpacity={0.7}
            >
              <View style={styles.userNameRow}>
                <Text style={[styles.username, { color: isDarkMode ? '#fff' : '#000' }]}>
                  {isNewsItem ? post?.title : post?.User?.UserName}
                </Text>
                {!isNewsItem && (
                  <Text style={styles.timeText}>
                    • {formatInstagramDate(post?.createdAt)}
                  </Text>
                )}
              </View>
              <Text 
                style={[styles.caption, { color: isDarkMode ? '#ccc' : '#666' }]} 
                numberOfLines={2}
              >
                {isNewsItem
                  ? post?.description?.replace(/<[^>]*>/g, '')
                  : post?.caption}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Media */}
        <TouchableWithoutFeedback onPress={onMediaPress}>
          <View style={styles.mediaContainer}>
            {isVideo ? (
              <View style={styles.videoContainer}>
                <Video
                  source={{ uri: mediaUrl }}
                  style={styles.postImage}
                  resizeMode='cover'
                  repeat={true}
                  muted={isMuted}
                  paused={visibleVideoIndex !== index || pausedVideos[index]}
                />
              </View>
            ) : (
              <Image
                source={{ uri: mediaUrl }}
                style={styles.postImage}
                resizeMode='cover'
              />
            )}

            {/* Bottom Actions Bar */}
            <View style={{
              height: 40,
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20
            }}>
              {!isNewsItem && (
                <View style={styles.actions}>
                  <View style={styles.leftActions}>
                    {/* Like Button */}
                    <View style={styles.actionButton}>
                      <TouchableOpacity onPress={onLikePress} activeOpacity={0.7}>
                        {post?.likes?.includes(selector?._id) ? (
                          <GradientIcon
                            colors={['#21B7FF', '#0084F8']}
                            size={20}
                            iconType='Ionicons'
                            name={'triangle'}
                          />
                        ) : (
                          <GradientIcon
                            colors={['#999', '#999']}
                            size={16}
                            iconType='Feather'
                            name={'triangle'}
                          />
                        )}
                      </TouchableOpacity>
                      <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
                        {post?.TotalLikes}
                      </Text>
                    </View>

                    {/* Dislike Button */}
                    <View style={styles.actionButton}>
                      <TouchableOpacity onPress={onDislikePress} activeOpacity={0.7}>
                        <GradientIcon
                          colors={post?.Unlikes?.includes(selector?._id) 
                            ? ['#21B7FF', '#0084F8']
                            : ['#999', '#999']}
                          size={16}
                          iconType='Feather'
                          name={'triangle'}
                          style={{ transform: [{ rotate: '180deg' }] }}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
                        {post?.TotalUnLikes}
                      </Text>
                    </View>

                    {/* Comment Button */}
                    <View style={styles.actionButton}>
                      <TouchableOpacity onPress={onCommentPress} activeOpacity={0.7}>
                        <GradientIcon
                          colors={['#21B7FF', '#0084F8']}
                          size={16}
                          iconType='FontAwesome'
                          name={'comment-o'}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.actionText, { color: '#7078e2ff' }]}>
                        {post?.TotalComents}
                      </Text>
                    </View>
                  </View>

                  {/* Bookmark Button */}
                  <TouchableOpacity onPress={onBookmarkPress} activeOpacity={0.7}>
                    {post?.SavedBy?.includes(selector?._id) ? (
                      <GradientIcon
                        colors={['#21B7FF', '#0084F8']}
                        size={22}
                        iconType='FontAwesome'
                        name={'bookmark'}
                      />
                    ) : (
                      <GradientIcon
                        colors={['#999', '#999']}
                        size={22}
                        iconType='FontAwesome'
                        name={'bookmark-o'}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Heart Animation */}
            {!isNewsItem && (
              <Animated.View pointerEvents='none' style={styles.heartAnimation}>
                <Animated.View
                  style={{
                    opacity: doubleTapIndex === index ? heartOpacity : 0,
                    transform: [{ scale: heartScale }],
                  }}
                >
                  <MaterialIcons name='favorite' size={100} color='#FF1493' />
                </Animated.View>
              </Animated.View>
            )}

            {/* Mute/Unmute Button */}
            {isVideo && (
              <TouchableOpacity
                style={styles.soundButton}
                onPress={onMuteToggle}
                activeOpacity={0.8}
              >
                <View style={styles.soundButtonInner}>
                  {isMuted ? (
                    <SpeakerOff />
                  ) : (
                    <AntDesign name={'sound'} color='white' size={16} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FeedCard;