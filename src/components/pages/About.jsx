import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import Carousel1 from '../../assets/Carousel1.jpeg';
import Carousel5 from '../../assets/Carousel2.jpeg';
import Carousel3 from '../../assets/Carousel3.jpeg';

const About = () => {
  const navigate = useNavigate();  // Declare navigate
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: Carousel1,
      title: 'Carrefour de coopération',
      subtitle: 'internationale',
      description: "L'UIR a eu l'honneur d'accueillir le Président de la République française.",
    },
    {
      image: Carousel5,
      title: 'Another Slide Title',
      subtitle: 'Subtitle Here',
      description: 'Description for the second slide.',
    },
    {
      image: Carousel3,
      title: 'Another Slide Title',
      subtitle: 'Subtitle Here',
      description: 'Description for the second slide.',
    },
  ];

  // Random image change every 5 seconds using setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * slides.length);
      setCurrentIndex(randomIndex);  // Update the current index with a random index
    }, 2000);  // Change image every 5 seconds

    return () => clearInterval(interval);  // Cleanup on component unmount
  }, []);  // Empty array to run this effect only once (when the component mounts)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const handleReservationClick = () => {
    navigate('/stepper');  // Navigate to the reservation page
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Section de l'image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${slides[currentIndex].image})`,
        }}
      >
        <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50 text-white p-6 text-center">
          <h1 className="text-4xl font-bold mb-2">{slides[currentIndex].title}</h1>
          <h2 className="text-2xl text-yellow-400 mb-4">{slides[currentIndex].subtitle}</h2>
          <p className="text-lg mb-6">{slides[currentIndex].description}</p>
          <button className="px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 transition">
            En savoir +
          </button>
        </div>
      </div>

      {/* Boutons de navigation */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
        onClick={handlePrev}
      >
        &#8249;
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition"
        onClick={handleNext}
      >
        &#8250;
      </button>

      {/* Section du bouton de réservation */}
      <div className="absolute bottom-0 left-0 w-full bg-blue-800 text-white py-4 px-6 flex items-center justify-between">
        <span className="font-semibold">Démarrer ma réservation</span>
        <button
          className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition"
          onClick={handleReservationClick}  // Add click handler to navigate
        >
          JE RÉSERVE
        </button>
      </div>
    </div>
  );
};

export default About;
