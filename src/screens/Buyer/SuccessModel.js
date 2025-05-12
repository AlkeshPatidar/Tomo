// SuccessModal.js

import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { App_Primary_color } from '../../common/Colors/colors';

const SuccessModal = ({ visible, onClose }) => {
//   const colorScheme = useColorScheme();
const { isDarkMode } = useSelector(state => state.theme);


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.modal, isDarkMode && styles.darkModal]}>
          <Text style={[styles.text, isDarkMode && styles.darkText]}>
            Purchase Successful!
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  darkModal: {
    backgroundColor: '#252525',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  darkText: {
    color: '#fff',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: App_Primary_color,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
