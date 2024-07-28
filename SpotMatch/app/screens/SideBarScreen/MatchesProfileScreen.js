
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';
import Feather from 'react-native-vector-icons/Feather';

const MatchesProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userData, setUserData] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Matches Profile",
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Matches')} style={styles.chevronButton}>
          <Feather name="chevron-left" size={24} color="#212E37" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchUserData = async () => {
      setUserData(null); // Clear previous state
      if (userId) {
        try {
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log('User document not found');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('No user ID');
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const top3artists = userData.topArtists ? userData.topArtists.slice(0, 3) : [];
  const top3genres = userData.genres ? userData.genres.slice(0, 3) : [];
  const topTracks = userData.topTracks ? userData.topTracks.slice(0, 3) : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Matches')} style={styles.chevronButton}>
          <Feather name="chevron-left" size={24} color="#212E37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matches Profile</Text>
      </View>
      <View style={styles.headerLine} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: userData.imageUrl }} style={styles.image} />
        <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
        <Text style={styles.age}>Age: {userData.age}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Top 3 Artists: </Text>
          {top3artists.map((artist, index) => (
            <Text key={index} style={styles.text}>{artist}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Top 3 Genres: </Text>
          {top3genres.map((genre, index) => (
            <Text key={index} style={styles.text}>{genre}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Top Tracks: </Text>
          {topTracks.map((track, index) => (
            <Text key={index} style={styles.text}>{track.name} by {track.artist}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default MatchesProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4EC',
  },
  scrollContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  chevronButton: {
    paddingHorizontal: 10, // Add padding to move the chevron to the right
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '135%',
    alignSelf: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#BAD6EB',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212E37',
    textAlign: 'center',
  },
  age: {
    fontSize: 18,
    marginVertical: 10,
    color: '#212E37',
    textAlign: 'center',
  },
  section: {
    width: '90%',
    backgroundColor: '#BAD6EB',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#316BCD',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    color: '#316BCD',
    textAlign: 'center',
  },
});

// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
// import { getDoc } from 'firebase/firestore';
// import { doc } from '../../../firebase';

// const MatchesProfileScreen = ({ route }) => {
//   const { user } = route.params;
//   const [userData, setUserData] = useState(user);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (typeof user.docRef === 'string') {
//         const docRef = user.docRef;
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           setUserData(docSnap.data());
//         }
//       } else {
//        console.log('no user');
//       }
//     };
    
//     fetchUserData();
//   }, [user]);


//     const top3artists = userData.topArtists ? userData.topArtists.slice(0, 3) : 'N/A';
//     const top3genres = userData.genres ? userData.genres.slice(0, 3) : [];
//     const topTracks = userData.topTracks ? userData.topTracks.slice(0, 3) : [];
  

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//         <Image source={{ uri: userData.imageUrl }} style={styles.image} />
//         <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
//         <Text style={styles.age}>Age: {userData.age}</Text>

//         <Text style={styles.header}>Top 3 Artists: </Text>
//         {top3artists.map((artist, index) => (
//                 <Text key={index} style={styles.text}>{artist}</Text>
//         ))}

//         <Text style={styles.header}>Top 3 Genres: </Text>
//         {top3genres.map((genre, index) => (
//                 <Text key={index} style={styles.text}>{genre}</Text>
//         ))}

//         <Text style={styles.header}>Top Tracks: </Text>
//         {topTracks.map((track, index) => (
//             <Text key={index} style={styles.text}>{track.name} by {track.artist}</Text>
//         ))}
//     </ScrollView>
//   );
// };

// export default MatchesProfileScreen;

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FAF4EC',
//   },
//   image: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginBottom: 20,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   age: {
//     fontSize: 18,
//     marginVertical: 10,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 22,
//   },
//   text: {
//     fontSize: 16,
//     marginVertical: 5,
//   },
// });
