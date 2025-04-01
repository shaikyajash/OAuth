import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/Login.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await axios.post(
        `${BACKEND_URL}/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      setEmail("");
      setPassword("");
      navigate("/profile"); // Redirect to profile page after successful login
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  }

  return (
    <div className="custom-login-form">
      <h2>Create Your Account</h2>

      <input
        type="text"
        placeholder="Enter your Email"
        className="login-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ display: "flex", width: "100%" }}>
        <span
          style={{ color: "blue", cursor: "pointer", marginLeft: "auto" }}
          onClick={handleForgotPassword}
        >
          forgot password?
        </span>
      </div>
      <button
        className="login-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Loging in..." : "Login"}
      </button>
      <p>
        New to MetaSpace?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={goToSignup}>
          Register Now
        </span>
      </p>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loader">Loading...</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default CustomLogin;
