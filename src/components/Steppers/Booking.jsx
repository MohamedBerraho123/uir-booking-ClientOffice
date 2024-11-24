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
    const handleBack = () => setStep(step - 1);
  
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


// export default function Booking() {
//   const [step, setStep] = useState(1)
//   const [selectedSport, setSelectedSport] = useState("")
//   const [selectedCourt, setSelectedCourt] = useState("")
//   const [participants, setParticipants] = useState([])

//   const handleNext = () => setStep(step + 1)
//   const handleBack = () => setStep(step - 1)
  
//   const addParticipant = (code) => {
//     if (code && !participants.includes(code)) {
//       setParticipants([...participants, code])
//     }
//   }

//   const removeParticipant = (code) => {
//     setParticipants(participants.filter(p => p !== code))
//   }







//     const HandelSelectSport =(id)=>{

//         setSelectedSport(id)
//         console.log("id for sport selected : " , id);
        
      
//       }
//     const HandleSelectedCourt=(court)=>{
//         setSelectedCourt(court)
//         console.log("court : ", court);
        
//     }
//     const HandleSelectedTimeRange = (timeRange) => {
 
//         console.log("Selected time range: ", timeRange); // For debugging
//       };
      
  

//   return (
//     <div className="min-h-screen bg-[#f8f9fc] p-6">
   
//       <Card className="w-full max-w-5xl mx-auto border-0 shadow-lg">
//         <CardHeader className="bg-[#1E3B8B] text-white rounded-t-lg">
//             {/* ---div--- of header stepper  */}
//           <div className="flex flex-col gap-6">
//             <CardTitle className="text-3xl font-bold text-center text-[#cfd803]">University Sports Booking</CardTitle>
//             <div className="flex justify-between items-center">
//               <motion.div 
//                 className={`flex items-center gap-3 p-3 rounded-lg ${step === 1 ? "bg-white/10" : ""}`}
//                 animate={{ opacity: 1 }}
//                 initial={{ opacity: 0 }}
//               > header 1
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//                   <Trophy className="w-5 h-5 text-[#cfd803]" /> 
//                 </div>
//                 <span className="hidden sm:inline">Choose Sport</span>
//               </motion.div>
//               <ChevronRight className="w-5 h-5 text-[#cfd803]" />
//               <motion.div 
//                 className={`flex items-center gap-3 p-3 rounded-lg ${step === 2 ? "bg-white/10" : ""}`}
//                 animate={{ opacity: 1 }}
//                 initial={{ opacity: 0 }}
//               > header2
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//                   <Shield className="w-5 h-5 text-[#cfd803]" />
//                 </div>
//                 <span className="hidden sm:inline">Select Court</span>
//               </motion.div>
//               <ChevronRight className="w-5 h-5 text-[#cfd803]" />
//               <motion.div 
//                 className={`flex items-center gap-3 p-3 rounded-lg ${step === 3 ? "bg-white/10" : ""}`}
//                 animate={{ opacity: 1 }}
//                 initial={{ opacity: 0 }}
//               >header 3
//                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
//                   <Clock className="w-5 h-5 text-[#cfd803]" />
//                 </div>
//                 <span className="hidden sm:inline">Book Time</span>
//               </motion.div>
//             </div>
//           </div>
//           {/* ---div---fn header stepper */}

//         </CardHeader>



//           {/* ---div--- body of  stepper */}
         
//         <CardContent className="p-8">


//              {/* ---div---1 body of  stepper one for choose Sport */}
//           {step === 1 && (
//             <motion.div 
//               className="space-y-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-[#1E3B8B]">Select Your Sport</h2>
//                 <p className="text-muted-foreground">Choose from our available sports facilities</p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {sports.map((sport) => (
//                   <Card 
//                     key={sport.id}
//                     className={`cursor-pointer transition-all hover:border-[#1E3B8B] ${
//                       selectedSport === sport.id ? "border-[#1E3B8B] bg-[#1E3B8B]/5" : ""
//                     }`}
//                     onClick={()=>HandelSelectSport(sport.id)}
//                   >
//                     <CardContent className="flex items-center gap-4 p-6">
//                       <div className="w-12 h-12 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center">
//                         <sport.icon className="w-6 h-6 text-[#1E3B8B]" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-lg">{sport.name}</h3>
//                         <p className="text-sm text-muted-foreground">{sport.courts.length} courts available</p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//               <div className="flex justify-end">
//                 <Button 
//                   onClick={handleNext} 
//                   disabled={!selectedSport}
//                   className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
//                 >
//                   Next <ChevronRight className="ml-2 w-4 h-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           )}
//                 {/* ---div---FINAL 1 body of  stepper one for choose Sport */}
//                 {/* ------------------------------------------------------------------------------------------------------ */}


//                       {/* ---div---2 body of  stepper one for select Court */}

