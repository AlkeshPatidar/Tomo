import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import { App_Primary_color } from '../common/Colors/colors';
import { useSelector } from 'react-redux';

const Loader = ({visible = false}) => {
  const { isDarkMode } = useSelector(state => state.theme);

  return (
    <Modal transparent visible={visible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            padding: 15,
            backgroundColor: 'transparent',
            borderRadius: 12,
            // elevation: 12,
          }}>
          <ActivityIndicator size={'large'} color={isDarkMode?'white':App_Primary_color} />
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
