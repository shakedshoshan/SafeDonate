import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./Home"; // Import Home component
import AssociationPage from "./AssociationPage";
import Login from "./Login";
import SignUp from "./SignUp";
import UserProfile from "./UserProfile";
import AboutUs from "./AboutUs";
import NotFound from "./NotFound";

const ROUTES = {
  HOME: "/",
  ASSOCIATION_PAGE: "/AssociationPage/:id",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile",
  ABOUTUS: "/about-us",
  NOT_FOUND: "*",
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Control search term in App
  const [suggestions, setSuggestions] = useState([]); // This is important: make sure `setSuggestions` is defined

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      {/* Pass searchTerm and suggestions to Header */}
      <Header
        onSearch={handleSearch}
        suggestions={suggestions} // Pass suggestions here
        handleLogin={() => {}}
        userProfile={() => {}}
      />
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Home searchTerm={searchTerm} setSuggestions={setSuggestions} />
          } // Pass setSuggestions to Home
        />
        <Route path={ROUTES.ASSOCIATION_PAGE} element={<AssociationPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SIGNUP} element={<SignUp />} />
        <Route path={ROUTES.PROFILE} element={<UserProfile />} />
        <Route path={ROUTES.ABOUTUS} element={<AboutUs />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
