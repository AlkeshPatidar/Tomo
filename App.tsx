import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import StackNavigation from './src/routes/StackNavigation/route';
import color from './src/common/Colors/colors';
import FlashMessage from 'react-native-flash-message';
import {Provider} from 'react-redux';
import {PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <PaperProvider>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={color.white}
          // translucent={true}
        />
        <StackNavigation />
        <FlashMessage position="top" />
      </PaperProvider>
    </SafeAreaView>
  );
};

export default App;
