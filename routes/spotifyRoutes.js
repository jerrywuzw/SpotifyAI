const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];

const getSpotifyAuthorizeURL = () => {
    const url = new URL(SPOTIFY_AUTHORIZE_ENDPOINT);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('scope', SCOPES.join(' '));
    url.searchParams.append('redirect_uri', REDIRECT_URI);

    return url.toString();
};

router.get('/spotify-auth-url', (req, res) => {
    const url = getSpotifyAuthorizeURL();
    res.json({ url: url });
});

router.post('/exchange-code', async (req, res) => {
    const { code } = req.body;
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token } = response.data;

        // Send the access token back to the client
        res.json({ access_token: access_token });
    } catch (error) {
        console.error('Error exchanging code for token', error);
        res.status(500).send('Error exchanging code for token');
    }
});


module.exports = router;
        // TODO: Store the access token in Firebase
        // Placeholder for storing the access token in Firebase
        // storeTokenInFirebase(access_token);

        // Send a success response to the client