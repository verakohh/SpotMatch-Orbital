import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import GigsScreen from './Events/GigsScreen';
import ConcertsScreen from './Events/ConcertsScreen';
import ActivitiesScreen from './Events/ActivitiesScreen';

const Tab = createMaterialTopTabNavigator();

const EventsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: 'transparent', height: 0 },
          tabBarStyle: { backgroundColor: '#FAF4EC', shadowOpacity: 0, elevation: 0 },
          tabBarPressColor: '#D3D3D3',
          tabBarItemStyle: { borderRadius: 20, marginHorizontal: 0, height: 50 },
          tabBarScrollEnabled: false,
          tabBarInactiveTintColor: '#212E37',
          tabBarActiveTintColor: '#FAF4EC',
        }}
      >
        <Tab.Screen 
          name="Concerts" 
          component={ConcertsScreen} 
          options={{
            tabBarLabel: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>Concerts</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Local Gigs" 
          component={GigsScreen} 
          options={{
            tabBarLabel: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>Local Gigs</Text>
              </View>
            ),
          }}
        />
        <Tab.Screen 
          name="Activities" 
          component={ActivitiesScreen} 
          options={{
            tabBarLabel: ({ focused }) => (
              <View style={focused ? styles.activeTab : styles.inactiveTab}>
                <Text style={focused ? styles.activeTabText : styles.inactiveTabText}>Activities</Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
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
    paddingHorizontal: 20, // Increase the horizontal padding for a longer tab
    borderRadius: 20,
  },
  inactiveTab: {
    backgroundColor: '#BAD6EB',
    paddingVertical: 7,
    paddingHorizontal: 20, // Increase the horizontal padding for a longer tab
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

export default EventsScreen;
