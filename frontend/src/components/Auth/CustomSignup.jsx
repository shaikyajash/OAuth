import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomSignup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false); // ✅

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(
        `${BACKEND_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );

      setMessage(res.data.message || "Signup successful. Please verify your email.");
      setEmail("");
      setPassword("");
      setShowResend(true); // ✅ Show "Resend Email" option
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/resend-verification`,
        { email },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Verification email resent.");
    } catch (err) {
      setError(err.response?.data?.message || "Resend failed.");
    }
  };

  return (
    <div className="custom-signup-form">
      <h2>Create Your Account</h2>

      <input
        type="text"
        placeholder="Enter Your Name"
        className="signup-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter your Email"
        className="signup-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your Password"
        className="signup-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="signup-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Signing up..." : "Signup"}
      </button>

      {showResend && (
        <button
          className="resend-button"
          style={{ marginTop: "10px" }}
          onClick={handleResendVerification}
        >
          Resend Verification Email
        </button>
      )}

      <p>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loader">Loading...</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default CustomSignup;
