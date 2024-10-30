import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state
  // const [showForgotPassword, setShowForgotPassword] = useState(false); // Modal state
  // const [confirmationMessage, setConfirmationMessage] = useState(""); // Confirmation state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  // const handleSendResetEmail = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.post("http://localhost:5000/users/reset-password", { email }); // API for password reset
  //     setConfirmationMessage("אישור נשלח לדוא'ל שלך");
  //   } catch (error) {
  //     console.error("Error sending reset email:", error);
  //     setConfirmationMessage("אירעה שגיאה, נסה שוב.");
  //   }
  // };

  // const closeForgotPasswordModal = () => {
  //   setShowForgotPassword(false);
  //   setEmail(""); // Reset email input
  //   setConfirmationMessage(""); // Reset confirmation message
  // };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ברוכים הבאים ל-SafeDonate</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {" "}
          {/* Attach handleLogin to form submit */}
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Set email value
            placeholder="הכנס את כתובת האימייל שלך"
            required
          />
          <label htmlFor="password">סיסמא</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Set password value
            placeholder="הכנס את הסיסמא שלך"
            required
          />{" "}
          <button type="submit" className="login-button">
            התחבר
          </button>
        </form>

        <div className="signup-redirect">
          <p>
            עוד לא ב-SafeDonate?{" "}
            <span className="highlight" onClick={handleSignUpRedirect}>
              צרו חשבון כאן
            </span>
          </p>
        </div>

        {/* Forgot Password Modal
        {showForgotPassword && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button
                className="close-modal"
                onClick={closeForgotPasswordModal}
              >
                &times;
              </button>
              <h3>איפוס סיסמה</h3>
              <form onSubmit={handleSendResetEmail}>
                <label htmlFor="reset-email">הכנס את האימייל שלך</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="הכנס את כתובת האימייל שלך"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="reset-button"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner "></span>
                  ) : (
                    "שלח"
                  )}
                </button>
              </form>
              {confirmationMessage && <p>{confirmationMessage}</p>}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Login;
