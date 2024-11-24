import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ChooseSport({ sports, selectedSport, onSelectSport, onNext }) {
  const [courtsCount, setCourtsCount] = useState({});

  const handleSelectSport = (id) => {
    onSelectSport(id);
    console.log("id of sport selected : ", id);
  };

  useEffect(() => {
    const fetchCourtsCount = async () => {
      try {
        const courtCounts = {};
        for (const sport of sports) {
          const response = await axios.get(
            `https://localhost:7125/api/Sports/category/${sport.id}`
          );
          courtCounts[sport.id] = response.data.length;
        }
        setCourtsCount(courtCounts);
        // console.log("Court counts:", courtCounts);
      } catch (error) {
        console.error("Failed to fetch courts count:", error);
      }
    };

    if (sports.length > 0) {
      fetchCourtsCount();
    }
  }, [sports]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#1E3B8B]">Select Your Sport</h2>
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
              <img
                src={
                  sport.image
                    ? `data:image/png;base64,${sport.image}`
                    : "placeholder.png"
                }
                alt={sport.name}
                className="w-12 h-12 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center"
              />
              <div>
                <h3 className="font-semibold text-lg">{sport.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {courtsCount[sport.id] ?? "Loading..."} courts available
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedSport}
          className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
        >
          Next <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
