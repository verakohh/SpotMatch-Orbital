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


export default function UserRecScreen() {
    const navigation = useNavigation();
    const [recommendedTracks, setRecommendedTracks] = useState([]);
    const [allTracks, setAllTracks] = useState([]);
    const [trackIndex, setTrackIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [deviceId, setDeviceId] = useState(null);
    const [currentSound, setCurrentSound] = useState(null);
    const [api, setApi] = useState(null);
    const [isDebounced, setIsDebounced] = useState(false);
    const playingRef = useRef(false);
    const currentTrackRef = useRef(null);
    const deviceIdRef = useRef(null);

    const fetchData = async () => {
        const token = await getToken();
        const spotifyApi = new SpotifyWebApi({ 
            clientId : '89d33611962f42ecb9e982ee2b879bb8',
            redirectUri : 'spotmatch://callback',
            accessToken: token});
        setApi(spotifyApi);
        console.log("spotify api: ", spotifyApi);
        console.log("token: ", token)
        try {
            // spotifyApi.setAccessToken(token);
            // console.log("spotify api: ", spotifyApi);

            console.log("set the token in fetchdata")
        } catch (err) {
            console.error("error in set token", err.message)
        }

        setLoading(true);

        const user = await getUser();
        const userDocRef = ref(user.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userGenres = userData.genres || [];
            const previousMatchedUsers = userData.matchedUsers || [];
            // const userTopTracks = userData.topTracks  && userData.topTracks.length > 0 ? userData.topTracks.map(track => track.uri) : [];
            
            if (trackIndex >= allTracks.length || trackIndex === 0) {
                console.log("index: ", trackIndex);
                const q = query(usersColRef, where("genres", "array-contains-any", userGenres));
                const querySnapshot = await getDocs(q);

                console.log("querySnapshot docs : ", querySnapshot.docs)

                if (querySnapshot.empty) {
                    setRecommendedTracks([]);
                    setLoading(false);
                    return;
                }

                let tracks = [];
                querySnapshot.forEach(doc => {
                    const docData = doc.data();
                    if (docData.topTracks && docData.topTracks.length > 0) {
                        tracks = [
                            ...tracks, 
                            ...docData.topTracks.filter(track => track.uri && track.uri !== null)
                        ];
                    }
                                    
                });
                // console.log("user top tracks: ", userTopTracks);

                console.log("tracks: ", tracks);
                console.log(tracks.length)


                const uniqueTracks = tracks.filter(track => track.uri
                    //  && !userTopTracks.includes(track.uri) // commented bcs dont have other users with uri yet other than self accs
                    );
            
                console.log('unique tracks: ', uniqueTracks);
                console.log(uniqueTracks.length)

                const rankedTracks = uniqueTracks.sort((a, b) => {
                    const aGenreMatch = a.genres ? a.genres.filter(genre => userGenres.includes(genre)).length : 0;
                    const bGenreMatch = b.genres ? b.genres.filter(genre => userGenres.includes(genre)).length : 0;
                    return bGenreMatch - aGenreMatch;
                });

                console.log("rankedTracks : ", rankedTracks)

                setAllTracks(rankedTracks);
                setRecommendedTracks(rankedTracks.slice(0, 20));
                setTrackIndex(20);
                setLoading(false);
                console.log('recommended tracks :', recommendedTracks)
            } else {
                console.log("at else")
                console.log("initial index: ",trackIndex)
                console.log(allTracks[trackIndex])

                setRecommendedTracks(allTracks.slice(trackIndex, trackIndex + 20));
                const newTrackIndex = trackIndex + 20;
                setTrackIndex(newTrackIndex);
                console.log("recommended tracks: ", recommendedTracks)
                console.log("after the slicing index: ",trackIndex) // supposed to be 40 after updating but remains as 20
                console.log("new track index: ", newTrackIndex) //correctly shows 40
                console.log(allTracks[trackIndex])// supposed to be 40 element but shows the 20 one due to the above
                console.log(allTracks[trackIndex + 19])// supposed to be undefined bcs trackIndex updated to 40, so it would be 59 but shows the element at 39

                setLoading(false);
            }
        } else {
            alert("Error! No userDoc");
            return;
        }

    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
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
            // console.log("response", response.devices);
            // const data = await response.json();
            // return data.devices;
        
    };
    
    const playTrack = async (uri) => {
        // try {
            
        //     console.log("at playTrack")
            
        //     await Audio.setAudioModeAsync({
        //         playsInSilentModeIOS: true,
        //         staysActiveInBackground: false,
        //         shouldDuckAndroid: false
        //     })
        //     const {sound, status} = await Audio.Sound.createAsync(
        //         {
        //             uri: uri
        //         },
        //         {
        //             shouldPlay: true, 
        //             isLooping: false
        //         }
        //     )
        //     console.log("sound", sound);
        //     setCurrentSound(sound);
        //     await sound.playAsync();
        //     setCurrentTrack(uri);
        //     setPlaying(true);
        // } catch (err) {
        //     console.error("Could not play track",err.message)
        // }
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


    // const playTrack = async (uri) => {
    //     try {
    //         console.log("at play track")
    //         console.log("api: ", api)
    //         console.log('The access token is ' + api.getAccessToken());

    //         await api.play({ uris: [uri] , position_ms: 50000,})
    //         .then(
    //             function () {
    //               setPlaying(true);
    //               console.log("playing");
    //             },
    //             function (err) {
    //               //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    //               console.log("Something went wrong!", err.message);
    //             }
    //         );
    //         // setPlaying(true);
    //         setCurrentTrack(uri);
    //     } catch (error) {
    //         console.error("Error playing track: ", error);
    //     }
    // };

    // const pauseTrack = async () => {
    //     try {
    //         console.log("at pause track")
    //         console.log("api: ", api)

    //         // console.log("spotify api: ", spotifyApi);

    //         console.log('The access token is ' + api.getAccessToken());

    //         await api.pause()
    //         .then(
    //             function () {
    //               setPlaying(false);
    //               console.log("Playback paused");
    //             },
    //             function (err) {
    //               //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
    //               console.log("Something went wrong!", err);
    //             }
    //           );
    //         // setPlaying(false);
    //     } catch (error) {
    //         console.error("Error pausing track: ", error);
    //     }
    // };
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

    // useEffect(() => {
    //     if (playing && currentTrack) {
    //       playTrack(currentTrack);
    //     }
    //   }, [playing, currentTrack]);

    const renderCard = (card) => (
        // await playTrack(card.uri),
            <View style={styles.card}>
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
                renderCard={
                    // (card) => {
                    // card ? await playTrack(card.uri) :
                    renderCard}
                onSwiped={(cardIndex) => {console.log(cardIndex)}}
                onSwipedAll={fetchData}
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
