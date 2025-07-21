import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAd = async () => {
      const auth = localStorage.getItem("auth");

      try {
        const response = await axios.get(`http://localhost:8080/api/ads/${id}`, {
          headers: { Authorization: "Basic " + auth },
          withCredentials: true
        });

        setAd(response.data);
        fetchImage(response.data.id);
      } catch (error) {
        console.error('Error loading ad details:', error);
      }
    };

    const fetchImage = async (adId) => {
      const auth = localStorage.getItem("auth");

      try {
        const res = await axios.get(`http://localhost:8080/api/ads/${adId}/photo`, {
          headers: { Authorization: "Basic " + auth },
          responseType: 'blob',
          withCredentials: true
        });

        setImageUrl(URL.createObjectURL(res.data));
      } catch {
        setImageUrl('/default-image.jpg');
      }
    };

    fetchAd();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        const auth = localStorage.getItem("auth");

        await axios.delete(`http://localhost:8080/api/ads/${id}`, {
          headers: { Authorization: "Basic " + auth },
          withCredentials: true
        });

        alert("Ad deleted");
        navigate('/home');
      } catch (error) {
        console.error("Error deleting ad:", error);
      }
    }
  };

  if (!ad) return <p>Loading ad details...</p>;

  return (
    <div className="ad-details">
      <h2>{ad.title}</h2>
      <img src={imageUrl} alt={ad.title} className="detail-image" />
      <p><strong>Description:</strong> {ad.description}</p>
      <p><strong>Price:</strong> {ad.price} RSD</p>
      <p><strong>City:</strong> {ad.city}</p>
      <p><strong>Category:</strong> {ad.category}</p>
      <p><strong>Date:</strong> {new Date(ad.createdAt).toLocaleDateString('sr-RS')}</p>

      <h3>User contact</h3>
      <p><strong>Name:</strong> {ad.user?.username}</p>
      <p><strong>Email:</strong> {ad.user?.email}</p>
      <p><strong>Phone number:</strong> {ad.user?.phoneNumber}</p>

      {user && ad.user && user.id === ad.user.id && (
        <div className="actions">
          <button onClick={() => navigate(`/edit/${ad.id}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default AdDetails;
