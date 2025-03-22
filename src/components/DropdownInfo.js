import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import color from '../common/Colors/colors';
import {FONTS_FAMILY} from '../assets/Fonts';
import CustomText from './TextComponent';
import {ArrowDown, ArrowUp} from '../assets/SVGs';
import {Divider, TouchableRipple} from 'react-native-paper';

// Default data can be passed as a prop
const DropdownInfo = ({data = '', placeholder}) => {
  const [selected, setSelected] = useState(false);
  return (
    <View style={{...styles.container}}>
      <TouchableRipple
        style={styles.dropdown}
        onPress={() => {
          setSelected(!selected);
        }}>
        <>
          <CustomText style={styles.placeholderStyle}>
            {placeholder || ''}
          </CustomText>
          {selected ? <ArrowUp /> : <ArrowDown />}
        </>
      </TouchableRipple>
      {selected && (
        <View style={styles.childPosition}>
          <CustomText style={styles.itemText}>{data || ''}</CustomText>
        </View>
      )}
      <Divider style={{height: 0.8, backgroundColor: '#E6E6E6'}} />
    </View>
  );
};

export default DropdownInfo;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
  },
  childPosition: {
    // position: 'absolute',
    // top: 48,
    backgroundColor: color.white,
    zIndex: 1,
    paddingBottom: 10,
  },
  placeholderStyle: {
    fontSize: 14,
    color: color.black,
    fontFamily: FONTS_FAMILY.OpenSans_SemiBold,
  },
  itemText: {
    fontSize: 15,
    fontFamily: FONTS_FAMILY.OpenSans_Regular,
    color: '#757575',
    lineHeight: 20,
  },
});
