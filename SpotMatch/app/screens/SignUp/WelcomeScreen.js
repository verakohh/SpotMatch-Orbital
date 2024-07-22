import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../../components/navigation/Button';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { useNavigation, useRoute } from '@react-navigation/core';
import { UserContext } from '../../UserContext';
import { storeToken } from '../../User';

const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientId = '89d33611962f42ecb9e982ee2b879bb8';
const redirectUri = 'spotmatch://callback';

const SpotifyAuthScreen = () => {
    const { user, setUser, token, setToken } = useContext(UserContext);
    const navigation = useNavigation();
    const route = useRoute();
    const { firstName, lastName, email, password, birthdate } = route.params;

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId,
            redirectUri,
            scopes: [
                'user-top-read',
                'user-read-private',
                'user-read-email',
                'user-modify-playback-state',
                'user-read-playback-state',
                'playlist-modify-public',
                'playlist-modify-private'
            ],
            usePKCE: false,
            responseType: ResponseType.Token,
        },
        discovery
    );

    useEffect(() => {
        if (response?.type === "success") {
            const { access_token, expires_in } = response.params;
            storeToken(access_token, expires_in);
            setToken(access_token);
            navigation.navigate("WelcomeScreen", { firstName, lastName, email, birthdate });
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Connect your Spotify account to start matching!
            </Text>
            <Button
                disabled={!request}
                type='primary'
                size='m'
                text="Connect my Spotify account"
                onPress={() => {
                    promptAsync();
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'space-evenly', 
        alignItems: 'center',
    },

    text: {  
        fontSize: 25,      
        fontWeight: '400', 
        textAlign: 'left',
        fontFamily: 'Verdana',
        color: '#212e37',      
        marginBottom: 0,
        paddingHorizontal: 40   
    },
});

export default SpotifyAuthScreen;
