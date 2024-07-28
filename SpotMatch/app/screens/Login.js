// import { Text, TextInput, Image, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
// import React, { useState, useContext, useEffect } from 'react';
// import Button from '../../components/navigation/Button';
// import { FIREBASE_AUTH, ref } from '../../firebase';
// import { signInWithEmailAndPassword} from 'firebase/auth';
// import { useNavigation } from '@react-navigation/core';
// import { UserContext } from '../UserContext';
// import { getDoc } from 'firebase/firestore';
// import User, { storeUser, getToken , storeEmail } from '../User';
// import GetSpotifyData  from '../../components/GetSpotifyData';
// import axios from 'axios';




// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const auth = FIREBASE_AUTH;
//   // const {user, setUser, token} = useContext(UserContext);

//   // useEffect(() => {
//   //   async function createUser() {
//   //     const userDoc = ref(email);
//   //     const docSnap = await getDoc(userDoc);
//   //     console.log(docSnap);

//   //     if (docSnap.exists()) {
//   //       const data = docSnap.data()
//   //       console.log("Document data:", data);
//   //       const newUser = new User(data.firstName, data.lastName, data.email, `users/${email}`);
//   //       newUser.setArtists(data.artists);
//   //       newUser.setGenres(data.genres);
//   //       newUser.setDisplayName(data.displayName);
//   //       newUser.setTopTracksData(data.tracks);

//   //       await storeUser(newUser);
       
//   //     }
//   //   }
//   //   createUser();
//   // }, [])
//   // useEffect(() => {
//   //   async function createUser() {
//   //     const userDoc = ref(email);
//   //     const userDocPath = `users/${email}`;
//   //     const docSnap = await getDoc(userDoc);
//   //     console.log(docSnap);

//   //     if (docSnap.exists()) {
//   //       const data = docSnap.data()
//   //       console.log("Document data:", data);
//   //       const newUser = new User(data.firstName, data.lastName, data.email, userDocPath);
//   //       newUser.setArtists(data.artists);
//   //       newUser.setGenres(data.genres);
//   //       newUser.setDisplayName(data.displayName);
//   //       newUser.setTopTracksData(data.tracks);

//   //       await storeUser(newUser);
       
//   //     }
//   //   }
//   //   createUser();
//   // }, [])

//   const handleLogin = async () => {
//     // <GetSpotifyData />
//     setLoading(true);
//     try {
//       const response = await signInWithEmailAndPassword(auth, email, password);
//       // await storeEmail(email);
//       console.log(response); 
      
//       // setUser(get());
//       const userDoc = ref(email);
//       const docSnap = await getDoc(userDoc);
//       console.log(docSnap);

//       if (docSnap.exists()) {
//         const data = docSnap.data()
//         const newUser = new User(data.firstName, data.lastName, data.email);
//         newUser.setArtists(data.topArtists);
//         newUser.setGenres(data.genres);
//         newUser.setDisplayName(data.displayName);
//         newUser.setTopTracksData(data.topTracks); 
//         newUser.setAge(data.age);
//         newUser.setBirthdate(data.birthdate);
//         newUser.setImgUrl(data.imageUrl)
//         newUser.setRequestedBy(data.requestedBy);
//         newUser.setMatched(data.matched);
//         newUser.setSentRequest(data.sentRequest);
//         newUser.setRejected(data.rejected);
//         newUser.setDismissed(data.dismissed);


//         await storeUser(newUser);

//         navigation.navigate("SideBar");
//       } else {
//         alert("Login failed! Try again");
//       }
//     } catch (error) {
//       console.log(error);
//       alert('Login failed: ' + Error);
//     } finally {
//       setLoading(false);
      

//     }
    
//   }
//   const navigation= useNavigation();
//   // const data = GetSpotifyData();
//   // <GetSpotifyData />
  
//   // <GetSpotifyData></GetSpotifyData>


//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior='padding'
//     >
//       <Image source={require('../../assets/images/SpotMatch-login.png')} />
//         <View style ={{alignItems: 'left', width: '100%'}}>
//           <Text style={styles.signInText}>Sign In</Text>
//         </View>
//         <View style= {styles.inputContainer}>
//           <TextInput
//             value={email}
//             onChangeText={text =>setEmail(text) }
//             placeholder="Email"
//             style={styles.input}
//           /> 

//           <TextInput
//             value={password}
//             onChangeText={text => setPassword(text) }
//             placeholder="Password"
//             style={styles.input}
//             secureTextEntry
//           /> 
//         </View>

//           {/* button code goes here */}
//         <View style= {styles.buttonContainer}>
//           <Button type='primary' size='m' text='Login' onPress={handleLogin} />
//         </View>
//         <View style = {{ flex: 1, marginTop: 50, alignItems: 'center', }}> 
//           <Text style= {{fontSize: 16, fontWeight: '400', color:'gray', marginBottom: 8,}}>New here?  </Text>
//           <Button type= 'secondary' size='m' text='Create Account' onPress={() => navigation.navigate('Registration')} /> 
//         </View>
       
