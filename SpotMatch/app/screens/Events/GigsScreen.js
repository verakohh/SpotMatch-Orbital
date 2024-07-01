// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';

// const GigsScreen = () => {
//   const [gigs, setGigs] = useState([]);
//   const [baseUrl, setBaseUrl] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchBaseUrl = async () => {
//       const url = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
//       console.log('Base URL set to:', url); // Debugging log
//       setBaseUrl(url);
//     };

//     fetchBaseUrl();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${baseUrl}/messages.json`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const responseText = await response.text();
//         console.log('messages.json response text:', responseText); // Debugging log

//         let imageData;
//         try {
//           imageData = JSON.parse(responseText);
//         } catch (error) {
//           console.error('Error parsing JSON from messages.json:', error);
//           throw error;
//         }

//         setGigs(imageData);
//         console.log('Gigs fetched:', imageData.length);

//       } catch (error) {
//         console.error('Error fetching gigs or images:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (baseUrl) {
//       fetchData();
//     }
//   }, [baseUrl]);

//   const renderMessageText = (text) => {
//     const parts = text.split(/(\s+)/); // Split by spaces
//     return parts.map((part, index) => {
//       if (part.includes('.com')) {
//         return (
//           <TouchableOpacity key={index} onPress={() => Linking.openURL(part.startsWith('http') ? part : `http://${part}`)}>
//             <Text style={styles.link}>{part}</Text>
//           </TouchableOpacity>
//         );
//       } else {
//         return <Text key={index} style={styles.messageText}>{part}</Text>;
//       }
//     });
//   };

//   const renderGig = ({ item }) => (
//     <View style={styles.gigContainer}>
//       {item.media_url ? (
//         <Image 
//           source={{ uri: `${baseUrl}/${item.media_url}` }}
//           style={styles.image} 
//           resizeMode="contain"
//           onError={(error) => console.log('Image failed to load:', item.media_url, error.nativeEvent.error)}
//         />
//       ) : (
//         <Text>Image not available</Text>
//       )}
//       <Text style={styles.messageText}>{renderMessageText(item.message)}</Text>
//     </View>
//   );

//   const renderFooter = () => {
//     if (!isLoading) return null;
//     return (
//       <View style={styles.loadingFooter}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {console.log('Rendering gigs, count:', gigs.length)}
//       <FlatList
//         data={gigs}
//         renderItem={renderGig}
//         keyExtractor={(item, index) => index.toString()}
//         ListFooterComponent={renderFooter}
//       />
//       {!isLoading && gigs.length === 0 && (
//         <Text style={styles.noMoreGigsText}>No gigs available</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#FAF4EC',
//   },
//   gigContainer: {
//     margin: 10,
//     padding: 15,
//     borderColor: '#ccc',
//     backgroundColor: '#E6F2F4',
//     borderWidth: 1,
//     borderRadius: 15,
//   },
//   image: {
//     width: '100%',
//     height: 300,
//     marginBottom: 3,
//   },
//   messageText: {
//     fontSize: 16,
//     marginTop: 10,
//   },
//   link: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//     fontSize: 16,
//   },
//   loadingFooter: {
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     borderColor: "#CED0CE"
//   },
//   noMoreGigsText: {
//     textAlign: 'center',
//     padding: 10,
//     fontStyle: 'italic',
//   },
// });

// export default GigsScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const GigsScreen = () => {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      setIsLoading(true);
      try {
        const db = getFirestore();
        const gigsCollection = collection(db, 'gigs');
        const gigsSnapshot = await getDocs(gigsCollection);
        const gigsList = gigsSnapshot.docs.map(doc => doc.data());
        setGigs(gigsList);
      } catch (error) {
        console.error('Error fetching gigs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

  const renderMessageText = (text) => {
    if (!text) return null; // Return null if text is undefined or empty
    const parts = text.split(/(\s+)/); // Split by spaces
    return parts.map((part, index) => {
      if (part.includes('.com') || part.startsWith('https://') || part.startsWith('http://')) {
        return (
          <TouchableOpacity key={index} onPress={() => Linking.openURL(part.startsWith('http') ? part : `http://${part}`)}>
            <Text style={styles.link}>{part}</Text>
          </TouchableOpacity>
        );
      } else {
        return <Text key={index} style={styles.messageText}>{part}</Text>;
      }
    });
  };

  const renderGig = ({ item }) => (
    <View style={styles.gigContainer}>
      {item.media_url ? (
        <Image 
          source={{ uri: item.media_url }}
          style={styles.image} 
          resizeMode="contain"
          onError={(error) => console.log('Image failed to load:', item.media_url, error.nativeEvent.error)}
        />
      ) : (
        <Text>Image not available</Text>
      )}
      <Text style={styles.messageText}>{renderMessageText(item.message)}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {console.log('Rendering gigs, count:', gigs.length)}
      <FlatList
        data={gigs}
        renderItem={renderGig}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter}
      />
      {!isLoading && gigs.length === 0 && (
        <Text style={styles.noMoreGigsText}>No gigs available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FAF4EC',
  },
  gigContainer: {
    margin: 10,
    padding: 15,
    borderColor: '#ccc',
    backgroundColor: '#E6F2F4',
    borderWidth: 1,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    marginTop: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  loadingFooter: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#CED0CE"
  },
  noMoreGigsText: {
    textAlign: 'center',
    padding: 10,
    fontStyle: 'italic',
  },
});

export default GigsScreen;
