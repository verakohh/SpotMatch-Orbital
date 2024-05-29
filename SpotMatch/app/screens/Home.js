import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Button from '../../components/navigation/Button';
import { NavigationContainer, useNavigation } from '@react-navigation/core';


const Home = () => {
  const navigation= useNavigation();
  return (
    <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
      <Text>Home Screen</Text>
      <Button type='secondary' size='s' text='Settings' onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default Home

const styles = StyleSheet.create({

})