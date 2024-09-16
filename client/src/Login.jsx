import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Modal state
  const [email, setEmail] = useState(""); // Email input state
  const [confirmationMessage, setConfirmationMessage] = useState(""); // Confirmation state

  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/users/reset-password", { email }); // API for password reset
      setConfirmationMessage("אישור נשלח לדוא'ל שלך");
    } catch (error) {
      console.error("Error sending reset email:", error);
      setConfirmationMessage("אירעה שגיאה, נסה שוב.");
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setEmail(""); // Reset email input
    setConfirmationMessage(""); // Reset confirmation message
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ברוכים הבאים ל-SafeDonate</h2>
        <form className="login-form">
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            placeholder="הכנס את כתובת האימייל שלך"
            required
          />

          <label htmlFor="password">סיסמא</label>
          <input
            type="password"
            id="password"
            placeholder="הכנס את הסיסמא שלך"
            required
          />

          <div className="forgot-password">
            <span onClick={handleForgotPassword}>שכחתי סיסמה</span>
          </div>

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

        {/* Forgot Password Modal */}
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
                <button type="submit" className="reset-button">
                  שלח
                </button>
              </form>
              {confirmationMessage && <p>{confirmationMessage}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
