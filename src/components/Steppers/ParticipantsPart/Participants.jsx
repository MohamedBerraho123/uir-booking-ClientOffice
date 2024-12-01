import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Users, X } from "lucide-react";
import { Input } from "../../ui/input";
import { useState, useEffect } from "react";
import ApiSystem from "../../../apiSystem";

const Participants = ({ participants, selectedCourt, onParticipantCodeChange }) => {
  const [participantCodes, setParticipantCodes] = useState([""]);
  const [nbPlayerSport, setNbPlayerSport] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  useEffect(() => {
    onParticipantCodeChange(participantCodes);
  }, [participantCodes, onParticipantCodeChange]);

  useEffect(() => {
    if (selectedCourt) {
      const fetchMatches = async () => {
        try {
          const response = await ApiSystem.get(`/Sports/${selectedCourt}`);
          setNbPlayerSport(response.data.nbPlayer);
        } catch (error) {
          console.error("Failed to fetch matches for the selected category:", error);
        }
      };

      fetchMatches();
    }
  }, [selectedCourt]);

  const addParticipantCodeField = async () => {
    const lastCode = participantCodes[participantCodes.length - 1];
    const isValidCode = await validateCodeUir(lastCode);

    if (!isValidCode) {
      setInputErrors((prevErrors) => ({
        ...prevErrors,
        [participantCodes.length - 1]: "Le code UIR Incorrect !"
      }));
    } else {
      if (participantCodes.length < nbPlayerSport - 1) {
        setParticipantCodes([...participantCodes, ""]);
        setInputErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          delete updatedErrors[participantCodes.length]; // Clear the error for the new input field
          return updatedErrors;
        });
      } else {
        console.log("Cannot add more participants. Maximum limit reached:", nbPlayerSport - 1);
        setTitleError(`Vous ne pouvez ajouter que ${nbPlayerSport - 1} participants.`);
      }
    }
  };

  const removeParticipantCodeField = (index) => {
     // Prevent removal of the first input field
  if (index === 0) return;
    const updatedList = participantCodes.filter((_, i) => i !== index);
    setParticipantCodes(updatedList);
    const updatedErrors = { ...inputErrors };
    delete updatedErrors[index]; // Remove the error for this input
    setInputErrors(updatedErrors);
  };

  const handleParticipantCodeChange = (e, index) => {
    const updatedList = [...participantCodes];
    const code = e.target.value;
    updatedList[index] = code;
    setParticipantCodes(updatedList);

    // Clear any existing error for this input field
    setInputErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[index];
      return updatedErrors;
    });
  };

  const validateCodeUir = async (code) => {
    try {
      const response = await ApiSystem.get(`/Students/checkCodeUIR/${code}`);
      return response.data ? true : false;
    } catch (error) {
      console.error("Failed to check if code UIR exists:", error);
      return false;
    }
  };

  const removeParticipant = (code) => {
    const updatedParticipants = participants.filter((participant) => participant !== code);
    console.log("Removed participant:", code, updatedParticipants);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1E3B8B]" />
          Participants {nbPlayerSport - 1}
        </CardTitle>
        {titleError && <p className="text-red-500">{titleError}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
     
        {participantCodes.map((code, index) => (
          <div className="flex gap-2" key={index}>
            <Input
              placeholder="Enter student Code UIR"
              className="border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
              value={code}
              onChange={(e) => handleParticipantCodeChange(e, index)}
            />
            {inputErrors[index] && (
              <p className="text-red-500 text-sm">{inputErrors[index]}</p>
            )}
            <Button
              variant="outline"
              size="icon"
              className="border-[red]/20 text-[white] bg-red-600 hover:bg-[red]/10 hover:text-[red]"
              onClick={() => removeParticipantCodeField(index)}
            >
              -
            </Button>
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="button"
            className="btn bg-blue-600 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={addParticipantCodeField}
            disabled={participantCodes.length >= nbPlayerSport}
          >
            Ajouter un participant
          </button>
        </div>
      </CardContent>
    </>
  );
};

export default Participants;
