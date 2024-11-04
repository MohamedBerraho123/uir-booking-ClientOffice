// Step2ChooseMatch.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Step2ChooseMatch = ({ token, selectedSport, selectedCategory, setSelectedCategory, nextStep, prevStep, setError }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedSport) return; // Ensure selectedSport is valid before making the API call

      try {
        setLoading(true);
        // Use selectedSport as the category ID for the API call
        const response = await axios.get(`https://localhost:7125/api/Sports/category/${selectedSport}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Log the matches fetched
        setMatches(response.data);
      } catch (error) {
        setError("Failed to fetch matches for the selected category.");

      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token, selectedSport, setError]); // Ensure selectedSport is included in the dependencies

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Choisissez un match pour {selectedSport} :</h3>
      {loading && <p>Loading matches...</p>}
      {matches.length === 0 && !loading && <p>No matches available for this sport.</p>}
      <div className="card-container">
        {matches.map((match, index) => (
          <div
            key={index}
            className={`card ${selectedCategory === match.id ? "selected" : ""}`}
            onClick={() => {
              setSelectedCategory(match.id);
              nextStep(); // Proceed to the next step when a match is selected
            }}
          >
            <img
              src={match.image ? `data:image/png;base64,${match.image}` : 'placeholder.png'}
              alt={match.name}
              style={{ width: '100px', height: '100px' }}
            />
            <p style={{ color: 'black' }}>{match.name}</p>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <p className="mt-2 text-green-600">Match sélectionné : {selectedCategory}</p>
      )}
      <button className="btn btn-secondary mt-4" onClick={prevStep}>
        Précédent
      </button>
    </div>
  );
};

export default Step2ChooseMatch;
