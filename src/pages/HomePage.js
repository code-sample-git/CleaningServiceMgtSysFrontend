import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from '../utils/api';

function HomePage({ user }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate("/login");
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="home-container">
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Add error display */}
      <div className="upper-section">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrssxO1WKp6L7ZblKOiDqNGEgQsivTW2trA&s" alt="Brand Logo" />
        <img src={user.profileImage} alt="Profile" className="profile-image" />
        <h2>{user.name}</h2>
      </div>
      <div className="quick-section">
        <button>Locations</button>
        <button>QA Reports</button>
        <button>Settings</button>
      </div>
      <div className="lower-section">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phoneNumber || 'Not provided'}</p>
        <p>Role: {profile.role}</p>
      </div>
    </div>
  );
}

export default HomePage;