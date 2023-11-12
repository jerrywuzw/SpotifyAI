import React, { useEffect } from 'react';
import axios from 'axios';
import { useSpotifyAuth } from './SpotifyAuthContext';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const { setAccessToken } = useSpotifyAuth(); // Use the context to set the access token
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
        client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET, // Note: Only for testing
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      setAccessToken(access_token); // Set the access token in the context
      navigate('/'); // Redirect to home or another page after successful login
    } catch (error) {
      console.error('Error exchanging code for token', error);
    }
  };

  return (
    <div>
      Loading...
    </div>
  );
};

export default Callback;
