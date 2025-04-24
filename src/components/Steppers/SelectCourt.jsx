import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";
import ApiSystem from "../../apiSystem";
import CountTime from "./Timer/CountTime";

export default function SelectCourt({
  userId,
  selectedSport,
  courts,
  selectedCourt,
  onSelectCourt,
  onNext,
  onBack,
}) {
  const [matches, setMatches] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [codeUIR, setCodeUIR] = useState("");
  const [hasAccess, setHasAccess] = useState(null); // New state for access control
  const [nothasAccess, setNotHasAccess] = useState(null); // New state for access control
  const [referenceSport , setReferenceSport] = useState(0);


  const fetchStudentByUserId = async (userId) => {
    if (!userId) return;

    
    try {
      const response = await ApiSystem.get(`/Students/GetStudentByUserId/${userId}`);
      if (response.data) {
        setCodeUIR(response.data.codeUIR);
      }
    } catch (err) {
      console.error("--Error fetching student:", err);
    }
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("studentData"));
    if (storedData?.userId) {
      fetchStudentByUserId(storedData.userId);
    }
    // console.log('----- from today storedData.userId' , storedData.userId);
    
  }, []);

  useEffect(() => {
    console.log("--------- userID today", userId);
    if (userId) {
      fetchStudentByUserId(userId);
    }
  }, [userId]);

  //todo : 
  // useEffect(()=>{

  //   console.log("--------- userID today " , userId);
    
  //   const fetchStudentByUserId = async (userId) => {
  //     try {
  //       const response = await ApiSystem.get(
  //         `/Students/GetStudentByUserId/${userId}`
  //       );
  //       if (response.data) {
  //         setCodeUIR(response.data.codeUIR);
  //       }
  //     } catch (err) {
  //       console.error("Error fetching student:", err);
  //     }
  //   };
  //   if (userId) {
  //     fetchStudentByUserId(userId);
  //   }

  // },[userId]);


  const handleSelectedCourt = (courtId) => {
    onSelectCourt(courtId);
  };

  
  useEffect(() => {
    if (selectedCourt) {
      const fetchMatches = async () => {
        try {
          const response = await ApiSystem.get(`/Sports/${selectedCourt}`);
          setReferenceSport(response.data.referenceSport);
      

          

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

  useEffect(() => {

    console.log("uir code is : -----", codeUIR);
    
    if (selectedCourt && codeUIR) {
      const checkAccess = async () => {
        const reservationData = {
          codeUIR,
          codeUIRList: [codeUIR],
          sportId: selectedCourt,
        };

        try {
          const response = await ApiSystem.post(
            "/Reservations/check-access",
            reservationData
          );
          setHasAccess(response.data); // Save the access result
          console.log("Check access response:", response.data);
          if(response.data==false){
            'is fals stop please ! '
          }
        } catch (error) {

          console.error("Failed to check access", error);
        }
      };

      checkAccess();
    }
  }, [selectedCourt, codeUIR]);

  useEffect(() => {
    if (selectedSport) {
      const fetchMatches = async () => {
        try {
          const response = await ApiSystem.get(
            `/Sports/category/${selectedSport}`
          );
          setMatches(response.data);
    
          console.log("user id from selectCourt ",userId);
          
        } catch (error) {
          console.error(
            "Failed to fetch matches for the selected category:",
            error
          );
        }
      };

      fetchMatches();
    }
  }, [selectedSport]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1E3B8B]">Sélectionnez votre terrain</h2>
        <p className="text-muted-foreground">
        Choisissez votre zone de jeu préférée
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match) => (
         <Card
         key={match.id}
         className={`cursor-pointer transition-all hover:border-4 hover:border-[#1E3B8B] ${
           selectedCourt === match.id
             ? "border-4 border-[#1E3B8B] ring-4 ring-[#1E3B8B]/20"
             : "border-2"
         }`}
         onClick={() => handleSelectedCourt(match.id)}
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
                  <h3 className="font-semibold text-lg">{match.name}</h3>
                  <p
                    className={`text-sm ${
                      expandedCard === match.id
                        ? "text-black/80 bg-gray-300"
                        : "text-white/80"
                    }`}
                  >
                    {expandedCard === match.id
                      ? match.description
                      : `${match.description.slice(0, 30)}...`}{" "}
                    <button
                      className="text-blue-400 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCard(
                          expandedCard === match.id ? null : match.id
                        );
                      }}
                    >
                      {expandedCard === match.id ? "voir moins" : "voir plus"}
                    </button>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {hasAccess === false && (
        <p className="text-red-500"><CountTime codeUIR={codeUIR} selectedCourt={selectedCourt }   referenceSport={referenceSport}/> </p>
      )}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 w-4 h-4" /> Retour
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedCourt || hasAccess === false}
          className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
        >
          Suivant <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
