// src/components/Header.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Header.css"; // Adjusted path for CSS
import logo from "../assets/logo.png"; // Updated to the new logo.png

const Header = ({ handleLogin, handleSignUp }) => {
  const { t, i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? "he" : "en";
    i18n.changeLanguage(newLanguage);
    setIsEnglish(!isEnglish);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-title">
          <a href="/">
            <img src={logo} alt="SafeDonate Logo" className="header-logo" />
          </a>
        </div>
        <div className="header-nav">
          <input type="text" placeholder={t("search")} className="search-bar" />
          <button className="header-button">{t("support")}</button>
          <button className="header-button" onClick={handleLogin}>
            {t("login")}
          </button>
          <button className="header-button" onClick={handleSignUp}>
            {t("signup")}
          </button>
          <button className="header-button" onClick={toggleLanguage}>
            {isEnglish ? "EN / HE" : "HE / EN"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
