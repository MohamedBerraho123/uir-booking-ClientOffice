import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiSystem from "../../apiSystem";
import Filtrage from "../TableComponent/Fitrage";
import { ClipLoader } from 'react-spinners'; 
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const ReservationList = ({userId}) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [studentNames, setStudentNames] = useState({});
 
  const [studentFirstNames, setStudentFirstNames] = useState('');
  const [studentLastNames, setStudentLastNames] = useState({});
  const [studentId, setStudentId] = useState(null);
  const [codeUIR, setCodeUIR] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(4);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    console.log("user id :::::",userId);
    if (userId) {
      fetchStudentByUserId(userId);
    }

    
  }, []);

  useEffect(() => {
    
    
    if (studentId) {
      fetchReservation();
    }
    // console.log('is work : codeUIR' , codeUIR);
    
  }, [studentId, selectedSport , codeUIR ,studentFirstNames , studentLastNames]); // Add selectedSport as a dependency


  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`);
      if (response.data) {
        setStudentId(response.data.id);
        setCodeUIR(response.data.codeUIR);
        setStudentFirstNames(response.data.firstName);
        setStudentLastNames(response.data.lastName);
        // console.log('response.data.codeUIR : ', response.data.codeUIR);
        

      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  const fetchReservation = async () => {
    if (!studentId) return;
    setLoading(true); 

    try {
      const endpoint = selectedSport
        ? `/Reservations/ByCategoryAndStudentId/${selectedSport}/${codeUIR}`
        : `/Reservations/byStudent/${codeUIR}`;

      const response = await ApiSystem.get(endpoint);
   
      setRequests(response.data);
      setFilteredRequests(response.data);
      console.log("list res",codeUIR);
      

      response.data.forEach((reservation) => {
        if (reservation.sportId && !sportNames[reservation.sportId]) {
          fetchSportName(reservation.sportId);
        }
        if (reservation.studentId && !studentNames[reservation.studentId]) {
          fetchStudentName(reservation.studentId);
        }
      });
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }finally {
      setLoading(false); // Stop loading animation
    }
  };

  const fetchSportName = async (sportId) => {
    try {
      const response = await ApiSystem.get(`/Sports/${sportId}`);
      setSportNames((prev) => ({ ...prev, [sportId]: response.data.name }));
    } catch (error) {
      console.error("Error fetching sport name:", error);
    }
  };



  const handleSportSelect = (sportId) => {
    setSelectedSport(sportId);
  };


   //todo : Pagination logic
   const indexOfLastRequest = currentPage * requestsPerPage;
   const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
   const currentRequests = filteredRequests.slice(
     indexOfFirstRequest,
     indexOfLastRequest
   );
   const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
   const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
 
  return (
    <>
    <div className="flex justify-center items-center mt-16 mb-20">
      <div className="flex flex-col items-center w-full px-2 sm:px-4 md:px-10 lg:px-40">
        <Filtrage
          requests={requests}
          onFilteredRequests={setFilteredRequests}
          sportNames={sportNames}
          onSportSelect={handleSportSelect}
        />
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
        {loading ? ( // Show spinner if loading
            <div className="flex justify-center py-10">
              <ClipLoader size={50} color="#183680" />
            </div>
          ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr style={{ backgroundColor: "#183680", color: "white" }}>
               
                <th className="py-2 px-2 text-sm md:py-3 md:px-4 whitespace-nowrap">
                  Nom complet
                </th>
                <th className="py-2 px-2 text-sm md:py-3 md:px-4 whitespace-nowrap">
                  Sport
                </th>
                <th className="py-2 px-2 text-sm md:py-3 md:px-4 whitespace-nowrap">
                  Heure
                </th>
                <th className="py-2 px-2 text-sm md:py-3 md:px-4 whitespace-nowrap">
                  Date
                </th>
                <th className="py-2 px-2 text-sm md:py-3 md:px-4 whitespace-nowrap">
                  liste des étudiants
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-300 odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                
                  <td className="py-2 px-2 md:py-2 md:px-4">
              
                    {codeUIR || "Loading..."}
            
                    {`${studentFirstNames || "Loading..."} ${
                      studentLastNames || "Loading..."
                    }`}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4">
                    {sportNames[request.sportId] || "Loading..."}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4">
                    {`${request.hourStart} - ${request.hourEnd}`}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4">{request.onlyDate}</td>
                  <td className="py-2 px-2 md:py-2 md:px-4">
                    {request.codeUIRList?.join(", ") || "No codes"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
          )}
          <div className="mt-6 flex justify-center">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </div>
        </div>
      </div>
 
     
    </div>
  </>
  
  );
};

export default ReservationList;