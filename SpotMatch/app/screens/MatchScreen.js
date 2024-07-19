import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Settings, ActivityIndicator, Dimensions, Modal, ScrollView } from 'react-native';
import Button from '../../components/navigation/Button';
import { useNavigation } from '@react-navigation/core';
import Swiper from "react-native-deck-swiper";
import { BlurView } from "expo-blur";
import axios from 'axios';
import GetSpotifyData from '../../components/GetSpotifyData';
import { getUser, getToken, getEmail, storeSubscription } from '../User';
import { getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, where, query } from 'firebase/firestore';
import { ref, set, usersColRef } from '../../firebase';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BothMatchScreen from './Matches/BothMatchScreen';
import AllScreen from './Matches/AllScreen';
import InstructionsScreen from './Matches/Instruction';


const Tab = createMaterialTopTabNavigator();
{/* <GetSpotifyData /> */}

const MatchScreen = () => {


    const navigation= useNavigation();
    // const [userDocs, setUserDocs] = useState(null);
    // const [currentDocs, setCurrentDocs] = useState([]);
    // const [swipedUsers, setSwipedUsers] = useState([]);
    // const [dismissedUsers, setDismissedUsers] = useState([]);
    // // const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataUpdated, setDataUpdated] = useState(false);


    // useEffect(() => {
        const fetchData = async () => {
            const token = await getToken();
            const user = await getUser();
        //     const userDocRef = ref(user.email);
        //     const userDocSnap = await getDoc(userDocRef);
        
        // console.log("at get spotifydata useEffect")
       
        // if (userDocSnap.exists()) {
        //     setLoading(true);

        //     const userData = userDocSnap.data();
        //     const isMatched = userData.matched || [];
        //     const sentRequest = userData.sentRequest || [];
        //     const dismissed = userData.dismissed || [];

        //     setDismissedUsers(dismissed);
            
        //     const q = query(usersColRef, where("email", "!=", user.email));
        //     const querySnapshot = await getDocs(q);

        //     const filteredDocs = querySnapshot.docs.filter(doc => {
        //         const docRefPath = doc.ref.path;
        //         // console.log(isMatched.some(ref => ref.path === docRefPath));
        //         return !(isMatched.some(ref => ref.path === docRefPath)) && !(sentRequest.some(ref => ref.path === docRefPath))
        //         && !(dismissed.some(ref => ref.path === docRefPath));
        //     });

        //     const dismissedDocs = querySnapshot.docs.filter(doc => {
        //         const docRefPath = doc.ref.path;
        //         return dismissed.some(ref => ref.path === docRefPath);
        //     });

        //     const newDocs = filteredDocs.map(doc => ({ id: doc.id, ...doc.data(), docRef: doc.ref }));
        //     const newDismissedDocs = dismissedDocs.map(doc => ({ id: doc.id, ...doc.data(), docRef: doc.ref }));
        //     setUserDocs([...newDocs, ...newDismissedDocs]);
        //     setCurrentDocs([...newDocs, ...newDismissedDocs]);

        //     // setUserDocs(filteredDocs.map(doc => ({ id: doc.id, ...doc.data(), docRef: doc.ref })));
           
        // }
            if (token && user) {
                
                try {
                    setLoading(true);
                    console.log('yes')
                    console.log("user: ",user)
                    axios("https://api.spotify.com/v1/me/top/artists", {
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                        params: {
                            time_range: "medium_term",
                            limit: 20
                        }
                    })
                    .then(async res => {
                        console.log(res.data)
                        if (res.data && res.data.items && Array.isArray(res.data.items)) {
                            const names = res.data.items.map(artist => artist.name); 
                            user.setArtists(names);
                            console.log(user.artists);
                            console.log(names);

                            console.log("res data items: ", res.data.items)
                            const genre = res.data.items.flatMap(user => user.genres);
                            const uniqueGenres = [...new Set(genre)];
                            user.setGenres(uniqueGenres);
                            console.log(genre); 
                            console.log(uniqueGenres);
        

                                // console.log(refDoc);
                            
                                    // console.log(artistNames);
                            await user.update({topArtists: names, genres: uniqueGenres});
                                    // user.update({genres: genre}); 
                        } else {
                            console.error('Invalid response format: ', res.data);
                        }
                    })       

                    axios('https://api.spotify.com/v1/me', {
                        method: 'GET',
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                        },
                    })
                    .then(async res => {
                        console.log(res.data)
                        const displayname = res.data.display_name;
                        user.setDisplayName(displayname);

                        console.log(res.data.images)
                        const imgUrl = res.data.images.map(img => img.url)
                        const uniqueUrl = imgUrl[0];
                        console.log('this is imgUrl: ', uniqueUrl)
                        user.setImgUrl(uniqueUrl);

                        console.log(res.data.product);
                        const productsubs = res.data.product;
                        await storeSubscription(productsubs);

                        console.log(res.data.id);
                        const userId = res.data.id;
                        

                        await user.update({displayName: displayname, imageUrl: uniqueUrl, subscription: productsubs, spotifyId: userId });
                    })

                    axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                            method: "GET",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + token,
                            },
                    })
                    .then(async res => {
                        if (res.data && res.data.items && Array.isArray(res.data.items)) {
                            const topTracks = res.data.items.map(track => ({
                                id: track.id,
                                uri: track.uri,
                                name: track.name,
                                artist: track.artists[0].name,
                                albumImg: track.album.images[0].url
                            }));
                            user.setTopTracksData(topTracks);
                            await user.update({ topTracks });
                            console.log(topTracks);
                        } else {
                            console.error('Invalid response format: ', res.data);
                        }
                    });
                } catch (error) {
                        console.error('Error in useEffect: ', error.response);
                } finally {
                    setDataUpdated(true);
                    setLoading(false);
                }
            } else {
                console.log("no token")
            }
        }
        //    fetchData();

        // }, []);
        useEffect(() => {
            fetchData();
        }, []);
    

    // const handleRight = async (cardIndex) => {
    //     const currUser = await getUser(); 
    //     const swipedUser = currentDocs[cardIndex];
    
    //     if (swipedUser && swipedUser.docRef) {
    //         try {
    //             await updateDoc(swipedUser.docRef, {
    //                             requestedBy: arrayUnion(currUser.docRef)
                                
    //             });
    //             await updateDoc(currUser.docRef, {
    //                 sentRequest: arrayUnion(swipedUser.docRef),
    //                 dismissed: arrayRemove(swipedUser.docRef)
                    
    //             });
    //             setSwipedUsers([...swipedUsers, swipedUser]);
    //             // setCurrentDocs(currentDocs.slice(cardIndex));
    //             // setRequest(arrayUnion(swipedUser.docRef));
    //             console.log("Request updated successfully");
    //         } catch (error) {
    //             console.error("Error updating request: ", error);
    //         }
    //     } else {
    //         console.error("No user docRef or invalid cardIndex");
    //     }
    // };

    // const handleLeft = async (cardIndex) => {
    //     const currUser = await getUser();
    //     const swipedUser = currentDocs[cardIndex];

    //     if (swipedUser && swipedUser.docRef) {
    //         try {
    //             await updateDoc(currUser.docRef, {
    //                 dismissed: arrayUnion(swipedUser.docRef)
    //             });
    //             setDismissedUsers([...dismissedUsers, swipedUser]);
    //             // setCurrentDocs(currentDocs.slice(cardIndex));
    //             console.log(currentDocs.map(doc => doc.firstName))
    //             console.log("User dismissed successfully");
    //         } catch (error) {
    //             console.error("Error dismissing user: ", error);
    //         }
    //     } else {
    //         console.error("No user docRef or invalid cardIndex");
    //     }
    // };



    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    } else {

        return (
            <Tab.Navigator screenOptions={{swipeEnabled: false, tabBarStyle: {marginBottom: 0, paddingBottom: 0}}}>
            <Tab.Screen name="Instructions" component={InstructionsScreen} />
            <Tab.Screen name="by Genre & Artists" component={BothMatchScreen} />
            <Tab.Screen name="Discover All" component={AllScreen} />
            </Tab.Navigator>
        );
    }

    

    // if (!userDocs || userDocs.length === 0) {
    //     return (
    //         <View style={styles.container}>
    //             <Text>No users found.</Text>
    //         </View>
    //     );
    // }


    // const top3artists = card => {
    //    const sliced = card.topArtists.slice(0,3);
    //    return sliced.toString();
    // }

    // const renderCard = (card) => (
    //     <View style={styles.card}>
    //         <ImageBackground
    //             style={styles.imgBackground}
    //             resizeMode="cover"
    //             source={{ uri: card.imageUrl }}
    //         >
    //             <BlurView
    //                 intensity={150}
    //                 style={[styles.nonBlurredContent, StyleSheet.absoluteFill]}
    //             >

    //                     <Image
    //                         style={styles.cardImg}
    //                         source={{ uri: card.imageUrl }}
    //                     />
    //                     <Text style={styles.title}>{card.firstName}</Text>
    //                     <View style={styles.textContainer}>
    //                         <Text style={styles.headerText}>Age: <Text style={styles.text}>{card.age ? card.age : "N/A"}</Text></Text>
    //                         <Text style={styles.headerText}>Top 3 Artists: <Text style={styles.text}>{card.topArtists ? top3artists(card) : "N/A"}</Text></Text>
    //                         <Text style={styles.headerText}>Top Track:  
    //                         {card.topTracks && card.topTracks.slice(0, 1).map((track, index) => (
    //                             <Text key={index} style={styles.text}> {track.name} by {track.artist} </Text>
    //                         ))}
    //                         </Text>
    //                         <Text style={styles.headerText}>Top 3 Genres: <Text style={styles.text}>{card.genres ? card.genres.slice(0, 3).toString() : "N/A"}</Text></Text>
    //                     </View>

    //             </BlurView>
    //         </ImageBackground>
    //     </View>
    // );

    // return (
    //     <View style={styles.container}>
    //         <Swiper
    //             cards={currentDocs}
    //             renderCard={renderCard}
    //             onSwipedRight={handleRight}
    //             onSwipedLeft={handleLeft}
    //             stackSize={3}
    //             stackSeparation={15}
    //             disableTopSwipe
    //             disableBottomSwipe
    //             // infinite
    //             backgroundColor={"transparent"}
    //             onSwipedAll={fetchData}
    //         />
    //     </View>
    // );
}

export default MatchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FAF4EC',
        
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
        backgroundColor: 'lightgrey',
        overflow: "hidden",
      },
    cardImg: {
        flex: 1,
        width: "70%",
        height: 220,
        resizeMode: "contain",
        borderRadius: 8,
        marginTop: 15,
        marginbottom: 8,
        marginLeft: '15%',
    },
    title: {
        marginTop: 2,
        fontSize: 25,
        color: "white",
        width: "100%",
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 8,
        padding: 10,
        textAlign: "center",
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "400",
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        shadowOpacity: 0.2,
    },
    headerText: {
        color: "white",
        textAlign: "left",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 7,
        marginLeft: 8,
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        shadowOpacity: 0.2,

        
    },
    textContainer: {
        color: "white",
        textAlign: "left",
        fontSize: 18,
        margin: 15,
        fontWeight: "600",
    },
    scrollViewContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
