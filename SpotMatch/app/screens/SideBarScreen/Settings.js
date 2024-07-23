import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';
import Button from '@/components/navigation/Button';
import { removeUser } from '../../User';

const Settings = () => {
    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const handleSignOut = async () => {
        setLoading(true);
        try {
            await signOut(auth).then(() => {
                removeUser();
                navigation.navigate('Login');
            });
        } catch (error) {
            console.log(error);
            alert('Sign Out failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.settings}>
            <Text style={styles.title}>Settings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AccountManagement')} style={styles.button}>
                <Text style={styles.buttonText}>Update Username</Text>
            </TouchableOpacity>
            <View style={styles.contact}>
                <Text>
                    {`
                    Contact Us:

                    Charlene Teoh         
                    e1297771@u.nus.edu        

                    Vera Koh 
                    e1138412@u.nus.edu        
                    `}
                </Text>
            </View>
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signOutButtonText}>Sign Out</Text>}
            </TouchableOpacity>
        </View>
    );
}

export default Settings;

const styles = StyleSheet.create({
    settings: {
        flex: 1,
        color: '#212e37',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#3F78D8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    contact: {
        borderWidth: 2,
        borderColor: 'grey',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        marginBottom: 20,
    },
    signOutButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    signOutButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
