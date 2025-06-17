
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    StatusBar,
    TouchableWithoutFeedback,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import IMG from "../../assets/Images";
import { Back, More } from "../../assets/SVGs";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import Row from "../../components/wrapper/row";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomText from "../../components/TextComponent";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import { apiGet, apiPut, getItem } from "../../utils/Apis";
import { io } from "socket.io-client";
import moment from "moment";
// import MenuModal from "../../components/Modals/BottomSlider/MenuModel";
// import { ThemeContext } from "../../utils/ThemeContext";
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from "react-redux";


const ChatScreen = ({ route, navigation }) => {
    const { userId, userForChat } = route.params;
    // const { theme } = useContext(ThemeContext);
    const [Userdata, setUserdata] = useState({});
    const [ChatMessages, setChatMessages] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const socket = useRef(null);
    const [menuVisible, setMenuVisible] = useState(false);
    const [haveIBlockedThem, setHaveIBlockedThem] = useState(false);
    const [isBlockedByThem, setIsBlockedByThem] = useState(false);
      const { isDarkMode } = useSelector(state => state.theme);
    

       let selector = useSelector(state => state?.user?.userData);
    if (Object.keys(selector).length != 0) {
        selector = JSON.parse(selector);
    }

    const GetUserId = async () => {
        try {
            setCurrentUserId(selector?._id);
        } catch (error) {
            ToastMsg("Failed to get user ID");
        }
    };

    useEffect(() => {
        GetUserId();
    }, []);


    const GetChatHistory = async () => {
        try {
            const Chat = await apiGet(`${urls.ChatHistory}/${userId}`);
            setChatMessages(Chat?.data)
        } catch (error) {
            ToastMsg('Error fetching user data:')
            console.log('Error fetching user data:', error);
        }
    }

    // const GetUserData = async () => {
    //     try {
    //         const user = await apiGet(`${urls.GetAUserdata}/${userId}`);
    //         setUserdata(user?.data)
    //         const blockedByThem = user?.data?.blockedUsers?.includes(currentUserId);
    //         const iBlockedThem = user?.data?.blockedBy?.includes(currentUserId);
    //         setIsBlockedByThem(blockedByThem);
    //         setHaveIBlockedThem(iBlockedThem);

    //     } catch (error) {
    //         ToastMsg('Error fetching user data:')
    //         console.log('Error fetching user data:', error);
    //     }
    // }


    // const BlockUser = async () => {
    //     try {
    //         const response = await apiPut(`${urls.BlockAUser}/${userId}`);
    //         if (response?.statusCode === 200) {
    //             GetUserData();
    //             ToastMsg(response?.message)
    //         }
    //     } catch (error) {
    //         ToastMsg('Error fetching user data:')
    //         console.log('Error fetching user data:', error);
    //     }
    // }

    // const UnBlockUser = async () => {
    //     try {
    //         const response = await apiPut(`${urls.UnBlockAUser}/${userId}`);
    //         if (response?.statusCode === 200) {
    //             GetUserData();
    //             ToastMsg(response?.message)
    //         }
    //     } catch (error) {
    //         ToastMsg('Error fetching user data:')
    //         console.log('Error fetching user data:', error);
    //     }
    // }

    useEffect(() => {
        if (currentUserId !== null) {
            // GetUserData();
            GetChatHistory();
        }
    }, [userId, currentUserId]);




    useEffect(() => {
        socket.current = io('http://192.168.158.149:8080');

        socket.current.emit("joinRoom", { userId: currentUserId });

        socket.current.on("receiveMessage", (msg) => {
            setChatMessages(prev => [msg, ...prev]);
            socket.current.emit("markAsRead", {
                messageId: msg._id
            });
        });

        return () => {
            socket.current.disconnect();
        };
    }, []);

    console.log('++++++++++++++++', socket);
    

    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;

        const messageData = {
            sender: currentUserId,
            receiver: userId,
            message: inputText,
            type: "text",
            isSent: true,
            isRead: false,
            timestamp: new Date(),
        };

        socket.current.emit("sendMessage", messageData);

        setChatMessages(prev => [
            {
                ...messageData,
                sender: { _id: currentUserId },
            },
            ...prev,
        ]);

        setInputText("");
    };


    const handlePickImage = () => {
        ImagePicker.showImagePicker(
            {
                title: "Select Image",
                mediaType: "photo",
                quality: 0.7,
            },
            (response) => {
                if (!response.didCancel && !response.error) {
                    setSelectedImage(response.uri);
                }
            }
        );
    };

    const renderMessage = ({ item }) => {

        const isMyMessage = item.sender?._id === currentUserId || item.sender === currentUserId;


        return (
            <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
                {/* {!isMyMessage && userForChat?.image && (
                    <Image source={{ uri: userForChat?.image }} style={styles.avatar} />
                )} */}
                <View style={[styles.messageBubble,{backgroundColor:'white'}, isMyMessage && styles.myMessageBubble]}>
                    {item.message && (
                        <Text style={{ ...styles.messageText, color: isMyMessage ? 'white' : 'black' }}>
                            {item.message}
                        </Text>
                    )}
                    <View style={styles.metaContainer}>
                        <Text style={styles.timestamp}>
                            {moment(item.timestamp).format("hh:mm A")}
                        </Text>
                        {isMyMessage && (
                            <Text style={styles.status}>
                                {item.isRead ? "✓✓" : "✓"}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    };


    return (
        <View style={[styles.container, { backgroundColor:isDarkMode?'#252525': 'white' }]}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <SpaceBetweenRow style={{
                paddingHorizontal: 20,
                alignItems: 'center'
            }}>
                <View style={[styles.header, { 
                    // backgroundColor: 'white'
                    backgroundColor:isDarkMode?'#252525': 'white'
                     }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                         <Icon name="arrow-left" size={24} color={isDarkMode? 'white': 'black' } />
                    </TouchableOpacity>
                    <Image source={userForChat?.Image ? { uri: userForChat?.Image} : IMG.ProfileImagePost} style={styles.profileImage} />
                    <View style={styles.headerText}>
                        <Text style={[styles.profileName, { color: isDarkMode? 'white': 'black' }]}>{userForChat?.FullName}</Text>
                        <Text style={[styles.userstatus, { color: isDarkMode? 'white': 'black'  }]}>Active today</Text>
                    </View>
                </View>
                <Row style={{ gap: 10, top: 19 }}>
                    <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                        <Icon name="more-vertical" size={24} color={isDarkMode? 'white': 'black'} />
                    </TouchableOpacity>
                </Row>

            </SpaceBetweenRow>

            <FlatList
                data={ChatMessages}
                keyExtractor={(item, index) => index}
                renderItem={renderMessage}
                style={styles.chatContainer}
                inverted
            />
            <View style={styles.inputContainer}>
                {/* {haveIBlockedThem ? (
                    <View style={styles.blockedInfoContainer}>
                        <CustomText style={[styles.blockedText, { color: 'red' }]}>You blocked this user</CustomText>
                        <TouchableOpacity
                            onPress={() => UnBlockUser()}
                            style={styles.unblockButton}
                        >
                            <CustomText style={styles.unblockText}>Unblock</CustomText>
                        </TouchableOpacity>
                    </View>
                ) : isBlockedByThem ? (
                    <CustomText style={[styles.blockedText, { color: 'red' }]}>You can't message this user</CustomText>
                ) : ( */}
                    <>
                        <TextInput
                            style={[styles.input, { color: isDarkMode? 'white': 'black' ,backgroundColor:'black' }]}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Message"
                            placeholderTextColor={isDarkMode? 'white': 'black' }
                        />
                        <TouchableOpacity
                            onPress={handleSendMessage}
                            style={styles.sendButton}
                        >
                            <CustomText style={{ color: 'white' }}>Send</CustomText>
                        </TouchableOpacity>
                    </>
                {/* )} */}
            </View>

            {/* {menuVisible && (
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={StyleSheet.absoluteFill}>
                        <MenuModal
                            closeMenu={() => setMenuVisible(false)}
                            userId={userId}
                            BlockUser={BlockUser}
                        />
                    </View>
                </TouchableWithoutFeedback>
            )} */}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFF",
    },
    header: {
        // padding: 16,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingTop: 50,
        gap: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    headerText: {
        marginLeft: 10,
    },
    profileName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    userstatus: {
        fontSize: 14,
        color: "#000",
    },
    chatContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    messageContainer: {
        flexDirection: "row",
        marginVertical: 4,
        alignItems: "flex-end",
    },
    myMessage: {
        justifyContent: "flex-end",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#F1F1F1",
        maxWidth: "75%",
    },
    myMessageBubble: {
        backgroundColor: "#4F52FE",
    },
    messageText: {
        color: "#000",
        fontSize: 14,
        fontFamily: FONTS_FAMILY.SourceSans3_Medium
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        backgroundColor: "#F1F1F1",
        borderRadius: 20,
        marginHorizontal: 8,
        fontSize: 16,
        color: 'black'
    },
    metaContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 4,
    },
    timestamp: {
        fontSize: 10,
        color: "gray",
        marginRight: 6,
    },
    status: {
        fontSize: 12,
        color: "white",
    },
    sendButton: {
        backgroundColor: '#4F52FE',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    blockedInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    blockedText: {
        color: 'gray',
        fontSize: 14,
    },
    unblockButton: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: '#4F52FE',
        borderRadius: 20,
    },
    unblockText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },

});



export default ChatScreen;
