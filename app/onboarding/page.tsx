'use client';

import { Button } from '@/components/ui/Button';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Smile, Stethoscope } from 'lucide-react';
import React, { useState } from 'react';

interface OnboardingSlide {
  title: string;
  description: string;
  icon: React.ReactNode;
  bullets?: string[];
}

const slides: OnboardingSlide[] = [
  {
    title: 'INA',
    description: "I'm Not Alone - Vous n'êtes pas seul(e)",
    icon: <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-green-100 rounded-3xl flex items-center justify-center">
      <div className="text-6xl">🧘</div>
    </div>,
  },
  {
    title: 'Anonymat garanti',
    description: '',
    icon: <Lock size={80} className="text-[#00569E]" />,
    bullets: [
      'Vos données sont protégées et confidentielles.',
      'Votre anonymat est assuré.',
      'Vous pouvez vous exprimer librement.',
    ],
  },
  {
    title: 'IA + experts psychologue',
    description: 'Une oreille pour écouter, des professionnels pour vous accompagner',
    icon: <Stethoscope size={80} className="text-[#E86C00]" />,
  },
  {
    title: "Quand ça ne va vraiment pas",
    description: "L'application pour t'orienter rapidement vers un expert issu d'un centre hospitalier reconnu.",
    icon: <Smile size={80} className="text-[#E86C00]" />,
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      window.location.href = '/profile/create';
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50 flex flex-col items-center justify-between p-6 relative">
      {/* Header */}
      <div className="w-full flex justify-between items-center pt-4">
        <div className="text-sm text-gray-400">{currentSlide === 0 ? "let's start" : `onboarding_${currentSlide}`}</div>
        <div className="flex gap-1">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentSlide ? 'bg-[#E86C00]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col items-center justify-center text-center max-w-md"
        >
          <div className="mb-8">
            {slide.icon}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {slide.title}
          </h1>

          {slide.description && (
            <p className="text-gray-600 mb-6">
              {slide.description}
            </p>
          )}

          {slide.bullets && (
            <ul className="text-left space-y-3 mb-6">
              {slide.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#E86C00] mt-1">•</span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="w-full max-w-md">
        <Button
          variant="primary-blue"
          fullWidth
          onClick={handleNext}
          icon={<ArrowRight size={20} />}
        >
          Suivant
        </Button>

        {currentSlide > 0 && (
          <button
            onClick={handlePrev}
            className="w-full mt-4 text-[#00569E] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
        )}
      </div>

      {/* Decorative dots */}
      <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-[#E86C00] opacity-50" />
      <div className="absolute top-40 right-16 w-2 h-2 rounded-full bg-[#00569E] opacity-50" />
      <div className="absolute bottom-40 left-20 w-2 h-2 rounded-full bg-[#E86C00] opacity-50" />
    </div>
  );
}
