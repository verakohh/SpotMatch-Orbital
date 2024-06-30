import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { getUser } from '../../User';
import { ref } from '../../../firebase';
import { getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const user = await getUser();
      const userDocRef = user.docRef;
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const matchedUsers = userData.matched || [];
        
        const matchDocs = await Promise.all(
          matchedUsers.map(async (docRef) => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const docData = docSnap.data();
              return { ...docData, docRef: docRef.path }; 
            }
            return null;
          })
        );

        setMatches(matchDocs.filter(doc => doc !== null));
        setLoading(false);
      } else {
        console.log("No userDocSnap");
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.matchContainer} onPress={() => navigation.navigate('MatchesProfileScreen', { user: item })}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.firstName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No matches found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.docRef}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Matches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
},
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 18,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
