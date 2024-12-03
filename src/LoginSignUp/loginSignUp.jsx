import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiManager from "../api";
import ApiSystem from "../apiSystem";
import Uirback1 from "../assets/uiir.jpeg";
import uirImage2 from "../assets/Uirback.jpeg"
import uirImage3 from "../assets/uiirr.jpeg"
import {  useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';  
import { ClipLoader } from 'react-spinners'; 


const LoginSignUp = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [studentData, setStudentData] = useState(null);
  const [studentCodeUIR, setStudentCodeUIR] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
    // Array of images
    const images = [uirImage2, uirImage3, Uirback1];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
 
    const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
    // Change image every 10 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
  
      // Cleanup the interval on component unmount
      return () => clearInterval(interval);
    }, []);
  
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await ApiManager.post('/Account/registerAutomaticallyAndLoginAutomatically', {
        email,
        password,
      });

      const { token, userId, codeUIR, firstName, lastName } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('studentData', JSON.stringify({ userId, codeUIR, firstName, lastName }));
      
      const newStudentData = { userId, codeUIR, firstName, lastName };
      setStudentData(newStudentData);
   

      // Automatically add the student upon successful registration and login 
      await addStudent(newStudentData, token);
      onLogin();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.Message || 'Registration/Login failed');
    }finally {
      setLoading(false); // Stop loading animation
    }
  };


  const addStudent = async (studentData) => {
  
    
    if (
      !studentData ||
      !studentData.firstName ||
      !studentData.lastName ||
      !studentData.userId ||
      !studentData.codeUIR
    ) {
      // console.log('Invalid student data:', studentData);
      return; // Do not add if data is missing
    }
    try {
      await ApiSystem.post('/Students/add', studentData);
      setStudentCodeUIR(studentData.codeUIR);
    } catch (err) {
      console.error('Error adding student:', err);
      // setError('Failed to add student.');
    }
  };



  
  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
    {/* Left: Image */}
    <div className="w-1/2 h-screen hidden lg:block">
      <img
        src={images[currentImageIndex]} 
        alt="Dynamic Image"
        className="object-cover w-full h-full"
      />
   
    </div>

    {/* Right: Login Form */}
    <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
      <h1 className="text-2xl font-semibold mb-4">Connexion</h1>
      <form onSubmit={handleSubmit}>
        {/* Username Input */}
        <div className="mb-4 bg-sky-100">
          <label
            htmlFor="username"
            className="block text-gray-600"
          >
            Email
          </label>
          <input
               id="email"
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            autoComplete="off"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
      <label htmlFor="password" className="block text-gray-800">
        Mot de passe:
      </label>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}  
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 pr-10"
          autoComplete="off"
        />
        
        {/* Show/Hide password icon */}
        <div
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </div>
      </div>
    </div>

      

        {/* Login Button */}
        {/* <button
          type="submit"
          className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90 text-white font-semibold rounded-md py-2 px-4 w-full"
        >
             Se connecter
        </button> */}
         <button
            type="submit"
            disabled={loading} // Disable the button when loading
            className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1E3B8B] hover:bg-[#1E3B8B]/90'
            } text-white font-semibold rounded-md py-2 px-4 w-full flex justify-center items-center`}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Se connecter'}
          </button>
        {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}

      </form>

      
    </div>
  </div>
  );
};

export default LoginSignUp;
