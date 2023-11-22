import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../service/spotifyService';
import { useSpotifyAuth } from '../components/SpotifyAuthContext';
import '../css/Home.css';
import SpotifyLogo from '../logo/Spotify_icon.png'; // Make sure the path is correct

const Home = () => {
  const navigate = useNavigate();
  const { accessToken } = useSpotifyAuth();
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="home-container">
      <h1 style={{ color: 'white', fontSize: '80px' }}>Welcome to your Spotify data dashboard!</h1>
      {!accessToken ? (
        <button onClick={handleLogin} className="spotify-login-btn">
          <img src={SpotifyLogo} alt="Spotify" className="spotify-logo" /> 
          Login with Spotify
        </button>
      ) : (
        <button onClick={goToDashboard} className="dashboard-btn">
          Go to Dashboard
        </button>
      )}
    </div>
  );
};

export default Home;
