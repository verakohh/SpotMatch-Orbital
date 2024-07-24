import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getUser } from '../../User';
import { useFocusEffect } from '@react-navigation/native';
import { getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
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
              return { ...docData, docRef: docRef.path }; // Pass path instead of docRef
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

  useFocusEffect(
    React.useCallback(() => {
      fetchMatches();
    }, [])
  );

  const renderItem = ({ item }) => (
    // <TouchableOpacity style={styles.matchContainer} onPress={() => navigation.navigate('MatchesProfileScreen', { user: item })}>
    <View style={styles.matchContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.firstName}</Text>
      </View>
    // </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.wait}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <View style={styles.wait}>
        <Text>No matches yet!</Text>
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
    marginHorizontal: 18,
    backgroundColor: '#FAF4EC',
    // alignItems: 'center',
    justifyContent: 'center'
  },
  wait: {
    flex: 1,
    marginHorizontal: 25,
    backgroundColor: '#FAF4EC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 15,

  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,

  },
});
