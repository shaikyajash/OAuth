import React, { useState } from 'react';
import axios from 'axios';
import "../../Styles/ForgotPassword.css";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');

      const res = await axios.post(`${BACKEND_URL}/auth/forgot-password`, { email });

      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="forgot-password-input"
      />
      <button onClick={handleForgotPassword} disabled={loading} className="forgot-password-button">
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default ForgotPassword;
