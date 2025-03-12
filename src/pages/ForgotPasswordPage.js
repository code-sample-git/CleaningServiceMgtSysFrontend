import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (email) {
      setIsCodeSent(true);
    }
  };

  const handleVerifyCode = () => {
    if (verificationCode) {
      navigate("/login");
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {!isCodeSent ? (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendCode}>Submit</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleVerifyCode}>Verify</button>
        </>
      )}
    </div>
  );
}

export default ForgotPasswordPage;