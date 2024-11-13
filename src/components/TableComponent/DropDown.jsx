import React, { useEffect, useState } from 'react';
import ApiSystem from "../../apiSystem";


//props : { filterType, onFilterTypeChange }
function Dropdown (){


  const [sports, setSportsLocal] = useState([]);
  const [selectedSport, setSelectedSport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await ApiSystem.get("/SportCategorys/list");
        setSportsLocal(response.data);
        // setSports(response.data); // Passer la liste des sports en tant que prop
      } catch (error) {
        // setError("Failed to load sports");
        console.log("Failed to load sports");
        
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, []); // Ajoutez setSports ici pour éviter les avertissements sur la dépendance

  const handleSportSelection = (e) => {
    setSelectedSport(e.target.value);
  };
  return (
    <select 
    className="mt-2 p-2 border rounded"
    value=""
    onChange={handleSportSelection}
  >
    <option value="" className="blue-txt text-center">-- Sélectionnez un sport --</option>
    {sports.map((sport) => (
      <option className="blue-txt text-center" key={sport.id} value={sport.id}>{sport.name}</option>
    ))}
  </select>
  );
};

export default Dropdown;
