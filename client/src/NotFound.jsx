import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <h2 className="notfound-title">אופס!</h2>
        <p className="notfound-message">
          לא מצאת מה שחיפשת? בואו חזרו לדף הבית ונסו שוב!
        </p>
        <button onClick={handleHomeClick} className="home-button">
          חזרה לדף הבית
        </button>
      </div>
    </div>
  );
};

export default NotFound;
