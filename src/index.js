import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { SpotifyAuthProvider } from './components/SpotifyAuthContext';

ReactDOM.render(
  <React.StrictMode>
    <SpotifyAuthProvider>
      <App />
    </SpotifyAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);