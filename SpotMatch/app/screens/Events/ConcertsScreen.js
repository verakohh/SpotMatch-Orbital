// //screens/Events/ConcertsScreen.js
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image, ActivityIndicator } from 'react-native';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { db } from '@/firebase'; // Update with the correct relative path to your firebase.js file

// const ConcertsScreen = () => {
//   const [concerts, setConcerts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchConcerts();
//   }, []);

//   const fetchConcerts = async () => {
//     setLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, "concerts"));
//       const concertsData = querySnapshot.docs.map(doc => doc.data());
//       setConcerts(concertsData);
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






//working msg and list

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { collection, getDoc, getDocs, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
// import { getUser } from '../../User'; // Update the path as needed
// import { db, FIREBASE_AUTH } from '@/firebase'; // Update with the correct relative path to your firebase.js file

// const ConcertsScreen = () => {
//   const [concerts, setConcerts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [matches, setMatches] = useState([]);
//   const [selectedMatches, setSelectedMatches] = useState([]);
//   const [selectedConcert, setSelectedConcert] = useState(null);

//   useEffect(() => {
//     fetchConcerts();
//     fetchMatches();
//   }, []);

//   const fetchConcerts = async () => {
//     setLoading(true);
//     try {
//       const querySnapshot = await getDocs(collection(db, "concerts"));
//       const concertsData = querySnapshot.docs.map(doc => doc.data());
//       setConcerts(concertsData);
//     } catch (error) {
//       console.error('Error fetching concerts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMatches = async () => {
//     const user = await getUser();
//     const userDocRef = user.docRef;
//     const userDocSnap = await getDoc(userDocRef);

//     if (userDocSnap.exists()) {
//       const userData = userDocSnap.data();
//       const matchedUsers = userData.matched || [];

//       const matchDocs = await Promise.all(
//         matchedUsers.map(async (docRef) => {
//           const docSnap = await getDoc(doc(db, 'users', docRef.id));
//           if (docSnap.exists()) {
//             const docData = docSnap.data();
//             return { ...docData, docRef: docRef.path };
//           }
//           return null;
//         })
//       );

//       setMatches(matchDocs.filter(doc => doc !== null));
//     }
//   };
  
//   const openLink = (url) => {
//     Linking.openURL(url);
//   };

//   const handleSharePress = (concert) => {
//     setSelectedConcert(concert);
//     setModalVisible(true);
//   };

//   const handleSendPress = async () => {
//     if (selectedMatches.length === 0) return;

//     const currentUser = FIREBASE_AUTH.currentUser;
//     if (!currentUser) {
//       console.error('User is not authenticated');
//       return;
//     }

//     for (const match of selectedMatches) {
//       const combinedId = currentUser.uid > match.userId 
//         ? `${currentUser.uid}_${match.userId}` 
//         : `${match.userId}_${currentUser.uid}`;
//       const chatRef = doc(db, 'chats', combinedId);
//       const messageRef = collection(chatRef, 'messages');

//       const concertMessage = {
//         sender: currentUser.uid,
//         text: `Check out this concert with me! ${selectedConcert.artist} (${selectedConcert.genre}) ${selectedConcert.date}, ${selectedConcert.time} @ ${selectedConcert.location} ${selectedConcert.link}`,
//         imageUrl: selectedConcert.image,
//         timestamp: serverTimestamp(),
//       };

//       try {
//         await addDoc(messageRef, concertMessage);
//         await setDoc(chatRef, {
//           latestMessage: concertMessage.text,
//           [`unreadCount.${match.userId}`]: 1, // Increment unread count for the recipient
//         }, { merge: true });
//       } catch (error) {
//         console.error("Error sending message: ", error);
//       }
//     }

//     setModalVisible(false);
//     setSelectedMatches([]);
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
//       <TouchableOpacity onPress={() => handleSharePress(item)} style={styles.shareButton}>
//         <Feather name="share" size={24} color="black" />
//       </TouchableOpacity>
//     </View>
//   );

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
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <ScrollView>
//               <Text style={styles.modalTitle}>Share this with:</Text>
//               {matches.map((match) => (
//                 <View key={match.docRef} style={styles.matchItem}>
//                   <Image source={{ uri: match.imageUrl }} style={styles.matchImage} />
//                   <Text style={styles.matchName}>{match.firstName}</Text>
//                   <TouchableOpacity onPress={() => setSelectedMatches([...selectedMatches, match])}>
//                     <Feather name={selectedMatches.includes(match) ? "check-circle" : "circle"} size={24} color="black" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//               <TouchableOpacity onPress={handleSendPress} style={styles.sendButton}>
//                 <Text style={styles.sendButtonText}>Send</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
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
//     position: 'relative',
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
//     width: '100%',
//     marginTop: 2,
//   },
//   link: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//     textAlign: 'left',
//     marginTop: 2,
//   },
//   shareButton: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   matchItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   matchImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   matchName: {
//     fontSize: 18,
//     flex: 1,
//   },
//   sendButton: {
//     backgroundColor: '#3F78D8',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   sendButtonText: {
//     color: 'white',
//     fontSize: 16,
//   },
//   closeButton: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   closeButtonText: {
//     color: 'red',
//     fontSize: 16,
//   },
// });

// export default ConcertsScreen;


import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { collection, getDoc, getDocs, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { getUser } from '../../User'; // Update the path as needed
import { db, FIREBASE_AUTH } from '@/firebase'; // Update with the correct relative path to your firebase.js file

const ConcertsScreen = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [matches, setMatches] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState(null);

  useEffect(() => {
    fetchConcerts();
    fetchMatches();
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

  const handleSharePress = (concert) => {
    setSelectedConcert(concert);
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

      // Send the concert image
      const concertImageMessage = {
        sender: currentUser.uid,
        imageUrl: selectedConcert.image,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(messageRef, concertImageMessage);
        await setDoc(chatRef, {
          latestMessage: 'Image',
          [`unreadCount.${match.userId}`]: 1, // Increment unread count for the recipient
        }, { merge: true });
      } catch (error) {
        console.error("Error sending image message: ", error);
      }

      // Send the concert details
      const concertDetailsMessage = {
        sender: currentUser.uid,
        text: `Check out this concert with me!\n\n${selectedConcert.artist}\n${selectedConcert.date}, ${selectedConcert.time}\n📍 ${selectedConcert.location}\n[Click here for tickets](${selectedConcert.link})`,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(messageRef, concertDetailsMessage);
        await setDoc(chatRef, {
          latestMessage: concertDetailsMessage.text,
          [`unreadCount.${match.userId}`]: 1, // Increment unread count for the recipient
        }, { merge: true });
      } catch (error) {
        console.error("Error sending text message: ", error);
      }
    }

    setModalVisible(false);
    setSelectedMatches([]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.concertItem}>
      <Image source={{ uri: item.image }} style={styles.concertImage} />
      <Text style={styles.concertTitle}>{item.artist}</Text>
      {item.title ? <Text style={styles.concertText}>{item.title}</Text> : null}
      <Text style={styles.concertText}>{item.date}, {item.time}</Text>
      <Text style={styles.concertText}>📍 {item.location}</Text>
      <TouchableOpacity onPress={() => openLink(item.link)} style={styles.linkContainer}>
        <Text style={styles.link}>Get tickets here!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSharePress(item)} style={styles.shareButton}>
        <Feather name="share" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

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
    position: 'relative',
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
    width: '100%',
    marginTop: 2,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'left',
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

export default ConcertsScreen;
