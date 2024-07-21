import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class User {
  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.docRefPath = `users/${email}`;
    this.docRef = this.docRefPath ? doc(db, this.docRefPath) : null;
  }

  setArtists(artists) {
    this.artists = artists;
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

  setAge(age) {
    this.age = age;
  }
  
  setImgUrl(url) {
    this.imgUrl = url;
  }

  setBirthdate(date) {
    this.birthdate = date;
  }

  setRequestedBy(users) {
    this.requestedBy = users;
  }

  setMatched(users) {
    this.matched = users;
  }

  setSentRequest(user) {
    this.sentRequest = user;
  }

  setRejected(user) {
    this.rejected = user;
  }

  setDismissed(user) {
    this.dismissed = user;
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

export const removeUser = async () => {
  await AsyncStorage.removeItem('user');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('tokenExpiration');
};

export const storeUser = async user => {
  const stringified = JSON.stringify(user);
  await AsyncStorage.setItem('user', stringified);
};

export const storeToken = async (token, expiresIn) => {
  const expirationTime = new Date().getTime() + expiresIn * 1000;
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('tokenExpiration', expirationTime.toString());
  } catch (error) {
    console.error('Error storing token', error);
  }
};

export const getUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem('user');
    if (userJson) {
      const userData = JSON.parse(userJson);
      const user = new User(userData.firstName, userData.lastName, userData.email);
      user.setArtists(userData.artists);
      user.setGenres(userData.genres);
      user.setDisplayName(userData.displayName);
      user.setTopTracksData(userData.tracks);
      return user.userInstance();
    }
  } catch (error) {
    console.error("Failed to load user: ", error);
  }
};

export const getToken = async () => {
  try {
    const tokenJson = await AsyncStorage.getItem('token');
    return tokenJson;
  } catch (error) {
    console.error("Failed to load token: ", error);
  }
};

export const getTokenExpiration = async () => {
  try {
    const expirationJson = await AsyncStorage.getItem('tokenExpiration');
    return expirationJson;
  } catch (error) {
    console.error("Failed to load token expiration: ", error);
  }
};

export const getEmail = async () => {
  try {
    const emailJson = await AsyncStorage.getItem('email');
    return emailJson;
  } catch (error) {
    console.error("Failed to load email: ", error);
  }
};

export const getSubscription = async () => {
  try {
    const subsJson = await AsyncStorage.getItem('subscription');
    return subsJson;
  } catch (error) {
    console.error("Failed to load subscription: ", error);
  }
};
