import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { FIREBASE_AUTH, db, storage } from '../../firebase';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getUser } from '../User';
import * as ImagePicker from 'expo-image-picker';

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = route.params;
  const currentUser = FIREBASE_AUTH.currentUser;
  const flatListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const combinedId = currentUser.uid > user.userId ? `${currentUser.uid}_${user.userId}` : `${user.userId}_${currentUser.uid}`;


  useEffect(() => {
    if (!user) {
      console.error('User is undefined');
      return;
    }

    const chatRef = doc(db, 'chats', combinedId);
    const messagesRef = collection(chatRef, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    console.log("Setting up snapshot listener for chatId:", combinedId);

    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const messagesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null,
      }));
      console.log("Messages received:", messagesList);
      setMessages(messagesList);

      // Mark messages as read
      if (messagesList.length > 0) {
        const lastMessage = messagesList[messagesList.length - 1];
        if (lastMessage.sender !== currentUser.uid) {
          await updateDoc(chatRef, {
            [`unreadCount.${currentUser.uid}`]: 0,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uid, user?.userId]);

  const handleSend = async () => {
    if (newMessage.trim()) {
      const combinedId = currentUser.uid > user.userId ? `${currentUser.uid}_${user.userId}` : `${user.userId}_${currentUser.uid}`;
      const chatRef = doc(db, 'chats', combinedId);
      const messagesRef = collection(chatRef, 'messages');

      console.log("Sending message to chatId:", combinedId);

      try {
        // Check if the chat document exists
        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
          // If it doesn't exist, create it
          await setDoc(chatRef, {
            latestMessage: '',
            unreadCount: {
              [currentUser.uid]: 0,
              [user.userId]: 0
            }
          });
          console.log("Created new chat document with ID:", combinedId);
        }

        await addDoc(messagesRef, {
          sender: currentUser.uid,
          text: newMessage,
          timestamp: serverTimestamp()
        });

        // Update latest message and unread count
        const chatData = (await getDoc(chatRef)).data();
        const unreadCount = chatData.unreadCount || {};
        unreadCount[user.userId] = (unreadCount[user.userId] || 0) + 1;

        console.log("Updating latestMessage and unreadCount");
        console.log("latestMessage:", newMessage);
        console.log("unreadCount:", unreadCount);

        await updateDoc(chatRef, {
          latestMessage: newMessage,
          [`unreadCount.${user.userId}`]: unreadCount[user.userId],
        });

        setNewMessage('');
        flatListRef.current.scrollToEnd({ animated: true });
        console.log("Message sent successfully");
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri } = result;
      const imageUrl = await uploadImage(uri);
      sendImageMessage(imageUrl);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`images/${Date.now()}`);
    await ref.put(blob);
    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
  };

  const sendImageMessage = async (imageUrl) => {
    const combinedId = currentUser.uid > user.userId ? `${currentUser.uid}_${user.userId}` : `${user.userId}_${currentUser.uid}`;
    const chatRef = doc(db, 'chats', combinedId);
    const messagesRef = collection(chatRef, 'messages');

    try {
      await addDoc(messagesRef, {
        sender: currentUser.uid,
        imageUrl,
        timestamp: serverTimestamp()
      });

      // Update latest message and unread count
      const chatData = (await getDoc(chatRef)).data();
      const unreadCount = chatData.unreadCount || {};
      unreadCount[user.userId] = (unreadCount[user.userId] || 0) + 1;

      await updateDoc(chatRef, {
        latestMessage: 'Image',
        [`unreadCount.${user.userId}`]: unreadCount[user.userId],
      });

      flatListRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sending image message: ", error);
    }
  };

  const shareConcert = async (concert) => {
    const combinedId = currentUser.uid > user.userId ? `${currentUser.uid}_${user.userId}` : `${user.userId}_${currentUser.uid}`;
    const chatRef = doc(db, 'chats', combinedId);
    const messagesRef = collection(chatRef, 'messages');

    try {
      // Send concert image
      await addDoc(messagesRef, {
        sender: currentUser.uid,
        imageUrl: concert.image,
        timestamp: serverTimestamp()
      });

      // Send concert details
      await addDoc(messagesRef, {
        sender: currentUser.uid,
        text: `Check out this concert with me!\n${concert.artist}\n${concert.date}, ${concert.time}, at ${concert.location}\n[Click here for tickets](${concert.link})`,
        timestamp: serverTimestamp()
      });

      // Update latest message and unread count
      const chatData = (await getDoc(chatRef)).data();
      const unreadCount = chatData.unreadCount || {};
      unreadCount[user.userId] = (unreadCount[user.userId] || 0) + 1;

      await updateDoc(chatRef, {
        latestMessage: 'Shared a concert',
        [`unreadCount.${user.userId}`]: unreadCount[user.userId],
      });

      flatListRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Error sharing concert: ", error);
    }
  };

  const renderItem = ({ item }) => {
    const messageTimestamp = item.timestamp ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...';

    return (
      <View style={[
        styles.messageBubble,
        item.sender === currentUser.uid ? styles.myMessage : styles.theirMessage
      ]}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
        ) : (
          <Text style={item.sender === currentUser.uid ? styles.myMessageText : styles.theirMessageText}>{item.text}</Text>
        )}
        <Text style={item.sender === currentUser.uid ? styles.myMessageTimestampText : styles.theirMessageTimestampText}>
          {messageTimestamp}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MatchesProfileScreen', { user })}>
          <Image source={{ uri: user.imageUrl }} style={styles.profileImage} />
        </TouchableOpacity>

        <Text style={styles.headerText}>{user.firstName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity  onPress={() => navigation.navigate('ChatMusicScreen', { combinedId })}>
            <Feather name="headphones" size={24} color="black" />
          </TouchableOpacity>
          
            {/* <Feather name="more-vertical" size={24} color="black" /> */}
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        {newMessage.trim() !== '' && (
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Feather name="send" size={18} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleImagePick} style={styles.imageButton}>
          <Feather name="image" size={24} style={styles.imageIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4EC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  messagesContainer: {
    flex: 1,
  },
  messageBubble: {
    padding: 9,
    margin: 5,
    borderRadius: 18,
    maxWidth: '90%',
  },
  myMessage: {
    backgroundColor: '#3F78D8',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#BAD6EB',
    alignSelf: 'flex-start',
  },
  myMessageText: {
    color: '#FAF4EC',
    fontFamily: 'IBM-Plex-Sans',
  },
  theirMessageText: {
    color: '#000',
  },
  myMessageTimestampText: {
    fontSize: 10,
    color: '#FAF4EC',
    marginTop: 1,
    textAlign: 'right',
  },
  theirMessageTimestampText: {
    fontSize: 10,
    color: '#000',
    marginTop: 1,
    textAlign: 'right',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 20,
  },
  imageButton: {
    padding: 10,
  },
  imageIcon: {
    color: '#2196F3',
  },
});

export default ChatScreen;
