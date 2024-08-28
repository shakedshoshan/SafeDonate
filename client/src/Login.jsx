// src/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios"
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    
    const response = await axios.post("http://localhost:3000/users/login", { email: email, password: password })
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
      <h2>{t("login")}</h2>
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
        <button type="submit">{t("login")}</button>
      </form>
      <div>
        <Link to="/signup">{t("no_account")}</Link>
      </div>
      <div>
        <button onClick={() => navigate("/")}>{t("back")}</button>
      </div>
    </div>
  );
};

export default Login;
