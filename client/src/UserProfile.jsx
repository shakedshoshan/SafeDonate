import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.log("No token");
          return;
        }

        const userResponse = await axios.post(
          "http://localhost:3000/users/getToken",
          { token }
        );

        if (userResponse.status === 200) {
          const fetchedUser = userResponse.data;
          setUser(fetchedUser);

          if (fetchedUser._id) {
            try {
              const donationsResponse = await axios.get(
                `http://localhost:3000/donations/${fetchedUser._id}`
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
                `http://localhost:3000/users/favorite/${fetchedUser._id}`
              );

              if (favoritesResponse.status === 200) {
                setFavorites(favoritesResponse.data.favoriteAssociations || []);
                console.log(favoritesResponse.data);
              } else {
                console.log("No favorite associations found");
              }
            } catch (error) {
              console.error(
                "Failed to fetch user's favorite associations:",
                error
              );
            }
          } else {
            console.log("User ID not found.");
          }
        } else {
          console.log("Token verification failed.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/users/deleteUserById/${user._id}`
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

  if (!user) return <p>You don't have a user account.</p>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>פרופיל אישי</h2>

        {/* User Info */}
        <div className="user-info">
          <div>שם פרטי: {user.firstName}</div>
          <div>שם משפחה: {user.lastName}</div>
          <div>אימייל: {user.email}</div>
        </div>

        {/* Donations */}
        <div className="donations-container">
          <h3>התרומות שלי</h3>
          {donations.length > 0 ? (
            donations.map((donation, index) => (
              <div key={index} className="donation-item">
                תרומה ל-{donation.npo}, סכום: ₪{donation.amount}
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
            favorites.map((favorite, index) => (
              <div
                key={index}
                className="favorite-item"
                onClick={() =>
                  navigate(`/association/${encodeURIComponent(favorite)}`)
                }
                style={{
                  cursor: "pointer",
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {favorite}
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

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Cookies from "js-cookie";
// import axios from "axios";
// import "./UserProfile.css";

// const UserProfile = ({ userId }) => {
//   const [user, setUser] = useState(null);
//   const [donations, setDonations] = useState([]);
//   const [favorites, setFavorites] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch user data and donation history
//     const fetchUserData = async () => {
//       try {
//         const token = Cookies.get("token");
//         if (!token) {
//           console.log("No token")
//           return;
//         }

//         const userResponse = await axios.post(
//           "http://localhost:3000/users/getToken",
//           { token }
//         );

//         if (userResponse.status === 200) {
//           const fetchedUser = userResponse.data;
//           setUser(fetchedUser);

//           if (fetchedUser._id) {
//             try {
//               const donationsResponse = await axios.get(
//                 `http://localhost:3000/donations/${fetchedUser._id}`
//               );

//               if (donationsResponse.status === 200) {
//                 console.log("Donation list fetched successfully");
//                 console.log(donationsResponse.data)
//               } else {
//                 console.log("No donations found");
//               }
//               // if (response.status === 200) {
//               //   console.log("hello")
//               //   // setDonations([
//               //   //   { npo: "SafeDonate", amount: 100 },
//               //   //   { npo: "HelpingHands", amount: 200 },
//               //   // ]);
//               // } else {
//               //   // set message at the page no donations yet
//               // }
//             } catch (error) {
//               console.error("Failed to fetch user's donation list:", error);
//             }

//             try {
//               const favoritesResponse = await axios.get(
//                 `http://localhost:3000/users/favorite/${fetchedUser._id}`
//               );

//               if (favoritesResponse.status === 200) {
//                 console.log("Favorite associations fetched successfully");
//                 console.log(favoritesResponse.data)
//               } else {
//                 console.log("No favorite associations found");
//               }
//               // // Handle successful donation
//               // if (favoritesResponse.status === 200) {
//               //   console.log("hello2")
//               //   // setDonations([
//               //   //   { npo: "SafeDonate", amount: 100 },
//               //   //   { npo: "HelpingHands", amount: 200 },
//               //   // ]);
//               // } else {
//               //   // set message at the page no donations yet
//               // }
//             } catch (error) {
//               console.error("Failed to fetch user's favorite associations:", error);
//             }

//             // setFavorites([
//             //   { name: "Save the Children", id: "123" },
//             //   { name: "World Wildlife Fund", id: "456" },
//             // ]);
//           } else {
//             console.log("User ID not found.");
//           }
//         } else {
//           console.log("Token verification failed.");
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     }

//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     Cookies.remove("token");
//     navigate("/login");
//   };

//   const handleDeleteAccount = async () => {
//     if (
//       window.confirm(
//         "Are you sure you want to delete your account? This action is irreversible."
//       )
//     ) {
//       try {
//         const response = await axios.delete(
//           `http://localhost:3000/users/deleteUserById/${user._id}`
//         );
//         if (response.status === 200) {
//           alert("Your account has been successfully deleted.");
//           Cookies.remove("token");
//           setUser(null);
//           navigate("/");
//         }
//       } catch (error) {
//         console.error("Error deleting account:", error);
//       }
//     }
//   };

//   if (!user) return <p>You don't have a user account.</p>;

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         <h2>פרופיל אישי</h2>

//         {/* User Info */}
//         <div className="user-info">
//           <div>שם פרטי: {user.firstName}</div>
//           <div>שם משפחה: {user.lastName}</div>
//           <div>אימייל: {user.email}</div>
//         </div>

//         {/* Donations */}
//         <div className="donations-container">
//           <h3>התרומות שלי</h3>
//           {donations.map((donation, index) => (
//             <div key={index} className="donation-item">
//               תרומה ל-{donation.npo}, סכום: ₪{donation.amount}
//             </div>
//           ))}
//         </div>

//         {/* Favorites */}
//         <div className="favorites-container">
//           <h3>עמותות מועדפות</h3>
//           {favorites.map((favorite, index) => (
//             <div key={index} className="favorite-item">
//               {favorite.name}
//             </div>
//           ))}
//         </div>

//         {/* Buttons */}
//         <div className="profile-buttons">
//           <button onClick={handleLogout} className="logout-button">
//             התנתק
//           </button>
//           <button onClick={handleDeleteAccount} className="delete-button">
//             מחק משתמש
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
