import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, ActivityIndicator, Dimensions, Modal, ScrollView } from 'react-native';
import { useNavigation , useFocusEffect} from '@react-navigation/core';
import Swiper from 'react-native-deck-swiper';
import { getUser, getToken } from '../../User';
import { getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, where, query } from 'firebase/firestore';
import { ref, set, usersColRef } from '../../../firebase';
import { BlurView } from 'expo-blur';
import axios from 'axios';

const BothMatchScreen = () => {
    const navigation = useNavigation();
    const [userDocs, setUserDocs] = useState(null);
    const [currentDocs, setCurrentDocs] = useState([]);
    const [swipedUsers, setSwipedUsers] = useState([]);
    const [dismissedUsers, setDismissedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tapUser, setTapUser] = useState(null);
    const [dataUpdated, setDataUpdated] = useState(false);
   
    const fetchData = async () => {
        const token = await getToken();
        const user = await getUser();
        const userDocRef = ref(user.email);
        const userDocSnap = await getDoc(userDocRef);
        setLoading(true);

        console.log("Fetching data...")
        if (userDocSnap.exists()) {
            
            const userData = userDocSnap.data();
            const isMatched = userData.matched || [];
            const sentRequest = userData.sentRequest || [];
            const dismissed = userData.dismissed || [];

            setDismissedUsers(dismissed);
            
            const q = query(usersColRef, where("email", "!=", user.email));
            const querySnapshot = await getDocs(q);

            const genreLengths = querySnapshot.docs.map(doc => {
                const genres = doc.data().genres;
                return genres ? genres.length : 0;
            });

            const artistLengths = querySnapshot.docs.map(doc => {
                const artists = doc.data().topArtists;
                return artists ? artists.length : 0;
            });

            console.log("Genre lengths: ", genreLengths);
            console.log("Artist lengths: ", artistLengths);

            const medianGenreSize = calculateMedianSize(genreLengths);
            const medianArtistSize = calculateMedianSize(artistLengths);

            console.log("median genre size: ", medianGenreSize);
            console.log("median artists size: ", medianArtistSize);
            console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm');


            const calculatedDocs = querySnapshot.docs.map(doc => {
                const docData = doc.data();
                const docRefPath = doc.ref.path;

                const userGenres = userData.genres ? userData.genres.slice(0, medianGenreSize) : [];
                const docGenres = docData.genres ? docData.genres.slice(0, medianGenreSize) : [];
                const userArtists = userData.topArtists ? userData.topArtists.slice(0, medianArtistSize) : [];
                const docArtists = docData.topArtists ? docData.topArtists.slice(0, medianArtistSize) : [];
                const userTracks = userData.topTracks ? userData.topTracks.map(track => `${track.name} by ${track.artist}`) : [];
                const docTracks = docData.topTracks ? docData.topTracks.map(track => `${track.name} by ${track.artist}`) : [];
                console.log("tracks: ", userTracks)
                console.log("doc tracks: ", docTracks)
    
                const genreIntersectSize = new Set(userGenres).size && new Set(docGenres).size ? new Set([...userGenres].filter(x => docGenres.includes(x))).size : 0;
                const artistIntersectSize = new Set(userArtists).size && new Set(docArtists).size ? new Set([...userArtists].filter(x => docArtists.includes(x))).size : 0;
    
                const genreIntersection = new Set([...userGenres].filter(x => docGenres.includes(x)));
                const artistIntersection = new Set([...userArtists].filter(x => docArtists.includes(x)));
                const trackIntersection = new Set([...userTracks].filter(x => docTracks.includes(x))); 
                console.log('track intersect:', trackIntersection)

                const commonGenre = genreIntersection.size > 0 ? Array.from(genreIntersection).slice(0, 3).join(', ') : null;
                const commonArtists = artistIntersection.size > 0 ? Array.from(artistIntersection).slice(0, 5).join(', ') : null;
                const commonTracks = trackIntersection.size > 0 ? Array.from(trackIntersection).slice(0, 1) : null;

                let overallSimilarity = 0;
                if (artistIntersectSize > 0 || genreIntersectSize > 1) {
                    const genreSimilarity = calculateJaccardSimilarity(new Set(userGenres), new Set(docGenres));
                    const artistSimilarity = calculateJaccardSimilarity(new Set(userArtists), new Set(docArtists));
    
                    overallSimilarity = (0.6 * genreSimilarity) + (0.4 * artistSimilarity);
                }
    
                console.log("User:", user.firstName, "Doc:", docData.firstName);
                console.log("User Genres:", userGenres);
                console.log("Doc Genres:", docGenres);
                console.log("User Artists:", userArtists);
                console.log("Doc Artists:", docArtists);
                console.log("Overall Similarity:", overallSimilarity);

                console.log(overallSimilarity >= 0.7 || artistIntersectSize > 0 || genreIntersectSize > 1);

                return {
                    doc,
                    overallSimilarity,
                    isMatched: isMatched.some(ref => ref.path === docRefPath),
                    sentRequest: sentRequest.some(ref => ref.path === docRefPath),
                    dismissed: dismissed.some(ref => ref.path === docRefPath),
                    genreIntersectSize,
                    artistIntersectSize,
                    commonGenre,
                    commonArtists,
                    commonTracks,
                    docTracks,
                };
            })
            
            const filteredDocs = calculatedDocs.filter(item => !item.isMatched && !item.sentRequest && !item.dismissed && 
                        (item.overallSimilarity >= 0.7 || item.artistIntersectSize > 0 || item.genreIntersectSize > 1 )
            );
    
            const sortedDocs = filteredDocs.sort((a, b) => b.overallSimilarity - a.overallSimilarity);
            const topNMatches = sortedDocs.slice(0, 10);

            // const filteredDocs = querySnapshot.docs.filter(doc => {
            //     const docData = doc.data();
            //     const docRefPath = doc.ref.path;
            //     const userGenres = user.genres ? user.genres.slice(0, medianGenreSize) : [];
            //     const docGenres = docData.genres ? docData.genres.slice(0, medianGenreSize) : [];

            //     console.log("==============================")
            //     console.log("this is ",docData.firstName)
            //     console.log(user.artists);
            //     const userArtists = user.artists ? user.artists.slice(0, medianArtistSize) : [];
            //     const docArtists = docData.topArtists ? docData.topArtists.slice(0, medianArtistSize) : [];

            //     const genreSimilarity = calculateJaccardSimilarity(new Set(userGenres), new Set(docGenres));
            //     const artistSimilarity = calculateJaccardSimilarity(new Set(userArtists), new Set(docArtists));
            //     const overallSimilarity = (genreSimilarity + artistSimilarity) / 2;

            //     console.log("User:", user.firstName, "Doc:", docData.firstName);
            //     console.log("User Genres:", userGenres);
            //     console.log("Doc Genres:", docGenres);
            //     console.log("User Artists:", userArtists);
            //     console.log("Doc Artists:", docArtists);
            //     console.log("Genre Similarity:", genreSimilarity);
            //     console.log("Artist Similarity:", artistSimilarity);
            //     console.log("Overall Similarity:", overallSimilarity);

            //     console.log(overallSimilarity >= 0.7);
                

            //     // console.log(isMatched.some(ref => ref.path === docRefPath));
            //     return ( overallSimilarity >= 0.7 && 
            //         !(isMatched.some(ref => ref.path === docRefPath)) && 
            //         !(sentRequest.some(ref => ref.path === docRefPath)) && 
            //         !(dismissed.some(ref => ref.path === docRefPath)) 
            //     );
            //         // && (overallSimilarity >= 0.7);
            // });

            const dismissedDocs = calculatedDocs.filter(doc => {
                // const docRefPath = doc.ref.path;
                return doc.dismissed && (doc.overallSimilarity >= 0.7 || doc.artistIntersectSize > 0 || doc.genreIntersectSize > 1);
            });
            // const dismissedDocs = querySnapshot.docs.filter(doc => {
            //     const docData = doc.data();
            //     const docRefPath = doc.ref.path;
            //     const userGenres = user.genres ? user.genres.slice(0, medianGenreSize) : [];
            //     const docGenres = docData.genres ? docData.genres.slice(0, medianGenreSize) : [];

            //     const userArtists = user.artists ? user.artists.slice(0, medianArtistSize) : [];
            //     const docArtists = docData.topArtists ? docData.topArtists.slice(0, medianArtistSize) : [];

            //     const genreSimilarity = calculateJaccardSimilarity(new Set(userGenres), new Set(docGenres));
            //     const artistSimilarity = calculateJaccardSimilarity(new Set(userArtists), new Set(docArtists));
            //     const overallSimilarity = (genreSimilarity + artistSimilarity) / 2;

            //     return dismissed.some(ref => ref.path === docRefPath && overallSimilarity >= 0.7);
            // });

            const newDocs = topNMatches.map(item => ({ id: item.doc.id, ...item.doc.data(), docRef: item.doc.ref, overallSimilarity: item.overallSimilarity, commonGenre: item.commonGenre, commonArtists: item.commonArtists, commonTracks: item.commonTracks, docTracks: item.docTracks}));
            const newDismissedDocs = dismissedDocs.map(item => ({ id: item.doc.id, ...item.doc.data(), docRef: item.doc.ref, overallSimilarity: item.overallSimilarity, commonGenre: item.commonGenre, commonArtists: item.commonArtists, commonTracks: item.commonTracks,  docTracks: item.docTracks }));
            setUserDocs([...newDocs, ...newDismissedDocs]);
            
            setCurrentDocs([...newDocs, ...newDismissedDocs]);
            console.log("the displayed users: ",currentDocs.map(doc => doc.firstName));
            
            setLoading(false);

        } else {
            alert("Error! No userDoc");
        }
       
    }

    useFocusEffect(
        React.useCallback(() => {
            // fetchData();
            const updateAndFetch = async () => {
                await fetchData();
                setDataUpdated(true); // Update state to reflect that data is ready
            };
            updateAndFetch();
            // console.log("the displayed users: ",currentDocs.map(doc => doc.firstName));

        }, [])
    );

        const calculateMedianSize = (sizes) => {
            console.log("ori sizes array: ", sizes)
            sizes.sort((a, b) => a - b);
            console.log('sorted sizes: ', sizes);
            const mid = Math.floor(sizes.length / 2);
            return sizes.length % 2 !== 0 ? sizes[mid] : (sizes[mid - 1] + sizes[mid]) / 2;
        };

        const calculateJaccardSimilarity = (setA, setB) => {
            console.log("user genre/artist after slice: ", setA)
            console.log("doc genre/artist after slice: ", setB)
            const A = new Set(setA)
            const B = new Set(setB)
            if (A.size === 0 || B.size === 0 ) {
                return 0;
            }
            const intersection = new Set([...setA].filter(x => setB.has(x))).size;
            const union = new Set([...setA, ...setB]).size;
            console.log("Intersection: ", intersection);
            console.log("Union: ", union);
            console.log("Jaccard similarity: ", intersection / union);
            console.log("------------------------------------------")
            return intersection / union;
        };

        
        const handleRight = async (cardIndex) => {
            const currUser = await getUser(); 
            const swipedUser = currentDocs[cardIndex];
        
            if (swipedUser && swipedUser.docRef) {
                try {
                    await updateDoc(swipedUser.docRef, {
                                    requestedBy: arrayUnion(currUser.docRef)
                                    
                    });
                    await updateDoc(currUser.docRef, {
                        sentRequest: arrayUnion(swipedUser.docRef),
                        dismissed: arrayRemove(swipedUser.docRef)
                        
                    });
                    setSwipedUsers([...swipedUsers, swipedUser]);
                    // setCurrentDocs(currentDocs.slice(cardIndex));
                    // setRequest(arrayUnion(swipedUser.docRef));
                    console.log("Request updated successfully");
                } catch (error) {
                    console.error("Error updating request: ", error);
                }
            } else {
                console.error("No user docRef or invalid cardIndex");
            }
        };
    
        const handleLeft = async (cardIndex) => {
            const currUser = await getUser();
            const swipedUser = currentDocs[cardIndex];
    
            if (swipedUser && swipedUser.docRef) {
                try {
                    await updateDoc(currUser.docRef, {
                        dismissed: arrayUnion(swipedUser.docRef)
                    });
                    setDismissedUsers([...dismissedUsers, swipedUser]);
                    // setCurrentDocs(currentDocs.slice(cardIndex));
                    console.log(currentDocs.map(doc => doc.firstName))
                    console.log("User dismissed successfully");
                } catch (error) {
                    console.error("Error dismissing user: ", error);
                }
            } else {
                console.error("No user docRef or invalid cardIndex");
            }
        };


    if (loading) {
        return (
            <View style={{flex: 1,
                justifyContent: 'center',
                alignItems: 'center',}}>
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


    const top3artists = card => {
       const sliced = card.topArtists.slice(0,3).join(', ');
       return sliced.toString();
    }

    const handleTapCard = (cardIndex) => {
        const tappedUser = currentDocs[cardIndex];
        setTapUser(tappedUser);
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
                    style={[StyleSheet.absoluteFill]}
                >

                        <Image
                            style={styles.cardImg}
                            source={{ uri: card.imageUrl }}
                        />
                        <Text style={styles.title}>{card.firstName}</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.headerText}>Age: <Text style={styles.text}>{card.age ? card.age : "N/A"}</Text></Text>
                            <Text style={styles.headerText}>Top Artist: <Text style={styles.text}>{card.topArtists ? card.topArtists.slice(0, 1) : "N/A"}</Text></Text>

                            {/* <Text style={styles.headerText}>Top 3 Artists: <Text style={styles.text}>{card.topArtists ? top3artists(card) : "N/A"}</Text></Text> */}
                            <View style={styles.common}>
                                <Text style={styles.commonHeader}>Similarity: <Text style={styles.commonText}>{(card.overallSimilarity * 100).toFixed(0)}%</Text></Text>
                                <Text style={styles.commonHeader}>Shared artists: <Text style={styles.commonText}>{card.commonArtists ? card.commonArtists : "none yet :("}</Text></Text> 
                                <Text style={styles.commonHeader}>Common genre: <Text style={styles.commonText}>{card.commonGenre ? card.commonGenre : "none yet :("}</Text></Text>
                                <Text style={styles.commonHeader}>Common song: <Text style={styles.commonText}>{card.commonTracks ? card.commonTracks : "none yet :("}</Text></Text>
                            
                            </View>
                            
                            {/* <Text style={styles.headerText}>Top 3 Genres: <Text style={styles.text}>{card.genres ? card.genres.slice(0, 3).join(', ') : "N/A"}</Text></Text> */}
                        </View>

                </BlurView>
            </ImageBackground>
        </View>
    );

    return (
        <View style={styles.container}>
            <Swiper
                cards={currentDocs}
                renderCard={renderCard}
                onSwipedRight={handleRight}
                onSwipedLeft={handleLeft}
                stackSize={3}
                stackSeparation={15}
                disableTopSwipe
                disableBottomSwipe
                backgroundColor={"transparent"}
                onSwipedAll={fetchData}
                onTapCard={handleTapCard}
            />
             {tapUser && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!tapUser}
                    onRequestClose={() => setTapUser(null)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image
                                style={styles.modalImg}
                                source={{ uri: tapUser.imageUrl }}
                            />
                            <Text style={styles.modalTitle}>{tapUser.firstName}</Text>
                            <ScrollView contentContainerStyle={styles.modalScrollView}>
                            {/* <View style={styles.modalTextContainer}> */}
                            <Text style={styles.modalHeader}>Age: <Text style={styles.modalText}>{tapUser.age ? tapUser.age : "N/A"}</Text></Text>
                                <Text style={styles.modalHeader}>Spotify display name:</Text>
                                <Text style={styles.modalText}>{tapUser.displayName ? tapUser.displayName : "N/A"}</Text>
                                
                                <Text style={styles.modalHeader}>Top 3 Artists: </Text>
                                {tapUser.topArtists ? tapUser.topArtists && tapUser.topArtists.slice(0, 3).map((artist, index) => (
                                    <Text key={index} style={styles.modalText}>{artist ? artist : "N/A"}</Text>
                                )) : <Text style={styles.modalText}>N/A</Text>}

                                <Text style={styles.modalHeader}>Top Tracks: </Text>
                                {tapUser.topTracks ? tapUser.topTracks && tapUser.topTracks.slice(0, 3).map((track, index) => (
                                    <Text key={index} style={styles.modalText}>{track.name ? track.name : "N/A"} by {track.artist ? track.artist : "N/A"}</Text>
                                )) :  <Text style={styles.modalText}>N/A</Text>}
                                {/* <Text style={styles.modalText}> {tapUser.docTracks.slice(0, 3).join(', ')}</Text></Text> */}

                                <Text style={styles.modalHeader}>Top 3 Genres: </Text>
                                {tapUser.genres ? tapUser.genres && tapUser.genres.slice(0, 3).map((genre, index) => (
                                    <Text key={index} style={styles.modalText}>{genre}</Text>
                                )) :  <Text style={styles.modalText}>N/A</Text>}
                                {/* <Text style={styles.modalText}>{tapUser.genres.slice(0, 3).join(', ')}</Text> */}
                            </ScrollView>
                            {/* </View> */}
                            <TouchableOpacity onPress={() => setTapUser(null)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
    
}

export default BothMatchScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#FAF4EC',
        
    },
    imgBackground: {
        width: "100%",
        height: "100%",
        flex: 1,
      },
    card: {
        flex: Dimensions.get("window").height < 700 ? 0.55 : 0.65,
        // flex: 1,
        // width: "100%",
        // height: "100%",
        borderRadius: 8,
        shadowRadius: 25,
        shadowColor: '#171717',  
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 0 },
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: 'lightgrey',
        overflow: "hidden",
        marginTop: 0,

      },
    cardImg: {
        // flex: 1,
        width: "55%",
        height: 200,
        // resizeMode: "contain",
        borderRadius: 8,
        marginTop: 15,
        marginbottom: 8,
        marginLeft: '22%',
    },
    title: {
        // marginTop: 2,
        fontSize: 25,
        color: "white",
        width: "100%",
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 5 },
        textShadowRadius: 8,
        padding: 10,
        paddingBottom: 8,
        textAlign: "center",
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        shadowOpacity: 0.2,
    },
    headerText: {
        color: "white",
        textAlign: "left",
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 6,
        marginLeft: 8,
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        shadowOpacity: 0.2,

        
    },
    textContainer: {
        color: "white",
        textAlign: "left",
        // fontSize: 18,
        marginHorizontal: 15,
        marginBottom: 15,
        fontWeight: "600",
    },
    common: {
        backgroundColor: "rgba(65, 83, 127, 0.5)",
        padding: 4,
        borderRadius: 12,

    },
    commonText: {
        // color: "#33537f",
        color: "#d3deed",
        fontSize: 16,
        // fontWeight: "400",
        // textShadowColor: "#eaeff6",
        textShadowColor: "#171717",

        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        shadowOpacity: 0.2,
        fontWeight: '500',
    },
    commonHeader: {
        // color: "#eaeff6",
        color: "#1e314b",
        textAlign: "left",
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 7,
        marginLeft: 8,
        // textShadowColor: "#171717",
        textShadowColor: "#c1d1e6",

        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        shadowOpacity: 0.2,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalScrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        height: "80%",
        padding: 25,
        backgroundColor: '#bccce4',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        color: "#101a28",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 8,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 8,
        color: "#e4ebf4",
        textShadowColor: "#171717",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        shadowOpacity: 0.2,
        fontWeight: '500',
    },
    modalHeader: {
        color: "#1e314b",
        textAlign: "left",
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 2,
        marginTop: 14,
        // marginLeft: 8,
        textShadowColor: "#c1d1e6",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        shadowOpacity: 0.2,
    },
    modalTextContainer: {
        textAlign: "left",
        marginHorizontal: 0,
    },
    modalImg: {
        // flex: 1,
        width: "65%",
        height: 190,
        // resizeMode: "contain",
        borderRadius: 20,
    },
    closeButton: {
        marginTop: 20,
        padding: 8,
        paddingHorizontal: 12,
        backgroundColor: '#708090',
        borderRadius: 8,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});