import React from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import IMG from '../../assets/Images';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

const { height: screenHeight } = Dimensions.get('window');

const CommentModal = ({
    isVisible,
    onClose,
    comments = [],
    isDarkMode = false,
    onChangeText,
    commentText,
    onSendPress,
    onDeleteComments,
    onEditComment, // New prop for edit functionality
    onBackButtonPress
}) => {

    const [selectedComment, setSelectedComment] = React.useState(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [commentId, setCommentId] = React.useState(false);
    const [deleteModalPosition, setDeleteModalPosition] = React.useState({ x: 0, y: 0 });
    const [isEditing, setIsEditing] = React.useState(false);
    const [editingCommentId, setEditingCommentId] = React.useState(null);
    const [editText, setEditText] = React.useState('');

    const handleEditPress = (comment) => {
        Keyboard.dismiss();
        setTimeout(() => {
            setIsEditing(true);
            setEditingCommentId(comment._id);
            setEditText(comment.text);
            setDeleteModalVisible(false);
        }, 100); // Small delay to ensure keyboard is dismissed
    };

    const handleEditCancel = () => {
        Keyboard.dismiss();
        setIsEditing(false);
        setEditingCommentId(null);
        setEditText('');
    };

    const handleEditSave = async () => {
        if (onEditComment && editText.trim()) {
            try {
                Keyboard.dismiss();
                await onEditComment(editingCommentId, editText.trim());
                setIsEditing(false);
                setEditingCommentId(null);
                setEditText('');
            } catch (error) {
                console.error('Error editing comment:', error);
            }
        }
    };

    const handleLongPress = (event, item) => {
        // Dismiss keyboard first
        Keyboard.dismiss();
        
        const { pageY } = event.nativeEvent;
        // Calculate position relative to modal
        const modalTop = screenHeight * 0.1; // 10% from top (since modal height is 90%)
        const relativeY = pageY - modalTop;
        
        // Ensure the modal doesn't go off screen
        const maxY = screenHeight * 0.7; // Keep some margin from bottom
        const finalY = Math.min(relativeY, maxY);
        
        setSelectedComment(item);
        setCommentId(item?._id);
        setDeleteModalPosition({ 
            x: 50, // Fixed horizontal position 
            y: finalY 
        });
        setDeleteModalVisible(true);
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onBackButtonPress={onBackButtonPress || onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={100}
            animationOutTiming={100}
            style={{
                justifyContent: 'flex-end',
                margin: 0,
                alignItems: 'center',
            }}
            propagateSwipe={true}
            scrollTo={() => { }}
            scrollOffset={0}
            scrollOffsetMax={400}
            swipeThreshold={100}
        >
            <View style={{
                height: '90%',
                backgroundColor: isDarkMode ? '#252525' : '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                padding: 16,
                width: '100%',
            }}>
                {/* Drag Handle */}
                <View style={{
                    height: 5,
                    width: 60,
                    backgroundColor: '#ccc',
                    borderRadius: 3,
                    alignSelf: 'center',
                    marginBottom: 10
                }} />
                
                <View style={{
                    alignItems: 'center'
                }}>
                    <CustomText
                        style={{
                            alignSelf: 'center',
                            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
                            color: isDarkMode ? 'white' : 'black'
                        }}
                    >Comments</CustomText>
                    <View style={{
                        height: 0.5,
                        backgroundColor: 'gray',
                        width: '100%',
                        marginBottom: 20,
                        marginTop: 10
                    }} />
                </View>

                {/* Comments List */}
                <FlatList
                    data={comments}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onLongPress={(event) => handleLongPress(event, item)}
                            activeOpacity={1}
                            style={{ flexDirection: 'row', marginBottom: 20 }}
                        >
                            <Image
                                source={item?.User?.Image ? { uri: item?.User?.Image } : IMG.MessageProfile}
                                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
                                    {item?.User?.UserName || 'User'}
                                </Text>
                                <Text style={{ color: isDarkMode ? '#aaa' : '#333' }}>
                                    {item?.text || ''}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    ListEmptyComponent={<CustomText style={{
                        alignSelf:'center',
                        fontFamily:FONTS_FAMILY.SourceSans3_Medium
                    }}>No Comments Yet!</CustomText>}
                />

                {/* Action Modal (Delete/Edit) */}
                <Modal
                    isVisible={isDeleteModalVisible}
                    onBackdropPress={() => setDeleteModalVisible(false)}
                    style={{
                        position: 'absolute',
                        top: deleteModalPosition.y,
                        left: deleteModalPosition.x,
                        margin: 0,
                    }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    animationInTiming={200}
                    animationOutTiming={200}
                >
                    <View style={{
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                        borderRadius: 16,
                        paddingVertical: 8,
                        paddingHorizontal: 4,
                        minWidth: 140,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                        {/* Edit Option */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                gap: 10,
                            }}
                            onPress={() => handleEditPress(selectedComment)}
                        >
                            <Feather
                                name="edit-3"
                                color={isDarkMode ? '#0A84FF' : '#0A84FF'}
                                size={16}
                            />
                            <Text style={{ 
                                color: isDarkMode ? 'white' : 'black', 
                                fontWeight: '500' 
                            }}>Edit</Text>
                        </TouchableOpacity>

                        {/* Separator */}
                        <View style={{
                            height: 0.5,
                            backgroundColor: isDarkMode ? '#555' : '#ddd',
                            marginHorizontal: 16,
                        }} />

                        {/* Delete Option */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                gap: 10,
                            }}
                            onPress={() => {
                                onDeleteComments(commentId);
                                setDeleteModalVisible(false);
                            }}
                        >
                            <AntDesign
                                name="delete"
                                color="red"
                                size={16}
                            />
                            <Text style={{ color: 'red', fontWeight: '500' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                {/* Input Box */}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    borderTopWidth: 1,
                    borderColor: isDarkMode ? '#444' : '#ddd',
                    backgroundColor: isDarkMode ? '#252525' : '#fff',
                }}>
                    <TextInput
                        placeholder={isEditing ? "Edit comment..." : "Add a comment..."}
                        placeholderTextColor={isDarkMode ? '#777' : '#999'}
                        style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            color: isDarkMode ? 'white' : '#252525',
                            borderWidth: isEditing ? 1 : 0,
                            borderColor: isEditing ? '#0A84FF' : 'transparent',
                            borderRadius: 8,
                            paddingVertical: 8,
                        }}
                        value={isEditing ? editText : commentText}
                        onChangeText={isEditing ? setEditText : onChangeText}
                        multiline={true}
                        maxLength={500}
                    />
                    
                    {isEditing ? (
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity onPress={handleEditCancel}>
                                <Text style={{ color: '#999', fontWeight: 'bold' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleEditSave}>
                                <Text style={{ color: '#0A84FF', fontWeight: 'bold' }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={onSendPress}>
                            <Text style={{ color: '#0A84FF', fontWeight: 'bold' }}>Post</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default CommentModal;