import React from 'react';

import {View, StyleSheet} from 'react-native';

export const SpaceBetweenRow = ({children, backgroundColor, style}) => {
  return (
    <View style={[styles.spaceBetweenRow, {backgroundColor}, style]}>
      {children}
    </View>
  );
};

export default SpaceBetweenRow;

const styles = StyleSheet.create({
  spaceBetweenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
