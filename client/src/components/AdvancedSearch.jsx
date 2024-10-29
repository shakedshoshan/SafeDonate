import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdvancedSearch.css";

const AdvancedSearch = ({ npoData, setFilteredData }) => {
  const [activeTab, setActiveTab] = useState("קטגוריות"); // Default tab is categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [npoNumber, setNpoNumber] = useState("");
  const categories = Array.from(
    new Set(npoData.map((npo) => npo["סיווג פעילות ענפי"]))
  ).sort((a, b) => a.localeCompare(b, "he"));

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
      navigate("/filtered-results", {
        state: { filteredNPOs, selectedCategories },
      });
    } else if (activeTab === "מספר עמותה" && npoNumber) {
      const filteredNPOs = npoData.filter(
        (npo) => npo["מספר עמותה"].toString() === npoNumber
      );
      if (filteredNPOs.length === 0) {
        navigate("/not-found");
      } else {
        navigate(`/AssociationPage/${npoNumber}`);
      }
    }
  };

  return (
    <div className="about-page">
      <div className="about-container">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] bg-clip-text text-transparent">
           למי תרצו לתרום
        </h2>

        <div className="tabs-container grid grid-cols-2 gap-4 mb-8">
          <button
            className={`tab py-3 px-6 rounded-lg focus:outline-none transition-all duration-300 font-semibold w-full transform hover:scale-105 ${
              activeTab === "קטגוריות"
                ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("קטגוריות");
              setSelectedCategories([]);
            }}
          >
            קטגוריות
          </button>

          <button
            className={`tab py-3 px-6 rounded-lg focus:outline-none transition-all duration-300 font-semibold w-full transform hover:scale-105 ${
              activeTab === "מספר עמותה"
                ? "bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => {
              setActiveTab("מספר עמותה");
              setNpoNumber("");
            }}
          >
            מספר עמותה
          </button>
        </div>

        <div className="content-container h-[400px] flex items-start justify-center">
          {activeTab === "קטגוריות" ? (
            <div className="bubble-buttons flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`bubble-button px-6 py-3 rounded-full border ${
                    selectedCategories.includes(category)
                      ? "bg-[#1e3c72] text-white border-transparent"
                      : "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-200"
                  } focus:outline-none transition-all duration-200 hover:shadow-md transform hover:scale-105`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : (
            <div className="npo-number-input w-full px-4">
              <input
                type="text"
                placeholder="הזן מספר עמותה"
                value={npoNumber}
                onChange={(e) => setNpoNumber(e.target.value)}
                className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0072FF] shadow-sm transition-all duration-300 text-lg"
              />
            </div>
          )}
        </div>

        <button
          className="search-button w-full py-3 bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white rounded-lg transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 hover:from-[#00C6FF] hover:to-[#0072FF] hover:opacity-90"
          onClick={handleSearch}
        >
          חפש
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;