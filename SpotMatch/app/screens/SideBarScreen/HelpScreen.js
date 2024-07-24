import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FIREBASE_AUTH } from '@/firebase';

const faqs = [
  {
    question: "How do I change my password?",
    answer: "If you want to change your password, click on the 'Change Password' link on the Settings page  in the side bar and follow the instructions to reset your password.",
  },
  {
    question: "How do I delete my account?",
    answer: "To delete your account, go to the side bar and select 'Delete Account'. Please note that this action is irreversible and all your data will be permanently deleted.",
  },
  {
    question: "How do I edit my profile?",
    answer: "To edit your profile, go to 'Profile', click on the 'Edit' button, and update your information. Don't forget to save your changes!",
  },
  {
    question: "How do I match with someone?",
    answer: "You can match with someone by liking their profile on the Match tab. If they like you back, it's a match and you can start messaging each other.",
  },
  {
    question: "How do I send a message?",
    answer: "Once you've matched with someone, go to your 'Chats' tab, select the person you want to message, and type your message in the chat box.",
  },
  {
    question: "Is my personal information safe?",
    answer: "Yes, we take your privacy seriously and use advanced security measures to protect your personal information. Please refer to our Privacy Policy for more details.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact customer support by sending an email to Charlene Teoh (e1297771@u.nus.edu.sg) or Vera Koh (e1138412@u.nus.edu) and our support team will get back to you as soon as possible.",
  }
];

const Help = () => {
  const [expanded, setExpanded] = useState({});

  const handlePress = (index) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

    return (
    <ScrollView style={styles.container}>
     
      
      <Text style={styles.subHeader}>FAQs</Text>
      <View style={styles.faqContainer}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            {faq.category && <Text style={styles.category}>{faq.category}</Text>}
            <TouchableOpacity onPress={() => handlePress(index)} style={styles.questionContainer}>
              <Text style={styles.question}>{faq.question}</Text>
              <MaterialIcons
                name={expanded[index] ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
            {expanded[index] && <Text style={styles.answer}>{faq.answer}</Text>}
          </View>
        ))}
      </View>
      
      <Text style={styles.contactHeader}>Contact Us:</Text>
      <View style={styles.contactContainer}>
        <TouchableOpacity onPress={() => handleEmailPress('e1297771@u.nus.edu.sg')}>
          <Text style={styles.contactText}>Charlene Teoh</Text>
          <Text style={[styles.emailText, styles.emailSpacing]}>e1297771@u.nus.edu.sg</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEmailPress('e1138412@u.nus.edu')}>
          <Text style={styles.contactText}>Vera Koh</Text>
          <Text style={styles.emailText}>e1138412@u.nus.edu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAF4EC',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 10,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  question: {
    fontSize: 16,
    fontWeight: 'regular',
    textDecorationLine: 'underline',
  },
  answer: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'justify',
  },
  contactHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  contactContainer: {
    
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#E6F2F4',
  },
  contactText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
  emailSpacing: {
    marginBottom: 10,
},
});

export default Help;

