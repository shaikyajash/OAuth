import React from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // import your auth context hook

const ClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const GoogleAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // get login from context

  const handleGoogleSignup = async (response) => {
    try {
      const idtoken = response.credential;
      if (!idtoken) throw new Error("Google token not received");

      const res = await axios.post(
        `${BACKEND_URL}/auth/googleAuth`,
        { idtoken },
        { withCredentials: true }
      );

      const accessToken = res.data.accessToken;
      if (accessToken) {
        // Use context login to set token and fetch user profile
        login(accessToken);
      }

      navigate("/profile");
    } catch (error) {
      console.error(
        "Error during Google Signup:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  const handleError = (error) => {
    console.error("Google Login Failed:", error);
    alert("Google authentication failed");
  };

  return (
    <GoogleOAuthProvider clientId={ClientId}>
      <div className="google-login-container">
        <GoogleLogin
          text="continue_with"
          onSuccess={handleGoogleSignup}
          onError={handleError}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
