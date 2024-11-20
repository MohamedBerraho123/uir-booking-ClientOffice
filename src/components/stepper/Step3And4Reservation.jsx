import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import ApiSystem from "../../apiSystem";

const Step3And4Reservation = ({

  selectedCategory,
  selectedTimeRange,
  setSelectedTimeRange,
  prevStep,
  sports,
  selectedSport,
  referenceSport,
  nbPlayerSport
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
      // console.log(day );
      console.log("Reference Sport:", referenceSport); // Log referenceSport for debugging
      console.log("number Players Sport :", nbPlayerSport); // Log nbPlayerSport for debugging
      

      try {
        setLoading(true);
        const response = await ApiSystem.get(`/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCategory}/${day}`);
        // console.log('selectedSport id : ', selectedSport);
        
        setTimeRanges(response.data);
      } catch (error) {
        // setError("Failed to load time ranges");
        console.log('Failed to load time ranges');
        
      } finally {
        setLoading(false);
      }
    };

    const fetchStudentByUserId = async (userId) => {
        // console.log("from step 3/4",userId);
        
      try {
        const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`);
        if (response.data) {
          setCodeUIR(response.data.codeUIR); // Set codeUIR from response
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        // setError("Failed to fetch student.");
      }
    };

    fetchTimeRanges();

    // Fetch student information using userId stored in local storage 
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchStudentByUserId(userId);
    }
  }, [ selectedCategory , referenceSport , nbPlayerSport]);

  const handleParticipantCodeChange = (e, index) => {
    const updatedList = [...participantCodes];
    updatedList[index] = e.target.value;
    setParticipantCodes(updatedList);
  };

  const addParticipantCodeField = () => {
    if (participantCodes.length < nbPlayerSport-1) {
      setParticipantCodes([...participantCodes, '']);
    } else {
      var numberPlayer = nbPlayerSport-1;
      console.log("Cannot add more participants. Maximum limit reached:", numberPlayer);
      // Optionally display a warning message to the user
     
      Swal.fire({
        title: `Vous ne pouvez ajouter que ${nbPlayerSport - 1} participants !`,
        icon: "error",
      });
    }
  };

  const removeParticipantCodeField = (index) => {
    const updatedList = participantCodes.filter((_, i) => i !== index);
    setParticipantCodes(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filter out empty participant codes
    const updatedStudentCodeUIRList = participantCodes.filter(
      (code) => code.trim() !== ""
    );
  
    // Validation: Check if the number of participants matches nbPlayerSport
    if (updatedStudentCodeUIRList.length !== nbPlayerSport-1) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: `Veuillez ajouter ${nbPlayerSport-1} participants valides avant de continuer.`,
        icon: "error",
      });
      return; // Stop further execution
    }
  
    // Validation: Check for empty inputs
    if (updatedStudentCodeUIRList.some((code) => code.trim() === "")) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: "Tous les champs des participants doivent être remplis.",
        icon: "error",
      });
      return; // Stop further execution
    }

      // Validation: Check for duplicate participant codes
  const uniqueCodes = new Set(updatedStudentCodeUIRList);
  if (uniqueCodes.size !== updatedStudentCodeUIRList.length) {
    Swal.fire({
      title: "Erreur de réservation!",
      text: "Les codes des participants doivent être uniques.",
      icon: "error",
    });
    return; // Stop further execution
  }
  
    // Prepare reservation data
    const jsDay = new Date().getDay();
    const day = jsDay === 0 ? 6 : jsDay - 1;
  
    const reservationData = {
      codeUIR, // Use dynamically fetched codeUIR
      dayBooking: day,
      sportCategoryId: selectedSport,
      sportId: selectedCategory,
      hourStart: selectedTimeRange.hourStart,
      hourEnd: selectedTimeRange.hourEnd,
      codeUIRList: updatedStudentCodeUIRList,
    };
  
    try {
      const response = await ApiSystem.post("/Reservations/AddReservations", reservationData);
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
      console.log(error.response.data);
  
      Swal.fire({
        title: "Erreur l'ajout de la réservation!",
        text: error.response.data,
        icon: "error",
      });
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
    <h3 className="text-lg font-semibold mb-4 blue-txt">Sélectionnez un créneau horaire :</h3>
    
    {/* {loading && <p className="text-gray-500">Loading time ranges...</p>} */}
    {!loading && timeRanges.length === 0 && <p className="text-red-500">Nous sommes désolés mais il n'est pas possible de réservation cet terrain pour le moment.</p>}
    
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
  disabled={participantCodes.length >= nbPlayerSport}
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
    <div className="pt-20">
    <button
      className="btn gree-button px-4 py-2 mt-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-gray-500"
      onClick={prevStep}
    >
      &lt;&lt; Précédent
    </button>
  </div>
  </div>
  
  );
};

export default Step3And4Reservation;
