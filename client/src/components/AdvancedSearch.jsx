import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdvancedSearch.css";

const AdvancedSearch = ({ npoData, setFilteredData }) => {
  const [activeTab, setActiveTab] = useState("קטגוריות"); // Default tab is categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [npoNumber, setNpoNumber] = useState("");
  const categories = Array.from(
    new Set(npoData.map((npo) => npo["סיווג פעילות ענפי"]))
  );
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearch = () => {
    if (activeTab === "קטגוריות") {
      const filteredNPOs = npoData.filter((npo) =>
        selectedCategories.includes(npo["סיווג פעילות ענפי"])
      );
      setFilteredData(filteredNPOs);
      navigate("/filtered-results", { state: { filteredNPOs } }); // Pass filtered NPOs to FilteredResultsPage
    } else if (activeTab === "מספר עמותה" && npoNumber) {
      const filteredNPOs = npoData.filter(
        (npo) => npo["מספר עמותה"].toString() === npoNumber
      );
      if (filteredNPOs.length === 0) {
        navigate("/not-found"); // Redirect to NOT_FOUND if NPO not found
      } else {
        navigate(`/AssociationPage/${npoNumber}`); // Redirect to the NPO's association page
      }
    }
  };

  return (
    <div className="advanced-search-page">
      <div className="advanced-search-container">
        <h2>למי תרצו לתרום</h2>

        <div className="tabs-container">
          <div
            className={`tab ${activeTab === "קטגוריות" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("קטגוריות");
              setSelectedCategories([]); // Clear selected categories on switch
            }}
          >
            קטגוריות
          </div>

          <div
            className={`tab ${activeTab === "מספר עמותה" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("מספר עמותה");
              setNpoNumber(""); // Clear NPO number on switch
            }}
          >
            מספר עמותה
          </div>
        </div>

        {activeTab === "קטגוריות" ? (
          <div className="bubble-buttons">
            {categories.map((category) => (
              <button
                key={category}
                className={`bubble-button ${
                  selectedCategories.includes(category) ? "selected" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <div className="npo-number-input">
            <input
              type="text"
              placeholder="הזן מספר עמותה"
              value={npoNumber}
              onChange={(e) => setNpoNumber(e.target.value)}
            />
          </div>
        )}

        <button className="search-button" onClick={handleSearch}>
          חפש
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/AdvancedSearch.css";

// const AdvancedSearch = ({ npoData, setFilteredData }) => {
//   const [activeTab, setActiveTab] = useState("קטגוריות"); // Default tab is categories
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [npoNumber, setNpoNumber] = useState("");
//   const categories = Array.from(
//     new Set(npoData.map((npo) => npo["סיווג פעילות ענפי"]))
//   );
//   const navigate = useNavigate();

//   const handleCategoryClick = (category) => {
//     if (selectedCategories.includes(category)) {
//       setSelectedCategories(selectedCategories.filter((c) => c !== category));
//     } else if (selectedCategories.length < 3) {
//       setSelectedCategories([...selectedCategories, category]);
//     }
//   };

//   const handleSearch = () => {
//     if (activeTab === "קטגוריות") {
//       const filteredNPOs = npoData.filter((npo) =>
//         selectedCategories.includes(npo["סיווג פעילות ענפי"])
//       );
//       setFilteredData(filteredNPOs);
//       navigate("/", { state: { filteredNPOs } }); // Pass filtered NPOs to Home
//     } else if (activeTab === "מספר עמותה" && npoNumber) {
//       const filteredNPOs = npoData.filter(
//         (npo) => npo["מספר עמותה"] === npoNumber
//       );
//       if (filteredNPOs.length === 0) {
//         navigate("/not-found"); // Redirect to NOT_FOUND if NPO not found
//       } else {
//         setFilteredData(filteredNPOs);
//         navigate("/", { state: { filteredNPOs } }); // Pass filtered NPOs to Home
//       }
//     }
//   };

//   return (
//     <div className="advanced-search-page">
//       <div className="advanced-search-container">
//         <h2>למי תרצו לתרום</h2>

//         <div className="tabs-container">
//           <div
//             className={`tab ${activeTab === "קטגוריות" ? "active" : ""}`}
//             onClick={() => {
//               setActiveTab("קטגוריות");
//               setSelectedCategories([]); // Clear selected categories on switch
//             }}
//           >
//             קטגוריות
//           </div>

//           <div
//             className={`tab ${activeTab === "מספר עמותה" ? "active" : ""}`}
//             onClick={() => {
//               setActiveTab("מספר עמותה");
//               setNpoNumber(""); // Clear NPO number on switch
//             }}
//           >
//             מספר עמותה
//           </div>
//         </div>

//         {activeTab === "קטגוריות" ? (
//           <div className="bubble-buttons">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 className={`bubble-button ${
//                   selectedCategories.includes(category) ? "selected" : ""
//                 }`}
//                 onClick={() => handleCategoryClick(category)}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         ) : (
//           <div className="npo-number-input">
//             <input
//               type="text"
//               placeholder="הזן מספר עמותה"
//               value={npoNumber}
//               onChange={(e) => setNpoNumber(e.target.value)}
//             />
//           </div>
//         )}

//         <button className="search-button" onClick={handleSearch}>
//           חפש
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdvancedSearch;
