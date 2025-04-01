import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../Styles/Verification.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Verification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const verifyEmail = async () => {
      try {
        const url = `${BACKEND_URL}/auth/verify-email/${token}`;
        console.log("Verification URL:", url);
        const res = await axios.get(url);
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or Expired Token");
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="verification-container">
      <h2>Email Verification</h2>
      {loading && <p className="loading-message">Verifying your email...</p>}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <button className="back-home-btn" onClick={() => navigate('/login')}>
        Go to Login Screen
      </button>
    </div>
  );
};

export default Verification;
