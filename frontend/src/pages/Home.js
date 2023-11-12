import React from 'react';
import { handleLogin } from '../service/spotifyService';

const Home = () => {
  return (
    <div>
      <h1>Welcome to your Spotify data dashboard!</h1>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default Home;
