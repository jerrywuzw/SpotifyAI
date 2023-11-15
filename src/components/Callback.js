import React, { useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  const sendCodeToServer = useCallback(async (code) => {
    try {
      const response = await axios.post('http://localhost:5000/api/spotify/exchange-code', { code });

      if (response.status === 200) {
        // TODO: Redirect to ? after successful login
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error sending code to server', error);
      if (error.response && error.response.data.error === 'invalid_grant') {

        // TODO: Redirect to ? after failed login
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {

      // TODO: some warning here but not sure what to do
      sendCodeToServer(code);
    }
  }, [sendCodeToServer]);

  return <div>Loading...</div>;
};

export default Callback;
