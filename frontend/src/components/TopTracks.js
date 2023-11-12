import React, { useEffect, useState } from 'react';
import { fetchUserTopTracks } from '../service/spotifyApi';

const TopTracks = ({ accessToken }) => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const getTopTracks = async () => {
      const data = await fetchUserTopTracks(accessToken);
      setTracks(data.items);
    };

    if (accessToken) {
      getTopTracks();
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Your Top Tracks</h1>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
