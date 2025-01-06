import React, { useState } from 'react';
import axios from 'axios';
import ApiManager from "../api";
import ApiSystem from "../apiSystem";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';  
import { ClipLoader } from 'react-spinners'; 
import './LoginSignUp.css'

const LoginSignUp = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [studentData, setStudentData] = useState(null);
  const [studentCodeUIR, setStudentCodeUIR] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
   
      await addStudent(newStudentData, token);
      onLogin();
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.Message || 'Registration/Login failed');
    } finally {
      setLoading(false);
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
      return;
    }
    try {
      await ApiSystem.post('/Students/add', studentData);
      setStudentCodeUIR(studentData.codeUIR);
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen css-background">
    {/* center: Login Form */}
    <div className="bg-[#f8f9fc] lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2 shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Connexion</h1>
      <form onSubmit={handleSubmit}>


        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600">
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
  
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-800">
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500 pr-10"
              autoComplete="off"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>
        </div>
  
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
          } text-white font-semibold rounded-md py-2 px-4 w-full flex justify-center items-center`}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Se connecter"}
        </button>
        {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
      </form>
    </div>
  </div>
  
  );
};

export default LoginSignUp;
