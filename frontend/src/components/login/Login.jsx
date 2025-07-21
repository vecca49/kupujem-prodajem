import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();

        localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('auth', btoa(formData.username + ":" + formData.password)); 

        alert('Login successful!');
        onLogin(user);
        navigate('/home')
      } else {
        const errorText = await response.text();
        alert('Login failed: ' + errorText);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>

        <label htmlFor="username">Username</label>
        <input 
          id="username" 
          name="username" 
          type="text" 
          value={formData.username} 
          onChange={handleChange} 
          required 
        />

        <label htmlFor="password">Password</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
