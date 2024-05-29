import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';
import Settings from './screens/Settings'
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { FIREBASE_AUTH } from '@/firebase';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  console.log("Rendering InsideLayout Navigator");

  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home' component={Home} />
      <InsideStack.Screen name='Settings' component={Settings} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, user=> {
      setUser(user);
    });
  }, [])
  console.log("Rendering Login Navigator");
  return (
    
    // <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          {user ? <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
                : <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
          }
        </Stack.Navigator>
      // </NavigationContainer>
    
  );
}
