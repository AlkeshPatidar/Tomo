import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/FontAwesome';
import color from '../common/Colors/colors';

const {width: screenWidth} = Dimensions.get('window');

const CustomCarousel = ({
  images,
  carouselHeight = '100%',
  carouselWidth,
  isPagination = true,
  isHorizontalButton = false,
  isAutoplay = true,
  scrollEnabled = true,
  customeRenderItem,
}) => {
  const [active, setActive] = useState(0);
  const carouselRef = React.useRef(null);

  const renderItem = ({item, index}) => (
    <View style={[styles.imageContainer]}>
      <Image
        source={item?.imageUrl}
        style={[styles.image, {height: carouselHeight}]}
        resizeMode="cover"
      />
    </View>
  );

  const goToPrev = () => {
    if (carouselRef?.current && active > 0) {
      carouselRef?.current?.snapToPrev();
    }
  };

  const goToNext = () => {
    if (carouselRef?.current && active < images?.length - 1) {
      carouselRef?.current?.snapToNext();
    }
  };
  return (
    <View>
      {/* <GestureHandlerRootView> */}
      {/* <NativeViewGestureHandler disallowInterruption={true}> */}
      <View style={styles.carouselContainer}>
        {isHorizontalButton && (
          <TouchableOpacity
            disabled={0 === active}
            style={{...styles.leftButton, opacity: 0 === active ? 0.4 : 1}}
            onPress={goToPrev}>
            <Icon name={'angle-left'} size={33} color={'white'} />
          </TouchableOpacity>
        )}
        <Carousel
          ref={carouselRef}
          data={images}
          renderItem={customeRenderItem || renderItem}
          sliderWidth={carouselWidth || screenWidth}
          itemWidth={carouselWidth || screenWidth - 70}
          autoplay={isAutoplay}
          scrollEnabled={scrollEnabled}
          autoplayInterval={2000}
          loop={true}
          onSnapToItem={i => setActive(i)}
          useScrollView={true}
          keyExtractor={(item, index) => index.toString()}
        />
        {isHorizontalButton && (
          <TouchableOpacity
            style={{
              ...styles.rightButton,
              opacity: active === images?.length - 1 ? 0.4 : 1,
            }}
            onPress={goToNext}>
            <Icon name={'angle-right'} size={33} color={'white'} />
          </TouchableOpacity>
        )}
      </View>
      {/* </NativeViewGestureHandler> */}
      {/* </GestureHandlerRootView> */}
      {images && images?.length >= 2 && isPagination && (
        <Pagination
          dotsLength={images?.length || 0}
          activeDotIndex={active}
          containerStyle={{
            position: 'absolute',
            bottom: '-4%',
            alignSelf: 'center',
            columnGap: 0,
          }}
          dotStyle={{
            width: 35,
            height: 7,
            borderRadius: 5,
            backgroundColor: '#fff',
          }}
          inactiveDotStyle={{
            backgroundColor: '#fff',
            width: 7,
            height: 7,
          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  leftButton: {
    position: 'absolute',
    left: 8,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  rightButton: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  imageContainer: {
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default CustomCarousel;
