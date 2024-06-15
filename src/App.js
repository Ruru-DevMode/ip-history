import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";

const auth = {
  isAuthenticated: false,
  checkAuthStatus: () => {
    return new Promise((resolve, reject) => {
      const isLoggedIn = localStorage.getItem("token") !== null;
      resolve(isLoggedIn);
    });
  },
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isAuthenticated = await auth.checkAuthStatus();
        setIsLoggedIn(isAuthenticated);
      } catch (error) {
        console.error("Error during authentication check:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
