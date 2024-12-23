import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Layouts/Header";
import LoginSignUp from "./LoginSignUp/loginSignUp.jsx";
// import Stepper from "./components/stepper/Stepper.jsx";
import About from "./components/pages/About"; // Ensure the path is correct
import Contact from "./components/pages/Contact"; // Ensure the path is correct
import '../src/LoginSignUp//LoginSignup.css'
 import ReservationList from "./components/pages/ReservationList.jsx"
 import Booking from "../src/components/Steppers/Booking"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => { return localStorage.getItem("isLoggedIn") === "true";} , !!localStorage.getItem("token"));
 



  const handleLogin = () => {
    setIsLoggedIn(true);
  
    localStorage.setItem("isLoggedIn", "true");
   
  
  };
 
  
 

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token"); // Clear the token from local storage
    localStorage.removeItem("studentData"); // Clear any stored student data 
 
  
    
  };

  return (
    <Router className="bg-[#f8f9fc]">
      {isLoggedIn ? (
        <div className="flex h-screen customm-bg">
          <div className="flex-1 flex flex-col">
            <Header onLogout={handleLogout} />
            <div className="p-0">
              <Routes>
                <Route path="/reservationList" element={<ReservationList />} />
                <Route path="/stepper" element={<Booking />} />
             
              
                <Route path="/" element={<About/>} />
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
