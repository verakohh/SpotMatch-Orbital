import React, { useEffect, useContext, useState} from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Button from '../../../components/navigation/Button';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { useNavigation, useRoute } from '@react-navigation/core';
import { UserContext } from '../../UserContext';
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
                  userId: response.user.uid
                  }
                );
  
                const docRef = doc(db, 'users', email);
                const docRefPath = `users/${email}`;
                console.log('the ref is: ', docRef)
            
                const newUser = new User(firstName, lastName, email, age);
                newUser.setBirthdate(birthdate);
                // user = newUser;
                await storeUser(newUser);
                // await storeEmail(email);
                // setUser(newUser);
                console.log("registered user Object : ",newUser);

                navigation.navigate("SideBar"
                    // "Access", { firstName, lastName, email, password, birthdate, age }
                );
  
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


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.text}>
                Welcome! 
                {firstName}
            </Text>
            
            <Button type='primary' size='m' text='Tuning in, friending out!' onPress={handleSignUp} />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
    },

    text: {  
        fontSize: 25,      
        fontWeight: '400', 
        textAlign: 'left',
        fontFamily: 'Verdana',
        color: '#212e37',      
        marginBottom: 0,
        paddingHorizontal: 40   
    },
});

export default WelcomeScreen;
