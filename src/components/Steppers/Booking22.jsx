import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClubIcon as Football,
  Plus,
  Shield,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useNavigate } from "react-router-dom";

import ApiSystem from "../../apiSystem";

export default function Booking22() {
  //todo : from step3

  const navigate = useNavigate();
  //todo : from step3
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCourt, setSelectedCourt] = useState("");
  const [participants, setParticipants] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [timeRanges, setTimeRanges] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  const [expandedCard, setExpandedCard] = useState(null);

  //todo : ""
  const [nbPlayerSport, setNbPlayerSport] = useState(null);

  const [participantCodes, setParticipantCodes] = useState([""]);
  const [codeUIR, setCodeUIR] = useState("");

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("studentData"));
    if (storedData) {
      fetchStudentByUserId(storedData.userId);
    }
  }, []);
  useEffect(() => {
    console.log("is work : codeUIR from booking", codeUIR);
  }, [codeUIR]);

  const fetchStudentByUserId = async (userId) => {
    try {
      const response = await ApiSystem.get(
        `/Students/GetStudentByUserId/${userId}`
      );
      if (response.data) {
        setCodeUIR(response.data.codeUIR);

        console.log("response.data.codeUIR : ", response.data.codeUIR);
      }
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  //todo Fetch sports categories initially
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await ApiSystem.get("/SportCategorys/list");
        setSports(response.data);
      } catch (error) {
        console.error("Failed to load sports:", error);
      }
    };
    fetchSports();
  }, []);

  //todo Fetch matches when selectedSport changes
  useEffect(() => {
    if (selectedSport) {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const response = await ApiSystem.get(
            `/Sports/category/${selectedSport}`
          );
          setMatches(response.data);
          console.log("data of fetchsportmatch : ", response.data);

          console.log("selectedSport ..:", selectedSport);
          console.log("selectedCourt ..:", selectedCourt);
        } catch (error) {
          console.error(
            "Failed to fetch matches for the selected category:",
            error
          );
        }
      };

      fetchMatches();
    }
  }, [selectedSport, selectedCourt]);

  //todo : fetch time :
  useEffect(() => {
    const fetchTimeRanges = async () => {
      const jsDay = new Date().getDay();
      const day = jsDay === 0 ? 6 : jsDay - 1; // Adjust day to match the API requirement

      try {
        const response = await ApiSystem.get(
          `/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCourt}`
        );

        const result = await ApiSystem.get(`/Sports/${selectedCourt}`);

        console.log("spornt number : is ", result.data.nbPlayer);
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
      } finally {
        setLoading(false);
      }
    };

    fetchTimeRanges(); // Fetch time ranges when the component mounts
  }, [selectedCourt]);

  //todo steps :
  // const handleNext = () => {
  //   setStep((prevStep) => prevStep + 1);
  // };
  const handleNext = async () => {
    if (step === 2) {
      try {
        // Fetch time ranges and related data when moving to step 3
        setLoading(true);

        const jsDay = new Date().getDay();
        const day = jsDay === 0 ? 6 : jsDay - 1;

        const timeResponse = await ApiSystem.get(
          `/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCourt}/${day}`
        );

        const sportResponse = await ApiSystem.get(`/Sports/${selectedCourt}`);

        console.log("Sport number is:", sportResponse.data.nbPlayer);
        setNbPlayerSport(sportResponse.data.nbPlayer);

        const currentTime = new Date();
        const formattedCurrentTime = currentTime.toTimeString().slice(0, 5); // "HH:mm"

        const filteredTimeRanges = timeResponse.data.filter((timeRange) => {
          return timeRange.hourStart > formattedCurrentTime;
        });

        setTimeRanges(filteredTimeRanges);
      } catch (error) {
        console.error("Failed to fetch time ranges or sport details", error);
      } finally {
        setLoading(false);
      }
    }

    // Increment the step
    setStep((prevStep) => prevStep + 1);
  };

  // const handleBack = () => {
  //   setStep((prevStep) => prevStep - 1);
  // };
  const handleBack = () => {
    if (step === 3) {
      // Reset states related to step 3
      setTimeRanges([]);
      setSelectedTimeRange(null);
      setParticipants([]);
    }
    setStep((prevStep) => prevStep - 1);
  };

  //todo : adding participant

  const addParticipant = (code) => {
    if (code && !participants.includes(code)) {
      setParticipants([...participants, code]);
    }
  };

  //todo : remove input

  const removeParticipant = (code) => {
    setParticipants(participants.filter((p) => p !== code));
  };

  // todo : handel select Sport

  const handleSelectSport = (id) => {
    setSelectedSport(id);
    console.log("id for sport selected : ", id);
  };

  const HandlerSelectedCourt = (sportId) => {
    setSelectedCourt(sportId);
    setStep((prevStep) => prevStep + 1);
    console.log("sportId : ", sportId);
  };
  const HandleSelectedTimeRange = (timeRange) => {
    setSelectedTimeRange(timeRange);
    console.log("HandleSelectedTimeRange : ", timeRange);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty participant codes
    const updatedStudentCodeUIRList = participantCodes.filter(
      (code) => code.trim() !== ""
    );

    // Validation: Check if the number of participants matches nbPlayerSport
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

    // Validation: Check for empty inputs
    if (updatedStudentCodeUIRList.some((code) => code.trim() === "")) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: "Tous les champs des participants doivent être remplis.",
        icon: "error",
      });
      return;
    }

    // Validation: Check for duplicate participant codes
    const uniqueCodes = new Set(updatedStudentCodeUIRList);
    if (uniqueCodes.size !== updatedStudentCodeUIRList.length) {
      Swal.fire({
        title: "Erreur de réservation!",
        text: "Les codes des participants doivent être uniques.",
        icon: "error",
      });
      return;
    }

    // Prepare reservation data
    const jsDay = new Date().getDay();
    const day = jsDay === 0 ? 6 : jsDay - 1;

    const reservationData = {
      codeUIR: codeUIR,
      dayBooking: day,
      sportCategoryId: selectedSport,
      sportId: selectedCourt,
      hourStart: selectedTimeRange?.hourStart, // Use selected hourStart
      hourEnd: selectedTimeRange?.hourEnd, // Use selected hourEnd
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
        toast.success("Réservation ajoutée avec succès!");
        navigate("/");
      } else {
        Swal.fire({
          title: "Erreur lors de l'ajout de la réservation!",
          icon: "error",
        });
      }
    } catch (error) {
      // console.log(error.response.data);

      Swal.fire({
        title: "Erreur l'ajout de la réservation!",
        text: error.response.data,
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-10">
      <Card className="w-full max-w-5xl mx-auto border-0 shadow-lg">
        <CardHeader className="bg-[#1E3B8B] text-white rounded-t-lg">
          {/* ---div--- of header stepper  */}
          <div className="flex flex-col gap-6">
            <CardTitle className="text-3xl font-bold text-center text-[#cfd803]">
              University Sports Booking
            </CardTitle>
            <div className="flex justify-between items-center">
              <motion.div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  step === 1 ? "bg-white/10" : ""
                }`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                {" "}
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#cfd803]" />
                </div>
                <span className="hidden sm:inline">Choose Sport</span>
              </motion.div>
              <ChevronRight className="w-5 h-5 text-[#cfd803]" />
              <motion.div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  step === 2 ? "bg-white/10" : ""
                }`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                {" "}
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#cfd803]" />
                </div>
                <span className="hidden sm:inline">Select Court</span>
              </motion.div>
              <ChevronRight className="w-5 h-5 text-[#cfd803]" />
              <motion.div
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  step === 3 ? "bg-white/10" : ""
                }`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#cfd803]" />
                </div>
                <span className="hidden sm:inline">Book Time</span>
              </motion.div>
            </div>
          </div>
          {/* ---div---fn header stepper */}
        </CardHeader>

        {/* ---div--- body of  stepper */}

        <CardContent className="p-8">
          {/* ---div---1 body of  stepper one for choose Sport */}
          {step === 1 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1E3B8B]">
                  Select Your Sport
                </h2>
                <p className="text-muted-foreground">
                  Choose from our available sports facilities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sports.map((sport) => (
                  <Card
                    key={sport.id}
                    className={`cursor-pointer transition-all hover:border-[#1E3B8B] ${
                      selectedSport === sport.id
                        ? "border-[#1E3B8B] bg-[#1E3B8B]/5"
                        : ""
                    }`}
                    onClick={() => handleSelectSport(sport.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="w-12 h-12 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center">
                        {/* Customize sport icon */}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{sport.name}</h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!selectedSport}
                  className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
                >
                  Next
                </Button>
              </div>
            </motion.div>
          )}
          {/* ---div---FINAL 1 body of  stepper one for choose Sport */}
          {/* ------------------------------------------------------------------------------------------------------ */}

          {/* ---div---2 body of  stepper one for select Court */}

          {step === 2 && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#1E3B8B]">
                  Select Your Court
                </h2>
                <p className="text-muted-foreground">
                  Choose your preferred playing area
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((match) => (
                  <Card
                    key={match.id}
                    className={`cursor-pointer transition-all hover:border-[#1E3B8B] ${
                      selectedCourt === match.id
                        ? "border-[#1E3B8B] ring-2 ring-[#1E3B8B]/20"
                        : ""
                    }`}
                    onClick={() => HandlerSelectedCourt(match.id)}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video relative">
                        <img
                          src={
                            match.image
                              ? `data:image/png;base64,${match.image}`
                              : "placeholder.png"
                          }
                          alt={match.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-semibold text-lg">
                            {match.name}
                          </h3>
                          <p
  className={`text-sm ${expandedCard === match.id ? 'bg-black text-red-500' : 'text-white/80'}`}
>
  {expandedCard === match.id
    ? match.conditions // Show the full text if expanded
    : `${match.conditions.slice(0, 30)}...`} {/* Show first 30 characters */}
  
  <button
    className="text-blue-400 ml-2"
    onClick={(e) => {
      e.stopPropagation(); // Prevent triggering onClick of the parent
      setExpandedCard(expandedCard === match.id ? null : match.id);
    }}
  >
    {expandedCard === match.id ? "See Less" : "See More"}
  </button>
</p>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                {/* <Button
                  onClick={handleNext}
                  disabled={!selectedCourt}
                  className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
                >
                  Next
                </Button> */}
              </div>
            </motion.div>
          )}
          {/* ---div--- final 2 body of  stepper one for select Court */}

          {/* ------------------------------------------------------------------------------------------------------ */}

          {/* ---div--- final 3 body of  stepper one for Book Time */}

          {step === 3 && (
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
                    {!loading && timeRanges.length === 0 && (
                   <p className="text-red-500">
          Nous sommes désolés mais il n'est pas possible de réservation cet
          terrain pour le moment.
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
                              selectedTimeRange &&
                              selectedTimeRange.id === timeRange.id
                            }
                            onChange={() => setSelectedTimeRange(timeRange)} // Update the selection when the radio is changed
                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label className="blue-txt">
                          {new Date(`1970-01-01T${timeRange.hourStart}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(`1970-01-01T${timeRange.hourEnd}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                      Participants
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
                          onChange={(e) =>
                            handleParticipantCodeChange(e, index)
                          }
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
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <form onSubmit={handleSubmit} className="mt-6">
                  <Button
                    type="submit"
                    className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
                  >
                    Confirm Booking
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
          {/* ---div--- final 3 body of  stepper one for Book Time */}
        </CardContent>
        {/* ---div---fn body of  stepper */}
      </Card>
    </div>
  );
}
