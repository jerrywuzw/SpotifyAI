import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../service/spotifyService';
import '../css/Playlist.css'; // Make sure this path is correct

const Playlist = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const styles = ['Nostalgic Hits', 'Weekend Groove', 'Do Not Disturb', 'Unwind', 'Gem Finder'];

  const getColorForTrack = (index) => `#${['FFCB57', 'FB7DA8', 'FD5A46', '552CB7', '00995E', '058CD7'][index % 6]}`;
  const isTitleLong = (title) => title.length > 30;
  const handlePlayIconClick = (spotifyUrl) => window.open(spotifyUrl, '_blank');

  const fetchRecommendations = async (style = 'Nostalgic Hits') => {
    try {
      setIsLoading(true);
      const data = await getRecommendations({ style }); // Pass the selected style as an object
      if (data && data.tracks) {
        setTracks(data.tracks);
      } else {
        console.log('No tracks found in response:', data);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations(); // Fetch default style recommendations on mount
  }, []);

  return (
    <div>
      <h1 className="header-title">Recommended Playlist</h1>
      <div className="button-container">
        {styles.map((style, index) => (
          <button
            key={index}
            className="playlist-button"
            onClick={() => fetchRecommendations(style)}
          >
            {style}
          </button>
        ))}
      </div>
      {isLoading ? (
        <div className="spinner"></div>
      ) : (
        <ul className="playlist">
          {tracks.map((track, index) => (
            <li
              key={track.id}
              className="track-item"
              style={{
                backgroundColor: getColorForTrack(index),
                animationDelay: `${index * 0.1}s`
              }}
            >
              <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={track.album.images[0].url} alt={track.name} className="album-cover" />
              </a>
              <div className="track-info">
                <span className={`track-name ${isTitleLong(track.name) ? 'scrolling' : ''}`}>
                  {track.name}
                </span>
                <span className="track-artist">{track.artists.map(artist => artist.name).join(', ')}</span>
              </div>
              <div className="play-icon" onClick={() => handlePlayIconClick(track.external_urls.spotify)}></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Playlist;
