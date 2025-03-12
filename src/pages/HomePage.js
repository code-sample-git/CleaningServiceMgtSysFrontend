import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login"); // Redirect if not authenticated
      return;
    }

    // Fetch user profile
    axios
      .get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("accessToken"); // Remove expired token
        navigate("/login"); // Redirect to login
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h2>Welcome, {user ? user.fullName : "User"}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
