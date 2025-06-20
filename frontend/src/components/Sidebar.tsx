/*CREATED BY NIKITA S RAJ KAPINI(19/06/2025)*/

import React, { useState, useEffect, useRef } from 'react';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="compact-sidebar">
      <div className="avatar-section" ref={dropdownRef}>
        <img
          src="/profile.svg"
          alt="User Avatar"
          className="avatar-icon"
          onClick={() => setShowDropdown((prev) => !prev)}
        />
        {showDropdown && (
          <div className="avatar-dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
