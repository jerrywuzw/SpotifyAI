import React, { createContext, useState, useContext, useEffect } from 'react';

const SpotifyAuthContext = createContext();

export const useSpotifyAuth = () => useContext(SpotifyAuthContext);

export const SpotifyAuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    console.log('Access Token Updated:', accessToken);
  }, [accessToken]);
  return (
    <SpotifyAuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </SpotifyAuthContext.Provider>
  );
};
