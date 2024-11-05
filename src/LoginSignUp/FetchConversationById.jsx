import React, { useState, useEffect } from 'react';
import Stepper from "../components/stepper/Stepper";

const FetchConversationById = ({ userId, token, handleLogout }) => {
  const [studentcodeUIR, setStudentCodeUIR] = useState('');

  useEffect(() => {
    const getStudentByUserId = async () => {
      try {
        const response = await axios.get(`https://localhost:7125/api/Students/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentCodeUIR(response.data.codeUIR);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    if (userId) {
      getStudentByUserId();
    }
  }, [userId, token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Stepper studentcodeUIR={studentcodeUIR} token={token} />
      <button onClick={handleLogout} className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200">
        Logout
      </button>
    </div>
  );
};

export default FetchConversationById;
