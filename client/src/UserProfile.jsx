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
    // Fetch user data and donation history
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.log("No token")
          return;
        }

        const userResponse = await axios.post(
          "http://localhost:3000/users/getToken",
          { token }
        );
        if (userResponse.status === 200) {
          setUser(userResponse.data);

          try {
            const response = await axios.get(
              `http://localhost:3000/donations/${user._id}`
            );

            // Handle successful donation
            if (response.status === 200) {
              console.log("hello")
              // setDonations([
              //   { npo: "SafeDonate", amount: 100 },
              //   { npo: "HelpingHands", amount: 200 },
              // ]);
            } else {
              // set message at the page no donations yet
            }
          } catch (error) {
            console.error("Failed to fetch user's donation list:", error);
          }

          try {
            const favoritesResponse = await axios.get(
              `http://localhost:3000/users/favorite/${user._id}`
            );

            // Handle successful donation
            if (favoritesResponse.status === 200) {
              console.log("hello2")
              // setDonations([
              //   { npo: "SafeDonate", amount: 100 },
              //   { npo: "HelpingHands", amount: 200 },
              // ]);
            } else {
              // set message at the page no donations yet
            }
          } catch (error) {
            console.error("Failed to fetch user's donation list:", error);
          }

          // setFavorites([
          //   { name: "Save the Children", id: "123" },
          //   { name: "World Wildlife Fund", id: "456" },
          // ]);
        } else {
          console.log("Token verification failed.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

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
          {donations.map((donation, index) => (
            <div key={index} className="donation-item">
              תרומה ל-{donation.npo}, סכום: ₪{donation.amount}
            </div>
          ))}
        </div>

        {/* Favorites */}
        <div className="favorites-container">
          <h3>עמותות מועדפות</h3>
          {favorites.map((favorite, index) => (
            <div key={index} className="favorite-item">
              {favorite.name}
            </div>
          ))}
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

// // src/UserProfile.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './UserProfile.css';

// const UserProfile = () => {
//     const [user, setUser] = useState(null);
//     //const [message, setMessage] = useState('');
//     // const [donations, setDonations] = useState([]);
//     const [editMode, setEditMode] = useState(false);
//     const [updatedInfo, setUpdatedInfo] = useState({
//       //name: '',
//       email: '',
//       password: '',
//     });
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState('');
//     const navigate = useNavigate();

//   // Fetch user data and donation history
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = Cookies.get('token');
//       if(token) {
//         try {
//           const userResponse = await axios.post("http://localhost:3000/users/getToken", { token })

//           if (userResponse.status === 200) {
//             setUser(userResponse.data);
//             setUpdatedInfo({
//               //name: userResponse.data.name,
//               email: userResponse.data.email,
//               password: '', // Leave password blank initially
//             });
//           } else {
//             console.log("Token verification failed.");
//           }

//           // const donationResponse = await axios.get('http://localhost:3000/users/donations', {
//           //   headers: { Authorization: `Bearer ${token}` },
//           // });
//           // setDonations(donationResponse.data);
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             //setMessage('Failed to load user data.');
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpdatedInfo({
//       ...updatedInfo,
//       [name]: value,
//     });
//   };

//   const handleUpdateInfo = async () => {
//     try {
//       const token = Cookies.get('token');
//       await axios.put('http://localhost:3000/users/update', updatedInfo, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('Profile updated successfully!');
//       setEditMode(false);
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       //alert('Failed to update profile.');
//       setError('Failed to update profile. Please try again later.');  // Display user-friendly error
//     }
//   };

//   const handleLogout = () => {
//     Cookies.remove('token');
//     navigate('/login');
//   };

//   const handleDeleteAccount = async () => {
//     if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
//       try {
//         const response = await axios.delete(`http://localhost:3000/users/deleteUserById/${user._id}`);
//         if (response.status === 200) { // Handle successful deletion
//        //   setMessage('Your account has been successfully deleted.');

//           setSuccessMessage('Account successfully deleted');
//           setUser(null); // Clear user data after successful deletion
//           Cookies.remove('token');
//           setTimeout(() => {
//             navigate('/'); // Redirect to homepage after account deletion
//           }, 2000);
//         }
//       } catch (error) {
//           setError('Failed to delete account');
//         //console.error('Error deleting account:', error);
//       //  setMessage('Failed to delete your account. Please try again later.');
//       }
//     }
//   }

//   if (!user) return <p>You dont have user</p>;

//   return (
//     <div className="user-profile-container">
//       <h1>Profile</h1>
//       <div className="profile-section">
//         <h2>Personal Information</h2>
//         {editMode ? (
//           <div className="edit-info">
//             <label>Name: </label>
//             <input
//               type="text"
//               name="name"
//               value={updatedInfo.name}
//               onChange={handleInputChange}
//             />
//             <label>Email: </label>
//             <input
//               type="email"
//               name="email"
//               value={updatedInfo.email}
//               onChange={handleInputChange}
//             />
//             <label>Password: </label>
//             <input
//               type="password"
//               name="password"
//               value={updatedInfo.password}
//               onChange={handleInputChange}
//             />
//             <button onClick={handleUpdateInfo}>Save</button>
//             <button onClick={() => setEditMode(false)}>Cancel</button>
//           </div>
//         ) : (
//           <div className="user-info">
//             <p><strong>Name:</strong> {user.name}</p>
//             <p><strong>Email:</strong> {user.email}</p>
//             <button onClick={() => setEditMode(true)}>Edit Info</button>
//           </div>
//         )}
//       </div>

//       {/* <div className="donation-history-section">
//         <h2>Donation History</h2>
//         {donations.length > 0 ? (
//           <ul>
//             {donations.map((donation) => (
//               <li key={donation._id}>
//                 <p><strong>Association:</strong> {donation.associationName}</p>
//                 <p><strong>Amount:</strong> {donation.amount}₪</p>
//                 <p><strong>Date:</strong> {new Date(donation.date).toLocaleDateString()}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>No donations made yet.</p>
//         )}
//       </div> */}

//       <button className="logout-button" onClick={handleLogout}>Logout</button>
//       <button className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>

//       {error && <p className="error">{error}</p>}
//       {successMessage && <p className="success">{successMessage}</p>}
//     </div>
//   );
// };

// export default UserProfile;
