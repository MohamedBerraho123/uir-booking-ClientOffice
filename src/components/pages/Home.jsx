import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApiSystem from "../../apiSystem";
import Filtrage from "../TableComponent/Fitrage";
import Pagination from "../TableComponent/Pagination";

const Home = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [studentNames, setStudentNames] = useState({});
 
  const [studentFirstNames, setStudentFirstNames] = useState('');
  const [studentLastNames, setStudentLastNames] = useState({});
  const [studentId, setStudentId] = useState(null);
  const [codeUIR, setCodeUIR] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(3);
  const [selectedSport, setSelectedSport] = useState(null);

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
    console.log('is work : codeUIR' , codeUIR);
    
  }, [studentId, selectedSport , codeUIR ,studentFirstNames , studentLastNames]); // Add selectedSport as a dependency


  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`);
      if (response.data) {
        setStudentId(response.data.id);
        setCodeUIR(response.data.codeUIR);
        setStudentFirstNames(response.data.firstName);
        setStudentLastNames(response.data.lastName);
        console.log('response.data.codeUIR : ', response.data.codeUIR);
        

      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  const fetchReservation = async () => {
    if (!studentId) return;

    try {
      const endpoint = selectedSport
        ? `/Reservations/ByCategoryAndStudentId/${selectedSport}/${codeUIR}`
        : `/Reservations/byStudent/${codeUIR}`;

      const response = await ApiSystem.get(endpoint);
      console.log('log brahhou',response.data);
      console.log('log brahhou',studentId);
      console.log('log brahhou',selectedSport);
      
      setRequests(response.data);
      setFilteredRequests(response.data);

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

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  return (
    <>
      <div className="flex justify-center items-center mt-32 mb-40">
        <div className="flex flex-col items-center w-full mx-40">
          list res home 
          <Filtrage
            requests={requests}
            onFilteredRequests={setFilteredRequests}
            sportNames={sportNames}
            onSportSelect={handleSportSelect}
          />
          <div className="overflow-x-auto mt-10 w-full">
            <table className="bg-white border border-gray-200 w-full">
              <thead>
                <tr style={{ backgroundColor: "#183680", color: "white" }}>
                  <th className="py-3 px-4">Student Code</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Sport</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">List Student</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{codeUIR || "Loading..."}</td>
                    <td>
                      {`${studentFirstNames|| "Loading..."} ${
                        studentLastNames || "Loading..."
                      }`}
                    </td>
                    <td>{sportNames[request.sportId] || "Loading..."}</td>
                    <td>{`${request.hourStart} - ${request.hourEnd}`}</td>
                    <td>{request.onlyDate}</td>
                    <td>{request.codeUIRList?.join(", ") || "No codes"}</td>
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