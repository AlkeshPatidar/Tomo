import React, { useEffect } from 'react';
import { StatusBar, View, Platform, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';  // Import the gradient component

// This component renders the Gradient over the StatusBar area
const GradientStatusBar = () => {
  return (
    <View style={styles.statusBarContainer}>
      <LinearGradient
         colors={['rgba(86, 105, 255, 1)', 'rgba(247, 3, 208, 1)']} // Default gradient
         start={{ x: 0, y: 0 }} // Adjust the gradient start position (optional)
         end={{ x: 1.5, y: 0.5 }}  // Gradient colors you want
        style={styles.gradientStatusBar}
      />
    </View>
  );
};

const useStatusBar = (backgroundColor, barStyle = 'default') => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBackgroundColor(backgroundColor);  // This will set the background color of the status bar
      StatusBar.setBarStyle(barStyle);  // This controls the color of the status bar text/icons
    }
  }, [isFocused, backgroundColor, barStyle]);
};

const styles = StyleSheet.create({
  statusBarContainer: {
    // StatusBar height varies depending on the device and platform
    height: Platform.OS === 'ios' ? 44 : 5,  // Adjust for iOS and Android
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,  // To ensure it appears on top of everything else
  },
  gradientStatusBar: {
    flex: 1,  // Ensure the gradient fills the entire area
  },
});

export { useStatusBar, GradientStatusBar };

