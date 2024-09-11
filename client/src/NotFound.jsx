import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css"; // Assuming you have a CSS file for styling

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <button onClick={() => navigate("/")}>Go to Homepage</button>
    </div>
  );
};

export default NotFound;
