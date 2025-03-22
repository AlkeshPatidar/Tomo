import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../screens/Splash/Splash';
import OnBoarding from '../../screens/Splash/OnBoarding';
import Login from '../../screens/Auth/Login';
import SignUp from '../../screens/Auth/Signup';
import Home from '../../screens/Home/Home';
import TabNavigation from '../TabNavigation.js/TabNavigation';
import ChatScreen from '../../screens/Message/ChatScreen';
import Activity from '../../screens/Activity/Activity';
import UserDetail from '../../screens/UserDetail/UserDetail';
import Followers from '../../screens/Followers/Followers';



const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}>
        <Stack.Screen name={'Splash'} component={Splash} />
        <Stack.Screen name={'Onboarding'} component={OnBoarding} />
        <Stack.Screen name={'Login'} component={Login} />
        <Stack.Screen name={'Singnup'} component={SignUp} />
        {/* <Stack.Screen name={'Home'} component={Home} /> */}
        <Stack.Screen name={'Tab'} component={TabNavigation} />
        <Stack.Screen name={'Chat'} component={ChatScreen} />
        <Stack.Screen name={'Activity'} component={Activity} />

        <Stack.Screen name={'UserDetail'} component={UserDetail} />
        <Stack.Screen name={'Followers'} component={Followers} />


        



        {/* 
     
        <Stack.Screen name={'OtpScreen'} component={OtpScreen} />
        <Stack.Screen name={'FoodDescription'} component={FoodDescription} /> */}

        {/* FrameWorkDetails */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
