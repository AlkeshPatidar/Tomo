import React from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import IMG from '../../assets/Images';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { apiDelete } from '../../utils/Apis';
import EmojiSelector from 'react-native-emoji-selector';


const CommentModal = ({
    isVisible,
    onClose,
    comments = [],
    isDarkMode = false,
    onChangeText,
    commentText,
    onSendPress,
    onDeleteComments,
    onBackButtonPress
}) => {

    const [selectedComment, setSelectedComment] = React.useState(null);
    const [isDeleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [commentId, setCommentId] = React.useState(false);
    const [deleteModalPosition, setDeleteModalPosition] = React.useState(0);
    const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);



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
                alignItems: 'center', // 👈 this is the key to center it during animation
            }}
            propagateSwipe={true} // 👈 allows swipe inside scroll
            scrollTo={() => { }} // 👈 prevent warning if not using
            scrollOffset={0}
            scrollOffsetMax={400} // 👈 set according to content height
            swipeThreshold={100}
        // useNativeDriver={true}
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
                            fontFamily: FONTS_FAMILY.SourceSans3_Bold
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

                    // renderItem={({ item }) => (
                    //     <TouchableOpacity
                    //         onLongPress={() => {
                    //             setSelectedComment(item);
                    //             setDeleteModalVisible(true);
                    //             setCommentId(item?._id)
                    //         }}
                    //         activeOpacity={1}
                    //         style={{ flexDirection: 'row', marginBottom: 20 }}
                    //     >
                    //         {console.log('Item:::::::::::::::::::::::',item)
                    //         }
                    //         <Image
                    //             source={item?.profile || IMG.MessageProfile}
                    //             style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                    //         />
                    //         <View style={{ flex: 1 }}>
                    //             <Text style={{ fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' }}>
                    //                 {item?.User?.UserName || 'User'}
                    //             </Text>
                    //             <Text style={{ color: isDarkMode ? '#aaa' : '#333' }}>
                    //                 {item?.text || ''}
                    //             </Text>
                    //         </View>
                    //     </TouchableOpacity>
                    // )}

                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            onLayout={(event) => {
                                const { y } = event.nativeEvent.layout;
                                item.layoutY = y; // store Y position in item
                            }}
                            onLongPress={(event) => {
                                setSelectedComment(item);
                                setCommentId(item?._id);
                                setDeleteModalPosition(item.layoutY); // set modal Y position
                                setDeleteModalVisible(true);
                            }}
                            activeOpacity={1}
                            style={{ flexDirection: 'row', marginBottom: 20 }}
                        >
                            <Image
                                source={item?.profile || IMG.MessageProfile}
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
                />

                {/* <Modal
                    isVisible={isDeleteModalVisible}
                    onBackdropPress={() => setDeleteModalVisible(false)}
                    style={{ justifyContent: 'center', alignItems: 'center', margin: 0 }}
                >
                    <View style={{
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                        // padding: 20,
                        borderRadius: 16,
                        width: '30%',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,0,0,0.1)',
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 12,
                                gap:10
                            }}
                            onPress={() => {
                                // 👇 implement your delete logic here
                                console.log("Delete comment:", selectedComment);
                                onDeleteComments(commentId)
                                setDeleteModalVisible(false);
                            }}
                        >
                            <AntDesign
                                name={'delete'}
                                color={isDarkMode ? 'red' : 'black'}
                                size={14}
                            />
                            <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </Modal> */}

                <Modal
                    isVisible={isDeleteModalVisible}
                    onBackdropPress={() => setDeleteModalVisible(false)}
                    style={{
                        position: 'absolute',
                        top: deleteModalPosition + 100, // adjust +100 based on padding and scroll
                        left: 30,
                        margin: 0,
                    }}
                >
                    <View style={{
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                        borderRadius: 16,
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255,0,0,0.1)',
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 12,
                                gap: 10,
                            }}
                            onPress={() => {
                                onDeleteComments(commentId);
                                setDeleteModalVisible(false);
                            }}
                        >
                            <AntDesign
                                name={'delete'}
                                color={isDarkMode ? 'red' : 'black'}
                                size={14}
                            />
                            <Text style={{ color: 'red', fontWeight: 'bold' }}>Delete</Text>
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
                    borderColor: '#ddd',
                    backgroundColor: isDarkMode ? '#252525' : '#fff',
                }}>
                    <TextInput
                        placeholder="Add a comment..."
                        placeholderTextColor="#999"
                        style={{
                            flex: 1,
                            paddingHorizontal: 10,
                            color: isDarkMode ? 'white' : '#252525'
                        }}
                        value={commentText}
                        onChangeText={onChangeText}
                    />
                    <TouchableOpacity onPress={onSendPress}>
                        <Text style={{ color: '#0A84FF', fontWeight: 'bold' }}>Post</Text>
                    </TouchableOpacity>
                </View>
                {showEmojiPicker && (
                    <View style={{
                        position: 'absolute',
                        bottom: 50, // just above the input
                        left: 0,
                        right: 0,
                        height: 250,
                        backgroundColor: isDarkMode ? '#252525' : '#fff'
                    }}>
                        <EmojiSelector
                            onEmojiSelected={emoji => {
                                onChangeText(commentText + emoji);
                            }}
                            showSearchBar={false}
                            showTabs={true}
                            showHistory={true}
                            columns={8}
                            theme={isDarkMode ? 'dark' : 'light'}
                        />
                    </View>
                )}


            </View>
        </Modal>
    );
};

export default CommentModal;
