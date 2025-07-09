import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../Styles/Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
     setUser(null);
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/profile`, {
          withCredentials: true,
        });
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      

      navigate("/login"); 
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <p className="profile-loading">Loading profile...</p>;
  if (error) return <p className="profile-error">Error: {error}</p>;

  const proxyUrl = "https://api.allorigins.win/raw?url=";
  const imageUrl = user?.picture
    ? proxyUrl + encodeURIComponent(user.picture)
    : null;

  return (
    <div className="profile-container">
      <h1 className="profile-heading">Welcome, {user?.name || "User"}!</h1>
      <p className="profile-email">Email: {user?.email}</p>
      {imageUrl && (
        <img className="profile-image" src={imageUrl} alt="User Profile" />
      )}
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
