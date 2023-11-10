import React, { createContext, useState, useContext } from 'react';

const SpotifyAuthContext = createContext();

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  return (
    <SpotifyAuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};
