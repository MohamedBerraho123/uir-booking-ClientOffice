import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Clock,
  ClubIcon as Football,
  Plus,
  Shield,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ApiSystem from "../../apiSystem";
import { useNavigate } from "react-router-dom";
import "./BookTime.css";
import AvailableTime from "./BookingTime/AvailableTime"


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
          const response = await ApiSystem.get(
            `/Sports/${selectedCourt}`
          );
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
     if (!selectedTimeRange) {
      setErrorMessage("Veuillez sélectionner une plage horaire avant de continuer.");
      return;
    }
    setErrorMessage(""); // Clear the error message if valid
    console.log("Proceed with booking:", selectedTimeRange);

    // Check if the student code input is not empty
    const updatedStudentCodeUIRList = participantCodes.filter(
      (code) => code.trim() !== ""
    );

    // Validation logic remains the same
    if (updatedStudentCodeUIRList.length !== nbPlayerSport - 1) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: `Veuillez ajouter ${
          nbPlayerSport - 1
        } participants valides avant de continuer.`,
        icon: "error",
      });
      return;
    }

    setShowPopup(true);
  };

  // const handleOpenPopup = () => {
  //   // Check if a time range is selected
  //   if (!selectedTimeRange) {
  //     setErrorMessage("Veuillez sélectionner une plage horaire avant de continuer.");
  //     return;
  //   }
  //   setErrorMessage(""); // Clear the error message if valid
  //   console.log("Proceed with booking:", selectedTimeRange);
  // };
  const handleClosePopup = () => {
    setShowPopup(false);
    setIsCheckboxChecked(false);
  };

  const handleConfirmPopup = () => {
    if (isCheckboxChecked) {
      handleSubmit();
      setShowPopup(false);
    } else {
      Swal.fire({
        title: "Confirmation Required",
        text: "Please agree to the conditions before proceeding.",
        icon: "warning",
      });
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
    // Filter out empty participant codes
    const updatedStudentCodeUIRList = participantCodes.filter(
      (code) => code.trim() !== ""
    );

    // Validation logic remains the same
    if (updatedStudentCodeUIRList.length !== nbPlayerSport - 1) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: `Veuillez ajouter ${
          nbPlayerSport - 1
        } participants valides avant de continuer.`,
        icon: "error",
      });
      return;
    }

    // More validations...
    // Reservation logic remains the same
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
      } else {
        Swal.fire({
          title: "Erreur lors de l'ajout de la réservation!",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Erreur l'ajout de la réservation!",
        text: error.response?.data || "Unknown error",
        icon: "error",
      });
    }
  };


  const handleParticipantCodeChange = (e, index) => {
    const updatedList = [...participantCodes];
    updatedList[index] = e.target.value;
    setParticipantCodes(updatedList);
  };

  const removeParticipantCodeField = (index) => {
    const updatedList = participantCodes.filter((_, i) => i !== index);
    setParticipantCodes(updatedList);
  };

  const addParticipantCodeField = () => {
    if (participantCodes.length < nbPlayerSport - 1) {
      setParticipantCodes([...participantCodes, ""]);
    } else {
      console.log(
        "Cannot add more participants. Maximum limit reached:",
        nbPlayerSport - 1
      );

      Swal.fire({
        title: `Vous ne pouvez ajouter que ${nbPlayerSport - 1} participants.`,
        icon: "error",
      });
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
        {/* AvailableTime */}
        <Card className="border-0 shadow-md">
          

        <AvailableTime selectedCourt={selectedCourt}  onTimeSelect={(timeRange) => {
          setSelectedTimeRange(timeRange);
          setErrorMessage(""); 
         
        }} />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </Card>
        {/* AvailableTime */}
  

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-[#1E3B8B]" />
              Participants {nbPlayerSport - 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {participants.map((code) => (
                <div
                  key={code}
                  className="flex items-center gap-2 bg-[#1E3B8B]/10 text-[#1E3B8B] px-3 py-1.5 rounded-full"
                >
                  <span className="text-sm font-medium">{code}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-[#1E3B8B]/20"
                    onClick={() => removeParticipant(code)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            {participantCodes.map((code, index) => (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter student Code UIR"
                  className="border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
                  value={code}
                  onChange={(e) => handleParticipantCodeChange(e, index)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="border-[red]/20 text-[white] bg-red-600 hover:bg-[red]/10 hover:text-[red]"
                  onClick={() => removeParticipantCodeField(index)}
                >
                  {/* <Delete className="h-4 w-4" /> */} -
                </Button>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                className="btn bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={addParticipantCodeField}
                disabled={participantCodes.length >= nbPlayerSport}
              >
                Ajouter un participant
              </button>
            </div>
          </CardContent>
        </Card>
        {/* ---div--- card partivipants */}
      </div>
         

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <div>
          {/* Your existing form */}
          <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
            <Button
              type="button"
              onClick={handleOpenPopup}
              className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
            >
              Confirm Booking 
            </Button>
          </form>

          {/* Conditional Popup */}
          {showPopup && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold text-gray-800">
                  Confirmation Required
                </h2>
                <p className="text-sm text-red-600 mt-2">{conditionSport} </p>
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
