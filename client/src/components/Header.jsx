import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import debounce from "lodash.debounce";

const Header = ({
  handleLogin,
  handleSignUp,
  userProfile,
  onSearch,
  suggestions,
  loggedIn,
}) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedSearch = useCallback(
    debounce((nextValue) => {
      onSearch(nextValue);
      setShowSuggestions(true); // Show suggestions when user types
    }, 300),
    [onSearch]
  );

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchInput); // Trigger full search
    setShowSuggestions(false); // Hide suggestions
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(searchInput); // Trigger search on enter
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearch(suggestion); // Search directly for the clicked suggestion
    setShowSuggestions(false); // Hide suggestions after click
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
            {showSuggestions && suggestions && suggestions.length > 0 && (
              <ul className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="header-tab"
            aria-label="Search"
          >
            {t("חיפוש")}
          </button>

          {/* Advanced search placeholder */}
          <button
            onClick={() => console.log("Advanced search clicked")}
            className="header-tab"
          >
            {t("חיפוש מתקדם")}
          </button>

          {/* Conditional Login/Profile */}
          {!loggedIn ? (
            <button
              className="header-tab"
              onClick={handleLogin}
              aria-label="Login"
            >
              {t("login")}
            </button>
          ) : (
            <button
              className="header-tab"
              onClick={userProfile}
              aria-label="User Profile"
            >
              {t("profile")}
            </button>
          )}

          {/* About Us Tab */}
          <button className="header-tab">{t("קצת עלינו")}</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
