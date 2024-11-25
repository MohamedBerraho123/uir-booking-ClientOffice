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

export default function BookTime({
  participants,
  selectedSport,
  selectedCourt,
  onAddParticipant,
  onRemoveParticipant,
  onBack,
}) {
  const [timeRanges, setTimeRanges] = useState([]);
  const [nbPlayerSport, setNbPlayerSport] = useState(null);
  const [conditionSport, setConditionSport] = useState("");
  const [participantCodes, setParticipantCodes] = useState([""]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

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
          const response = await axios.get(
            `https://localhost:7125/api/Sports/${selectedCourt}`
          );
          // setMatches(response.data);
          console.log("data of fetchsportmatch : ", response.data.conditions);
          setConditionSport(response.data.conditions);

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
    // Check if a time range is selected
    if (!selectedTimeRange) {
      Swal.fire({
        title: "Sélection Requise",
        text: "Veuillez sélectionner une plage horaire avant de continuer.",
        icon: "warning",
      });
      return;
    }

    // Check if the student code input is not empty
    if (!codeUIR.trim()) {
      Swal.fire({
        title: "Champ Requis",
        text: "Veuillez entrer le code étudiant UIR avant de continuer.",
        icon: "warning",
      });
      return;
    }

    setShowPopup(true);
  };

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

  // useEffect(() => {
  //   console.log("is work : codeUIR from booking form boking", codeUIR);
  // }, [codeUIR]);

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

  // console.log(
  //   "selectedCourt component BookTime 111111111111 : ",
  //   selectedCourt
  // );
  //todo : fetch time :
  useEffect(() => {
    const fetchTimeRanges = async () => {
      try {
        const response = await ApiSystem.get(
          `/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCourt}`
        );

        //  console.log("time : ", response.data);

        const result = await ApiSystem.get(`/Sports/${selectedCourt}`);

        // console.log("spornt number : is ", result.data.nbPlayer);
        setNbPlayerSport(result.data.nbPlayer);

        // Get the current time in "HH:mm" format
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const formattedCurrentTime = `${currentHours}:${
          currentMinutes < 10 ? "0" : ""
        }${currentMinutes}`;

        // Filter the time ranges to keep only those greater than the current time
        const filteredTimeRanges = response.data.filter((timeRange) => {
          // return formattedCurrentTime;
          return timeRange.hourStart > formattedCurrentTime;
        });

        setTimeRanges(filteredTimeRanges); // Update time ranges
      } catch (error) {
        console.log("Failed to load time ranges", error);
      }
    };

    fetchTimeRanges(); // Fetch time ranges when the component mounts
  }, [selectedCourt]);

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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Filter out empty participant codes
  //   const updatedStudentCodeUIRList = participantCodes.filter(
  //     (code) => code.trim() !== ""
  //   );

  //   // Validation: Check if the number of participants matches nbPlayerSport
  //   if (updatedStudentCodeUIRList.length !== nbPlayerSport - 1) {
  //     Swal.fire({
  //       title: "Erreur de réservation!",
  //       text: `Veuillez ajouter ${
  //         nbPlayerSport - 1
  //       } participants valides avant de continuer.`,
  //       icon: "error",
  //     });
  //     return;
  //   }

  //   // Validation: Check for empty inputs
  //   if (updatedStudentCodeUIRList.some((code) => code.trim() === "")) {
  //     Swal.fire({
  //       title: "Erreur de réservation!",
  //       text: "Tous les champs des participants doivent être remplis.",
  //       icon: "error",
  //     });
  //     return;
  //   }

  //   // Validation: Check for duplicate participant codes
  //   const uniqueCodes = new Set(updatedStudentCodeUIRList);
  //   if (uniqueCodes.size !== updatedStudentCodeUIRList.length) {
  //     Swal.fire({
  //       title: "Erreur de réservation!",
  //       text: "Les codes des participants doivent être uniques.",
  //       icon: "error",
  //     });
  //     return;
  //   }

  //   // Prepare reservation data
  //   const jsDay = new Date().getDay();
  //   const day = jsDay === 0 ? 6 : jsDay;

  //   const reservationData = {
  //     codeUIR: codeUIR,
  //     dayBooking: day,
  //     sportCategoryId: selectedSport,
  //     sportId: selectedCourt,
  //     hourStart: selectedTimeRange?.hourStart, // Use selected hourStart
  //     hourEnd: selectedTimeRange?.hourEnd, // Use selected hourEnd
  //     codeUIRList: updatedStudentCodeUIRList,
  //   };

  //   try {
  //     const response = await ApiSystem.post(
  //       "/Reservations/AddReservations",
  //       reservationData
  //     );
  //     navigate("/reservationList");
  //     if (response.status === 200 || response.status === 201) {
  //       Swal.fire({
  //         title: "Réservation ajoutée avec succès!",
  //         icon: "success",
  //       });
  //       navigate("/reservationList");
  //       toast.success("Réservation ajoutée avec succès!");

  //     } else {
  //       Swal.fire({
  //         title: "Erreur lors de l'ajout de la réservation!",
  //         icon: "error",
  //       });
  //     }
  //   } catch (error) {
  //     // console.log(error.response.data);

  //     Swal.fire({
  //       title: "Erreur l'ajout de la réservation!",
  //       text: error.response.data,
  //       icon: "error",
  //     });
  //   }
  // };

  //todo handle :
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

  const handleBack = () => setStep(step - 1);
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
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#1E3B8B]" />
              Available Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ---div--- RadioGroup ----------------------------------*/}
            <div className="grid gap-4">
              {"hello" && timeRanges.length === 0 && (
                <p className="text-red-500">
                  Nous sommes désolés mais il n'est pas possible de réservation
                  cet terrain pour le moment.
                </p>
              )}
              {timeRanges.map((timeRange) => (
                <div
                  key={timeRange.id}
                  className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-[#1E3B8B]/5"
                  onClick={() => setSelectedTimeRange(timeRange)} // Set the selected time range on click
                >
                  <input
                    type="radio"
                    name="timeRange"
                    value={timeRange.id}
                    checked={
                      selectedTimeRange && selectedTimeRange.id === timeRange.id
                    }
                    onChange={() => setSelectedTimeRange(timeRange)} // Update the selection when the radio is changed
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label className="blue-txt">
                    {new Date(
                      `1970-01-01T${timeRange.hourStart}Z`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -
                    {new Date(
                      `1970-01-01T${timeRange.hourEnd}Z`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </label>
                </div>
              ))}
            </div>

            {/* ---div--- RadioGroup--------------------------------- */}
          </CardContent>
        </Card>
        {/* ---div--- card partivipants */}

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
                <p className="text-sm text-gray-600 mt-2">{conditionSport} </p>
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
