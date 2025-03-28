import {createSlice} from '@reduxjs/toolkit';
import { App_Primary_color } from '../../common/Colors/colors';

export const userSlice = createSlice({
  name: 'userData',
  initialState: {
    userData: {},
    login: false,
    isFreeAccess: true,
    isFirstTime: true,
    skip: false,
    statusBarBGColor: App_Primary_color
  },
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      return {...state, userData: user, login: true};
    },
    removeUser(state, action) {
      return {...state, userData: {}, login: false};
    },
    setIsFirstTime(state, action) {
      return {...state, isFirstTime: action.payload};
    },
    setSkip(state, action) {
      return {...state, skip: action.payload};
    },
    setStatusBarColor(state, action) {
      return { ...state, statusBarBGColor: action.payload };
    }
  },
});

export const {setUser, removeUser, setIsFirstTime, setSkip, setStatusBarColor} = userSlice.actions;

export default userSlice.reducer;
