import { Text, TextInput, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Button from '../../components/navigation/Button';
import {FIREBASE_AUTH} from '../../firebase';
import { createUserWithEmailAndPassword , signInWithEmailAndPassword} from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);  
      alert('Check your emails!')
    } catch (error) {
      console.log(error);
      alert('Sign Up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);  
    } catch (error) {
      console.log(error);
      alert('Login failed: ' + error.message);
    } finally {
      setLoading(false);
    }
    
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >
      <Text style= {styles.login}>SpotMatch</Text>
      <View style= {styles.inputContainer}>
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
          <Button type='primary' size='m' text='Login' onPress={handleLogin} />
            <Text style= {{fontSize: 15, marginTop: 12, fontWeight: '400', color:'gray'}}>New to SpotMatch?</Text>
            <Button type='secondary' size='m' text='Sign Up' onPress={handleSignUp} />
        </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  login: {
    marginTop: '5px',
    color: '#accafc',
    fontSize: '24px',
    fontWeight: 'bold',
  },

  inputContainer: {
    width: '80%',
    marginTop: 10,

  },

  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#accafc',
  },

  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,

  },







})