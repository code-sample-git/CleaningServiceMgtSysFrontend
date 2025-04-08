import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../utils/api'; // Import API utility

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(""); // Clear previous errors
      const { data } = await login({ email, password });
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      // Update user state
      setUser({
        email: data.user.email,
        name: `${data.user.firstName} ${data.user.lastName}`,
        profileImage: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg", // Keep placeholder
      });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleReset = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-container">
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
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleReset}>Forgot Password?</button>
    </div>
  );
}

export default LoginPage;