import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TopTrack from './pages/TopTrack';
import Callback from './components/Callback';
import Dashboard from './pages/Dashboard';
import Playlist from './pages/Playlist';
import SongDetails from './SongDetails';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top-tracks" element={<TopTrack />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/song/:songId" element={<SongDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
