import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/Home";
import './App.css';
import { useEffect, useState } from "react";
import AddAd from "./components/AddAd";
import EditAd from "./components/EditAd";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user) => {
    setUsername(user.username); 
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUsername("");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUsername(user.username);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
      <div style={{ marginTop: "70px", padding: "20px" }}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-ad" element={<AddAd />} />
          <Route path="/edit/:id" element={<EditAd />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
