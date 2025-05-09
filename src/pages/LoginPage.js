import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate("/home");
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleReset = () => navigate("/forgot-password");
  const handleRegister = () => navigate("/register");

  return (
    <div className="login-container">
      <div className="card">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnrssxO1WKp6L7ZblKOiDqNGEgQsivTW2trA&s"
          alt="ServicePro Logo"
          className="logo"
        />
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ flex: 1 }} onClick={handleLogin}>Login</button>
          <button style={{ flex: 1 }} className="secondary" onClick={handleReset}>Forgot Password?</button>
        </div>
        <button className="secondary" onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
}

export default LoginPage;
