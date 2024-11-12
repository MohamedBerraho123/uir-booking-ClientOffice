import React, { useEffect, useState } from "react";
import axios from "axios";
import { TiTick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

const Step3And4Reservation = ({ token, selectedCategory, selectedTimeRange, setSelectedTimeRange, studentcodeUIR, userId, studentCodeUIRList, setStudentCodeUIRList, setSuccess, setError, prevStep, sports }) => {
  const [timeRanges, setTimeRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participantCodes, setParticipantCodes] = useState(['']);
//   const [studentCodeUIR, setStudentCodeUIR] = useState('');
  const navigate = useNavigate();
  console.log("GET USER ID from LoginSignUp:", userId); 
  

  

  useEffect(() => {
    const fetchTimeRanges = async () => {
      if (!selectedCategory) return;
        // Calculate the current day of the week, aligning Sunday as 6 and Monday as 0
    const jsDay = new Date().getDay();
    const day = jsDay === 0 ? 6 : jsDay - 1;

      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7125/api/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCategory}/${day}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimeRanges(response.data);
      } catch (error) {
        setError("Failed to load time ranges");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeRanges();
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
     // Ensure studentCodeUIRList is set from participantCodes
  const updatedStudentCodeUIRList = participantCodes.filter(code => code.trim() !== ""); // remove empty codes
  console.log('Participant Codes:5', participantCodes);

    const reservationData = {
      codeUIR: "UIR57412",
      sportId: selectedCategory,
      hourStart: selectedTimeRange.hourStart,
      hourEnd: selectedTimeRange.hourEnd,
      codeUIRList: updatedStudentCodeUIRList,
    };
    console.log("reservationData : ",reservationData);
    console.log("GET USER ID from LoginSignUp : ", userId);
    console.log("Student Code UIR:", studentcodeUIR); 

    try {
      const response = await axios.post("https://localhost:7125/api/Reservations/AddReservations", reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("reservationData:", reservationData);
    //   setSuccess("Reservation successful!");
    console.log("response.status" , response.status);
    
      if (response.status === 200 || response.status === 201  ) {
        Swal.fire({
          title: " Reservation  ajouté avec succès!",
          icon: "success",
        });
        toast.success("Reservation ajouté avec succès!");
         navigate("/contact");
      } else {
        Swal.fire({
            title: "Erreur lors de l'ajout du Reservation!",
            icon: "error",
          });
      }




    } catch (error) {
        Swal.fire({
            title: "Erreur réseau!",
            text: error.message,
            icon: "error",
          });
    //     toast.error(`Erreur réseau! ${error.message}`);
    // //   setError("Failed to create reservation.");
    //   console.error("Error:", error.response ? error.response.data : error.message);
    //   console.error("Error data:", reservationData);
    }
  };

  const sport = sports.find(sport => sport.id === selectedCategory);

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
            <button type="submit" className="btn btn-primary mt-4">Confirmer la réservation</button>
          </form>

      <button className="btn btn-secondary mt-4" onClick={prevStep}>Précédent</button>
    </div>
  );
};

export default Step3And4Reservation;
