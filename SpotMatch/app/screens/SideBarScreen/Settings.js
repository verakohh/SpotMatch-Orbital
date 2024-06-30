import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../../firebase';
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react'
import Button from '@/components/navigation/Button'
import { removeUser } from '../../User'

const Settings = () => {
    // const auth = FIREBASE_AUTH;
    const auth = getAuth();

    const [loading, setLoading] = useState(false);
    const navigation= useNavigation();

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await signOut(auth).then(() => {
                removeUser(); 
                navigation.navigate('Login');
            });
            
            // navigation.navigate('Login');
            // removeUser();
        } catch (error) {
            console.log(error);
            alert('Sign Out failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
    <View style= {styles.settings}>
      <Text>Settings</Text>
      <View style ={styles.contact}>
        <Text> {`
        Contact Us:

        Charlene Teoh         
        e1297771@u.nus.edu        

        Vera Koh 
        e1138412@u.nus.edu        
        `}</Text>
      </View>
    </View>
  )     
}

export default Settings

const styles = StyleSheet.create({
    settings: {
        flex: 1,
        color: '#212e37',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey'
    }, 

    contact: {
        borderWidth: 2,
        borderColor: 'grey',
        backgroundColor: 'white',
        borderRadius: 15,
    
    }

})