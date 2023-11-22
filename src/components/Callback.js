import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSpotifyAuth } from './SpotifyAuthContext'; // Adjust the import path

const Callback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { setAccessToken } = useSpotifyAuth(); // Use the hook to access setAccessToken

  const sendCodeToServer = useCallback(async (code) => {
    try {
      const response = await axios.post('http://localhost:5000/api/spotify/exchange-code', { code });

      if (response.status === 200 && response.data.access_token) {
        setAccessToken(response.data.access_token);

        navigate('/dashboard'); 
      } else {
        console.error('Access token not received or invalid response');
        navigate('/'); // Redirect to home or an error page
      }
    } catch (error) {
      console.error('Error sending code to server', error);
      navigate('/'); // Redirect to home or an error page on error
    } finally {
      setIsLoading(false);
    }
  }, [navigate, setAccessToken]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      sendCodeToServer(code);
    } else {
      // Handle case where code is not present in URL
      console.error('Authorization code not found in URL');
      navigate('/');
    }
  }, [sendCodeToServer, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default Callback;
