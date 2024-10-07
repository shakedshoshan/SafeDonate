import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import axios from "axios";
import "./AssociationPage.css";
import { useAuthContext } from "./context/AuthContext";
import FavoriteButton from "./components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import useAssociationLink from "./hooks/useAssociationLink.js";
import {removeTilde, replaceTildesAlgorithm } from "./utils/filterText.js";

const AssociationPage = () => {
  const { associationNumber } = useParams();
  const filterQuery = JSON.stringify({ "מספר עמותה": associationNumber });
  const [association, setAssociation] = useState(null);
  const { loading, link, associationLink } = useAssociationLink();
  const [approvals, setApprovals] = useState([]);
  const [loadingAssociation, setLoadingAssociation] = useState(true);
  const [loadingScraping, setLoadingScraping] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [donationType, setDonationType] = useState("חד פעמי");
  const [donationAmount, setDonationAmount] = useState("");
  const [addDedication, setAddDedication] = useState(false);
  const [dedicationText, setDedicationText] = useState("");
  const [negativeInfo, setNegativeInfo] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const toggleExplanation = () => {
    setShowExplanation((prev) => !prev);
  };

  // Fetch association data from the API
  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        if (authUser) {
          const cachedData = sessionStorage.getItem(
            `assoc_${associationNumber}`
          );
          if (cachedData) {
            console.log("doing caching");
            const parsedData = JSON.parse(cachedData);
            setAssociation(parsedData);
            setLoadingAssociation(false);
            return;
          }
          console.log("fetching from API");
          // If no cache, fetch from the server
          const response = await axios.get(
            `https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&filters=${encodeURIComponent(
              filterQuery
            )}`
          );

          if (response.data.result.records.length > 0) {
            const associationData = response.data.result.records[0];

            // Store the fetched data in sessionStorage
            sessionStorage.setItem(
              `assoc_${associationNumber}`,
              JSON.stringify(associationData)
            );
            setAssociation(associationData);
            setLoadingAssociation(false);

            // Extract association number and fetch approvals
          } else {
            setError("No association found");
          }
        }
        setLoadingAssociation(false); // Loading for association is done
      } catch (error) {
        console.error("Failed to fetch association data:", error);
        setError(error);
        setLoadingAssociation(false);
      }
    };
    fetchAssociation();
  }, [associationNumber]);


  useEffect(() => {
    if (associationNumber) {
      associationLink({ associationNumber });
      console.log("link: ", link);
    }
  }, [associationNumber]);

  // Fetch approvals by association number
  useEffect(() => {
    if (association) {
      const fetchApprovals = async () => {
        try {
          console.log("in fetchApprovals");
          const response = await axios.get(
            `https://data.gov.il/api/3/action/datastore_search?resource_id=cb12ac14-7429-4268-bc03-460f48157858&q=${associationNumber}`
          );
          const sortedData = response.data.result.records.sort((a, b) => {
            const yearA = parseInt(a["שנת האישור"], 10);
            const yearB = parseInt(b["שנת האישור"], 10);
            return yearB - yearA;
          });
          setApprovals(sortedData);
        } catch (error) {
          setError(error);
          //setLoading(false);
        }
      };
      fetchApprovals();
    }
  }, [association]);

  // Fetch web scraping data
  useEffect(() => {
    if (association) {
      const fetchScrapedData = async () => {
        const associationNumber = association["מספר עמותה"];
        const category = removeTilde(association["סיווג פעילות ענפי"]);
        //let cleanedStr = category.replace(/~/g, ""); // Remove all '~' characters

        try {
          // Check if data is in sessionStorage
          const cachedScrapingData = sessionStorage.getItem(
            `scrape_${associationNumber}`
          );
          if (cachedScrapingData) {
            console.log("doing caching of scraped Data");
            setNegativeInfo(JSON.parse(cachedScrapingData));
            //setLoading(false);
            setLoadingScraping(false);
            return;
          }

          console.log("Fetching new scraping data...");
          // Fetch data from the API if not cached
          const response = await axios.post(
            "http://localhost:5000/scrape/search",
            {
              associationNumber,
              category,
            }
          );
          const scrapedData = response.data;
          if (scrapedData.results.length > 0) {
            console.log(scrapedData.results);
            // Store the scraped data in sessionStorage
            sessionStorage.setItem(
              `scrape_${associationNumber}`,
              JSON.stringify(scrapedData.results)
            );
            setNegativeInfo(scrapedData.results); // Save negative info
          } else {
            console.log("No scraped data found");
          }
        } catch (error) {
          console.error("Failed to fetch or process scraped data:", error);
          setError("Error fetching scraping information");
        } finally {
          // setLoading(false); // Ensure loading is false in all cases
          setLoadingScraping(false); // Ensure loadingScraping is false in all cases
        }
      };

      fetchScrapedData();
    }
  }, [association]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(donationAmount);

    if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      // Make the POST request
      const response = await axios.post(
        "http://localhost:5000/donations/donate",
        {
          userId: authUser, // Include the userId from the logged-in user
          associationName: association["שם עמותה בעברית"],
          associationNumber: associationNumber, // Use association number as ID
          amount: donationAmount, // Donation amount from input
        }
      );

      // Handle successful donation
      if (response.status === 200) {
        alert("Donation successful! Thank you for your contribution.");
        setShowModal(false); // Close the donation popup
        setDonationAmount(""); // Clear the donation amount field
        setDedicationText(""); // Clear the dedication text
        setAddDedication(false); // Reset the dedication checkbox
        handleCloseModal();
      } else {
        alert("There was an issue with your donation. Please try again.");
      }
    } catch (error) {
      console.error("Failed to make a donation:", error);
      alert("Failed to process the donation. Please try again later.");
    }
  };

  const handleOpenLink = () => {
    window.open(link);
  }

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Modal handlers
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const toggleFavorite = () => {
  //   setIsFavorite(!isFavorite);
  // };

  useEffect(() => {
    let counts = 0;
    negativeInfo.forEach((result) => {
      counts += result.filteredResults.length;
    });
    console.log("counts", counts)
    setCategoryCounts(counts); // Save counts

  }, [negativeInfo]);

  //if (loadingScraping) return <p>Loading Scraped data...</p>;
  if (loadingAssociation) return <p>Loading association data...</p>;
  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="main-content">
      <div className="association-page">
        {authUser ? (
          <>
            {/* Right Section */}
            <div className="right-section">
              <div className="circle-image">
                {association["שם עמותה בעברית"]
                  ? association["שם עמותה בעברית"].substring(0, 2)
                  : "נפ"}
              </div>

              <div className="npo-name">
                {replaceTildesAlgorithm(association["שם עמותה בעברית"]) || "שם עמותה לא זמין"}
              </div>

              <div className="npo-place">
                {association["כתובת - ישוב"] || "כתובת עמותה לא זמינה"}
              </div>

              <div className="npo-number">
                מספר עמותה: {association["מספר עמותה"] || "מספר עמותה לא זמין"}
              </div>

              <button className="donate-button" onClick={handleOpenModal}>
                לתרומה
              </button>

              <FavoriteButton association={association} userId={authUser._id} />

              {link === "NO_CONTACT_INFO" ? (
                <button className="donate-button">
                  לעמותה אין כל אמצעי תקשורת
                </button>
              ) : (
                <button className="donate-button" onClick={handleOpenLink}>
                  {link}
                </button>
              )}
            </div>

            {/* Separator Line */}
            <div className="separator"></div>

            {/* Left Section for Goals */}
            <div className="left-section">
              <h2 className="goals-headline">מטרות העמותה</h2>
              <p className="npo-goals">
                {replaceTildesAlgorithm(association["מטרות עמותה"]) || "העמותה טרם שיתפה את מטרותיה. נשמח לעדכן אותך ברגע שיתווסף מידע נוסף."}
              </p>

              <h2 className="negative-info-headline">מידע שנאסף על אמינות העמותה</h2>
              {/* Negative Info Section */}
              {loadingScraping ? (
                <p>מחפש מידע על העמותה...</p>
              ) : categoryCounts === 0 ? (
                <p className="safe-to-donate-message">
                  לא נמצא כל מידע שלילי על העמותה. העמותה נראית בטוחה לתרומה.
                </p>
              ) : (
                <div className="negative-info-summary">
                  <div className="category-header" onClick={handleToggleExpand} style={{ cursor: 'pointer' }}>
                    <p>
                      מצאתי {categoryCounts} קישורים הקשורים לעמותה
                      {isExpanded ? " ▲" : " ▼"}
                    </p>
                  </div>

                  {isExpanded && (
                    <table className="category-content">
                      <thead>
                        <tr>
                          <th>כותרת</th>
                          <th>קישור</th>
                        </tr>
                      </thead>
                      <tbody>
                        {negativeInfo.map((result, index) => (
                          result.filteredResults.map((result1, index1) => (
                            <tr key={index1}>
                              <td>{result1.title}</td>
                              <td>
                                <a
                                  href={result1.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  קישור
                                </a>
                              </td>
                            </tr>
                          ))
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}


              <div className="approvals-section">
                <h2 className="approvals-headline">טבלת אישורים</h2>
                <span className="explanation-text-link" onClick={toggleExplanation}>
                  למה צריך את זה?
                </span>
                {approvals && approvals.length > 0 ? (
                  <>
                    {/* <div className="approvals-header">
                      <span
                        className="toggle-table-link"
                        onClick={toggleApprovalTable}>
                        {showApprovalTable ? "הסתר טבלה" : "טבלת אישורים"}
                      </span>

                      {showApprovalTable && (
                        <span className="explanation-text-link" onClick={toggleExplanation}>
                          למה צריך את זה?
                        </span>
                      )}
                    </div>  */}

                    {showExplanation && (
                      <p className="explanation-text">
                        טבלת האישורים מספקת מידע לגבי העמותה והאישורים שקיבלה.
                        עמותות מאושרות הן עמותות שקיבלו את האישורים הנדרשים על פי
                        החוק, מה שמגביר את אמינותן.
                      </p>
                    )}

                    {/* Show the approval table only if it's toggled */}
                    {/* {showApprovalTable && ( */}
                    <table className="approvals-table">
                      <thead>
                        <tr>
                          <th>שנת האישור</th>
                          <th>האם מאושר</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvals.map((record, index) => (
                          <tr key={index}>
                            <td>{record["שנת האישור"]}</td>
                            <td>{record["האם יש אישור"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* )} */}
                  </>
                ) : (
                  <p className="no-approvals-message">
                    העמותה מעולם לא נרשמה כעמותה תקינה על ידי רשם העמותות
                  </p>
                )}
              </div>

              {/* Donation Popup */}
              {showModal && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <button onClick={handleCloseModal} className="close-popup">
                      &times;
                    </button>
                    <div className="popup-title">
                      <span>תשלום מאובטח</span>
                      <span className="lock-icon">🔒</span>
                    </div>

                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          value="חד פעמי"
                          checked={donationType === "חד פעמי"}
                          onChange={() => setDonationType("חד פעמי")}
                        />
                        תרומה חד פעמית
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          value="הוראת קבע"
                          checked={donationType === "הוראת קבע"}
                          onChange={() => setDonationType("הוראת קבע")}
                        />
                        הוראת קבע
                      </label>
                    </div>

                    <input
                      type="number"
                      className="donation-amount"
                      placeholder="סכום תרומה"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                    />

                    <div
                      className={`checkbox-group ${addDedication ? "show-dedication" : ""
                        }`}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={addDedication}
                          onChange={() => setAddDedication(!addDedication)}
                        />
                        רוצה להוסיף הקדשה
                      </label>
                      {addDedication && (
                        <textarea
                          className="dedication-text"
                          placeholder="כתוב כאן את ההקדשה שלך"
                          value={dedicationText}
                          onChange={(e) => setDedicationText(e.target.value)}
                        />
                      )}
                    </div>

                    <button className="submit-donation" onClick={handleSubmit}>
                      תרמו עכשיו
                    </button>

                    {donationAmount && (
                      <p className="donation-summary">
                        סכום לתרומה: ₪{donationAmount}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="unauthenticated-message">
            <h2>אינכם מחוברים</h2>
            <p>על מנת לצפות במידע על העמותה, עליכם להתחבר למערכת.</p>
            <button className="login-button" onClick={handleLoginRedirect}>
              התחבר כאן
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssociationPage;
