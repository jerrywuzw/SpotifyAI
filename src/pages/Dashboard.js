import React from 'react';
import TopTracks from '../components/TopTracks';
import '../css/Dashboard.css';

const Dashboard = () => {
  const titleStyle = {
    textAlign: 'center', // Center align the title
    color: 'white' // White font color for the title
  };

  return (
    <div className="dashboard">
      <h1 style={titleStyle}>Dashboard</h1>
      <TopTracks />
    </div>
  );
};

export default Dashboard;
