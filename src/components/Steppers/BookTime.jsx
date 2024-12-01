import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";



import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ApiSystem from "../../apiSystem";
import { useNavigate } from "react-router-dom";
import "./BookTime.css";
import AvailableTime from "./BookingTime/AvailableTime";
import Participants from "./ParticipantsPart/Participants";

export default function BookTime({
  participants,
  selectedSport,
  selectedCourt,
  onAddParticipant,
  onRemoveParticipant,
  onBack,
}) {
  const [nbPlayerSport, setNbPlayerSport] = useState(null);
  const [conditionSport, setConditionSport] = useState("");
  const [participantCodes, setParticipantCodes] = useState([""]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [codeUIR, setCodeUIR] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("studentData"));
    if (storedData) {
      fetchStudentByUserId(storedData.userId);
    }
  }, []);

  useEffect(() => {
    if (selectedCourt) {
      const fetchMatches = async () => {
        try {
          const response = await ApiSystem.get(`/Sports/${selectedCourt}`);
          // setMatches(response.data);
          console.log("data of fetchsportmatch : ", response.data.conditions);
          setConditionSport(response.data.conditions);
          setNbPlayerSport(response.data.nbPlayer);
       
          

          // console.log("selectedSport ..:", selectedSport);
        } catch (error) {
          console.error(
            "Failed to fetch matches for the selected category:",
            error
          );
        }
      };

      fetchMatches();
    }
  }, [selectedCourt]);

  const handleOpenPopup = () => {
    const validationError = validateParticipants();
    if (validationError) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: validationError,
        icon: "error",
      });
      return;
    }
    setShowPopup(true);
  };

   const validateParticipants = () => {
    const updatedList = participantCodes.filter((code) => code.trim() !== "");
    if (updatedList.length !== nbPlayerSport - 1) {
      return `Veuillez ajouter ${
        nbPlayerSport - 1
      } participants valides avant de continuer.`;
    }
    return "";
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setIsCheckboxChecked(false);
  };


  const handleConfirmPopup = async () => {
    if (!isCheckboxChecked) {
      Swal.fire({
        title: "Confirmation Required",
        text: "Please agree to the conditions before proceeding.",
        icon: "warning",
      });
      return;
    }
  
    const isSuccess = await handleSubmit(); // Check for errors in submission
    if (isSuccess) {
      setShowPopup(false);
    }
  };
  

  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await ApiSystem.get(
        `/Students/GetStudentByUserId/${userId}`
      );
      if (response.data) {
        setCodeUIR(response.data.codeUIR);

        // console.log("response.data.codeUIR : ", response.data.codeUIR);
      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

 

  const handleSubmit = async () => {
    const updatedStudentCodeUIRList = participantCodes.filter(
      (code) => code.trim() !== ""
    );
  
    if (updatedStudentCodeUIRList.length !== nbPlayerSport - 1) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: `Veuillez ajouter ${
          nbPlayerSport - 1
        } participants valides avant de continuer.`,
        icon: "error",
      });
      return false; // Indicate failure
    }
  
    const jsDay = new Date().getDay();
    const day = jsDay === 0 ? 6 : jsDay;
  
    const reservationData = {
      codeUIR: codeUIR,
      dayBooking: day,
      sportCategoryId: selectedSport,
      sportId: selectedCourt,
      hourStart: selectedTimeRange?.hourStart,
      hourEnd: selectedTimeRange?.hourEnd,
      codeUIRList: updatedStudentCodeUIRList,
    };
  
    try {
      const response = await ApiSystem.post(
        "/Reservations/AddReservations",
        reservationData
      );
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Réservation ajoutée avec succès!",
          icon: "success",
        });
        navigate("/reservationList");
        return true; // Indicate success
      } else {
        Swal.fire({
          title: "Erreur lors de l'ajout de la réservation!",
          icon: "error",
        });
        return false; // Indicate failure
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur l'ajout de la réservation!",
        text: error.response?.data || "Unknown error",
        icon: "error",
      });
      return false; // Indicate failure
    }
  };
  
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1E3B8B]">
          Book Your Time Slot
        </h2>
        <p className="text-muted-foreground">
          Select a time and add participants
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
       
        <Card className="border-0 shadow-md">
          <AvailableTime
            selectedCourt={selectedCourt}
            onTimeSelect={(timeRange) => {
              setSelectedTimeRange(timeRange);
              setErrorMessage("");
            }}
          />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </Card>
       

        <Card className="border-0 shadow-md">
          <Participants
            selectedCourt={selectedCourt}
            participants={participants}
            participantCodes={participantCodes}
            onParticipantCodeChange={setParticipantCodes}
            nbPlayerSport={nbPlayerSport}
            codeUIR={codeUIR}
          />
        </Card>
      
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <div>
  <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
    <Button
      type="button"
      onClick={handleOpenPopup}
      disabled={!selectedTimeRange || validateParticipants() !== ""}
      className={`bg-[#1E3B8B] ${
        !selectedTimeRange || validateParticipants() !== ""
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-[#1E3B8B]/90"
      }`}
    >
      Confirm Booking
    </Button>
  </form>

  {showPopup && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-gray-800">
          Confirmation Required
        </h2>
        <p className="text-sm text-red-600 mt-2">{conditionSport}</p>
        <label className="flex items-center space-x-2 mt-4">
          <input
            type="checkbox"
            checked={isCheckboxChecked}
            onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            className="form-checkbox h-5 w-5 text-green-500"
          />
          <span className="text-sm text-gray-700">
            I agree to the terms and conditions.
          </span>
        </label>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={handleClosePopup}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPopup}
            className="px-4 py-2 bg-[#1E3B8B] hover:bg-[#1E3B8B]/90 text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
</div>

      </div>
    </motion.div>
  );
}
