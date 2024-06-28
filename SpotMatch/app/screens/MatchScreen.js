import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Settings, ActivityIndicator, Dimensions } from 'react-native';
import Button from '../../components/navigation/Button';
import { useNavigation } from '@react-navigation/core';
import Swiper from "react-native-deck-swiper";
import { BlurView } from "expo-blur";
import axios from 'axios';
import GetSpotifyData from '../../components/GetSpotifyData';
import { getUser, getToken, getEmail } from '../User';
import { getDoc, getDocs } from 'firebase/firestore';
import { ref, set, usersColRef } from '../../firebase';

{/* <GetSpotifyData /> */}

const MatchScreen = () => {


    const navigation= useNavigation();
    const [userDocs, setUserDocs] = useState(null);
    const [loading, setLoading] = useState(true);


    // const check = async () => {
    //     const user = await getUser();
    //     console.log("artists: ",user.artists)
    // }
    // check();

    
    // const GetSpotifyData= () => {
    // console.log("at get spotifydata ")

    // const [user, setUser] = useState(null);
    

        useEffect(() => {
            async function fetchData() {
                const token = await getToken();
                const user = await getUser();
                // setUser(await getUser());
            console.log(user);
            console.log(token)
           
            console.log("at get spotifydata useEffect")
            if (token && user) {
                setLoading(true);
                try {
                    console.log('yes')
                    console.log(user)
                    axios("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then(res => {
                        if (res.data && res.data.items && Array.isArray(res.data.items)) {
                            console.log("user: ",user)
                            const names = res.data.items.map(artist => artist.name); 
                            user.setArtists(names);
                            console.log(res.data.items);
                            console.log(user.artists);
                            console.log(names);
                            
                            const genre = res.data.items.flatMap(user => user.genres);
                            const uniqueGenres = [...new Set(genre)];
                            user.setGenres(uniqueGenres);
                            console.log(genre); 
                            console.log(uniqueGenres);
    
                            // console.log(refDoc);
                        
                                // console.log(artistNames);
                            user.update({topArtists: names, genres: uniqueGenres});
                                // user.update({genres: genre}); 
                            
                        } else {
                            console.error('Invalid response format: ', res.data);
                        }
                    })
                    // .catch(err => {
                    //     console.error('Error fetching top artists: ', err)
                    // })
    
                    axios('https://api.spotify.com/v1/me', {
                        method: 'GET',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then(res => {
                        console.log(res.data)
                        const displayname = res.data.display_name;
                        user.setDisplayName(displayname);

                        console.log(res.data.images)
                        const imgUrl = res.data.images.map(img => img.url)
                        const uniqueUrl = imgUrl[0];
                        console.log('this is imgUrl: ', uniqueUrl)
                        user.setImgUrl(uniqueUrl);

                        user.update({displayName: displayname, imageUrl: uniqueUrl});
                    })
    
                    axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then(res => {
                        const tracks = res.data.items;
                        user.setTopTracksData(tracks);
                        // console.log(tracks)

                        
    
                    })
                    const docs = await getDocs(usersColRef);
                    setUserDocs(docs.docs.map(doc => doc.data()));
    
    
                } catch (error) {
                    console.error('Error in useEffect: ', error.response);
                } finally {
                    setLoading(false);
                }
            } else {
              console.log("no token")
            }}

            // const getUsers = async () => {
            //     setUserDocs(await getDocs(usersColRef));
            // }

        fetchData();
        // getUsers();
    
        }, []);


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!userDocs || userDocs.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No users found.</Text>
            </View>
        );
    }

    // if( userDocs) {
    //     userDocs.forEach(doc => {
    //         console.log(doc.email, "=> ", doc, "here are top Artists:", doc.topArtists)
    //     })
    // }
    // }
    // GetSpotifyData();


    return (
       
        <View style={styles.container}>
            <Swiper 
                cards={userDocs}
                renderCard={(card) => (
                <View style={styles.card}>
                    <ImageBackground
                    style={styles.imgBackground}
                    resizeMode="cover"
                    source={{ uri: card.imageUrl }}
                    >
                    <BlurView
                        intensity={150}
                        style={[ styles.nonBlurredContent, StyleSheet.absoluteFill]}
                    >
                        {/* <View style={styles.profile}> */}
                            <Image
                            style={styles.cardImg}
                            source={{
                                uri: card.imageUrl,
                            }}
                            />
                            <Text style={styles.title}>{card.firstName}</Text>
                        {/* </View> */}

                        
                        <View style= {styles.textContainer}> 
                        <Text style={styles.text}>Top Artist:  { card.topArtists ? card.topArtists[0] : null }</Text>
                        <Text style={styles.text}>Age:  { card.age ? card.age : null}</Text>

                        </View>
                    </BlurView>
                    
                    </ImageBackground>
                </View>

                )}
                // onSwiped={}
                stackSize={3}
                stackSeparation={15}
                disableTopSwipe
                infinite
                backgroundColor={"transparent"}
                />

        </View>
    );
}

export default MatchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgBackground: {
        width: "100%",
        height: "100%",
        flex: 1,
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
        backgroundColor: "lightgrey",
        overflow: "hidden",
      },
      cardImg: {
        flex: 1,
        width: "70%",
        resizeMode: "contain",
        // marginBottom: 5,
        marginLeft: "15%",
        borderRadius: 5,
      },
      title: {
        // marginTop: 2,
        fontSize: 25,
        marginBottom: 10,
        color: "white",
        width: "100%",
        textShadowColor: "black",
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 10,
        padding: 10,
        textAlign: "center",
      },
      profile: {
        flex: 1,
        justifyContent: "space-between"

      },
      text: {
        color: "white",
        textAlign: "left",
        fontSize: 18,
        marginBottom: 15,
        fontWeight: "600",
        
      },
      textContainer: {
        color: "white",
        textAlign: "left",
        fontSize: 18,
        margin: 15,
        fontWeight: "600",
        
      },
  });
  
