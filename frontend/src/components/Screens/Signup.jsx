import React from "react";
import GoogleAuth from "../Auth/GoogleAuth";
import CustomSignup from "../Auth/CustomSignup";
import "../../Styles/Signup.css";

const Signup = () => {
  return (
    <div className="signup-container">
      <h1>Signup</h1>
      <div className="form-container">
        <CustomSignup />
        <p>or</p>
        <GoogleAuth />
      </div>
    </div>
  );
};

export default Signup;