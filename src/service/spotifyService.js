import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const CLIENT_ID = "a307f6b0be55450cbdd16b0e29d8716f";
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = ["user-read-private", "user-read-email", "user-top-read"];

export const handleLogin = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is already authenticated with Firebase
      console.log('User already authenticated, redirecting to dashboard...');
      window.location.href = '/dashboard'; // Redirect to dashboard
    } else {
      // User not authenticated, proceed with Spotify login
      const url = new URL(SPOTIFY_AUTHORIZE_ENDPOINT);
      url.searchParams.append("client_id", CLIENT_ID);
      url.searchParams.append("response_type", "code");
      url.searchParams.append("redirect_uri", REDIRECT_URI);
      url.searchParams.append("scope", SCOPES.join(" "));

      window.location.href = url.toString(); // Redirect to Spotify login
    }
  });
};

export const getTopTracks = async () => {
  const getTopTracksFunction = httpsCallable(getFunctions(), 'getTopTracks');
  try {
    const result = await getTopTracksFunction();
    console.log('Result from getTopTracks Firebase function:', result);

    return result.data; // The data returned from your Firebase function
  } catch (error) {
    console.error('Error calling getTopTracks Firebase function:', error);
    throw error;
  }
};
