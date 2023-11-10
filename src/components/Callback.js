import React, { useEffect } from 'react';
import axios from 'axios';

const Callback = () => {
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
        client_secret: process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
  
      const { access_token } = response.data;
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
