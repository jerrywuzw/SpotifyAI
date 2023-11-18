import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TopTrack from './pages/TopTrack';
import { useSpotifyAuth } from './components/SpotifyAuthContext';
import Callback from './components/Callback';
import Dashboard from './pages/Dashboard';


function App() {
  const { accessToken } = useSpotifyAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top-tracks" element={<TopTrack accessToken={accessToken} />} />
        <Route path="/dashboard" element={<Dashboard accessToken={accessToken} />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
