import React, { useState } from "react";
import { TiTick } from "react-icons/ti";
import Step1ChooseSport from "./Step1ChooseSport";
import Step2ChooseMatch from "./Step2ChooseMatch";
import Step3TimeSelection from "./Step3TimeSelection";
import Step4ReservationSummary from "./Step4ReservationSummary";
import "./Stepper.css";

const steps = ["Choose Sport", "Choose Match", "Select Time", "Summary"];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [token, setToken] = useState("your_token_here");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [studentCodeUIRList, setStudentCodeUIRList] = useState([]);
  const [sports, setSports] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const studentcodeUIR = "your_student_code_here";

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="stepper-container">
      <div className="steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step-item ${index + 1 < currentStep ? "complete" : ""} ${index + 1 === currentStep ? "active" : ""}`}
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
            token={token}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            nextStep={nextStep}
            setError={setError}
            setSports={setSports}
          />
        )}
        {currentStep === 2 && (
          <Step2ChooseMatch
            token={token}
            selectedSport={selectedSport}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            nextStep={nextStep}
            prevStep={prevStep}
            setError={setError}
          />
        )}
        {currentStep === 3 && (
          <Step3TimeSelection
            token={token}
            selectedCategory={selectedCategory}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            nextStep={nextStep}
            prevStep={prevStep}
            setError={setError}
          />
        )}
        {currentStep === 4 && (
          <Step4ReservationSummary
            token={token}
            studentcodeUIR={studentcodeUIR}
            selectedCategory={selectedCategory}
            selectedTimeRange={selectedTimeRange}
            studentCodeUIRList={studentCodeUIRList}
            setStudentCodeUIRList={setStudentCodeUIRList}
            setSuccess={setSuccess}
            setError={setError}
            prevStep={prevStep}
            sports={sports}
          />
        )}
      </div>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Stepper;
