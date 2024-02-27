import React, { useState, useEffect } from 'react';
import { getTrackDetails } from '../service/spotifyService'; // Ensure this path matches your project structure

const SongDetail = ({ trackId }) => {
  const [trackDetails, setTrackDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trackId) return; // or show a default message or perform other actions

    const fetchTrackDetails = async () => {
      setLoading(true);
      try {
        const data = await getTrackDetails(trackId);
        setTrackDetails(data.trackDetails); // Ensure this matches the structure returned by your function
        setError('');
      } catch (err) {
        console.error('Error fetching track details:', err);
        setError('Failed to fetch track details');
        setTrackDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId]); // This will re-fetch when trackId changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {trackDetails ? (
        <div>
          <h2>{trackDetails.name}</h2> {/* Adjust fields based on your data structure */}
          <p>Artist: {trackDetails.artists?.map(artist => artist.name).join(', ')}</p>
          <p>Album: {trackDetails.album?.name}</p>
          <img src={trackDetails.album?.images[0]?.url} alt="Album cover" />
        </div>
      ) : (
        <div>No track details available</div>
      )}
    </div>
  );
};

export default SongDetail;
