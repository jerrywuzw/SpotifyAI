import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TopTrack from './pages/TopTrack';
import { useSpotifyAuth } from './components/SpotifyAuthContext';

function App() {
  const { accessToken } = useSpotifyAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top-tracks" element={<TopTrack accessToken={accessToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
