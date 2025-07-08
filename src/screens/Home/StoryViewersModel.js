import React, { useState, useRef } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Modal from 'react-native-modal';
import { useSelector } from "react-redux";
import { FONTS_FAMILY } from "../../assets/Fonts";

const StoryViewModel = ({
    showViewers,
    closeViewersModal,
    storyViewers,
}) => {
    const { width, height } = Dimensions.get('window');
    const [scrollOffset, setScrollOffset] = useState(0);
    const { isDarkMode } = useSelector(state => state.theme);

    console.log(JSON.stringify(storyViewers),'___________+++++S+S+S+S+S+S');
    


    const renderViewerItem = ({ item }) => (
        <View style={styles.viewerItem}>
            <Image source={{ uri: item?.Image }} style={styles.viewerImage} />
            <View style={styles.viewerInfo}>
                <Text style={styles.viewerName}>{item?.UserName}</Text>
                <Text style={styles.viewerTime}>{'2 min ago'}</Text>
            </View>
        </View>
    );

    const handleScrollTo = (p) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: p.y, animated: true });
        }
    };

    const handleSwipeComplete = () => {
        // Only close if we're at the top and trying to swipe down
        if (scrollOffset <= 0) {
            closeViewersModal();
        }
    };

    const flatListRef = useRef(null);


    const styles = StyleSheet.create({
        modalStyle: {
            justifyContent: 'flex-end',
            margin: 0,
        },
        modalContent: {
            backgroundColor: isDarkMode ? '#252525' : 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: Dimensions.get('window').height * 0.8,
            minHeight: 200,
        },
        dragHandle: {
            width: 40,
            height: 4,
            backgroundColor: '#ccc',
            borderRadius: 2,
            alignSelf: 'center',
            marginTop: 8,
            marginBottom: 10,
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#f0f0f0',
        },
        modalTitle: {
            fontSize: 18,
            fontFamily: FONTS_FAMILY.SourceSans3_Bold,
            color: isDarkMode ? 'white' : 'black',
        },
        modalCloseButton: {
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
        modalCloseText: {
            fontSize: 24,
            color: isDarkMode ? 'white' : '#999',
            fontWeight: '300',
        },
        viewersList: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        viewerItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
        },
        viewerImage: {
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: 15,
            backgroundColor: '#f0f0f0',
        },
        viewerInfo: {
            flex: 1,
        },
        viewerName: {
            fontSize: 14,
            fontFamily: FONTS_FAMILY.SourceSans3_Medium,
            color: isDarkMode ? "white" : 'black',
            marginBottom: 2,

        },
        viewerTime: {
            fontSize: 12,
            color: '#666',
        },
    });

    return (
        <Modal
            isVisible={showViewers}
            swipeDirection="down"
            animationIn="slideInUp"
            animationOut="slideOutDown"
            animationInTiming={300}
            animationOutTiming={300}
            onBackButtonPress={closeViewersModal}
            onSwipeComplete={handleSwipeComplete}
            onBackdropPress={closeViewersModal}
            style={styles.modalStyle}
            propagateSwipe={true}
            scrollTo={handleScrollTo}
            scrollOffset={scrollOffset}
            scrollOffsetMax={400}
            swipeThreshold={100}
            useNativeDriver={false}
            hideModalContentWhileAnimating={false}
            avoidKeyboard={true}
        >
            <View style={styles.modalContent}>
                {/* Drag Handle */}
                <TouchableOpacity
                    style={styles.dragHandle}
                    onPress={closeViewersModal}
                    activeOpacity={0.7}
                />

                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Viewers</Text>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={closeViewersModal}
                    >
                        <Text style={styles.modalCloseText}>×</Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={storyViewers}
                    renderItem={renderViewerItem}
                    keyExtractor={(item) => item.id}
                    style={styles.viewersList}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    onScroll={(event) => {
                        setScrollOffset(event.nativeEvent.contentOffset.y);
                    }}
                    scrollEventThrottle={16}
                />
            </View>
        </Modal>
    );
};



export default StoryViewModel;