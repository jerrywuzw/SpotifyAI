import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Update with your server URL

export const handleLogin = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/spotify/spotify-auth-url`);
    const data = response.data;
    window.location.href = data.url;
  } catch (error) {
    console.error('Error fetching Spotify auth URL:', error);
  }
};

export const getTopTracks = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/spotify/top-tracks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user's top tracks", error);
  }
};
