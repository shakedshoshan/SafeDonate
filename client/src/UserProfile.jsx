// src/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    //const [message, setMessage] = useState('');
    // const [donations, setDonations] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [updatedInfo, setUpdatedInfo] = useState({
      //name: '',
      email: '',
      password: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

  // Fetch user data and donation history
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if(token) {
        try {
          const userResponse = await axios.post("http://localhost:3000/users/getToken", { token })
          
          if (userResponse.status === 200) {
            setUser(userResponse.data);
            setUpdatedInfo({
              //name: userResponse.data.name,
              email: userResponse.data.email,
              password: '', // Leave password blank initially
            });
          } else {
            console.log("Token verification failed.");
          }
          
  
          // const donationResponse = await axios.get('http://localhost:3000/users/donations', {
          //   headers: { Authorization: `Bearer ${token}` },
          // });
          // setDonations(donationResponse.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            //setMessage('Failed to load user data.');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({
      ...updatedInfo,
      [name]: value,
    });
  };

  const handleUpdateInfo = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put('http://localhost:3000/users/update', updatedInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      //alert('Failed to update profile.');
      setError('Failed to update profile. Please try again later.');  // Display user-friendly error
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      try {
        const response = await axios.delete(`http://localhost:3000/users/deleteUserById/${user._id}`);
        if (response.status === 200) { // Handle successful deletion
       //   setMessage('Your account has been successfully deleted.');
           
          setSuccessMessage('Account successfully deleted');
          setUser(null); // Clear user data after successful deletion
          Cookies.remove('token');
          setTimeout(() => {
            navigate('/'); // Redirect to homepage after account deletion
          }, 2000);
        }
      } catch (error) {
          setError('Failed to delete account');
        //console.error('Error deleting account:', error);
      //  setMessage('Failed to delete your account. Please try again later.');
      }
    }
  }

  if (!user) return <p>You dont have user</p>;

  return (
    <div className="user-profile-container">
      <h1>Profile</h1>
      <div className="profile-section">
        <h2>Personal Information</h2>
        {editMode ? (
          <div className="edit-info">
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={updatedInfo.name}
              onChange={handleInputChange}
            />
            <label>Email: </label>
            <input
              type="email"
              name="email"
              value={updatedInfo.email}
              onChange={handleInputChange}
            />
            <label>Password: </label>
            <input
              type="password"
              name="password"
              value={updatedInfo.password}
              onChange={handleInputChange}
            />
            <button onClick={handleUpdateInfo}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        ) : (
          <div className="user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={() => setEditMode(true)}>Edit Info</button>
          </div>
        )}
      </div>

      {/* <div className="donation-history-section">
        <h2>Donation History</h2>
        {donations.length > 0 ? (
          <ul>
            {donations.map((donation) => (
              <li key={donation._id}>
                <p><strong>Association:</strong> {donation.associationName}</p>
                <p><strong>Amount:</strong> {donation.amount}₪</p>
                <p><strong>Date:</strong> {new Date(donation.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No donations made yet.</p>
        )}
      </div> */}

      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <button className="delete-button" onClick={handleDeleteAccount}>Delete Account</button>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default UserProfile;