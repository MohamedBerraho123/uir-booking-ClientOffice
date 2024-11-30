import React, { useEffect, useState } from 'react';
import ApiSystem from '../../../apiSystem';

const CountTime = ({ selectedCourt, codeUIR }) => {
  const [countTime, setCountTime] = useState("");

  useEffect(() => {
    let intervalId;

    const FetchCountTime = async () => {
      if (selectedCourt && codeUIR) {
        const reservationData = {
          codeUIR,
          codeUIRList: [codeUIR],
          sportId: selectedCourt,
        };

        try {
          const response = await ApiSystem.post(
            "/Reservations/check-reservation-time",
            reservationData
          );
          setCountTime(response.data); // Save the access result
        //   console.log("time response:", response.data);
        } catch (error) {
          console.error("Failed to check access", error);
        }
      }
    };

    // Fetch immediately on mount/update
    FetchCountTime();

    // Set up the interval
    intervalId = setInterval(() => {
      FetchCountTime();
    }, 1000); // Update every 1 second

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [selectedCourt, codeUIR]);

  return (
    <>
      <p>{countTime}</p>
    </>
  );
};

export default CountTime;
