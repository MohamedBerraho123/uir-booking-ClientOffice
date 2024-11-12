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
    <div>
      <h3 className="text-lg font-semibold mb-2">Sélectionnez un créneau horaire :</h3>
      {loading && <p>Loading time ranges...</p>}
      {!loading && timeRanges.length === 0 && <p>No available time ranges for this match.</p>}
      {timeRanges.map((timeRange) => (
        <div key={timeRange.id}>
          <input
            type="radio"
            name="timeRange"
            value={timeRange.id}
            checked={selectedTimeRange && selectedTimeRange.id === timeRange.id}
            onChange={() => setSelectedTimeRange(timeRange)}
          />
          <label>{timeRange.hourStart} - {timeRange.hourEnd}</label>
        </div>
      ))}

      <div>
        <h3 className="text-lg font-semibold mt-4">Codes des participants :</h3>
        {participantCodes.map((code, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              value={code}
              onChange={(e) => handleParticipantCodeChange(e, index)}
              required
              placeholder="Entrer le code UIR"
            />
            <button type="button" onClick={() => removeParticipantCodeField(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addParticipantCodeField}>Ajouter un participant</button>
      </div>

      <form onSubmit={handleSubmit}>
        <button type="submit" className="btn bg-blue-600 btn-primary mt-4">Confirmer la réservation</button>
      </form>

      <button className="btn btn-secondary mt-4" onClick={prevStep}>Précédent</button>
    </div>
  );
};

export default Step3And4Reservation;
