import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layouts/Header";
import LoginSignUp from "./LoginSignUp/loginSignUp.jsx";
import Stepper from "./components/stepper/Stepper.jsx";
import About from "./components/pages/About"; // Ensure the path is correct
import Contact from "./components/pages/Contact"; // Ensure the path is correct
import '../src/LoginSignUp//LoginSignup.css'
 import Home from "./components/pages/Home.jsx"
 import Step3And4Reservation from "./components/stepper/Step3And4Reservation.jsx"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
 
 const [userId, setUserId] = useState("");


  const handleLogin = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId); 
    console.log(userId);
  };
  // console.log(UserID);
  
 

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token"); // Clear the token from local storage
    localStorage.removeItem("studentData"); // Clear any stored student data
    localStorage.removeItem("userId");
  
    
  };

  return (
    <Router>
      {isLoggedIn ? (
        <div className="flex h-screen customm-bg">
          <div className="flex-1 flex flex-col">
            <Header onLogout={handleLogout} />
            <div className="p-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stepper" element={<Stepper />} />
                {/* Pass userId as a prop to Step3And4Reservation */}
                <Route path="/reservation" element={<Step3And4Reservation  userId={userId}/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/contact" element={<Contact/>} />

              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <LoginSignUp onLogin={handleLogin} />
      )}
    </Router>
  );
}

export default App;
