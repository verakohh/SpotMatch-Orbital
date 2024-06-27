import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';

const GigsScreen = () => {
  const [gigs, setGigs] = useState([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBaseUrl = async () => {
      const url = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
      console.log('Base URL set to:', url); // Debugging log
      setBaseUrl(url);
    };

    fetchBaseUrl();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}/messages.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('messages.json response text:', responseText); // Debugging log

        let imageData;
        try {
          imageData = JSON.parse(responseText);
        } catch (error) {
          console.error('Error parsing JSON from messages.json:', error);
          throw error;
        }

        setGigs(imageData);
        console.log('Gigs fetched:', imageData.length);

      } catch (error) {
        console.error('Error fetching gigs or images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (baseUrl) {
      fetchData();
    }
  }, [baseUrl]);

  const renderGig = ({ item }) => (
    <View style={styles.gigContainer}>
      {item.media_url ? (
        <Image 
          source={{ uri: `${baseUrl}/${item.media_url}` }}
          style={styles.image} 
          resizeMode="contain"
          onError={(error) => console.log('Image failed to load:', item.media_url, error.nativeEvent.error)}
        />
      ) : (
        <Text>Image not available</Text>
      )}
      <Text style={styles.title}>{extractGigTitle(item.message)}</Text>
      {extractGigExtraInfo(item.message) ? <Text style={styles.extraInfo}>{extractGigExtraInfo(item.message)}</Text> : null}
      <Text style={styles.mainArtist}>{extractGigMainArtist(item.message)}</Text>
      <Text style={styles.artists}>{extractGigArtists(item.message)}</Text>
      <Text style={styles.dateAndTime}>{extractGigDateAndTime(item.message)}</Text>
      <Text style={styles.location}>📍 {extractGigLocation(item.message)}</Text>
      {extractGigLink(item.message) ? (
        <TouchableOpacity onPress={() => Linking.openURL(extractGigLink(item.message))}>
          <Text style={styles.link}>{extractGigLinkText(item.message)}</Text>
        </TouchableOpacity>
      ) : (
        extractGigLinkText(item.message) && (
          <Text style={styles.linkText}>{extractGigLinkText(item.message).toLowerCase().startsWith('free') ? 'Free admission!' : extractGigLinkText(item.message)}</Text>
        )
      )}
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

  const extractGigTitle = (message) => {
    return message.split('\n')[0];
  };

  const extractGigExtraInfo = (message) => {
    const lines = message.split('\n');
    return lines[1].startsWith('by') ? null : lines[1];
  };

  const extractGigMainArtist = (message) => {
    const lines = message.split('\n');
    return lines.find(line => line.startsWith('by'));
  };

  const extractGigArtists = (message) => {
    return message.split('\n').find(line => line.startsWith('ft.'));
  };

  const extractGigDateAndTime = (message) => {
    return message.split('\n').find(line => /\d{1,2} \w{3}, \d{1,2}(AM|PM)/.test(line) || /\d{1,2}:\d{2}(AM|PM)/.test(line));
  };

  const extractGigLocation = (message) => {
    const lines = message.split('\n');
    const locationLine = lines.find(line => line.includes('📍'));
    return locationLine ? locationLine.replace(/📍/, '').trim() : '';
  };

  const extractGigLink = (message) => {
    const linkMatch = message.match(/https?:\/\/[^\s]+/);
    return linkMatch ? linkMatch[0] : null;
  };

  const extractGigLinkText = (message) => {
    const linkTextMatch = message.match(/(tickets here!|Free admission!)/i);
    return linkTextMatch ? linkTextMatch[0] : '';
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
  },
  gigContainer: {
    margin: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  extraInfo: {
    fontSize: 16,
    marginVertical: 5,
  },
  mainArtist: {
    fontSize: 16,
    marginVertical: 5,
  },
  artists: {
    fontSize: 16,
    marginVertical: 5,
  },
  dateAndTime: {
    fontSize: 14,
    marginVertical: 5,
  },
  location: {
    fontSize: 14,
    marginVertical: 5,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  linkText: {
    fontSize: 15,
    marginTop: 10,
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
