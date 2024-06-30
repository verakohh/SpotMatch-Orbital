// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image, ActivityIndicator } from 'react-native';

// const ConcertsScreen = () => {
//   const [concerts, setConcerts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchConcerts();
//   }, []);

//   const fetchConcerts = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:3000/concerts.json');
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       setConcerts(data);
//     } catch (error) {
//       console.error('Error fetching concerts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.concertItem}>
//       <Image source={{ uri: item.image }} style={styles.concertImage} />
//       <Text style={styles.concertTitle}>{item.artist}</Text>
//       {item.title ? <Text style={styles.concertText}>{item.title}</Text> : null}
//       <Text style={styles.concertText}>Genre: {item.genre}</Text>
//       <Text style={styles.concertText}>{item.date}, {item.time}</Text>
//       <Text style={styles.concertText}>📍 {item.location}</Text>
//       <TouchableOpacity onPress={() => openLink(item.link)} style={styles.linkContainer}>
//         <Text style={styles.link}>Get tickets here!</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const openLink = (url) => {
//     Linking.openURL(url);
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <FlatList
//           data={concerts}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => index.toString()}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#FAF4EC',
//   },
//   concertItem: {
//     marginBottom: 20,
//     padding: 15,
//     borderColor: '#ccc',
//     backgroundColor: '#E6F2F4',
//     borderWidth: 1,
//     borderRadius: 15,
//   },
//   concertImage: {
//     width: '100%',
//     height: 300,
//     resizeMode: 'contain',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   concertTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textTransform: 'uppercase',
//   },
//   concertText: {
//     textAlign: 'left',
//     fontSize: 16,
//     marginVertical: 2,
//   },
//   linkContainer: {
//     width: '100%', // Ensure it takes the full width
//     marginTop: 2,
//   },
//   link: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//     textAlign: 'left',
//     marginTop: 2,
//   },
// });

// export default ConcertsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase'; // Update with the correct relative path to your firebase.js file

const ConcertsScreen = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "concerts"));
      const concertsData = querySnapshot.docs.map(doc => doc.data());
      setConcerts(concertsData);
    } catch (error) {
      console.error('Error fetching concerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.concertItem}>
      <Image source={{ uri: item.image }} style={styles.concertImage} />
      <Text style={styles.concertTitle}>{item.artist}</Text>
      {item.title ? <Text style={styles.concertText}>{item.title}</Text> : null}
      <Text style={styles.concertText}>Genre: {item.genre}</Text>
      <Text style={styles.concertText}>{item.date}, {item.time}</Text>
      <Text style={styles.concertText}>📍 {item.location}</Text>
      <TouchableOpacity onPress={() => openLink(item.link)} style={styles.linkContainer}>
        <Text style={styles.link}>Get tickets here!</Text>
      </TouchableOpacity>
    </View>
  );

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={concerts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF4EC',
  },
  concertItem: {
    marginBottom: 20,
    padding: 15,
    borderColor: '#ccc',
    backgroundColor: '#E6F2F4',
    borderWidth: 1,
    borderRadius: 15,
  },
  concertImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    alignItems: 'center',
    marginBottom: 10,
  },
  concertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  concertText: {
    textAlign: 'left',
    fontSize: 16,
    marginVertical: 2,
  },
  linkContainer: {
    width: '100%', // Ensure it takes the full width
    marginTop: 2,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'left',
    marginTop: 2,
  },
});

export default ConcertsScreen;
