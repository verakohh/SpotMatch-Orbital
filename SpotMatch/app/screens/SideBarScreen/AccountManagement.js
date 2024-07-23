
// screens/AccountManagement.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth, updateProfile } from "firebase/auth";

const AccountManagement = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user.displayName);
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
                alert('Username updated successfully');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update username: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account Management</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={displayName}
                onChangeText={setDisplayName}
            />
            <TouchableOpacity onPress={handleUpdate} style={styles.button} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Update Username</Text>}
            </TouchableOpacity>
        </View>
    );
};

export default AccountManagement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FAF4EC',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    button: {
        backgroundColor: '#3F78D8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
