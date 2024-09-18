import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import profileIcon from "../assets/user-profile-icon.png";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({
  suggestions, // All NPOs are passed as suggestions
  handleLogin,
  handleSignUp,
  userProfile,
  onSearch,
  userId,
}) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
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
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setLoggedIn(false);
        }
      } else {
        setLoggedIn(false);
      }
    };

    fetchUserData();
  }, []);

  // Debounced search logic to filter suggestions
  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      if (onSearch) {
        onSearch(nextValue);
      }
      if (nextValue) {
        // Filter suggestions based on the search term
        const filtered = suggestions.filter(
          (suggestion) =>
            suggestion["שם עמותה בעברית"]
              .toLowerCase()
              .includes(nextValue.toLowerCase()) ||
            suggestion["מטרות עמותה"]
              ?.toLowerCase()
              .includes(nextValue.toLowerCase()) // Adjust the field name as needed
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setFilteredSuggestions([]); // Clear filtered suggestions if input is empty
        setShowSuggestions(false);
      }
    }, 300),
    [onSearch, suggestions]
  );

  useEffect(() => {
    console.log("Filtered Suggestions:", filteredSuggestions); // Log whenever filtered suggestions change
    console.log("Show suggestions:", showSuggestions); // Log the showSuggestions state
  }, [filteredSuggestions, showSuggestions]);

  // Handle input change for search
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?query=${searchInput}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestionId) => {
    navigate(`/AssociationPage/${suggestionId}`);
    setSearchInput("");
    setShowSuggestions(false);
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
              //onKeyPress={handleKeyPress}
            />
            {showSuggestions && filteredSuggestions?.length > 0 && (
              <div className="suggestions-dropdown">
                {filteredSuggestions.slice(0, 7).map((suggestion) => (
                  <div
                    key={suggestion._id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion._id)}
                  >
                    {suggestion["שם עמותה בעברית"]}
                  </div>
                ))}
              </div>
            )}
            {showSuggestions && filteredSuggestions?.length === 0 && (
              <div className="no-suggestions">No results found</div>
            )}
          </div>

          {/* Advanced Category Search */}
          <button
            className="header-tab"
            onClick={() => navigate("/advanced-search")}
          >
            {t("חיפוש קטגוריות")}
          </button>

          {/* About Us */}
          <button className="header-tab" onClick={() => navigate("/about-us")}>
            {t("קצת עלינו")}
          </button>

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
