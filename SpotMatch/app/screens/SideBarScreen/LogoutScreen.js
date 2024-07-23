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
            <Text style={{marginVertical: 20, fontSize: 14, fontWeight: 'bold'}}>Sure you want to log out? </Text>
            <Button type='danger' size='m' text='Log Out' onPress={handleSignOut} />

        </View>
    );
}