import React, { useState } from "react";
import axios from "axios";

const categories = [
  "CLOTHING", "TOOLS", "SPORTS", "ACCESSORIES",
  "FURNITURE", "PETS", "GAMES", "BOOKS", "TECHNOLOGY"
];

export default function AddAd() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    category: categories[0],
    photo: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", parseFloat(formData.price));
    data.append("city", formData.city);
    data.append("category", formData.category);
    data.append("photo", formData.photo);
    data.append("userId", user.id);

    if (!formData.photo) {
        alert("You must select a photo.");
        return;
    }


    try {
      const response = await axios.post("http://localhost:8080/api/ads", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        },
        withCredentials: true  
    });
      alert(`Ad created successfully with ID: ${response.data.id}`);
      window.location.href = "/home";
    } catch (err) {
      console.error(err);
      alert("Error while creating ad.");
    }
  };

  return (
    <div className="add-ad-container">
        <h2>Add New Listing</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>City:</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} required />

        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
            ))}
        </select>

        <label>Photo:</label>
        <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required />

        <button type="submit">Submit</button>
        </form>
    </div>
    );
}