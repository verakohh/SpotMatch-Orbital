import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '@/firebase'
import { useState } from 'react'
import Button from '@/components/navigation/Button'

const Settings = () => {
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
        <Button type='danger' size='m' text='Sign Out' onPress={handleSignOut} style={{flex: 1, justifyContent: 'space-between'}}></Button>
    </View>
  )     
}

export default Settings

const styles = StyleSheet.create({
    settings: {
        flex: 1,
        color: '#212e37',
        justifyContent: 'space-between',
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