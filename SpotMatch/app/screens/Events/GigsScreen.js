// app/screens/Events/GigsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking, Platform, ActivityIndicator } from 'react-native';
import { fetchRSSFeed, extractGigData } from './rssParser';

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
        // Fetch gigs from RSS feed
        const feed = await fetchRSSFeed(1, 15); // No need for pagination
        let gigItems = [];
        if (feed && feed.items.length > 0) {
          console.log('Feed fetched, number of items:', feed.items.length);
          gigItems = feed.items.map(extractGigData);
          console.log('Gigs extracted:', gigItems.length);
        }

        // Fetch images from messages.json
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

        // Combine the gig data with image data
        const combinedData = gigItems.map(gig => {
          const matchedImage = imageData.find(image => image.message.includes(gig.gig_title));
          if (matchedImage) {
            gig.gig_image = `${baseUrl}/${matchedImage.media_url}`;
          }
          return gig;
        });

        setGigs(combinedData);
        console.log('Combined gigs:', combinedData.length);

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
      {item.gig_image ? (
        <Image 
          source={{ uri: item.gig_image }}
          style={styles.image} 
          resizeMode="contain"
          onError={(error) => console.log('Image failed to load:', item.gig_image, error.nativeEvent.error)}
        />
      ) : (
        <Text>Image not available</Text>
      )}
      <Text style={styles.title}>{item.gig_title}</Text>
      {item.gig_extrainfo ? <Text style={styles.extraInfo}>{item.gig_extrainfo}</Text> : null}
      <Text style={styles.mainArtist}>{item.gig_mainartist}</Text>
      <Text style={styles.artists}>{item.gig_artists}</Text>
      {item.gig_dateandtime ? <Text style={styles.dateAndTime}>{item.gig_dateandtime}</Text> : <Text style={styles.dateAndTime}>Date and time not specified</Text>}
      {item.gig_location ? <Text style={styles.location}>📍 {item.gig_location}</Text> : null}
      {item.gig_link === "Free entry!" ? (
        <Text style={styles.linkText}>Free entry!</Text>
      ) : (
        <TouchableOpacity onPress={() => Linking.openURL(item.gig_link)}>
          <Text style={styles.link}>Get tickets here!</Text>
        </TouchableOpacity>
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


