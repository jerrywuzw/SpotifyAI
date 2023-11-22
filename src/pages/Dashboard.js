import React from 'react';
import TopTracks from '../components/TopTracks';
import '../css/Dashboard.css';

const Dashboard = () => {
  const titleStyle = {
    textAlign: 'center',
    color: 'white',
    fontSize: '5em'
  };

  return (
    <div className="dashboard">
      <h1 style={titleStyle} className="slide-down">Dashboard</h1>
      <TopTracks />
    </div>
  );
};

export default Dashboard;