//     </KeyboardAvoidingView>
//   );
// };

// export default Login;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     marginTop: 20

//   },

//   inputContainer: {
//     width: '80%',
//     justifyContent: 'center',
//     alignItems: 'center'
    

//   },

//   input: {
//     width: '100%',
//     backgroundColor: 'white',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 15,
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: '#accafc',
//     shadowOffset: {width: 5, height: 8},  
//     shadowColor: '#171717',  
//     shadowOpacity: 0.2,  
//     shadowRadius: 7,
//   },

//   buttonContainer: {
//     width: '60%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 40,

//   },

//   signInText: {  
//     fontSize: 26,      
//     fontWeight: '400', 
//     fontFamily: 'Verdana',
//     color: '#212e37',      
//     marginBottom: 8,
//     paddingHorizontal: 42   
//   },



// })


import React, { useState } from 'react';
import { Text, TextInput, Image, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import Button from '../../components/navigation/Button';
import { FIREBASE_AUTH, ref } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import User, { storeUser, getToken , storeEmail, storeSubscription, getUser } from '../User';
import { getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import qs from 'qs';


export const checkTokenValidity = async (expiration) => {
  if (expiration) {
      try {
      const now = new Date().getTime();
      console.log("now: ", now)
      if (expiration && new Date().getTime() < expiration) {
          console.log("token is okay")
          return true;
      }
      } catch (error) {
          console.error('Error checking token validity', error);
          Alert.alert('Error checking token validity', error);
  
      }
      return false;
  } else {
    Alert.alert("No expiration given!")
  }
}


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase signIn response: ",response);
      console.log("email: ", email)
      const userDoc = ref(email);
      const docSnap = await getDoc(userDoc);
      console.log('Firebase document snapshot:',docSnap);

      if (docSnap.exists()) {
        const data = docSnap.data()
        console.log("data email: ", data.email)
        const newUser = new User(data.firstName, data.lastName, data.email);
        // newUser.setArtists(data.topArtists);
        // newUser.setGenres(data.genres);
        // newUser.setDisplayName(data.displayName);
        // newUser.setTopTracksData(data.topTracks); 
        newUser.setAge(data.age);
        newUser.setBirthdate(data.birthdate);
        // newUser.setImgUrl(data.imageUrl)
        newUser.setRequestedBy(data.requestedBy);
        newUser.setMatched(data.matched);
        newUser.setSentRequest(data.sentRequest);
        newUser.setRejected(data.rejected);
        newUser.setDismissed(data.dismissed);
        

        const subs = data.subscription 
        if (subs) {
          await storeSubscription(data.subscription);
        }
        await storeUser(newUser);

        let token = data.token;
        const expiresIn = data.expiresIn;
        const refreshAccessToken = data.refreshToken;

        if (!await checkTokenValidity(expiresIn)) {
            token = await refreshToken(refreshAccessToken);
        }
        
        if (token) {
            console.log("access token from userDoc at Login: ", token);
            // alert("access token from userDoc at Login: ", token); 
            await axios.get("https://api.spotify.com/v1/me/top/artists", {
                // method: 'GET',
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
                // alert("Artist and genre response:",res)
                // alert("Artist and genre response data:", res.data)
                console.log("Artist and genre response: ",res.data)
                if (res.data && res.data.items && Array.isArray(res.data.items)) {
                    const names = res.data.items.map(artist => artist.name); 
                    newUser.setArtists(names);
                    console.log(newUser.artists);
                    console.log(names);

                    console.log("res data items: ", res.data.items)
                    const genre = res.data.items.flatMap(user => user.genres);
                    const uniqueGenres = [...new Set(genre)];
                    newUser.setGenres(uniqueGenres);
                    console.log(genre); 
                    console.log(uniqueGenres);


                        // console.log(refDoc);
                    
                            // console.log(artistNames);
                    await newUser.update({topArtists: names, genres: uniqueGenres});
                            // user.update({genres: genre}); 
                } else {
                    Alert.alert('Error! Invalid response format ', res.data);
                }
            })       

            await axios('https://api.spotify.com/v1/me', {
                method: 'GET',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            })
            .then(async res => {
                // alert("profile data: ",res.data)

                console.log("profile data: ",res.data)
                const displayname = res.data.display_name;
                newUser.setDisplayName(displayname);

                console.log(res.data.images)
                const imgUrl = res.data.images.map(img => img.url)
                const uniqueUrl = imgUrl[0];
                console.log('this is imgUrl: ', uniqueUrl)
                newUser.setImgUrl(uniqueUrl);

                console.log(res.data.product);
                const productsubs = res.data.product;
                await storeSubscription(productsubs);

                console.log(res.data.id);
                const userId = res.data.id;
                

                await newUser.update({displayName: displayname, imageUrl: uniqueUrl, subscription: productsubs, spotifyId: userId });
            })

            await axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
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
                    newUser.setTopTracksData(topTracks);
                    await newUser.update({ topTracks });
                    console.log(topTracks);
                } else {
                    console.error('Invalid response format: ', res.data);
                    Alert.alert('Error! Invalid response format ', res.data);

                }
            });

                Alert.alert("Success", "Fetched all data successfully!")
                navigation.navigate("SideBar");
        } else {
            Alert.alert("Error!", "No token!")
            return;
        }
        
        
      } else {
        Alert.alert("Error!", "No userDoc!");
      }
    } catch (error) {
      console.log(error);
      if(error.response) {
        console.log("response :", error.response)
        console.log("response data: ", error.response.data)
        if (error.response.status === 403 && error.response.data === "Check settings on developer.spotify.com/dashboard, the user may not be registered.") {
          Alert.alert("Currently you are not allowlisted by SpotMatch yet!", "SpotMatch is a Spotify development mode app where your Spotify email has to be manually granted access to SpotMatch. ")
        }
      } else if (error.request) {
        console.log('No response received:', error.request);
      } 
      Alert.alert("Login failed, check if your email and password are correct! " , error.message );
      console.error('Login failed: ' + error.message + " Check if your email and password are correct!");

    } finally {
      setLoading(false);
    }
  };


  const refreshToken = async (refreshToken) => {
    Alert.alert("Refreshing token!", "Token has expired! Refreshing now..")
    const user = await getUser();
    const docRefPath = `users/${user.email}`;
    console.log("docRefPath: ", docRefPath)
    if (refreshToken) {
      try {
        const data = qs.stringify({
          client_id: '8346e646ff7a44b59b3f91f8a49033cb',
          grant_type: 'refresh_token',
          refresh_token: refreshToken
      
        });
        console.log("data: ", data);
  
        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
          const { access_token, refresh_token, expires_in } = tokenResponse.data;
          console.log("access token: ", access_token)
          console.log("refreshToken: ", refresh_token)
          const expiresIn = new Date().getTime() + expires_in * 1000;
          await user.update({token: access_token, expiresIn: expiresIn, refreshToken: refresh_token});
          const userDocRef = ref(user.email);
          const userDocSnap = await getDoc(userDocRef);
  
          if(userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const accessToken = userData.token;
            if (accessToken && accessToken === access_token) {
                console.log("Refreshed Token is same!")
              console.log("refreshed access token from userDoc: ", accessToken);
              Alert.alert("Success!", "Refreshed access token!");
            } else {
              console.log("Refreshed token not updated!")
              Alert.alert("Error!", "Refreshed token not updated!")
            }
  
          } else {
            Alert.alert("Error!", "No userDoc!")
          }
          
          return access_token;
  
      } catch (error) {
        
        console.error("Error refreshing token:", error);
        Alert.alert("Error!", "Failed to refresh token. Please log in to Spotify and grant access again.");
        navigation.navigate('Access', {docRefPath});
      }
    } else {
      Alert.alert("Unsuccessful!", "No token to refresh! Please log in to Spotify and grant access again.")
      navigation.navigate('Access', {docRefPath});
    }
  }
  

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/SpotMatch-login.png')} style={styles.logo} />
      </View>
      <Text style={styles.tagline}>Tune In, Friend Out</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="email@domain.com"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="password"
          style={styles.input}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button type='primary' size='l' text='Log In' onPress={handleLogin} style={styles.fullWidthButton} />
        <Button
          type='secondary'
          size='l'
          text='New user? Sign up here'
          onPress={() => navigation.navigate('SignUpScreen')}
          style={styles.fullWidthButton}
        />
      </View>
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.orText}>or continue with</Text>
        <View style={styles.separatorLine} />
      </View>
      <TouchableOpacity style={styles.googleButton}>
        <Text style={styles.googleButtonText}>G</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        By clicking continue, you agree to our
        <Text style={styles.linkText}> Terms of Service </Text>
        and
        <Text style={styles.linkText}> Privacy Policy</Text>
      </Text>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: 300,
    height: 80,
    resizeMode: 'contain',
  },
  tagline: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3F78D8',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#accafc',
    shadowOffset: { width: 5, height: 8 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 25,
  },
  fullWidthButton: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DADADA',
  },
  orText: {
    fontSize: 16,
    color: '#212E37',
    marginHorizontal: 10,
  },
  googleButton: {
    backgroundColor: '#FF4B3A',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  footerText: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  linkText: {
    color: '#3F78D8',
    textDecorationLine: 'underline',
  },
});
