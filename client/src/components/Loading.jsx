import React, { useEffect, useState } from "react";
import "../styles/Loading.css";

const Loading = () => {

    return (
        <div className="loading-container">
            <div className="loader"></div>
            <p className="loader-text">טוען... נא להמתין</p>
        </div>     
      );
};


export default Loading;
