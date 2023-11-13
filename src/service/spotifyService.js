const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];

export const getSpotifyAuthorizeURL = () => {
  const url = new URL(SPOTIFY_AUTHORIZE_ENDPOINT);
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', CLIENT_ID);
  url.searchParams.append('scope', SCOPES.join(' '));
  url.searchParams.append('redirect_uri', REDIRECT_URI);

  return url.toString();
};

export const handleLogin = () => {
  window.location = getSpotifyAuthorizeURL();
};
