import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import useAssociationData from "../hooks/useAssociationData.js";
import useContactInfo from "../hooks/useContactInfo.js";
import useApprovals from "../hooks/useApprovals.js";
import useScraping from "../hooks/useScraping.js";
import DonationPopup from "../components/DonationPopup.jsx";
import Loding from "../components/Loding";
import ContactCard from "../components/ContactCard.jsx";
import "../styles/AssociationPage.css";

import { removeTilde, replaceTildesAlgorithm } from "../utils/filterText.js";

const AssociationPage = () => {
  const { associationNumber } = useParams();
  const { authUser } = useAuthContext();
  const { loadingAssoc, association, error, fetchAssociation } = useAssociationData();
  const { loading, contactInfo, fetchContactInfo } = useContactInfo();
  const { loadingApprovals, approvals, fetchApprovals } = useApprovals();
  const { loadingScraping, negativeInfo, fetchScrapedData } = useScraping();
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasFetchedContactInfo, setHasFetchedContactInfo] = useState(false);
  // const [isContactLoading, setIsContactLoading] = useState(false);
  // const [contactMessage, setContactMessage] = useState("");
  // const [linkLoaded, setLinkLoaded] = useState(false);

  const toggleExplanation = () => setShowExplanation((prev) => !prev);
  const handleToggleExpand = () => setIsExpanded(!isExpanded);
  const handleMoreInfo = () =>
    window.open(`https://www.guidestar.org.il/organization/${associationNumber}`,"_blank");
  const handleDonateClick = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);
  const handleOpenLink = () => window.open(link);
  const handleContactClick = () => setIsCardOpen(true);


  // fetch association Data
  useEffect(() => {
    fetchAssociation({ associationNumber });
    fetchApprovals({ associationNumber });
  }, [associationNumber]);

    // Fetch approvals by association number
    useEffect(() => {
      if (association) {
        const category = removeTilde(association["סיווג פעילות ענפי"]);
        fetchScrapedData({ associationNumber, category });
      }
    }, [associationNumber]);

