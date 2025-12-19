'use client';

import { BottomNav } from '@/components/ui/BottomNav';
import { MessageCircle, Search, Settings, User } from 'lucide-react';
import { useState } from 'react';

const moodEmojis = [
  { emoji: '😔', label: 'Pas bien', color: '#E86C00' },
  { emoji: '😊', label: 'Bien', color: '#4CAF50' },
  { emoji: '😐', label: 'Moyen', color: '#FFC107' },
  { emoji: '😄', label: 'Mal', color: '#2196F3' },
  { emoji: '🖤', label: 'Très mal', color: '#000000' },
];

const moodData = [
  { day: 'Lun', value: 3, color: '#2196F3' },
  { day: 'Mar', value: 2, color: '#4CAF50' },
  { day: 'Mer', value: 1, color: '#FFC107' },
  { day: 'Jeu', value: 4, color: '#2196F3' },
  { day: 'Ven', value: 5, color: '#E86C00' },
  { day: 'Sam', value: 3, color: '#2196F3' },
  { day: 'Dim', value: 2, color: '#4CAF50' },
];

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const maxValue = Math.max(...moodData.map(d => d.value));

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Bonjour !</p>
              <p className="font-semibold text-gray-900">Pseudo</p>
            </div>
          </div>
          <button className="p-2">
            <Settings size={24} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="px-6 py-6">
        <p className="text-center text-gray-700 mb-4">Comment vous vous sentez aujourd'hui ?</p>
        <div className="flex justify-around items-center mb-6">
          {moodEmojis.map((mood, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMood(idx)}
              className={`flex flex-col items-center gap-1 transition-transform ${
                selectedMood === idx ? 'scale-110' : ''
              }`}
            >
              <div className="text-3xl">{mood.emoji}</div>
              <span className="text-xs text-gray-600">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Search Expert */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un expert"
            className="w-full pl-12 pr-4 py-3 border-2 border-[#00569E] rounded-full focus:outline-none focus:border-[#00569E]"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 grid grid-cols-4 gap-4 mb-8">
        <button className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
          <span className="text-xs text-gray-700">Journal</span>
        </button>
        <button className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <span className="text-xs text-gray-700">Experts</span>
        </button>
        <button className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <span className="text-xs text-gray-700">RDV</span>
        </button>
        <button className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <span className="text-xs text-gray-700">Ressources</span>
        </button>
      </div>

      {/* Diagnostic Section */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xl">🩺</span>
          </div>
          <span className="font-semibold text-gray-900">Diagnostic</span>
        </div>
        <div className="bg-blue-50 border-l-4 border-[#00569E] p-4 rounded-r-lg">
          <p className="text-sm text-gray-700 mb-2">
            Besoin d'un coup de pouce ou simplement d'échanger ?
          </p>
          <p className="text-sm text-gray-700 mb-3">
            INA est là pour vous écouter, vous guider et répondre à vos questions. À votre rythme.
          </p>
          <button className="text-[#00569E] text-sm font-medium flex items-center gap-1">
            <MessageCircle size={16} />
            Démarrer une discussion avec INA
          </button>
        </div>
      </div>

      {/* Mood Graph */}
      <div className="px-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Mon Bilan Journalier</h3>
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-end justify-between h-40 gap-2">
            {moodData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${(data.value / maxValue) * 100}%`,
                      backgroundColor: data.color,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-600">{data.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="text-[#00569E] text-sm font-medium">Famille</button>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 justify-center">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#2196F3]" />
            <span className="text-xs text-gray-600">BLEU</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
            <span className="text-xs text-gray-600">VERT</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#FFC107]" />
            <span className="text-xs text-gray-600">JAUNE</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#E86C00]" />
            <span className="text-xs text-gray-600">ORANGE</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-[#000000]" />
            <span className="text-xs text-gray-600">ROUGE</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
