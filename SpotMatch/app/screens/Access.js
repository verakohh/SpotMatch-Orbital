import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import Button from '../../components/navigation/Button';
import { ResponseType, useAuthRequest} from 'expo-auth-session';
import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/core';
import { ref, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { storeSubscription } from '../User';
import qs from 'qs';
import { CLIENT_ID, REDIRECT_URI } from '@env';



const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };



export default function Access ({route}) {

    const {docRefPath} = route.params;
    const docRef = doc(db, docRefPath);
    const [loading, setLoading] = useState(false);
    const navigation= useNavigation();
    const update = async (data) => {
      if (docRef) {
        try {
          await setDoc(docRef, data, { merge: true });
          console.log("Document updated successfully");
        } catch (error) {
          console.error("Error updating document: ", error);
        }
      } else {
        console.error("No user docRef");
      }
    }

    const [request, response, promptAsync] = useAuthRequest(
        {
          clientId: CLIENT_ID,
          redirectUri: REDIRECT_URI,
          scopes: [
            'user-top-read',
            'user-read-private',
            'user-read-email',
            'user-modify-playback-state',
            'user-read-playback-state',
            'playlist-modify-public',
            'playlist-modify-private'
          ],
          usePKCE: true,  // Enable PKCE
          responseType: ResponseType.Code, 
          extraParams: {
            show_dialog: 'true'
          }
        },
        discovery
    );
    
    useEffect( () => {
      console.log("response: ", response)
      
        const fetchData = async () => {
          console.log("came in access.js fetchData")
          const now = new Date().getTime();
            console.log("now: ", now)
          if (response && response?.type === "success") {
           
              const code = response.params.code;
              console.log("request :", request)
              console.log("request code verifier :", request.codeVerifier)



              try {
               
                setLoading(true);
                const data = qs.stringify({
                  client_id: CLIENT_ID,
                  grant_type: 'authorization_code',
                  code: code,
                  redirect_uri: REDIRECT_URI,
                  code_verifier: request.codeVerifier,  
                });
    
                const tokenResponse = await axios.post(discovery.tokenEndpoint, data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    }
                });
                const { access_token, refresh_token, expires_in } = tokenResponse.data;
                console.log("access token: ", access_token)
                console.log("refreshToken: ", refresh_token)
                const expiresIn = new Date().getTime() + expires_in * 1000;
                await update({token: access_token, expiresIn: expiresIn, refreshToken: refresh_token});
               
                if (access_token) {
                  console.log("Getting spotify data now..")
                  await axios.get("https://api.spotify.com/v1/me/top/artists", {
                      // method: 'GET',
                      headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                          Authorization: "Bearer " + access_token,
                      },
                      params: {
                          time_range: "medium_term",
                          limit: 20
                      }
                  })
                  .then(async res => {
                      // alert("Artist and genre response:",res)
                      // alert("Artist and genre response data:", res.data)
                      console.log("Artist and genre response: ",res.data)
                      if (res.data && res.data.items && Array.isArray(res.data.items)) {
                          const names = res.data.items.map(artist => artist.name); 
                          // newUser.setArtists(names);
                          // console.log(user.artists);
                          console.log(names);

                          console.log("res data items: ", res.data.items)
                          const genre = res.data.items.flatMap(user => user.genres);
                          const uniqueGenres = [...new Set(genre)];
                          // newUser.setGenres(uniqueGenres);
                          console.log(genre); 
                          console.log(uniqueGenres);
      

                              // console.log(refDoc);
                          
                                  // console.log(artistNames);
                          await update({topArtists: names, genres: uniqueGenres});
                                  // user.update({genres: genre}); 
                      } else {
                          Alert.alert('Error! Invalid response format: ', res.data);
                      }
                  }) 
                  
                  
                  await axios.get("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                          // method: "GET",
                          headers: {
                              Accept: "application/json",
                              "Content-Type": "application/json",
                              Authorization: "Bearer " + access_token,
                          },
                  })
                  .then(async res => {
                      // alert("toptrack data: ", res.data)
                      console.log("toptrack data: ", res.data)
                      if (res.data && res.data.items && Array.isArray(res.data.items)) {
                          const topTracks = res.data.items.map(track => ({
                              id: track.id,
                              uri: track.uri,
                              name: track.name,
                              previewUrl: track.preview_url,
                              artist: track.artists[0].name,
                              albumImg: track.album.images[0].url
                          }));
                          // console.log("top tracks preview url: ", topTracks.previewUrl);
                          // newUser.setTopTracksData(topTracks);
                          await update({ topTracks });
                          console.log(topTracks);
                      } else {
                        Alert.alert('Error! Invalid response format: ', res.data);
                      }
                  });

                  await axios.get('https://api.spotify.com/v1/me', {
                      // method: 'GET',
                      headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                          Authorization: "Bearer " + access_token,
                      },
                  })
                  .then(async res => {
                      // alert("profile data: ",res.data)

                      console.log("profile data: ",res.data)
                      const displayname = res.data.display_name;
                      // newUser.setDisplayName(displayname);
                      console.log(res.data.id);
                      const userId = res.data.id;

                      console.log(res.data.product);
                      const productsubs = res.data.product;
                      await storeSubscription(productsubs);


                      console.log(res.data.images)
                      const imgUrl = res.data.images.map(img => img.url)
                      const uniqueUrl = imgUrl ? imgUrl[0] : ""
                      console.log('this is imgUrl: ', uniqueUrl)
                      // newUser.setImgUrl(uniqueUrl);

                     
                      
                      
                      await update({displayName: displayname, spotifyId: userId, subscription: productsubs})
                      await update({ imageUrl: uniqueUrl});
                  })

                  Alert.alert("Success", "Fetched all data successfully!")
                  navigation.navigate("SideBar");

              } else {
                  Alert.alert("Error", "No token!")

              }
              
             
              } catch (error) {
                if(error.response) {
                  console.log("response :", error.response)
                  console.log("response data: ", error.response.data)
                  if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
                    Alert.alert("Currently you are not allowlisted by SpotMatch yet.", "SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch.")
                  }
                } else if (error.request) {
                  console.log('No response received:', error.request);
                  Alert.alert("Error! No response received:", error.request);

                } 
                console.error("Error exchanging code for token:", error.message);
                Alert.alert("Error!", "Failed to exchange code for token.");
              } finally {
                setLoading(false);
              }
            
        } else if (response?.type === "cancel") {
          Alert.alert("Connection cancelled", "Please click continue to sign into Spotify and grant access to proceed.")
        } else if (response && response?.type !== "success") {
          Alert.alert("Unsuccessful!", "Please try again.")
        }
      };
      fetchData();
    
      }, [response]);


      if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    


    return (
      <View style={styles.container}>
          <Image source={require('../../assets/images/dark-icon.png')} style={styles.icon} />
          <Text style={styles.title}>Welcome to SpotMatch</Text>
          <Text style={styles.text}>
              Kindly log into your Spotify and follow the instructions to grant us access to the specified data needed for our app to deliver.
              {"\n"}{"\n"}
              That way, we can meet your needs in tuning out with a friend!
          </Text>
          <Button
              disabled={!request}
              type='primary'
              size='m'
              text="Login to Spotify"
              onPress={() => {
                  promptAsync();
              }}
          />
      </View>
  );

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#111E26',
  },
  icon: {
      width: 350,
      height: 200,
      marginBottom: 10,
      resizeMode: 'contain',
  },
  title: {
      fontSize: 28,
      fontWeight: '700',
      textAlign: 'center',
      color: '#FFFFFF',
      marginBottom: 20,
  },
  text: {
      fontSize: 18,
      fontWeight: '400',
      textAlign: 'center',
      color: '#BBCFF1',
      marginBottom: 30,
      paddingHorizontal: 20,
      lineHeight: 26,
  },
});

