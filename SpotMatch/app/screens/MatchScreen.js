import React, {useEffect, useState, useContext} from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BothMatchScreen from './Matches/BothMatchScreen';
import AllScreen from './Matches/AllScreen';
import InstructionsScreen from './Matches/Instruction';


    const Tab = createMaterialTopTabNavigator();

    const MatchScreen = () => {

    
      return (
        <View style={styles.container}>
          <Tab.Navigator
            screenOptions={{
              swipeEnabled: false, // Disable swipe between tabs
              tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
              tabBarIndicatorStyle: { backgroundColor: 'transparent', height: 0 },
              tabBarStyle: { backgroundColor: '#FAF4EC', shadowOpacity: 0, elevation: 0 },
              tabBarPressColor: '#D3D3D3',
              tabBarItemStyle: { borderRadius: 20, marginHorizontal: 0, height: 50, width: 'auto' },
              tabBarScrollEnabled: true,
              tabBarInactiveTintColor: '#212E37',
              tabBarActiveTintColor: '#FAF4EC',
            }}
          >
            <Tab.Screen 
              name="Instructions" 
              component={InstructionsScreen} 
              options={{
                tabBarLabel: ({ focused }) => (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>Instructions </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen 
              name="by Genre & Artists" 
              component={BothMatchScreen} 
              options={{
                tabBarLabel: ({ focused }) => (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>by Genre & Artists </Text>
                  </View>
                ),
              }}
            />
            <Tab.Screen 
              name="Discover All" 
              component={AllScreen} 
              options={{
                tabBarLabel: ({ focused }) => (
                  <View style={focused ? styles.activeTab : styles.inactiveTab}>
                    <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>Discover All </Text>
                  </View>
                ),
              }}
            />
          </Tab.Navigator>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FAF4EC',
      },
      activeTab: {
        backgroundColor: '#3F78D8',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 20,
      },
      inactiveTab: {
        backgroundColor: '#BAD6EB',
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRadius: 20,
      },
      activeTabText: {
        color: '#FAF4EC',
        fontWeight: '500',
      },
      inactiveTabText: {
        color: '#212E37',
        fontWeight: '400',
      },
    });
    
    export default MatchScreen;
   