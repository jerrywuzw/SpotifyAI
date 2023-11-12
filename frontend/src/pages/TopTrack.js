import React from 'react';
import TopTracks from '../components/TopTracks';

const TopTrack = ({ accessToken }) => {
  return (
    <div>
      <h1>Top Tracks Page</h1>
      <TopTracks accessToken={accessToken} />
    </div>
  );
};

export default TopTrack;
