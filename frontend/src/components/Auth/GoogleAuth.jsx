import React from "react";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const ClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const GoogleAuth = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = async (response) => {
    try {
      const idtoken = response.credential;
      if (!idtoken) throw new Error("Google token not received");

      const res = await axios.post(
        `${BACKEND_URL}/auth/GoogleAuth`,

        { idtoken },
        { withCredentials: true }
      );

      console.log("Signup successful:", res.data);
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
