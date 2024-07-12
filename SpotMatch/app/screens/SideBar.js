import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './SideBarScreen/ProfileScreen';
import RequestsScreen from './SideBarScreen/RequestsScreen';
import Matches from './SideBarScreen/Matches';
import Settings from './SideBarScreen/Settings';
import HelpScreen from './SideBarScreen/HelpScreen';
import LogoutScreen from './SideBarScreen/LogoutScreen';
import DeleteAccScreen from './SideBarScreen/DeleteAccScreen';
import MatchScreen from './MatchScreen';
import DiscoverScreen from './DiscoverScreen';
import ChatListScreen from './ChatListScreen';
import EventsScreen from './EventsScreen';
import NavigationTab from './NavigationTab';
import CustomDrawerContent from './CustomDrawerContent';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import MatchesProfileScreen from './SideBarScreen/MatchesProfileScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const HeaderLeftChevron = ({ navigation }) => (
  <TouchableOpacity
    onPress={() => {
      navigation.goBack();
      setTimeout(() => {
        navigation.openDrawer();
      }, 0); // Delay to ensure drawer opens after navigating back
    }}
  >
    <Feather name="chevron-left" size={24} />
  </TouchableOpacity>
);

function InsideLayout({ navigation }) {
  return (
    <Tab.Navigator
      tabBar={props => <NavigationTab {...props} />}
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={24} />
          </TouchableOpacity>
        ),
      }}
    >
      <Tab.Screen name="Match" component={MatchScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
}

const SideBar = () => {
  return (
    <Drawer.Navigator
      initialRouteName="InsideLayout"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle:{
            width: 285, 
      },
    }}      
    >
      <Drawer.Screen 
        name="InsideLayout" 
        component={InsideLayout} 
        options={{ 
          headerShown: false,
          drawerLabel: () => null, // Hide InsideLayout from drawer
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
      <Drawer.Screen 
        name="Requests" 
        component={RequestsScreen}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
       <Drawer.Screen 
        name="Matches" 
        component={Matches}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
      <Drawer.Screen 
        name="MatchesProfileScreen" 
        component={MatchesProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
      <Drawer.Screen 
        name="Settings" 
        component={Settings}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
      <Drawer.Screen 
        name="Help" 
        component={HelpScreen}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
      <Drawer.Screen 
        name="Log Out" 
        component={LogoutScreen}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
      <Drawer.Screen 
        name="DeleteAccount" 
        component={DeleteAccScreen}
        options={({ navigation }) => ({
          headerLeft: () => <HeaderLeftChevron navigation={navigation} />,
        })}
      />
    </Drawer.Navigator>
  );
};

export default SideBar;
