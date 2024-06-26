// app/screens/MatchScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MatchScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Match Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MatchScreen;
