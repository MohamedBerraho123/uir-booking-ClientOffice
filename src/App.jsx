import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Layouts/Header";
import LoginSignUp from "./LoginSignUp/loginSignUp.jsx";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import ReservationList from "./components/pages/ReservationList.jsx";
import Booking from "./components/Steppers/Booking";

function AppWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const givenName = queryParams.get("givenName");
    const surname = queryParams.get("surname");
    const email = queryParams.get("email");
    const userId = queryParams.get("userId");
    const profilePicture = queryParams.get("profilePicture");
    console.log(userId);
    
  
    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("givenName", givenName);
      localStorage.setItem("surname", surname);
      localStorage.setItem("email", email);
      localStorage.setItem("userId", userId);
      localStorage.setItem("profilePicture", profilePicture);
      setUserId(userId); // Set it in state
      setIsLoggedIn(true);
  
      // Clean URL and redirect to /
      navigate("/", { replace: true });
    }
  }, [location.search, navigate]);
  

  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("studentData");
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="flex h-screen customm-bg">
          <div className="flex-1 flex flex-col">
            <Header onLogout={handleLogout} userId={userId} />
            <div className="p-0">
              <Routes>
                <Route path="/" element={<About />} />
                <Route path="/reservationList" element={<ReservationList />} />
                <Route path="/stepper" element={<Booking userId={userId} />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <LoginSignUp />
      )}
    </>
  );
}




function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;

