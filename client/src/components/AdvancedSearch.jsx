import React, { useState } from "react";
import "../styles/AdvancedSearch.css"; // Corrected path

const AdvancedSearch = ({ npoData }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [companyNumber, setCompanyNumber] = useState("");

  const categories = Array.from(
    new Set(npoData.map((npo) => npo["סיווג פעילות ענפי"])) // Extract unique categories from NPO data
  );

  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearchByCategories = () => {
    const filteredNPOs = npoData.filter((npo) =>
      selectedCategories.includes(npo["סיווג פעילות ענפי"])
    );
    console.log("Filtered NPOs based on categories:", filteredNPOs);
  };

  const handleSearchByCompanyNumber = () => {
    const npo = npoData.find((npo) => npo["מספר חברה"] === companyNumber);
    console.log(npo ? "NPO found:" : "No NPO found.", npo);
  };

  return (
    <div className="advanced-search-container">
      <h1 className="advanced-search-title">למי תרצה לעזור</h1>
      <div className="advanced-search-options">
        <button
          className="advanced-search-button"
          onClick={() => setCompanyNumber("")}
        >
          מספר חברה
        </button>
        <button
          className="advanced-search-button"
          onClick={() => setSelectedCategories([])}
        >
          קטגוריות
        </button>
      </div>

      {companyNumber !== "" ? (
        <div className="company-number-input">
          <input
            type="text"
            placeholder="הזן מספר חברה"
            value={companyNumber}
            onChange={(e) => setCompanyNumber(e.target.value)}
          />
          <button onClick={handleSearchByCompanyNumber}>חפש</button>
        </div>
      ) : (
        <div className="category-selection">
          <h2>בחר קטגוריות (עד 3)</h2>
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
          {selectedCategories.length > 0 && (
            <button onClick={handleSearchByCategories}>חפש לפי קטגוריות</button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
