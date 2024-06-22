// import 'react-native-gesture-handler';
// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Registration from './screens/Registration';
// import Login from './screens/Login';
// import SideBar from './screens/SideBar';
// import { useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { FIREBASE_AUTH } from '@/firebase';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
//       setUser(user);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
    
//       <Stack.Navigator>
//         {user ? (
//           <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false }} />
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
//             <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
//           </>
//         )}
//       </Stack.Navigator>
    
//   );
// }
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Registration from './screens/Registration';
import Login from './screens/Login';
import SideBar from './screens/SideBar';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '@/firebase';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, user => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // return (
  //   <NavigationContainer>
  //     {user ? (
  //       <Drawer.Navigator initialRouteName="SideBar">
  //         <Drawer.Screen name="SideBar" component={SideBar} options={{ headerShown: false }} />
  //       </Drawer.Navigator>
  //     ) : (
  //       <AuthStack />
  //     )}
  //   </NavigationContainer>
  // );
  return (
    
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    
  );
}
