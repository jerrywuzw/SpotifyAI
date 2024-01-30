import React, { useEffect, useState } from 'react';
import { getTopTracks } from '../service/spotifyService';
import '../css/Playlist.css'; // Create and import a new CSS file for styling the list

const Playlist = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const data = await getTopTracks();
        if (data && data.topTracks.items) {
          setTracks(data.topTracks.items);
        } else {
          console.log('No items found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      }
    };

    fetchTopTracks();
  }, []);

  return (
    <div>
      <h1 className="header-title">Your Playlist</h1>
      <ul className="playlist">
        {tracks.map(track => (
          <li key={track.id} className="track-item">
            {/* Display track information here, customize as needed */}
            <span className="track-name">{track.name}</span>
            {/* Add more track details if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
