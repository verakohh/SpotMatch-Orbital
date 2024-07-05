import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState} from 'react'
import { FIREBASE_AUTH, db } from '../../firebase';
import Button from '../../components/navigation/Button';
import { createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { ref, set } from '../../firebase';
import { useNavigation } from '@react-navigation/core';
import { doc, addDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserContext } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User , {storeEmail, storeUser} from '../User';
import GetSpotifyData from '../../components/GetSpotifyData';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';



let docRef;

const LabeledInput = ({ label, value, onChangeText, placeholder, secureTextEntry, editable }) => (
  <View style={styles.labeledInputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      editable={editable}
    />
  </View>
);

const Registration = () => {
    // const { setUserInfo } = useUserInfo();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const[firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [birthdate, setBirthdate] = useState('');
    const [age, setAge] = useState(0);
    // const[docRef, setDocRef] = useState('');
    // const[userId, setUserId] = useState("");
   
  

    const auth = FIREBASE_AUTH;
  

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
              navigation.navigate("SideBar")

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

    const handleSignUpWithAge = () => {
      if (birthdate) {
          handleSignUp();
      } else {
          alert('Please select your birthdate to calculate age.');
      }
  };

  //   useEffect(() => {
  //     if (age > 0 && birthdate) {
  //         handleSignUp();
  //     }
  // }, [age, birthdate]);
  
    const navigation= useNavigation();
    

    const showDatePicker = () => setDatePickerVisible(true);
    const hideDatePicker = () => setDatePickerVisible(false);



    const handleConfirm = (date) => {
      setBirthdate(date);
      const today = new Date();
      const birthDate = new Date(date);

      let years = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          years--;
      }
      setAge(years);
      console.log(birthdate);
      console.log(age);
      hideDatePicker();
      
  };

    // useEffect (()=> {
    //   const today = new Date();
    //   const birthDate = new Date(birthdate);

    //   let years = today.getFullYear() - birthDate.getFullYear();
    //   const monthDiff = today.getMonth() - birthDate.getMonth();
    //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    //       years--;
    //   }
    //   console.log(birthdate)
    //   console.log(birthDate)
    //   console.log(years);
    //   setAge(years);
    //   console.log(age);

    // }, [birthdate])
    // const calculateAge = () => {
    //   const today = new Date();
    //   const birthDate = new Date(birthdate);

    //   let years = today.getFullYear() - birthDate.getFullYear();
    //   const monthDiff = today.getMonth() - birthDate.getMonth();
    //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    //       years--;
    //   }
    //   console.log(birthdate)
    //   console.log(birthDate)
    //   console.log(years);
    //   setAge(years);
    //   console.log(age)

    // };
    

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior='padding'
        >
          <View style={{height: "20%"}}>
            <Image source={require('../../assets/images/SpotMatch-login.png')} />
          </View>
            <View style ={{alignItems: 'left', width: '100%'}}>
                <Text style={styles.signUpText}>Sign Up</Text>
            </View>
            <View style= {styles.inputContainer}>
            <LabeledInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          placeholder="First Name"
        />
        <LabeledInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          placeholder="Last Name"
        />
        <LabeledInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
        <LabeledInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TouchableOpacity onPress={showDatePicker}>
          <View pointerEvents="none">
            <LabeledInput
              label="Birthdate"
              value={birthdate ? moment(birthdate).format('DD MMMM, YYYY') : ''}
              placeholder="Select your birthdate"
              editable={false}
            />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode='date'
              date={birthdate ? new Date(birthdate) : new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              maximumDate={new Date(moment())}
            />
          </View>
          </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button type='secondary' size='m' text='Sign Up' onPress={handleSignUpWithAge} />
      </View>
      <View style={{ flex: 1, flexDirection: 'row', marginVertical: 25 }}>
        <Text>Already have one?  </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#2196F3', fontSize: 15 }}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Registration

// export const refDoc = docRef;
// export const update = data => { if (docRef) {setDoc(docRef, data , {merge: true});} 
//                         else { console.error("No user docRef"); } } 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: '80%',
  },
  labeledInputContainer: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 5,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#accafc',
    shadowOffset: { width: 5, height: 8 },
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
    fontSize: 26,
    fontWeight: '400',
    fontFamily: 'Verdana',
    color: '#212e37',
    marginBottom: 8,
    marginTop: 22,
    paddingHorizontal: 42,
  },
});