import React, { useEffect, useState } from "react";
import ApiManager from "../../api";
import { toast } from "react-toastify";
import ApiSystem from "../../apiSystem";
import Filtrage from "../TableComponent/Fitrage";
import Pagination from "../TableComponent/Pagination";

const Home = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [studentFirstNames, setStudentFirstNames] = useState({});
  const [studentLastNames, setStudentLastNames] = useState({});
  const [studentId, setStudentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(5);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("studentData"));
    if (storedData) {
      fetchStudentByUserId(storedData.userId);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchReservation();
    }
  }, [studentId]);

  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`);
      if (response.data) {
        setStudentId(response.data.id); // Save fetched studentId in state
      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  const fetchReservation = () => {
    if (!studentId) return;

    ApiSystem.get(`/Reservations/byStudent/${studentId}`)
      .then((res) => {
        setRequests(res.data); // Store all fetched requests
        setFilteredRequests(res.data); // Set filtered requests to all initially
        res.data.forEach((reservation) => {
          if (reservation.sportId && !sportNames[reservation.sportId]) {
            fetchSportName(reservation.sportId);
          }
          if (reservation.studentId && !studentNames[reservation.studentId]) {
            fetchStudentName(reservation.studentId);
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchSportName = async (sportId) => {
    try {
      const response = await ApiSystem.get(`/Sports/${sportId}`);
      setSportNames((prevSportNames) => ({
        ...prevSportNames,
        [sportId]: response.data.name,
      }));
    } catch (error) {
      console.error("Error fetching sport name:", error);
    }
  };

  const fetchStudentName = async (studentId) => {
    try {
      const response = await ApiSystem.get(`/Students/student/${studentId}`);
      setStudentNames((prevStudentNames) => ({
        ...prevStudentNames,
        [studentId]: response.data.codeUIR,
      }));
      setStudentFirstNames((prevFirstNames) => ({
        ...prevFirstNames,
        [studentId]: response.data.firstName,
      }));
      setStudentLastNames((prevLastNames) => ({
        ...prevLastNames,
        [studentId]: response.data.lastName,
      }));
    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };



  // Pagination logic
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  return (
    <>
      <div className="flex justify-center items-center mt-32 mb-40">
        <div className="flex flex-col items-center w-full mx-40">
          <Filtrage requests={requests} onFilteredRequests={setFilteredRequests} sportNames={sportNames}  />

          <div className="overflow-x-auto mt-10 w-full">
            <table className="bg-white border border-gray-200 w-full">
              <thead>
                <tr style={{ backgroundColor: '#183680' , color: 'white' }}>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair">Student code</th>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair">Full Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair">Sport</th>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair">List Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-lg bg-darkBlue text-gris-clair"></th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="border-t py-3 px-4 border-gris-moyen">
                      {studentNames[request.studentId] || "Loading..."}
                    </td>
                    <td className="border-t py-3 px-4 border-gris-moyen">
                      {studentFirstNames[request.studentId] || "Loading..."} {studentLastNames[request.studentId] || "Loading..."}
                    </td>
                    <td className="border-t py-3 px-4 border-gris-moyen">
                      {sportNames[request.sportId] || "Loading..."}
                    </td>
                    <td className="border-t py-3 px-4 border-gris-moyen">
                      {request.hourStart} - {request.hourEnd}
                    </td>
                    <td className="border-t py-3 px-4 border-gris-moyen">{request.onlyDate}</td>
                    <td className="border-t py-3 px-4 border-gris-moyen">
                      {request.codeUIRList ? request.codeUIRList.join(" ") : "No codes"}
                    </td>
                 
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
