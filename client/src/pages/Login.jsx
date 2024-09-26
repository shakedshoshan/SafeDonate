import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
   const [email, setEmail] = useState(""); // Email input state
   const [password, setPassword] = useState(""); // Password input state
   const [showForgotPassword, setShowForgotPassword] = useState(false); // Modal state
   const [confirmationMessage, setConfirmationMessage] = useState(""); // Confirmation state
   const navigate = useNavigate();

   const { loading, login } = useLogin();

   const handleSubmit = async (e) => {
      e.preventDefault();
      await login(email, password);
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
                        <button type="submit" className="reset-button" disabled={loading}>
                           {loading ? <span className='loading loading-spinner '></span> : "שלח"}
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


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import "./styles/Login.css";

// const Login = () => {
//   const [showForgotPassword, setShowForgotPassword] = useState(false); // Modal state
//   const [email, setEmail] = useState(""); // Email input state
//   const [password, setPassword] = useState(""); // Password input state
//   const [confirmationMessage, setConfirmationMessage] = useState(""); // Confirmation state
//   const navigate = useNavigate();

//   async function handleLogin(e) {
//     e.preventDefault(); // Prevent form from refreshing the page
//     console.log("Logging in with:", email, password);

//     const response = await axios.post("http://localhost:3000/users/login", {
//       email: email,
//       password: password,
//     });
//     if (response.status === 200) {
//       const token = response.data.token;
//       const expires = new Date(Date.now() + 3600000); // 1 hour from now
//       document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`;
//       document.cookie = `token=${token}; expires = in 1h for ${Date.now}`;

//       navigate("/", { state: { id: email } });
//       window.location.reload();
//     } else {
//       console.log("Bad request. Please check your credentials.");
//     }

//     console.log("Email:", email, "Password:", password);
//   }

//   const handleSignUpRedirect = () => {
//     navigate("/signup");
//   };

//   const handleForgotPassword = () => {
//     setShowForgotPassword(true);
//   };

//   const handleSendResetEmail = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:3000/users/reset-password", { email }); // API for password reset
//       setConfirmationMessage("אישור נשלח לדוא'ל שלך");
//     } catch (error) {
//       console.error("Error sending reset email:", error);
//       setConfirmationMessage("אירעה שגיאה, נסה שוב.");
//     }
//   };

//   const closeForgotPasswordModal = () => {
//     setShowForgotPassword(false);
//     setEmail(""); // Reset email input
//     setConfirmationMessage(""); // Reset confirmation message
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         <h2>ברוכים הבאים ל-SafeDonate</h2>
//         <form className="login-form" onSubmit={handleLogin}>
//           {" "}
//           {/* Attach handleLogin to form submit */}
//           <label htmlFor="email">אימייל</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)} // Set email value
//             placeholder="הכנס את כתובת האימייל שלך"
//             required
//           />
//           <label htmlFor="password">סיסמא</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)} // Set password value
//             placeholder="הכנס את הסיסמא שלך"
//             required
//           />
//           <div className="forgot-password">
//             <span onClick={handleForgotPassword}>שכחתי סיסמה</span>
//           </div>
//           <button type="submit" className="login-button">
//             התחבר
//           </button>
//         </form>

//         <div className="signup-redirect">
//           <p>
//             עוד לא ב-SafeDonate?{" "}
//             <span className="highlight" onClick={handleSignUpRedirect}>
//               צרו חשבון כאן
//             </span>
//           </p>
//         </div>

//         {/* Forgot Password Modal */}
//         {showForgotPassword && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <button
//                 className="close-modal"
//                 onClick={closeForgotPasswordModal}
//               >
//                 &times;
//               </button>
//               <h3>איפוס סיסמה</h3>
//               <form onSubmit={handleSendResetEmail}>
//                 <label htmlFor="reset-email">הכנס את האימייל שלך</label>
//                 <input
//                   type="email"
//                   id="reset-email"
//                   placeholder="הכנס את כתובת האימייל שלך"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <button type="submit" className="reset-button">
//                   שלח
//                 </button>
//               </form>
//               {confirmationMessage && <p>{confirmationMessage}</p>}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;
