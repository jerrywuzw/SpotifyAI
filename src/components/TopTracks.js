import React, { useEffect, useState } from 'react';
import { getTopTracks } from '../service/spotifyService';
import TrackCard from './TrackCard';
import '../css/TopTracks.css';

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const data = await getTopTracks();
        console.log(data);
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
      <h1 className="header-title">Your Top Tracks</h1>
      <div className="top-tracks">
        {tracks.map(track => <TrackCard
        key={track.id}
        track={track}
        style={{ animationDelay: `${Math.random() * 2}s` }}
        />)}
      </div>
    </div>
  );
};

export default TopTracks;
