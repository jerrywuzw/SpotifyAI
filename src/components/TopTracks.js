import React, { useEffect, useState } from 'react';
import { getTopTracks } from '../service/spotifyService';

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
      <div>
        <h1>Your Top Tracks</h1>
        {tracks.length > 0 ? (
            <ul>
              {tracks.map(track => (
                  <li key={track.id}>{track.name}</li>
              ))}
            </ul>
        ) : (
            <p>No top tracks to display.</p>
        )}
      </div>
  );
};

export default TopTracks;
