import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/FilteredResultsPage.css"; // Add relevant CSS for styling
import { useAuthContext } from "../context/AuthContext";
import AssociationCarousel from "../components/AssociationCarousel";

const FilteredResultsPage = () => {
  const location = useLocation();
  const { authUser } = useAuthContext();
  const { filteredNPOs, selectedCategories } = location.state || {}; // Get the filtered NPOs from state
  const [displayedNPOs, setDisplayedNPOs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9); // Number of NPOs to show at a time
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load initial 9 NPOs
  useEffect(() => {
    if (filteredNPOs && filteredNPOs.length > 0) {
      setDisplayedNPOs(filteredNPOs.slice(0, 9));
    }

    console.log("Filtered NPOs:", selectedCategories);
  }, [filteredNPOs]);

  // Handle scroll event to load more NPOs
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !loading &&
      displayedNPOs.length < filteredNPOs.length
    ) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + 9); // Show 3 more NPOs
        setLoading(false);
      }, 1000); // Simulate loading time
    }
  };

  useEffect(() => {
    setDisplayedNPOs(filteredNPOs.slice(0, visibleCount));
  }, [visibleCount, filteredNPOs]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="filtered-results-page ">
      <h2 className="filtered-results-page-title pb-5px">
        {`סינון - ${selectedCategories.length > 0 ? selectedCategories.join(", ") : "לא נבחרו קטגוריות"}`}
      </h2>

      <AssociationCarousel dataList={displayedNPOs} userId={authUser?.id} />
    
      {/* Loading indicator */}
      {loading && (
        <div className="loading-indicator">
          <span>טוען עוד עמותות...</span>
        </div>
      )}
    </div>
  );
};

export default FilteredResultsPage;
