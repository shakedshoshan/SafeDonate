import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile";
import AssociationPage from "./AssociationPage";
import NotFound from "./NotFound";
import "./App.css";

// Define route paths as constants
const ROUTES = {
  HOME: "/",
  ASSOCIATION_PAGE: "/AssociationPage/:id",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  NOT_FOUND: "*",
};

const App = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  const userProfile = () => {
    navigate("/profile");
  };
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const handleSearch = (term) => {
    console.log("Search initiated with:", term);
    setSearchTerm(term); // Update the searchTerm state
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <Header
        onSearch={handleSearch}
        handleLogin={handleLogin}
        userProfile={userProfile}
      />
      <Routes>
        <Route path={ROUTES.HOME} element={<Home searchTerm={searchTerm} />} />
        <Route path={ROUTES.ASSOCIATION_PAGE} element={<AssociationPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.PROFILE} element={<UserProfile />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
