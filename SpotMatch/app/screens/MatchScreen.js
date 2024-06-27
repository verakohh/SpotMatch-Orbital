import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Settings } from 'react-native';
import Button from '../../components/navigation/Button';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import GetSpotifyData from '../../components/GetSpotifyData';
import { getUser, getToken, getEmail } from '../User';
import { getDoc } from 'firebase/firestore';
import { ref } from '../../firebase';

{/* <GetSpotifyData /> */}

const MatchScreen = () => {


    const navigation= useNavigation();
    


    // const check = async () => {
    //     const user = await getUser();
    //     console.log("artists: ",user.artists)
    // }
    // check();

    
    const GetSpotifyData= () => {
    console.log("at get spotifydata ")
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
                            user.update({topArtists: names, genres: genre});
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
                        user.update({displayName: displayname});
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
                    
    
    
                } catch (error) {
                    console.error('Error in useEffect: ', error.response);
                }
            } else {
              console.log("no token")
            } 
        }
        fetchData();
    
        }, []);
    }
    GetSpotifyData();

    return (
       
        <View style={styles.container}>
            <Text>Match Screen</Text>
            <Button type='primary' size='m' text='Settings' onPress={() => navigation.navigate("Settings")}></Button>
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
  });
  
