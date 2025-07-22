import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [ads, setAds] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [filter, setFilter] = useState({
    category: '',
    title: '',
    minPrice: '',
    maxPrice: '',
    mineOnly: false
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };



  const user = JSON.parse(localStorage.getItem('user'));
  console.log('Logged in user:', user)

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage, filter.mineOnly, filter.category]);

  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
    iconSize: [32, 32],
  });

  const adIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
    iconSize: [28, 28],
  });


  const fetchAds = async (page) => {
    try {
      const auth = localStorage.getItem("auth");
      let response;

      if (filter.mineOnly && user) {
        response = await axios.get(`http://localhost:8080/api/ads/user/${user.id}`, {
          headers: { Authorization: "Basic " + auth },
          withCredentials: true
        });

        setAds(response.data);
        setTotalPages(1);

      } else if (filter.category) {
        response = await axios.get(`http://localhost:8080/api/ads/filter-by-category?category=${filter.category}&page=${page}&size=10`, {
          headers: { Authorization: "Basic " + auth },
          withCredentials: true
        });

        setAds(response.data.content);
        setTotalPages(response.data.totalPages);

      } else {
        response = await axios.get(`http://localhost:8080/api/ads/paged?page=${page}&size=10`, {
          headers: { Authorization: "Basic " + auth },
          withCredentials: true
        });

        setAds(response.data.content);
        setTotalPages(response.data.totalPages);
      }

      const adList = filter.mineOnly ? response.data : response.data.content;
      adList.forEach(ad => fetchAdImage(ad.id));

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
      <h2>All Ads</h2>

      

      <label className="mine-only-filter">
        <input
          type="checkbox"
          name="mineOnly"
          checked={filter.mineOnly}
          onChange={handleFilterChange}
        />
        Show mine only
      </label>

      <label className="category-filter" style={{ marginLeft: '20px' }}>
        Category:
        <select name="category" value={filter.category} onChange={handleFilterChange} style={{ marginLeft: '8px', padding: '4px' }}>
          <option value="">All</option>
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
      </label>



      <h2>Map</h2>
      <MapContainer
        center={[user?.latitude || 44.7866, user?.longitude || 20.4489]} 
        zoom={10}
        style={{ height: "500px", width: "100%", marginBottom: "30px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {user?.latitude && user?.longitude && (
          <Marker position={[user.latitude, user.longitude]} icon={userIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}

        {ads.map((ad) => (
          ad.latitude && ad.longitude && (
            <Marker key={ad.id} position={[ad.latitude, ad.longitude]} icon={adIcon}>
              <Popup>
                <div
                  onClick={() => navigate(`/ads/${ad.id}`)}
                  style={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {ad.title}<br />
                  {ad.city}<br />
                  <span style={{ color: 'blue' }}>Click for more</span>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      <div className="ad-grid">
        {ads.map((ad) => (
          <div className="ad-card" key={ad.id}>
            <img
              src={imageUrls[ad.id] || '/loading-image.jpg'}
              alt={ad.title}
              className="ad-image"
            />
            <div className="ad-card-content">
              <h3 style={{ cursor: 'pointer', color: 'blue' }} onClick={() => window.location.href = `/ads/${ad.id}`}>
                {ad.title}
              </h3>

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
