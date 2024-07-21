import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { getUser, getToken, getTokenExpiration, removeToken } from '../User';
import { FIREBASE_AUTH, db, ref } from '../../firebase';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'react-native-svg';


const ChatMusicScreen = ({route}) => {
    const { combinedId } = route.params;
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [chatMusic, setChatMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUser = FIREBASE_AUTH.currentUser;
    const navigation = useNavigation();

    useEffect(() => {
        fetchChatMusic();
    }, []);

    const fetchChatMusic = async () => {
        const chatDocRef = doc(db, 'chats', combinedId);
        const chatDocSnap = await getDoc(chatDocRef);
        const user = await getUser();
        const userDocRef = ref(user.email);
        const userDocSnap = await getDoc(userDocRef);
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }

        if (chatDocSnap.exists()) {
            const chatData = chatDocSnap.data();
            const fetchedChatMusic = chatData.chatMusic || [];
            setChatMusic(fetchedChatMusic);
        }

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const spotifyId = userData.spotifyId;
            const matchedPlaylistId = userData.matchedPlaylistId;

            if (!matchedPlaylistId && spotifyId) {
                try {
                    const response = await axios.post(`https://api.spotify.com/v1/users/${spotifyId}/playlists`, {
                        name: "SpotMatch Matched Playlist",
                        description: "Playlist for matched songs",
                        public: false,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const playlistId = response.data.id;
                    await user.update({ matchedPlaylistId: playlistId, matchedPlaylistSongs: []});
                } catch (error) {
                    console.error("Error creating playlist: ", error);
                    if(error.status === 429) {
                        alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                    }
                }
            }
        } else {
            alert("Error! No userDoc");
        }
        setLoading(false);
    };


    const searchSongs = async (query) => {
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: {
                q: query,
                type: 'track',
                limit: 10,
            },
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        setSearchResults(response.data.tracks.items);
    };


    const checkTokenValidity = async () => {
        try {
            const expiration = await getTokenExpiration();
            if (expiration && new Date().getTime() < parseInt(expiration)) {
                console.log("token is okay")
                return true;
            }
        } catch (error) {
            console.error('Error checking token validity', error);
        }
        return false;
    };

    const addSongToChatMusic = async (song) => {
       
        const chatDocRef = doc(db, 'chats', combinedId);
        const songInMin = msToMins(song.duration_ms);
        const songObject = ({
            id: song.id,
            uri: song.uri, 
            name: song.name, 
            albumImg: song.album.images[0].url, 
            // albumName: song.album.name,
            previewUrl: song.preview_url,
            artist: song.artists[0].name,
            durationMs: songInMin
        })
        if (chatMusic.some(existingSong => existingSong.id === song.id)) {
            alert("Song already included!");
            return;
        }

        await updateDoc(chatDocRef, {
            chatMusic: arrayUnion(songObject),
        });
        setChatMusic((prev) => [...prev, songObject]);
        setSearchResults([]);
    };

    const msToMins = ms => {
        const min = Math.floor(ms / 60000);
        const sec = ((ms % 60000) / 1000).toFixed(0);
        return (
            sec == 60 
                ? (min + 1) + ":00"
                : min + ":" + (sec < 10 ? "0" : "") + sec
        );
    }

    const removeSongFromChatMusic = async (song) => {
        const chatDocRef = doc(db, 'chats', combinedId);
        await updateDoc(chatDocRef, {
            chatMusic: arrayRemove(song),
        });
        setChatMusic((prev) => prev.filter((item) => item.id !== song.id));
    };

    const addSongToPlaylist = async (song) => {
        const user = await getUser();
        const userDocRef = user.docRef;
        const userDocSnap = await getDoc(userDocRef);
        const userData = userDocSnap.data();
        const matchedPlaylistId = userData.matchedPlaylistId
        const token = await getToken();

        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }

        if( userDocSnap.exists()) {
            await axios.post(`https://api.spotify.com/v1/playlists/${matchedPlaylistId}/tracks`, {
                uris: [song.uri],
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            await user.update({ matchedPlaylistSongs: arrayUnion(song.id)});
        } else {
            alert("No userDoc!")
        }
    };

    const handleSearch = async () => {
        if (query.trim()) {
            await searchSongs(query);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (

        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search for songs and enter..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    style={styles.searchBar}
                />
            </View>

            <Text style={styles.searchResultsHeader}>Search Results: (Pick the song!)</Text>
            <FlatList
                data={searchResults}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => addSongToChatMusic(item)}>
                        <Text style={styles.searchResultText}>{item.name} -    {item.artists[0].name}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                style={searchResults.length > 0 ? styles.searchResults : {display: "none"}}
            />
                            

            <View style={styles.listHeaderContainer}>

                <Text style={styles.listHeaderText}> #</Text>
                <Text style={[styles.listHeaderText, { flex: 7 }]}>Title</Text>
                <Feather name='clock' size={20} style={styles.listHeaderIcon} />
                <Feather name='music' size={20} style={styles.listHeaderIcon} />

            </View>
            <FlatList
                data={chatMusic}
                keyExtractor={(item) => item.id}
                renderItem={({ item , index }) => (
                    <View style={styles.songContainer}>
                        <Text style={styles.songIndex}>{index + 1}</Text>

                        <Image source={{ uri: item.albumImg }} style={styles.albumArt} />
                        <View style={styles.songDetails}>
                            <Text style={styles.songName}>{item.name}</Text>
                            <Text style={styles.artistName}>{item.artist}</Text>
                        </View>
                        {/* <Text style={styles.albumName}>{item.albumName}</Text> */}
                        <Text style={styles.duration}>{item.durationMs}</Text>


                        <TouchableOpacity onPress={() => removeSongFromChatMusic(item)} style={styles.button}>
                            <Feather name='trash' size={24}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => addSongToPlaylist(item)} style={styles.button}>
                            <Feather name='plus' size={24}/>
                        </TouchableOpacity>
                    </View>
                )}
                style={styles.chatMusicList}
            />

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF4EC',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBar: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
        marginVertical: 10,
        marginHorizontal: 8,
        // width: "90%"
    },
    searchResultsHeader: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    searchResults: {
        flex: 1,
        backgroundColor: "#E5E4E2", 
        marginTop: 4,
        paddingHorizontal: 12,
    },
    searchResultText: {
        marginVertical: 4,
        paddingVertical: 3,
        color: '#000',

    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#C0C0C0',
    },
    listHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 15,
    },
    listHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',

        flex: 1,
         
    },
    listHeaderIcon: {
        flex: 2,
        textAlign: 'center',
    },
    button: {
        marginHorizontal: 4,
    },
    chatMusicList: {
        marginBottom: 16,
    },
    songContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    songIndex: {
        width: 20,
        textAlign: 'center',
        marginRight: 10,
    },
    albumArt: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    songDetails: {
        flex: 1,
    },
    songName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    artistName: {
        fontSize: 14,
        color: '#555',
    },
    duration: {
        fontSize: 14,
        color: '#555',
        marginRight: 20,
    },
    albumName: {
        fontSize: 14,
        color: '#555',
        marginRight: 30,
        paddingTop: 10
    },
});

export default ChatMusicScreen
