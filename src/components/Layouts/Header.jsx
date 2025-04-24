import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { RxCaretDown } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import UIRRLogo from "../../assets/UIRR.png";
import profile from "../../assets/profile.png";

import "./Header.css";
import ApiSystem from "../../apiSystem"

import { useLocation } from 'react-router-dom'
import axios from "axios";




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header({ onLogout , userId}) {



  //666

  const [userData, setUserData] = useState({
    givenName: "",
    surname: "",
    email: "",
    userId: "",
    profilePicture: ""
  });

  const[firstNameStudent,setFierstNameStudent]=useState("");
  const[lastNameStudent,setLastNameStudent]=useState("");
  const[userIdStudent,setuserIdStudent]=useState("");
  const[CodeUirStudent,setCodeUirStudent]=useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const message = queryParams.get('message');
  const email = queryParams.get('email');
  const token = queryParams.get('token');
  const givenName = queryParams.get('givenName');
  const surname = queryParams.get('surname');

  const profilePicture = queryParams.get('profilePicture');
  
  const [profileData, setProfileData] = useState({});
  
  
  useEffect(() => {
    const storedData = {
      givenName: localStorage.getItem("givenName"),
      surname: localStorage.getItem("surname"),
      email: localStorage.getItem("email"),
      userId: localStorage.getItem("userId"),
      profilePicture: localStorage.getItem("profilePicture")
    };
    setFierstNameStudent(storedData.givenName);
    setLastNameStudent(storedData.surname);
    setuserIdStudent(storedData.userId);
    setCodeUirStudent(storedData.email);

    console.log("--- stord data id user : " , storedData.userId);
    console.log("--- stord data email code uir : " , storedData.email);
    console.log("--- geven name  stord data : " , storedData.givenName);
    console.log("--- sur name  stord data : " , storedData.surname);
    console.log("---  : user id only " , userId);
    
    setUserData(storedData);

  const studentData = {
    firstName:storedData.givenName,
    lastName: storedData.surname,
    userId:storedData.userId,
    codeUIR: storedData.email,
  };


    const fetchAndAddStudent = async () => {
      if (
        !studentData.firstName ||
        !studentData.lastName ||
        !studentData.userId ||
        !studentData.codeUIR
      ) {
        console.warn("Incomplete student data:", studentData);
        return;
      }
  
      try {
        // Check if student already exists
        const response = await ApiSystem.get(`/Students/GetStudentByUserId/${studentData.userId}`);
  
        if (response?.data?.userId) {
          console.log("✅ Student already exists:", response.data);
          return; // ✅ don't add again
        }
    
        // If no existing student found, add new one
        await ApiSystem.post('/Students/add', studentData);
        console.log("🎉 Student added successfully!");
        // const existingStudent = response.data;
  
        // if (existingStudent) {
        //   setUserData({
        //     firstName: existingStudent.firstName,
        //     lastName: existingStudent.lastName,
        //   });
        //   console.log("Student already exists:", existingStudent);
        // } else {
        //   // Add the new student
        //   await ApiSystem.post('/Students/add', studentData);
        //   console.log("Student added successfully!");
        // }
      } catch (err) {
        // console.error("Error fetching or adding student:", err);
         // If GET fails with 404, we assume student doesn't exist and add
      if (err.response?.status === 404) {
        try {
          await ApiSystem.post('/Students/add', studentData);
          console.log("🎉 Student added after 404 GET!");
        } catch (postErr) {
          console.error("❌ Failed to add student after 404:", postErr);
        }
      } else {
        console.error("❌ Error fetching student:", err);
      }
  
  
      }
    };
  
    fetchAndAddStudent();


  }, [userId]);

  const handleSignOut = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      navigate('/');
  };
  // 6666
  



  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  


 
// useEffect(() => {
//   const studentData = {
//     firstName:firstNameStudent,
//     lastName: lastNameStudent,
//     userId:userIdStudent,
//     codeUIR: CodeUirStudent,
//   };

//   const fetchAndAddStudent = async () => {
//     if (
//       !studentData.firstName ||
//       !studentData.lastName ||
//       !studentData.userId ||
//       !studentData.codeUIR
//     ) {
//       console.warn("Incomplete student data:", studentData);
//       return;
//     }

