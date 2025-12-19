'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

type Step = 'basic' | 'demographics' | 'goals';

export default function ProfileCreatePage() {
  const [step, setStep] = useState<Step>('basic');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    ageRange: '',
    religion: '',
    goals: [] as string[],
  });

  const goalOptions = [
    'Gérer mon anxiété au quotidien',
    'Comprendre mes émotions',
    'Développer ma résilience',
    'Partager mon histoire',
    "Témoigner pour aider d'autres",
    'Comprendre mes émotions',
  ];

  const handleNext = () => {
    if (step === 'basic') setStep('demographics');
    else if (step === 'demographics') setStep('goals');
    else {
      // Save profile and redirect to home
      window.location.href = '/home';
    }
  };

  const handleBack = () => {
    if (step === 'demographics') setStep('basic');
    else if (step === 'goals') setStep('demographics');
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  return (
    <div className="min-h-screen bg-[#00569E] flex flex-col items-center justify-between p-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between pt-4">
        {step !== 'basic' && (
          <button onClick={handleBack} className="text-white">
            <ArrowLeft size={24} />
          </button>
        )}
        <div className="flex-1" />
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <span className="text-[#00569E] font-bold text-xl">INA</span>
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col justify-center w-full max-w-md"
      >
        {step === 'basic' && (
          <div className="space-y-6">
            <h2 className="text-white text-xl font-semibold mb-6">Nom & Prénoms</h2>
            <Input
              placeholder="Alexander"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-white placeholder:text-white/60 border-white/50"
            />

            <div>
              <label className="block text-white text-sm font-medium mb-4">Genre</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 bg-transparent border-b-2 border-white/50 text-white focus:border-white focus:outline-none"
              >
                <option value="" className="text-gray-900">Sélectionner</option>
                <option value="Masculin" className="text-gray-900">Masculin</option>
                <option value="Féminin" className="text-gray-900">Féminin</option>
                <option value="Autre" className="text-gray-900">Autre</option>
              </select>
            </div>
          </div>
        )}

        {step === 'demographics' && (
          <div className="space-y-6">
            <h2 className="text-white text-xl font-semibold mb-6">Tranche d'âge</h2>
            <div className="grid grid-cols-2 gap-3">
              {['12 - 17 ans', '35 - 54 ans', '18 - 34 ans', '55 - ...'].map((range) => (
                <button
                  key={range}
                  onClick={() => setFormData({ ...formData, ageRange: range })}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    formData.ageRange === range
                      ? 'bg-[#E86C00] text-white'
                      : 'bg-[#E86C00]/80 text-white hover:bg-[#E86C00]'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-white text-xl font-semibold mb-4">Religion</h2>
              <div className="flex gap-3">
                {['Mosquée', 'Église', 'Autres'].map((rel) => (
                  <button
                    key={rel}
                    onClick={() => setFormData({ ...formData, religion: rel })}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      formData.religion === rel
                        ? 'bg-[#E86C00] text-white'
                        : 'bg-[#E86C00]/80 text-white hover:bg-[#E86C00]'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'goals' && (
          <div className="space-y-4">
            <h2 className="text-white text-xl font-semibold mb-6">Objectifs</h2>
            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`w-full px-6 py-4 rounded-lg font-medium text-left transition-colors ${
                    formData.goals.includes(goal)
                      ? 'bg-[#E86C00] text-white'
                      : 'bg-[#E86C00]/80 text-white hover:bg-[#E86C00]'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer Button */}
      <div className="w-full max-w-md">
        <Button
          variant="primary-orange"
          fullWidth
          onClick={handleNext}
          icon={<ArrowRight size={20} />}
        >
          {step === 'goals' ? 'Terminer' : 'Suivant'}
        </Button>
      </div>
    </div>
  );
}
