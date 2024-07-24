import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { FIREBASE_AUTH, db, ref } from '../../../firebase';
import Feather from 'react-native-vector-icons/Feather';
import { getUser } from '../../User';


const Settings = () => {
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      const user = await getUser();
      const userDocRef = ref(user.email);
      const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log('No such document!');
        }
      
    };

    fetchUserData();
  }, [auth]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userData.firstName} {userData.lastName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('ChangePasswordScreen')}
        >
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <Text style={styles.value}>**********</Text>
            <Feather name="chevron-right" size={20} color="#212E37" style={styles.arrow} />
          </View>
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.label}>Spotify account</Text>
          <Text style={styles.value}>@{userData.spotifyId}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4EC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: {
    backgroundColor: '#FAF4EC',
    borderRadius: 10,
    padding: 15,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  label: {
    fontSize: 16,
    color: '#212E37',
    width: 130, // Adjust this width to align text values
  },
  value: {
    fontSize: 16,
    color: '#212E37',
    textAlign: 'left',
    flexShrink: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginLeft: 100,
    alignItems: 'center',
    marginBottom: 5,
    color: '#212E37',
  },
});

export default Settings;
