import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    category: '',
    photo: null
  });

  useEffect(() => {
    const fetchAd = async () => {
      const auth = localStorage.getItem("auth");

      try {
        const response = await axios.get(`http://localhost:8080/api/ads/${id}`, {
          headers: {
            Authorization: "Basic " + auth
          },
          withCredentials: true
        });

        setAd(response.data);
        setForm({
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
          city: response.data.city,
          category: response.data.category,
          photo: null
        });
      } catch (error) {
        console.error('Failed to load ad data', error);
      }
    };

    fetchAd();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = localStorage.getItem("auth");
    const formData = new FormData();

    for (const key in form) {
      if (key === "photo" && !form[key]) continue;
      formData.append(key, form[key]);
    }

    try {
      await axios.put(`http://localhost:8080/api/ads/${id}`, formData, {
        headers: {
          Authorization: "Basic " + auth,
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });

      alert('Ad updated successfully!');
      navigate('/home');
    } catch (error) {
      alert('Failed to update ad');
      console.error(error);
    }
  };

  if (!ad) return <p>Loading ad...</p>;

  return (
    <div className="form-container">
      <h2>Edit Ad</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Price</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required />

        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select category --</option>
          <option value="TECHNOLOGY">Technology</option>
          <option value="CLOTHING">Clothing</option>
          <option value="FURNITURE">Furniture</option>
          <option value="TOOLS">Tools</option>
          <option value="SPORTS">Sports</option>
          <option value="ACCESSORIES">Accessories</option>
          <option value="PETS">Pets</option>
          <option value="GAMES">Games</option>
          <option value="BOOKS">Books</option>

        </select>

        <label>New Photo (optional)</label>
        <input type="file" name="photo" onChange={handleFileChange} />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditAd;
