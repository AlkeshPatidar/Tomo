import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IMG from '../../assets/Images';
import { App_Primary_color } from '../../common/Colors/colors';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');




const OnBoarding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
    const navigation = useNavigation();
const { isDarkMode } = useSelector(state => state.theme);

const slides = [
    { id: '1', image:isDarkMode? IMG.OnBoardinDark: IMG.Onboarding1 },
    { id: '2', image:isDarkMode? IMG.OnBoardinDark: IMG.Onboarding1 },
    { id: '3', image:isDarkMode? IMG.OnBoardinDark: IMG.Onboarding1 },
];

    const handleScroll = event => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const goToNextSlide = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current.scrollToIndex({ index: currentIndex + 1, animated: true });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle={isDarkMode?'light-content' :"dark-content"}
            />
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                scrollEnabled={false}  // Disabled gesture scrolling
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                renderItem={({ item }) => (
                    <>
                        <Image source={item.image} style={styles.image} />
                        <TouchableOpacity 
                            style={styles.hiddenTouchable}
                            onPress={goToNextSlide}  // Move to the next slide on press
                        />
                    </>
                )}
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <TouchableOpacity 
                        key={index}
                        onPress={() => flatListRef.current.scrollToIndex({ index, animated: true })}
                        style={[styles.dot, currentIndex === index && styles.activeDot]}
                    />
                ))}
            </View>

            {/* Continue Button (Only on Last Slide) */}
            {currentIndex === slides.length - 1 && (
                <TouchableOpacity 
                style={styles.hiddenTouchable}
                onPress={()=>navigation.navigate('Login')}  // Move to the next slide on press
            />
            )}
        </View>
    );
};

export default OnBoarding;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        width: width,
        height: height,
        resizeMode: 'cover',
        // bottom: 18
    },
    hiddenTouchable: {
        padding: 100,
        backgroundColor: 'transparent',
        zIndex: 1000,
        position: 'absolute',
        right: 0,
        bottom: 30
    },
    pagination: {
        position: 'absolute',
        bottom: 80,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#bbb',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#ff8c00',
        width: 12,
        height: 12,
    },
    continueButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: App_Primary_color,
        paddingVertical: 12,
        paddingHorizontal: 100,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    skipbtn: {
        position: 'absolute',
        backgroundColor: 'white',
        top: 15,
        zIndex: 10000,
        right: 19,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
});
