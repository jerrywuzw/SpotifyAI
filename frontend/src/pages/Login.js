import React from 'react';
import { handleLogin } from '../service/spotifyService';

const Login = () => {
  return (
    <div>
      <h1>Welcome to My Spotify App</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;
