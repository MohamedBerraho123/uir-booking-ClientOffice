// import React, { useState } from "react";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import { RxCaretDown } from "react-icons/rx";
// import { Link } from "react-router-dom";

// function Header({ onLogout }) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//     <div className="flex items-center justify-between pl-17 p-4 bg-white shadow-sm">
//       <Link to="/" className="font-bold text-xl"> {/* Link to home or logo */}
//         LOGO
//       </Link>
//       <div className="flex space-x-4">
//         <Link to="/about" className="text-gray-800 hover:text-gray-600">About</Link>
//         <Link to="/contact" className="text-gray-800 hover:text-gray-600">Contact</Link>
//       </div>
//       <div className="relative">
//         <div className="flex items-center space-x-4 pr-10">
//           <div
//             className="flex items-center space-x-2 cursor-pointer"
//             onClick={toggleDropdown}
//           >
//             <div className="flex flex-col">
//               <span className="text-gray-800 font-semibold">Jaafar TAGMOUTI</span>
//               <span className="text-gray-400 text-sm">Admin</span>
//             </div>
//           </div>
//           <RxCaretDown
//             size={25}
//             className={`text-gray-400 cursor-pointer ${dropdownOpen ? "transform rotate-180" : ""
//               }`}
//             onClick={toggleDropdown}
//           />
//         </div>
//         {dropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
//             <button
//               className="flex items-center block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
//               onClick={() => {
//                 console.log("View Profile clicked");
//               }}
//             >
//               <FaUserCircle className="text-xl text-gray-200 mr-2" />
//               <span className="text-gray-200">View Profile</span>
//             </button>
//             <button
//               className="flex items-center block px-4 py-2 text-gray-800 hover:bg-black/10 w-full text-left"
//               onClick={onLogout} // Call onLogout when Sign out is clicked
//             >
//               <FaSignOutAlt className="text-xl text-meta-1 mr-2" />
//               <span className="text-meta-1">Sign out</span>
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Header;
import React, { useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { Link } from "react-router-dom";

function Header({ onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl text-blue-600">
          LOGO
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
        </nav>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
            <div className="flex flex-col">
              <span className="text-gray-800 font-semibold">Jaafar TAGMOUTI</span>

            </div>
            <RxCaretDown
              size={25}
              className={`text-gray-400 ml-2 transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <Link
                to="/profile"
                className="flex items-center block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                <FaUserCircle className="text-xl text-gray-400 mr-2" />
                <span className="text-gray-800">View Profile</span>
              </Link>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={onLogout} // Call onLogout when Sign out is clicked
              >
                <FaSignOutAlt className="text-xl text-gray-400 mr-2" />
                <span className="text-gray-800">Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
