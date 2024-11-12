import React, { useEffect, useState } from "react";
import ApiManager from "../../api";
import { Link } from "react-router-dom";
// import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const Home = () => {
  const [reservations, setReservations] = useState([]);
  const [sportNames, setSportNames] = useState({});
  const [studentNames, setStudentNames] = useState({});
  const [studentFirstNames, setstudentFirstNames] = useState({});
  const [studentLastName, setstudentLastName] = useState({});

  useEffect(() => {
    fetchReservation();
  }, []);

  const fetchReservation = () => {
    const studentId="3084fbc2-8622-47d1-95ef-729a8cf5e2ce"
    ApiManager.get(`/Reservations/byStudent/${studentId}`)
      .then((res) => {
        console.log(res.data);
        
        setReservations(res.data);
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
        console.log(err);
      });
  };

  const fetchSportName = async (sportId) => {
    try {
      const response = await ApiManager.get(`/Sports/${sportId}`);
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
      const response = await ApiManager.get(`/Students/student/${studentId}`);


      setStudentNames((prevStudentNames) => ({
        ...prevStudentNames,
        [studentId]: response.data.codeUIR,
      }));

      setstudentFirstNames((prevStudentNames) => ({
        ...prevStudentNames,
        [studentId]: response.data.firstName,
      }));
      setstudentLastName((prevStudentNames) => ({
        ...prevStudentNames,
        [studentId]: response.data.lastName,
      }));

    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  };

  const handleDelete = async (reservationId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        await ApiManager.delete(`/Reservation/${reservationId}`);
        fetchReservation();
        toast.success("reservation supprimée avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression de la reservation.");
      }
    }
  };

  return (
    <div className="rounded-sm border m-6 border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
    <div className="flex justify-between items-center mb-6">
      <h4 className="text-xl font-semibold text-black dark:text-white font-satoshi">
        List des Reservations
      </h4>
    </div>

    <div className="flex flex-col font-satoshi">
      <div className="grid grid-cols-2 rounded-sm bg-blue-100 dark:bg-meta-4 text-graydark sm:grid-cols-9"> 
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Student code</h5>
        </div>
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">first Name</h5>
        </div>
        <div className="p-2.5 xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">last Name</h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Sport</h5>
        </div>
        <div className="p-2.5 text-center xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Time</h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">Date</h5>
        </div>
        <div className="hidden p-2.5 text-center sm:block xl:p-5">
          <h5 className="text-sm font-medium uppercase xsm:text-base">List Student</h5>
        </div>
      </div>

      {reservations.map((reservation, key) => (
        <div
          className={`grid grid-cols-2 sm:grid-cols-9 ${
            key === reservations.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
          }`}
          key={reservation.id}
        >
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <p className="hidden text-black dark:text-white sm:block font-semibold">
              {studentNames[reservation.studentId] || "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <p className="hidden text-black dark:text-white sm:block font-semibold">
              {studentFirstNames[reservation.studentId] || "Loading..."}
            </p>
          </div>
          <div className="flex items-center gap-3 p-2.5 xl:p-5">
            <p className="hidden text-black dark:text-white sm:block font-semibold">
              {studentLastName[reservation.studentId] || "Loading..."}
            </p>
          </div>
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="hidden text-black dark:text-white sm:block font-semibold">
              {sportNames[reservation.sportId] || "Loading..."}
            </p>
          </div>
          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black">
              {reservation.hourStart} - {reservation.hourEnd}
            </p>
          </div>
          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            {reservation.onlyDate}
          </div>
          <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
            {/* {reservation.codeUIRList} */}
            {reservation.codeUIRList ? reservation.codeUIRList.join(" ") : "No codes"}
          </div>

          {/* <div className="hidden items-center justify-center text-2xl p-2.5 sm:flex xl:p-5 gap-3">
            <Link to={`/update/${reservation.id}`}>
              <FaRegEdit className="text-graydark cursor-pointer" />
            </Link>
            <MdDelete
              className="cursor-pointer text-red-500"
              onClick={() => handleDelete(reservation.id)}
            />
          </div> */}
        </div>
      ))}
    </div>
  </div>
  )
}

export default Home