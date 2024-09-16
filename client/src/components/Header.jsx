import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import profileIcon from "../assets/user-profile-icon.png";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AssociationCrusel from "./AssociationCrusel";
import AssociationCard from "./AssociationCard";

const Header = ({
  handleLogin,
  handleSignUp,
  userProfile,
  onSearch,
  suggestions,
  userId,
}) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // To store login state
  const [userName, setUserName] = useState(""); // To store user's name
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from cookies and token
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const tokenResponse = await axios.post(
            "http://localhost:3000/users/getToken",
            { token }
          );
          if (tokenResponse.status === 200) {
            const userData = tokenResponse.data;
            setUserName(`${userData.firstName} ${userData.lastName}`);
            setLoggedIn(true); // User is authenticated
          } else {
            setLoggedIn(false); // Failed to authenticate user
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoggedIn(false); // Handle token verification failure
        }
      } else {
        setLoggedIn(false); // No token found
      }
    };

    fetchUserData(); // Call the function when the component mounts
  }, []); // Empty dependency array ensures it runs once

  // Logs for debugging
  useEffect(() => {
    console.log("Logged in:", loggedIn);
    console.log("User name:", userName);
  }, [loggedIn, userName]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      onSearch(nextValue);
      setShowSuggestions(true);
    }, 300),
    [onSearch]
  );

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${searchInput}`); // Navigate to search results page
      setShowSuggestions(false); // Hide suggestions
    }
  };

  const handleSuggestionClick = (suggestionId) => {
    navigate(`/AssociationPage/${suggestionId}`); // Navigate to the selected association page
    setShowSuggestions(false); // Hide suggestions after selection
  };

  const getUserInitials = () => {
    if (!userName) return "";
    const nameParts = userName.split(" ");
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[1]
      ? nameParts[1].charAt(0).toUpperCase()
      : "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <header className="header" aria-label="Main header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-title">
          <a href="/">
            <img src={logo} alt="SafeDonate Logo" className="header-logo" />
          </a>
        </div>

        {/* Navigation */}
        <div className="header-nav">
          {/* Search bar */}
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder={t("search")}
              aria-label="Search NPOs"
              className="search-bar"
              value={searchInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            {showSuggestions && suggestions?.length > 0 && (
              <AssociationCrusel
                dataList={filteredData}
                userId={user?._id}
              ></AssociationCrusel>
            )}
          </div>

          {/* Advanced Category Search */}
          <button className="header-tab">{t("חיפוש קטגוריות")}</button>

          {/* About Us */}
          <button className="header-tab">{t("קצת עלינו")}</button>

          {/* Profile Picture or Initials */}
          <div
            className="profile-circle"
            onClick={loggedIn ? userProfile : handleLogin}
          >
            {loggedIn ? (
              <span className="profile-initials">{getUserInitials()}</span>
            ) : (
              <img src={profileIcon} alt="Profile" className="profile-icon" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
