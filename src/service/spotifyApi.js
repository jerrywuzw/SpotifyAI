import axios from 'axios';

const BASE_URL = 'https://api.spotify.com/v1';

export const fetchUserTopTracks = async (accessToken) => {
  try {
    const response = await axios.get(`${BASE_URL}/me/top/tracks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's top tracks", error);

  }
};

