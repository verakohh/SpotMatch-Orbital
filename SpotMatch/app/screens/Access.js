import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Button from '../../components/navigation/Button';
import { ResponseType, useAuthRequest} from 'expo-auth-session';
import Login from './Login';
import { useEffect, useState, useContext } from 'react';
import React from 'react';
import axios from 'axios';
import { refDoc , update} from './Registration';
import { useNavigation } from '@react-navigation/core';
import { useUserInfo, UserContext } from '../UserContext';
import { ref } from '../../firebase';
import { getToken, removeToken, storeToken } from '../User';



const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
  };
 
const clientId = '89d33611962f42ecb9e982ee2b879bb8';
const redirectUri = 'spotmatch://callback';


export default function Access() {

    // const [token, setToken] = useState("");
    // const { user, setUser, token, setToken } = useContext(UserContext);
    // const [artistNames, setArtistNames] = useState([""]);
    // const [genres, setGenres] = useState([""]);
    // const [displayName, setDisplayName] = useState("");
    // const [topTracksData, setTopTracksData] = useState("");


    const navigation= useNavigation();
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
          usePKCE: false,
          responseType: ResponseType.Token,
        },
        discovery
    );
    
    useEffect( () => {
      console.log("response: ", response)
        const fetchData = async () => {
          console.log("came in access.js fetchData")
          
          if (response && response?.type === "success") {
            if(await getToken()) {
              console.log("there was a previous token...")
              await removeToken();
              const { access_token, expires_in } = response.params;
              console.log("response: ", response)
              console.log("response params: ", response.params)
              console.log("access_token: ", access_token)
              await storeToken(access_token, expires_in);
              navigation.navigate("Login");
            } else {
              const { access_token, expires_in } = response.params;
              console.log("response: ", response)
              console.log("response params: ", response.params)
              console.log("access_token: ",access_token)
              await storeToken(access_token, expires_in);
              navigation.navigate("Login");
            }
        } else if (response?.type === "cancel") {
          alert("Please continue to sign into Spotify and grant us access")
        } else if (response && response?.type !== "success") {
          alert("Unsuccessful! Please try again.")
        }
      }
      fetchData();
    
      }, [response]);


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
            
            <Text style= {styles.text}>
                Kindly log into your 
                Spotify and follow the instructions 
                to grant us 
                access to the specified data needed for our app to deliver.
                {"\n"}
                {"\n"}
                That way, we can meet 
                your needs in tuning out 
                with a friend! 
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
        {/* <TouchableOpacity onPress={}> 
            <Text style={{color: '#2196F3', fontSize: 15}}>Go Back</Text>
        </TouchableOpacity> */}
          
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
    },

    text: {  
        fontSize: 25,      
        fontWeight: '400', 
        textAlign: 'left',
        fontFamily: 'Verdana',
        color: '#212e37',      
        marginBottom: 0,
        paddingHorizontal: 40   
    },

})


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

