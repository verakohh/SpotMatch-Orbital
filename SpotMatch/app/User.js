import {doc, getDoc, setDoc} from 'firebase/firestore'
import { db, ref } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default class User {

    constructor(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email =email;
        this.docRefPath = `users/${email}`;
        this.docRef = this.docRefPath ? doc(db, this.docRefPath) : null;
        // this.artists = artists;

    }

    setArtists(artists) {
        this.artists = artists;
        // const ref = doc(db, 'users').withConverter(userConverter);
        // await setDoc(ref, new User(""))
    }

    setGenres(genres) {
      this.genres = genres;
    }

    setDisplayName(name) {
      this.displayName = name;
    }

    setTopTracksData(tracks) {
      this.tracks = tracks;
    }

     userInstance() {
      return this;
    }

    async update(data) {
        if (this.docRef) {
          try {
            await setDoc(this.docRef, data, { merge: true });
            console.log("Document updated successfully");
          } catch (error) {
            console.error("Error updating document: ", error);
          }
        } else {
          console.error("No user docRef");
        }
    }
}


const userConverter = {
    toFirestore: (user) => {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            userId: user.userId,
            artists: user.artists

        };
    },
    fromFirestore: (snapshot, options) => {
        const data= snapshot.data(options);
        return new User(data.firstName, data.lastName, data.email, data.userId, data.artists)
    }
};

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
}

export const storeUser = async user => {
  const stringified = JSON.stringify(user);
  await AsyncStorage.setItem('user', stringified, () => console.log('async set user'));
};

export const storeToken = async token => {
  const stringified = JSON.stringify(token);
  await AsyncStorage.setItem('token', token, () => console.log('async set token'));
};

export const storeEmail = async email => {
  const stringified = JSON.stringify(email);
  await AsyncStorage.setItem('email', stringified, () => console.log('async set email'));
};


export const getUser = async () => {
  try{
    console.log('reached getUser')
    const userJson = await AsyncStorage.getItem('user', () => console.log('async got user'));
    console.log("stringified user: ", userJson)
    if(userJson) {
      const userData = JSON.parse(userJson);
      const user = new User(userData.firstName, userData.lastName, userData.email);
      console.log("user object: ", user)
      user.setArtists(userData.artists);
      user.setGenres(userData.genres);
      user.setDisplayName(userData.displayName);
      user.setTopTracksData(userData.tracks);
      return user.userInstance();
    } else {
      console.log('no userJSON');
    }
  } catch (error) {
    console.error("Failed to load user: ", error)
  } 
}

export const getToken = async () => {
  try{
    console.log('reached getToken')
    const tokenJson = await AsyncStorage.getItem('token', () => console.log('async got token'));
    console.log("stringified token: ", tokenJson)
    return tokenJson;
  
  } catch (error) {
    console.error("Failed to load user: ", error)
  } 
}

export const getEmail = async () => {
  try{
    console.log('reached getEmail')
    const emailJson = await AsyncStorage.getItem('email', () => console.log('async got email'));
    console.log("stringified email: ", emailJson)
    return emailJson;
  
  } catch (error) {
    console.error("Failed to load email: ", error)
  } 
}
// export const store = (data) => {
//   const [user, setUser] = useState({});
//   useEffect(() => {
//     localStorage.setUser("storedUser", JSON.stringify(data));
//   }, [user]);
 
// }

// export const getUser = () => {
//   useEffect(() => {
//     JSON.parse(localStorage.getItem("storedUser"));

//   })
// }

