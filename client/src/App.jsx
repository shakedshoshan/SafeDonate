// src/App.jsx
import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header"; // Import the Header component
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile";
import AssociationPage from "./AssociationPage"
import "./App.css"; // Ensure that the App.css is imported
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const App = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const userProfile = () => {
    navigate("/profile");
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <Header handleLogin={handleLogin} handleSignUp={handleSignUp} userProfile={userProfile} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AssociationPage/:id" element={<AssociationPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<UserProfile/>} />
      </Routes>
    </div>
  );
};

export default App;
