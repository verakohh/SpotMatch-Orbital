import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import Button from '../../components/navigation/Button';
import { ResponseType, useAuthRequest} from 'expo-auth-session';
import Login from './Login';
import { useEffect, useState, useContext } from 'react';
import React from 'react';
import axios from 'axios';
import { refDoc , update} from './Registration';
import { useNavigation } from '@react-navigation/core';
import { useUserInfo, UserContext } from '../UserContext';
import { ref, db } from '../../firebase';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';

import { getUser, getToken, getEmail, storeSubscription, getTokenExpiration, checkTokenValidity, getStoredToken } from '../User';
import qs from 'qs';



const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };

// const clientId = '894050794daa4a568ee64d6a083cf2de';
const clientId = '8346e646ff7a44b59b3f91f8a49033cb';
const redirectUri = 'musicmatch://callback';
// const clientId = '89d33611962f42ecb9e982ee2b879bb8';
// const redirectUri = 'spotmatch://callback';
// const navigation= useNavigation();


// export const refreshToken = async (refreshToken) => {
//   alert("Token has expired! Refreshing now")
//   if (refreshToken) {
//     try {
//       const data = qs.stringify({
//         client_id: clientId,
//         grant_type: 'refresh_token',
//         refresh_token: refreshToken
    
//     });
//     console.log("data: ", data);

//       const tokenResponse = await axios.post(discovery.tokenEndpoint, data, {
//           headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//           }
//       });
//         const { access_token, refresh_token, expires_in } = tokenResponse.data;
//         console.log("access token: ", access_token)
//         console.log("refreshToken: ", refresh_token)
//         await storeToken({access_token, expires_in, refresh_token});
//         return access_token;
//     } catch (error) {
//       console.error("Error refreshing token:", error);
//       alert("Failed to refresh token. Please log in again.");
//       await removeToken();
//       navigation.navigate('Access');
//     }
//   } else {
//     alert("No token to refresh!")
//     navigation.navigate('Access');
//   }
// }

