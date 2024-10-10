import { useState } from "react";
import { Navigate, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Home from "./Home";
import AssociationPage from "./AssociationPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./UserProfile";
import AboutUs from "./AboutUs";
import NotFound from "./NotFound";
import NotConnected from "./pages/NotConnected";
import AdvancedSearch from "./components/AdvancedSearch";
import FilteredResultsPage from "./components/FilteredResultsPage";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

const ROUTES = {
  HOME: "/",
  ASSOCIATION_PAGE: "/AssociationPage/:associationNumber",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PROFILE: "/profile/:userId",
  ABOUT_US: "/about-us",
  ADVANCED_SEARCH: "/advanced-search",
  FILTERED_RESULTS: "/filtered-results",
  NOT_FOUND: "*",
  NOT_CONNECTED: "/not-connected",
};

const App = () => {
  const { authUser } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState(""); // Control search term in App
  const [suggestions, setSuggestions] = useState([]); // This is important: make sure `setSuggestions` is defined
  const [npoData, setNpoData] = useState([]); // This will store NPO data
  const [filteredData, setFilteredData] = useState([]);
  
  const navigate = useNavigate();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLogin = () => {
    navigate(ROUTES.LOGIN); // Use navigate here
  };

  const handleSignup = () => {
    navigate(ROUTES.SIGNUP);
  };

  return (
    <div style={{ direction: "rtl", textAlign: "right" }}>
      {/* Pass searchTerm and suggestions to Header */}
      <Header
        onSearch={handleSearch}
        suggestions={suggestions} // Pass suggestions here
        handleLogin={handleLogin}
        // userProfile={userProfile}
      />
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <Home
              filteredData={filteredData}
              setFilteredData={setFilteredData}
              searchTerm={searchTerm}
              setSuggestions={setSuggestions}
              setNpoData={setNpoData} // Pass setNpoData here
            />
          }
        />
        {/* <Route path={ROUTES.ASSOCIATION_PAGE} element={<AssociationPage />} /> */}
        <Route path={ROUTES.ASSOCIATION_PAGE} element={authUser? <AssociationPage /> : <Navigate to= '/not-connected'/>} />
        <Route path={ROUTES.LOGIN} element={authUser? <Navigate to='/' /> : <Login />} />
        <Route path={ROUTES.SIGNUP} element={authUser? <Navigate to='/' /> : <Signup />} />
        <Route path={ROUTES.PROFILE} element={authUser? <UserProfile /> :<Navigate to='/login'/>} />
        <Route path={ROUTES.ABOUT_US} element={<AboutUs />} />
        <Route
          path={ROUTES.ADVANCED_SEARCH}
          element={
            <AdvancedSearch
              npoData={npoData}
              setFilteredData={setFilteredData}
            />
          } // Pass the NPO data here
        />
        <Route
          path={ROUTES.FILTERED_RESULTS}
          element={<FilteredResultsPage />}/>
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path={ROUTES.NOT_CONNECTED} element={<NotConnected />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;