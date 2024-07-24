import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { getUser, getToken } from '../../User';
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
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text>No user data found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: userData.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
            <Text style={styles.age}>Age: {userData.age}</Text>
            {/* <Text style = {styles.birthday}>Birthday: {userData.birthdate}</Text> */}
            
            <Text style={styles.sectionTitle}>Top 3 Genres:</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#FAF4EC',
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 70,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8
    },
    age: {
        fontSize: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 24,
    },
    text: {
        fontSize: 16,
        marginVertical: 5,
    },
});
