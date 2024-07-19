import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db, FIREBASE_AUTH } from '../../firebase';
import { getUser } from '../User';

const ChatListScreen = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
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
              const docSnap = await getDoc(doc(db, 'users', docRef.id));
              if (docSnap.exists()) {
                const userData = docSnap.data();
                return {
                  userId: userData.userId,
                  firstName: userData.firstName,
                  imageUrl: userData.imageUrl,
                  email: userData.email
                };
              }
              return null;
            })
          );

          const filteredMatches = matchDocs.filter((doc) => doc !== null);

          // Add snapshot listeners for each match to get latest messages and unread counts
          filteredMatches.forEach(async (match) => {
            const combinedId = currentUser.uid > match.userId ? `${currentUser.uid}_${match.userId}` : `${match.userId}_${currentUser.uid}`;
            const chatRef = doc(db, 'chats', combinedId);

            onSnapshot(chatRef, (doc) => {
              const chatData = doc.data();
              match.latestMessage = chatData?.latestMessage || '';
              match.unreadCount = chatData?.unreadCount?.[currentUser.uid] || 0;
              setMatches([...filteredMatches]);
            });
          });

          setMatches(filteredMatches);
          console.log("Matches: ", filteredMatches.map(match => match.firstName));
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser.uid]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.matchContainer}
      onPress={() => navigation.navigate('ChatScreen', { user: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
      <View style={styles.matchInfo}>
        <Text style={styles.name}>{item.firstName}</Text>
        <Text style={styles.latestMessage}>{item.latestMessage}</Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
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
        <Text>Start matching to chat with people!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.userId}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4EC',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    marginHorizontal: 25,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  matchInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  latestMessage: {
    color: '#888',
  },
  unreadBadge: {
    backgroundColor: '#3F78D8',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  unreadCount: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatListScreen;
