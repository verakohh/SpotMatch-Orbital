//screens/Events/GigsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

const GigsScreen = () => {
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGigs = async () => {
      setIsLoading(true);
      try {
        const db = getFirestore();
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
