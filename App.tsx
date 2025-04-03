
// import React from 'react';
// import { StatusBar, View } from 'react-native';
// import FlashMessage from 'react-native-flash-message';
// import { Provider, useSelector } from 'react-redux';
// import StackNavigation from './src/routes/StackNavigation/route';
// import store from './src/redux/store';
// // import { SellerProvider } from './src/utils/SellerContext';
// import Loader from './src/components/Loader';
// import { ToastAndroid } from 'react-native';
// import color, { App_Primary_color } from './src/common/Colors/colors';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { verticalScale } from 'react-native-size-matters';
// import { PaperProvider } from 'react-native-paper';

// const AppContent = () => {
//     const { isDarkMode } = useSelector(state => state.theme);

//   return (
//     <>
//       <StatusBar
//         barStyle={isDarkMode?'light-content': 'dark-content'}
//         backgroundColor={'transparent'}
//         translucent={true}
//       />
//       {/* <View style={{ paddingTop: verticalScale(40), backgroundColor: statusBarColor }} /> */}
//       <StackNavigation />
//       <FlashMessage position="top" />
//     </>
//   );
// };

// const App = () => {
//   return (
//     <Provider store={store}>
//       <PaperProvider>
//         {/* <SafeAreaView style={{ flex: 1 }}> */}
//           <AppContent />
//         {/* </SafeAreaView> */}

//       </PaperProvider>
//     </Provider>
//   );
// };

// export default App;


import React, { useEffect } from 'react';
import { BackHandler, SafeAreaView, StatusBar } from 'react-native';
import StackNavigation from './src/routes/StackNavigation/route';
import color from './src/common/Colors/colors';
import FlashMessage from 'react-native-flash-message';
import Loader from './src/components/Loader';
import { Provider, useSelector } from 'react-redux';
import store from './src/redux/store';
import { PaperProvider } from 'react-native-paper';



const MainApp = () => {
  const loaderVisible = useSelector(state => state?.loader?.loader);

  return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={color.white}
        />
        <StackNavigation />
        <FlashMessage position="top" />
        <Loader visible={loaderVisible} />
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
