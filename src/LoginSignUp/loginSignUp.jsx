import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApiManager from "../api";
import ApiSystem from "../apiSystem";
import Uirback from "../assets/Uirback.jpeg";
import {  useNavigate } from "react-router-dom";


const LoginSignUp = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [studentData, setStudentData] = useState(null);
  const [studentCodeUIR, setStudentCodeUIR] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("id from method fetch student by UserId data : ",response.data);
      console.log("id from method fetch student by UserId : ",response.data.userId);
      console.log("id from method fetch student name first name : ",response.data.firstName);
      console.log("id from method fetch student name last name : ",response.data.lastName);
      //pass the value of response.data.id to componenet Home 
      console.log("id from method fetch student by Id : ",response.data.id);
      //pass the value of response.data.codeUIR from method FetchStudentByUserId 
      console.log("id from method fetch CodeUIR : ",response.data.codeUIR);
      
      if (response.data) {
        setStudentCodeUIR(response.data.codeUIR);
      } else {
        await addStudent(studentData, token);
      }
      
    } catch (err) {
      console.error('Error fetching student:', err);
      // setError('Failed to fetch student.');
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

  const handleLogout = () => {
    setToken('');
    setStudentData(null);
    setEmail('');
    setPassword('');
    setStudentCodeUIR('');
    localStorage.removeItem('token');
    localStorage.removeItem('studentData');
    onLogin(false);
  };

  return (
    <div className='Main-container '   style={{ backgroundImage: `url(${Uirback})` }}>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">Connexion</h1>
      
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700">Mot de passe:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">
            Se connecter
            </button>
            {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
          </form>
       
      </div>
    </div>
    </div>
  );
};

export default LoginSignUp;
