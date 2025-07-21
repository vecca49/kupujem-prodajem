import React from 'react';
import dealIcon from '../../assets/deal.png';

export default function Navbar({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={dealIcon} alt="Deal Icon" />
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <span>Welcome, {user.username}</span>
            <button onClick={onLogout}>Sign Out</button>
            <button onClick={() => alert('Add new listing')}>Add New Listing</button>
          </>
        ) : (
          <>
            <button onClick={() => window.location.href = '/login'}>Login</button>
            <button onClick={() => window.location.href = '/register'}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
