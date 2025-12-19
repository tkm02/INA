"use client";

import { Storage } from "@/lib/storage";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("Utilisateur");
  const router = useRouter();

  useEffect(() => {
    const data = Storage.getData();
    if (data.profile?.name) {
      setUserName(data.profile.name);
    }
  }, []);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const verifyPin = (finalPin: string) => {
    setIsLoading(true);
    const data = Storage.getData();
    
    setTimeout(() => {
      const savedPin = data.profile?.pin;
      if (savedPin === finalPin || (!savedPin && finalPin === "1234")) {
        setIsLoading(false);
        router.push("/home");
      } else {
        setIsLoading(false);
        setError("Code PIN incorrect");
        setPin("");
        setTimeout(() => setError(""), 2000);
      }
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-b from-yellow-50 via-white to-green-50 flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ fontFamily: '"Lexend Deca", sans-serif' }}
    >
      {/* Decorative Onboarding-style Circles */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-24 right-12 w-3 h-3 rounded-full bg-blue-400 opacity-60" 
      />
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
        className="absolute top-36 right-32 w-2 h-2 rounded-full bg-purple-300 opacity-60" 
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-80 right-4 w-2 h-2 rounded-full bg-green-400 opacity-60" 
      />
      <motion.div 
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-96 left-16 w-2 h-2 rounded-full bg-pink-300 opacity-60" 
      />
      <motion.div 
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-88 left-32 w-2 h-2 rounded-full bg-blue-300 opacity-60" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm z-10 text-center"
      >
        <div className="mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
          >
            <span className="font-bold text-2xl text-[#00569E]">INA</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[28px] font-bold mb-2 tracking-tight"
            style={{ color: "#E86C00", fontFamily: "Poppins, sans-serif" }}
          >
            Ravi de vous revoir !
          </motion.h1>
          <p className="text-[#6E6A7C] text-md font-medium italic">Saisissez votre code PIN</p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-5 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > i ? 'bg-[#00569E] border-[#00569E] scale-125' : 'bg-gray-100 border-gray-200'
              } ${error ? 'border-red-500 bg-red-500' : ''}`}
            />
          ))}
        </div>

        {error && (
            <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-center text-xs font-bold uppercase mb-8"
            >
                {error}
            </motion.p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto mb-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinInput(num.toString())}
              className="w-16 h-16 rounded-full bg-white text-xl font-bold text-[#6E6A7C] hover:bg-[#00569E] hover:text-white transition-all active:scale-90 flex items-center justify-center shadow-lg shadow-gray-200/50"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handlePinInput("0")}
            className="w-16 h-16 rounded-full bg-white text-xl font-bold text-[#6E6A7C] hover:bg-[#00569E] hover:text-white transition-all active:scale-90 flex items-center justify-center shadow-lg shadow-gray-200/50"
          >
            0
          </button>
          <button
            onClick={() => setPin(pin.slice(0, -1))}
            className="w-16 h-16 rounded-full bg-red-50 text-red-500 transition-all active:scale-90 flex items-center justify-center shadow-lg shadow-red-100/50"
          >
            <span className="text-xl">⌫</span>
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center mb-8">
            <div className="w-6 h-6 border-2 border-[#00569E]/30 border-t-[#00569E] rounded-full animate-spin" />
          </div>
        )}

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
        >
            <p className="text-[#6E6A7C] text-sm font-medium mb-4">Pas encore de compte ?</p>
            <button 
                onClick={() => router.push("/onboarding")}
                className="w-full text-white font-medium py-4 px-6 rounded-md transition-all hover:opacity-90 shadow-lg shadow-blue-900/10"
                style={{ backgroundColor: "#00569E" }}
            >
                Commencer gratuitement
            </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
