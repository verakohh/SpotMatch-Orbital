import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../../components/navigation/Button';
import { useNavigation } from '@react-navigation/core';
import { FIREBASE_AUTH, usersRef } from '../../firebase'; 
import { getDocs, query, where } from 'firebase/firestore';
import { HelloWave } from '@/components/HelloWave';

const Home = () => {
  const navigation= useNavigation();
  const [name, setName] = useState('');

  const fetchName = async () => {
    const q = query(usersRef, where('userId', '==', FIREBASE_AUTH.currentUser.uid));
    const qSnapShot = await getDocs(q);
    qSnapShot.forEach(doc => {
      setName(doc.data().firstName)
    })
  }

  useEffect(() => {
    fetchName();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.greeting}> 
        <HelloWave />
        <Text style={styles.gText}> Hello, <Text style={styles.gName}>{name} </Text> </Text>
      </View>
      <Button type='secondary' size='s' text='Settings' onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default Home

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent:'space-between', 
    alignItems: 'center',
  }, 
  
  greeting: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 60,
  }, 

  gText: {
    fontSize: 25, 
    fontFamily: 'verdana',
  }, 

  gName: {
    color: '#212e37',
    fontWeight: '500', 
  }

})