import React from 'react';
import { handleLogin } from '../service/spotifyService';

const Login = () => {
  return (
    <div>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Login;
