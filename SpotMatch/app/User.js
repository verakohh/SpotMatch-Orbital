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

export const storeSubscription = async (subs) => {
  const stringified = JSON.stringify(subs);
  await AsyncStorage.setItem('subscription', stringified);
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
