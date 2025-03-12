import { useNavigate } from "react-router-dom";

function HomePage({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
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
    </div>
  );
}

export default HomePage;