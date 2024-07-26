import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../../../components/navigation/Button';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import { useNavigation, useRoute } from '@react-navigation/core';
import { UserContext } from '../../UserContext';
import { getToken, removeToken, storeToken } from '../../User';
import Feather from 'react-native-vector-icons/Feather';


const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const clientId = '796b139564514f198f8511f8b260ff4b';
// const clientId = '894050794daa4a568ee64d6a083cf2de';
const redirectUri = 'spotmatch://callback';
// const clientId = '618f2ff3cc724ed782719b1df8ceabda';
// const redirectUri = 'smatch://callback';

const SpotifyAuthScreen = ({route}) => {
    const navigation = useNavigation();
    const { firstName, lastName, email, password, birthdate, age } = route.params;

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
            extraParams: {
                show_dialog: 'true'
            }
        },
        discovery
    );

    useEffect(() => {
        console.log("response: ", response)
        const fetchData = async () => {
          console.log("came in access.js fetchData")
          
          if (response && response?.type === "success") {
            if(await getToken()) {
                console.log("there was a previous token...")
                await removeToken();
                const { access_token, expires_in } = response.params;
                console.log("response: ", response)
                console.log("response params: ", response.params)
                console.log("access_token: ", access_token)
                await storeToken(access_token, expires_in);
                console.log("the new token:")
                const token = await getToken();
                if (token) {
                    navigation.navigate("WelcomeScreen", { firstName, lastName, email, password, birthdate, age });
                }
            } else {
                const { access_token, expires_in } = response.params;
                console.log("response: ", response)
                console.log("response params: ", response.params)
                console.log("access_token: ",access_token)
                await storeToken(access_token, expires_in);
                const token = await getToken();
                if (token) {
                    navigation.navigate("WelcomeScreen", { firstName, lastName, email, password, birthdate, age });
                }
            }
        } else if (response?.type === "cancel") {
          alert("Please continue to sign into Spotify and grant us access")
        } else if (response && response?.type !== "success") {
          alert("Unsuccessful! Please try again.")
        }
      }
      fetchData();
    
      }, [response]);

    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather name="chevron-left" size={24} color="black" />
            </TouchableOpacity>
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
