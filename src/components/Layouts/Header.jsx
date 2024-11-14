import React, { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import UIRRLogo from "../../assets/UIRR.png";
import "./Header.css";
import ApiSystem from "../../apiSystem"

function Header({ onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const fetchStudentByUserId = async (userId) => {
      console.log("Header ", userId);
      try {
        const response = await ApiSystem.get(
          `/Students/GetStudentByUserId/${userId}`);
        console.log("the first name", response.data.firstName);
        console.log("the last name", response.data.lastName);

        // Update state with fetched data
        setUserData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchStudentByUserId(userId);
    }
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="font-bold text-2xl text-blue-600">
          <Link to="/Home" className="font-bold">
            {/* <p>LOGO</p> */}
            <img src={UIRRLogo} alt="UIRR Logo" className="h-8 w-auto rounded-full" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/about" className="blue-txt hover:text-blue-600">
            Home
          </Link>
          <Link to="/stepper" className="blue-txt hover:text-blue-600">
            Reservation
          </Link>


          <Link to="/" className="blue-txt hover:text-blue-600">
            List des Reservations
          </Link>
          <Link to="/contact" className="blue-txt hover:text-blue-600">
            Contact
          </Link>
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <div className="flex flex-col">
              <span className="blue-txt font-semibold">
                {userData.firstName} {userData.lastName}
              </span>
            </div>
            <RxCaretDown
              size={25}
              className={`text-gray-400 ml-2 transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={onLogout}
              >
                <FaSignOutAlt className="text-xl text-red-400 mr-2" />
                <span className="blue-txt">Sign out</span>
              </button>

              {/* <button
                className="flex items-center block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full hover:bg-black/10 text-left"
                onClick={() => {
                  console.log("View Profile clicked");
                }}
              >
                <FaUserCircle className="text-xl text-gray-400 mr-2" />
                <span className="text-gray-800">View Profile</span>
              </button> */}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
