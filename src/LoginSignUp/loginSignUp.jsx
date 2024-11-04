import React, { useState } from "react";
import "./LoginSignUp.css";
import { assets } from "../assets/assets";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignUp = ({ onLogin }) => {
  const [action, setAction] = useState("Login");
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleNameChange = ({ target: { value } }) => {
    setName(value);
  };

  const handlePasswordChange = ({ target: { value } }) => {
    setPassword(value);
  };

  const handleLogin = async () => {
    try {
      const result = await axios.post('https://localhost:7253/api/Account/login', {
        username: name,
        password: password,
      });
      console.log("Login successful, token:", result.data.token);

      // Call onLogin to update isLoggedIn in App
      onLogin();

    //   alert(`Success: ${result.data.token}`);
      navigate('/'); // Redirect to the main page or desired route after login

    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        alert('Error: No response from server.');
      } else {
        alert('Error: Request setup failed.');
      }
    }
  };

  return (
    <div className='Main-container'>
      <div className='Login-container'>
        <div className='header'>
          <div className='text'>{action}</div>
          <div className='underline'></div>
        </div>
        <div className='inputs'>
          {action === "Login" ? null : (
            <div className='input'>
              <img src={assets.person} alt='person' />
              <input
                type="text"
                id="txtName"
                placeholder="Enter Name"
                onChange={handleNameChange}
              />
            </div>
          )}
          <div className='input'>
            <img src={assets.email} alt='email' />
            <input
              type="text"
              id="txtName"
              placeholder="Enter Name"
              onChange={handleNameChange}
            />
          </div>
          <div className='input'>
            <img src={assets.password} alt='password' />
            <input
              type="password"
              id="txtPassword"
              placeholder="Enter Password"
              onChange={handlePasswordChange}
            />
          </div>
        </div>
        <div className='submit-container'>
          <div className={action === "Sign Up" ? "Submit gray" : "submit"} onClick={async () => {
            if (action === "Login") {
              await handleLogin();
            } else {
              setAction("Login");
            }
          }}>
            Login
          </div>
          <div className={action === "Login" ? "Submit gray" : "submit"} onClick={() => {
            setAction("Sign Up")
          }}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
