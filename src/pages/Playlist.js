import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../service/spotifyService'; // Ensure this is the correct path
import '../css/Playlist.css'; // Import your CSS file for styling

const Playlist = () => {
  const [tracks, setTracks] = useState([]);

  // Define the color palette
  const colors = ['FFCB57', 'FB7DA8', 'FD5A46', '552CB7', '00995E', '058CD7'];

  // Function to get color for each track
  const getColorForTrack = (index) => `#${colors[index % colors.length]}`;

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
        {tracks.map((track, index) => (
          <li key={track.id} className="track-item" style={{ backgroundColor: getColorForTrack(index) }}>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={track.album.images[0].url} alt={track.name} className="album-cover" />
            </a>
            <div className="track-info">
              <span className="track-name">{track.name}</span>
              <span className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
