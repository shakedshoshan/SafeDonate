import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import backgroundImg from "./assets/background.png";

const Home = ({ setSuggestions, setNpoData }) => {
  const [data, setData] = useState([]); // NPO data fetched from API
  const [randomNPOs, setRandomNPOs] = useState([]); // Random NPOs for display
  const [loading, setLoading] = useState(true);
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

  // Fetch user info
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

    fetchUserInfo();
  }, []);

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
    <div
      className="home"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        padding: "20px",
      }}
    >
      <h1 className="home-title">
        {i18n.language === "he"
          ? "ברוכים הבאים ל-SafeDonate"
          : "Welcome to SafeDonate"}
      </h1>

      <div className="grid-container">
        {randomNPOs.map((npo, index) => (
          <div
            key={index}
            className="grid-item"
            onClick={() => navigate(`/AssociationPage/${npo["מספר עמותה"]}`)}
          >
            <div className="grid-item-title">{npo["שם עמותה בעברית"]}</div>
            <div className="grid-item-content">
              {npo["מטרות עמותה"] || "No description available"}
            </div>
          </div>
        ))}
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

// import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import "./Home.css";
// import AssociationCrusel from "./components/AssociationCrusel";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { useSearchParams, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
// import backgroundImg from "./assets/background.png";

// const Home = ({
//   filteredData,
//   setFilteredData,
//   searchTerm,
//   setSuggestions,
//   setNpoData,
// }) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user, setUser] = useState();
//   const { t, i18n } = useTranslation();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate(); // useNavigate for redirects
//   const location = useLocation(); // Get the state passed from AdvancedSearch
//   const { filteredNPOs } = location.state || {}; // Extract filtered NPOs from the state if available
//   const dataToDisplay = filteredData.length > 0 ? filteredData : data;

//   // Fetch user info and association data
//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       const token = Cookies.get("token");
//       if (!token) {
//         console.log("No token found, user is not authenticated.");
//         setUser(null);
//         return;
//       }
//       try {
//         const tokenResponse = await axios.post(
//           "http://localhost:3000/users/getToken",
//           { token }
//         );
//         if (tokenResponse.status === 200) {
//           setUser(tokenResponse.data);
//         } else {
//           throw new Error("Token verification failed.");
//         }
//       } catch (error) {
//         console.error("Error verifying token:", error);
//         Cookies.remove("token");
//         setUser(null);
//         setError(error.toString());
//       }
//     };

//     fetchUserInfo();
//   }, []);

//   // Fetch associations or use filteredNPOs
//   useEffect(() => {
//     useEffect(() => {
//       const fetchAssociationData = async () => {
//         try {
//           const response = await fetch(
//             "https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95"
//           );
//           const jsonData = await response.json();
//           const activeData = jsonData.result.records.filter(
//             (association) =>
//               association["סטטוס עמותה"] === "רשומה" ||
//               association["סטטוס עמותה"] === "פעילה"
//           );
//           setData(activeData);
//           setSuggestions(activeData);
//           setNpoData(activeData);
//           // Select 9 random NPOs
//           setRandomNPOs(activeData.slice(0, 9));
//         } catch (error) {
//           setError(error.toString());
//           console.error("Error fetching association data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchAssociationData();
//     }, []);

//     // Handle search filtering
//     useEffect(() => {
//       if (searchTerm) {
//         console.log("Search term entered:", searchTerm);

//         // Filter NPOs by name first
//         const nameMatches = data.filter(
//           (association) =>
//             association["שם עמותה בעברית"] &&
//             association["שם עמותה בעברית"].includes(searchTerm)
//         );
//         console.log("Name matches:", nameMatches);

//         // Filter NPOs by cause, excluding the ones already matched by name
//         const causeMatches = data.filter(
//           (association) =>
//             !nameMatches.includes(association) &&
//             association["מטרות עמותה"] &&
//             association["מטרות עמותה"].includes(searchTerm)
//         );
//         console.log("Cause matches:", causeMatches);

//         // Filter NPOs by number (מספר עמותה)
//         const numberMatches = data.filter(
//           (association) =>
//             !nameMatches.includes(association) &&
//             !causeMatches.includes(association) &&
//             association["מספר עמותה"] &&
//             association["מספר עמותה"].toString().includes(searchTerm)
//         );
//         console.log("Number matches:", numberMatches);

//         // Merge the results: nameMatches first, then causeMatches, then numberMatches
//         const finalResults = [
//           ...nameMatches,
//           ...causeMatches,
//           ...numberMatches,
//         ];
//         console.log("Final filtered results:", finalResults);

//         // If no results and the search term is a number, navigate to NOT_FOUND
//         if (finalResults.length === 0 && !isNaN(searchTerm)) {
//           console.log(
//             `NPO with number ${searchTerm} not found, redirecting...`
//           );
//           navigate("/not-found");
//         } else {
//           setFilteredData(finalResults);
//         }
//       } else {
//         setFilteredData(data); // Show all data if no search term
//       }
//     }, [searchTerm, data, setFilteredData, navigate]);

//     const getWelcomeMessage = () => {
//       return i18n.language === "he"
//         ? "ברוכים הבאים ל SafeDonate"
//         : t("welcome_message");
//     };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//       <div
//         className="home"
//         style={{ backgroundImage: `url(${backgroundImg})` }}
//       >
//         <h1 className="home-title">
//           {i18n.language === "he"
//             ? "ברוכים הבאים ל-SafeDonate"
//             : "Welcome to SafeDonate"}
//         </h1>

//         <div className="grid-container">
//           {randomNPOs.map((npo, index) => (
//             <div
//               key={index}
//               className="grid-item"
//               onClick={() => navigate(`/AssociationPage/${npo["מספר עמותה"]}`)}
//             >
//               <div className="grid-item-title">{npo["שם עמותה בעברית"]}</div>
//               <div className="grid-item-content">
//                 {npo["מטרות עמותה"] || "No description available"}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   });
// };
// export default Home;
