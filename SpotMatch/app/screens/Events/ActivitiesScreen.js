//app/screens/Events/ActivitiesScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Update with the correct relative path to your firebase.js file

const ActivitiesScreen = () => {
  const [activities, setActivities] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'activities'));
      const activitiesData = querySnapshot.docs.map(doc => doc.data());
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.activityContainer}
      onPress={() => navigation.navigate('ActivityDetails', { activity: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF4EC',
  },
  activityContainer: {
    marginBottom: 20,
    padding: 15,
    borderColor: '#ccc',
    backgroundColor: '#E6F2F4',
    borderWidth: 1,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212E37',
    marginTop: 8,
  },
});

export default ActivitiesScreen;
