import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Header.css";
import logo from "../assets/logo.png";
import debounce from "lodash.debounce"; // Ensure lodash.debounce is installed

const Header = ({ handleLogin, handleSignUp, userProfile, onSearch }) => {
  const { t, i18n } = useTranslation();
  const [searchInput, setSearchInput] = useState("");

  const debouncedSearch = useCallback(
    debounce((nextValue) => onSearch(nextValue), 300),
    [] // Dependency array
  );

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchClick = () => {
    console.log("Search button clicked with input:", searchInput);
    onSearch(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      console.log("Enter pressed with input:", searchInput);
      onSearch(searchInput);
    }
  };

  return (
    <header className="header" aria-label="Main header">
      <div className="header-container">
        <div className="header-title">
          <a href="/">
            <img src={logo} alt="SafeDonate Logo" className="header-logo" />
          </a>
        </div>
        <div className="header-nav">
          <input
            type="text"
            placeholder={t("search")}
            aria-label="Search NPOs"
            className="search-bar"
            value={searchInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSearchClick}
            className="header-button"
            aria-label="Search"
          >
            {t("חיפוש")}
          </button>
          <button
            className="header-button"
            onClick={handleLogin}
            aria-label="Login"
          >
            {t("login")}
          </button>
          <button
            className="header-button"
            onClick={handleSignUp}
            aria-label="Sign Up"
          >
            {t("signup")}
          </button>
          <button
            className="header-button"
            onClick={userProfile}
            aria-label="User Profile"
          >
            {t("profile")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
