import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from './LocationPicker';

export default function AddAd() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    category: 'TECHNOLOGY',
    photo: null,
    latitude: 0.0,
    longitude: 0.0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleLocationSelect = (location) => {
    setFormData({
      ...formData,
      city: location.city,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };


  const handleFileChange = (e) => {
    setFormData({...formData, photo: e.target.files[0]});
  };

  const handleSubmit = async (e) => {
    console.log("Price:", formData.price);
    console.log("User ID:", user.id);
    console.log(JSON.parse(localStorage.getItem("user")));


    e.preventDefault();

    if (!user) {
      alert("You must be logged in to add an ad.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("city", formData.city);
    data.append("category", formData.category);
    data.append("photo", formData.photo);
    data.append("userId", user.id);
    data.append("latitude", formData.latitude);
    data.append("longitude", formData.longitude);


    try {
        const auth = localStorage.getItem("auth");
        const response = await fetch("http://localhost:8080/api/ads", {
        method: "POST",
        headers: {
            "Authorization": "Basic " + auth
        },
        body: data,
      });

      if (response.ok) {
        alert("Ad successfully created!");
        navigate("/home");
      } else {
        const text = await response.text();
        alert("Error: " + text);
        console.error("Error details:", text);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Ad</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">

        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>City</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />

        <LocationPicker onSelect={handleLocationSelect} />

        <label>Category</label>
        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="CLOTHING">Clothing</option>
          <option value="TOOLS">Tools</option>
          <option value="SPORTS">Sports</option>
          <option value="ACCESSORIES">Accessories</option>
          <option value="FURNITURE">Furniture</option>
          <option value="PETS">Pets</option>
          <option value="GAMES">Games</option>
          <option value="BOOKS">Books</option>
          <option value="TECHNOLOGY">Technology</option>
        </select>

        <label>Photo</label>
        <input type="file" name="photo" onChange={handleFileChange} accept="image/*" required />

        <button type="submit">Submit Ad</button>
      </form>
    </div>
  );
}
