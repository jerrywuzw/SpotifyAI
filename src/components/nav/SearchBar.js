import React, { useState, useEffect } from 'react';
import './css/SearchBar.css';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true);
        try {
          const response = await fetch(`/api/spotify/search?term=${encodeURIComponent(searchTerm)}`);
          const data = await response.json();
          setSearchResults(data.tracks.items); // Assuming you're searching for tracks
        } catch (error) {
          console.error('Error fetching search results:', error);
          setSearchResults([]); // Handle errors here
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="search-container">
            <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search music..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* Display a loading indicator or similar if needed */}
      {isSearching && <div>Searching...</div>}
      {/* Dropdown with search results */}
      {searchResults.length > 0 && (
        <ul className='search-dropdown'>
          {searchResults.map((track, index) => (
            <li key={index}>{track.name} - {track.artists.map(artist => artist.name).join(', ')}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
