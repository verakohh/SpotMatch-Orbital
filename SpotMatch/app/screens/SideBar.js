
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
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
import MatchesProfileScreen from './SideBarScreen/MatchesProfileScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = ({ title, navigation, isDrawer }) => {
  const handlePress = () => {
    if (isDrawer) {
      navigation.openDrawer();
    } else {
      navigation.navigate("InsideLayout");
      setTimeout(() => {
        navigation.openDrawer();
      }, 0);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={handlePress}>
        <Feather name={isDrawer ? "menu" : "chevron-left"} size={24} />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#FAF4EC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40, // To offset the icon width
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContentContainer: {
    flex: 1,
    backgroundColor: '#FAF4EC', // Set the background color of the drawer
  },
  drawerItemContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0, // Adjust this value to move the items up or down
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  drawerItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
});

function InsideLayout({ navigation }) {
  return (
    <Tab.Navigator
      tabBar={(props) => <NavigationTab {...props} />}
      screenOptions={({ route }) => ({
        header: () => {
          let title = '';
          switch (route.name) {
            case 'Match':
              title = 'Match';
              break;
            case 'Discover':
              title = 'Discover';
              break;
            case 'Chat':
              title = 'Chat';
              break;
            case 'Events':
              title = 'Events';
              break;
            default:
              title = 'App';
          }
          return <CustomHeader title={title} navigation={navigation} isDrawer />;
        },
      })}
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
      drawerContent={(props) => (
        <View style={styles.drawerContentContainer}>
          <View style={styles.drawerItemContainer}>
            <CustomDrawerContent {...props} />
          </View>
        </View>
      )}
      screenOptions={{
        drawerStyle: {
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
          header: () => (
            <CustomHeader
              title="Profile"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Requests"
        component={RequestsScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Requests"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Matches"
        component={Matches}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Matches"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="MatchesProfileScreen"
        component={MatchesProfileScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="MatchesProfileScreen"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Settings"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Help"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="Log Out"
        component={LogoutScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Log Out"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
      <Drawer.Screen
        name="DeleteAccount"
        component={DeleteAccScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Delete Account"
              navigation={navigation}
              isDrawer={false}
            />
          ),
        })}
      />
    </Drawer.Navigator>
  );
};

export default SideBar;
