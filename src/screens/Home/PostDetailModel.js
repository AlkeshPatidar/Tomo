

import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Modal from 'react-native-modal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import Video from 'react-native-video'
import IMG from '../../assets/Images'
import { FONTS_FAMILY } from '../../assets/Fonts'
import color from '../../common/Colors/colors'
import GradientIcon from '../../components/GradientIcon'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

const PostDetailModal = ({
  visible,
  onClose,
  post,
  comments = [],
  isDarkMode = false,
  selector,
  onLikeUnlike,
  onDisLikes,
  SavePost,
  onAddComment,
  formatInstagramDate,
  isMuted,
  setIsMuted,
  setPost,

}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [comment, setComment] = useState('')
  const scrollViewRef = useRef(null)

  React.useEffect(() => {
    // No need for manual animation with react-native-modal
  }, [])

  const handleClose = () => {
    onClose()
  }

  const handleAddComment = () => {
    if (comment.trim()) {
      onAddComment(post?._id, comment.trim())
      setComment('')
    }
  }

  const handleInputFocus = () => {
    // Scroll to bottom when input is focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  if (!post) return null

  const mediaUrl = post?.media
  const isVideo =
    typeof mediaUrl === 'string' &&
    (mediaUrl.includes('.mp4') ||
      mediaUrl.includes('.mov') ||
      mediaUrl.includes('video') ||
      mediaUrl.includes('.avi'))

  const renderComment = ({ item, index }) => (
    <View
      style={[
        styles.commentItem,
        { borderBottomColor: isDarkMode ? '#333' : '#eee' },
      ]}>
      <Image
        source={
          item?.User?.Image ? { uri: item?.User?.Image } : IMG.ProfileImagePost
        }
        style={styles.commentProfileImage}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text
            style={[
              styles.commentUsername,
              { color: isDarkMode ? 'white' : 'black' },
            ]}>
            {item?.User?.UserName || 'User'}
          </Text>
          <Text
            style={[styles.commentTime, { color: isDarkMode ? '#888' : '#666' }]}>
            {formatInstagramDate(item?.createdAt)}
          </Text>
        </View>
        <Text
          style={[styles.commentText, { color: isDarkMode ? '#ddd' : '#333' }]}>
          {item?.text || item?.comment || ''}
        </Text>
      </View>
      <TouchableOpacity style={styles.commentLikeBtn}>
        <MaterialIcons
          name='favorite-border'
          size={16}
          color={isDarkMode ? '#888' : '#666'}
        />
      </TouchableOpacity>
    </View>
  )

  const styles = {

    modalContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingTop: 50, // Status bar padding
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#333' : '#eee',
    },
    closeButton: {
      padding: 4,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDarkMode ? 'white' : 'black',
    },
    moreButton: {
      padding: 4,
    },
    keyboardContainer: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    userAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    userInfo: {
      marginLeft: 12,
      flexDirection: 'row',
      gap: 10
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: isDarkMode ? 'white' : 'black',
    },
    postTime: {
      fontSize: 12,
      marginTop: 2,
      color: isDarkMode ? '#888' : '#666',
    },
    mediaContainer: {
      marginVertical: 0,
    },
    videoWrapper: {
      position: 'relative',
    },
    media: {
      width: screenWidth,
      height: 180,
    },
    soundButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 20,
      padding: 8,
    },
    captionSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#ddd' : '#333',
    },
    captionUsername: {
      fontWeight: '600',
      color: isDarkMode ? 'white' : 'black',
    },
    actionsSection: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      borderWidth: 0.5,
      borderRadius: 18,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderColor: isDarkMode ? '#333' : '#ddd',
    },
    actionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDarkMode ? 'white' : 'black',
    },
    commentsSection: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 16,
    },
    commentsTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      color: isDarkMode ? 'white' : 'black',
    },
    commentItem: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    commentProfileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    commentContent: {
      flex: 1,
      marginLeft: 12,
    },
    commentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    commentUsername: {
      fontSize: 14,
      fontWeight: '600',
    },
    commentTime: {
      fontSize: 12,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 18,
      color: isDarkMode ? '#ddd' : '#333',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    commentLikeBtn: {
      paddingLeft: 8,
    },
    commentInputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? '#333' : '#eee',
      backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
      gap: 12,
    },
    inputProfileImage: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    commentInput: {
      flex: 1,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      maxHeight: 80,
      fontSize: 14,
      backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
      color: isDarkMode ? 'white' : 'black',
    },
    sendButton: {
      borderRadius: 20,
      padding: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageModalOverlay: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageModalClose: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
      padding: 8,
    },
    fullscreenMedia: {
      width: screenWidth,
      height: screenHeight,
    },
  }

  return (
    <>
      <Modal
        isVisible={visible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        // animationInTiming={300}
        // animationOutTiming={250}
        // backdropTransitionInTiming={300}
        // backdropTransitionOutTiming={250}
        style={{ margin: 0 }}
        backdropOpacity={0.9}
        useNativeDriver={true}
        statusBarTranslucent={true}
        onBackdropPress={handleClose}
        onBackButtonPress={handleClose}>
        <StatusBar backgroundColor='transparent' barStyle='light-content' />
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}>
              <MaterialIcons
                name='arrow-back'
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Post</Text>
            <TouchableOpacity style={styles.moreButton}>
              <MaterialIcons
                name='more-vert'
                size={24}
                color={isDarkMode ? 'white' : 'black'}
              />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>

            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}>

              {/* User Info */}
              <View style={styles.userSection}>
                <Image
                  source={
                    post?.User?.Image
                      ? { uri: post?.User?.Image }
                      : IMG.ProfileImagePost
                  }
                  style={styles.userAvatar}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{post?.User?.UserName}</Text>
                  <Text style={styles.postTime}>
                    {formatInstagramDate(post?.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Media */}
              <TouchableOpacity
                onPress={() => setImageModalVisible(true)}
                style={styles.mediaContainer}>
                {isVideo ? (
                  <View style={styles.videoWrapper}>
                    <Video
                      source={{ uri: mediaUrl }}
                      style={styles.media}
                      resizeMode='cover'
                      repeat={true}
                      muted={isMuted}
                      paused={false}
                    />
                    <TouchableOpacity
                      style={styles.soundButton}
                      onPress={e => {
                        e.stopPropagation()
                        setIsMuted(!isMuted)
                      }}>
                      {isMuted ? (
                        <MaterialIcons
                          name='volume-off'
                          size={20}
                          color='white'
                        />
                      ) : (
                        <MaterialIcons
                          name='volume-up'
                          size={20}
                          color='white'
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Image
                    source={{ uri: mediaUrl }}
                    style={styles.media}
                    resizeMode='cover'
                  />
                )}
              </TouchableOpacity>

              {/* Caption */}
              <View style={styles.captionSection}>
                <Text style={styles.caption}>
                  {post?.caption || 'No Caption Added'}
                </Text>
              </View>

              {/* Actions */}
              <View style={styles.actionsSection}>
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      const postId = post._id
                      const userId = selector?._id

                      // ✅ ek hi post ko update karna
                      setPost(prevPost => {
                        if (!prevPost) return prevPost

                        const alreadyLiked = prevPost.likes.includes(userId)
                        const updatedLikes = alreadyLiked
                          ? prevPost.likes.filter(id => id !== userId)
                          : [...prevPost.likes, userId]

                        return {
                          ...prevPost,
                          likes: updatedLikes,
                          TotalLikes: alreadyLiked
                            ? prevPost.TotalLikes - 1
                            : prevPost.TotalLikes + 1,
                        }
                      })

                      onLikeUnlike(post)
                    }}>
                    {/* <MaterialIcons
                        name={
                          post?.likes?.includes(selector?._id)
                            ? 'favorite'
                            : 'favorite-border'
                        }
                        size={20}
                        color={
                          post?.likes?.includes(selector?._id)
                            ? 'red'
                            : isDarkMode
                            ? 'white'
                            : 'black'
                        }
                      /> */}

                    {
                      post?.likes?.includes(selector?._id) ?

                        <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='Ionicons'
                          name={'triangle'}
                        /> :

                        <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='Feather'
                          name={'triangle'}
                        />

                    }
                    <Text style={styles.actionText}>{post?.TotalLikes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onDisLikes(post)}>
                    {/* <Foundation
                      name='dislike'
                      size={20}
                      color={isDarkMode ? 'white' : 'black'}
                    /> */}

                    <GradientIcon
                      colors={['#4F52FE', '#FC14CB']}
                      size={18}
                      iconType='Feather'
                      name={'triangle'}
                      style={{
                        transform: [{ rotate: '180deg' }],
                      }}
                    />

                    <Text style={styles.actionText}>{post?.TotalUnLikes}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    {/* <MaterialIcons
                      name='chat-bubble-outline'
                      size={20}
                      color={isDarkMode ? 'white' : 'black'}
                    /> */}
                      <GradientIcon
                          colors={['#4F52FE', '#FC14CB']}
                          size={18}
                          iconType='FontAwesome'
                          name={'comment-o'}
                        />
                    <Text style={styles.actionText}>{comments.length}</Text>
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={() => SavePost(post)}>
                      <FontAwesome
                        name={
                          post?.SavedBy?.includes(selector?._id)
                            ? 'bookmark'
                            : 'bookmark-o'
                        }
                        size={20}
                        color={isDarkMode ? 'white' : 'black'}
                      />
                    </TouchableOpacity> */}
                </View>
              </View>

              {/* Comments Section */}
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>
                  Comments ({comments.length})
                </Text>

                <FlatList
                  data={comments}
                  keyExtractor={(item, index) => item._id || index.toString()}
                  renderItem={renderComment}
                  scrollEnabled={false}
                  removeClippedSubviews={false}
                  ListEmptyComponent={
                    <Text
                      style={[
                        styles.commentText,
                        { textAlign: 'center', marginTop: 20 },
                      ]}>
                      No Comments Yet!
                    </Text>
                  }
                />
              </View>
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <Image
                source={
                  selector?.Image
                    ? { uri: selector?.Image }
                    : IMG.ProfileImagePost
                }
                style={styles.inputProfileImage}
              />
              <TextInput
                style={styles.commentInput}
                placeholder='Add a comment...'
                placeholderTextColor={isDarkMode ? '#888' : '#666'}
                value={comment}
                onChangeText={setComment}
                onFocus={handleInputFocus}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor: comment.trim()
                      ? '#007AFF'
                      : isDarkMode
                        ? '#333'
                        : '#ddd',
                  },
                ]}
                disabled={!comment.trim()}>
                <MaterialIcons
                  name='send'
                  size={18}
                  color={
                    comment.trim() ? 'white' : isDarkMode ? '#666' : '#999'
                  }
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        isVisible={imageModalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        style={{ margin: 0 }}
        backdropOpacity={1}
        useNativeDriver={true}
        statusBarTranslucent={true}
        onBackdropPress={() => setImageModalVisible(false)}
        onBackButtonPress={() => setImageModalVisible(false)}>
        <StatusBar backgroundColor='black' barStyle='light-content' />
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setImageModalVisible(false)}>
            <MaterialIcons name='close' size={30} color='white' />
          </TouchableOpacity>

          {isVideo ? (
            <Video
              source={{ uri: mediaUrl }}
              style={styles.fullscreenMedia}
              resizeMode='contain'
              repeat={true}
              muted={isMuted}
              paused={false}
            />
          ) : (
            <Image
              source={{ uri: mediaUrl }}
              style={styles.fullscreenMedia}
              resizeMode='contain'
            />
          )}
        </View>
      </Modal>
    </>
  )
}

export default PostDetailModal