import React, { useEffect, useState } from 'react';
import { getTopTracks } from '../service/spotifyService';
import '../css/TopTracks.css'; // Import the CSS file for styling

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const data = await getTopTracks();
        console.log(data);
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
      <div className="top-tracks">
        {tracks.map(track => <TrackCard key={track.id} track={track} />)}
      </div>
    </div>
  );
};

export default TopTracks;
