"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const slides = [
  {
    title: "INA",
    description: "I'm Not Alone - je ne suis pas seul(e)",
    image: "/splash.svg",
    bullets: [],
  },
  {
    title: "Anonymat garanti",
    description: "",
    image: "/lock.svg",
    bullets: [
      "Vos données sont protégées et confidentielles.",
      "Votre anonymat est garanti.",
      "Vous pouvez vous exprimer librement.",
    ],
  },
  {
    title: "IA + experts psychologue",
    description:
      "Une oreille pour écouter, des professionnels pour vous accompagner",
    image: "/healthy.svg",
    bullets: [],
  },
  {
    title: "Quand ça ne va vraiment pas",
    description:
      "L'application peut t'orienter rapidement vers un expert issu d'un centre hospitalier reconnu.",
    image: "/good.svg",
    bullets: [],
  },
];

// Variantes d'animation
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      duration: 0.5,
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
    }
  }),
};

const bulletVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1 + 0.3,
      duration: 0.4,
    }
  })
};

export default function OnboardingPWA() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const slide = slides[currentSlide];
  const router = useRouter(); 

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/profile/create");
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-linear-to-b from-yellow-50 via-white to-green-50 flex flex-col items-center justify-between p-6 relative overflow-hidden"
      style={{ fontFamily: '"Lexend Deca", sans-serif' }}
    >
      <motion.div 
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse" as const
        }}
        className="absolute top-24 right-12 w-3 h-3 rounded-full bg-blue-400 opacity-60" 
      />
      <motion.div 
        animate={{ 
          y: [0, 15, 0],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse" as const,
          delay: 0.5
        }}
        className="absolute top-36 right-32 w-2 h-2 rounded-full bg-purple-300 opacity-60" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse" as const
        }}
        className="absolute bottom-80 right-4 w-2 h-2 rounded-full bg-green-400 opacity-60" 
      />
      <motion.div 
        animate={{ 
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-72 right-32 w-2.5 h-2.5 rounded-full bg-yellow-400 opacity-60" 
      />
      <motion.div 
        animate={{ 
          x: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse" as const
        }}
        className="absolute bottom-96 left-16 w-2 h-2 rounded-full bg-pink-300 opacity-60" 
      />
      <motion.div 
        animate={{ 
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse" as const
        }}
        className="absolute bottom-88 left-32 w-2 h-2 rounded-full bg-blue-300 opacity-60" 
      />
      <motion.div 
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse" as const,
          delay: 1
        }}
        className="absolute bottom-80 left-6 w-2 h-2 rounded-full bg-orange-400 opacity-60" 
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex-1 flex flex-col items-center justify-center text-center max-w-md w-full mt-8"
        >
          {currentSlide > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={handlePrev}
              className="absolute top-8 left-6 hover:opacity-80 transition-opacity"
              whileTap={{ scale: 0.9 }}
            >
              <img src="/arrow-return.svg" alt="Retour" width="28" height="28" />
            </motion.button>
          )}

          <motion.div 
            className="mb-8 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring" as const, 
              stiffness: 200, 
              damping: 15,
              delay: 0.1 
            }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              width="200"
              height="200"
              className="object-contain"
            />
          </motion.div>

          <div className="mt-4">
            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[24px] font-bold text- mb-4 tracking-tight"
              style={{ color: "#E86C00", fontFamily: "Poppins, sans-serif" }}
            >
              {slide.title}
            </motion.h1>

            {slide.description && (
              <motion.p
                key={`desc-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[#6E6A7C] text-base leading-relaxed px-4"
              >
                {slide.description}
              </motion.p>
            )}

            {slide.bullets.length > 0 && (
              <motion.ul 
                initial="initial"
                animate="animate"
                className="text-left space-y-1 mt-8 px-6"
              >
                {slide.bullets.map((bullet, idx) => (
                  <motion.li 
                    key={idx} 
                    custom={idx}
                    variants={bulletVariants}
                    className="flex items-start gap-1.5"
                  >
                    <span
                      className="text-xl font-bold"
                      style={{ color: "#6E6A7C" }}
                    >
                      •
                    </span>
                    <span className="text-[#6E6A7C] text-sm leading-relaxed">
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md mb-8"
      >
          <motion.button
            onClick={handleNext}
            className="w-full text-white font-medium py-4 px-6 rounded-md flex items-center justify-center transition-colors hover:opacity-90 relative"
            style={{ backgroundColor: "#00569E" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-lg">
              {currentSlide === slides.length - 1 ? "Continuer" : "Suivant"}
            </span>
            {currentSlide < slides.length - 1 && (
              <motion.img
                src="/arrow-return-white.svg"
                alt=""
                width="20"
                height="20"
                className="absolute right-6"
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse" as const
                }}
              />
            )}
          </motion.button>

        {/* Indicateurs de progression */}
        <motion.div 
          className="flex justify-center gap-2 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 rounded-full ${index === currentSlide ? 'w-8' : 'w-2'}`}
              style={{
                backgroundColor: index === currentSlide ? "#00569E" : "#D1D5DB",
              }}
              initial={{ width: index === currentSlide ? "2rem" : "0.5rem" }}
              animate={{ width: index === currentSlide ? "2rem" : "0.5rem" }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}