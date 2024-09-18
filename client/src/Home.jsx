import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";

import AssociationCrusel from "./components/AssociationCrusel";
import Cookies from "js-cookie";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom"; // Import useNavigate

const Home = ({
  filteredData,
  setFilteredData,
  searchTerm,
  setSuggestions,
  setNpoData,
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // useNavigate for redirects
  const dataToDisplay = filteredData.length > 0 ? filteredData : data;
  const query = searchParams.get("query");

  // Fetch user info and association data
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.log("No token found, user is not authenticated.");
        setUser(null);
        return;
      }
      try {
        const tokenResponse = await axios.post(
          "http://localhost:3000/users/getToken",
          { token }
        );
        if (tokenResponse.status === 200) {
          setUser(tokenResponse.data);
        } else {
          throw new Error("Token verification failed.");
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        Cookies.remove("token");
        setUser(null);
        setError(error.toString());
      }
    };

    const fetchAssociationData = async () => {
      try {
        const response = await fetch(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&limit=200"
        );
        if (!response.ok) {
          throw new Error(`Http error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        const activeData = jsonData.result.records.filter(
          (association) =>
            association["סטטוס עמותה"] === "רשומה" ||
            association["סטטוס עמותה"] === "פעילה"
        );
        console.log("Fetched active NPOs:", activeData); // Log fetched data
        setData(activeData);
        setFilteredData(activeData); // Use setFilteredData from props
        setSuggestions(activeData); // Set suggestions for the search bar
        setNpoData(activeData); // Pass NPO data to App
      } catch (error) {
        setError(error.toString());
        console.error("Error fetching association data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchAssociationData();
  }, [setSuggestions, setNpoData, setFilteredData]);

  // Handle search filtering
  useEffect(() => {
    if (searchTerm) {
      console.log("Search term entered:", searchTerm);

      // Filter NPOs by name first
      const nameMatches = data.filter(
        (association) =>
          association["שם עמותה בעברית"] &&
          association["שם עמותה בעברית"].includes(searchTerm)
      );
      console.log("Name matches:", nameMatches);

      // Filter NPOs by cause, excluding the ones already matched by name
      const causeMatches = data.filter(
        (association) =>
          !nameMatches.includes(association) &&
          association["מטרות עמותה"] &&
          association["מטרות עמותה"].includes(searchTerm)
      );
      console.log("Cause matches:", causeMatches);

      // Filter NPOs by number (מספר עמותה)
      const numberMatches = data.filter(
        (association) =>
          !nameMatches.includes(association) &&
          !causeMatches.includes(association) &&
          association["מספר עמותה"] &&
          association["מספר עמותה"].toString().includes(searchTerm)
      );
      console.log("Number matches:", numberMatches);

      // Merge the results: nameMatches first, then causeMatches, then numberMatches
      const finalResults = [...nameMatches, ...causeMatches, ...numberMatches];
      console.log("Final filtered results:", finalResults);

      // If no results and the search term is a number, navigate to NOT_FOUND
      if (finalResults.length === 0 && !isNaN(searchTerm)) {
        console.log(`NPO with number ${searchTerm} not found, redirecting...`);
        navigate("/not-found");
      } else {
        setFilteredData(finalResults);
      }
    } else {
      setFilteredData(data); // Show all data if no search term
    }
  }, [searchTerm, data, setFilteredData, navigate]);

  const getWelcomeMessage = () => {
    return i18n.language === "he"
      ? "ברוכים הבאים ל SafeDonate"
      : t("welcome_message");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <h3>{user?.email} is connected</h3>
          <h1 className="home-title p-12 text-4xl font-extrabold">
            {getWelcomeMessage()} {user?.email}
          </h1>
          <div>
            <AssociationCrusel dataList={dataToDisplay} userId={user?._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
