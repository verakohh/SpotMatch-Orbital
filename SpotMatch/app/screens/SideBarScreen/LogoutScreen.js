import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '@/firebase'
import { useState } from 'react'
import Button from '@/components/navigation/Button'
import { useNavigation } from '@react-navigation/core';
import { getAuth, signOut } from "firebase/auth";
import { removeUser } from '../../User'


export default function LogoutScreen() {
    const auth = FIREBASE_AUTH;
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

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Log Out Screen</Text>
            <Button type='danger' size='m' text='Sign Out' onPress={handleSignOut} style={{flex: 1, justifyContent: 'space-between'}}></Button>

        </View>
    );
}