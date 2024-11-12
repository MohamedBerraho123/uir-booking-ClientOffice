import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

const Step3And4Reservation = ({
  token,
  selectedCategory,
  selectedTimeRange,
  setSelectedTimeRange,
  setError,
  prevStep,
  sports,
}) => {
  const [timeRanges, setTimeRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participantCodes, setParticipantCodes] = useState(['']);
  const [codeUIR, setCodeUIR] = useState(''); // Add codeUIR state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimeRanges = async () => {
      if (!selectedCategory) return;
      const jsDay = new Date().getDay();
      const day = jsDay === 0 ? 6 : jsDay - 1;
      console.log(day );
      

      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:7125/api/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCategory}/${day}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTimeRanges(response.data);
      } catch (error) {
        setError("Failed to load time ranges");
      } finally {
        setLoading(false);
      }
    };

    const fetchStudentByUserId = async (userId) => {
        console.log("from step 3/4",userId);
        
      try {
        const response = await axios.get(
          `https://localhost:7125/api/Students/GetStudentByUserId/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data) {
          setCodeUIR(response.data.codeUIR); // Set codeUIR from response
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("Failed to fetch student.");
      }
    };

    fetchTimeRanges();

    // Fetch student information using userId stored in local storage or token payload
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchStudentByUserId(userId);
    }
  }, [token, selectedCategory, setError]);

  const handleParticipantCodeChange = (e, index) => {
    const updatedList = [...participantCodes];
    updatedList[index] = e.target.value;
    setParticipantCodes(updatedList);
  };

  const addParticipantCodeField = () => {
    setParticipantCodes([...participantCodes, '']);
  };

  const removeParticipantCodeField = (index) => {
    const updatedList = participantCodes.filter((_, i) => i !== index);
    setParticipantCodes(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedStudentCodeUIRList = participantCodes.filter(
      (code) => code.trim() !== ""
    );
    const jsDay = new Date().getDay();
      const day = jsDay === 0 ? 6 : jsDay - 1;
      console.log("day of add reservation : ",day );

    const reservationData = {
      codeUIR, // Use dynamically fetched codeUIR
      dayBooking:day,
      sportId: selectedCategory,
      hourStart: selectedTimeRange.hourStart,
      hourEnd: selectedTimeRange.hourEnd,
      codeUIRList: updatedStudentCodeUIRList,
    };

    try {
      const response = await axios.post(
        "https://localhost:7125/api/Reservations/AddReservations",
        reservationData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Réservation ajoutée avec succès!",
          icon: "success",
        });
        toast.success("Réservation ajoutée avec succès!");
        navigate("/");
      } else {
        Swal.fire({
          title: "Erreur lors de l'ajout de la réservation!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur réseau!",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold mb-4 blue-txt">Sélectionnez un créneau horaire :</h3>
    
    {loading && <p className="text-gray-500">Loading time ranges...</p>}
    {!loading && timeRanges.length === 0 && <p className="text-red-500">No available time ranges for this match.</p>}
    
    {timeRanges.map((timeRange) => (
      <div key={timeRange.id} className="flex items-center space-x-2 mb-4">
        <input
          type="radio"
          name="timeRange"
          value={timeRange.id}
          checked={selectedTimeRange && selectedTimeRange.id === timeRange.id}
          onChange={() => setSelectedTimeRange(timeRange)}
          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
        />
        <label className="blue-txt">{timeRange.hourStart} - {timeRange.hourEnd}</label>
      </div>
    ))}
  
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 blue-txt">Codes des participants :</h3>
      {participantCodes.map((code, index) => (
        <div key={index} className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={code}
            onChange={(e) => handleParticipantCodeChange(e, index)}
            required
            placeholder="Entrer le code UIR"
            className="p-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="btn bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={() => removeParticipantCodeField(index)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={addParticipantCodeField}
      >
        Ajouter un participant
      </button>
    </div>
  
    <form onSubmit={handleSubmit} className="mt-6">
      <button
        type="submit"
        className="btn   px-4 py-2 w-full rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500 blue-button"
      >
        Confirmer la réservation
      </button>
    </form>
  
    <button
      className="btn gree-button px-4 py-2 mt-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-gray-500"
      onClick={prevStep}
    >
      Précédent
    </button>
  </div>
  
  );
};

export default Step3And4Reservation;
