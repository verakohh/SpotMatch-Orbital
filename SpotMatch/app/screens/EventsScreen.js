// app/screens/EventsScreen.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GigsScreen from './Events/GigsScreen'; 
import ConcertsScreen from './Events/ConcertsScreen'; 
import ActivitiesScreen from './Events/ActivitiesScreen'; 

const Tab = createMaterialTopTabNavigator();

const EventsScreen = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Concerts" component={ConcertsScreen} />
      <Tab.Screen name="Local Gigs" component={GigsScreen} /> 
      <Tab.Screen name="Activities" component={ActivitiesScreen} />
    </Tab.Navigator>
  );
};

export default EventsScreen;
