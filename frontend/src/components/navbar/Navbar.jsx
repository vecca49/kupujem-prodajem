import React from 'react';
import dealIcon from '../../assets/deal.png';

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={dealIcon} alt="Deal Icon" className="logo-img" />
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span className="welcome-text">👋 Welcome, <strong>{user.username}</strong></span>
            <button className="nav-button" onClick={onLogout}>Sign Out</button>
            <button className="nav-button" onClick={() => window.location.href = '/add-ad'}>Add New Listing</button>
          </>
        ) : (
          <>
            <button className="nav-button" onClick={() => window.location.href = '/login'}>Login</button>
            <button className="nav-button" onClick={() => window.location.href = '/register'}>Register</button>
          </>
        )}
      </div>
    </nav>

  );
}
