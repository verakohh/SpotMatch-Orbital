import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const CircleCrossIcon = () => {
  return (
    <View style={styles.iconContainer}>
      <View style={styles.circle}>
        <Icon name="x" size={20} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 20,
    backgroundColor: '#B0C4DE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CircleCrossIcon;