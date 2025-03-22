import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {verticalScale} from 'react-native-size-matters';
import {white} from '../../common/Colors/colors';
import Home from '../../screens/Home/Home';

import {View} from 'react-native';

import { DeActiveSearch } from '../../assets/SVGs';
import { MidIcon } from '../../assets/SVGs';
import { DeActiveMsg } from '../../assets/SVGs';
import { DeActiveLast } from '../../assets/SVGs';
import { DeActiveHome } from '../../assets/SVGs';
import SearchScreen from '../../screens/Search/SearchFeed';
import MessageList from '../../screens/Message/MessageList';
import Followers from '../../screens/Followers/Followers';

const Tab = createBottomTabNavigator();
function TabNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          // bottom: verticalScale(20),
          height: verticalScale(80),
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 20,
          shadowColor: '#000',
          backgroundColor: white,
          // borderRadius: 16,
          alignSelf: 'center',
          borderTopLeftRadius:20,
          borderTopRightRadius:20
        },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveHome />
              </View>
            ) : (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveHome />
              </View>
            ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveSearch />
              </View>
            ) : (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveSearch />
              </View>
            ),
        }}
      />

      <Tab.Screen
        name="Mid"
        component={Home}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{alignItems: 'center', top: 0, width: 100}}>
                <MidIcon />
              </View>
            ) : (
              <View style={{alignItems: 'center', top: 0, width: 100}}>
                <MidIcon />
              </View>
            ),
        }}
      />

      <Tab.Screen
        name="Msg"
        component={MessageList}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveMsg />
              </View>
            ) : (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveMsg />
              </View>
            ),
        }}
      />
      <Tab.Screen
        name="last"
        component={Followers}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveLast />
              </View>
            ) : (
              <View style={{alignItems: 'center', top: 16, width: 100}}>
                <DeActiveLast />
              </View>
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigation;





