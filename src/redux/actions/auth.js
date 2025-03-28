import { clearAsyncStorage } from '../../utils/Apis';
import {removeUser, setIsFirstTime, setUser, setStatusBarColor} from '../reducer/user';
import store from '../store';
const {dispatch} = store;

export const login = data => {
  dispatch(setUser(data));
};

export const isFirstTime = data => {
  dispatch(setIsFirstTime(data));
};

export const logout = async () => {
  dispatch(removeUser());
  await clearAsyncStorage();
};

export const skip = data => {
  dispatch(setSkip(data));
};

export const updateStatusBarColor = data => {
  dispatch(setStatusBarColor(data));
}