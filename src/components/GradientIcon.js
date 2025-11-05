import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

// Import your icon libraries
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'



const GradientIcon = ({ 
  name, 
  size = 24, 
  colors = ['#FF6B6B', '#4ECDC4'], 
  iconType = 'MaterialIcons',
  style = {}
}) => {
  
  // Select icon component based on type
  const getIconComponent = () => {
    switch (iconType) {
      case 'MaterialIcons':
        return MaterialIcons;
      case 'FontAwesome':
        return FontAwesome;
      case 'Ionicons':
        return Ionicons;
      case 'AntDesign':
        return AntDesign;
      case 'Feather':
        return Feather;
      case 'Entypo':
        return Entypo;
             case 'FontAwesome5':
        return FontAwesome5;
      default:
        return MaterialIcons;
    }
  };

  const IconComponent = getIconComponent();

  return (
    <MaskedView
      style={style}
      maskElement={
        <IconComponent
          name={name}
          size={size}
          color="black"
        />
      }
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: size, height: size }}
      />
    </MaskedView>
  );
};

export default GradientIcon;