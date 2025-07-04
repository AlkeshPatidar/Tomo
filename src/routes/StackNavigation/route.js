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
import OtherUserDetail from '../../screens/UserDetail/OtherUserDetail';
import StoryScreen from '../../screens/Home/StoryScreen';
import RequestBecomSeller from '../../screens/Seller/RequestBecomSeller';
import Shops from '../../screens/Shops/Shops';
import AddShops from '../../screens/Shops/AddShops';
import SavedPosts from '../../screens/Saved/SavedPosts';
import GalleryPickerScreen from '../../screens/Home/GalleryPicker';
import GalleryForAddPost from '../../screens/Home/GalleryForAddPost';
import Follwing from '../../screens/Followers/Following';
import MarketplaceBuyer from '../../screens/Buyer/BuyerItemList';
import ProductDetail from '../../screens/Buyer/ProductDetail';
import PrivacyPolicy from '../../screens/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from '../../screens/PrivacyPolicy/Terms&Conditions';
import AllProductsOfAShops from '../../screens/Shops/AllProductsOfaShop';
import CreateProducts from '../../screens/Shops/CreateProduct';
import AllPostOfAUser from '../../screens/AllPostOfAUser/AllPostOfaUser';



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
        <Stack.Screen name={'Followings'} component={Follwing} />

        <Stack.Screen name={'OtherUserDetail'} component={OtherUserDetail} />
        <Stack.Screen name={'StoryScreen'} component={StoryScreen} />

        <Stack.Screen name={'RequestBecomSeller'} component={RequestBecomSeller} />
        <Stack.Screen name={'Shops'} component={Shops} />
        <Stack.Screen name={'AllProductsOfAShops'} component={AllProductsOfAShops} />
        <Stack.Screen name={'CreateProducts'} component={CreateProducts} />

        
        
        <Stack.Screen name={'AddShops'} component={AddShops} />
        <Stack.Screen name={'SavedPosts'} component={SavedPosts} />
        <Stack.Screen name={'GalleryPickerScreen'} component={GalleryPickerScreen} />
        <Stack.Screen name={'GalleryForAddPost'} component={GalleryForAddPost} />
        <Stack.Screen name={'MarketplaceBuyer'} component={MarketplaceBuyer} />
        <Stack.Screen name={'ProductDetail'} component={ProductDetail} />
        <Stack.Screen name={'PrivacyPolicy'} component={PrivacyPolicy} />
        <Stack.Screen name={'TermsAndConditions'} component={TermsAndConditions} />
        <Stack.Screen name={'AllPostOfAUser'} component={AllPostOfAUser} />



        
        
        {/* 
     
        <Stack.Screen name={'OtpScreen'} component={OtpScreen} />
        <Stack.Screen name={'FoodDescription'} component={FoodDescription} /> */}

        {/* FrameWorkDetails */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
