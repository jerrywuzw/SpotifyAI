import React, { useEffect, useState } from 'react';
import { fetchUserTopTracks } from '../service/spotifyApi'; // Adjust the path as necessary

const TopTracks = ({ accessToken }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    console.log('Access Token in TopTracks:', accessToken); // Log the access token

    const getTopTracks = async () => {
      if (!accessToken) {
        console.log('No access token available.');
        return;
      }

      try {
        const data = await fetchUserTopTracks(accessToken);
        console.log('Fetched Top Tracks Data:', data); // Log the fetched data

        if (data && data.items) {
          setTracks(data.items);
        } else {
          console.log('No items found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      }
    };

    getTopTracks();
  }, [accessToken]);

  return (
    <div>
      <h1>Your Top Tracks</h1>
      {tracks.length > 0 ? (
        <ul>
          {tracks.map(track => (
            <li key={track.id}>{track.name}</li>
          ))}
        </ul>
      ) : (
        <p>No top tracks to display.</p> // Fallback text if no tracks are available
      )}
    </div>
  );
};

export default TopTracks;
