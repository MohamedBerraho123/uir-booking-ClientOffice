import { useState ,useEffect } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, ClubIcon as Football, Plus, Shield, Trophy, Users, X } from 'lucide-react'
import { motion } from "framer-motion"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

import ChooseSport from "./ChooseSport";
import SelectCourt from "./SelectCourt";
import BookTime from "./BookTime";
import ApiSystem from "../../apiSystem";




export default function Booking() {
    const [step, setStep] = useState(1);
    const [selectedSport, setSelectedSport] = useState("");
    const [selectedCourt, setSelectedCourt] = useState("");
    const [sports, setSports] = useState([]);
    const [participantCodes, setParticipantCodes] = useState([""]);
    const [codeUIR, setCodeUIR] = useState("");




    useEffect(() => {
      const fetchSports = async () => {
        try {
          const response = await ApiSystem.get("/SportCategorys/list");
          setSports(response.data);
          // console.log(response.data);
          
        } catch (error) {
          console.error("Failed to load sports:", error);
        }
      };
      fetchSports();
    }, []);
  
    const handleNext = () => {
      setStep(step + 1)
  
    };
    // const handleBack = () => setStep(step - 1);
    const handleBack = () => {
      resetData(step); // Reset data relevant to the current step
      setStep((prev) => prev - 1);
    };
    const resetData = (currentStep) => {
      if (currentStep === 3) {
        // Reset data specific to Step 3
        setSelectedCourt(null);
      }
      if (currentStep === 2) {
        // Reset data specific to Step 2
        setSelectedSport(null);
        setSelectedCourt(null);
      }
    };
  
    return (
      <div className="min-h-screen bg-[#f8f9fc] p-6">
         <Card className="w-full max-w-5xl mx-auto border-0 shadow-lg">
         <CardHeader className="bg-[#1E3B8B] text-white rounded-t-lg">
            {/* ---div--- of header stepper  */}
          <div className="flex flex-col gap-6">
            <CardTitle className="text-3xl font-bold text-center text-[#cfd803]">University Sports Booking</CardTitle>
            <div className="flex justify-between items-center">
              <motion.div 
                className={`flex items-center gap-3 p-3 rounded-lg ${step === 1 ? "bg-white/10" : ""}`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              > 
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[#cfd803]" /> 
                </div>
                <span className="hidden sm:inline">Choose Sport</span>
              </motion.div>
              <ChevronRight className="w-5 h-5 text-[#cfd803]" />
              <motion.div 
                className={`flex items-center gap-3 p-3 rounded-lg ${step === 2 ? "bg-white/10" : ""}`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              > 
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#cfd803]" />
                </div>
                <span className="hidden sm:inline">Select Court</span>
              </motion.div>
              <ChevronRight className="w-5 h-5 text-[#cfd803]" />
              <motion.div 
                className={`flex items-center gap-3 p-3 rounded-lg ${step === 3 ? "bg-white/10" : ""}`}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#cfd803]" />
                </div>
                <span className="hidden sm:inline">Book Time</span>
              </motion.div>
            </div>
          </div>
          {/* ---div---fn header stepper */}

        </CardHeader>

        <CardContent className="p-8">
        {step === 1 && (
          <ChooseSport
            sports={sports}
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
            onNext={handleNext}
          />
        )}
        {step === 2 && (
          <SelectCourt
            selectedSport={selectedSport}
            courts={sports.find((sport) => sport.id === selectedSport)}
            selectedCourt={selectedCourt}
            onSelectCourt={setSelectedCourt}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <BookTime
           selectedCourt={selectedCourt}
           selectedSport={selectedSport}

           
            participants={[]}
            onAddParticipant={() => {}}
            onRemoveParticipant={() => {}}
            onBack={handleBack}
          />
        )}
         </CardContent>
          </Card>
      </div>
    );
  }



