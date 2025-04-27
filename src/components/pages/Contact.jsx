import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import ApiSystem from "../../apiSystem";
import Swal from "sweetalert2";
import { ClipLoader } from 'react-spinners'; 

export default function Contact({userId}) {
  const [formData, setFormData] = useState({
    fullName: "",
    message: "",
  });
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const [loading, setLoading] = useState(false); 


  useEffect(() => {
    const fetchStudentByUserId = async (userId) => {
       console.log("Header ", userId);
      try {
        const response = await ApiSystem.get(
          `/Students/GetStudentByUserId/${userId}`);
        setUserData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
        });
        console.log("res : ",response);
        console.log("res : ",response.data.firstName);
        
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };


    if (userId) {
      fetchStudentByUserId(userId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const sendEmail = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page
    setLoading(true); 
    try {
      // Prepare the email data
      const emailData = {
        email: "elghiouanesouhail19@gmail.com",
        subject: `Message from ${userData.firstName} ${userData.lastName}`,
        message: formData.message,
      };

      // Send the email
      const response = await ApiSystem.post("/Email/SendEmail", emailData);
      console.log("Email sent successfully:", response.data);

      // Optionally, clear the form
      setFormData({ fullName: "", message: "" });
  
    
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Message envoyé avec succès !",
          icon: "success",
        });}else {
          Swal.fire({
            title: "Erreur lors de l'envoi le Message!",
            icon: "error",
          });}
    
    } catch (error) {
      console.error("Error sending email", error);
      alert("Erreur lors de l'envoi du message. Veuillez réessayer.");
    }finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-[#1E3B8B] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Prenez contact avec notre équipe de gestion des installations sportives
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg h-full">
              <CardHeader className="bg-[#1E3B8B] text-white rounded-t-lg">
                <CardTitle className="text-2xl">Informations de contact</CardTitle>
                <CardDescription className="text-white/80">
                  Trouvez-nous en utilisant les informations ci-dessous
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
              <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#1E3B8B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Localisation</h3>
                    <p className="text-muted-foreground">
                    Université Internationale de Rabat Technopolis Rabat-Shore Rocade Rabat-Salé
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#1E3B8B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Téléphone</h3>
                    <p className="text-muted-foreground">+212 (0)5 30 10 30 00</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#1E3B8B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-muted-foreground">contact@uir.ac.ma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={sendEmail}>
                  {/* <div className="space-y-2">
                    <Label htmlFor="fullName">Complete Nom</Label>
                    <Input
                      id="fullName"
                      placeholder="Entrez votre complete nom"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
                      required
                    />
                  </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tapez votre message ici"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="min-h-[150px] border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
                      required
                    />
                  </div>
                  <Button disabled={loading}  type="submit"   className={`${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'w-full bg-[#1E3B8B] hover:bg-[#1E3B8B]/90'
            } text-white font-semibold rounded-md py-2 px-4 w-full flex justify-center items-center`}>
                  {loading ? <ClipLoader size={20} color="#ffffff" /> : 'Envoyer le message'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
