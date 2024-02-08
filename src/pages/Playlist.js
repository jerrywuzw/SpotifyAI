import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../service/spotifyService';
import '../css/Playlist.css'; // Make sure this path is correct

const Playlist = () => {
  const [tracks, setTracks] = useState([]);

  // Define the color palette
  const colors = ['FFCB57', 'FB7DA8', 'FD5A46', '552CB7', '00995E', '058CD7'];

  // Function to get color for each track
  const getColorForTrack = (index) => `#${colors[index % colors.length]}`;

  // Function to determine if the title is long
  const isTitleLong = (title) => {
    const maxTitleLength = 30; // Adjust based on your needs
    return title.length > maxTitleLength;
  };

  // Function to handle play icon click
  const handlePlayIconClick = (spotifyUrl) => {
    window.open(spotifyUrl, '_blank');
  };

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
      <div className="button-container">
        {/* Add five buttons here */}
        <button className="playlist-button">Button 1</button>
        <button className="playlist-button">Button 2</button>
        <button className="playlist-button">Button 3</button>
        <button className="playlist-button">Button 4</button>
        <button className="playlist-button">Button 5</button>
      </div>
      <ul className="playlist">
        {tracks.map((track, index) => (
          <li key={track.id} className="track-item" style={{ backgroundColor: getColorForTrack(index) }}>
            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              <img src={track.album.images[0].url} alt={track.name} className="album-cover" />
            </a>
            <div className="track-info">
              <span className={`track-name ${isTitleLong(track.name) ? 'scrolling' : ''}`}>
                <span>{track.name}</span>
              </span>
              <span className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</span>
            </div>
            <div className="play-icon" onClick={() => handlePlayIconClick(track.external_urls.spotify)}></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
