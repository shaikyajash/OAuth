import React, { useState } from "react";
import axios from "axios";
import "../../Styles/ResetPassword.css"; // Path to your CSS file
import { useNavigate, useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/auth/reset-password/${token}`,
        {password},
        { withCredentials: true }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      <div className="reset-password-form">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="reset-password-button" onClick={handleResetPassword}>
          Reset Password
        </button>

        <button className="login-button" onClick={() => navigate("/login")}>
          Back to Login
        </button>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
