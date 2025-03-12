import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "client", // Default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register", // Adjust if needed
        userData
      );

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleRegister}>
        <label>First Name:</label>
        <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} required />

        <label>Last Name:</label>
        <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={userData.email} onChange={handleChange} required />

        <label>Password:</label>
        <input type="password" name="password" value={userData.password} onChange={handleChange} required />

        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} required />

        <label>Role:</label>
        <select name="role" value={userData.role} onChange={handleChange}>
          <option value="client">Client</option>
          <option value="staff">Staff</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
      <p onClick={() => navigate("/login")} className="login-link">
        Already have an account? Login
      </p>
    </div>
  );
};

export default RegisterPage;