//     try {
//       // Check if student already exists
//       const response = await ApiSystem.get(`/Students/GetStudentByUserId/${studentData.userId}`);

//       if (response?.data?.userId) {
//         console.log("✅ Student already exists:", response.data);
//         return; // ✅ don't add again
//       }
  
//       // If no existing student found, add new one
//       await ApiSystem.post('/Students/add', studentData);
//       console.log("🎉 Student added successfully!");
//       // const existingStudent = response.data;

//       // if (existingStudent) {
//       //   setUserData({
//       //     firstName: existingStudent.firstName,
//       //     lastName: existingStudent.lastName,
//       //   });
//       //   console.log("Student already exists:", existingStudent);
//       // } else {
//       //   // Add the new student
//       //   await ApiSystem.post('/Students/add', studentData);
//       //   console.log("Student added successfully!");
//       // }
//     } catch (err) {
//       // console.error("Error fetching or adding student:", err);
//        // If GET fails with 404, we assume student doesn't exist and add
//     if (err.response?.status === 404) {
//       try {
//         await ApiSystem.post('/Students/add', studentData);
//         console.log("🎉 Student added after 404 GET!");
//       } catch (postErr) {
//         console.error("❌ Failed to add student after 404:", postErr);
//       }
//     } else {
//       console.error("❌ Error fetching student:", err);
//     }


//     }
//   };

//   fetchAndAddStudent();
// }, [userId]);
//todo : -------------------------

  // useEffect(() => {
  //   if (userId) {
  //     const fetchStudentByUserId = async (userId) => {
  //       try {
  //         const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`);
  //         console.log(userId);
  //         setUserData({
  //           firstName: response.data.firstName,
  //           lastName: response.data.lastName,
  //         });
  //       } catch (err) {

  //         console.error("-- Error fetching student:", err);
  //       }
  //     };

  //   }
  //   fetchStudentByUserId(userId);
  // }, [userId]);
  return (
    <Disclosure as="nav" className="bg-[#073567] sticky top-0 z-50">
  <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
    <div className="relative flex h-16 items-center justify-between">
      <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
        {/* Mobile menu button*/}
        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Ouvrir le menu principal</span>
          <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
          <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
        </DisclosureButton>
      </div>
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex shrink-0 items-center">
          <Link to="/">
            <img src={UIRRLogo} alt="UIRR Logo" className="h-8 w-auto rounded-full" />
          </Link>
        </div>
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex space-x-4">
            <Link to="/" className={classNames('bg-gray-900 text-white', 'rounded-md px-3 py-2 text-sm font-medium')}>
              Accueil
            </Link>
            <Link to="/stepper" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}>
              Réserver maintenant
            </Link>
            <Link to="/reservationList" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}>
              Mes réservations
            </Link>
            <Link to="/contact" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}>
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        <button type="button" className="relative rounded-full bg-[#073567] p-1 text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">View notifications</span>   <div style={{ maxWidth: '500px', margin: 'auto', textAlign: 'center', padding: '20px' }}>
         
          
                <>
                   
                 
  
                     {firstNameStudent} {lastNameStudent}
              
                   
                </>
        

        
        </div>
        </button>

        {/* Profile dropdown */}
        <Menu as="div" className="relative ml-3">
          <div>
            <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Ouvrir le menu utilisateur</span>
              <img src={profile} alt="UIRR Logo" className="h-8 w-auto rounded-full" />
            </MenuButton>
          </div>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
          <MenuItem>
  <a 
    onClick={onLogout} 
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none flex items-center space-x-2 cursor-pointer"
  >
    <FaSignOutAlt className="text-xl text-red-400" />
    <span>Déconnexion</span>
  </a>
</MenuItem>

          </MenuItems>
        </Menu>
      </div>
    </div>
  </div>

  <DisclosurePanel className="sm:hidden">
    <div className="space-y-1 px-2 pb-3 pt-2">
      <Link to="/" aria-current="page" className={classNames('bg-gray-900 text-white', 'block rounded-md px-3 py-2 text-base font-medium')}>
        Accueil
      </Link>
      <Link to="/stepper" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}>
        Réserver maintenant
      </Link>
      <Link to="/reservationList" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}>
        Mes réservations
      </Link>
      <Link to="/contact" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}>
        Contactez-nous
      </Link>
    </div>
  </DisclosurePanel>
</Disclosure>

  )
}
