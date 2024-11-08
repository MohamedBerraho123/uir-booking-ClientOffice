import React, { useEffect, useState } from "react";
import axios from "axios";

const Step3TimeSelection = ({ token, selectedCategory, selectedTimeRange, setSelectedTimeRange, nextStep, prevStep, setError }) => {
  const [timeRanges, setTimeRanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [participantCodes, setParticipantCodes] = useState(['']);

  useEffect(() => {
    const fetchTimeRanges = async () => {
      if (!selectedCategory) return;

      try {
        setLoading(true);
        const response = await axios.get(`https://localhost:7125/api/Plannings/get-time-ranges-by-sport-not-reserved/${selectedCategory}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimeRanges(response.data);
      } catch (error) {
        setError("Failed to load time ranges");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeRanges();
  }, [token, selectedCategory, setError]);

  const handleParticipantCodeChange = (e, index) => {
    const updatedList = [...participantCodes];
    updatedList[index] = e.target.value;
    setParticipantCodes(updatedList);
  };

  const addParticipantCodeField = () => {
    setParticipantCodes([...participantCodes, '']);
  };

  const removeParticipantCodeField = (index) => {
    const updatedList = participantCodes.filter((_, i) => i !== index);
    setParticipantCodes(updatedList);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Sélectionnez un créneau horaire :</h3>
      {loading && <p>Loading time ranges...</p>}
      {!loading && timeRanges.length === 0 && <p>No available time ranges for this match.</p>}
      {timeRanges.map((timeRange) => (
        <div key={timeRange.id}>
          <input
            type="radio"
            name="timeRange"
            value={timeRange.id}
            checked={selectedTimeRange && selectedTimeRange.id === timeRange.id}
            onChange={() => setSelectedTimeRange(timeRange)}
          />
          <label>{timeRange.hourStart} - {timeRange.hourEnd}</label>
        </div>
      ))}

      <div>
        <h3 className="text-lg font-semibold mt-4">Codes des participants :</h3>
        {participantCodes.map((code, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              value={code}
              onChange={(e) => handleParticipantCodeChange(e, index)}
              required
              placeholder="Entrer le code UIR"
            />
            <button type="button" onClick={() => removeParticipantCodeField(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addParticipantCodeField}>Ajouter un participant</button>
      </div>

      <button className="btn btn-secondary mt-4" onClick={prevStep}>Précédent</button>
      {selectedTimeRange && <button className="btn btn-primary mt-4" onClick={nextStep}>Suivant</button>}
    </div>
  );
};

export default Step3TimeSelection;
