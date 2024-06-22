import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const NavigationTab = ({ state, descriptors, navigation }) => {
    const tabs = [
        { name: "Match", icon: "heart", route: "Match" },
        { name: "Discover", icon: "search", route: "Discover" },
        { name: "Chat", icon: "message-circle", route: "Chat" },
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
        //</ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 84,
        justifyContent: 'center',
        boxShadow: '0px -0.5px 0px rgba(0, 0, 0, 0.1)',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    tab: {
        alignItems: 'center',
        padding: 10,
    },
});

export default NavigationTab;
