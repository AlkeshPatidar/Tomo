import {Dimensions} from 'react-native';
import Carousel from 'react-native-snap-carousel';

const {width: screenWidth} = Dimensions.get('window');
const CardCarousel = ({renderItem, data}) => {
  return (
    <Carousel
      data={data || []}
      renderItem={renderItem ? renderItem : <></>}
      sliderWidth={screenWidth}
      itemWidth={screenWidth - 130}
      inactiveSlideScale={1}
      inactiveSlideOpacity={1}
      firstItem={0}
      contentContainerCustomStyle={{paddingLeft: 0}}
      enableSnap={false}
    />
  );
};

export default CardCarousel;
