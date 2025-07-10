import React from "react";
import "../../Styles/Profile.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout, authLoading } = useAuth();
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (authLoading) return <p className="profile-loading">Loading profile...</p>;
  if (!user) return <p className="profile-error">Error: User not found</p>;

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
