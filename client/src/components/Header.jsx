import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import profileIcon from "../assets/user-profile-icon.png";
import debounce from "lodash.debounce";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";


const Header = ({ handleLogin }) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const { authUser } = useAuthContext();

  const navigate = useNavigate();

  // Debounced search logic to query the API for suggestions
  const debouncedSearch = useCallback(
    debounce(async (nextValue) => {
      if (nextValue) {
        try {
          const response = await axios.get(
            `https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95`,
            {
              params: {
                q: nextValue, // The search query passed to the API
              },
            }
          );

          // Filter by status and match partial words with the input value
          const filtered = response.data.result.records.filter(
            (association) =>
              (association["סטטוס עמותה"] === "רשומה" ||
                association["סטטוס עמותה"] === "פעילה") &&
              association["שם עמותה בעברית"].includes(nextValue)
          );

          setFilteredSuggestions(filtered);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching NPO data:", error);
          setFilteredSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

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

  const userProfile = () => {
    navigate(`/profile/${authUser._id}`);
  };

  useEffect(() => {
    if (authUser) {
      setLoggedIn(true);
    }
  },[authUser])

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
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {filteredSuggestions.slice(0, 7).map((suggestion) => (
                  <div
                    key={suggestion["מספר עמותה"]}
                    className="suggestion-item"
                    onClick={() =>
                      handleSuggestionClick(suggestion["מספר עמותה"])
                    }
                  >
                    {suggestion["שם עמותה בעברית"]}
                  </div>
                ))}
              </div>
            )}
            {showSuggestions && filteredSuggestions.length === 0 && (
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
            className=""//"profile-circle"
            onClick={loggedIn ? userProfile : handleLogin}
          >
            {loggedIn ? (
              <div className="profile-circle bg-[#7199e9]  hover:bg-[#264bae] hover:scale-110 transition cursor-pointer">
                {/* <span className="profile-initials">{getUserInitials()}</span> */}
                  <span className="z-50 text-2xl text-white flex items-center justify-center">
                    {authUser.firstName[0].toUpperCase()}{authUser.lastName[0].toUpperCase()}
                  </span>
              </div>
            ) : (
              <div>
                <img src={profileIcon} alt="Profile" className="w-14 h-14 bg-[#ffffff] rounded-full border-white "/>
                
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;