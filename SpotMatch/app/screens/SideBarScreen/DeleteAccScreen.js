// screens/DeleteAccount.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, db } from '../../../firebase';
import { deleteUser, signOut } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import { removeUser } from '../../User';

export default function DeleteAccount() {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const user = FIREBASE_AUTH.currentUser;
              if (user) {
                await deleteDoc(doc(db, "users", user.uid)); // Delete user document from Firestore
                await deleteUser(user); // Delete user authentication
                await removeUser(); // Remove user data from AsyncStorage
                await signOut(FIREBASE_AUTH); // Sign out the user
                navigation.navigate("Login"); // Navigate to the Login screen
              }
            } catch (error) {
              console.error("Error deleting user: ", error);
              Alert.alert("Error", "There was an error deleting your account. Please try again.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Account</Text>
      <Text style={styles.description}>
        Deleting your account will remove all your data from our servers. This action cannot be undone. Are you sure you want to continue?
      </Text>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={handleDeleteAccount}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.deleteButtonText}>Delete My Account</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E74C3C',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#212E37',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
