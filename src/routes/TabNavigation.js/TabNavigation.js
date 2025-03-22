import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { verticalScale } from 'react-native-size-matters';
import { white } from '../../common/Colors/colors';
import Home from '../../screens/Home/Home';

import { TouchableOpacity, View } from 'react-native';

import { ActiveHome, ActiveMessage, ActiveSearch, DeActiveSearch, TabBottomLine } from '../../assets/SVGs';
import { MidIcon } from '../../assets/SVGs';
import { DeActiveMsg } from '../../assets/SVGs';
import { DeActiveLast } from '../../assets/SVGs';
import { DeActiveHome } from '../../assets/SVGs';
import SearchScreen from '../../screens/Search/SearchFeed';
import MessageList from '../../screens/Message/MessageList';
import Followers from '../../screens/Followers/Followers';
import OptionModal from '../AddPostModel';

const Tab = createBottomTabNavigator();
function TabNavigation() {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
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
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            // borderRadius: 16,
            alignSelf: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 1
          },
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
                  <ActiveHome />
                  <TabBottomLine style={{ top: 30 }} />
                </View>
              ) : (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
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
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
                  <ActiveSearch />
                  <TabBottomLine style={{ top: 30 }} />

                </View>
              ) : (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
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
            tabBarIcon: ({ focused }) =>
              focused ? (
                <TouchableOpacity style={{ alignItems: 'center', top: 0, width: 100 }}
                onPress={() => setModalVisible(true)}
                >
                  <MidIcon />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ alignItems: 'center', top: 0, width: 100 }}
                onPress={() => setModalVisible(true)}
                >
                  <MidIcon />
                </TouchableOpacity>
              ),
          }}
        />

        <Tab.Screen
          name="Msg"
          component={MessageList}
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
                  <ActiveMessage />
                  <TabBottomLine style={{ top: 30 }} />

                </View>
              ) : (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
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
            tabBarIcon: ({ focused }) =>
              focused ? (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
                  <DeActiveLast />
                  <TabBottomLine style={{ top: 30 }} />

                </View>
              ) : (
                <View style={{ alignItems: 'center', top: 16, width: 100 }}>
                  <DeActiveLast />
                </View>
              ),
          }}
        />
      </Tab.Navigator>
      <OptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </>
  );
}

export default TabNavigation;








