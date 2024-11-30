import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Calendar } from "lucide-react";
import ApiSystem from "../../../apiSystem";
import { useState, useEffect } from "react";

const AvailableTime = ({ selectedCourt, onTimeSelect }) => {
  const [timeRanges, setTimeRanges] = useState([]);
  const [nbPlayerSport, setNbPlayerSport] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);

  useEffect(() => {
    const fetchTimeRanges = async () => {
      try {
        const response = await ApiSystem.get(
          `/Plannings/get-timeRanges-by-sport-and-day-not-reserved/${selectedCourt}`
        );
        const sportResponse = await ApiSystem.get(`/Sports/${selectedCourt}`);
        setNbPlayerSport(sportResponse.data.nbPlayer);

        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        const formattedCurrentTime = `${currentHours}:${currentMinutes < 10 ? "0" : ""}${currentMinutes}`;

        const filteredTimeRanges = response.data.filter(
          (timeRange) =>  formattedCurrentTime
        //   (timeRange) => timeRange.hourStart > formattedCurrentTime
        );

        setTimeRanges(filteredTimeRanges);
      } catch (error) {
        console.error("Failed to load time ranges", error);
      }
    };

    fetchTimeRanges();
  }, [selectedCourt]);

  const handleTimeSelect = (timeRange) => {
    setSelectedTimeRange(timeRange);
    onTimeSelect(timeRange); // Notify the parent component of the selection
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1E3B8B]" />
          Available Time Slots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {timeRanges.length === 0 ? (
            <p className="text-red-500">
              Nous sommes désolés mais il n'est pas possible de réserver ce terrain pour le moment.
            </p>
          ) : (
            timeRanges.map((timeRange) => (
              <div
                key={timeRange.id}
                className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-[#1E3B8B]/5"
                onClick={() => handleTimeSelect(timeRange)}
              >
                <input
                  type="radio"
                  name="timeRange"
                  value={timeRange.id}
                  checked={selectedTimeRange?.id === timeRange.id}
                  onChange={() => handleTimeSelect(timeRange)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label className="blue-txt">
                  {new Date(`1970-01-01T${timeRange.hourStart}Z`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(`1970-01-01T${timeRange.hourEnd}Z`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </label>
              </div>
            ))
          )}
        </div>
        
      </CardContent>
      </>
    
  );
};

export default AvailableTime;
