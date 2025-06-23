


import React, { useEffect } from 'react';
import { ActivityIndicator, BackHandler, SafeAreaView, StatusBar } from 'react-native';
import StackNavigation from './src/routes/StackNavigation/route';
import color from './src/common/Colors/colors';
import FlashMessage from 'react-native-flash-message';
import Loader from './src/components/Loader';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';


const MainApp = () => {
  const loaderVisible = useSelector(state => state?.loader?.loader);
  // Check for existence
 useEffect(()=>{
   if (!BackHandler.removeEventListener) {
    BackHandler.removeEventListener = () => { };
  }
 },[])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={color.white}
      />
      <StackNavigation />
      <FlashMessage position="top" />
      <Loader visible={loaderVisible} />
      {/* { loaderVisible &&<ActivityIndicator size={'large'} color={'white'}/>} */}
    </SafeAreaView>
  );
};

const App = () => {





  return (
    <PaperProvider>
      <Provider store={store}>
        <MainApp />
      </Provider>
    </PaperProvider>
  );
};

export default App;
