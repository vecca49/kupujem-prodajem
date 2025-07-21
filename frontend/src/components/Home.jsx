import React from 'react';

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.username}!</h2>
      ) : (
        <h2>Welcome, guest!</h2>
      )}
    </div>
  );
}
