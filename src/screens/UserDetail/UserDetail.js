import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { AddUserIcon, OtionsButtons, PrimaryBackArrow, ThreeDotIcon } from '../../assets/SVGs';
import Row from '../../components/wrapper/row';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';
import LinearGradient from 'react-native-linear-gradient';

const UserDetail = ({ navigation }) => {
    const highlights = [
        { id: '1', title: 'UX Course', image: 'https://picsum.photos/id/237/200/300' },
        { id: '2', title: 'UX Portfolio', image: 'https://picsum.photos/id/237/200/300' },
        { id: '3', title: 'Desk setup', image: 'https://picsum.photos/id/237/200/300' },
        { id: '4', title: 'UX Guide', image: 'https://picsum.photos/id/237/200/300' },
    ];

    const posts = [
        { id: '1', image: 'https://picsum.photos/200/300/?blur=2' },
        { id: '2', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '3', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '4', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '5', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '6', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '7', image: 'https://picsum.photos/200/300/?blur=2' },
        { id: '8', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '9', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '10', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '11', image: 'https://picsum.photos/seed/picsum/200/300' },
        { id: '12', image: 'https://picsum.photos/seed/picsum/200/300' },
    ];

    const renderHighlight = ({ item }) => (
        <View style={styles.highlightContainer}>
            <Image source={{ uri: item.image }} style={styles.highlightImage} />
            <Text style={styles.highlightText}>{item.title}</Text>
        </View>
    );
    const renderHeader = () => (
        <Row style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <PrimaryBackArrow />
            </TouchableOpacity>
            <Text style={styles.headerText}>
                ux_dyniza
            </Text>
        </Row>
    );

    const renderPost = ({ item }) => (
        <Image source={{ uri: item.image }} style={styles.postImage} />
    );

    return (
        <View style={styles.container}>
            {/* HEADER SECTION */}
            {renderHeader()}
            <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />

            <View style={styles.headerContainer}>
                <Image
                    source={{ uri: 'https://picsum.photos/id/237/200/300' }}
                    style={styles.profileImage}
                />
                <View>
                    <Row style={{ marginBottom: 10, gap: 50 }}>
                        <CustomText style={{ color: 'black', fontSize: 20, fontFamily: FONTS_FAMILY.SourceSans3_Bold }}>ux_dyniza</CustomText>
                        <TouchableOpacity>
                            <ThreeDotIcon />
                        </TouchableOpacity>
                    </Row>

                    <View style={styles.headerActions}>

                        <TouchableOpacity >
                            <LinearGradient
                                colors={['#ff00ff', '#6a5acd']}
                                start={{ x: 1, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.followButton}
                            >
                                <Text style={styles.buttonText}>Follow</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.messageButton}
                            onPress={() => navigation.navigate('Chat')}
                        >
                            <Text style={{ ...styles.buttonText, color: 'black' }}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <AddUserIcon />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* BIO SECTION */}
            <View style={styles.bioContainer}>
                <Text style={styles.bioName}>Dyniza <Text style={styles.bioPronoun}>she</Text></Text>
                <Text style={styles.bioDescription}>
                    ✨ UX designer✨{'\n'}
                    🎯 Freelance Design • Lifestyle • Tech{'\n'}
                    📩 DM me for projects and collab{'\n'}
                    🌐 Grab your UX/UI Design guide below{'\n'}
                    🔗 drum.io/uxdyniza
                </Text>
            </View>

            {/* HIGHLIGHTS SECTION */}
            <View>
                <FlatList
                    data={highlights}
                    horizontal
                    renderItem={renderHighlight}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.highlightsList}
                />

            </View>

            {/* STATS SECTION */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>569</Text>
                    <Text style={styles.statLabel}>Posts</Text>
                </View>
                <TouchableOpacity style={styles.statItem}
                    onPress={() => navigation.navigate("Followers")}
                >
                    <Text style={styles.statNumber}>16.7M</Text>
                    <Text style={styles.statLabel}>Followers</Text>
                </TouchableOpacity>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>Following</Text>
                </View>
            </View>

            <OtionsButtons />

            {/* POSTS SECTION */}
            <FlatList
                data={posts}
                numColumns={3}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.postsContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        gap: 90,
    },
    headerText: {
        fontSize: 20,
        fontFamily: FONTS_FAMILY.SourceSans3_Bold,
    },
    highlightedText: {
        color: 'rgba(79, 82, 254, 1)',
    },
    headerContainer: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        gap: 18
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    headerActions: {
        flexDirection: 'row',
        marginLeft: 'auto',
        gap: 10
    },
    followButton: {
        backgroundColor: '#F20089',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    messageButton: {
        backgroundColor: '#E5E5E5',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 14,
        color: '#ffffff',
        fontFamily: FONTS_FAMILY.SourceSans3_Bold
    },
    bioContainer: {
        paddingHorizontal: 16,
    },
    bioName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bioPronoun: {
        fontSize: 14,
        color: '#999999',
    },
    bioDescription: {
        fontSize: 14,
        marginTop: 4,
        color: '#333333',
    },
    highlightsList: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    highlightContainer: {
        alignItems: 'center',
        marginRight: 12,
    },
    highlightImage: {
        width: 56,
        height: 56,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    highlightText: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: FONTS_FAMILY.SourceSans3_Regular
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 12,
        color: '#777',
    },
    postsContainer: {
        paddingHorizontal: 4,
        marginTop: 7
    },
    postImage: {
        width: '32%',
        height: 100,
        margin: 1,
        // borderRadius: 6,
    },
});

export default UserDetail;
