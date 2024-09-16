import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", email, password);
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>ברוכים הבאים ל-SafeDonate</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email">אימייל</label>
          <input
            type="email"
            id="email"
            placeholder="הכנס את כתובת האימייל שלך"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit" className="login-button">
            כניסה
          </button>
        </form>

        <div className="signup-redirect">
          <p>
            עוד לא ב-SafeDonate?{" "}
            <span className="highlight" onClick={handleSignUpRedirect}>
              צרו חשבון כאן
            </span>{" "}
            והתחילו ליהנות ממידע ושירותים בלעדיים.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