export default function Access ({route}) {

    // const [token, setToken] = useState("");
    // const { user, setUser, token, setToken } = useContext(UserContext);
    // const [artistNames, setArtistNames] = useState([""]);
    // const [genres, setGenres] = useState([""]);
    // const [displayName, setDisplayName] = useState("");
    // const [topTracksData, setTopTracksData] = useState("");
    const {docRefPath} = route.params;
    const docRef = doc(db, docRefPath);
    const [loading, setLoading] = useState(false);
    const navigation= useNavigation();
    // const { firstName, lastName, email, password, birthdate, age } = route.params;
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
          clientId,
          redirectUri,
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
          // usePKCE: false,
          // responseType: ResponseType.Token,
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
            // const user = await getUser();
          if (response && response?.type === "success") {
            // if(await getStoredToken()) {
              // if(newUser) {

              // console.log("there was a previous token...")
              // await removeToken();
              // console.log("there is a user: ", newUser)
              const code = response.params.code;
              console.log("request :", request)
              console.log("request code verifier :", request.codeVerifier)



              try {
                // const tokenData = new URLSearchParams();
                // tokenData.append('client_id', clientId);
                // tokenData.append('grant_type', 'authorization_code');
                // tokenData.append('code', code);
                // tokenData.append('redirect_uri', redirectUri);
                // tokenData.append('code_verifier', request.codeVerifier);
                setLoading(true);
                const data = qs.stringify({
                  client_id: clientId,
                  grant_type: 'authorization_code',
                  code: code,
                  redirect_uri: redirectUri,
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
                // const userDocRef = ref(user.email);
                // const userDocSnap = await getDoc(userDocRef);

                // if(userDocSnap.exists()) {
                //   const userData = userDocSnap.data();
                //   const accessToken = userData.token;
                //   if (accessToken) {
                //     setLoading(false);
                //     console.log("token is same!")
                //     console.log("access token from userDoc: ", accessToken);
                //     alert("access token from userDoc: ", accessToken);
                //     navigation.navigate("SideBar");
                //   } else {
                //     console.log("Token not same! or Token not updated! no token")
                //     alert("Token not updated! no token")
                //   }

                // } else {
                //   alert("No userDoc!")
                // }
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
                
                // await storeToken({token: access_token, expiresIn: expires_in, refreshToken: refresh_token});
                // const token = await getStoredToken();
                // if (token) {
                //   navigation.navigate("SideBar");
                // }

                // const { access_token, expires_in } = response.params;
              // console.log("response: ", response)
              // console.log("response params: ", response.params)
              // console.log("access_token: ",access_token)
              // await storeToken(access_token, expires_in);

             
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
            // } else {
            //   alert("No user!")
            //   const code = response.params.code;
            //   console.log("code: ", code)
            //   console.log("request :", request)
            //   console.log("request code verifier :", request.codeVerifier)



            //   try {
            //     const data = qs.stringify({
            //       client_id: clientId,
            //       grant_type: 'authorization_code',
            //       code: code,
            //       redirect_uri: redirectUri,
            //       code_verifier: request.codeVerifier,  
            //   });
            //   console.log("data: ", data);
            //     // const tokenData = new URLSearchParams();
            //     // tokenData.append('client_id', clientId);
            //     // tokenData.append('grant_type', 'authorization_code');
            //     // tokenData.append('code', code);
            //     // tokenData.append('redirect_uri', redirectUri);
    
            //     const tokenResponse = await axios.post(discovery.tokenEndpoint, data, {
            //         headers: {
            //             'Content-Type': 'application/x-www-form-urlencoded',
            //         }
            //     });
            //       const { access_token, refresh_token, expires_in } = tokenResponse.data;
            //       console.log("access token: ", access_token)
            //       console.log("refreshToken: ", refresh_token)
            //       await storeToken({token: access_token, expiresIn: expires_in, refreshToken: refresh_token});
            //       // const { access_token, expires_in } = response.params;
            //   // console.log("response: ", response)
            //   // console.log("response params: ", response.params)
            //   // console.log("access_token: ",access_token)
            //   // await storeToken(access_token, expires_in);
            //     const token = await getStoredToken();
            //     if (token) {
            //       navigation.navigate("SideBar");
            //     }
            // } catch (error) {
            //   console.error("Error exchanging code for token:", error.message);
            //   alert("Failed to exchange code for token.");
            // }
            // }
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
    // useEffect(() => {
    //     if (token) {
    //         try {
    //             console.log('yes')
    //             axios("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
    //                 method: "GET",
    //                 headers: {
    //                     Accept: "application/json",
    //                     "Content-Type": "application/json",
    //                     Authorization: "Bearer " + token,
    //                 },
    //             })
    //             .then(res => {
    //                 if (res.data && res.data.items && Array.isArray(res.data.items)) {
    //                     const names = res.data.items.map(artist => artist.name); 
    //                     user.setArtists(names);
    //                     console.log(res.data.items);
    //                     console.log(user.artists);
    //                     console.log(names);
                        
    //                     const genre = res.data.items.flatMap(user => user.genres);
    //                     const uniqueGenres = [...new Set(genre)];
    //                     user.setGenres(uniqueGenres);
    //                     console.log(genre); 
    //                     console.log(uniqueGenres);

    //                     // console.log(refDoc);
                       
    //                         // console.log(artistNames);
    //                     user.update({topArtists: names, genres: genre});
    //                         // user.update({genres: genre}); 
                        
    //                 } else {
    //                     console.error('Invalid response format: ', res.data);
    //                 }
    //             })
    //             // .catch(err => {
    //             //     console.error('Error fetching top artists: ', err)
    //             // })

    //             axios('https://api.spotify.com/v1/me', {
    //                 method: 'GET',
    //                 headers: {
    //                     Accept: "application/json",
    //                     "Content-Type": "application/json",
    //                     Authorization: "Bearer " + token,
    //                 },
    //             })
    //             .then(res => {
    //                 console.log(res.data)
    //                 const displayname = res.data.display_name;
    //                 user.setDisplayName(displayname);
    //                 user.update({displayName: displayname});
    //             })

    //             axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
    //                 method: "GET",
    //                 headers: {
    //                     Accept: "application/json",
    //                     "Content-Type": "application/json",
    //                     Authorization: "Bearer " + token,
    //                 },
    //             })
    //             .then(res => {
    //                 const tracks = res.data.items;
    //                 user.setTopTracksData(tracks);
    //                 // console.log(tracks)
    //             })
    //             console.log("here",user)
    //             setUser(user);
    //             navigation.navigate('TabLayout');

    //         } catch (error) {
    //             console.error('Error in useEffect: ', error);
    //         }
    //     } 
    
    // }, [token, navigation]);



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


//alternative axios all with axios spread:
                // axios.all([
                //     axios("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
                //         method: "GET",
                //         headers: {
                //             Accept: "application/json",
                //             "Content-Type": "application/json",
                //             Authorization: "Bearer " + token,
                //         },
                //     }),
                //     axios('https://api.spotify.com/v1/me', {
                //         method: 'GET',
                //         headers: {
                //             Accept: "application/json",
                //             "Content-Type": "application/json",
                //             Authorization: "Bearer " + token,
                //         },
                //     }),
                //     axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                //         method: "GET",
                //         headers: {
                //             Accept: "application/json",
                //             "Content-Type": "application/json",
                //             Authorization: "Bearer " + token,
                //         },
                //     })
                // ])
                // .then(axios.spread((artistResponse, displayNameResponse, TopTracksResponse) => {
                //     const names = artistResponse.data.items.map(artist => artist.name); 
                //         user.setArtists(names);
                //         console.log(artistResponse.data.items);
                //         console.log(user.artists);
                //         console.log(names);

                //     const genre = artistResponse.data.items.flatMap(user => user.genres);
                //         const uniqueGenres = [...new Set(genre)];
                //         user.setGenres(uniqueGenres);
                //         console.log(genre);
                //         console.log(uniqueGenres);

                //     console.log(artistNames);
                //     user.update({topArtists: names, genres: genre});



                //     console.log(displayNameResponse.data)
                //     const displayname = displayNameResponse.data.display_name;
                //     user.setDisplayName(displayname);
                //     user.update({displayName: displayName});



                //     const tracks = TopTracksResponse.data.items;
                //     user.setTopTracksData(tracks);

                // }))




//------------------------------------
    // var app = express();

    // app.get('/login', function(req, res) {

    //     var state = generateRandomString(16);
    //     var scope = 'user-read-private user-read-email';
    
    //     res.redirect('https://accounts.spotify.com/authorize?' +
    //       querystring.stringify({
    //         response_type: 'code',
    //         client_id: client_id,
    //         scope: scope,
    //         redirect_uri: redirect_uri,
    //         state: state
    //       }));
    //   });
    // const [request, response, promptAsync] = AuthSession.useAuthRequest(
    //     {
    //       clientId,
    //       redirectUri,
    //       scopes: ['user-top-read'],
    //       responseType: 'code',
    //       usePKCE: false,
    
    //     },
    //     discovery
    // );
    
    //   useEffect(() => {
    //     if (response?.type === 'success') {
    //         console.log(response)
    //       const { code } = response.params;
    //       fetch('http://localhost:3000/callback', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ code }),
    //       })
    //         // .then(r => console.log(r))
    //         .then((res) => JSON.parse(JSON.stringify(res)))
    //         .then((data) => {
    //           console.log('Access Token:', data.access_token);
    //           // Use the access token to fetch user's top artists
    //         })
    //         // .then(data => setToken(data.access_token))
    //         .catch((error) => console.error('Error exchanging code' , error));
    //     }
    //   }, [response]);

    //   useEffect(() => {
    //     if(token) {
    //         console.log("yes")
    //         axios("https://api.spotify.com/v1/me/top/artists?time_range=medium_term", {
    //             method: 'GET', 
    //             headers: {
    //                 Accept: "application/json",
    //                 "Content-Type": "application/json",
    //                 Authorization: "Bearer " + token,
    //               },
    //             })
    //             .then((response) => console.log(response))

                
    //         }
    //     })



//--------------
    // const generateRandomString = (length) => {
    //     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     const values = Crypto.getRandomValues(new Uint8Array(length));
    //     const result = values.reduce((acc, x) => acc + possible[x % possible.length], "");
    //     console.log("-------" + result);
    //     return result;
    // }


    // const generateRandomString = (length) => {
    //     const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     const values = Crypto.getRandomBytes(length);
    //     const result = Array.from(values).map((val) => possible[val % possible.length]).join('');
    //     return result;
    // };

    // const sha256 = async (plain) => {
    //     const encoder = new TextEncoder()
    //     const data = encoder.encode(plain)
    //     return await Crypto.digestStringAsync(
    //         Crypto.CryptoDigestAlgorithm.SHA256,
    //         String.fromCharCode(...data)
    //     );
    //     // return await crypto.subtle.digest('SHA-256', data)
    //     //  return await Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data)
    // }

    // function base64UrlEncode(input) {
    //     return btoa(String.fromCharCode.apply(null, new Uint8Array(input)))
    //     .replace(/\+/g, '-')
    //     .replace(/\//g, '_')
    //     .replace(/=+$/, '');
    // }
 
    // const codeVerifier = generateRandomString(128);
    // const hashed = async () => {
    //     return await sha256(codeVerifier);
    // }
    // console.log(hashed);

    // const codeChallenge = base64UrlEncode(hashed);

    // const [request, response, promptAsync] = AuthSession.useAuthRequest(
    //     {
    //     clientId,
    //     // clientSecret,
    //     redirectUri: 'SpotMatch://callback',
    //     scopes: ['user-top-read'], 
    //     extraParams: {
    //         show_dialog: 'true',
    //     },
    //     responseType: AuthSession.ResponseType.Code,
    //     usePKCE: true,
    //     codeChallengeMethod: 'S256',
    //     codeChallenge: codeChallenge,
    //     },
    //     discovery
    // ); 

    // useEffect(() => {
    //     if (response?.type === 'success') {
    //       const { code } = response.params;
    //       exchangeCodeForToken(code, codeVerifier);
    //     } else if (response?.type === 'error') {
    //       console.log(response.error);
    //     }
    //   }, [response]);


    // async function exchangeCodeForToken(code, verifier) {
    //     const params = new URLSearchParams();
    //     params.append('grant_type', 'authorization_code');
    //     params.append('code', code);
    //     params.append('redirect_uri', 'SpotMatch://callback');
    //     params.append('client_id', clientId);
    //     params.append('code_verifier', verifier);


    //     const response = await fetch(discovery.tokenEndpoint, {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: params.toString()
    //     });
    //     const data = await response.json();
    //     console.log(data); 

    // }

    // return (
    //     <View style={styles.container}>
    //         <Button type='primary' size='m' text="Login to Spotify" onPress={() => promptAsync()} />
    //     </View>
    // );


// --------------




// const exchangeCodeForToken = async (code) => {
//     const response = await fetch(discovery.tokenEndpoint, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             grant_type: 'authorization_code',
//             code: code,
//             redirect_uri: 'SpotMatch://callback',
//             client_id: '89d33611962f42ecb9e982ee2b879bb8',
//             client_secret: 'e6be59a7c4ad417b8bb5de11deb8fbd3', // Ensure your client secret is securely managed
//             code_verifier: codeVerifier // Now including the code verifier
//         }).toString()
//     });
//     const data = await response.json();
//     console.log(data);
// }

