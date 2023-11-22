import React from 'react';
import '../css/TrackCard.css'; // Import the CSS for styling

const TrackCard = ({ track }) => {
  return (
    <div className="track-card">
      <img src={track.album.images[1].url} alt={track.name} className="album-cover" />
      <div className="track-info">
        <h3 className="track-title">{track.name}</h3>
        <p className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</p>
      </div>
    </div>
  );
};

export default TrackCard;
