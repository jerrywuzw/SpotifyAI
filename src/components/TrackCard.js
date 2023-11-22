import React, { useEffect, useRef } from 'react';
import '../css/TrackCard.css';

const TrackCard = ({ track, style }) => {
  const titleRef = useRef(null);
  const spanRef = useRef(null); 

  useEffect(() => {
    if (titleRef.current && spanRef.current) {
      const titleWidth = titleRef.current.offsetWidth;
      const spanWidth = spanRef.current.offsetWidth;

      if (spanWidth > titleWidth) {
        spanRef.current.classList.add('scrolling');
      }
    }
  }, []);

  return (
    <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="track-card-link">
      <div className="track-card" style={style}>
        <img src={track.album.images[1].url} alt={track.name} className="album-cover" />
        <div className="track-info">
          <div className="track-title" ref={titleRef}>
            <span ref={spanRef}>{track.name}</span>
          </div>
          <p className="artist-name">{track.artists.map(artist => artist.name).join(', ')}</p>
        </div>
      </div>
    </a>
  );
};

export default TrackCard;
