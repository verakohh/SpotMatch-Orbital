// //screens/User.js
// import {doc, getDoc, setDoc} from 'firebase/firestore'
// import { db, ref } from '../firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useEffect, useState } from 'react';

// export default class User {

//     constructor(firstName, lastName, email) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.email =email;
//         this.docRefPath = `users/${email}`;
//         this.docRef = this.docRefPath ? doc(db, this.docRefPath) : null;
//         // this.artists = artists;

//     }

//     setArtists(artists) {
//         this.artists = artists;
//         // const ref = doc(db, 'users').withConverter(userConverter);
//         // await setDoc(ref, new User(""))
//     }

//     setGenres(genres) {
//       this.genres = genres;
//     }

//     setDisplayName(name) {
//       this.displayName = name;
//     }

//     setTopTracksData(tracks) {
//       this.tracks = tracks;
//     }

//     setAge(age) {
//       this.age = age;
//     }
    
//     setImgUrl(url) {
//       this.imgUrl = url
//     }

//     setBirthdate(date) {
//       this.birthdate = date;
//     }

//     setRequestedBy(users) {
//       this.requestedBy = users;
//     }

//     setMatched(users) {
//       this.matched = users;
//     }

//     setSentRequest(user) {
//       this.sentRequest = user;
//     }

//     setRejected(user) {
//       this.rejected = user;
//     }

//     setDismissed(user) {
//       this.dismissed = user;
//     }

//      userInstance() {
//       return this;
//     }

//     async update(data) {
//         if (this.docRef) {
//           try {
//             await setDoc(this.docRef, data, { merge: true });
//             console.log("Document updated successfully");
//           } catch (error) {
//             console.error("Error updating document: ", error);
//           }
//         } else {
//           console.error("No user docRef");
//         }
//     }
// }


// const userConverter = {
//     toFirestore: (user) => {
//         return {
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             userId: user.userId,
//             artists: user.artists

//         };
//     },
//     fromFirestore: (snapshot, options) => {
//         const data= snapshot.data(options);
//         return new User(data.firstName, data.lastName, data.email, data.userId, data.artists)
//     }
// };

// export const removeUser = async () => {
//   await AsyncStorage.removeItem('user');
// }

// export const removeToken = async () => {
//   await AsyncStorage.removeItem('token');
//   await AsyncStorage.removeItem('tokenExpiration');
//   console.log("removed token")

// }

// export const removeSubscription = async () => {
//   await AsyncStorage.removeItem('subscription');
// }

// export const storeUser = async user => {
//   const stringified = JSON.stringify(user);
//   await AsyncStorage.setItem('user', stringified, () => console.log('async set user'));
// };

// export const storeToken = async (token, expiresIn) => {
//   const expirationTime = new Date().getTime() + expiresIn * 1000;
//   const stringified = JSON.stringify(token);
//   try {   
//     await AsyncStorage.setItem('token', token, () => console.log('async set token'));
//     await AsyncStorage.setItem('tokenExpiration', expirationTime.toString(), () => console.log('async set tokenExpiration :', expirationTime.toString()));
//   } catch (error) {
//     console.error('Error storing token', error);
//   }
// };

// export const storeEmail = async email => {
//   const stringified = JSON.stringify(email);
//   await AsyncStorage.setItem('email', stringified, () => console.log('async set email'));
// };

// export const storeSubscription = async subs => {
//   const stringified = JSON.stringify(subs);
//   await AsyncStorage.setItem('subscription', stringified, () => console.log('async subscription'))
// }

// export const getUser = async () => {
//   try{
//     console.log('reached getUser')
//     const userJson = await AsyncStorage.getItem('user', () => console.log('async got user'));
//     // console.log("stringified user: ", userJson)
//     if(userJson) {
//       const userData = JSON.parse(userJson);
//       const user = new User(userData.firstName, userData.lastName, userData.email);
//       console.log("user object: ", user)
//       user.setArtists(userData.artists);
//       user.setGenres(userData.genres);
//       user.setDisplayName(userData.displayName);
//       user.setTopTracksData(userData.tracks);
//       return user.userInstance();
//     } else {
//       console.log('no userJSON');
//     }
//   } catch (error) {
//     console.error("Failed to load user: ", error)
//   } 
// }

// export const getToken = async () => {
//   try{
//     console.log('reached getToken')
//     const tokenJson = await AsyncStorage.getItem('token', () => console.log('async got token'));
//     console.log("stringified token: ", tokenJson)
//     return tokenJson;
  
//   } catch (error) {
//     console.error("Failed to load user: ", error)
//   } 
// }

// export const getTokenExpiration = async () => {
//   try{
//     console.log('reached getTokenExpiration')
//     const expirationJson = await AsyncStorage.getItem('tokenExpiration', () => console.log('async got token Expiration'));
//     console.log("stringified token: ", expirationJson)
//     return expirationJson;
  
//   } catch (error) {
//     console.error("Failed to load user: ", error)
//   } 
// }

// export const getEmail = async () => {
//   try{
//     console.log('reached getEmail')
//     const emailJson = await AsyncStorage.getItem('email', () => console.log('async got email'));
//     console.log("stringified email: ", emailJson)
//     return emailJson;
  
//   } catch (error) {
//     console.error("Failed to load email: ", error)
//   } 
// }

// export const getSubscription = async () => {
//   try{
//     console.log('reached getSubscription')
//     const subsJson = await AsyncStorage.getItem('subscription', () => console.log('async got subscription'));
//     console.log("stringified subscription: ", subsJson)
//     return subsJson;
  
//   } catch (error) {
//     console.error("Failed to load subscription: ", error)
//   } 
// }
// // export const store = (data) => {
// //   const [user, setUser] = useState({});
// //   useEffect(() => {
// //     localStorage.setUser("storedUser", JSON.stringify(data));
// //   }, [user]);
 
// // }

// // export const getUser = () => {
// //   useEffect(() => {
// //     JSON.parse(localStorage.getItem("storedUser"));

// //   })
// // }

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import qs from 'qs';
import { useNavigation } from '@react-navigation/core';
// import { refreshToken } from './screens/Access';



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

export const getStoredToken = async () => {
  try {
    const tokenObj = await getToken();
    console.log("token Obj: ", tokenObj)
    if (tokenObj && await checkTokenValidity(tokenObj)) {
      return tokenObj.token;
    } else if (tokenObj && !await checkTokenValidity(tokenObj)) {
      return await refreshToken(tokenObj.refreshToken)
    }
    return null;

  } catch (error) {
    console.error("Failed to get stored token : ", error);

    alert("Failed to get stored Token: ", error)
  }
}

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


export const refreshToken = async (refreshToken) => {
  alert("Token has expired! Refreshing now")
  const navigation = useNavigation();
  if (refreshToken) {
    try {
      const data = qs.stringify({
        client_id: '796b139564514f198f8511f8b260ff4b',
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
        await storeToken({access_token, expires_in, refresh_token});
        
        return access_token;
    } catch (error) {
      console.error("Error refreshing token:", error);
      alert("Failed to refresh token. Please log in again.");
      await removeToken();
      navigation.navigate('Access');
    }
  } else {
    alert("No token to refresh!")
    navigation.navigate('Access');
  }
}
// export const getTokenExpiration = async () => {
//   try {
//     const expirationJson = await AsyncStorage.getItem('tokenExpiration', () => console.log("async got token Expiration: "));
//     if (expirationJson) {
//       return expirationJson;
//     } else {
//       alert("No token Expiration")
//     }
//   } catch (error) {
//     console.error("Failed to get token expiration: ", error);
//     alert("Failed to get token Expiration: ", error)

//   }
// };

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
