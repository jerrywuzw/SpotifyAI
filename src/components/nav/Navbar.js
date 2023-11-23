import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/Navbar.css'; 

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <nav className="navbar">
          <div className="hamburger-menu" onClick={toggleDropdown}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="navbar-brand">Spotify AI</div>
          <div className={`dropdown ${dropdownOpen ? 'dropdown-open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/" onClick={() => setDropdownOpen(false)}>Home</Link></li>
              <li><Link to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link></li>
              {/* other links */}
            </ul>
          </div>
        </nav>
    );
};

export default Navbar;
