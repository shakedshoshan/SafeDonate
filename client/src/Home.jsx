// src/Home.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import AssociationCrusel from "./components/AssociationCrusel";
import GoogleCustomSearch from "./components/Cse";
import Cookies from 'js-cookie';
import axios from "axios"


const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const tokenResponse = await axios.post("http://localhost:3000/users/getToken", { token });
          if (tokenResponse.status === 200) {
            setUser(tokenResponse.data);
          } else {
            console.log("Token verification failed.");
            Cookies.remove("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          Cookies.remove("token");
          setUser(null);
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
        
        const filteredData = jsonData.result.records.filter(
          (association) =>
            association["סטטוס עמותה"] === "רשומה" ||
            association["סטטוס עמותה"] === "פעילה"
        );
        setData(filteredData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    // Execute both functions on page load
    fetchUserInfo();   // User token verification
    fetchAssociationData();  // Fetch associations data
  
  }, []);
  
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
        <p>Error: {error.message}</p>
      ) : (
        <div>
          <h3>{user?.email} is connected</h3>
          <h1 className="home-title p-12 text-4xl  font-extrabold">{getWelcomeMessage()} {user?.email}</h1>
          <div>
            <AssociationCrusel dataList={data} userId={user?._id}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;


  {/* <div className="grid-container"> */}
            {/* {data.map((name, index) => (
              <div key={index} className="grid-item clickable-tab cursor-pointer hover:scale-105 transition">
                {name} 
              </div>
            ))} */}
            {/* <GoogleCustomSearch /> */}

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {

  //       // fetch user info from token
  //       const token = Cookies.get("token");
  //       console.log(token)
  //       if(token){
  //         const tokenResponse = await axios.post("http://localhost:3000/users/getToken", { token: token })
  //           if (tokenResponse.status === 200) {
  //             setUser(tokenResponse.data);
  //           } else {
  //             setError(error);
  //             console.log("Bad request. You have problem with token verifacation.");
  //           }
  //       }

  //       const response = await fetch(
  //         "https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&limit=200"
  //       );
  //       if (!response.ok) {
  //         throw new Error(`Http error! status: ${response.status}`);
  //       }
  //       const jsonData = await response.json();
        
  //       const filteredData = jsonData.result.records.filter(
  //         (association) =>
  //           association["סטטוס עמותה"] === "רשומה" ||
  //           association["סטטוס עמותה"] === "פעילה"
  //       );
  //       setData(filteredData);

  //       setLoading(false);
  //     } catch (error) {
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);