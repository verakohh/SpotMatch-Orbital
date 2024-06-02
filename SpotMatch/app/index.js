import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Registration from './screens/Registration'
import Login from './screens/Login';
import Home from './screens/Home';
import Settings from './screens/Settings/Settings';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { FIREBASE_AUTH } from '@/firebase';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  console.log("Rendering InsideLayout Navigator");

  return (
    <InsideStack.Navigator initialRouteName='Home'>
      <InsideStack.Screen name='Home' component={Home} options={{ headerShown: false }} />
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

    if(!user) {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
          <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }}/>
          
        </Stack.Navigator>
      );
    }

    return (
      <Stack.Navigator>
        <Stack.Screen name="InsideLayout" component={InsideLayout} options={{ headerShown: false }}/>        
      </Stack.Navigator>
    );
  
}
