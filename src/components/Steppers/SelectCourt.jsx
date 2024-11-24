import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect } from "react";

export default function SelectCourt({
  selectedSport,
  courts,
  selectedCourt,
  onSelectCourt,
  onNext,
  onBack,
}) {
  const [matches, setMatches] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  // console.log("the id of sport select is from SelectCourt : ", selectedSport);
  // console.log("courtsis from SelectCourt : ", courts);
  // console.log("selectedCourt is from SelectCourt : ", selectedCourt);

  const HandlerSelectedCourt = (courtId) => {
    
    onSelectCourt(courtId); 
   
    // console.log("sportId : ", courtId);
  };

  useEffect(() => {
    if (selectedSport) {
      const fetchMatches = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7125/api/Sports/category/${selectedSport}`
          );
          setMatches(response.data);
          // console.log("data of fetchsportmatch : ", response.data);

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
  }, [selectedSport]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1E3B8B]">Select Your Court</h2>
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
                  <h3 className="font-semibold text-lg">{match.name}</h3>
                  <p
                    className={`text-sm ${
                      expandedCard === match.id
                        ? "bg-black text-red-500"
                        : "text-white/80"
                    }`}
                  >
                    {expandedCard === match.id
                      ? match.conditions // Show the full text if expanded
                      : `${match.conditions.slice(0, 30)}...`}{" "}
                    {/* Show first 30 characters */}
                    <button
                      className="text-blue-400 ml-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onClick of the parent
                        setExpandedCard(
                          expandedCard === match.id ? null : match.id
                        );
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
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedCourt}
          className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
        >
          Next <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
