import React from 'react';
import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Mic, Search } from '../../assets/SVGs';

const searchData = [
    { id: '1', image: 'https://picsum.photos/id/237/200/300' },
    { id: '2', image: 'https://picsum.photos/seed/picsum/200/300' },
    { id: '3', image: 'https://picsum.photos/200/300?grayscale' },
    { id: '4', image: 'https://picsum.photos/200/300/?blur=2' },
    { id: '5', image: 'https://picsum.photos/id/870/200/300?grayscale&blur=2' },
    { id: '6', image: 'https://picsum.photos/200/300?grayscale' },
    { id: '7', image: 'https://picsum.photos/id/237/200/300' },
    { id: '8', image: 'https://picsum.photos/seed/picsum/200/300' },
    { id: '9', image: 'https://picsum.photos/200/300?grayscale' },
    { id: '10', image: 'https://picsum.photos/seed/picsum/200/300' },
    { id: '11', image: 'https://picsum.photos/200/300/?blur=2' },
    { id: '12', image: 'https://picsum.photos/id/237/200/300' },
    { id: '13', image: 'https://picsum.photos/seed/picsum/200/300' },
    { id: '14', image: 'https://picsum.photos/200/300/?blur=2' },
    { id: '15', image: 'https://picsum.photos/id/237/200/300' },
    { id: '16', image: 'https://picsum.photos/seed/picsum/200/300' },
    { id: '17', image: 'https://picsum.photos/200/300/?blur=2' },
    { id: '18', image: 'https://picsum.photos/id/237/200/300' },
];

const SearchScreen = () => {
    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <View style={styles.searchContainer}>
                <Search />
                <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#A0A0A0" />
                <TouchableOpacity>
                    <Mic />
                </TouchableOpacity>
            </View>

            {/* Grid View */}
            <FlatList
            style={{marginBottom:90}}
                data={searchData}
                keyExtractor={(item) => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <TouchableOpacity style={[styles.imageWrapper, index % 9 === 0 ? styles.largeItem : null]}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 30,
        margin: 10,
        padding: 4,
        marginTop:50,
        paddingHorizontal:15
    },
    icon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    imageWrapper: {
        flex: 1,
        margin: 1,
    },
    largeItem: {
        flex: 2,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
});

export default SearchScreen;
