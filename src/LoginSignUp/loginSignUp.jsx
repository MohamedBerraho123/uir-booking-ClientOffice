import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FetchConversationById from '../LoginSignUp/FetchConversationById';

const LoginSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (token) {
      const { userId, codeUIR, firstName, lastName } = JSON.parse(localStorage.getItem('studentData')) || {};
      setStudentData({ userId, codeUIR, firstName, lastName });
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
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('studentData', JSON.stringify({ userId, codeUIR, firstName, lastName }));

      setStudentData({ userId, codeUIR, firstName, lastName });
      console.log('Login successful');
    } catch (error) {
      setErrorMessage(error.response?.data?.Message || 'Registration/Login failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setStudentData(null);
    setEmail('');
    setPassword('');
    localStorage.removeItem('token');
    localStorage.removeItem('studentData');
    console.log('User logged out');
  };

  return (
   
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {!token ? (
          <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
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
        ) : (
          studentData && (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <FetchConversationById
              token={token}
              userId={studentData.userId}
              codeUIR={studentData.codeUIR}
              firstName={studentData.firstName}
              lastName={studentData.lastName}
              handleLogout={handleLogout}
            />
             </div>
             </div>
          )
        )}
      </div>
    </div>
  );
};

export default LoginSignUp;
