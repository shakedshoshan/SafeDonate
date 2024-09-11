import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile";
import AssociationPage from "./AssociationPage";
import NotFound from "./NotFound"; // Assuming you have a NotFound component
import "./App.css";
import { useTranslation } from "react-i18next";

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
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [npoData, setNpoData] = useState([]); // Example state for NPO data
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add state for search term

  const handleLogin = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleSignUp = () => {
    navigate(ROUTES.SIGNUP);
  };

  const userProfile = () => {
    navigate(ROUTES.PROFILE);
  };

  const handleSearch = (searchTerm) => {
    console.log("handleSearch called with:", searchTerm);
    setSearchTerm(searchTerm); // Set the search term in the App state
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      <Header
        handleLogin={handleLogin}
        handleSignUp={handleSignUp}
        userProfile={userProfile}
        onSearch={handleSearch}
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
