import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

import { useNavigation } from '@react-navigation/native';

const ActivityDetailsScreen = ({ route }) => {
  const { activity } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Feather name="x" size={24} color="black" />
      </TouchableOpacity>
      <Image source={{ uri: activity.image }} style={styles.image} />
      <Text style={styles.title}>{activity.name}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Linking.openURL(activity.directions)}
        >
          <Feather name="map-pin" size={18} color="black" />
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => Linking.openURL(activity.website)}
        >
          <Feather name="globe" size={18} color="black" />
          <Text style={styles.buttonText}>Website</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>{activity.description}</Text>
      <Text style={styles.ophours}>Operating Hours: {activity.ophours}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  closeButton: {
    position: 'absolute',
    top: 15, // Moved down to make it visible
    right: 16,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 30, // Added margin top to move the image down
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    padding: 8,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 8,
  },
  ophours: {
    fontSize: 16,
    color: '#666',
  },
});

export default ActivityDetailsScreen;
