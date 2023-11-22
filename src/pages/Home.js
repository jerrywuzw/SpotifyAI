import React from 'react';
import { handleLogin } from '../service/spotifyService';
import '../css/Home.css';
import SpotifyLogo from '../logo/Spotify_icon.svg';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to your Spotify data dashboard!</h1>
      <button onClick={handleLogin} className="spotify-login-btn">
        <img src={SpotifyLogo} alt="Spotify" className="spotify-logo" />
        Login with Spotify
      </button>
    </div>
  );
};

export default Home;
