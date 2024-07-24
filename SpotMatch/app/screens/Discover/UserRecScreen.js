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
    const [exit, setExit] = useState(false);
    const [api, setApi] = useState(null);
    const [isDebounced, setIsDebounced] = useState(false);
    const [premium, setPremium] = useState(true);
    const playingRef = useRef(false);
    const currentTrackRef = useRef(null);
    const deviceIdRef = useRef(null);

    const fetchData = async () => {
        await checkPremium();
        
        if (premium) {
            const token = await getToken();
            console.log("token: ", token)

            setLoading(true);

            const user = await getUser();
            console.log(user)
            console.log(user.email)
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (!await checkTokenValidity(token)) {
                alert("Token of 1 hour has expired! Kindly refresh it")
                navigation.navigate('Access');
                return;
            }

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const userGenres = userData.genres || [];
                const previousMatched = userData.previousMatched || [];
                const userMatched = userData.matched || [];
                const userTrack = userData.topTracks[0].uri || '';
                const userTrackId = userData.topTracks[0].id;
                const userTopTracks = userData.topTracks  && userData.topTracks.length > 0 ? userData.topTracks.map(track => track.id) : [];
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
                const spotifyId = userData.spotifyId;
                const discPlaylistSongs = userData.discPlaylistSongs;
                // const userTopTracks = userData.topTracks  && userData.topTracks.length > 0 ? userData.topTracks.map(track => track.uri) : [];
                
                // if (trackIndex >= allTracks.length || trackIndex === 0) {
                    // console.log("index: ", trackIndex);
                    // const q = query(usersColRef, where("genres", "array-contains-any", userGenres));
                    // const querySnapshot = await getDocs(q);

                    // console.log("querySnapshot docs : ", querySnapshot.docs)
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
                
                if(userMatched.length === 0) {
                    setRecommendedTracks([]);
                    setLoading(false);
                    return;
                }

                const previousMatchedPaths = previousMatched.map(ref => ref.path);
                const userMatchedPaths = userMatched.map(ref => ref.path);


                console.log("previous matched: ", previousMatchedPaths)
                console.log("user matched: ", userMatchedPaths)

                const newlyMatchedPaths = userMatchedPaths.filter(path => !previousMatchedPaths.includes(path));
                const newlyMatched = userMatched.filter(ref => newlyMatchedPaths.includes(ref.path));
                const relevantTracks = await fetchRelevantTracks(userMatched, newlyMatched, userGenres);
                const filteredTracks = discPlaylistSongs ? relevantTracks.filter(track => !discPlaylistSongs.includes(track.id) && !userTopTracks.includes(track.id)) : relevantTracks;
                
                
                console.log("new matched: ", newlyMatched)

                
                if(newlyMatched.length > 0) {
                    await user.update({previousMatched: userMatched});
                }


                setRecommendedTracks([...instruction, ...filteredTracks]);
                console.log("tracks length : ", recommendedTracks.length)

                setLoading(false);
                // querySnapshot.forEach(doc => {
                //     const docData = doc.data();
                //     if (!previousMatchedUsers.includes(doc.id) && docData.topTracks && docData.topTracks.length > 0) {
                //         tracks = [
                //             ...tracks, 
                //             ...docData.topTracks.filter(track => track.uri && track.uri !== null)
                //         ];
                //         discoveredUsers.push(doc.id);
                //     }
                                    
                // });
                // console.log("user top tracks: ", userTopTracks);

                // console.log("tracks: ", tracks);
                // console.log(tracks.length)


                // const uniqueTracks = tracks.filter(track => track.uri
                //     //  && !userTopTracks.includes(track.uri) // commented bcs dont have other users with uri yet other than self accs
                //     );
            
                // console.log('unique tracks: ', uniqueTracks);
                // console.log(uniqueTracks.length)

                // const rankedTracks = uniqueTracks.sort((a, b) => {
                //     const aGenreMatch = a.genres ? a.genres.filter(genre => userGenres.includes(genre)).length : 0;
                //     const bGenreMatch = b.genres ? b.genres.filter(genre => userGenres.includes(genre)).length : 0;
                //     return bGenreMatch - aGenreMatch;
                // });

                // console.log("rankedTracks : ", rankedTracks)

                // // setAllTracks(rankedTracks);
                // setRecommendedTracks(rankedTracks.slice(0, 20));
                // // setTrackIndex(20);
                // setLoading(false);

                // } else {
                //     console.log("at else")
                //     console.log("initial index: ",trackIndex)
                //     console.log(allTracks[trackIndex])

                //     setRecommendedTracks(allTracks.slice(trackIndex, trackIndex + 20));
                //     const newTrackIndex = trackIndex + 20;
                //     setTrackIndex(newTrackIndex);
                //     console.log("recommended tracks: ", recommendedTracks)
                //     console.log("after the slicing index: ",trackIndex) // supposed to be 40 after updating but remains as 20
                //     console.log("new track index: ", newTrackIndex) //correctly shows 40
                //     console.log(allTracks[trackIndex])// supposed to be 40 element but shows the 20 one due to the above
                //     console.log(allTracks[trackIndex + 19])// supposed to be undefined bcs trackIndex updated to 40, so it would be 59 but shows the element at 39

                //     setLoading(false);
                // }
            } else {
                alert("Error! No userDoc");
                return;
            }
        } else {
            console.log("not premium")
        }

    }

    const fetchRelevantTracks = async (matchedUsers, newMatchedUsers, userGenres) => {
        let trackMap = new Map();
        let newMatchedUsersNames = [];
        for (const docRef of matchedUsers) {
            const userDocSnap = await getDoc(docRef);
            if (userDocSnap.exists()) {
                const docData = userDocSnap.data();
                console.log("matched user firstname: ", docData.firstName)
                const docTracks = docData.topTracks || [];
                if(docTracks.length > 0) {
                    docTracks.forEach(track => {
                        if (track.id) {
                            if (trackMap.has(track.id)) {
                                const existingTrack = trackMap.get(track.id);
                                existingTrack.names.push(docData.firstName);
                                existingTrack.relevance += docData.genres.filter(genre => userGenres.includes(genre)).length;
                            } else {
                                trackMap.set(track.id, {
                                    ...track,
                                    names: [docData.firstName],
                                    relevance: docData.genres.filter(genre => userGenres.includes(genre)).length
                                });
                            }
                        } 
                    });
                }
            }
        }

        let tracks = Array.from(trackMap.values());
        if (newMatchedUsers.length === 0){
            const sorted = tracks.sort((a, b) => b.relevance - a.relevance);

            return [...sorted];
        } else {
            for (const docRef of newMatchedUsers) {
                const userDocSnap = await getDoc(docRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    const userFirstName = userData.firstName
                    console.log("matched new user firstname: ", userFirstName)
                    newMatchedUsersNames.push(userFirstName); 
                }
            }
            console.log("new matched users: ", newMatchedUsersNames)
            const newTracks = tracks.filter(track => track.names.some(name => newMatchedUsersNames.includes(name)));
            const oldTracks = tracks.filter(track => !track.names.some(name => newMatchedUsersNames.includes(name)));

            newTracks.sort((a, b) => b.relevance - a.relevance);
            oldTracks.sort((a, b) => b.relevance - a.relevance);
            console.log("newtracks: ", newTracks)
            console.log("old tracks: ", oldTracks)

            return [...newTracks, ...oldTracks];
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData();

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
        if (!await checkTokenValidity(token)) {
            alert("Token of 1 hour has expired! Kindly refresh it")
            navigation.navigate('Access');
            return;
        }
        if (!uri) {
            alert("No top track uri! Unable to play");
        }
        const token = await getToken();
        const devices = await getAvailableDevices();
        console.log('devices: ', devices)
        if (devices.length > 0) {
            const selectedDevice = devices[0].id; // Select the first device
            console.log("device phone?? :", devices[1])
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
                // playingRef.current = false;
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
            <View style={styles.card}>
                <ImageBackground
                    style={styles.imgBackground}
                    resizeMode="cover"
                    source={card.flag ? card.albumImg : { uri: card.albumImg }}
                >
                    <BlurView
                        intensity={150}
                        style={[StyleSheet.absoluteFill]}
                    >
                            <Text style={styles.recommendedBy}>Recommended by: {card.names.join(', ')}</Text>
                        
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
                                onPress={() => {handlePlayPause(card.uri)}}
                                >
                            <Feather name='music' size={30}/>

                        {/* {isPlaying() ? <Feather name='stop-circle' size={30}/> : <Feather name='rewind' size={30}/>} */}

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
                <Text>No tracks found. </Text>
                <Text>Meet new matches to get recommendations!</Text>
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
                onSwipedAll={fetchData}
                onSwipedRight={handleRight}
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
        marginTop: 10,
        marginbottom: 10,
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
        paddingVertical: 8,
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
        marginBottom: 10,
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
    recommendedBy: {
        color: "white",
        textAlign: "left",
        fontSize: 15,
        fontWeight: '600',
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        // width: "80%",
        borderRadius: 50,

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

    }
    
   

});
