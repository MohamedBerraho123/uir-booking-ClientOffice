import React, { useEffect, useState } from 'react';
import ApiSystem from "../../apiSystem";


//{ onSportSelect }
function Dropdown({ onSportSelect , onFilterListSports}) {
  const [sports, setSportsLocal] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await ApiSystem.get("/SportCategorys/list");
        setSportsLocal(response.data);
    
        
      } catch (error) {
        console.log("Failed to load sports");
      } finally {
        setLoading(false);
        
      }
    };
    fetchSports();
  }, []);

  // Handle sport selection
  const handleSportSelection = (e) => {
    const selectedSportId = e.target.value;
    setSelectedSport(selectedSportId);
    onSportSelect(selectedSportId);
    console.log("Selected Sport ID from Dropdown:", selectedSportId);
  };

  useEffect(() => {
    if (selectedSport) {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const response = await ApiSystem.get(`/Sports/category/${selectedSport}`);
          setMatches(response.data);
          console.log("Sports/category/${selectedSport}" ,selectedSport);
          
    
           // Logging each sport name Name
        console.log("Data when clicking on DropDown List - sport names:");
        response.data.forEach((sport) => {
          console.log(sport.name);
        });
          
        } catch (error) {
          console.log('Failed to fetch matches for the selected category.');
        } finally {
          setLoading(false);
        }
      };
      fetchMatches();
    }
  }, [selectedSport]);

  return (
    <div>
      <select
        className="mt-2 p-2 border rounded w-full sm:w-[300px] md:w-[400px]"
        value={selectedSport || ""}
        onChange={handleSportSelection}
      >
        <option value="" className="blue-txt text-center">-- Sélectionnez un sport --</option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>{sport.name}</option>
        ))}
      </select>

     

  
    </div>
  );
}

export default Dropdown;
