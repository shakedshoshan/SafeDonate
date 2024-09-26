import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [dob, setDob] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [emailExists, setEmailExists] = useState(false); // For handling email already in DB
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!showAdditionalFields) {
      // Step 1: Check if email already exists in the DB
      try {
        const emailCheckResponse = await axios.post(
          "http://localhost:3000/users/check-email",
          { email }
        );

        if (emailCheckResponse.data.exists) {
          setEmailExists(true);
          setErrorMessage("קיים חשבון לכתובת מייל זו");
        } else {
          setEmailExists(false);
          setShowAdditionalFields(true); // Proceed to next step
          setErrorMessage(""); // Clear any error message
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setErrorMessage("אירעה שגיאה, נסה שוב.");
      }
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/users/signup", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,

        // dob: dob,
        // phoneNumber: phoneNumber,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const expires = new Date(Date.now() + 3600000); // 1 hour from now
        document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`;

        navigate("/", { state: { id: email } });
      } else {
        setErrorMessage("ההרשמה נכשלה. אנא בדוק את הקלט שלך.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("אירעה שגיאה בהרשמה, נסה שוב.");
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>יצירת משתמש חדש</h2>
        <form onSubmit={handleSignUp} className="signup-form">
          {/* Step 1: Email, Password, Verify Password */}
          {!showAdditionalFields && (
            <>
              <label htmlFor="email">אימייל</label>
              <input
                type="email"
                id="email"
                placeholder="הכנס את כתובת האימייל שלך"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(""); // Clear error message when user types
                }}
                required
              />

              <label htmlFor="password">סיסמא</label>
              <input
                type="password"
                id="password"
                placeholder="הכנס את הסיסמא שלך"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <label htmlFor="verifyPassword">אמת סיסמא</label>
              <input
                type="password"
                id="verifyPassword"
                placeholder="הכנס את הסיסמא שלך שוב"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                required
              />

              {/* Display error message if email already exists */}
              {emailExists && <p className="error-message">{errorMessage}</p>}

              <button type="submit" className="signup-button">
                המשך
              </button>
            </>
          )}

          {/* Step 2: Additional Info */}
          {showAdditionalFields && (
            <>
              <label htmlFor="firstName">שם פרטי</label>
              <input
                type="text"
                id="firstName"
                placeholder="הכנס את שמך הפרטי"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />

              <label htmlFor="lastName">שם משפחה</label>
              <input
                type="text"
                id="lastName"
                placeholder="הכנס את שם המשפחה שלך"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />

              <button type="submit" className="signup-button">
                צור חשבון
              </button>

              {/* Display error message */}
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </>
          )}
        </form>

        <div className="login-redirect">
          <p>
            כבר יש לך חשבון?{" "}
            <span className="highlight" onClick={handleLoginRedirect}>
              התחבר כאן
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
