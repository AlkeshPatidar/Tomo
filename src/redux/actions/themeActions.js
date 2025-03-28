import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTheme, setSystemTheme, setThemeLoaded } from '../reducer/theme';
import store from '../store';

const { dispatch } = store;

const THEME_STORAGE_KEY = '@app_theme';

// Initialize theme
export const initializeTheme = async () => {
  try {
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme !== null) {
      const themeData = JSON.parse(savedTheme);
      
      if (themeData.isSystemTheme) {
        enableSystemTheme();
      } else {
        dispatch(setTheme(themeData.isDarkMode));
      }
    } else {
      // If no saved theme, default to system theme
      enableSystemTheme();
    }
  } catch (error) {
    console.error('Error loading theme:', error);
    enableSystemTheme(); // Fallback to system theme
  }
};

// Toggle between light and dark mode
export const toggleTheme = async () => {
  const currentState = store.getState().theme;
  const newIsDarkMode = !currentState.isDarkMode;
  
  dispatch(setTheme(newIsDarkMode));
  
  // Save to AsyncStorage
  try {
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        isDarkMode: newIsDarkMode,
        isSystemTheme: false,
      })
    );
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

// Enable system theme
export const enableSystemTheme = async () => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  dispatch(setSystemTheme(isDarkMode));
  
  // Save to AsyncStorage
  try {
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        isDarkMode,
        isSystemTheme: true,
      })
    );
  } catch (error) {
    console.error('Error saving theme:', error);
  }
  
  // Set up listener for system theme changes
  Appearance.addChangeListener(({ colorScheme }) => {
    if (store.getState().theme.isSystemTheme) {
      dispatch(setSystemTheme(colorScheme === 'dark'));
    }
  });
};

// Set specific theme
export const setSpecificTheme = async (isDarkMode) => {
  dispatch(setTheme(isDarkMode));
  
  // Save to AsyncStorage
  try {
    await AsyncStorage.setItem(
      THEME_STORAGE_KEY,
      JSON.stringify({
        isDarkMode,
        isSystemTheme: false,
      })
    );
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};