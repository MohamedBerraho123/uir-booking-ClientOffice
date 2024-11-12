import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Stepper from '../components/stepper/Stepper';

const LoginSignUp = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [studentData, setStudentData] = useState(null);
  const [studentCodeUIR, setStudentCodeUIR] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      const storedData = JSON.parse(localStorage.getItem('studentData'));
      if (storedData) {
        setStudentData(storedData);
        fetchStudentByUserId(storedData.userId);
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7253/api/Account/registerAutomaticallyAndLoginAutomatically', {
        email,
        password,
      });

      const { token, userId, codeUIR, firstName, lastName } = response.data;
      console.log("code uir 1 :" , userId );
      
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('studentData', JSON.stringify({ userId, codeUIR, firstName, lastName }));
      
      const newStudentData = { userId, codeUIR, firstName, lastName };
      setStudentData(newStudentData);
      console.log("code uir 2 :" , userId );

      // Automatically add the student upon successful registration and login
      await addStudent(newStudentData, token);

      onLogin(userId);
    } catch (error) {
      setErrorMessage(error.response?.data?.Message || 'Registration/Login failed');
    }
  };

  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:7125/api/Students/GetStudentByUserId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setStudentCodeUIR(response.data.codeUIR);
      } else {
        await addStudent(studentData, token);
      }
    } catch (err) {
      console.error('Error fetching student:', err);
      setError('Failed to fetch student.');
    }
  };

  const addStudent = async (studentData, token) => {
    try {
      await axios.post('https://localhost:7125/api/Students/add', studentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentCodeUIR(studentData.codeUIR);
    } catch (err) {
      console.error('Error adding student:', err);
      setError('Failed to add student.');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
      
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
              <label htmlFor="password" className="block text-gray-700">Password:</label>
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
              Sign In
            </button>
            {errorMessage && <p className="text-red-500 mt-2 text-center">{errorMessage}</p>}
          </form>
       
      </div>
    </div>
  );
};

export default LoginSignUp;
