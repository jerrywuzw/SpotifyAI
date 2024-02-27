import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router
import { getFunctions, httpsCallable } from 'firebase/functions';

function SongDetail() {
  const { trackId } = useParams();
  const [trackDetails, setTrackDetails] = useState(null);

  useEffect(() => {
    const fetchTrackDetails = async () => {
      const functions = getFunctions();
      const getTrackDetails = httpsCallable(functions, 'getTrackDetails');

      try {
        const result = await getTrackDetails({ trackId });
        setTrackDetails(result.data.trackDetails);
      } catch (error) {
        console.error('Error fetching track details:', error);
      }
    };

    if (trackId) {
      fetchTrackDetails();
    }
  }, [trackId]);

  if (!trackDetails) {
    return <div>Loading...</div>;
  }

  // Render the track details
  return (
    <div>
      <h2>{trackDetails.name}</h2>
      <p>Artist: {trackDetails.artists.map(artist => artist.name).join(', ')}</p>
      <p>Album: {trackDetails.album.name}</p>
      <p>Released: {trackDetails.album.release_date}</p>
      <p>Duration: {Math.floor(trackDetails.duration_ms / 60000)}:{((trackDetails.duration_ms % 60000) / 1000).toFixed(0)}</p>
      <img src={trackDetails.album.images[0].url} alt="Album cover" />
      <br />
      <a href={trackDetails.external_urls.spotify}>Listen on Spotify</a>
    </div>
  );
}

export default SongDetail;
