// import 'react-native-gesture-handler';
// import * as React from 'react';
// import { useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { UserContext } from './UserContext';
// import Registration from './screens/Registration';
// import Login from './screens/Login';
// import SideBar from './screens/SideBar';
// import Access from './screens/Access';
// import MatchesProfileScreen from './screens/SideBarScreen/MatchesProfileScreen';
// import ActivitiesScreen from './screens/Events/ActivitiesScreen';
// import ActivityDetails from './screens/Events/ActivityDetails';
// import ChatListScreen from './screens/ChatListScreen';
// import ChatScreen from './screens/ChatScreen';
// import MatchScreen from './screens/MatchScreen';
// import DiscoverScreen from './screens/DiscoverScreen';
// import EventsScreen from './screens/EventsScreen';
// import NavigationTab from './screens/NavigationTab';
// import ChatMusicScreen from './screens/ChatMusicScreen';
// import { ChatProvider } from './screens/context/ChatContext';

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// function MainTabs() {
//   return (
//     <Tab.Navigator tabBar={(props) => <NavigationTab {...props} />}>
//       <Tab.Screen name="Match" component={MatchScreen} />
//       <Tab.Screen name="Discover" component={DiscoverScreen} />
//       <Tab.Screen name="Chat" component={ChatListScreen} /> {/* Ensure correct screen name */}
//       <Tab.Screen name="Events" component={EventsScreen} />
//     </Tab.Navigator>
//   );
// }

// export default function App() {
//   const [user, setUser] = useState({});
//   const [token, setToken] = useState("");

//   return (
//     <ChatProvider>
//       <UserContext.Provider value={{ user, setUser, token, setToken }}>
//           <Stack.Navigator initialRouteName="Access">
//             <Stack.Screen name="Access" component={Access} options={{ headerShown: false }} />
//             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//             <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
//             <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false }} />
//             <Stack.Screen name="Activities" component={ActivitiesScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="ActivityDetails" component={ActivityDetails} options={{ headerShown: false }} />
//             <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
//             <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="ChatMusicScreen" component={ChatMusicScreen} options={{ headerShown: false }} />
//             <Stack.Screen name="MatchesProfileScreen" component={MatchesProfileScreen} options={{ headerShown: false }} />
//           </Stack.Navigator>
//       </UserContext.Provider>
//     </ChatProvider>
//   );
// }
// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserProvider } from './UserContext';
import { ChatProvider } from './screens/context/ChatContext';
import Registration from './screens/Registration';
import Login from './screens/Login';
import SideBar from './screens/SideBar';
import AccountManagement from './screens/SideBarScreen/AccountManagement';
import SignUpScreen from './screens/SignUp/SignUpScreen';
import SignUpStep2Screen from './screens/SignUp/SignUpStep2Screen';
import SpotifyAuthScreen from './screens/SignUp/SpotifyAuthScreen';
import WelcomeScreen from './screens/SignUp/WelcomeScreen';
import MatchesProfileScreen from './screens/SideBarScreen/MatchesProfileScreen';
import ActivitiesScreen from './screens/Events/ActivitiesScreen';
import ActivityDetails from './screens/Events/ActivityDetails';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import MatchScreen from './screens/MatchScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import EventsScreen from './screens/EventsScreen';
import NavigationTab from './screens/NavigationTab';
import ChatMusicScreen from './screens/ChatMusicScreen';
import Access from './screens/Access';
import ProfileScreen from './screens/SideBarScreen/ProfileScreen';
import ChangePasswordScreen from './screens/SideBarScreen/ChangePasswordScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <NavigationTab {...props} />}>
      <Tab.Screen name="Match" component={MatchScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ChatProvider>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpStep2Screen" component={SignUpStep2Screen} options={{ headerShown: false }} />
            <Stack.Screen name="SpotifyAuthScreen" component={SpotifyAuthScreen} options={{ headerShown: false }} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
            <Stack.Screen name="Access" component={Access} options={{ headerShown: false }} />
            <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false }} />
            <Stack.Screen name="Activities" component={ActivitiesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ActivityDetails" component={ActivityDetails} options={{ headerShown: false }} />
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatMusicScreen" component={ChatMusicScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MatchesProfileScreen" component={MatchesProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AccountManagement" component={AccountManagement} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
      </ChatProvider>
    </UserProvider>
  );
}
