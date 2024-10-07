import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import  AssociationCrusel  from "./components/AssociationCrusel";

const Home = ({ setSuggestions, setNpoData }) => {
  const [data, setData] = useState([]); // NPO data fetched from API
  const [randomNPOs, setRandomNPOs] = useState([]); // Random NPOs for display
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthContext();
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { filteredNPOs } = location.state || {}; // Get NPOs from advanced search if available

  // Helper function to get 9 random NPOs
  const getRandomNPOs = (npoList) => {
    const shuffled = [...npoList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9); // Select 9 random NPOs
  };

  // Fetch associations or use filtered NPOs from advanced search
  useEffect(() => {
    if (filteredNPOs && filteredNPOs.length > 0) {
      setRandomNPOs(getRandomNPOs(filteredNPOs)); // Randomize 9 NPOs from filtered list
    } else {
      const fetchAssociationData = async () => {
        try {
          const response = await fetch(
            "https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95"
          );
          const jsonData = await response.json();
          const activeData = jsonData.result.records.filter(
            (association) =>
              association["סטטוס עמותה"] === "רשומה" ||
              association["סטטוס עמותה"] === "פעילה"
          );
          setData(activeData);
          setSuggestions(activeData);
          setNpoData(activeData);
          setRandomNPOs(getRandomNPOs(activeData)); // Select 9 random NPOs
        } catch (error) {
          setError(error.toString());
          console.error("Error fetching association data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAssociationData();
    }
  }, [filteredNPOs, setSuggestions, setNpoData]);

  const getWelcomeMessage = () => {
    return i18n.language === "he"
      ? "ברוכים הבאים ל SafeDonate"
      : t("welcome_message");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home pb-5px" >
      <h1 className="home-title pb-5px">
        {i18n.language === "he"
          ? "ברוכים הבאים ל-SafeDonate"
          : "Welcome to SafeDonate"}
      </h1>
      <div>
        <AssociationCrusel dataList={randomNPOs} userId={authUser?.id} />
      </div>

      {/* Button to redirect to advanced search */}
      <div className="more-npos-button-container">
        <button
          className="more-npos-button"
          onClick={() => navigate("/advanced-search")}
        >
          חפשו עוד עמותות
        </button>
      </div>
    </div>
  );
};

export default Home;
