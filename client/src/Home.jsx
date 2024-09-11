import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import AssociationCrusel from "./components/AssociationCrusel";
import Cookies from "js-cookie";
import axios from "axios";

const Home = ({ searchTerm }) => {
  // Accept searchTerm as a prop
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("token");
      if (token) {
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
      const results = data.filter(
        (association) =>
          association["שם עמותה בעברית"] &&
          association["שם עמותה בעברית"].includes(searchTerm)
      );
      setFilteredData(results);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const getWelcomeMessage = () => {
    return i18n.language === "he"
      ? "ברוכים הבאים ל SafeDonate"
      : t("welcome_message");
  };

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
            <AssociationCrusel dataList={filteredData} userId={user?._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
