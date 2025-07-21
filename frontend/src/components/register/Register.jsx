import React, { useState } from 'react';


export default function Registration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phoneNumber: '',
  });
  const [registered, setRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Send registration request to backend
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setRegistered(true);
      } else {
        const errorData = await response.text();
        alert('Registration failed: ' + errorData);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (registered) {
    return (
      <div className="success-box">
        <p>Registration successful! A verification code has been sent to your email.</p>
        <button onClick={() => window.location.href = '/login'}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>Create an Account</h2>
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

        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          value={formData.email} 
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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input 
          id="confirmPassword" 
          name="confirmPassword" 
          type="password" 
          value={formData.confirmPassword} 
          onChange={handleChange} 
          required 
        />

        <label htmlFor="address">Address</label>
        <input 
          id="address" 
          name="address" 
          type="text" 
          value={formData.address} 
          onChange={handleChange} 
          required 
        />

        <label htmlFor="phoneNumber">Phone Number</label>
        <input 
          id="phoneNumber" 
          name="phoneNumber" 
          type="text" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
          required 
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
