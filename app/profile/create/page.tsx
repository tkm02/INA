"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Step = "basic" | "demographics" | "goals";

export default function ProfileCreatePage() {
  const [step, setStep] = useState<Step>("basic");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    ageRange: "",
    religion: "",
    goals: [] as string[],
  });
  
  const router = useRouter();

  const goalOptions = [
    "Gérer mon anxiété au quotidien",
    "Comprendre mes émotions",
    "Développer ma résilience",
    "Partager mon histoire",
    "Témoigner pour aider d'autres",
    "Comprendre mes émotions",
  ];

  const handleNext = () => {
    if (step === "basic") {
      setStep("demographics");
    } else if (step === "demographics") {
      setStep("goals");
    } else {
      router.push("/home");
    }
  };

  const handleBack = () => {
    if (step === "demographics") setStep("basic");
    else if (step === "goals") setStep("demographics");
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-between p-6"
      style={{ backgroundColor: '#00569E' }} // Style inline pour le bleu
    >
      {/* Header */}
      <div className="w-full pt-4 max-w-md mb-8">
        {step !== "basic" && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleBack}
            className="text-white hover:opacity-80 mt-2.5 transition-opacity mb-6"
            whileTap={{ scale: 0.9 }}
          >
            <img
              src="/arrow-left.svg"
              alt="Retour"
              width="28"
              height="28"
            />
          </motion.button>
        )}
        
        {step === "basic" && <div className="h-10 mb-6" />}

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center"
        >
          <div className="w-25 h-25 bg-white rounded-full flex items-center justify-center">
            <span className="font-bold text-2xl" style={{ color: "#00569E" }}>
              INA
            </span>
          </div>
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-md mt-8 mb-12">
        <AnimatePresence mode="wait">
          {step === "basic" && (
            <motion.div
              key="basic"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-md font-semibold mb-3"
              >
                Nom & Prénoms
              </motion.h2>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                placeholder="Alexander"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-0 py-4 bg-transparent border-b-2 border-white text-white text-xl placeholder:text-white/60 focus:border-white focus:outline-none transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
              />

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <label className="block text-white text-md font-semibold mb-6">
                  Genre
                </label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-0 py-4 bg-transparent border-b-2 border-white text-white text-xl focus:border-white focus:outline-none appearance-none cursor-pointer transition-all duration-300"
                    style={{
                      color: formData.gender ? "white" : "rgba(255,255,255,0.6)",
                    }}
                  >
                    <option value="" disabled>
                      Sélectionner
                    </option>
                    <option value="Masculin" className="text-gray-900 bg-white">
                      Masculin
                    </option>
                    <option value="Féminin" className="text-gray-900 bg-white">
                      Féminin
                    </option>
                    <option value="Autre" className="text-gray-900 bg-white">
                      Autre
                    </option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "demographics" && (
            <motion.div
              key="demographics"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-md font-semibold mb-6"
              >
                Tranche d'âge
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {["12 - 17 ans", "35 - 54 ans", "18 - 34 ans", "55 - ∞"].map(
                  (range) => (
                    <motion.button
                      key={range}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * parseInt(range.charAt(0)) }}
                      onClick={() =>
                        setFormData({ ...formData, ageRange: range })
                      }
                      className="px-6 py-5 rounded-xl font-semibold text-white text-lg transition-all"
                      style={{
                        backgroundColor:
                          formData.ageRange === range
                            ? "#E86C00"
                            : "rgba(232, 108, 0, 0.85)",
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {range}
                    </motion.button>
                  )
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <h2 className="text-white text-md font-semibold mb-6">
                  Réligion
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {["Mosquée", "Église"].map((rel) => (
                    <motion.button
                      key={rel}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setFormData({ ...formData, religion: rel })}
                      className="px-6 py-5 rounded-xl font-semibold text-white text-lg transition-all"
                      style={{
                        backgroundColor:
                          formData.religion === rel
                            ? "#E86C00"
                            : "rgba(232, 108, 0, 0.85)",
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {rel}
                    </motion.button>
                  ))}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={() =>
                      setFormData({ ...formData, religion: "Autres" })
                    }
                    className="px-6 py-5 rounded-xl font-semibold text-white text-lg transition-all col-span-2"
                    style={{
                      backgroundColor:
                        formData.religion === "Autres"
                          ? "#E86C00"
                          : "rgba(232, 108, 0, 0.85)",
                      maxWidth: "50%",
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Autres
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "goals" && (
            <motion.div
              key="goals"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-md font-semibold mb-8"
              >
                Objectifs
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                {goalOptions.map((goal, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx + 0.3 }}
                    onClick={() => toggleGoal(goal)}
                    className="w-full px-6 py-5 rounded-xl font-medium text-white text-lg text-left transition-all"
                    style={{
                      backgroundColor: formData.goals.includes(goal)
                        ? "#E86C00"
                        : "rgba(232, 108, 0, 0.85)",
                    }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {goal}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md pb-6"
      >
        <motion.button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-md font-semibold text-white text-xl flex items-center justify-between transition-all"
          style={{
            backgroundColor: "#E86C00",
            boxShadow: "0 4px 12px rgba(232, 108, 0, 0.3)",
          }}
          whileHover={{ scale: 1.02, boxShadow: "0 6px 16px rgba(232, 108, 0, 0.4)" }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex-1 text-center">
            {step === "goals" ? "Commencer" : "Suivant"}
          </span>
          {step !== "goals" && (
            <motion.img 
              src="/arrow-return-white.svg" 
              alt="" 
              width="24" 
              height="24"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse" as const
              }}
            />
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}