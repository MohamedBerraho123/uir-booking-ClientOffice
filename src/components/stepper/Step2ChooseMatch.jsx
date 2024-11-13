import React, { useEffect, useState } from "react";
// import axios from "axios";
import ApiSystem from "../../apiSystem";

const Step2ChooseMatch = ({  selectedSport, selectedCategory, setSelectedCategory, nextStep, prevStep }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!selectedSport) return; // Ensure selectedSport is valid before making the API call

      try {
        setLoading(true);
        // Use selectedSport as the category ID for the API call
        const response = await ApiSystem.get(`/Sports/category/${selectedSport}`);
        // Log the matches fetched
        setMatches(response.data);
      } catch (error) {
        // setError("Failed to fetch matches for the selected category.");
        console.log('Failed to fetch matches for the selected category.');
        

      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [ selectedSport]); // Ensure selectedSport is included in the dependencies

  return (
    <div>
    <h3 className="text-lg font-semibold mb-2 white-text">Choisissez un terrain :</h3>
    {loading && <p>Loading matches...</p>}
    {matches.length === 0 && !loading && <p>No matches available for this sport.</p>}
    
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 card-container">
      {matches.map((match, index) => (
        <div
          key={index}
         
          onClick={() => {
            setSelectedCategory(match.id);
            nextStep(); // Proceed to the next step when a match is selected
          }}
        >
          <img
            src={match.image ? `data:image/png;base64,${match.image}` : 'placeholder.png'}
            alt={match.name}
            className="w-24 h-24 object-cover rounded-md mx-auto mb-2"
          />
          <p className="text-center  font-medium white-text">{match.name}</p>
        </div>
      ))}
    </div>
  
    
    
    <button 
      className="btn   px-4 py-2 mt-4 rounded-md  focus:outline-none focus:ring-2 focus:ring-gray-500 gree-button"
      onClick={prevStep}
    >
      Précédent
    </button>
  </div>
  
  );
};

export default Step2ChooseMatch;
