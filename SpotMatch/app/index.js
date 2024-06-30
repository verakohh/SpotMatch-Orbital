import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from './UserContext';
import Registration from './screens/Registration';
import Login from './screens/Login';
import SideBar from './screens/SideBar';
import Access from './screens/Access';
import MatchesProfileScreen from './screens/SideBarScreen/MatchesProfileScreen';
import ActivitiesScreen from './screens/Events/ActivitiesScreen';
import ActivityDetails from './screens/Events/ActivityDetails';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH, ref } from '@/firebase';
import { getDoc } from 'firebase/firestore';
import User from './User';

const Stack = createNativeStackNavigator();

export default function App() {
  const [signedUser, setSignedUser] = useState(null);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);



  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, signedUser => {
  //     setSignedUser(signedUser);

  //     });
  //    () => unsubscribe();
  //   // set(); 
  // }, []);


  return (
    <UserContext.Provider value={{user, setUser, token, setToken}}>
      <Stack.Navigator>
            <Stack.Screen name='Access' component={Access} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
            <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false }} />
            <Stack.Screen name="Activities" component={ActivitiesScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ActivityDetails" component={ActivityDetails} options={{ headerShown: false }} />

      </Stack.Navigator>
    </UserContext.Provider>
  );
  
}
