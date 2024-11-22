import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f8f9fc] p-2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold text-[#1E3B8B] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Get in touch with our sports facility management team
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
                <CardTitle className="text-2xl">Contact Information</CardTitle>
                <CardDescription className="text-white/80">
                  Find us using the information below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#1E3B8B]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#1E3B8B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Location</h3>
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
                    <h3 className="font-semibold text-lg">Phone</h3>
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
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message here"
                      className="min-h-[150px] border-[#1E3B8B]/20 focus-visible:ring-[#1E3B8B]"
                    />
                  </div>
                  <Button className="w-full bg-[#1E3B8B] hover:bg-[#1E3B8B]/90">
                    Send Message
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