import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/navigation/Button';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import { useNavigation, useRoute } from '@react-navigation/core';

const SignUpStep2Screen = () => {
  const [birthdate, setBirthdate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { firstName, lastName, email, password } = route.params;

  const handleConfirm = (date) => {
    setBirthdate(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleNext = () => {
    const age = moment().diff(birthdate, 'years');
    if (!birthdate) {
      Alert.alert('Error', 'Please enter your birthdate.');
      return;
    }
    if (age < 16) {
      Alert.alert('Error', 'You must be a minimum of 16 years of age to have a SpotMatch account.');
      return;
    }
    navigation.navigate('WelcomeScreen', { firstName, lastName, email, password, birthdate, age });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sign up</Text>
      </View>
      <View style={styles.headerLine} />
      <View style={styles.progressBar}>
        <View style={styles.progress}></View>
        <Text style={styles.progressText}>50%</Text>
      </View>
      <Text style={styles.subtitle}>When were you born?</Text>
      <Text style={styles.note}>*You can't change this later!</Text>
      <View style={styles.dateInputContainer}>
        <TextInput
          value={birthdate}
          onFocus={showDatePicker}
          placeholder="YYYY-MM-DD"
          style={styles.input}
        />
        <TouchableOpacity onPress={showDatePicker} style={styles.calendarIcon}>
          <Ionicons name="calendar" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Image source={require('../../../assets/images/signup-illustration2.png')} style={styles.illustration} />
      <View style={styles.buttonContainer}>
        <Button type='primary' size='m' text='Next >' onPress={handleNext} />
      </View>
    </View>
  );
};

export default SignUpStep2Screen;

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
    width: '100%',
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
    width: '50%',
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
    marginBottom: 5,
    color: '#212E37',
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#accafc',
    shadowOffset: { width: 5, height: 8 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  input: {
    flex: 1,
  },
  calendarIcon: {
    marginLeft: 10,
  },
  illustration: {
    width: '300%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 0,
    marginTop: 170,
  },
  buttonContainer: {
    width: '175%',
    alignItems: 'center',
  },
});
