import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Import your auth context hook
import "../../Styles/Login.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CustomLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // use login method from context

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
        { email, password },
        { withCredentials: true }
      );

      const accessToken = res.data.accessToken;
      if (accessToken) {
        login(accessToken); // Use context login to store token and fetch user
        
      }

      setMessage("Login successful");
      setEmail("");
      setPassword("");
      navigate("/profile"); // Redirect after successful login
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
  };

  return (
    <div className="custom-login-form">
      <h2>Login to Your Account</h2>

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
          Forgot password?
        </span>
      </div>

      <button
        className="login-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        New to MetaSpace?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={goToSignup}>
          Register Now
        </span>
      </p>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loader">Please Wait</div>}
      {message && <div className="success-message">{message}</div>}
    </div>
  );
};

export default CustomLogin;
