import React from "react";
import Signup from "./components/Screens/Signup";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Screens/Login";
import Profile from "./components/Profile/Profile";
import ForgotPassword from "./components/Screens/ForgotPassword";
import Verification from "./components/Screens/Verification";
import ResetPassword from "./components/Screens/ResetPassword";
import { TestScreen } from "./components/Screens/TestScreen";
import PrivateRoute from "./components/Auth/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/test" element = {<TestScreen/>}/>
      <Route path="/" element={<Navigate to="/login" replace/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={
        <PrivateRoute>

          <Profile />
        </PrivateRoute>
        } />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<Verification/>} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
