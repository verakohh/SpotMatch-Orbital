import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking, Image, ActivityIndicator } from 'react-native';

const ConcertsScreen = () => {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/concerts.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setConcerts(data);
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
  },
  concertItem: {
    marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
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
  },
  concertText: {
    textAlign: 'left',
  },
  linkContainer: {
    width: '100%', // Ensure it takes the full width
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'left',
  },
});

export default ConcertsScreen;
