import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApiSystem from "../../apiSystem";
import Footer from "../Layouts/Footer";

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [Listsports, setListSports] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const location = useLocation();

  useEffect(() => {
    // Read query params from URL
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const email = queryParams.get("email");
    const givenName = queryParams.get("givenName");
    const surname = queryParams.get("surname");
    const profilePicture = queryParams.get("profilePicture");



    if (token && email) {
      setUserInfo({ token, email, givenName, surname, profilePicture });
    

      // Store token if needed
      localStorage.setItem("authToken", token);
    }

  }, [location.search]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await ApiSystem.get("/Sports/list");
        const fetchedSports = response.data;
        const shuffledSports = fetchedSports.sort(() => 0.5 - Math.random()).slice(0, 4);
        setSports(shuffledSports);
      } catch (error) {
        console.error("Failed to load sports:", error);
      }
    };
    fetchSports();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await ApiSystem.get("/Event/list");
        const fetchedEvents = response.data;
        setListSports(response.data);
        const shuffledEvents = fetchedEvents.sort(() => 0.5 - Math.random()).slice(0, 4);
        setEvents(shuffledEvents);
      } catch (error) {
        console.error("Failed to load sports:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative bg-[#1E3B8B] text-white h-[600px]">
        {Listsports.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={
                slide.image
                  ? `data:image/png;base64,${slide.image}`
                  : "placeholder.png"
              }
              alt={slide.title}
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-6 max-w-4xl mx-auto px-6">
                <motion.h1
                  key={`${index}-title`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-5xl font-bold mb-6"
                >
                  {slide.title}
                </motion.h1>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {events.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Show welcome message if signed in */}
      {userInfo && (
        <div className="text-center mt-10 text-xl text-[#1E3B8B]">
          👋 Welcome, {userInfo.givenName} {userInfo.surname}!
        </div>
      )}

      <div className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1E3B8B] mb-4">
              Terrains disponibles
            </h2>
            <p className="text-lg text-muted-foreground">
              Choisissez parmi notre large gamme d'installations sportives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sports.map((sport, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={
                      sport.image
                        ? `data:image/png;base64,${sport.image}`
                        : "placeholder.png"
                    }
                    alt={sport.name}
                    className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white">
                      {sport.name}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
