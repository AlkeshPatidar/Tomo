
import React, { ReactNode } from 'react'

import { StyleSheet, View, ViewStyle } from 'react-native'



const Row = ({
    children,
    backgroundColor,
    style,
    justifyContent,
}) => {
    return (
        <View style={[styles.row, { backgroundColor, justifyContent }, style]}>
            {children}
        </View>
    )
};

export default Row;

const styles =StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
})