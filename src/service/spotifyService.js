export const handleLogin = async () => {
  try {
    // Update the URL to match your server's address and endpoint
    // For development, it might be something like 'http://localhost:5000/api/spotify/spotify-auth-url'
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    const response = await fetch(`${serverUrl}/api/spotify/spotify-auth-url`);
    const data = await response.json();
    window.location.href = data.url; // Redirect the user to the Spotify login page
  } catch (error) {
    console.error('Error fetching Spotify auth URL:', error);
  }
};
