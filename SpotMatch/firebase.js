// Import the functions you need from the SDKs you need
import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import { collection, getFirestore, doc, setDoc} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8MXWlCQdF1vXBNh4SbhXTlql_1gkUm6A",
  authDomain: "orbital-athena.firebaseapp.com",
  projectId: "orbital-athena",
  storageBucket: "orbital-athena.appspot.com",
  messagingSenderId: "188382206377",
  appId: "1:188382206377:web:df4b404255b56cba220cb8",
  measurementId: "G-LY658XHFDB"
};

// const analytics = getAnalytics(app);
let app, auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
    
  } catch (error) {
    console.log("Error initializing app: " + error);
  }
} else {
  app = getApp();
  auth = getAuth(app);
  
}

export const FIREBASE_APP = app;
export const db = getFirestore(app);
export const FIREBASE_AUTH = auth;
export const set = (id, data) => { setDoc(doc(db, 'users', id), data)}
export const ref = id => doc(usersColRef, id);
export const usersColRef = collection(db, 'users');
export const chatsColRef = collection(db, 'chats');
