// //screens/Events/GigsScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
// import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

// const GigsScreen = () => {
//   const [gigs, setGigs] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchGigs = async () => {
//       setIsLoading(true);
//       try {
//         const db = getFirestore();
//         const gigsCollection = collection(db, 'gigs');
//         const now = new Date().toISOString(); // Get current date in ISO format
//         const gigsQuery = query(
//           gigsCollection,
//           where('gig_date', '>=', now), // Filter for gig dates on or after today
//           orderBy('gig_date', 'desc') // Fetch gigs in descending order
//         );
//         const gigsSnapshot = await getDocs(gigsQuery);
//         const gigsList = gigsSnapshot.docs.map(doc => doc.data());
//         setGigs(gigsList);
//       } catch (error) {
//         console.error('Error fetching gigs:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchGigs();
//   }, []);

//   const renderMessageText = (text) => {
//     if (!text) return null; // Return null if text is undefined or empty
//     const parts = text.split(/(\s+)/); // Split by spaces
//     return parts.map((part, index) => {
//       if (part.includes('.com') || part.startsWith('https://') || part.startsWith('http://')) {
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
//           source={{ uri: item.media_url }}
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
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDoc, getDocs, doc, setDoc, serverTimestamp, addDoc, query, orderBy, where } from 'firebase/firestore';
import { getUser } from '../../User'; // Update the path as needed
import { db, FIREBASE_AUTH } from '@/firebase'; // Update with the correct relative path to your firebase.js file

const GigsScreen = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [selectedGig, setSelectedGig] = useState(null);

  useEffect(() => {
    fetchGigs();
    fetchMatches();
  }, []);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const gigsCollection = collection(db, 'gigs');
      const now = new Date().toISOString(); // Get current date in ISO format
      const gigsQuery = query(
        gigsCollection,
        where('gig_date', '>=', now), // Filter for gig dates on or after today
        orderBy('gig_date', 'desc') // Fetch gigs in descending order
      );
      const gigsSnapshot = await getDocs(gigsQuery);
      const gigsList = gigsSnapshot.docs.map(doc => doc.data());
      setGigs(gigsList);
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    const user = await getUser();
    const userDocRef = user.docRef;
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const matchedUsers = userData.matched || [];

      const matchDocs = await Promise.all(
        matchedUsers.map(async (docRef) => {
          const docSnap = await getDoc(doc(db, 'users', docRef.id));
          if (docSnap.exists()) {
            const docData = docSnap.data();
            return { ...docData, docRef: docRef.path };
          }
          return null;
        })
      );

      setMatches(matchDocs.filter(doc => doc !== null));
    }
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const handleSharePress = (gig) => {
    setSelectedGig(gig);
    setModalVisible(true);
  };

  const handleSendPress = async () => {
    if (selectedMatches.length === 0) return;

    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      console.error('User is not authenticated');
      return;
    }

    for (const match of selectedMatches) {
      const combinedId = currentUser.uid > match.userId 
        ? `${currentUser.uid}_${match.userId}` 
        : `${match.userId}_${currentUser.uid}`;
      const chatRef = doc(db, 'chats', combinedId);
      const messageRef = collection(chatRef, 'messages');

      // Send the gig image
      const gigImageMessage = {
        sender: currentUser.uid,
        imageUrl: selectedGig.media_url,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(messageRef, gigImageMessage);
        await setDoc(chatRef, {
          latestMessage: 'Image',
          [`unreadCount.${match.userId}`]: 1, // Increment unread count for the recipient
        }, { merge: true });
      } catch (error) {
        console.error("Error sending image message: ", error);
      }

      // Send the gig details
      const gigDetailsMessage = {
        sender: currentUser.uid,
        text: `Check out this gig with me!\n\n${selectedGig.message}`,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(messageRef, gigDetailsMessage);
        await setDoc(chatRef, {
          latestMessage: gigDetailsMessage.text,
          [`unreadCount.${match.userId}`]: 1, // Increment unread count for the recipient
        }, { merge: true });
      } catch (error) {
        console.error("Error sending text message: ", error);
      }
    }

    setModalVisible(false);
    setSelectedMatches([]);
  };

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
      <TouchableOpacity onPress={() => handleSharePress(item)} style={styles.shareButton}>
        <Feather name="share" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
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
      {!loading && gigs.length === 0 && (
        <Text style={styles.noMoreGigsText}>No gigs available</Text>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Share this with:</Text>
              {matches.map((match) => (
                <View key={match.docRef} style={styles.matchItem}>
                  <Image source={{ uri: match.imageUrl }} style={styles.matchImage} />
                  <Text style={styles.matchName}>{match.firstName}</Text>
                  <TouchableOpacity onPress={() => setSelectedMatches([...selectedMatches, match])}>
                    <Feather name={selectedMatches.includes(match) ? "check-circle" : "circle"} size={24} color="black" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={handleSendPress} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  linkContainer: {
    width: '100%',
    marginTop: 2,
  },
  shareButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  matchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  matchImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  matchName: {
    fontSize: 18,
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#3F78D8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default GigsScreen;
