import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Loading.css";

const Loading = () => {
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [message, setMessage] = useState("");

  // Retrieve the redirect URL from query parameters
  const params = new URLSearchParams(location.search);
  const redirectUrl = params.get("redirectUrl");

  useEffect(() => {
    // Check the format of the redirectUrl
    if (redirectUrl) {
      if (redirectUrl.includes("@")) {
        setMessage(
          `לעמותה זו אין אתר, הנה כתובת אימייל בה ניתן להגיע להסדר על תרומה: ${redirectUrl}`
        );
        setIsRedirecting(false); // Stop redirection for email
      } else if (/^\d+$/.test(redirectUrl)) {
        setMessage(
          `לעמותה זו אין אתר, הנה מספר טלפון בו ניתן להגיע להסדר תרומה: ${redirectUrl}`
        );
        setIsRedirecting(false); // Stop redirection for phone number
      } else {
        // Redirect after 8 seconds for regular URLs
        const timer = setTimeout(() => {
          window.location.href = redirectUrl;
        }, 8000);

        return () => clearTimeout(timer); // Cleanup timeout if component unmounts
      }
    }
  }, [redirectUrl]);

  return (
    <div className="loading-container">
      {isRedirecting ? (
        <>
          <div className="loading-spinner"></div>
          <p>טוען... נא להמתין</p>
        </>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default Loading;
