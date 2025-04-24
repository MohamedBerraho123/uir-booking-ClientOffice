import React, { useState, useEffect } from 'react';
import './LoginSignUp.css';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = () => {
  const navigate = useNavigate();

  const handleLoginMicrosoft = () => {
    // Redirect to the backend's Microsoft authentication endpoint
    window.location.href = "https://localhost:7109/api/auth/microsoft";

    
  };
  

  return (
    <div className="flex justify-center items-center h-screen css-background">
      {/* center: Login Form */}
      <div className="bg-[#f8f9fc] lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold mb-4">Connexion</h1>

        <button
          onClick={handleLoginMicrosoft}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Sign in with Microsoft
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;


//todo : 
// import { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import Header from "./components/Layouts/Header";
// import LoginSignUp from "./LoginSignUp/loginSignUp.jsx";
// import About from "./components/pages/About";
// import Contact from "./components/pages/Contact";
// import ReservationList from "./components/pages/ReservationList.jsx";
// import Booking from "./components/Steppers/Booking";

// function AppWrapper() {
//   const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get("token");

//     if (token) {
//       localStorage.setItem("token", token);
//       localStorage.setItem("isLoggedIn", "true");
//       setIsLoggedIn(true);

//       // Clean URL and redirect to /
//       navigate("/", { replace: true });
//     }
//   }, [location.search, navigate]);

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem("isLoggedIn");
//     localStorage.removeItem("token");
//     localStorage.removeItem("studentData");
//   };

//   return (
//     <>
//       {isLoggedIn ? (
//         <div className="flex h-screen customm-bg">
//           <div className="flex-1 flex flex-col">
//             <Header onLogout={handleLogout} />
//             <div className="p-0">
//               <Routes>
//                 <Route path="/" element={<About />} />
//                 <Route path="/reservationList" element={<ReservationList />} />
//                 <Route path="/stepper" element={<Booking />} />
//                 <Route path="/contact" element={<Contact />} />
//               </Routes>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <LoginSignUp />
//       )}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// }

// export default App;

