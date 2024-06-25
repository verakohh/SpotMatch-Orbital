//this is for side bar
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MainHeader = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: insets.top,
    }}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Feather name="menu" size={24} />
      </TouchableOpacity>
      {/* Add other icons or components here if needed */}
    </View>
  );
};

export default MainHeader;
