import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
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
  try {
    await AsyncStorage.removeItem('user', () => console.log("async removed user"));
    console.log("removed the user! ")

  } catch (error) {
    console.error("Failed to remove user: ", error)
    alert("Failed to remove user: ", error)
  }
};

export const removeToken = async () => {
  try {
    const tokenJson = await AsyncStorage.getItem('tokenObj');
    // const tokenExpirationJson = await AsyncStorage.getItem('tokenExpiration');

    await AsyncStorage.removeItem('tokenObj', () => console.log("async removed token Object: ", tokenJson));
    // await AsyncStorage.removeItem('tokenExpiration', () => console.log("async removed tokenExpiration", tokenExpirationJson ));

  } catch (error) {
    console.error("Failed to remove token object: ", error)
    alert("Failed to remove token object: ", error)
  }
};

export const removeSubscription = async () => {
  try {
    await AsyncStorage.removeItem('subscription', () => console.log("async removed subscription"));
  } catch (error) {
    console.error("Failed to remove subscription: ", error)
    alert("Failed to remove subscription: ", error)
  }
};
  

export const storeUser = async user => {
  try {
    if (user) {
      const stringified = JSON.stringify(user);
      await AsyncStorage.setItem('user', stringified, () => console.log("async set user"));
    } else {
      alert("No user object to store")
    }
  } catch (error) {
    console.error("Failed to store user: ", error)
    alert("Failed to store user: ", error)
  }
};

export const storeToken = async (tokenObj) => {
  if (tokenObj.token && tokenObj.expiresIn && tokenObj.refreshToken) {
    const expirationTime = new Date().getTime() + tokenObj.expiresIn * 1000;
    const token = tokenObj.token;
    const refreshToken = tokenObj.refreshToken;
    const expiresIn = expirationTime.toString();
    try {
      const newTokenObj = {token, expiresIn, refreshToken};
      const stringified = JSON.stringify(newTokenObj);
      await AsyncStorage.setItem('tokenObj', stringified, () => console.log("async set token", stringified));
      // await AsyncStorage.setItem('tokenExpiration', expirationTime.toString(), () => console.log("async set tokenExpiration: ", expirationTime.toString()));
    } catch (error) {
      console.error('Error storing token Object', error);
      alert("Failed to store token object: ", error)

    } 
  } else {
    alert("No token object to store")
  }
};


export const storeSubscription = async (subs) => {
  try {
    if (subs) {
      // const stringified = JSON.stringify(subs);
      await AsyncStorage.setItem('subscription', subs, () => console.log('async set subscription'));
    } else {
      alert("No subscription to store")
    }
  } catch (error) {
    console.error('Error storing subscription', error);
    alert("Failed to store subscription: ", error)
  }
};

export const storeEmail = async email => {
  try {
    if (email) {
      // const stringified = JSON.stringify(email);
      await AsyncStorage.setItem('email', email, () => console.log('async set email'));
    } else {
      alert("No email to store")
    }
  } catch (error) {
    console.error('Error storing email', error);
    alert("Failed to store email: ", error)
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
      user.setAge(userData.age);
      user.setBirthdate(userData.birthdate);
      return user.userInstance();
    } else {
      alert("No userJson!")
    }
  } catch (error) {
    console.error("Failed to get user: ", error);
    alert("Failed to get user: ", error)

  }
};

export const getToken = async () => {
  try {
    const tokenJson = await AsyncStorage.getItem('tokenObj', () => console.log('async got token'));
    console.log("token Object got is: ", tokenJson);
    if (tokenJson) {
      const token = JSON.parse(tokenJson);
      console.log("token Object parsed: ", token);
      return token;
    }
    return null;
    } catch (error) {
    console.error("Failed to get token Object: ", error);
    alert("Failed to get token object: ", error)

  }
};

export const checkTokenValidity = async (tokenObj) => {
  // const token = await getToken();
  if (tokenObj) {
    try {
        const expiration = tokenObj.expiresIn;
        const now = new Date().getTime();
        console.log("now: ", now)
        if (expiration && new Date().getTime() < parseInt(expiration)) {
            console.log("token is okay")
            return true;
        }
    } catch (error) {
        console.error('Error checking token validity', error);
        alert('Error checking token validity', error);

    }
    return false;
  } else {
    return false;
  }
};


export const getEmail = async () => {
  try {
    const emailJson = await AsyncStorage.getItem('email', () => console.log("async got email: ", emailJson));
    return emailJson;
  } catch (error) {
    console.error("Failed to get email: ", error);
    alert("Failed to get email: ", error)

  }
};

export const getSubscription = async () => {
  try {
    const subsJson = await AsyncStorage.getItem('subscription', () => console.log("async got subscription: ", subsJson));
    return subsJson;
  } catch (error) {
    console.error("Failed to get subscription: ", error);
    alert("Failed to get subscription: ", error)

  }
};
