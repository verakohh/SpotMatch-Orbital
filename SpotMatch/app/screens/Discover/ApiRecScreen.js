import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getUser, getToken, getTokenExpiration, removeToken } from '../../User';
import { useNavigation , useFocusEffect} from '@react-navigation/core';
import { getDoc, getDocs, query, where} from 'firebase/firestore';
import { ref, usersColRef } from '../../../firebase';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import SpotifyWebApi from "spotify-web-api-node";
import { BlurView } from 'expo-blur';
import Feather from 'react-native-vector-icons/Feather';
import { Audio } from 'expo-av';


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

    const playingRef = useRef(false);
    const currentTrackRef = useRef(null);
    const deviceIdRef = useRef(null);


    const fetchApiRecommendations = async () => {
        const token = await getToken();
        setLoading(true);
        const user = await getUser();
        const userDocRef = ref(user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (!await checkTokenValidity(token)) {
            navigation.navigate('Access');
            return;
        }

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userTopTracks = userData.topTracks  && userData.topTracks.length > 0 ? userData.topTracks.map(track => track.id) : [];

            const seedTracksIds = userTopTracks.slice(0, 5).join(',');
            setSeedTracks(seedTracksIds);
            console.log("seed tracks ids: ", seedTracksIds);

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
                setRecommendedTracks(tracks);
                setLoading(false);
                console.log("tracks:", recommendedTracks)
                console.log("tracks : ", tracks)
            } catch (error) {
                console.error("Error fetching recommendations: ", error);
            }
        } else {
            alert("Error! No userDoc");
        }

    }

    useFocusEffect(
        React.useCallback(() => {
          fetchApiRecommendations();
        }, [])
      );


       
    const getAvailableDevices = async () => {
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
            navigation.navigate('Access');
            return [];
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
                return [];
            }
        
    };
    
    const playTrack = async (uri) => {
       
        const token = await getToken();
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
            }
        } else {
            alert("No devices available");
        }
    };

    const pauseTrack = async () => {
        const token = await getToken();
        if (!await checkTokenValidity(token)) {
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
            navigation.navigate('Access');
        }
    };

    const renderCard = (card) => (
        <View style={styles.card} key={card.id}>
            <ImageBackground
                style={styles.imgBackground}
                resizeMode="cover"
                source={{ uri: card.albumImg }}
            >
                <BlurView
                    intensity={150}
                    style={[StyleSheet.absoluteFill]}
                >

                        <Image
                            style={styles.cardImg}
                            source={{ uri: card.albumImg }}
                        />

                        <Text style={styles.title}>{card.name}</Text>
                        <Text style={styles.artist}>{card.artist}</Text>

                        <View style={{ alignItems: 'center'}}>
                        <TouchableOpacity 
                            style={[styles.playPauseButton
                                // , {display: playing ? "flex" : "none"}
                            ]}  
                            onPress={() => handlePlayPause(card.uri)}
                            >
                        <Feather name='play' size={30}/>

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
                renderCard={renderCard}
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
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
   

});
