import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    StatusBar,
} from "react-native";
import ImagePicker from "react-native-image-picker";
import IMG from "../../assets/Images";
import { Flag, Info, PrimaryBackArrow, PrimaryBackWhite, Video } from "../../assets/SVGs";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";
import Row from "../../components/wrapper/row";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomText from "../../components/TextComponent";
import color, { white } from "../../common/Colors/colors";
import { useSelector } from "react-redux";
// import { Ionicons } from "@expo/vector-icons"; // For icons

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([
        {
            id: "1",
            text: "Hi David! I saw your work and really am a big fan of your design",
            sender: "other",
            time: "12:40 AM",
        },
        {
            id: "2",
            text: "Thank you! 😊",
            sender: "me",
            time: "12:41 AM",
        },
        {
            id: "3",
            text: "Are you free for UI work?",
            sender: "other",
            time: "12:42 AM",
        },
        {
            id: "4",
            text: "I have no availability before September",
            sender: "me",
            time: "12:43 AM",
        },
        {
            id: "5",
            text: "We need some urgent basis. Thanks",
            sender: "other",
            time: "12:45 AM",
        },
        {
            id: "6",
            text: "Maybe for a next project alors!",
            sender: "me",
            time: "12:46 AM",
            avatar: "https://via.placeholder.com/40", // Example avatar
        },
    ]);

    const [inputText, setInputText] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle sending message
    const handleSendMessage = () => {
        if (inputText.trim() || selectedImage) {
            const newMessage = {
                id: Date.now().toString(),
                text: inputText.trim(),
                sender: "me",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                image: selectedImage,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInputText("");
            setSelectedImage(null);
        }
    };

    // Handle picking image
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
        const isMyMessage = item.sender === "me";

        return (
            <View style={[styles.messageContainer, isMyMessage && styles.myMessage]}>
                {item.avatar && !isMyMessage && (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                )}
                <View style={[styles.messageBubble, isMyMessage && styles.myMessageBubble]}>
                    {item.text && <Text style={{ ...styles.messageText, color: item?.sender == 'me' ? 'white' : isDarkMode ? 'white' : 'black' }}>{item.text}</Text>}
                    {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
                </View>
            </View>
        );
    };
    const { isDarkMode } = useSelector(state => state.theme);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDarkMode ? 'black' : "#FFFF",
        },
        header: {
            // padding: 16,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isDarkMode ? 'black' : "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#EEE",
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
        status: {
            fontSize: 14,
            color: "#999",
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
            backgroundColor: isDarkMode ? '#252525' : "#F1F1F1",
            maxWidth: "75%",
        },
        myMessageBubble: {
            backgroundColor: "#4F52FE",
        },
        messageText: {
            color: isDarkMode ? 'white' : "#000",
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
            backgroundColor: isDarkMode ? "#252525" : "#F1F1F1",
            borderRadius: 20,
            marginHorizontal: 8,
            fontSize: 16,
            color: isDarkMode ? white : 'black'
        },
    });

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {/* Chat Header */}
            <SpaceBetweenRow style={{
                paddingHorizontal: 20,
                alignItems: 'center'
            }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
                    </TouchableOpacity>
                    <Image source={IMG.MessageProfile} style={styles.profileImage} />
                    <View style={styles.headerText}>
                        <Text style={styles.profileName}>Brian</Text>
                        <Text style={styles.status}>Active today</Text>
                    </View>
                </View>
                <Row style={{ gap: 10, top: 19 }}>
                    <TouchableOpacity>
                        <Video />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Flag />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Info />
                    </TouchableOpacity>
                </Row>

            </SpaceBetweenRow>

            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                style={styles.chatContainer}
                inverted // To show the latest messages at the bottom
            />

            {/* Input Box */}
            <View style={styles.inputContainer}>
                <TouchableOpacity onPress={handlePickImage}>
                    {/* <Ionicons name="camera-outline" size={28} color="#555" /> */}
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Message"
                    placeholderTextColor={'gray'}
                />
                <TouchableOpacity onPress={handleSendMessage}
                    style={{ backgroundColor: '#4F52FE', padding: 8, borderRadius: 8 }}
                >
                    {/* <Ionicons name="send" size={28} color="#4F52FE" /> */}
                    <CustomText style={{ color: 'white' }}>Send</CustomText>
                </TouchableOpacity>
            </View>
        </View>
    );
};



export default ChatScreen;
