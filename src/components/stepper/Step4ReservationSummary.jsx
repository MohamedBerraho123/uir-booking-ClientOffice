import React from "react";
import axios from "axios";

const Step4ReservationSummary = ({ token, studentcodeUIR, selectedCategory, selectedTimeRange, studentCodeUIRList, setStudentCodeUIRList, setSuccess, setError, prevStep, sports }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const reservationData = {
      codeUIR: studentcodeUIR,
      sportId: selectedCategory,
      hourStart: selectedTimeRange.hourStart,
      hourEnd: selectedTimeRange.hourEnd,
      codeUIRList: studentCodeUIRList,
    };

    try {
      const response = await axios.post("https://localhost:7125/api/Reservations/AddReservations", reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Reservation successful!");
    } catch (error) {
      setError("Failed to create reservation.");
    }
  };

  // Find the sport name based on the ID
  const sport = sports.find(sport => sport.id === selectedCategory);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Résumé de la réservation :</h3>
      <p>Sport: {sport ? sport.name : "Inconnu"}</p>
      <p>Sport ID: {selectedCategory}</p>
      <p>Heure: {selectedTimeRange.hourStart} - {selectedTimeRange.hourEnd}</p>
      <button className="btn btn-secondary mt-4" onClick={prevStep}>Précédent</button>
      <button className="btn btn-primary mt-4" onClick={handleSubmit}>Confirmer la réservation</button>
    </div>
  );
};

export default Step4ReservationSummary;
