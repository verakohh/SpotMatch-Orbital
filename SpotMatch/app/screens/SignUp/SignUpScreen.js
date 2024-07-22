import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, KeyboardAvoidingView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/navigation/Button';
import { useNavigation } from '@react-navigation/core';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleNext = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    navigation.navigate('SignUpStep2Screen', { firstName, lastName, email, password });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior='padding'>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign up</Text>
      </View>
      <View style={styles.headerLine} />
      <View style={styles.progressBar}>
        <View style={styles.progress}></View>
        <Text style={styles.progressText}>25%</Text>
      </View>
      <Text style={styles.subtitle}>Let's get started!</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={text => setFirstName(text)}
          placeholder="First Name"
          style={styles.input}
        />
        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={text => setLastName(text)}
          placeholder="Last Name"
          style={styles.input}
        />
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Email"
          style={styles.input}
        />
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            placeholder="Password"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.eyeIcon}>
            <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <Text style={styles.inputLabel}>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            placeholder="Confirm Password"
            style={styles.passwordInput}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <Image source={require('../../../assets/images/signup-illustration1.png')} style={styles.illustration} />
      <View style={styles.buttonContainer}>
        <Button type='primary' size='m' text='Next >' onPress={handleNext} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FAF4EC',
    padding: 20,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#212E37',
    marginLeft: 120,
    alignItems: 'center',
  },
  headerLine: {
    width: '130%',
    height: 1,
    backgroundColor: '#000',
    marginBottom: 5,
  },
  progressBar: {
    width: '90%',
    height: 20,
    backgroundColor: '#BAD6EB',
    borderRadius: 10,
    position: 'relative',
    marginBottom: 10,
  },
  progress: {
    width: '25%',
    height: '100%',
    backgroundColor: '#3F78D8',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    color: '#212E37',
    fontWeight: 'semibold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#212E37',
  },
  inputContainer: {
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputLabel: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#accafc',
    shadowOffset: { width: 5, height: 8 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#accafc',
    shadowOffset: { width: 5, height: 8 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  illustration: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  buttonContainer: {
    width: '175%',
    alignItems: 'center',
  },
});
