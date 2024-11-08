// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Stepper from "../components/stepper/Stepper";

// const FetchConversationById = ({ userId, firstName, lastName, codeUIR, token, handleLogout }) => {
//   // Initialize student state with all required properties
//   const [student, setStudent] = useState({
//     firstName: firstName || '',
//     lastName: lastName || '',
//     userId: userId || '',
//     codeUIR: codeUIR || '', // Initially empty, to be filled from API
//   });
//   const [fetchedStudent, setFetchedStudent] = useState(null);
//   const [studentcodeUIR, setStudentCodeUIR] = useState('');
//   const [error, setError] = useState('');

//   useEffect(() => {
//     // Function to add the student if not already present
//     const addStudent = async () => {
//       try {
//         console.log('Attempting to add student:', student); // Debugging log
//         const response = await axios.post('https://localhost:7125/api/Students/add', student, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log('Student added successfully!', response.data);
//       } catch (err) {
//         console.error('Error adding student:', err);
//         setError('Failed to add student. Please check the console for more details.');
//       }
//     };

//     // Function to fetch student data by userId
//     const getStudentByUserId = async () => {
//       try {
//         console.log('Fetching student data for userId:', userId); // Debugging log
//         const response = await axios.get(`https://localhost:7125/api/Students/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log('Fetched student data:', response.data); // Debugging log
//         setFetchedStudent(response.data);
//         setStudentCodeUIR(response.data.codeUIR);

//         // If the student data is fetched successfully, update the student object
//         setStudent((prevStudent) => ({
//           ...prevStudent,
//           codeUIR: response.data.codeUIR,
//         }));

//         return response.data;
//       } catch (error) {
//         console.error('Error fetching student:', error);
//         return null;
//       }
//     };

//     // Main logic to either fetch or add the student
//     if (userId) {
//       getStudentByUserId().then((studentData) => {
//         if (!studentData) {
//           // If student data does not exist, add the student
//           addStudent();
//         }
//       });
//     }
//   }, [userId, token]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <Stepper studentcodeUIR={studentcodeUIR} token={token} />
//       {error && <p className="text-red-500">{error}</p>}
//       <button
//         onClick={handleLogout}
//         className="mt-4 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200"
//       >
//         Logout
//       </button>
//     </div>
//   );
// };

// export default FetchConversationById;

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
        const response = await axios.get(`https://localhost:7125/api/Students/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentCodeUIR(response.data.codeUIR);
        setStudent((prevStudent) => ({
          ...prevStudent,
          codeUIR: response.data.codeUIR,
        }));
      } catch (err) {
        console.error('Error fetching student:', err);
        setError('Failed to fetch student.');
      }
    };

    if (userId) {
      getStudentByUserId().then((studentData) => {
        if (!studentData) {
          addStudent();
        }
      });
    }
  }, [userId, token]);

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


