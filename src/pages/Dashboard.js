import React from 'react';
import TopTracks from '../components/TopTracks';

const Dashboard = ({ accessToken }) => {
  console.log('Access Token in Dashboard:', accessToken);
  return (
    <div>
      <h1>Dashboard</h1>
      <TopTracks accessToken={accessToken} />
    </div>
  );
};

export default Dashboard;
