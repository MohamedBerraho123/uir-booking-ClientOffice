import React, { useState } from 'react';
import Carousel1 from '../../assets/Carousel1.jpeg';
import Carousel2 from '../../assets/Carousel2.jpeg';
import Carousel3 from '../../assets/Carousel3.jpeg';
import './About.css'; 

const About = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: Carousel1,
      title: 'Carrefour de coopération',
      subtitle: 'internationale',
      description: "L'UIR a eu l'honneur d'accueillir le Président de la République française.",
    },
    {
      image: Carousel2,
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

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="slider">
      <div
        className="slide"
        style={{
          backgroundImage: `url(${slides[currentIndex].image})`,
        }}
      >
        <div className="slide-content">
          <h1>{slides[currentIndex].title}</h1>
          <h2>{slides[currentIndex].subtitle}</h2>
          <p>{slides[currentIndex].description}</p>
          <button className="learn-more">En savoir +</button>
        </div>
      </div>
      <button className="prev" onClick={handlePrev}>
        &#8249;
      </button>
      <button className="next" onClick={handleNext}>
        &#8250;
      </button>
    </div>
  );
};

export default About;
