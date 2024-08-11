import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserRecScreen from './Discover/UserRecScreen';
import ApiRecScreen from './Discover/ApiRecScreen';

const Tab = createMaterialTopTabNavigator();


export default function DiscoverScreen() {
    return (
      <View style={styles.container}>
        <Tab.Navigator
          screenOptions={{
            swipeEnabled: false,
            tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: 'transparent', height: 0 },
            tabBarStyle: { backgroundColor: '#FAF4EC', shadowOpacity: 0, elevation: 0 },
            tabBarPressColor: '#D3D3D3',
            tabBarItemStyle: { borderRadius: 20, marginHorizontal: 0, height: 60, width: 'auto' },
            tabBarScrollEnabled: false,
            tabBarInactiveTintColor: '#212E37',
            tabBarActiveTintColor: '#FAF4EC',
          }}
        >
          <Tab.Screen
            name="User Recommendations"
            component={UserRecScreen}
            options={{
              tabBarLabel: ({ focused }) => (
                <View style={focused ? styles.activeTab : styles.inactiveTab}>
                  <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>User Recommendations </Text>
                </View>
              ),
            }}
          />
          <Tab.Screen
            name="API Recommendations"
            component={ApiRecScreen}
            options={{
              tabBarLabel: ({ focused }) => (
                <View style={focused ? styles.activeTab : styles.inactiveTab}>
                  <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>API Recommendations </Text>
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FAF4EC',
    },
    activeTab: {
      backgroundColor: '#3F78D8',
      paddingVertical: 10,
      paddingHorizontal: 10, // Increase the horizontal padding for a longer tab
      borderRadius: 20,
      height: '100%',
    },
    inactiveTab: {
      backgroundColor: '#BAD6EB',
      paddingVertical: 10,
      paddingHorizontal: 10, // Increase the horizontal padding for a longer tab
      borderRadius: 20,
      height: '100%',
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
    