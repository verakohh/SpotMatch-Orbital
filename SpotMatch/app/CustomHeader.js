// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Feather } from 'react-native-vector-icons';

// const CustomHeader = ({ title, navigation, isDrawer }) => {
//   return (
//     <View style={styles.headerContainer}>
//       <TouchableOpacity onPress={() => isDrawer ? navigation.openDrawer() : navigation.goBack()}>
//         <Feather name={isDrawer ? "menu" : "chevron-left"} size={24} />
//       </TouchableOpacity>
//       <Text style={styles.headerTitle}>{title}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     height: 60,
//     backgroundColor: '#fff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     flex: 1,
//     marginLeft: -24, // To offset the icon width and center the title
//   },
// });

// export default CustomHeader;
