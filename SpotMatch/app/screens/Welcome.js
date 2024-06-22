import { ImageBackground, StyleSheet, Text, Image, View } from 'react-native';
import React from 'react';
import Button from '../../components/navigation/Button';
import SpotMatchSplash from '../../assets/images/SpotMatch-splashScreen.png'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {FONTS} from '../../constants/fonts';
import { useNavigation } from '@react-navigation/core';
import Login from './Login';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { FIREBASE_AUTH } from '@/firebase';


const Welcome= () => {
//     const [user, setUser] = useState(null);
  
//   useEffect(() => {
//     onAuthStateChanged(FIREBASE_AUTH, user=> {
//       setUser(user);
//     });
//   }, [])
//   console.log("Rendering Login Navigator");

// const Stack = createNativeStackNavigator();
// const InsideStack = createNativeStackNavigator();

// function InsideLayout() {
//   console.log("Rendering InsideLayout Navigator");

//   return (
//     <InsideStack.Navigator>
//       <InsideStack.Screen name='Home' component={Home} options={{ headerShown: false }} />
//       <InsideStack.Screen name='Settings' component={Settings} />
//     </InsideStack.Navigator>
//   );
// }

// function handleWelcome() {
//     console.log("Rendering Welcome");

//     return (
//         <Stack.Navigator screenOptions={{headerShown: false}} >
//             {user ? <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false }} />
//                 : <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
//           }
//         </Stack.Navigator>

//     );
// }

    const navigation= useNavigation();

    return (
        
        <View style= {styles.background}>
            <Image  style= {{position: 'absolute', resizeMode: 'contain', width: '100%', height: '100%'}} source={require('../../assets/images/SpotMatch-splashScreen.png')} />           
            <View style= {styles.title} >
                <Text style= {{ color: 'white', fontSize: 28, marginTop: 200, marginBottom: 30} }  > WELCOME! </Text>
                <Text style= {styles.text}>Here to.. Tune In, Friend Out?</Text>
                <Button type='primary' size='m' text='Get Started!' onPress={() => navigation.navigate('Login')}></Button>
            </View>

        </View>
    )
};

const styles = StyleSheet.create ({
    background: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111E26'

    }, 
    title: {
        flex: 1, 
        alignItems: 'center',
         justifyContent: 'space-between',
        // position: 'absolute',
        // backgroundColor: 'black'
    },

    text: {
        color: 'white',
        fontSize: 20
    }

})

export default Welcome;