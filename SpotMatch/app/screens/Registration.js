import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../firebase';
import Button from '../../components/navigation/Button';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { usersRef } from '../../firebase';
import { useNavigation } from '@react-navigation/core';
import { addDoc } from 'firebase/firestore';

const Registration = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');

    const auth = FIREBASE_AUTH;
  
    const handleSignUp = async () => {
      setLoading(true);
      try {
        const response = await createUserWithEmailAndPassword(auth, email, password);
        console.log(response);  
        if(response.user) {
            let doc = await addDoc(usersRef, {
                    firstName,
                    lastName,
                    email,
                    userId: response.user.uid
                
            });
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

export default Registration

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