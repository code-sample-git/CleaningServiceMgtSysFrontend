import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // Placeholder authentication logic
    if (email === "" && password === "") {
      setUser({ email, name: "John Doe", profileImage: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" });
      navigate("/home");
    }
  };

  const handleReset = () => {
    navigate("/forgot-password");
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
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