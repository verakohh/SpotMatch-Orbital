import React, {useEffect, useState, useContext} from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Settings, ActivityIndicator, Dimensions, Modal, ScrollView } from 'react-native';
import Button from '../../components/navigation/Button';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import Swiper from "react-native-deck-swiper";
import { BlurView } from "expo-blur";
import GetSpotifyData from '../../components/GetSpotifyData';
import { getUser, getToken, getEmail } from '../User';
import { getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, where, query } from 'firebase/firestore';
import { ref, set, usersColRef } from '../../firebase';


{/* <GetSpotifyData /> */}

const MatchScreen = () => {


    const navigation= useNavigation();
    const [userDocs, setUserDocs] = useState(null);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);



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
            const q = query(usersColRef, where("email", "!=", user.email));
            const querySnapshot = await getDocs(q);
            const userDocRef = ref(user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const isMatched = userData.matched || [];
                const sentRequest = userData.sentRequest || [];
                
                const filteredDocs = querySnapshot.docs.filter(doc => {
                    const docRefPath = doc.ref.path;
                    console.log(isMatched.some(ref => ref.path === docRefPath));
                    return !(isMatched.some(ref => ref.path === docRefPath)) && !(sentRequest.some(ref => ref.path === docRefPath));
                });

                setUserDocs(filteredDocs.map(doc => ({ id: doc.id, ...doc.data(), docRef: doc.ref })));
                // setUserDocs(filteredDocs.map(doc => doc.data()));
            }

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
                        if (res.data && res.data.items && Array.isArray(res.data.items)) {
                            const topTracks = res.data.items.map(track => ({
                                name: track.name,
                                artist: track.artists[0].name
                            }));
                            user.setTopTracksData(topTracks);
                            user.update({ topTracks });
                            console.log(topTracks);
                        } else {
                            console.error('Invalid response format: ', res.data);
                        }
                    });
    
                } catch (error) {
                    console.error('Error in useEffect: ', error.response);
                }
            } else {
              console.log("no token")
            } 
        }
        fetchData();
    
        }, [request]);
    }
    GetSpotifyData();


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

    const top3artists = card => {
       const sliced = card.topArtists.slice(0,3);
       return sliced.toString();
    }

    const handleRight = async (cardIndex) => {
        const currUser = await getUser(); 
        const swipedUser = userDocs[cardIndex];
    
        if (swipedUser && swipedUser.docRef) {
            try {
                await updateDoc(swipedUser.docRef, {
                                requestedBy: arrayUnion(currUser.docRef)
                                
                });
                await updateDoc(currUser.docRef, {
                    sentRequest: arrayUnion(swipedUser.docRef)
                    
                });
                setRequest(arrayUnion(swipedUser.docRef));
                console.log("Request updated successfully");
            } catch (error) {
                console.error("Error updating request: ", error);
            }
        } else {
            console.error("No user docRef or invalid cardIndex");
        }
    };


    const renderCard = (card) => (
        <View style={styles.card}>
            <ImageBackground
                style={styles.imgBackground}
                resizeMode="cover"
                source={{ uri: card.imageUrl }}
            >
                <BlurView
                    intensity={150}
                    style={[styles.nonBlurredContent, StyleSheet.absoluteFill]}
                >

                        <Image
                            style={styles.cardImg}
                            source={{ uri: card.imageUrl }}
                        />
                        <Text style={styles.title}>{card.firstName}</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.headerText}>Age: <Text style={styles.text}>{card.age ? card.age : "N/A"}</Text></Text>
                            <Text style={styles.headerText}>Top 3 Artists: <Text style={styles.text}>{card.topArtists ? top3artists(card) : "N/A"}</Text></Text>
                            <Text style={styles.headerText}>Top Track:  
                            {card.topTracks && card.topTracks.slice(0, 1).map((track, index) => (
                                <Text key={index} style={styles.text}> {track.name} by {track.artist}</Text>
                            ))}</Text>
                            <Text style={styles.headerText}>Top 3 Genres: <Text style={styles.text}>{card.genres ? card.genres.slice(0, 3).toString() : "N/A"}</Text></Text>
                        </View>

                </BlurView>
            </ImageBackground>
        </View>
    );

    return (
        <View style={styles.container}>
            <Swiper
                cards={userDocs}
                renderCard={renderCard}
                onSwipedRight={handleRight}
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
        textShadowColor: "black",
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 10,
        padding: 10,
        textAlign: "center",
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "400",
    },
    headerText: {
        color: "white",
        textAlign: "left",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 7,
        marginLeft: 8,
        
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
//     return (
       
//         <View style={styles.container}>
//             <Swiper 
//                 cards={userDocs}
//                 renderCard={(card) => (
//                 <View style={styles.card}>

//                     <ImageBackground
//                     style={styles.imgBackground}
//                     resizeMode="cover"
//                     source={{ uri: card.imageUrl }}
//                     >

//                     <BlurView
//                         intensity={150}
//                         style={[ styles.nonBlurredContent, StyleSheet.absoluteFill]}
//                     >

//                             <Image
//                             style={styles.cardImg}
//                             source={{
//                                 uri: card.imageUrl,
//                             }}
//                             />
//                             <Text style={styles.title}>{card.firstName}</Text>

                       
//                         <View style= {styles.textContainer}> 
//                             <Text style={styles.text}>Age:  { card.age ? card.age : null}</Text>
//                             <Text style={styles.text}>Top 3 Artists: { card.topArtists ? top3artists(card) : null }</Text>
//                             <Text style={styles.text}>Top Track: </Text>
//                              {card.topTracks && card.topTracks.slice(0, 1).map((track, index) => (
//                                  <Text key={index} style={{color: 'white', fontSize: 15, marginHorizontal: 10}}>{track.name} by {track.artist}</Text>
//                             ))}
//                             <Text style={styles.text}>Top 3 Genres: {card.genres ? card.genres.slice(0, 3).toString() : "N/A"}</Text>

                         
//                         </View>

                       
//                     </BlurView>
                    
//                     </ImageBackground>
//                 </View>

//                 )}
//                 onSwipedRight={ handleRight }
//                 stackSize={3}
//                 stackSeparation={15}
//                 disableTopSwipe
//                 infinite
//                 backgroundColor={"transparent"}
//                 />

//         </View>
//     );
// }

// export default MatchScreen;

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     imgBackground: {
//         width: "100%",
//         height: "100%",
//         flex: 1,
//       },
//       card: {
//         flex: Dimensions.get("window").height < 700 ? 0.5 : 0.6,
//         borderRadius: 8,
//         shadowRadius: 25,
//         shadowColor: '#171717',  
//         shadowOpacity: 0.2,
//         shadowOffset: { width: 0, height: 0 },
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "lightgrey",
//         overflow: "hidden",
//       },
//       cardImg: {
//         flex: 1,
//         width: "70%",
//         height: 200,
//         resizeMode: "contain",
//         borderRadius: 8,
//         marginBottom: 10,
//         marginLeft: "15%",
//         marginTop: 15
//     },

//     //   cardImg: {
//     //     flex: 1,
//     //     width: "70%",
//     //     resizeMode: "contain",
//     //     // marginBottom: 5,
//     //     marginLeft: "15%",
//     //     borderRadius: 5,
//     //   },
//       title: {
//         marginTop: 2,
//         fontSize: 25,
//         color: "white",
//         width: "100%",
//         textShadowColor: "black",
//         textShadowOffset: { width: 0, height: 5 },
//         textShadowRadius: 10,
//         padding: 10,
//         textAlign: "center",
//       },
//       profile: {
//         flex: 1,
//         justifyContent: "space-between"

//       },
//       text: {
//         color: "white",
//         textAlign: "left",
//         fontSize: 17,
//         marginTop: 15,
//         marginHorizontal: 8,
//         marginLeft: 7,
//         fontWeight: "500",
        
//       },
//       headerText: {
//         color: "white",
//         textAlign: "left",
//         fontSize: 18,
//         marginBottom: 15,
//         fontWeight: "600",
        
//       },
//       modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0,0,0,0.5)',
//     },
//       textContainer: {
//         color: "white",
//         textAlign: "left",
//         fontSize: 18,
//         marginLeft: 15,
//         marginRight: 15,
//         marginBottom: 15,
//         fontWeight: "600",
        
//     },
//     scrollViewContent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//       scrollView: {
//         backgroundColor: 'white',
//         borderRadius: 10,
//         padding: 20,
//         width: '80%',
//     },
//     modalImage: {
//         width: '100%',
//         height: 200,
//         borderRadius: 10,
//         marginBottom: 20,
//     },
//     name: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'center',
//     },
//     age: {
//         fontSize: 18,
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     sectionTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginTop: 10,
//     },
//   });
  
