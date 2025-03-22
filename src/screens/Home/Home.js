import React, { useEffect } from "react";
import { FlatList, Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import Row from "../../components/wrapper/row";
import { AddStoryIcon, Back, BookMarkIcon, BottomIndicator, CameraButton, CommentIcon, EmailIcon, EyeIcon, LikeIcon, LockIcon, LoginBtn, NotiFication, ShareIcon, ThreeDotIcon } from "../../assets/SVGs";
import { FONTS_FAMILY } from "../../assets/Fonts";
import CustomInputField from "../../components/CustomInputField";
import SpaceBetweenRow from "../../components/wrapper/spacebetween";


const Home = ({ navigation }) => {


    const renderHeader = () => {
        return (
            <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: 'white', paddingBottom: 15 }}>
                <TouchableOpacity>
                    <CameraButton />
                </TouchableOpacity>
                <CustomText style={{
                    fontSize: 20,
                    fontFamily: FONTS_FAMILY.SourceSans3_Bold
                }}>Explore</CustomText>

                <TouchableOpacity onPress={()=>navigation.navigate('Activity')}>
                    <NotiFication />
                </TouchableOpacity>

            </SpaceBetweenRow>
        )
    }
    const renderStories = () => {
        return (
            <View style={{ paddingVertical: 10, backgroundColor: 'rgba(245, 245, 248, 1)', borderBottomWidth: 1, borderTopWidth: 1, borderColor: 'rgba(219, 219, 219, 1)' }}>
                <FlatList
                    data={storiesData}
                    style={{}}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.storyContainer}>
                            <View style={[styles.storyBorder, item.isOwn && styles.ownStoryBorder]}>
                                <Image source={item.image} style={styles.storyImage} />
                            </View>
                            <Text style={styles.storyText} numberOfLines={1}>{item.name}</Text>
                            {item.isOwn && <AddStoryIcon style={{ position: 'absolute', bottom: 20, right: 10 }} />}
                        </TouchableOpacity>
                    )}
                />

            </View>
        );
    };

    const renderFeeds = () => {
        return (
            <FlatList
                data={feedData}
                style={{marginBottom:90}}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.feedContainer}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.userInfo}>
                                <Image source={item.profileImage} style={styles.profileImage} />
                                <View>
                                    <Text style={styles.username}>{item.username}</Text>
                                    <Text style={styles.audio}>Original audio</Text>
                                </View>
                            </View>
                            <TouchableOpacity>
                                <ThreeDotIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Post Image */}
                        <Image source={item.postImage} style={styles.postImage} />

                        {/* Actions */}
                        <View style={styles.actions}>
                            <View style={styles.leftIcons}>
                                <TouchableOpacity>
                                    <LikeIcon />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <CommentIcon />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <ShareIcon />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity>
                                {/* <Ionicons name="bookmark-outline" size={24} color="black" /> */}
                                <BookMarkIcon />
                            </TouchableOpacity>
                        </View>

                        {/* Likes */}
                        <Text style={styles.likes}>{item.likes} likes</Text>

                        {/* Caption */}
                        <Text style={styles.caption}>
                            <Text style={styles.username}>{item.username} </Text>
                            {item.caption}
                        </Text>

                        {/* Comments */}
                        <Text style={styles.comments}>{item.comments}</Text>

                        {/* Time */}
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                )}
            />
        );
    };


    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {renderHeader()}
            {renderStories()}
            {renderFeeds()}

        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    storyContainer: {
        alignItems: 'center',
        marginRight: 12,
    },
    storyBorder: {
        width: 65,
        height: 65,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#0084ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ownStoryBorder: {
        borderColor: 'transparent',
    },
    storyImage: {
        width: 55,
        height: 55,
        borderRadius: 50,
    },
    storyText: {
        fontSize: 14,
        marginTop: 5,
        color: '#000',
        width: 70,
        textAlign: 'center',
        fontFamily: FONTS_FAMILY.SourceSans3_Bold
    },
    plusIcon: {
        position: 'absolute',
        bottom: 25,
        right: 5,
        backgroundColor: '#0084ff',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    plusText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    feedContainer: {
        // marginBottom: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: 'bold',
    },
    audio: {
        color: 'gray',
        fontSize: 12,
    },
    postImage: {
        width: '100%',
        height: 210,
        resizeMode: 'cover',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    leftIcons: {
        flexDirection: 'row',
        gap: 15,
    },
    likes: {
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    caption: {
        paddingHorizontal: 10,
        fontSize:14,
        fontFamily:FONTS_FAMILY.SourceSans3_Regular
    },
    comments: {
        paddingHorizontal: 10,
        color: 'gray',
        fontFamily:FONTS_FAMILY.SourceSans3_Regular

    },
    time: {
        paddingHorizontal: 10,
        color: 'gray',
        fontSize: 12,
        marginTop: 5,
        fontFamily:FONTS_FAMILY.SourceSans3_Regular

    },
})




const storiesData = [
    { id: '1', name: 'Your story', image: IMG.AddStoryImage, isOwn: true },
    { id: '2', name: 'mkbhd', image: IMG.StoryImage2 },
    { id: '3', name: 'lewisham...', image: IMG.StoryImage1 },
    { id: '4', name: 'defavours', image: IMG.StoryImage2 },
    { id: '5', name: 'leome', image: IMG.StoryImage1 },
];

const feedData = [
    {
        id: '1',
        username: 'spacex',
        profileImage: IMG.ProfileImagePost,
        postImage: IMG.PostImage,
        likes: '112,099',
        caption: 'View from Falcon 9’s second stage during an orbital sunset',
        comments: 'View all 534 comments',
        time: '1 DAY AGO',
    },
    {
        id: '2',
        username: 'spacex',
        profileImage: IMG.ProfileImagePost,
        postImage: IMG.PostImage,
        likes: '112,099',
        caption: 'View from Falcon 9’s second stage during an orbital sunset',
        comments: 'View all 534 comments',
        time: '1 DAY AGO',
    },
    {
        id: '3',
        username: 'spacex',
        profileImage: IMG.ProfileImagePost,
        postImage: IMG.PostImage,
        likes: '112,099',
        caption: 'View from Falcon 9’s second stage during an orbital sunset',
        comments: 'View all 534 comments',
        time: '1 DAY AGO',
    },
];
