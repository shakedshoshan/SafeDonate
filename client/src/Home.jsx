import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import AssociationCrusel from "./components/AssociationCrusel";
import Cookies from "js-cookie";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Home = ({ searchTerm }) => {
  // Accept searchTerm as a prop
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.log("No token found, user is not authenticated.");
        setUser(null); // Clear user state if no token
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
        console.log(jsonData);
        const activeData = jsonData.result.records.filter(
          (association) =>
            association["סטטוס עמותה"] === "רשומה" ||
            association["סטטוס עמותה"] === "פעילה"
        );
        console.log(activeData);
        setData(activeData);
        setFilteredData(activeData);
      } catch (error) {
        setError(error.toString());
        console.error("Error fetching association data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    fetchAssociationData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Filter NPOs by name first
      const nameMatches = data.filter(
        (association) =>
          association["שם עמותה בעברית"] &&
          association["שם עמותה בעברית"].includes(searchTerm)
      );

      // Filter NPOs by cause, excluding the ones already matched by name
      const causeMatches = data.filter(
        (association) =>
          !nameMatches.includes(association) && // Ensure no duplicates
          association["מטרות עמותה"] &&
          association["מטרות עמותה"].includes(searchTerm)
      );

      const numberMatches = data.filter(
        (association) =>
          !nameMatches.includes(association) &&
          !causeMatches.includes(association) &&
          association["מספר עמותה"] &&
          association["מספר עמותה"].toString().includes(searchTerm)
      );

      // Merge the results: nameMatches first, then causeMatches, then numberMatches
      setFilteredData([...nameMatches, ...causeMatches, ...numberMatches]);
    } else {
      setFilteredData(data); // Show all data if no search term
    }
  }, [searchTerm, data]);

  const getWelcomeMessage = () => {
    return i18n.language === "he"
      ? "ברוכים הבאים ל SafeDonate"
      : t("welcome_message");
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          const response = await axios.get(`/api/search?q=${query}`);
          setData(response.data); // Assuming backend returns matching NPOs
        } catch (error) {
          setError(error.toString());
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>List of NPOs</h1>
      <ul>
        {filteredData.map((npo) => (
          <li key={npo["מספר עמותה"]}>{npo["שם עמותה בעברית"]}</li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
