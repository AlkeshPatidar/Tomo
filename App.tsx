
import React from 'react';
import { StatusBar, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { Provider, useSelector } from 'react-redux';
import StackNavigation from './src/routes/StackNavigation/route';
import store from './src/redux/store';
// import { SellerProvider } from './src/utils/SellerContext';
import Loader from './src/components/Loader';
import { ToastAndroid } from 'react-native';
import color, { App_Primary_color } from './src/common/Colors/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';
import { PaperProvider } from 'react-native-paper';

const AppContent = () => {
    const { isDarkMode } = useSelector(state => state.theme);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode?'light-content': 'dark-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      {/* <View style={{ paddingTop: verticalScale(40), backgroundColor: statusBarColor }} /> */}
      <StackNavigation />
      <FlashMessage position="top" />
    </>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        {/* <SafeAreaView style={{ flex: 1 }}> */}
          <AppContent />
        {/* </SafeAreaView> */}

      </PaperProvider>
    </Provider>
  );
};

export default App;