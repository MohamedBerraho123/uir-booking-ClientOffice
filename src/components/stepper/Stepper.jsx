import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import Step1ChooseSport from "./Step1ChooseSport";
import Step2ChooseMatch from "./Step2ChooseMatch";

import Step3And4Reservation from "./Step3And4Reservation"
import "./Stepper.css";

const steps = ["Choose Sport", "Choose Match", "Select Time"];

const Stepper = () => {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [studentCodeUIRList, setStudentCodeUIRList] = useState([]);
  const [referenceSport, setReferenceSport] = useState(null);
  const [nbPlayerSport,setNbPlayerSport] = useState(null);
  const [sports, setSports] = useState([]);
  const [success, setSuccess] = useState(null);
  // const [error, setError] = useState(null);
  // const [studentCodeUIR, setStudentCodeUIR] = useState(""); 

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="stepper-container">
      <div className="steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-item ${
              index + 1 < currentStep ? "complete" : ""
            } ${index + 1 === currentStep ? "active" : ""}`}
          >
            <div className="step">
              {index + 1 < currentStep ? <TiTick size={20} /> : index + 1}
            </div>
            <p>{step}</p>
          </div>
        ))}
      </div>

      <div className="step-content">
        {currentStep === 1 && (
          <Step1ChooseSport
           
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            nextStep={nextStep}
            // setError={setError}
            setSports={setSports}
          />
        )}
        {currentStep === 2 && (
          <Step2ChooseMatch
          
            selectedSport={selectedSport}
            selectedCategory={selectedCategory}
            setReferenceSport={setReferenceSport} 
            setSelectedCategory={setSelectedCategory}
            setNbPlayerSport={setNbPlayerSport}
            nextStep={nextStep}
            prevStep={prevStep}
            // setError={setError}
          />
        )}
        {currentStep === 3 && (
          <Step3And4Reservation
           
            selectedCategory={selectedCategory}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            studentCodeUIRList={studentCodeUIRList}
            nbPlayerSport={nbPlayerSport}
            referenceSport={referenceSport} 

         
            setStudentCodeUIRList={setStudentCodeUIRList}
            setSuccess={setSuccess}
            // setError={setError}
            prevStep={prevStep}
            sports={sports}
            selectedSport={selectedSport} 
          />
        )}

      
      </div>

      {success && <p className="success-message">{success}</p>}
    
    </div>
  );
};

export default Stepper;
