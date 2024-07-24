import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getUser, getToken, getTokenExpiration, removeToken, getSubscription } from '../../User';
import { useNavigation , useFocusEffect} from '@react-navigation/core';
import { getDoc, getDocs, query, where, arrayUnion} from 'firebase/firestore';
import { ref, usersColRef } from '../../../firebase';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import SpotifyWebApi from "spotify-web-api-node";
import { BlurView } from 'expo-blur';
import Feather from 'react-native-vector-icons/Feather';
import { Audio } from 'expo-av';
import DiscoverInstructionImage from '../../../assets/images/Discover-Instruction-Image.png';


export default function ApiRecScreen() {
    const navigation = useNavigation();
    const [recommendedTracks, setRecommendedTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [seedTracks, setSeedTracks] = useState([]);
    const [isDebounced, setIsDebounced] = useState(false);
    const [premium, setPremium] = useState(true);


    const playingRef = useRef(false);
    const currentTrackRef = useRef(null);
    const deviceIdRef = useRef(null);


    const fetchApiRecommendations = async () => {
        await checkPremium();
        
        if (premium) {
            const token = await getToken();
            setLoading(true);
            const user = await getUser();
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (!await checkTokenValidity(token)) {
                alert("Token of 1 hour has expired! Kindly refresh it")
                navigation.navigate('Access');
                return;
            }

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const spotifyId = userData.spotifyId;
                const discPlaylistSongs = userData.discPlaylistSongs;
                const userTopTracks = userData.topTracks  && userData.topTracks.length > 0 ? userData.topTracks.map(track => track.id) : [];

                const seedTracksIds = userTopTracks.slice(0, 5).join(',');
                setSeedTracks(seedTracksIds);
                console.log("seed tracks ids: ", seedTracksIds);

                const userTrack = userData.topTracks[0].uri;
                const userTrackId = userData.topTracks[0].id;
                console.log("userTrack: ", userTrack);
                const instruction = [({
                    albumImg: DiscoverInstructionImage,
                    name: 'Instructions',
                    artist: 'Swipe LEFT for dismissal / RIGHT to add the song to a playlist in Spotify! \n Press the button below to stop / rewind a song \n Note: Refrain from spamming right swipes to avoid exceeding Spotify API rate limits',
                    names: ["SpotMatch"], 
                    uri: userTrack, 
                    id: userTrackId, 
                    flag: true})];
                console.log("instruction object: ", instruction)
                
                if (!userData.discPlaylistId && spotifyId) {
                    try {
                        const playlistResponse = await axios.post(`https://api.spotify.com/v1/users/${spotifyId}/playlists`, {
                            name: "SpotMatch Discover Playlist",
                            description: "Playlist for songs discovered via SpotMatch :)",
                            public: false
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const playlistId = playlistResponse.data.id;
                        console.log('playlist id: ', playlistId)
                        await user.update({ discPlaylistId: playlistId , discPlaylistSongs: []});
                    } catch (error) {
                        console.error("Error creating playlist: ", error);
                        if(error.status === 429) {
                            alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                        }
                    }
                }

                const options = {
                    seed_tracks: seedTracksIds,
                    limit: 20
                }
                try {
                    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
                    params: options,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                    });
                    const tracks = response.data.tracks.map(track => ({
                        id: track.id,
                        uri: track.uri,
                        name: track.name,
                        artist: track.artists[0].name,
                        albumImg: track.album.images[0].url
                    }))

                    const filteredTracks = discPlaylistSongs ? tracks.filter(track => !discPlaylistSongs.includes(track.id)) : tracks;

                    setRecommendedTracks([...instruction, ...filteredTracks]);
                    setLoading(false);
                    console.log("tracks:", recommendedTracks)
                    console.log("tracks length : ", recommendedTracks.length)
                } catch (error) {
                    console.error("Error fetching recommendations: ", error);
                    if(error.status === 429) {
                        alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                    }
                }
            } else {
                alert("Error! No userDoc");
            }
        } else {
            console.log("not premium")
        }

    }

    useFocusEffect(
        React.useCallback(() => {
            fetchApiRecommendations();

            if (premium) {
            const checkIfPlayingAndPause = async () => {
                const currentlyPlaying = await isPlaying();
                if (currentlyPlaying) {
                await pauseTrack();
                }
            };
        
                return async () => {
                    await checkIfPlayingAndPause();
                };
            }
        }, [])
      );


    const checkPremium = async () => {
        const subs = await getSubscription();
        console.log( subs)
        if (subs !== "premium") {
            console.log("in here!")
            setPremium(false);
            
        } else {
            console.log("user is premium! everything okay!")

        }

    }

    if (!premium) {
        return (
            <View style={styles.containerNonPremium}>
                <Text style={styles.containerNonPremiumText}>Sorry, the playing of songs using the Spotify API is only for Spotify Premium users..</Text>
            </View>
        );
    }

    const isPlaying = async () => {
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/player', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('response is playing: ', response.data.is_playing)

            return response.data.is_playing;
        } catch (error) {
            console.error("Error fetching is_playing: ", error);
            if(error.status === 429) {
                alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
            }
        }

    };

       
    const getAvailableDevices = async () => {
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }

            try {
                const response = await axios.get('https://api.spotify.com/v1/me/player/devices', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("response", response);
                console.log('response device: ', response.data.devices)

                return response.data.devices;
            } catch (error) {
                console.error("Error fetching devices: ", error);
                if(error.status === 429) {
                    alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                }
            }
        
    };
    
    const playTrack = async (uri) => {
        if (!uri) {
            alert("No top track uri! Unable to play");
            return;
        }
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }
        const devices = await getAvailableDevices();
        console.log('devices: ', devices)
        if (devices.length > 0) {
            const selectedDevice = devices[0].id; // Select the first device
            setDeviceId(selectedDevice);
            deviceIdRef.current = selectedDevice;
            try {
                await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${selectedDevice}`, 
                { uris: [uri] },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setPlaying(true);
                setCurrentTrack(uri);
                playingRef.current = true;
                currentTrackRef.current = uri;

            } catch (error) {
                console.error("Error playing track: ", error);
                if(error.status === 429) {
                    alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                }
            }
        } else {
            alert("No devices available");
        }
    };

    const pauseTrack = async () => {
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }
        try {
            setPlaying(false);
            playingRef.current = false;
            console.log("device id: ", deviceIdRef.current)
            await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceIdRef.current}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
        } catch (error) {
            console.error("Error pausing track: ", error);
            if(error.status === 429) {
                alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
            }
        }
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

    const handlePlayPause = async (uri) => {
        if (isDebounced) return;
        setIsDebounced(true);
        setTimeout(() => setIsDebounced(false), 500);

        const isTokenValid = await checkTokenValidity();
        if (isTokenValid ) {
            console.log("playing: ",playingRef.current)
            console.log("current track === uri: ",currentTrackRef.current === uri)
            if (playingRef.current && currentTrackRef.current === uri) { 
                await pauseTrack();

            } else {
                await playTrack(uri);
            }
        } else {
            await removeToken();
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
        }
    };


    const onSwiped = async (cardIndex) => {
        if (cardIndex < recommendedTracks.length - 1) {
            await playTrack(recommendedTracks[cardIndex + 1].uri);
            return;
        }
        await pauseTrack();

    }

    const handleRight = async (cardIndex) => {
        const user = await getUser();
        const userDocRef = ref(user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const playlistId = userData.discPlaylistId;
            const discPlaylistSongs = userData.discPlaylistSongs;
            const trackUri = recommendedTracks[cardIndex].uri;
            const trackId = recommendedTracks[cardIndex].id;
            const token = await getToken();
            const isTokenValid = await checkTokenValidity();

            if (isTokenValid) {
                if (trackUri && trackId && !discPlaylistSongs.includes(trackId)) {

                    try {
                        await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                            uris: [trackUri]
                        }, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        await user.update({
                            discPlaylistSongs: arrayUnion(trackId)
                        });
                    } catch (error) {
                        console.error("Error adding track to playlist: ", error);
                        if(error.status === 429) {
                            alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                        }
                    }
                } else {
                    alert("Either no top track or the song has been added before! Not added to the Spotify playlist")
                }
            } else {
                await removeToken();
                alert("Token of 1 hour has expired! Kindly refresh it")
                navigation.navigate('Access');
            }
        }
    };

    const renderCard = (card) => (
        <View style={styles.card} key={card.id}>
            <ImageBackground
                style={styles.imgBackground}
                resizeMode="cover"
                source={card.flag ? card.albumImg : { uri: card.albumImg }}
            >
                <BlurView
                    intensity={150}
                    style={[StyleSheet.absoluteFill]}
                >

                        <Image
                            style={styles.cardImg}
                            source={card.flag ? card.albumImg : { uri: card.albumImg }}
                        />

                       
                            <Text style={styles.title}>{card.name}</Text>
                            {card.flag ? 
                            <Text style={styles.instruction}>{card.artist}</Text>
                                :<Text style={styles.artist}>{card.artist}</Text>
                            }       

                        <View style={{ alignItems: 'center'}}>
                        <TouchableOpacity 
                            style={[styles.playPauseButton
                                // , {display: playing ? "flex" : "none"}
                            ]}  
                            onPress={() => handlePlayPause(card.uri)}
                            >
                        <Feather name='music' size={30}/>

                        {/* {isPlaying() ? <Feather name='stop-circle' size={30}/> : <Feather name='rewind' size={30}/>} */}

                    {/* {playing && currentTrack === card.uri ? <Feather name='pause' size={30}/> : <Feather name='play' size={30}/>} */}

                        </TouchableOpacity>
                        </View>

                         {/* <TouchableOpacity 
                            style={[styles.playPauseButton, {display: playing ? "none" : "flex"}]}  
                            onPress={() => handlePlayPause(card.uri)}
                            >
                            <Feather name='play' size={30}/>
                        </TouchableOpacity> */}
            
                </BlurView>
            </ImageBackground>
            

           
        </View>
    );


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!recommendedTracks || recommendedTracks.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No tracks found.</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={["#3a5e91", "transparent"]} style={{flex:1}} >
            <Swiper
                cards={recommendedTracks}
                renderCard={(card) => {
                    if (card.flag) {
                        playTrack(card.uri);
                        return renderCard(card);
                    } else {
                        return renderCard(card);
                    }
                }}
                onSwiped={(cardIndex) => {
                    onSwiped(cardIndex);
                    console.log(cardIndex);}}                
                onSwipedRight={handleRight}
                onSwipedAll={() => {fetchApiRecommendations()}}
                stackSize= {3}
                stackSeparation={15}
                disableTopSwipe
                disableBottomSwipe
                backgroundColor={"transparent"}
            />
    
        </LinearGradient>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerNonPremium: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10, 
        padding: 10,
        marginHorizontal: 25,
    },
    containerNonPremiumText: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10, 
        padding: 10,
        fontSize: 25,
        fontWeight: '500', 
        color: "#777696"
    },
    imgBackground: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    card: {
        flex: Dimensions.get("window").height < 700 ? 0.5 : 0.6,
        borderRadius: 8,
        shadowRadius: 25,
        shadowColor: '#171717',  
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'lightgrey',
        overflow: "hidden",
        marginTop: 10,

      },
    cardImg: {
        flex: 1,
        width: "70%",
        resizeMode: "contain",
        borderRadius: 8,
        marginTop: 5,
        marginbottom: 5,
        marginLeft: '15%',
    },
    title: {
        // marginTop: 2,
        fontSize: 25,
        fontWeight: '600',
        color: "white",
        width: "100%",
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 6,
        paddingBottom: 10,
        paddingHorizontal: 12,
        textAlign: "center",
    },
    artist: {
        color: "white",
        textAlign: "center",
        fontSize: 19,
        fontWeight: '500',
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 5,
        paddingHorizontal: 10,

    },
    playPauseButton: {
        alignItems: 'center',
        width: "28%",
        backgroundColor: '#1DB954',
        borderRadius: 50,
        paddingVertical: 8,
        paddingHorizontal: 18,
        margin: 15,

    },
    instruction: {
        color: "white",
        textAlign: "center",
        fontSize: 17,
        fontWeight: '500',
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,

    },
   

});
