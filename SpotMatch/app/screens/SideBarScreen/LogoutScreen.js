import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '@/firebase'
import { useState } from 'react'
import Button from '@/components/navigation/Button'

export default function LogoutScreen() {
    const auth = FIREBASE_AUTH;
    const [loading, setLoading] = useState(false);

    const handleSignOut = () => {
        setLoading(true);
        try {
            auth.signOut();
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