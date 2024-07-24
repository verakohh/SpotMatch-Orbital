import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const NavigationTab = ({ state, descriptors, navigation }) => {
  const tabs = [
    { name: "Match", icon: "heart", route: "Match" },
    { name: "Discover", icon: "search", route: "Discover" },
    { name: "Chat", icon: "message-circle", route: "Chat" }, // Use "Chat" to navigate to the Chat tab
    { name: "Events", icon: "music", route: "Events" },
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.route)}
            style={styles.tab}
          >
            <Feather name={tab.icon} size={24} color={isFocused ? '#3F78D8' : 'black'} style={styles.icon} />
            <Text style={{ color: isFocused ? '#3F78D8' : 'black' }}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 5,
    height: 60,
    backgroundColor: '#FAF4EC',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 5,
  },
});

export default NavigationTab;
