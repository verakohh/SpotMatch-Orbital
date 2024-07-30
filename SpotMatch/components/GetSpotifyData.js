import { useEffect, useContext, useState } from 'react';
import { getUser, getToken } from '../app/User';
import axios from 'axios';


const GetSpotifyData= () => {
// const {user, token} = useContext(UserContext);
// const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("user");
//     const initialValue = JSON.parse(saved)
//     return initialValue || "";
// })
//---------------
// const [user, setUser] = useState({});
    // setUser(getUser());

// const [token, setToken] = useState("");
// setToken(getToken());
console.log("at get spotifydata ")



    useEffect(() => {
        const token = getToken();
        const user = getUser();
        console.log("at get spotifydata useEffect")
        if (token && user) {
            try {
                console.log('yes')
                axios("https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                })
                .then(res => {
                    if (res.data && res.data.items && Array.isArray(res.data.items)) {
                        console.log("user: ",user)
                        const names = res.data.items.map(artist => artist.name); 
                        user.setArtists(names);
                        console.log(res.data.items);
                        console.log(user.artists);
                        console.log(names);
                        
                        const genre = res.data.items.flatMap(user => user.genres);
                        const uniqueGenres = [...new Set(genre)];
                        user.setGenres(uniqueGenres);
                        console.log(genre); 
                        console.log(uniqueGenres);

                        // console.log(refDoc);
                    
                            // console.log(artistNames);
                        user.update({topArtists: names, genres: genre});
                            // user.update({genres: genre}); 
                        
                    } else {
                        console.error('Invalid response format: ', res.data);
                    }
                })
                // .catch(err => {
                //     console.error('Error fetching top artists: ', err)
                // })

                axios('https://api.spotify.com/v1/me', {
                    method: 'GET',
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                })
                .then(res => {
                    console.log(res.data)
                    const displayname = res.data.display_name;
                    user.setDisplayName(displayname);
                    user.update({displayName: displayname});
                })

                axios("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                    },
                })
                .then(res => {
                    const tracks = res.data.items;
                    user.setTopTracksData(tracks);
                    // console.log(tracks)
                })
                console.log("here",user)
                setUser(user);


            } catch (error) {
                console.error('Error in useEffect: ', error);
            }
        } 

    }, []);
}

export default GetSpotifyData;