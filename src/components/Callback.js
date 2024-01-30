import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../firebase';

const Callback = () => {
    const navigate = useNavigate();
    const functionUrl = 'https://us-central1-spotifyai-374f6.cloudfunctions.net/exchangeSpotifyCode';

    const authenticateWithFirebase = (customToken) => {
        signInWithCustomToken(auth, customToken)
            .then(() => {
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Firebase authentication error:', error);
                navigate('/');
            });
    };

    const exchangeCodeForToken = (code) => {
        axios.post(functionUrl, { code })
            .then(response => {
                console.log('Custom token received');
                authenticateWithFirebase(response.data);
            })
            .catch(error => {
                console.error('Error exchanging code for token:', error);
                navigate('/');
            });
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get('code');

        if (code) {
            exchangeCodeForToken(code);
        } else {
            console.error('Authorization code not found in URL');
            navigate('/');
        }
    }, [navigate]);

    return <div>Loading...</div>;
};

export default Callback;
