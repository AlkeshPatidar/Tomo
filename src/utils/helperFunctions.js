import { ToastAndroid } from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const showSuccess = message => {
  showMessage({type: 'success', icon: 'success', message});
};

export const showError = message => {
  showMessage({type: 'danger', icon: 'danger', message});
};

export const showWarning = message => {
  showMessage({type: 'warning', icon: 'warning', message});
};
export const ToastMsg = msg => {
  ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.CENTER);
};