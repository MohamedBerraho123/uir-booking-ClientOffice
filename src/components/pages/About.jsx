import { motion } from "framer-motion";
import { Calendar, Clock, Trophy, Users } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ApiSystem from "../../apiSystem";
import { useNavigate } from "react-router-dom"; 
import Uirback from "../../assets/Uirback.jpeg";
import uiir from "../../assets/uiir.jpeg";
import uiirr from "../../assets/uiirr.jpeg";
import Footer from "../Layouts/Footer"


export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sports, setSports] = useState([]);
  const navigate = useNavigate();

  const slides = [
    {
      image: Uirback,
      title: "World-Class Sports Facilities",
      subtitle: "Experience the best in university athletics",
    },
    {
      // image: "../../assets/Uirback.jpeg?height=1080&width=1920",
      image: uiir,
      title: "Train Like a Champion",
      subtitle: "State-of-the-art equipment and expert coaching",
    },
    {
      image: uiirr,
      title: "Join the Community",
      subtitle: "Connect with fellow sports enthusiasts",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const features = [
    {
      icon: Trophy,
      title: "Multiple Sports",
      description:
        "Access to various sports facilities including football, tennis, padel, and volleyball",
    },
    {
      icon: Calendar,
      title: "Easy Booking",
      description:
        "Simple and quick online booking system for all university sports facilities",
    },
    {
      icon: Users,
      title: "Team Building",
      description:
        "Perfect for organizing team sports and recreational activities",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description:
        "Extended facility hours to accommodate different schedules",
    },
  ];

  



  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await ApiSystem.get("/Sports/list");
        const fetchedSports = response.data;

        // Shuffle and pick 4 random sports
        const shuffledSports = fetchedSports
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setSports(shuffledSports);
      } catch (error) {
        console.error("Failed to load sports:", error);
      }
    };

    fetchSports();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <div className="relative bg-[#1E3B8B] text-white h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
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
                <motion.p
                  key={`${index}-subtitle`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl text-white/80"
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-[#f8f9fc]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1E3B8B] mb-4">
              Why Choose Our Facilities?
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience top-notch sports facilities with modern amenities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-[#1E3B8B]/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-[#1E3B8B]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Sports Section */}
      <div className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-[#1E3B8B] mb-4">
            Available Sports
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from our wide range of sports facilities
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
              onClick={() => navigate("/stepper", { state: { sport } })}
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

      {/* CTA Section */}
      {/* <div className="bg-[#1E3B8B] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Book your preferred sports facility now and enjoy our modern
              amenities
            </p>
            <Button size="lg" className="bg-white text-[#1E3B8B] hover:bg-white/90"    onClick={() => navigate("/stepper")}>
              Book a Facility
            </Button>
          </motion.div>
        </div>
      </div> */}
      <Footer/>
    </div>
  );
}
