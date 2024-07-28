import React, { useEffect, useContext, useState} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import Button from '../../../components/navigation/Button';
import { useNavigation, useRoute } from '@react-navigation/core';
import User , { storeUser} from '../../User';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, db, ref, set } from '../../../firebase';
import { doc, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';





const WelcomeScreen = ({route}) => {
    const { firstName, lastName, email, password, birthdate, age } = route.params;
    const [loading, setLoading] = useState(false);

    const navigation= useNavigation();
    const auth = FIREBASE_AUTH;


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
                  age,
                  birthdate,
                  userId
                  }
                );
  
                const docRef = doc(db, 'users', email);
                const docRefPath = `users/${email}`;
                console.log('the ref is: ', docRef)
            
                const newUser = new User(firstName, lastName, email, age);
                newUser.setBirthdate(birthdate);
                await storeUser(newUser);
                // await storeEmail(email);
                console.log("registered user Object : ", newUser);

                Alert.alert('Success', 'Created Successfully!');
                navigation.navigate("Access", {docRefPath}
                    // "Access", { firstName, lastName, email, password, birthdate, age }
                );

          }
        } catch (error) {
          console.log(error);
          alert('Sign Up failed: ' + error.message);
         
  
        } finally {
          setLoading(false);
  
        }
      }


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Sign up</Text>
        </View>
        <View style={styles.headerLine} />
        <View style={styles.progressBar}>
          <View style={styles.progress}></View>
          <Text style={styles.progressText}>75%</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Hi there! Welcome to SpotMatch!
            We connect you with people of similar music preferences based on your Spotify activity!
            Ready to start matching?
          </Text>
        </View>
        <Image source={require('../../../assets/images/signup-illustration4.png')} style={styles.image} />
        <View style={styles.bottomButtonContainer}>
          <Button type='primary' size='m' text="Let's get started!" onPress={handleSignUp} style={styles.startButton} />
        </View>
      </View>
  
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#FAF4EC',
        padding: 20,
      },
      loadingContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        paddingTop: 5,
      },
      headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
      },
      backButton: {
        position: 'absolute',
        right: 180,
      },
      headerText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#212E37',
      },
      headerLine: {
        width: '130%',
        height: 1,
        backgroundColor: '#828282',
        marginBottom: 10,
      },
      progressBar: {
        width: '100%',
        height: 20,
        backgroundColor: '#BAD6EB',
        borderRadius: 10,
        position: 'relative',
        marginBottom: 20,
      },
      progress: {
        width: '100%',
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
      messageContainer: {
        backgroundColor: '#212E37',
            padding: 20,
            borderRadius: 10,
            marginBottom: 20,
        },
        messageText: {
            color: '#FFFFFF',
            textAlign: 'center',
            fontSize: 16,
            lineHeight: 24,
        },
        image: {
            width: '100%',
            height: 400,
            resizeMode: 'contain',
            marginTop: 15,
            marginBottom: 60,
        },
        bottomButtonContainer: {
            width: '100%',
            alignItems: 'center',
            position: 'absolute',
            bottom: 10,
        },
        startButton: {
            backgroundColor: '#212E37',
            width: '90%',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
        },
    
});

export default WelcomeScreen;
