import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.topSection}>
        <DrawerItem
          label="Profile"
          icon={() => <Feather name="user" size={24} />}
          onPress={() => props.navigation.navigate('Profile')}
          labelStyle={styles.drawerItemLabel} 
        />
        <DrawerItem
          label="Requests"
          icon={() => <Feather name="user-plus" size={24} />}
          onPress={() => props.navigation.navigate('Requests')}
            labelStyle={styles.drawerItemLabel} 

        />
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
    paddingTop: 25, // Adjust this value as needed to move items below the header
  },
  helpItem: {
    marginBottom: 290, // Adding margin to Help item to create space between Help and LogOut
  },
  bottomSection: {
    marginBottom: 30, // Adjust this value to give space between LogOut and DeleteAccount
  },
  drawerItemLabel: {
    fontSize: 18, // Adjust the font size as needed
  },
});

export default CustomDrawerContent;
