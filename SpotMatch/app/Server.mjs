// const express = require('express');
// const querystring = require('querystring');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const axios = require('axios');
import express from 'express';
import querystring from 'querystring'
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors'

const app = express();
const port = 3000;

const clientId = '89d33611962f42ecb9e982ee2b879bb8';
const clientSecret = 'e6be59a7c4ad417b8bb5de11deb8fbd3';
const redirectUri = 'SpotMatch://callback';

const generateRandomString = function (length) { // generate random string to use as a state
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.use(bodyParser.json());
app.use(cors());

app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    const scope = 'user-top-read';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state
      }));
});

// app.get('/callback', function(req, res) {

//     var code = req.query.code || null;
//     var state = req.query.state || null;
  
//     if (state === null) {
//       res.redirect('/#' +
//         querystring.stringify({
//           error: 'state_mismatch'
//         }));
//     } else {
//       var authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         form: {
//           code: code,
//           redirect_uri: redirectUri,
//           grant_type: 'authorization_code'
//         },
//         headers: {
//           'content-type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
//         },
//         json: true
//       };
//     }
//   });
// app.get('/login', (req, res) => {
//     const scopes = 'user-top-read';
//     res.redirect(
//       `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`
//     );
//   });

app.post('/callback', async (req, res) => {
    const { code } = req.body;
    try {
        const { response } = await axios.post(
            'https://accounts.spotify.com/api/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            }).toString(),
            {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        console.log(response)

        res.json(response.data);
    } catch (error) {
        console.error('Error exchanging code for token', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});