//           {step === 2 && (
//             <motion.div 
//               className="space-y-6"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-[#1E3B8B]">Select Your Court</h2>
//                 <p className="text-muted-foreground">Choose your preferred playing area</p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {sports.find(s => s.id === selectedSport)?.courts.map((court) => (
//                   <Card 
//                     key={court}
//                     className={`cursor-pointer transition-all hover:border-[#1E3B8B] overflow-hidden ${
//                       selectedCourt === court ? "border-[#1E3B8B] ring-2 ring-[#1E3B8B]/20" : ""
//                     }`}
//                     onClick={() => HandleSelectedCourt(court)}
//                   >
//                     <CardContent className="p-0">
//                       <div className="aspect-video relative">
//                         <img 
//                           src="/placeholder.svg?height=400&width=600" 
//                           alt={court}
//                           className="w-full h-full object-cover"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//                         <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
//                           <h3 className="font-semibold text-lg">{court}</h3>
//                           <p className="text-sm text-white/80">Available Now</p>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={handleBack}>
//                   <ChevronLeft className="mr-2 w-4 h-4" /> Back
//                 </Button>
//                 <Button 
//                   onClick={handleNext} 
//                   disabled={!selectedCourt}
//                   className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
//                 >
//                   Next <ChevronRight className="ml-2 w-4 h-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           )}
//           {/* ---div--- final 2 body of  stepper one for select Court */}

//                 {/* ------------------------------------------------------------------------------------------------------ */}

//           {/* ---div--- final 3 body of  stepper one for Book Time */}

//           {step === 3 && (
//             <motion.div 
//               className="space-y-8"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-bold text-[#1E3B8B]">Book Your Time Slot</h2>
//                 <p className="text-muted-foreground">Select a time and add participants</p>
//               </div>

//               <div className="grid gap-8 md:grid-cols-2">
//                 <Card className="border-0 shadow-md">
//                   <CardHeader>
//                     <CardTitle className="text-lg flex items-center gap-2">
//                       <Calendar className="w-5 h-5 text-[#1E3B8B]" />
//                       Available Time Slots
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>




//                       {/* ---div--- RadioGroup ----------------------------------*/}
//                     <RadioGroup defaultValue="14:00" className="grid gap-4">
//                       {["14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => (
//                         <div
//                           key={time}
//                           className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-[#1E3B8B]/5"
//                         >
//                           <RadioGroupItem value={time} id={time}  onChange={() => HandleSelectedTimeRange(time)} checked={time}  />
//                           <Label htmlFor={time} className="flex-1">
//                             <span className="font-medium">{time} - {parseInt(time) + 1}:00</span>
//                             <br />
//                             <span className="text-sm text-muted-foreground">60 minutes</span>
//                           </Label>
//                           <span className="text-sm font-medium text-green-600">Available</span>
//                         </div>
//                       ))}
//                     </RadioGroup>
//                       {/* ---div--- RadioGroup ----------------------------------*/}
//                   </CardContent>






//                 </Card>

//                 <Card className="border-0 shadow-md">
//                   <CardHeader>
//                     <CardTitle className="text-lg flex items-center gap-2">
//                       <Users className="w-5 h-5 text-[#1E3B8B]" />
//                       Participants
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex flex-wrap gap-2">
//                       {participants.map((code) => (
//                         <div 
//                           key={code} 
//                           className="flex items-center gap-2 bg-[#1E3B8B]/10 text-[#1E3B8B] px-3 py-1.5 rounded-full"
//                         >
//                           <span className="text-sm font-medium">{code}</span>
//                           <Button 
//                             variant="ghost" 
//                             size="icon" 
//                             className="h-5 w-5 hover:bg-[#1E3B8B]/20" 
//                             onClick={() => removeParticipant(code)}
//                           >
//                             <X className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="flex gap-2">
//                       <Input 
//                         placeholder="Enter student ID"
//                         className="border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             addParticipant(e.target.value)
//                             e.target.value = ''
//                           }
//                         }}
//                       />
//                       <Button 
//                         variant="outline" 
//                         size="icon"
//                         className="border-[#1E3B8B]/20 text-[#1E3B8B] hover:bg-[#1E3B8B]/10 hover:text-[#1E3B8B]"
//                       >
//                         <Plus className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="flex justify-between pt-4">
//                 <Button variant="outline" onClick={handleBack}>
//                   <ChevronLeft className="mr-2 w-4 h-4" /> Back
//                 </Button>
//                 <Button 
//                   onClick={() => alert("Booking confirmed!")}
//                   className="bg-[#1E3B8B] hover:bg-[#1E3B8B]/90"
//                 >
//                   Confirm Booking
//                 </Button>
//               </div>
//             </motion.div>
//           )}
//            {/* ---div--- final 3 body of  stepper one for Book Time */}
//         </CardContent>
//          {/* ---div---fn body of  stepper */}
//       </Card>
//     </div>
//   )
// }
