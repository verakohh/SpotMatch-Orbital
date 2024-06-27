// import React, { createContext, useContext, useState, useReducer, useEffect, useRef } from 'react';
// import { setDoc } from 'firebase/firestore';

// const UserContext = createContext();
// const initialState = {userId: null, docRef: null};


// function userReducer(state, action) {
//   switch(action.type) {
//     case 'SET': 
   
//       return {
//         ...state,
//         userId: action.payload.userId,
//         docRef: action.payload.docRef,
//       };
     
//       default:
//         return state;
//     }
// };

// export const UserProvider = ({ children }) => {
  
//   // const [userId, setUserId] = useState(null);
//   // const [docRef, setDocRef] = useState(null);

//   const [state, dispatch] = useReducer(userReducer, initialState);
//   const docRef = useRef(null);
  
//   // useEffect(() => {
//   //   console.log("set id: ", state.userId)
//   //   console.log("set docRef: ", state.docRef)
//   // }, [state.userId])
  
//   const setUserInfo = (userId, ref) => {
   
//     dispatch({
//       type: 'SET',
//       payload: {userId, ref},
//     });
//       // setUserId(id);
//       // console.log(id); 

//       // setDocRef(ref);
//       // console.log(ref);
      
//   };

//   const update = async (data) => {
    
//       try {
//         await setDoc(state.docRef, data, { merge: true });
//         console.log("Document updated successfully");
//       } catch (error) {
//         console.error("Error updating document: ", error);
//       }
//     // } else {
//     //   console.error("No user docRef");
//     // }
//   };


//   return (
//     <UserContext.Provider value={{ ...state, setUserInfo, update }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // export const update = data => { if (docRef) {setDoc(docRef, data , {merge: true});} 
// //                                 else { console.error("No user docRef"); } } 

// export const useUserInfo = () => useContext(UserContext);

//----------------------------------------------
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { setDoc } from 'firebase/firestore';


export const UserContext = createContext({});
// const initialState = {user: {}};
// const userReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_USER':
//       return {
//         ...state,
//         user: action.payload.user,

//       };
//     default:
//       return state;
//   }
// };

// export const UserProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(userReducer, initialState);

//   useEffect(() => {
//     console.log('User set: ', state.user);
    
//     // console.log('User ID set: ', state.userId);
//     // console.log('Document Reference set: ', state.docRef);
//   }, [state.user]);

//   const setUserInfo = (user) => {
//     dispatch({
//       type: 'SET_USER',
//       payload: {user},
//     });
//   };

//   const update = async (data) => {
//     if (state.docRef) {
//       try {
//         await setDoc(state.docRef, data, { merge: true });
//         console.log('Document updated successfully');
//       } catch (error) {
//         console.error('Error updating document: ', error);
//       }
//     } else {
//       console.error('No user docRef');
//     }
//   };

//   return (
//     <UserContext.Provider value={{ ...state, setUserInfo }}>
//       {children}
//     </UserContext.Provider>
//   );
// };


