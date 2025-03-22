import React from 'react';
import {
  View,
  SafeAreaView,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
// import getStyles from './bottomSlider.styles';
import getStyles from './BottomSliderStyles';
import {TouchableRipple} from 'react-native-paper';
import {ModalClose} from '../../../assets/SVGs';

const {height, width} = Dimensions.get('window');

const BottomSlider = ({
  isOpen,
  children,
  onClose,
  outerPress,
  isPotrait,
  sliderHeight = 0.5,
  sliderStyles = {},
  isShowClose = true,
  sliderBackgroundStyles = {},
}) => {
  const {bottomSheet, innerView, crossButton} = getStyles(isPotrait);

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      onRequestClose={onClose}
      animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        {/* <TouchableWithoutFeedback onPress={outerPress}> */}
          <SafeAreaView style={bottomSheet}>
            {/* <TouchableWithoutFeedback onPress={null}> */}
              <View
                style={[
                  innerView,
                  isPotrait && {height: height * sliderHeight},
                  sliderStyles,
                ]}>
                {isShowClose && (
                  <TouchableRipple
                    onPress={() => {
                      onClose()
                    }}
                    style={[crossButton]}>
                    <ModalClose />
                  </TouchableRipple>
                )}

                {children}
              </View>
            {/* </TouchableWithoutFeedback> */}
          </SafeAreaView>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default BottomSlider;
