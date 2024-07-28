import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const InstructionsScreen = () => {
  return (
    <LinearGradient colors={['#2c486e', '#b0c4df']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome to SpotMatch!</Text>
        <Text style={styles.subtitle}>How to Use the App:</Text>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>1.</Text>
          <Text style={styles.instructionText}>
            A card represents a user. Tap on it to find out more about a user's music taste.
          </Text>

        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>2.</Text>
          <Text style={styles.instructionText}>
            Swipe LEFT to dismiss a user you're not interested in. If accidentally swiped, not to worry as the user will be shown again later on.
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>3.</Text>
          <Text style={styles.instructionText}>
            Swipe RIGHT to send a request to the user displayed on the card.
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>4.</Text>
          <Text style={styles.instructionText}>
            Check your requests, matches, profile, settings, and FAQ at the side bar under the requests section.
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>5.</Text>
          <Text style={styles.instructionText}>
            There are 2 ways to find your music buddy: the matching algorithm by common genre and artists, or if you're open minded, discovering everyone.
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>6.</Text>
          <Text style={styles.instructionText}>
            Get to know your matches better by discovering their top tracks or listen to new songs recommended by the Spotify API. Due to Spotify API's limits, kindly ensure you play a song in Spotify so that your device is detected before navigating to the Discover section! Swipe RIGHT to add the song to a SpotMatch Discover playlist in your Spotify and refresh your Spotify library to see the Discover playlist and songs!
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>7.</Text>
          <Text style={styles.instructionText}>
            Chat with your matches or listen to music together in the Chat section! Due to Spotify API's limits, kindly ensure you play a song in Spotify so that your device is detected before navigating to the Chat section! Add songs to the SpotMatch Chat Playlist and refresh your Spotify library to see the Chat playlist and songs!
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>8.</Text>
          <Text style={styles.instructionText}>
            Events section's got you covered for ideas to spend time with your matches! 
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={styles.instructionNumber}>9.</Text>
          <Text style={styles.instructionText}>
            Tune in, and friend out!
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#d3deed',
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  instructionNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 10,
  },
  instructionText: {
    fontSize: 18,
    color: '#ffffff',
    flex: 1,
  },
});

export default InstructionsScreen;
