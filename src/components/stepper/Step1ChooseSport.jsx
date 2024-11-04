// Step1ChooseSport.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Step1ChooseSport = ({ token, selectedSport, setSelectedSport, nextStep, setError, setSports }) => {
  const [sports, setSportsLocal] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://localhost:7125/api/SportCategorys/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSportsLocal(response.data);
        setSports(response.data); // Passer la liste des sports en tant que prop
      } catch (error) {
        setError("Failed to load sports");
      } finally {
        setLoading(false);
      }
    };
    fetchSports();
  }, [token, setError, setSports]); // Ajoutez setSports ici pour éviter les avertissements sur la dépendance

  const handleSportSelection = (e) => {
    setSelectedSport(e.target.value);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Choisissez un sport :</h3>
      {loading && <p>Loading sports...</p>}
      <select className="select" value={selectedSport} onChange={handleSportSelection}>
        <option value="">-- Sélectionnez un sport --</option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>{sport.name}</option>
        ))}
      </select>
      {selectedSport && (
        <button className="btn btn-primary mt-4" onClick={nextStep}>
          Suivant
        </button>
      )}
    </div>
  );
};

export default Step1ChooseSport;
