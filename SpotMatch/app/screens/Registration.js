import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, {useContext, useEffect} from 'react'
import { FIREBASE_AUTH, db } from '../../firebase';
import Button from '../../components/navigation/Button';
import { useState } from 'react';
import { createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { ref, set } from '../../firebase';
import { useNavigation } from '@react-navigation/core';
import { doc, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User , {storeEmail, storeUser} from '../User';
import GetSpotifyData from '../../components/GetSpotifyData';


let docRef;

const Registration = () => {
    // const { setUserInfo } = useUserInfo();
    const {user, setUser} = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    // const[docRef, setDocRef] = useState('');
    // const[userId, setUserId] = useState("");
   
  

    const auth = FIREBASE_AUTH;
  
    <GetSpotifyData />

    // useEffect(() => {
    //   localStorage.setItem("user", JSON.stringify(user))
    // }, [user])

    const handleSignUp = async () => {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);  
        if(response.user) {
          const userId = response.user.uid;
          set(email, {
                firstName,
                lastName,
                email,
                userId: response.user.uid
                }
              );

              const docRef = doc(db, 'users', email);
              const docRefPath = `users/${email}`;
              console.log('the ref is: ', docRef)
          
              const newUser = new User(firstName, lastName, email);
              // user = newUser;
              await storeUser(newUser);
              // await storeEmail(email);
              // setUser(newUser);
              console.log("registered user Object : ",newUser);

              // setUserInfo(newUser);

              // const newDocRef = ref(response.user.uid)
          // setUserInfo(userId, newDocRef);


          // setID(response.user.uid);
          // console.log(id);
          
          // console.log('the ref is: ', newDocRef)

          alert('Created Successfully!')
        }
      } catch (error) {
        console.log(error);
        alert('Sign Up failed: ' + error.message);
       

      } finally {
        setLoading(false);
      }
    }
    const navigation= useNavigation();
    

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
            <Image source={require('../../assets/images/SpotMatch-login.png')} />
            <View style ={{alignItems: 'left', width: '100%'}}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </View>
            <View style= {styles.inputContainer}>
                <TextInput
                    value={firstName}
                    onChangeText={text =>setFirstName(text) }
                    placeholder="First Name"
                    style={styles.input}
                /> 

                <TextInput
                    value={lastName}
                    onChangeText={text =>setLastName(text) }
                    placeholder="Last Name"
                    style={styles.input}
                /> 
                <TextInput
                    value={email}
                    onChangeText={text =>setEmail(text) }
                    placeholder="Email"
                    style={styles.input}
                /> 
        
                <TextInput
                    value={password}
                    onChangeText={text => setPassword(text) }
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                /> 
            </View>
        
            {/* button code goes here */}
            <View style= {styles.buttonContainer}>
                <Button type='secondary' size='m' text='Sign Up' onPress={(handleSignUp)} />
            </View>
            <View style = {{flex: 1, flexDirection: 'row', marginVertical: 25}}>
                <Text >Already have one?  </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}> 
                    <Text style={{color: '#2196F3', fontSize: 15}}>Login</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
      
  )
}
// console.log("this is the docRef: ", docRef);
export default Registration

export const refDoc = docRef;
export const update = data => { if (docRef) {setDoc(docRef, data , {merge: true});} 
                        else { console.error("No user docRef"); } } 


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
    
      inputContainer: {
        width: '80%',
      },
    
      input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 15,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#accafc',
        shadowOffset: {width: 5, height: 8},  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 7,
      },
    
      buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    
      },

      signUpText: {
        fontSize: 20,      
        fontWeight: '400', 
        fontFamily: 'Verdana',
        color: '#212e37',      
        marginBottom: 8,
        paddingHorizontal: 42  
      },
})