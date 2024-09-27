import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./UserProfile.css";
import { useAuthContext } from "./context/AuthContext";
import useLogout from "./hooks/useLogout";

const UserProfile = () => {
  const { userId } = useParams();
  const [donations, setDonations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const { loading, logout } = useLogout();

  //console.log(userId)
  useEffect(() => {
    const fetchUserData = async () => {
      if (authUser) {
        try {
          const donationsResponse = await axios.get(
            `http://localhost:5000/donations/${userId}`
          );

          if (donationsResponse.status === 200) {
            setDonations(donationsResponse.data || []);
          } else {
            console.log("No donations found");
          }
        } catch (error) {
          console.error("Failed to fetch user's donation list:", error);
        }

        try {
          const favoritesResponse = await axios.get(
            `http://localhost:5000/users/favorite/${userId}`
          );

          if (favoritesResponse.status === 200) {
            setFavorites(favoritesResponse.data.favoriteAssociations);
          } else {
            console.log("No favorite associations found");
          }
        } catch (error) {
          console.error("Failed to fetch user's favorite associations:", error);
        }
      } else {
        console.log("Token verification failed.");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    console.log("Logging out...");
    await logout();
    console.log(authUser);
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/users/deleteUserById/${userId}`
        );
        if (response.status === 200) {
          alert("Your account has been successfully deleted.");
          Cookies.remove("token");
          setUser(null);
          navigate("/");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  if (!authUser) return <p>You don't have a user account.</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>פרופיל אישי</h2>

        {/* User Info */}
        <div className="user-info">
          <div>שם פרטי: {authUser.firstName}</div>
          <div>שם משפחה: {authUser.lastName}</div>
          <div>אימייל: {authUser.email}</div>
        </div>

        {/* Donations */}
        <div className="donations-container">
          <h3>התרומות שלי</h3>
          {donations.length > 0 ? (
            donations.map((donation, index) => (
              <div key={index} className="donation-item">
                תרומה ל-{donation.associationName}, סכום: ₪{donation.amount}
              </div>
            ))
          ) : (
            <button
              onClick={() => navigate("/")}
              className="start-donating-button"
            >
              התחלו לתרום
            </button>
          )}
        </div>

        {/* Favorites */}
        <div className="favorites-container">
          <h3>עמותות מועדפות</h3>
          {favorites.length > 0 ? (
            favorites.map((association, index) => (
              <div
                key={index}
                className="favorite-item"
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
                onClick={() =>
                  navigate(`/AssociationPage/${association.number}`)
                } // Redirect to the AssociationPage with the association number
              >
                {association.name}
              </div>
            ))
          ) : (
            <button
              onClick={() => navigate("/advanced-Search")}
              className="find-npos-button"
            >
              חפשו עמותות להוסיף
            </button>
          )}
        </div>

        {/* Buttons */}
        <div className="profile-buttons">
          <button onClick={handleLogout} className="logout-button">
            התנתק
          </button>
          <button onClick={handleDeleteAccount} className="delete-button">
            מחק משתמש
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
