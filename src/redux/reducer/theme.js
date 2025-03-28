import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@app_theme';

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    isDarkMode: false,
    isSystemTheme: true, // Track if we're using system theme
    themeLoaded: false, // Track if theme has been loaded from storage
  },
  reducers: {
    setTheme(state, action) {
      return {
        ...state,
        isDarkMode: action.payload,
        isSystemTheme: false,
        themeLoaded: true,
      };
    },
    setSystemTheme(state, action) {
      return {
        ...state,
        isDarkMode: action.payload,
        isSystemTheme: true,
        themeLoaded: true,
      };
    },
    setThemeLoaded(state, action) {
      return {
        ...state,
        themeLoaded: action.payload,
      };
    },
  },
});

export const { setTheme, setSystemTheme, setThemeLoaded } = themeSlice.actions;

export default themeSlice.reducer;
