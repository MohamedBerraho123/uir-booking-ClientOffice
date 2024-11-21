import React, { useEffect, useState } from "react";
// import axios from "axios";
import ApiSystem from "../../apiSystem";


const Step1ChooseSport = ({  selectedSport, setSelectedSport, nextStep, setSports }) => {
  const [sports, setSportsLocal] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await ApiSystem.get("/SportCategorys/list");
        setSportsLocal(response.data);
        setSports(response.data); // Passer la liste des sports en tant que prop
      } catch (error) {
        // setError("Failed to load sports");
        console.log("Failed to load sports");
        
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, [ setSports]); // Ajoutez setSports ici pour éviter les avertissements sur la dépendance

  const handleSportSelection = (e) => {
    setSelectedSport(e.target.value);
  };

  return (
    <div className=" pt-10">
  <h3 className="text-lg font-semibold mb-10  white-text">Choisissez un sport :</h3>
  {loading && <p>Loading sports...</p>}
  
  <select 
    className="select w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
    value={selectedSport} 
    onChange={handleSportSelection}
  >
    <option value="" className="blue-txt text-center">-- Sélectionnez un sport --</option>
    {sports.map((sport) => (
      <option className="blue-txt text-center" key={sport.id} value={sport.id}>{sport.name}</option>
    ))}
  </select>

  {selectedSport && (
   
    <div className="pt-20">
    <div className="pt-20">
    <button 
        className="btn px-4 py-2 mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 gree-button for-margin"
        onClick={nextStep}
      >
        Suivant  &gt;&gt;
      </button>
    </div>
    </div>
   
  )}
</div>

  
  );
};

export default Step1ChooseSport;
