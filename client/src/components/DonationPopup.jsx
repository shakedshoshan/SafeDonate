import React, { useState, useEffect } from "react";
import axios from "axios"
import toast from "react-hot-toast";
import "../styles/DonationPopup.css";
// import { useAuthContext } from "../context/AuthContext";

const DonationPopup = ({ authUser, association, isOpen, onClose }) => {
   //const [showModal, setShowModal] = useState(false);
   const [loadingDonation, setLoadingDonation] = useState(false);
   const [donationType, setDonationType] = useState("חד פעמי");
   const [donationAmount, setDonationAmount] = useState("");
   const [addDedication, setAddDedication] = useState(false);
   const [dedicationText, setDedicationText] = useState("");
   const [error, setError] = useState('');
   // const { authUser } = useAuthContext();

   // Reset the state when the popup closes
   useEffect(() => {
      if (!isOpen) {
         setDonationAmount('');
         setError('');
         setLoadingDonation(false);
      }
   }, [isOpen]);

   const handleInputErrors = (value) => {
      return !isNaN(value) && value > 0;
      // return (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) //{
      // alert("Please enter a valid donation amount.");
      //    return false;
      // }
      // return true
   }

   //useEffect(() => {
   const handleDonate = async () => {
      const success = handleInputErrors(donationAmount);
      if (!success) {
         setError('Please enter a valid donation amount.');
         //alert("Please enter a valid donation amount.");
         return;
      }
      setLoadingDonation(true);
      setError(''); // Clear any previous error

      try {
         const response = await axios.post(   // Make the POST request
            "http://localhost:5000/donations/donate",
            {
               userId: authUser, // Include the userId from the logged-in user
               associationName: association["שם עמותה בעברית"],
               associationNumber: association["מספר עמותה"], // Use association number as ID
               amount: donationAmount, // Donation amount from input
            }
         );

         // Handle successful donation
         if (response.status === 200) {

            //setShowModal(false); // Close the donation popup
            setDonationAmount(""); // Clear the donation amount field
            setDedicationText(""); // Clear the dedication text
            setAddDedication(false); // Reset the dedication checkbox
            //handleClosePopup();
            handleSuccess();
         } else {
            handleFailure();
         }
         // onClose();
      } catch (error) {
         console.error("Failed to make a donation:", error);
         handleFailure();

      } finally {
         setLoadingDonation(false);
         onClose();
      }
   };

   const handleSuccess = () => {
      alert("התרומה התקבלה בהצלחה, תודה על תרומתך!");
   };

   const handleFailure = () => {
      alert("עיבוד התרומה נכשל. אנא נסה שוב מאוחר יותר.");
   };

   if (!isOpen) return null;
   //    createNewDonation();
   // }, []);

   return (
      <div className="popup-overlay">
         <div className="popup-content">
            <button className="close-popup" onClick={onClose} disabled={loadingDonation}>
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

            <div className={`checkbox-group ${addDedication ? "show-dedication" : ""}`}>
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

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="submit-donation" onClick={handleDonate} disabled={loadingDonation}>
               {loadingDonation ? 'מעבד בקשה...' : 'תרמו עכשיו'}

            </button>

            {donationAmount && (
               <p className="donation-summary">
                  סכום לתרומה: ₪{donationAmount}
               </p>
            )}
         </div>
      </div>
   );

};
export default DonationPopup;
