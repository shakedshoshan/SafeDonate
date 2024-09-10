// src/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios"
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e) {
    console.log("submit")
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t("password_mismatch"));
      return;
    }
    // Signup logic
    const response = await axios.post("http://localhost:3000/users/signup", { email: email, password: password })
      if (response.status === 200) {
        const token = response.data.token;
        const expires = new Date(Date.now() + 3600000); // 1 hour from now
        document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`;
        document.cookie = `token=${token}; expires = in 1h for ${Date.now}`;
        navigate("/", { state: { id: email } }); 
      } else {
        console.log("Bad request. Please check your credentials.");
      }


    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="form-container">
      <h2>{t("signup")}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t("password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t("confirm_password")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{t("signup")}</button>
      </form>
      <div>
        <Link to="/login">{t("have_account")}</Link>
      </div>
      <div>
        <button onClick={() => navigate("/")}>{t("back")}</button>
      </div>
    </div>
  );
};

export default SignUp;
