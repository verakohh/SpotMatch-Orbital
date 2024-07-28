import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { getUser } from '../../User';
import { getDoc } from 'firebase/firestore';
import { ref } from '../../../firebase';

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserProfile() {
            const user = await getUser();
            const userDocRef = user.docRef;
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                setUserData(userDocSnap.data());
                setLoading(false);
            } else {
                console.log("User not found");
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>No user data found.</Text>
            </View>
        );
    }
    const top3artists = userData.topArtists ? userData.topArtists.slice(0, 3) : [];
    const top3genres = userData.genres ? userData.genres.slice(0, 3) : [];
    const topTracks = userData.topTracks ? userData.topTracks.slice(0, 3) : [];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: userData.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
            <Text style={styles.age}>Age: {userData.age}</Text>
            <View style={styles.section}>
                <Text style={styles.header}>Top 3 Artists: </Text>
                {top3artists.map((artist, index) => (
                    <Text key={index} style={styles.text}>{artist}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Top 3 Genres: </Text>
                {top3genres.map((genre, index) => (
                    <Text key={index} style={styles.text}>{genre}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.header}>Top Tracks: </Text>
                {topTracks.map((track, index) => (
                    <Text key={index} style={styles.text}>{track.name} by {track.artist}</Text>
                ))}
            </View>
        </ScrollView>
        );
    }
            {/* <Text style = {styles.birthday}>Birthday: {userData.birthdate}</Text> */}
            
            {/* <Text style={styles.sectionTitle}>Top 3 Genres:</Text>
            {userData.genres && userData.genres.slice(0, 3).map((genre, index) => (
                <Text key={index} style={styles.text}>{genre}</Text>
            ))}

            <Text style={styles.sectionTitle}>Top 3 Artists:</Text>
            {userData.topArtists && userData.topArtists.slice(0, 3).map((artist, index) => (
                <Text key={index} style={styles.text}>{artist}</Text>
            ))}
            <Text style={styles.sectionTitle}>Top 3 Songs:</Text>
            {userData.topTracks && userData.topTracks.slice(0, 3).map((track, index) => (
                <Text key={index} style={styles.text}>{track.name} by {track.artist}</Text>
            ))}
        </View> */}
    

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#FAF4EC',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAF4EC',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#BAD6EB',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212E37',
        textAlign: 'center',
    },
    age: {
        fontSize: 18,
        marginVertical: 10,
        color: '#212E37',
        textAlign: 'center',
    },
    section: {
        width: '90%',
        backgroundColor: '#BAD6EB',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 3,
        alignItems: 'center', // Center content within the section
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#316BCD',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
        color: '#316BCD',
        textAlign: 'center',
    },
});
