import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Settings, ActivityIndicator, Dimensions, Modal, ScrollView } from 'react-native';
import { useNavigation , useFocusEffect} from '@react-navigation/core';
import Swiper from 'react-native-deck-swiper';
import { getUser, getToken } from '../../User';
import { getDoc, getDocs, updateDoc, arrayUnion, arrayRemove, where, query } from 'firebase/firestore';
import { ref, usersColRef } from '../../../firebase';
import { BlurView } from 'expo-blur';

const AllScreen = () => {

    const [userDocs, setUserDocs] = useState(null);
    const [currentDocs, setCurrentDocs] = useState([]);
    const [swipedUsers, setSwipedUsers] = useState([]);
    const [dismissedUsers, setDismissedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tapUser, setTapUser] = useState(null);

   
    const fetchData = async () => {
        const user = await getUser();
        const userDocRef = ref(user.email);
        const userDocSnap = await getDoc(userDocRef);
        setLoading(true);
    
        console.log("at get spotifydata useEffect")
    
        if (userDocSnap.exists()) {

            const userData = userDocSnap.data();
            const isMatched = userData.matched || [];
            const sentRequest = userData.sentRequest || [];
            const dismissed = userData.dismissed || [];

            setDismissedUsers(dismissed);
            
            const q = query(usersColRef, where("email", "!=", user.email));
            const querySnapshot = await getDocs(q);

            const filteredDocs = querySnapshot.docs.filter(doc => {
                const docRefPath = doc.ref.path;
                // console.log(isMatched.some(ref => ref.path === docRefPath));
                return !(isMatched.some(ref => ref.path === docRefPath)) 
                    && !(sentRequest.some(ref => ref.path === docRefPath))
                    && !(dismissed.some(ref => ref.path === docRefPath));
            });

            const dismissedDocs = querySnapshot.docs.filter(doc => {
                const docRefPath = doc.ref.path;
                return dismissed.some(ref => ref.path === docRefPath);
            });

            const newDocs = filteredDocs.map(doc => ({ id: doc.id, ...doc.data(), docRef: doc.ref }));
            const newDismissedDocs = dismissedDocs.map(doc => ({ id: doc.id, ...doc.data(), docRef: doc.ref }));
            setUserDocs([...newDocs, ...newDismissedDocs]);
            setCurrentDocs([...newDocs, ...newDismissedDocs]);
            setLoading(false);

        } else {
            alert("Error! No userDoc");
        }
        
    }

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );
       
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


    const top3artists = card => {
       const sliced = card.topArtists.slice(0,3);
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
                    style={[styles.nonBlurredContent, StyleSheet.absoluteFill]}
                >

                    <Image
                        style={styles.cardImg}
                        source={{ uri: card.imageUrl }}
                        alignItems="center"
                    />
                        <Text style={styles.title}>{card.firstName}</Text>
                        <View style={styles.textContainer}>
                            <Text style={styles.headerText}>Age: <Text style={styles.text}>{card.age ? card.age : "N/A"}</Text></Text>
                            <Text style={styles.headerText}>Top 3 Artists: <Text style={styles.text}>{card.topArtists ? top3artists(card) : "N/A"}</Text></Text>
                            <Text style={styles.headerText}>Top Track:  
                            {card.topTracks && card.topTracks.slice(0, 1).map((track, index) => (
                                <Text key={index} style={styles.text}> {track.name} by {track.artist} </Text>
                            ))}
                            </Text>
                            <Text style={styles.headerText}>Top 3 Genres: <Text style={styles.text}>{card.genres ? card.genres.slice(0, 3).toString() : "N/A"}</Text></Text>
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
                            <TouchableOpacity onPress={() => setTapUser(null)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Image
                                style={styles.modalImg}
                                source={{ uri: tapUser.imageUrl }}
                            />
                            <Text style={styles.modalTitle}>{tapUser.firstName}</Text>
                            <ScrollView contentContainerStyle={styles.modalScrollView}>
                            {/* <View style={styles.modalTextContainer}> */}
                            <Text style={styles.modalText}>Age: {tapUser.age ? tapUser.age : "N/A"}</Text>
                            <Text style={styles.modalText}>Spotify display name: {tapUser.displayName ? tapUser.displayName : "N/A"}</Text>
                            <View style={styles.whiteBox}>
                                <Text style={styles.whiteBoxText}>Top 3 Artists:</Text>
                                {tapUser.topArtists ? tapUser.topArtists.slice(0, 3).map((artist, index) => (
                                    <Text key={index} style={styles.whiteBoxText}>{artist}</Text>
                                )) : <Text style={styles.whiteBoxText}>N/A</Text>}
                            </View>
                            <View style={styles.whiteBox}>
                                <Text style={styles.whiteBoxText}>Top Tracks:</Text>
                                {tapUser.topTracks ? tapUser.topTracks.slice(0, 3).map((track, index) => (
                                    <Text key={index} style={styles.whiteBoxText}>{track.name ? track.name : "N/A"} by {track.artist ? track.artist : "N/A"}</Text>
                                )) : <Text style={styles.whiteBoxText}>N/A</Text>}
                            </View>
                            <View style={styles.whiteBox}>
                                <Text style={styles.whiteBoxText}>Top Genres:</Text>
                                {tapUser.genres ? tapUser.genres.slice(0, 3).map((genre, index) => (
                                    <Text key={index} style={styles.whiteBoxText}>{genre}</Text>
                                )) : <Text style={styles.whiteBoxText}>N/A</Text>}
                            </View>

                                {/* commented out */}
                                {/* <Text style={styles.modalHeader}>Age: <Text style={styles.modalText}>{tapUser.age ? tapUser.age : "N/A"}</Text></Text>
                                <Text style={styles.modalHeader}>Spotify display name:</Text>
                                <Text style={styles.modalText}>{tapUser.displayName ? tapUser.displayName : "N/A"}</Text>
                                
                                <Text style={styles.modalHeader}>Top 3 Artists: </Text>
                                {tapUser.topArtists ? tapUser.topArtists && tapUser.topArtists.slice(0, 3).map((artist, index) => (
                                    <Text key={index} style={styles.modalText}>{artist ? artist : "N/A"}</Text>
                                )) : <Text style={styles.modalText}>N/A</Text>}

                                <Text style={styles.modalHeader}>Top Tracks: </Text>
                                {tapUser.topTracks ? tapUser.topTracks && tapUser.topTracks.slice(0, 3).map((track, index) => (
                                    <Text key={index} style={styles.modalText}>{track.name ? track.name : "N/A"} by {track.artist ? track.artist : "N/A"}</Text>
                                )) :  <Text style={styles.modalText}>N/A</Text>} */}
                                {/* <Text style={styles.modalText}> {tapUser.docTracks.slice(0, 3).join(', ')}</Text></Text> */}

                                {/* <Text style={styles.modalHeader}>Top 3 Genres: </Text>
                                {tapUser.genres ? tapUser.genres && tapUser.genres.slice(0, 3).map((genre, index) => (
                                    <Text key={index} style={styles.modalText}>{genre}</Text>
                                )) :  <Text style={styles.modalText}>N/A</Text>} */}
                                {/* <Text style={styles.modalText}>{tapUser.genres.slice(0, 3).join(', ')}</Text> */}
                            </ScrollView>
                            {/* </View> */}
                            {/* <TouchableOpacity onPress={() => setTapUser(null)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

export default AllScreen;

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
        flex: 0.75,
        // flex: Dimensions.get("window").height < 700 ? 0.55 : 0.65,
        borderRadius: 8,
        // shadowRadius: 25,
        // shadowColor: '#171717',  
        // shadowOpacity: 0.2,
        // shadowOffset: { width: 0, height: 0 },
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'lightgrey',
        overflow: "hidden",
        padding: 10,
      },
    cardImg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        alignSelf: 'center',
        // flex: 1,
        // width: "60%",
        // height: 220,
        // // resizeMode: "contain",
        // borderRadius: 8,
        // marginTop: 15,
        // marginbottom: 8,
        // marginLeft: '20%',
    },
    title: {
        marginTop: 2,
        fontSize: 25,
        color: "white",
        width: "100%",
        textShadowColor: "#c1d1e6",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
        paddingTop: 5,
        paddingHorizontal: 10,
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
        textAlign: "center",
    },
    headerText: {
        color: "white",
        textAlign: "center",
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
        textAlign: "center",
        fontSize: 18,
        margin: 15,
        fontWeight: "600",
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
        height: '80%',
        padding: 25,
        backgroundColor: '#BAD6EB',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        color: "#101a28",
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: 8,
        textAlign: "center",
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
        color: "#1e314b",
        // color: "#e4ebf4",
        // textShadowColor: "#171717",
        // textShadowOffset: { width: 0, height: 2 },
        // textShadowRadius: 6,
        // shadowOpacity: 0.2,
        fontWeight: '500',
        textAlign: "center",
    },
    modalHeader: {
        color: "#1e314b",
        textAlign: "center",
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
        textAlign: "center",
        marginHorizontal: 0,
    },
    modalImg: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        alignSelf: 'center',
        // // flex: 1,
        // width: "65%",
        // height: 190,
        // // resizeMode: "contain",
        // borderRadius: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
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
    whiteBox: {
        width: '100%',
        padding: 10,
        backgroundColor: '#F7F2EC',
        borderRadius: 10,
        marginTop: 10, // Change this value to adjust the margin top
        alignItems: 'center', // Center text inside white box
    },
    whiteBoxText: {
        fontSize: 18,
        color: '#1e314b',
        fontWeight: '500',
        textAlign: "center", // Center text
    },
});