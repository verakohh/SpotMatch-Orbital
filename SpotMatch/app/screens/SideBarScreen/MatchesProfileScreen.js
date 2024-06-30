import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { getDoc } from 'firebase/firestore';
import { doc } from '../../../firebase';

const MatchesProfileScreen = ({ route }) => {
  const { user } = route.params;
  const [userData, setUserData] = useState(user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof user.docRef === 'string') {
        const docRef = user.docRef;
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
       console.log('no user');
      }
    };
    
    fetchUserData();
  }, [user]);


    const top3artists = userData.topArtists ? userData.topArtists.slice(0, 3).join(', ') : 'N/A';
    const top3genres = userData.genres ? userData.genres.slice(0, 3).join(', ') : 'N/A';
    const topTracks = userData.topTracks ? userData.topTracks.slice(0, 3) : [];
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: userData.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
      <Text style={styles.age}>Age: {userData.age}</Text>
      <Text style={styles.header}>Top 3 Artists: </Text>
      <Text style={styles.text}>{top3artists}</Text>
      <Text style={styles.header}>Top 3 Genres: </Text>
      <Text style={styles.text}>{top3genres}</Text>
      <Text style={styles.header}>Top Tracks: </Text>
      {topTracks.map((track, index) => (
        <Text key={index} style={styles.text}>{track.name} by {track.artist}</Text>
      ))}
    </ScrollView>
  );
};

export default MatchesProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAF4EC',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  age: {
    fontSize: 18,
    marginVertical: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginVertical: 2,
  },
});
