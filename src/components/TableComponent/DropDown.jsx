import React, { useEffect, useState } from 'react';
import ApiSystem from "../../apiSystem";

function Dropdown({ onSportSelect }) {
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
    onSportSelect(selectedSportId); // Pass the selected sport to the parent component
  };

  useEffect(() => {
    if (selectedSport) {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const response = await ApiSystem.get(`/Sports/category/${selectedSport}`);
          setMatches(response.data);
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
        className="mt-2 p-2 border rounded"
        value={selectedSport || ""}
        onChange={handleSportSelection}
      >
        <option value="" className="blue-txt text-center">-- Sélectionnez un sport --</option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>{sport.name}</option>
        ))}
      </select>

      {loading && <p>Loading...</p>}

      {matches.length > 0 && (
        <div>
          <h3>Matches for selected category:</h3>
          <ul>
            {matches.map(match => (
              <li key={match.id}>{match.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
