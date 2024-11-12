

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Stepper from "../components/stepper/Stepper";

const FetchConversationById = ({ userId, codeUIR, firstName, lastName, token, handleLogout }) => {
  const [student, setStudent] = useState({
    firstName: firstName || '',
    lastName: lastName || '',
    userId: userId || '',
    codeUIR: codeUIR || '',
  });

  const [studentcodeUIR, setStudentCodeUIR] = useState('');
  const [error, setError] = useState('');
  console.log(student);
  

  useEffect(() => {
    const addStudent = async () => {
      try {
        const response = await axios.post('https://localhost:7125/api/Students/add', student, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Student added successfully!', response.data);
      } catch (err) {
        console.error('Error adding student:', err);
        setError('Failed to add student.');
      }
    };

    const getStudentByUserId = async () => {
      try {
        const response = await axios.get(`https://localhost:7125/api/Students/GetStudentByUserId/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          // If student exists, do not add them again
          setStudentCodeUIR(response.data.codeUIR);
          setStudent((prevStudent) => ({
            ...prevStudent,
            codeUIR: response.data.codeUIR,
          }));
        } else {
          // If student does not exist, add the student
          addStudent();
        }
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to fetch student.');
      }
    };

    if (userId) {
      getStudentByUserId();  // Check if student exists, add if not
    }
  }, [userId, token, student]);

  return (
    <div>
      <Stepper
        token={token}
        studentcodeUIR={studentcodeUIR}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default FetchConversationById;



