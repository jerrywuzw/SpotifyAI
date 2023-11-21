import React, { useEffect, useState } from 'react';
import { getTopTracks } from '../service/spotifyService';
import '../css/TopTracks.css'; // Import the CSS file for styling

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const data = await getTopTracks();
        if (data && data.items) {
          setTracks(data.items);
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
    <div className="top-tracks-container">
      <h1 style={{ color: 'white' }}>Your Top Tracks</h1>
      {tracks.length > 0 ? (
        <div className="top-tracks">
          {tracks.map(track => (
            <div key={track.id} className="track">
              <img src={track.album.images[1].url} alt={track.name} className="album-cover" />
              <div className="track-info">
                <p className="track-title">{track.name}</p>
                <p className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No top tracks to display.</p>
      )}
    </div>
  );
};

export default TopTracks;
