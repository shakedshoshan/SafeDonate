import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
import "../styles/Loading.css";

const Loding = () => {
    // const location = useLocation();
    // const [isRedirecting, setIsRedirecting] = useState(true);
    // const [message, setMessage] = useState("");

    return (
        <div className="loading-container">
            <div className="loader"></div>
            <p className="loader-text">טוען... נא להמתין</p>
        </div>     
      );
};


export default Loding;
