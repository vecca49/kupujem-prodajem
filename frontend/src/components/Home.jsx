import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [ads, setAds] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Logged in user:', user)

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage]);

  const fetchAds = async (page) => {
    try {
      const auth = localStorage.getItem("auth");

      const response = await axios.get(`http://localhost:8080/api/ads/paged?page=${page}&size=10`, {
        headers: {
          Authorization: "Basic " + auth
        },
        withCredentials: true
      });

      const adsData = response.data.content;
      setAds(adsData);
      setTotalPages(response.data.totalPages);

      adsData.forEach(ad => {
        fetchAdImage(ad.id);
      });
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const fetchAdImage = async (adId) => {
    const auth = localStorage.getItem("auth");
    try {
      const response = await axios.get(`http://localhost:8080/api/ads/${adId}/photo`, {
        headers: {
          Authorization: "Basic " + auth
        },
        responseType: 'blob',
        withCredentials: true
      });

      const imageUrl = URL.createObjectURL(response.data);
      setImageUrls(prev => ({ ...prev, [adId]: imageUrl }));
    } catch (error) {
      console.error(`Error loading image for ad ${adId}:`, error);
      setImageUrls(prev => ({ ...prev, [adId]: '/default-image.jpg' }));
    }
  };

  const handleDelete = async (adId) => {
    if (window.confirm('Are you sure you want to delete the ad?')) {
      try {
        const auth = localStorage.getItem("auth");

        await axios.delete(`http://localhost:8080/api/ads/${adId}`, {
          headers: {
            Authorization: "Basic " + auth
          },
          withCredentials: true
        });

        fetchAds(currentPage); 
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';

    let isoString = dateString.replace(' ', 'T').split('.')[0];

    const date = new Date(isoString);

    if (isNaN(date)) return 'Invalid Date';

    return date.toLocaleDateString('sr-RS');
  };


  return (
    <div className="container">
      <h2>Svi Oglasi</h2>
      <div className="ad-grid">
        {ads.map((ad) => (
          <div className="ad-card" key={ad.id}>
            <img
              src={imageUrls[ad.id] || '/loading-image.jpg'}
              alt={ad.title}
              className="ad-image"
            />
            <div className="ad-card-content">
              <h3>{ad.title}</h3>
              <p>{ad.description}</p>
              <p><strong>City:</strong> {ad.city}</p>
              <p><strong>Category:</strong> {ad.category}</p>
              <p className="price">{ad.price} RSD</p>
              <p className="date">{formatDate(ad.createdAt)}</p>
              {user && ad.user && user.id === ad.user.id && (
                <div className="actions">
                  <button onClick={() => handleDelete(ad.id)}>Delete</button>
                  <button onClick={() => window.location.href = `/edit/${ad.id}`}>Edit</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>
          ← Previous 
        </button>
        <span>Page {currentPage + 1} od {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default Home;
