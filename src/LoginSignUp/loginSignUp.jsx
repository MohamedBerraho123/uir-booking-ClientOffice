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


