import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { removeUser } from '../../User';

export default function Logout() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();

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
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.confirmationText}>Are you sure you want to log out?</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleSignOut}
          disabled={loading}
        >
          <Text style={styles.logoutButtonText}>Yes, log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4EC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 60, // Shifts content up
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    maxWidth: 400,
  },
  confirmationText: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
