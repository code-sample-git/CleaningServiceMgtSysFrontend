import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../utils/api';

const RegisterPage = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("staff");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { email, password, firstName, lastName, phoneNumber, role };
      const { data } = await register(userData);
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      setUser({
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`,
        profileImage: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
      });
      setMessage("Registration successful! Redirecting to login...");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setMessage("");
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrssxO1WKp6L7ZblKOiDqNGEgQsivTW2trA&s"
          alt="ServicePro Logo"
          className="logo"
        />
        <h2>Register</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone Number (optional)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
          </select>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;