const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];

let accessToken = '';
let refreshToken = '';

const isTokenValid = async () => {
    try {
        await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return true; // Token is valid
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            return false;
        }
        throw error; // Other errors
    }
};

const refreshAccessToken = async () => {
    try {
        const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        accessToken = response.data.access_token;
    } catch (error) {
        console.error('Error refreshing access token', error);
        throw error;
    }
};

const ensureTokenValidity = async () => {
    const isValid = await isTokenValid();
    if (!isValid) {
        await refreshAccessToken();
    }
};

const getSpotifyAuthorizeURL = () => {
    const url = new URL(SPOTIFY_AUTHORIZE_ENDPOINT);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', CLIENT_ID);
    url.searchParams.append('scope', SCOPES.join(' '));
    url.searchParams.append('redirect_uri', REDIRECT_URI);
    url.searchParams.append('show_dialog', 'true');  // Add this line for force re-authentication

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

        // Update local variables with the received tokens
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token; // Assuming the response includes a refresh token

        console.log('New Access Token:', accessToken); // Log the new access token
        console.log('New Refresh Token:', refreshToken); // Log the new refresh token

        // Send a success response to the client
        res.status(200).send('Token received and processed');
    } catch (error) {
        console.error('Error exchanging code for token', error);
        res.status(500).send('Error exchanging code for token');
    }
});



router.get('/top-tracks', async (req, res) => {
    try {
        await ensureTokenValidity(); // Ensure the token is valid before making the request

        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching top tracks:', error);
        res.status(500).send('Error fetching top tracks');
    }
});



module.exports = router;
        // TODO: Store the access token in Firebase
        // Placeholder for storing the access token in Firebase
        // storeTokenInFirebase(access_token);

        // Send a success response to the client