import { Text, TextInput, Image, View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import Button from '../../components/navigation/Button';
import { FIREBASE_AUTH } from '../../firebase';
import { signInWithEmailAndPassword} from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

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
  const navigation= useNavigation();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior='padding'
    >
      <Image source={require('../../assets/images/SpotMatch-login.png')} />
        <View style ={{alignItems: 'left', width: '100%'}}>
          <Text style={styles.signInText}>Sign In</Text>
        </View>
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
        </View>
        <View style = {{ flex: 1, marginTop: 50, alignItems: 'center', }}> 
          <Text style= {{fontSize: 16, fontWeight: '400', color:'gray', marginBottom: 8,}}>New here?  </Text>
          <Button type= 'secondary' size='m' text='Create Account' onPress={() => navigation.navigate('Registration')} /> 
        </View>
       
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20

  },

  inputContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center'
    

  },

  input: {
    width: '100%',
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

  signInText: {  
    fontSize: 20,      
    fontWeight: '400', 
    fontFamily: 'Verdana',
    color: '#212e37',      
    marginBottom: 8,
    paddingHorizontal: 42   
  },







})