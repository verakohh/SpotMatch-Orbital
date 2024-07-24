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
import { Text, TextInput, Image, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import Button from '../../components/navigation/Button';
import { FIREBASE_AUTH, ref } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import User, { storeUser, getToken , storeEmail, storeSubscription } from '../User';
import { getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/core';

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
      console.log(response);
      const userDoc = ref(email);
      const docSnap = await getDoc(userDoc);
      console.log(docSnap);

      if (docSnap.exists()) {
        const data = docSnap.data()
        const newUser = new User(data.firstName, data.lastName, data.email);
        newUser.setArtists(data.topArtists);
        newUser.setGenres(data.genres);
        newUser.setDisplayName(data.displayName);
        newUser.setTopTracksData(data.topTracks); 
        newUser.setAge(data.age);
        newUser.setBirthdate(data.birthdate);
        newUser.setImgUrl(data.imageUrl)
        newUser.setRequestedBy(data.requestedBy);
        newUser.setMatched(data.matched);
        newUser.setSentRequest(data.sentRequest);
        newUser.setRejected(data.rejected);
        newUser.setDismissed(data.dismissed);

        await storeSubscription(data.subscription);
        await storeUser(newUser);

        navigation.navigate("SideBar");
      } else {
        alert("Login failed! Try again");
      }
    } catch (error) {
      console.log(error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
