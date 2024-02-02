import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../service/spotifyService'; // Import getRecommendations from the appropriate file
import '../css/Playlist.css'; // Make sure to create and import a CSS file for styling

const Playlist = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        if (data && data.tracks) {
          setTracks(data.tracks);
        } else {
          console.log('No tracks found in response:', data);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div>
      <h1 className="header-title">Recommended Playlist</h1>
      <ul className="playlist">
        {tracks.map(track => (
          <li key={track.id} className="track-item">
            {/* Display track information here, customize as needed */}
            <span className="track-name">{track.name}</span>
            {/* You can add more details like artist, album, etc. */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
