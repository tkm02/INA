"use client";

import { Storage } from "@/lib/storage";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Step = "basic" | "demographics" | "goals" | "pin";

export default function ProfileCreatePage() {
  const [step, setStep] = useState<Step>("basic");
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    ageRange: "",
    religion: "",
    goals: [] as string[],
    pseudo: "",
  });
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const goalOptions = [
    "Gérer mon anxiété au quotidien",
    "Comprendre mes émotions",
    "Développer ma résilience",
    "Partager mon histoire",
    "Témoigner pour aider d'autres",
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (step === "basic") {
      if (!formData.name.trim()) newErrors.name = "Le nom est requis";
      if (!formData.pseudo.trim()) newErrors.pseudo = "Le pseudo est requis";
      if (!formData.gender) newErrors.gender = "Veuillez sélectionner votre genre";
    } else if (step === "demographics") {
      if (!formData.ageRange) newErrors.ageRange = "La tranche d'âge est requise";
      if (!formData.religion) newErrors.religion = "La religion est requise";
    } else if (step === "goals") {
      if (formData.goals.length === 0) newErrors.goals = "Veuillez sélectionner au moins un objectif";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    if (step === "basic") {
      setStep("demographics");
    } else if (step === "demographics") {
      setStep("goals");
    } else if (step === "goals") {
      setStep("pin");
    }
  };

  const handleBack = () => {
    if (step === "demographics") setStep("basic");
    else if (step === "goals") setStep("demographics");
    else if (step === "pin") setStep("goals");
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        handleFinalize(newPin);
      }
    }
  };

  const handleFinalize = (finalPin: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const data = Storage.getData();
      data.profile = {
        name: formData.pseudo, // Use the user's fixed pseudo primarily
        email: "", 
        pin: finalPin,
        joinedAt: new Date().toISOString(),
      };
      // Store additional info for personalized experience
      (data as any).onboarding = {
        fullName: formData.name,
        gender: formData.gender,
        ageRange: formData.ageRange,
        religion: formData.religion,
        goals: formData.goals
      };
      Storage.saveData(data);
      setIsLoading(false);
      router.push("/home");
    }, 1500);
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
    if (errors.goals) setErrors(prev => ({ ...prev, goals: "" }));
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
      style={{ backgroundColor: '#00569E' }}
    >
      <div className="w-full pt-4 max-w-md mb-8">
        {step !== "basic" && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="text-white hover:opacity-80 mt-2.5 transition-opacity mb-6"
            whileTap={{ scale: 0.9 }}
          >
            <img src="/arrow-left.svg" alt="Retour" width="28" height="28" />
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
            <span className="font-bold text-2xl" style={{ color: "#00569E" }}>INA</span>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-md mt-8 mb-12">
        <AnimatePresence mode="wait">
          {step === "basic" && (
            <motion.div key="basic" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
              <div>
                <h2 className="text-white text-md font-semibold mb-3">Nom & Prénoms</h2>
                <input
                  placeholder="Alexander"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                  }}
                  className="w-full px-0 py-4 bg-transparent border-b-2 border-white text-white text-xl placeholder:text-white/60 focus:border-white focus:outline-none transition-all duration-300"
                />
                {errors.name && <p className="text-red-300 text-xs mt-2 font-bold uppercase">{errors.name}</p>}
              </div>

              <div>
                <h2 className="text-white text-md font-semibold mb-3">Pseudo</h2>
                <input
                  placeholder="MonPseudoFixe"
                  value={formData.pseudo}
                  onChange={(e) => {
                    setFormData({ ...formData, pseudo: e.target.value });
                    if (errors.pseudo) setErrors(prev => ({ ...prev, pseudo: "" }));
                  }}
                  className="w-full px-0 py-4 bg-transparent border-b-2 border-white text-white text-xl placeholder:text-white/60 focus:border-white focus:outline-none transition-all duration-300"
                />
                {errors.pseudo && <p className="text-red-300 text-xs mt-2 font-bold uppercase">{errors.pseudo}</p>}
                <p className="text-white/60 text-[10px] mt-2 italic">Ce pseudo sera utilisé dans vos échanges pour garantir votre anonymat.</p>
              </div>

              <div className="mt-4">
                <label className="block text-white text-md font-semibold mb-6">Genre</label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData({ ...formData, gender: e.target.value });
                      if (errors.gender) setErrors(prev => ({ ...prev, gender: "" }));
                    }}
                    className="w-full px-0 py-4 bg-transparent border-b-2 border-white text-white text-xl focus:border-white focus:outline-none appearance-none cursor-pointer transition-all duration-300"
                    style={{ color: formData.gender ? "white" : "rgba(255,255,255,0.6)" }}
                  >
                    <option value="" disabled>Sélectionner</option>
                    <option value="Masculin" className="text-gray-900 bg-white">Masculin</option>
                    <option value="Féminin" className="text-gray-900 bg-white">Féminin</option>
                  </select>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                {errors.gender && <p className="text-red-300 text-xs mt-2 font-bold uppercase">{errors.gender}</p>}
              </div>
            </motion.div>
          )}

          {step === "demographics" && (
            <motion.div key="demographics" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
              <div>
                <h2 className="text-white text-md font-semibold mb-6">Tranche d'âge</h2>
                <div className="grid grid-cols-2 gap-4">
                  {["12 - 17 ans", "35 - 54 ans", "18 - 34 ans", "55 - ∞"].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setFormData({ ...formData, ageRange: range });
                        if (errors.ageRange) setErrors(prev => ({ ...prev, ageRange: "" }));
                      }}
                      className="px-6 py-5 rounded-xl font-semibold text-white text-lg transition-all"
                      style={{ backgroundColor: formData.ageRange === range ? "#E86C00" : "rgba(232, 108, 0, 0.85)" }}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                {errors.ageRange && <p className="text-red-300 text-xs mt-4 font-bold uppercase">{errors.ageRange}</p>}
              </div>

              <div className="mt-8">
                <h2 className="text-white text-md font-semibold mb-6">Réligion</h2>
                <div className="grid grid-cols-2 gap-4">
                  {["Christianisme", "Islam", "Bouddhisme", "Hindouisme", "Animisme", "Athée", "Autres"].map((rel) => (
                    <button
                      key={rel}
                      onClick={() => {
                        setFormData({ ...formData, religion: rel });
                        if (errors.religion) setErrors(prev => ({ ...prev, religion: "" }));
                      }}
                      className="px-6 py-5 rounded-xl font-semibold text-white text-lg transition-all"
                      style={{ 
                        backgroundColor: formData.religion === rel ? "#E86C00" : "rgba(232, 108, 0, 0.85)",
                        fontSize: rel.length > 10 ? '0.9rem' : '1.125rem'
                      }}
                    >
                      {rel}
                    </button>
                  ))}
                </div>
                {errors.religion && <p className="text-red-300 text-xs mt-4 font-bold uppercase">{errors.religion}</p>}
              </div>
            </motion.div>
          )}

          {step === "goals" && (
            <motion.div key="goals" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
              <h2 className="text-white text-md font-semibold mb-8">Objectifs</h2>
              <div className="space-y-4">
                {goalOptions.map((goal, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleGoal(goal)}
                    className="w-full px-6 py-5 rounded-xl font-medium text-white text-lg text-left transition-all"
                    style={{ backgroundColor: formData.goals.includes(goal) ? "#E86C00" : "rgba(232, 108, 0, 0.85)" }}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              {errors.goals && <p className="text-red-300 text-xs mt-4 font-bold uppercase">{errors.goals}</p>}
            </motion.div>
          )}

          {step === "pin" && (
            <motion.div key="pin" variants={stepVariants} initial="initial" animate="animate" exit="exit" className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                 <img src="/lock.svg" alt="Lock" className="w-8 h-8 invert" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-2">Code Secret</h2>
              <p className="text-white/60 mb-10 italic">Définissez vos 4 chiffres.</p>

              <div className="flex justify-center gap-4 mb-12">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    pin.length > i ? 'bg-white border-white scale-125' : 'bg-transparent border-white/30'
                  }`} />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinInput(num.toString())}
                    className="w-16 h-16 rounded-full bg-white/10 text-xl font-bold text-white hover:bg-white/20 transition-all active:scale-90 flex items-center justify-center border border-white/5"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPin(pin.slice(0, -1))}
                  className="w-16 h-16 rounded-full bg-red-500/20 text-white transition-all active:scale-90 flex items-center justify-center"
                >
                  ⌫
                </button>
              </div>

              {isLoading && (
                  <div className="mt-8 flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <p className="text-xs text-white/60">Finalisation...</p>
                  </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md pb-6">
        {step !== "pin" && (
          <button
            onClick={handleNext}
            className="w-full py-4 px-6 rounded-md font-semibold text-white text-xl flex items-center justify-between transition-all"
            style={{ backgroundColor: "#E86C00", boxShadow: "0 4px 12px rgba(232, 108, 0, 0.3)" }}
          >
            <span className="flex-1 text-center">{step === "goals" ? "Commencer" : "Suivant"}</span>
            <img src="/arrow-return-white.svg" alt="" width="24" height="24" className="ml-2" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}