// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { Feather } from '@expo/vector-icons';
// import { fetchRequestsCount } from './SideBarScreen/RequestsScreen'; // Adjust the path as needed

// const CustomDrawerContent = (props) => {
//   const [requestsCount, setRequestsCount] = useState(0);

//   useEffect(() => {
//     const fetchCount = async () => {
//       const count = await fetchRequestsCount();
//       setRequestsCount(count);
//     };

//     fetchCount();
//   }, []);

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.topSection}>
//         <DrawerItem
//           label="Profile"
//           icon={() => <Feather name="user" size={24} />}
//           onPress={() => props.navigation.navigate('Profile')}
//           labelStyle={styles.drawerItemLabel}
//         />
//         <View style={styles.requestItemContainer}>
//           <DrawerItem
//             label="Requests"
//             icon={() => <Feather name="user-plus" size={24} />}
//             onPress={() => props.navigation.navigate('Requests')}
//             labelStyle={styles.drawerItemLabel}
//             style={styles.requestItem}
//           />
//           {requestsCount > 0 && (
//             <View style={styles.badgeContainer}>
//               <Text style={styles.badgeText}>{requestsCount}</Text>
//             </View>
//           )}
//         </View>
//         <DrawerItem
//           label="Matches"
//           icon={() => <Feather name="users" size={24} />}
//           onPress={() => props.navigation.navigate('Matches')}
//           labelStyle={styles.drawerItemLabel}
//         />
//         <DrawerItem
//           label="Settings"
//           icon={() => <Feather name="settings" size={24} />}
//           onPress={() => props.navigation.navigate('Settings')}
//           labelStyle={styles.drawerItemLabel}
//         />
//         <DrawerItem
//           label="Help"
//           icon={() => <Feather name="help-circle" size={24} />}
//           onPress={() => props.navigation.navigate('Help')}
//           labelStyle={styles.drawerItemLabel}
//           style={styles.helpItem}
//         />
//       </View>
//       <View style={styles.bottomSection}>
//         <DrawerItem
//           label="Log Out"
//           icon={() => <Feather name="log-out" size={24} />}
//           onPress={() => props.navigation.navigate('Log Out')}
//           labelStyle={styles.drawerItemLabel}
//         />
//         <DrawerItem
//           label="Delete Account"
//           icon={() => <Feather name="trash" size={24} color="red" />}
//           onPress={() => props.navigation.navigate('DeleteAccount')}
//           labelStyle={styles.drawerItemLabel}
//         />
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   topSection: {
//     flex: 1,
//     paddingTop: 25,
//   },
//   helpItem: {
//     marginBottom: 290,
//   },
//   bottomSection: {
//     marginBottom: 30,
//   },
//   drawerItemLabel: {
//     fontSize: 18,
//   },
//   requestItemContainer: {
//     position: 'relative',
//   },
//   requestItem: {
//     paddingRight: 40, // Add padding to prevent overlap
//   },
//   badgeContainer: {
//     position: 'absolute',
//     right: 20,
//     top: '42%',
//     transform: [{ translateY: -5 }],
//     backgroundColor: '#3F78D8',
//     borderRadius: 10,
//     paddingHorizontal: 5,
//   },
//   badgeText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default CustomDrawerContent;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { fetchRequestsCount } from '../../utils/requestUtils'; // Adjust the path as needed
import { getUser } from '../User';
import { onSnapshot } from 'firebase/firestore';

const CustomDrawerContent = (props) => {
  const [requestsCount, setRequestsCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await fetchRequestsCount();
      setRequestsCount(count);
    };

    fetchCount();

    const userListener = async () => {
      const user = await getUser();
      const userDocRef = user.docRef;
      onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          fetchCount();
        }
      });
    };
    userListener();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.topSection}>
        <DrawerItem
          label="Profile"
          icon={() => <Feather name="user" size={24} />}
          onPress={() => props.navigation.navigate('Profile')}
          labelStyle={styles.drawerItemLabel}
        />
        <View style={styles.requestItemContainer}>
          <DrawerItem
            label="Requests"
            icon={() => <Feather name="user-plus" size={24} />}
            onPress={() => props.navigation.navigate('Requests')}
            labelStyle={styles.drawerItemLabel}
            style={styles.requestItem}
          />
          {requestsCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{requestsCount}</Text>
            </View>
          )}
        </View>
        <DrawerItem
          label="Matches"
          icon={() => <Feather name="users" size={24} />}
          onPress={() => props.navigation.navigate('Matches')}
          labelStyle={styles.drawerItemLabel}
        />
        <DrawerItem
          label="Settings"
          icon={() => <Feather name="settings" size={24} />}
          onPress={() => props.navigation.navigate('Settings')}
          labelStyle={styles.drawerItemLabel}
        />
        <DrawerItem
          label="Help"
          icon={() => <Feather name="help-circle" size={24} />}
          onPress={() => props.navigation.navigate('Help')}
          labelStyle={styles.drawerItemLabel}
          style={styles.helpItem}
        />
      </View>
      <View style={styles.bottomSection}>
        <DrawerItem
          label="Log Out"
          icon={() => <Feather name="log-out" size={24} />}
          onPress={() => props.navigation.navigate('Log Out')}
          labelStyle={styles.drawerItemLabel}
        />
        <DrawerItem
          label="Delete Account"
          icon={() => <Feather name="trash" size={24} color="red" />}
          onPress={() => props.navigation.navigate('DeleteAccount')}
          labelStyle={styles.drawerItemLabel}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  topSection: {
    flex: 1,
    paddingTop: 25,
  },
  helpItem: {
    marginBottom: 290,
  },
  bottomSection: {
    marginBottom: 30,
  },
  drawerItemLabel: {
    fontSize: 18,
  },
  requestItemContainer: {
    position: 'relative',
  },
  requestItem: {
    paddingRight: 40, // Add padding to prevent overlap
  },
  badgeContainer: {
    position: 'absolute',
    right: 20,
    top: '42%',
    transform: [{ translateY: -5 }],
    backgroundColor: '#3F78D8',
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