//  fetch association Link
  useEffect(() => {
    if (!hasFetchedContactInfo) {
      fetchContactInfo({ associationNumber }).then(() => {
        setHasFetchedContactInfo(true);
      })
      .catch((error) => {
        console.error('Error fetching contact info:', error);
      });
    }
  }, [associationNumber, fetchContactInfo, hasFetchedContactInfo]);
  
  // Fetch the association link
  // useEffect(() => {
  //   fetchAssociationLink({ associationNumber }).then(() => {
  //     if (link === "NO_CONTACT_INFO") {
  //       setContactMessage("אין דרך ליצור כרגע קשר, נא לנסות שנית מאוחר יותר");
  //     } else {
  //       setLinkLoaded(true); // Only set to true if the link is valid
  //     }
  //   });
  // }, [associationNumber, link]);

  // Fetch web scraping data
  // useEffect(() => {
  //   if (association) {
  //     const category = removeTilde(association["סיווג פעילות ענפי"]);
  //     fetchScrapedData({ associationNumber, category });
  //   }
  // }, [association]);
  // const handleContactClick = () => {
  //   setTimeout(() => {
  //     if (link && link !== "NO_CONTACT_INFO") {
  //       // Open /loading page in a new tab with the redirect URL
  //       window.open(
  //         `/loading?redirectUrl=${encodeURIComponent(link)}`,
  //         "_blank"
  //       );
  //       setContactMessage(""); // Clear any existing message
  //     }
  //   }, 10000); // Wait 8 seconds before taking action
  // };

  const categoryCounts = negativeInfo ? negativeInfo.reduce((total, result) =>
     total + result.filteredResults.length,0) : 0;

  return (
    <div className="main-content">
      <div className="association-page">
        {!loadingAssoc ? (
          <>
            {/* Right Section */}
            <div className="right-section">
              <div className="circle-image">
                {association["שם עמותה בעברית"]? association["שם עמותה בעברית"].substring(0, 2): "נפ"}
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

              <div>
                <button className="donate-button" onClick={handleContactClick}>
                    יצירת קשר
                </button>
                
                {isCardOpen && (
                  <ContactCard 
                    isLoading={loading} 
                    contactInfo={contactInfo} 
                    onClose={() => setIsCardOpen(false)} 
                  />
                )}
                {/* {isPopupOpen && (
                  <ContactCard 
                    isLoading={loading} 
                    contactInfo={contactInfo} 
                    onClose={() => setIsPopupOpen(false)} 
                  />
                )} */}
              </div>
          

              <div>
                <button className="donate-button" onClick={handleDonateClick}>
                  לתיעוד התרומה
                </button>
                <DonationPopup
                  authUser={authUser}
                  association={association}
                  isOpen={isPopupOpen}
                  onClose={handleClosePopup}
                />
              </div>

              <FavoriteButton association={association} userId={authUser._id} />

              {/* {link === "NO_CONTACT_INFO" ? (
                <button className="donate-button">לעמותה אין כל אמצעי תקשורת</button>
              ) : (
                <button className="donate-button" onClick={handleOpenLink}>
                  {link}
                </button>
              )} */}
              
              {/* <button
                className="donate-button"
                onClick={handleContactClick}
                disabled={!linkLoaded} // Disable button if link isn't loaded or is invalid
                style={{
                  cursor: linkLoaded ? "pointer" : "not-allowed",
                  opacity: linkLoaded ? 1 : 0.6, // Style to indicate loading
                }}
              >
                {linkLoaded ? "יצירת קשר לתרומה" : "טוען..."}
              </button>

              {isContactLoading && (
                <div className="contact-popup">
                  <p>טוען מידע על אמצעי קשר, יש לחכות כ10 שניות...</p>
                </div>
              )}
              {contactMessage && (
                <div className="contact-popup">
                  <p>{contactMessage}</p>
                  <button onClick={() => setContactMessage("")}>סגור</button>
                </div>
              )} */}

              <button className="donate-button" onClick={handleMoreInfo}>
                מידע נוסף על העמותה
              </button>
            </div>

            {/* Separator Line */}
            <div className="separator"></div>

            {/* Left Section for Goals */}
            <div className="left-section">
              <h2 className="goals-headline">מטרות העמותה</h2>
              <p className="npo-goals">
                {replaceTildesAlgorithm(association["מטרות עמותה"]) ||
                  "העמותה טרם שיתפה את מטרותיה. נשמח לעדכן אותך ברגע שיתווסף מידע נוסף."}
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
                  <div className="category-header" onClick={handleToggleExpand} style={{ cursor: "pointer" }}>
                    <p>מצאתי {categoryCounts} קישורים הקשורים לעמותה
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
                        {negativeInfo.map((result, index) =>
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
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              <div className="approvals-section">
                <h2 className="approvals-headline">טבלת אישורים</h2>
                <span className="explanation-text-link" onClick={toggleExplanation}> למה צריך את זה?</span>
                {showExplanation && (
                  <p className="explanation-text">
                    טבלת האישורים מספקת מידע לגבי העמותה והאישורים שקיבלה.
                    עמותות מאושרות הן עמותות שקיבלו את האישורים הנדרשים על פי
                    החוק, מה שמגביר את אמינותן.
                  </p>
                )}

                {loadingApprovals ? (
                  <p>טוען נתוני אישורים...</p>
                ) : approvals && approvals.length > 0 ? (
                  // <>
                  //   {/* Show the approval table only if it's toggled */}
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
                  // </>
                ) : (
                  <p className="no-approvals-message">
                    העמותה מעולם לא נרשמה כעמותה תקינה על ידי רשם העמותות
                  </p>
                )}
              </div>
              
              {/* Disclaimer Section */}
              <div className="disclaimer-section">
                <p className="disclaimer-text">
                  כל המידע המוצג בעמוד זה נאסף ממקורות ציבוריים זמינים ברשת.
                  למרות שאנו משתדלים להציג מידע מדויק ועדכני, אנו לא נושאים
                  באחריות לכל טעות או אי דיוק במידע המוצג. המידע המוצג הינו
                  לצורכי שקיפות בלבד ואין לראות בו כהמלצה חד משמעית לתרומה
                  לעמותה מסוימת.
                </p>
              </div>
            </div>
          </>
        ) : (
          <Loding />
        )}
      </div>
    </div>
  );
};

export default AssociationPage;