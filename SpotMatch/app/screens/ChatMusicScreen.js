import React, { useState, useEffect , useRef} from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Modal , ScrollView} from 'react-native';
import { getUser, getToken, getTokenExpiration, removeToken, getSubscription } from '../User';
import { FIREBASE_AUTH, db, ref } from '../../firebase';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'react-native-svg';
import { checkTokenValidity } from './Login';
import qs from 'qs';
import { CLIENT_ID } from '@env';


const ChatMusicScreen = ({route}) => {
    const { combinedId } = route.params;
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [chatMusic, setChatMusic] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deviceId, setDeviceId] = useState(null);
    const [isDebounced, setIsDebounced] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser;
    const [playingSong, setPlayingSong] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [premium, setPremium] = useState(true);

    const navigation = useNavigation();
    const flatListRef = useRef(null);
    const deviceIdRef = useRef(null);
    const playingRef = useRef(false);
    const playingIndexRef = useRef(0);
    const intervalRef = useRef(null);
    const playingSongIdRef = useRef(null);


    const fetchChatMusic = async () => {
        await checkPremium();
        await getAvailableDevices();
        
        if (premium) {
            try {
                setLoading(true);
                const chatDocRef = doc(db, 'chats', combinedId);
                const chatDocSnap = await getDoc(chatDocRef);
                const user = await getUser();
                const userDocRef = ref(user.email);
                const userDocSnap = await getDoc(userDocRef);


                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    let token = userData.token;
                    const expiresIn = userData.expiresIn;
                    const refreshAccessToken = userData.refreshToken;

                    if (!await checkTokenValidity(expiresIn)) {
                        token = await refreshToken(refreshAccessToken);
                    }

                    const spotifyId = userData.spotifyId;
                    const chatPlaylistId = userData.chatPlaylistId;

                    if (!chatPlaylistId && spotifyId) {
                        try {
                            const response = await axios.post(`https://api.spotify.com/v1/users/${spotifyId}/playlists`, {
                                name: "SpotMatch Chat Playlist",
                                description: "Playlist for matched chat users' songs",
                                public: false,
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                            });
                            const playlistId = response.data.id;
                            await user.update({ chatPlaylistId: playlistId, chatPlaylistSongs: []});
                        } catch (error) {
                            console.error("Error creating playlist: ", error);
                             if(error.response) {
                                console.log("response :", error.response)
                                console.log("response data: ", error.response.data)
                                if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
                                } else if(error.response.status === 429) {
                                    alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                                } else {
                                    alert("Failed creating SpotMatch Chat playlist, error response data: ", error.response.data);
                                }
                            } else if (error.request) {
                                console.log('No response received:', error.request);
                                alert('No response received:', error.request);
                
                            } else {
                                alert("Failed creating SpotMatch Chat playlist: ", error);
                            }
                        }
                    }


                } else {
                    alert("Error! No userDoc");
                }
                
            } catch (error) {
                if(error.response) {
                    console.log("response :", error.response)
                    console.log("response data: ", error.response.data)
                    if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                      alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
                    } else if(error.response.status === 429) {
                        alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                    } else {
                        alert("Failed getting data, error response data: ", error.response.data);
                    }
                } else if (error.request) {
                    console.log('No response received:', error.request);
                    alert('No response received:', error.request);
    
                } else {
                    alert("Failed getting data ", error);
                }
            } finally {
                setLoading(false);
            }
        } else {
            console.log("not premium")
            alert("User is not premium!");

        }
    };


    useFocusEffect(
        React.useCallback(() => {
            fetchChatMusic();

            if (premium) {
                const chatDocRef = doc(db, 'chats', combinedId);
                const checkIfPlayingAndPause = async () => {
                    const currentlyPlaying = await isPlaying();
                    if (currentlyPlaying) {
                    await pauseTrack();
                    }
                };

                // interval = setInterval(checkSongCompletion, 10000); // Check first 10 sec by default


                const unsubscribe = onSnapshot(chatDocRef, async (doc) => {
                    const data = doc.data();
                    console.log("data: ", data)
                    // setPlayingSong(data.currentSong);
                    
                    const chatDocSnap = await getDoc(chatDocRef);
    
                    if (chatDocSnap.exists()) {
                        const chatData = chatDocSnap.data();
                        const fetchedChatMusic = chatData.chatMusic || [];
                        setChatMusic(fetchedChatMusic);
                    } else {
                        alert("No chatDoc!")
                    }
                    if (data) {
                        setPlayingSong(data.currentSong);

                        if (data.playing && !playingRef.current && data.currentSong) {
                            //if matched user is playing, current user not playing, current song exists 
                            setPlayingSong(data.currentSong);
                            const playingSong = data.currentSong
                            playingSongIdRef.current = playingSong.id;
                            console.log("came in the unsubscribe")
                            setProgress(0);
                            await playTrack(data.currentSong);
                            
                        } else if (data.playing && playingRef.current && data.currentSong && playingSongIdRef.current && playingSongIdRef.current !== data.currentSong.id) {
                            setPlayingSong(data.currentSong);
                            const playingSong = data.currentSong
                            playingSongIdRef.current = playingSong.id;
                            console.log("came in the unsubscribe")
                            setProgress(0);
                            await playTrack(playingSong);
                        } else if (!data.playing && await isPlaying()) {
                            await pauseTrack();
                        } 
                    }
                });

                return async () => {
                    await checkIfPlayingAndPause();
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    unsubscribe();
                };
            }
        }, [combinedId])
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
            <View style={styles.chevron} >
                 <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="chevron-left" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.containerNonPremium}>
    
                    <Text style={styles.containerNonPremiumText}>Sorry, the playing of songs using the Spotify API is only for Spotify Premium users..</Text>
                </View>
            </View>
        );
    }

    const updateFirestore = async (data) => {
        const chatDocRef = doc(db, 'chats', combinedId);
        await updateDoc(chatDocRef, data);
    };
   
    const refreshToken = async (refreshToken) => {
        alert("Token has expired! Refreshing now..")
        const user = await getUser();
        const docRefPath = `users/${user.email}`;
        console.log("docRefPath: ", docRefPath)
        if (refreshToken) {
        try {
            const data = qs.stringify({
            client_id: CLIENT_ID,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        
            });
            console.log("data: ", data);
    
            const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            const { access_token, refresh_token, expires_in } = tokenResponse.data;
            console.log("access token: ", access_token)
            console.log("refreshToken: ", refresh_token)
            const expiresIn = new Date().getTime() + expires_in * 1000;
            await user.update({token: access_token, expiresIn: expiresIn, refreshToken: refresh_token});
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);
    
            if(userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const accessToken = userData.token;
                if (accessToken && accessToken === access_token) {
                    console.log("Refreshed Token is same!")
                console.log("refreshed access token from userDoc: ", accessToken);
                alert("refreshed access token from userDoc: ", accessToken);
                } else {
                console.log("Refreshed token not updated!")
                alert("Refreshed token not updated!")
                }
    
            } else {
                alert("No userDoc!")
            }
            
            return access_token;
    
        } catch (error) {
            
            console.error("Error refreshing token:", error);
            alert("Failed to refresh token. Please log in to Spotify and grant access again.");
            navigation.navigate('Access', {docRefPath});
        }
        } else {
        alert("No token to refresh!")
        navigation.navigate('Access', {docRefPath});
        }
      }
      

    const getAvailableDevices = async () => {
       
        try {
            const user = await getUser();
            console.log(user)
            console.log(user.email)
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let token = userData.token;
                const expiresIn = userData.expiresIn;
                const refreshAccessToken = userData.refreshToken;

                if (!await checkTokenValidity(expiresIn)) {
                    token = await refreshToken(refreshAccessToken);
                } 
                const response = await axios('https://api.spotify.com/v1/me/player/devices', {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("response", response);
                console.log('response device: ', response.data.devices)

                const devices = response.data.devices;
                console.log('devices: ', devices)
                if (devices.length > 0) {
                    const smartphoneDevice = devices.filter(device => device.type === "Smartphone")
                    console.log("smartphone device : ", smartphoneDevice)

                    //checking isactive device
                    const isActiveDevice = devices.filter(device => device.is_active);
                    console.log("is active devices? :", isActiveDevice);
                    let selectedDevice;

                    if (smartphoneDevice.length > 0) {
                        //checking if there are any smartphone devices, if so, use the first one
                        selectedDevice = smartphoneDevice[0].id
                        console.log("selectedDevice Smartphone id: ", selectedDevice);
                        console.log("selected device type: ", smartphoneDevice[0].type)
                        
                        
                    } else {
                        selectedDevice = devices[0].id; // Select the first device
                        console.log("selected device type: ", devices[0].type)
                    }
                    deviceIdRef.current = selectedDevice;
                    setDeviceId(selectedDevice);
                } else {
                    alert("No devices available. Due to the Spotify API's limits, kindly ensure you play a song on Spotify before proceeding so that your device is detected, and exit and return to refresh the screen");
                }

            } else {
                alert("No userDoc!")
            }
        } catch (error) {
            console.error("Error fetching devices: ", error);
             if (error.response && error.response.status === 404) {
                alert("Due to the Spotify API's limits, kindly ensure you play a song on Spotify before proceeding.");
                
            } else if (error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
                } else if(error.response.status === 429) {
                    alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                }else {
                    alert("Failed getting available devices. Due to the Spotify API's limits, kindly ensure you play a song on Spotify before proceeding so that your device is detected. Error response data: ", error.response.data);
                }
            } else if (error.request) {
                console.log('No response received:', error.request);
                alert('No response received:', error.request);

            } else {
                alert("Failed getting available devices. Due to the Spotify API's limits, kindly ensure you play a song on Spotify before proceeding so that your device is detected. ", error);
            }
            return [];
        }
    };
    

    const isPlaying = async () => {
       
        try {
            const user = await getUser();
            console.log(user)
            console.log(user.email)
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let token = userData.token;
                const expiresIn = userData.expiresIn;
                const refreshAccessToken = userData.refreshToken;

                if (!await checkTokenValidity(expiresIn)) {
                    token = await refreshToken(refreshAccessToken);
                } 
                   
                const response = await axios('https://api.spotify.com/v1/me/player', {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('response is playing: ', response.data.is_playing)

                return response.data.is_playing;
            } else {
                alert("No userDoc!")
            }
        } catch (error) {
            console.error("Error fetching isPlaying: ", error);
             if(error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
                } else if(error.response.status === 429) {
                    alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
                } else {
                    alert("Failed getting isPlaying, error response data: ", error.response.data);
                }
            } else if (error.request) {
                console.log('No response received:', error.request);
                alert('No response received:', error.request);

            } else {
                alert("Failed getting isPlaying ", error);
            }
        }

    };

    const checkSongCompletion = async () => {
        try {
            const user = await getUser();
            console.log(user)
            console.log(user.email)
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let token = userData.token;
                const expiresIn = userData.expiresIn;
                const refreshAccessToken = userData.refreshToken;

                if (!await checkTokenValidity(expiresIn)) {
                    token = await refreshToken(refreshAccessToken);
                } 
                console.log("playing? ", playingRef.current)
                console.log("playing song? ", playingSong)
                if (playingRef.current) {
                    const response = await axios.get('https://api.spotify.com/v1/me/player', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                    });
                    
                    const progress = response.data.progress_ms;
                    setProgress(progress);
                    const duration = response.data.item.duration_ms;
                    console.log('progress', progress)
                    console.log('duration', duration)
                    const remainingTime = ((duration / 1000) - (progress / 1000)).toFixed(0);
                    console.log("remaining time: ", remainingTime)
                    if (remainingTime <= 2) {
                        console.log('time to play next song ')
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                        setProgress(0);
                        await playNextSong();
                        
                    } else {
                        console.log("Progress has not reached duration!");
                        let newInterval = 20000; // Default 20 seconds
                        if (remainingTime >= 60 && ((duration / 1000) - remainingTime) >= 30 ) {
                            newInterval = 30000; //Increase to 30 seconds if > 1 min of end
                        } else if (remainingTime <= 30 && remainingTime > 10) {
                            newInterval = 10000; // Reduce to 10 seconds within 30 seconds of end
                        } else if (remainingTime <= 10) {
                            newInterval = 1000; // Reduce to 1 second within 10 seconds of end
                        }
                        //  else if (remainingTime <= 5) {
                        //     newInterval = 1000; // Reduce to 1 second within 5 seconds of end
                        // }
                        clearInterval(intervalRef.current);
                        intervalRef.current = setInterval(checkSongCompletion, newInterval);
                    }
                } else {
                    console.log("No song playing yet to check!")
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
        
                }
            } else {
                alert("No userDoc!")
            }
        } catch (error) {
            console.error("Error checking song completion: ", error);
            if(error.response.status === 429) {
                alert("Failed: Exceeded SpotMatch's Spotify API rate limits")
            } else if(error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
                } else {
                    alert("Failed checking song completion, error response data: ", error.response.data);
                }
            } else if (error.request) {
                console.log('No response received:', error.request);
                alert('No response received:', error.request);

            } else {
                alert("Failed checking song completion ", error);
            }
        }
        
    };

    const playTrack = async (song) => {
        if (!song) {
            alert("No song! Unable to play");
            return;
        }
        
        try {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            intervalRef.current = setInterval(checkSongCompletion, 10000);

            const user = await getUser();
            console.log(user)
            console.log(user.email)
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let token = userData.token;
                const expiresIn = userData.expiresIn;
                const refreshAccessToken = userData.refreshToken;

                if (!await checkTokenValidity(expiresIn)) {
                    token = await refreshToken(refreshAccessToken);
                } 
                if (deviceIdRef.current) {
                    console.log(`Attempting to play track with URI: ${song.uri} on device ID: ${deviceIdRef.current}`);
                    await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceIdRef.current}`, 
                    { uris: [song.uri] },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    setPlayingSong(song);
                    // playingIndexRef.current = chatMusic.findIndex(m => m.id === song.id)
                    playingRef.current = true;
                    await updateFirestore({ playing: true, currentSong: song, currentTime: 0 });
                    console.log("playing song: ", playingSong);
                    console.log("modal visible? :", modalVisible);

                } else {
                    alert("No device id available! Please exit the screen and return to refresh")
                }
            } else {
                alert("No userDoc!")
            }
        } catch (error) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.error("Error playing track: ", error);
            if (error.response) {
                console.error("Error response data: ", error.response.data);
            }
            if (error.response && error.response.status === 502) {
               
                    alert("Spotify server error, please try again later. Kindly ensure you play a song on Spotify before proceeding");
                
            } else if (error.response && error.response.status === 429) {
                alert("Failed: Exceeded SpotMatch's Spotify API rate limits");
            } else if (error.response && error.response.status === 404) {
                alert("Due to the Spotify API's limits, kindly ensure you play a song on Spotify before proceeding.");
            }else if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
            } else if(error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                alert("Failed to play track, error response data: ", error.response.data)
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                alert("Failed to play track, please try again. ", error);
            }
        } finally {
            setLoading(false);

        }
       
    };

    const pauseTrack = async () => {
        try {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            const user = await getUser();
            console.log(user)
            console.log(user.email)
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let token = userData.token;
                const expiresIn = userData.expiresIn;
                const refreshAccessToken = userData.refreshToken;

                
                if (!await checkTokenValidity(expiresIn)) {
                    token = await refreshToken(refreshAccessToken);
                } 
                

                if (deviceIdRef.current) {
                    console.log("device id: ", deviceIdRef.current)
                    await axios.put(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceIdRef.current}`, {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    playingRef.current = false;
                    await updateFirestore({ playing: false , currentSong: null});
                    setModalVisible(false)
                } else {
                    alert("No device id available! Please exit the screen and return to refresh")
                }
            } else {
                alert("No userDoc!")
            }
        } catch (error) {
            console.error("Error pausing track: ", error);
            if (error.response && error.response.status === 502) {
               
                        alert("Spotify server error, please try again later.");
                    
            } else if (error.response && error.response.status === 429) {
                alert("Failed: Exceeded SpotMatch's Spotify API rate limits");
            } else if (error.response && error.response.status === 404) {
                alert("Failed: Track not found or invalid track URI.");
                
            } else if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
            } else if(error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                alert("Failed to pause track, error response data: ", error.response.data)
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                alert("Failed to pause track, please try again.", error);
            }   
        } finally {
            setLoading(false);

        }
    };

    // setInterval(checkSongCompletion, 1000);

    
    if (loading) {
        return (
            <View style={styles.containerLoading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const playNextSong = async () => {
        // const currentIndex = chatMusic.findIndex((song) => song.id === playingSong.id);
        // const currentIndex = playingIndexRef.current;
        if (isDebounced) {return;}
        setIsDebounced(true);
        setTimeout(() => setIsDebounced(false), 500);

        const chatDocRef = doc(db, 'chats', combinedId);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists()) {

            const chatData = chatDocSnap.data();
            if (chatData.currentSong) {
                const currentSongId = chatData.currentSong.id
                const nextIndex = chatMusic.findIndex(song => song.id === currentSongId) + 1;

                // const nextIndex = playingIndexRef.current + 1;
                if (nextIndex < chatMusic.length) {
                    console.log('at play next song success')
                    const nextSong = chatMusic[nextIndex];
                    setProgress(0);
                    await playTrack(nextSong);
                    await updateFirestore({ playing: true , currentSong: nextSong});

        
                } else {
                    console.log('at play next song fail')

                    await pauseTrack();
                    await updateFirestore({ playing: false , currentSong: null});


                }
            } else {
                alert("No current song being played.")
            }
        } else {
            alert("No chat doc!")
        }
        
    };
    
    const playPreviousSong = async () => {
        if (isDebounced) return;
        setIsDebounced(true);
        setTimeout(() => setIsDebounced(false), 500);

        const chatDocRef = doc(db, 'chats', combinedId);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists()) {

            const chatData = chatDocSnap.data();
            if (chatData.currentSong) {
                const currentSongId = chatData.currentSong.id
                const prevIndex = chatMusic.findIndex(song => song.id === currentSongId) - 1;

                // const nextIndex = playingIndexRef.current + 1;
                if (prevIndex >= 0) {
                    const prevSong = chatMusic[prevIndex];
                    setProgress(0);
                    await playTrack(prevSong);
                    await updateFirestore({ playing: true , currentSong: prevSong});

        
                } else {
                    await pauseTrack();
                    await updateFirestore({ playing: false , currentSong: null});


                }
            } else {
                alert("No current song being played.")
            }
        } else {
            alert("No chat doc!")
        }
        
    };

    const handlePlayPause = async (song) => {
        if (isDebounced) return;
        setIsDebounced(true);
        setTimeout(() => setIsDebounced(false), 500);

        console.log("playing song: ",playingSong)
        if (playingSong?.id === song.id && playingRef.current) {
            await pauseTrack();

        } else {
            setProgress(0);
            await playTrack(song);
        }
    };

    const searchSongs = async (query, retryCount = 0) => {
        try {
            const user = await getUser();
                console.log(user)
                console.log(user.email)
                const userDocRef = ref(user.email);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    let token = userData.token;
                    const expiresIn = userData.expiresIn;
                    const refreshAccessToken = userData.refreshToken;

                    if (!await checkTokenValidity(expiresIn)) {
                        token = await refreshToken(refreshAccessToken);
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
                    setLoading(false);
                } else {
                    alert("No userDoc!")
                }
        } catch (error) {
            console.error("Error searching tracks: ", error);
            if (error.response && error.response.status === 502) {
                if (retryCount < 3) {
                    setLoading(true);
                    console.log(`Retrying... (${retryCount + 1})`);
                    setTimeout(() => searchSongs(query, retryCount + 1), 500);
                } else {
                    alert("Spotify server error, please try again later.");
                }
            } else if (error.response && error.response.status === 429) {
                alert("Failed: Exceeded SpotMatch's Spotify API rate limits");
            } else if (error.response && error.response.status === 404) {
                alert("Failed: ", error.response.data);
                
            } else if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
            } else if(error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                alert("Failed to search track, error response data: ", error.response.data)
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                alert("Failed to search track, please try again.", error);
            }   
        } finally {
            setLoading(false);

        }
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
            duration: songInMin,
            durationMs: song.duration_ms
        })
        if (chatMusic.some(existingSong => existingSong.id === song.id)) {
            alert("Song already included!");
            return;
        }

        await updateDoc(chatDocRef, {
            chatMusic: arrayUnion(songObject),
        });
        // setChatMusic((prev) => [...prev, songObject]);
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
        // setSoundLoad(true);
       
        setChatMusic((prev) => prev.filter((item) => item.id !== song.id));
        if (playingSong?.id === song.id && playingRef.current) {
            setProgress(0);
            await playNextSong();
        }

    };

    const addSongToPlaylist = async (song, retryCount = 0) => {
        try {
            const user = await getUser();
            const userDocRef = user.docRef;
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                let token = userData.token;
                const expiresIn = userData.expiresIn;
                const refreshAccessToken = userData.refreshToken;

                if (!await checkTokenValidity(expiresIn)) {
                    token = await refreshToken(refreshAccessToken);
                } 
                const chatPlaylistId = userData.chatPlaylistId
                const chatPlaylistSongs = userData.chatPlaylistSongs;

                if(song.uri && !chatPlaylistSongs.includes(song.id)) {
                    await axios.post(`https://api.spotify.com/v1/playlists/${chatPlaylistId}/tracks`, {
                        uris: [song.uri],
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    await user.update({ chatPlaylistSongs: arrayUnion(song.id)});
                    
                } else {
                    alert("Song has been added before! Not added to the Spotify SpotMatch Chat playlist")
                }
            } else {
                alert("No userDoc!")
            }
        } catch (error) {
            if (error.response && error.response.status === 502) {
                if (retryCount < 3) {
                    setLoading(true);
                    console.log(`Retrying... (${retryCount + 1})`);
                    setTimeout(() => addSongToPlaylist(song, retryCount + 1), 500);
                } else {
                    alert("Spotify server error, please try again later.");
                }
            } else if (error.response && error.response.status === 404) {
                alert("Failed: Track not found or invalid track URI.");
                
            } else if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                  alert("SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. Currently you are not allowlisted by SpotMatch yet.")
            } else if(error.response) {
                console.log("response :", error.response)
                console.log("response data: ", error.response.data)
                alert("Failed to add track to the Spotify SpotMatch Chat playlist, error response data: ", error.response.data)
            } else if (error.request) {
                console.log('No response received:', error.request);
            } else {
                alert("Failed to add track to the Spotify SpotMatch Chat playlist, please try again.", error);
            }
        } finally {
            setLoading(false);
        }   
    };

    const handleSearch = async () => {
        if (query.trim()) {
            await searchSongs(query);
        }
    };

    const renderSongItem = ({ item, index }) => (
        <TouchableOpacity 
            // style={styles.songContainer} 
            onPress={() => { handlePlayPause(item);
                            }
            }
        >
            <View style={[styles.songContainer, playingSong?.id === item.id && styles.playingSong]}>

                <Text style={styles.songIndex}>{index + 1}</Text>
                <Image source={{ uri: item.albumImg }} style={styles.albumArt} />
                <View style={styles.songDetails}>
                    <Text style={styles.songName}>{item.name}</Text>
                    <Text style={styles.artistName}>{item.artist}</Text>
                </View>
                <Text style={styles.duration}>{item.duration}</Text>
                <TouchableOpacity onPress={() => removeSongFromChatMusic(item)} style={styles.button}>
                    <Feather name='trash' size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => addSongToPlaylist(item)} style={styles.button}>
                    <Feather name='plus' size={24} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );


    if (loading) {
        return (
            <View style={styles.containerLoading}>
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

                <Text style={searchResults.length > 0 && query.length > 0 ? styles.searchResultsHeader : { display: "none" }}>Search Results: (Pick the song!)</Text>
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => addSongToChatMusic(item)}>
                            <Text style={styles.searchResultText}>{item.name} -    {item.artists[0].name}</Text>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    style={ searchResults.length > 0 && query.length > 0 ? styles.searchResults : { display: "none" }}
                />

                <Text style={styles.instructions}>Tap on a song to play or stop!</Text>
                <View style={styles.songHeader}>
                    <Text style={styles.songIndexHeader}>#</Text>
                    <Text style={styles.songTitleHeader}>Title</Text>
                    <Feather name='clock' size={20} style={styles.songDurationHeader} />
                    <Feather name='music' size={20} style={styles.songActionHeader} />
                </View>
                
                <FlatList
                    ref={flatListRef}
                    data={chatMusic}
                    keyExtractor={(item) => item.id}
                    renderItem={renderSongItem}
                    style={styles.chatMusicList}
                />


            
            {playingSong && (
                <TouchableOpacity onPress={() => {setModalVisible(true) ; console.log("modal visible in mini player? :", modalVisible)}}>
                    <View style={styles.miniPlayer}>
                        <Image source={{ uri: playingSong.albumImg }} style={styles.miniPlayerImage} />
                        <Text style={styles.miniPlayerSongName}>{playingSong.name}</Text>
                        <Text style={styles.miniPlayerArtistName}>{playingSong.artist}</Text>
                    </View>
                </TouchableOpacity>
            )}

            {playingSong && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.modalCloseButton}
                        >
                            <Feather name="chevron-down" size={30} color="#f4f0ec" />
                        </TouchableOpacity>
                        <Image source={{ uri: playingSong.albumImg }} style={styles.modalImage} />
                        <Text style={styles.modalSongName}>{playingSong.name}</Text>
                        <Text style={styles.modalArtistName}>{playingSong.artist}</Text>
                        <View style={styles.progressBarContainer}>
                            <Text style={styles.progressTime}>0:00</Text>
                            <View style={styles.progressBar}>
                                <View style={{ ...styles.progress, width: `${(progress / playingSong.durationMs) * 100}%` }} />
                            </View>
                            <Text style={styles.progressTime}>{playingSong.duration}</Text>
                        </View>
                        <View style={styles.modalControls}>
                            <TouchableOpacity onPress={() => playPreviousSong()}>
                                <Feather name="skip-back" size={34} color="#e5e4e2" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => pauseTrack()}>
                                <Feather name={playingRef.current ? "pause" : "play"} size={35} color="#e5e4e2" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => playNextSong()}>
                                <Feather name="skip-forward" size={34} color="#e5e4e2" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )} 
        </View>
    );


    // return (

    //     <View style={styles.container}>

    //         <View style={styles.header}>
    //             <TouchableOpacity onPress={() => navigation.goBack()}>
    //                 <Feather name="chevron-left" size={24} color="black" />
    //             </TouchableOpacity>
    //             <TextInput
    //                 placeholder="Search for songs and enter..."
    //                 value={query}
    //                 onChangeText={setQuery}
    //                 onSubmitEditing={handleSearch}
    //                 style={styles.searchBar}
    //             />
    //         </View>

    //         <Text style={styles.searchResultsHeader}>Search Results: (Pick the song!)</Text>
    //         <FlatList
    //             data={searchResults}
    //             keyExtractor={(item) => item.id}
    //             renderItem={({ item }) => (
    //                 <TouchableOpacity onPress={() => addSongToChatMusic(item)}>
    //                     <Text style={styles.searchResultText}>{item.name} -    {item.artists[0].name}</Text>
    //                 </TouchableOpacity>
    //             )}
    //             ItemSeparatorComponent={() => <View style={styles.separator} />}
    //             style={searchResults.length > 0 ? styles.searchResults : {display: "none"}}
    //         />
                            

    //         <View style={styles.listHeaderContainer}>

    //             <Text style={styles.listHeaderText}> #</Text>
    //             <Text style={[styles.listHeaderText, { flex: 7 }]}>Title</Text>
    //             <Feather name='clock' size={20} style={styles.listHeaderIcon} />
    //             <Feather name='music' size={20} style={styles.listHeaderIcon} />

    //         </View>
    //         <FlatList
    //             data={chatMusic}
    //             keyExtractor={(item) => item.id}
    //             renderItem={({ item , index }) => (
    //                 <View style={styles.songContainer}>
    //                     <Text style={styles.songIndex}>{index + 1}</Text>

    //                     <Image source={{ uri: item.albumImg }} style={styles.albumArt} />
    //                     <View style={styles.songDetails}>
    //                         <Text style={styles.songName}>{item.name}</Text>
    //                         <Text style={styles.artistName}>{item.artist}</Text>
    //                     </View>
    //                     {/* <Text style={styles.albumName}>{item.albumName}</Text> */}
    //                     <Text style={styles.duration}>{item.durationMs}</Text>


    //                     <TouchableOpacity onPress={() => removeSongFromChatMusic(item)} style={styles.button}>
    //                         <Feather name='trash' size={24}/>
    //                     </TouchableOpacity>
    //                     <TouchableOpacity onPress={() => addSongToPlaylist(item)} style={styles.button}>
    //                         <Feather name='plus' size={24}/>
    //                     </TouchableOpacity>
    //                 </View>
    //             )}
    //             style={styles.chatMusicList}
    //         />

    //     </View>

    // );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF4EC',
        padding: 16,
    },
    containerLoading: {
        flex: 1,
        backgroundColor: '#FAF4EC',
        margin: 10, 
        padding: 10,
        marginHorizontal: 25,
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
    chevron: {
        flex: 1, 
        margin: 10,
        paddingTop: 6,
        paddingHorizontal: 6
        
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
    instructions: {
        marginVertical: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#708090',
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
    songHeader: {
        flexDirection: 'row',
        marginTop: 8,
        backgroundColor: '#cfcfc4',
        paddingVertical: 10,
        borderRadius: 0
       
    },
    songIndexHeader: {
        width: 20,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#000',
    },
    songTitleHeader: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#000',
    },
    songDurationHeader: {
        width: 60,
        textAlign: 'center',
    },
    songActionHeader: {
        width: 70,
        textAlign: 'center',
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
        flex: 1
    },
    songContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // marginBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        backgroundColor: '#f4f0ec'
    },
    playingSong: {
        backgroundColor: "#979aaa"
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
    miniPlayer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4c516d',
        padding: 10,
    },
    miniPlayerImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    miniPlayerSongName: {
        fontSize: 16,
        color: '#FFF',
        paddingVertical: 3,
        marginHorizontal: 3
    },
    miniPlayerArtistName: {
        fontSize: 14,
        color: '#EEE',
        paddingVertical: 3,
        marginHorizontal: 6
        
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#4c516d',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalHeader: {
        alignSelf: 'stretch',
        padding: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: "75%",
        height: "35%",
        marginBottom: 20,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 3 },
        shadowRadius: 10,
    },
    modalSongName: {
        fontSize: 28,
        color: '#FFF',
        fontWeight: 'bold',
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 6,
        paddingBottom: 10,
        paddingHorizontal: 12,
    },
    modalArtistName: {
        fontSize: 21,
        color: '#EEE',
        marginBottom: 20,
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 6,
        textShadowRadius: 5,
        paddingHorizontal: 10,
        paddingBottom: 10,
        marginBottom: 20
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginBottom: 20,
    },
    progressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 2,
        marginHorizontal: 10,
    },
    progress: {
        height: 4,
        backgroundColor: '#1db954',
        borderRadius: 2,
    },
    progressTime: {
        fontSize: 12,
        color: '#ccc',
    },
    modalControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingHorizontal: 40,
        marginVertical: 20 
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        margin: 8
    },
});

export default ChatMusicScreen
