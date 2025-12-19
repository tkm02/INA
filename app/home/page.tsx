"use client";

import BottomNavigation from "@/components/ui/BottomNav";
import Search from "@/components/ui/Search";
import { Storage } from "@/lib/storage";
import confetti from "canvas-confetti";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const moodOptions = [
  { label: "Très bien", emoji: "😄" },
  { label: "Bien", emoji: "😊" },
  { label: "Moyen", emoji: "😐" },
  { label: "Mal", emoji: "😔" },
  { label: "Très mal", emoji: "🖤" },
];

const monthlyMoodData = [
  { label: "Très bien", color: "bg-[#4CAF50]", count: 18, height: "h-36" },
  { label: "Bien", color: "bg-[#FFC107]", count: 7, height: "h-14" },
  { label: "Moyen", color: "bg-[#FF9800]", count: 3, height: "h-6" },
  { label: "Mal", color: "bg-[#F44336]", count: 1, height: "h-2" },
  { label: "Très mal", color: "bg-[#2196F3]", count: 1, height: "h-2" },
];

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  // Auto-hide toast after 6 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleMoodClick = (idx: number, mood: typeof moodOptions[0]) => {
    setSelectedMood(idx);
    
    Storage.addMood(idx, mood.label, mood.emoji);

    const messages = [
      "Super ! Continue comme ça ! 🎉",
      "C'est génial de se sentir bien ! 😊",
      "On est là pour toi 💙",
      "N'hésite pas à en parler 🤗",
      "Courage, tu n'es pas seul(e) 💪"
    ];
    setToastMessage(messages[idx]);

    if (idx === 0 || idx === 1) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playNote = (freq: number, startTime: number, duration: number) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          
          gain.gain.setValueAtTime(0.3, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.start(startTime);
          osc.stop(startTime + duration);
        };

        const now = audioContext.currentTime;
        playNote(523.25, now, 0.4);      
        playNote(659.25, now + 0.1, 0.4); 
        playNote(783.99, now + 0.2, 0.4); 
        playNote(1046.50, now + 0.3, 0.6); 
      } catch (e) {
        console.error("Audio error:", e);
      }


      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });

      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00CED1']
        });
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-15 h-15 bg-white p-2 border-3 border-primary-orange rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">P</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bonjour !</p>
              <p className="font-semibold text-gray-900 text-lg">Pseudo</p>
            </div>
          </div>
          <button className="p-1">
            <Image
              src={"/notification.svg"}
              width={25}
              height={25}
              alt="notification"
            />
          </button>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="w-full h-[170] p-4 rounded-md bg-primary-blue flex flex-col items-center">
          <h2 className="text-center text-white mb-6 text-sm font-medium">
            Comment vous vous sentez aujourd'hui ?
          </h2>
          <div className="flex justify-between items-center w-full">
            {moodOptions.map((mood, idx) => (
              <button
                key={idx}
                onClick={() => handleMoodClick(idx, mood)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  selectedMood === idx ? "scale-110" : ""
                }`}
              >
                <div className="w-15 h-15 bg-white rounded-full flex items-center justify-center mb-1">
                  <div className="text-3xl">{mood.emoji}</div>
                </div>
                <span className="text-xs text-[#FFD7E4] font-medium">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Expert */}
        <Search />

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push("/journal")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow">
              <img
                src="/journal-icon.svg"
                alt="Journal"
                width={24}
                height={24}
              />
            </div>
            <span className="text-xs text-primary-light font-medium">
              Journal
            </span>
          </button>
          <button
            onClick={() => router.push("/experts")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow">
              <img src="/experts.svg" alt="Experts" width={24} height={24} />
            </div>
            <span className="text-xs text-primary-light font-medium">
              Experts
            </span>
          </button>
          <button
            onClick={() => router.push("/appointments")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 shadow bg-white rounded-full flex items-center justify-center">
              <img src="/rdv.svg" alt="RDV" width={24} height={24} />
            </div>
            <span className="text-xs text-primary-light font-medium">RDV</span>
          </button>
          <button
            onClick={() => router.push("/resources")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 shadow bg-white rounded-full flex items-center justify-center">
              <img
                src="/ressource.svg"
                alt="Ressources"
                width={24}
                height={24}
              />
            </div>
            <span className="text-xs text-primary-light font-medium">
              Ressources
            </span>
          </button>
          <button
            onClick={() => router.push("/diagnostic")}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 shadow bg-white rounded-full flex items-center justify-center">
              <img
                src="/dianostic.svg"
                alt="Diagnostic"
                width={24}
                height={24}
              />
            </div>
            <span className="text-xs text-primary-light font-medium">
              Diagnostic
            </span>
          </button>
        </div>

        {/* Diagnostic Section */}
        <div className="mb-8">
          <div className="bg-blue-50 border-l-4 border-[#00569E] p-4 rounded-r-lg">
            <p className="text-sm text-gray-700 mb-1">
              Besoin d'un coup de pouce ou simplement d'échanger ?
            </p>
            <p className="text-sm font-medium text-gray-800 mb-3">
              <strong>
                INA est là pour vous écouter, vous guider et répondre à vos
                questions, à votre rythme.
              </strong>
            </p>
            <p className="text-sm font-medium text-gray-800 mb-4">
              <strong>
                N'hésitez pas à engager la conversation, c'est simple et sans
                engagement.
              </strong>
            </p>
            <button className="flex items-center gap-2 text-[#00569E] font-medium text-sm">
              <div className="w-6 h-6 bg-[#00569E] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              Démarrer une discussion avec <strong>INA</strong>
            </button>
          </div>
        </div>

        {/* Monthly Mood Graph */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 text-lg mb-4">
            Mon Bilan du Mois
          </h3>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            {/* Graph */}
            <div className="flex items-end justify-between h-48 mb-8 px-2">
              {monthlyMoodData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 flex-1"
                >
                  <div className="flex flex-col items-center justify-end h-40 w-full">
                    <span className="text-[10px] font-bold text-gray-500 mb-1">{data.count}j</span>
                    <div
                      className={`${data.color} ${data.height} w-full max-w-10 rounded-t-lg shadow-sm transition-all duration-500`}
                    ></div>
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase text-center leading-tight h-6 flex items-center">
                    {data.label.replace(" ", "\n")}
                  </span>
                </div>
              ))}
            </div>

            {/* Color Legend */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
                  <span className="text-[10px] text-gray-600 uppercase">Très bien</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FFC107]" />
                  <span className="text-[10px] text-gray-600 uppercase">Bien</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FF9800]" />
                  <span className="text-[10px] text-gray-600 uppercase">Moyen</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#F44336]" />
                  <span className="text-[10px] text-gray-600 uppercase">Mal</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#2196F3]" />
                  <span className="text-[10px] text-gray-600 uppercase">Très mal</span>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="text-[#00569E] text-sm font-medium">
                  Accueil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up px-4 w-full max-w-md">
          <div className="bg-linear-to-r from-[#E86C00] to-[#FF8C42] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl flex items-center justify-center gap-2 sm:gap-3 border-2 border-white">
            <span className="text-xl sm:text-2xl">✨</span>
            <span className="font-medium text-xs sm:text-sm text-center">{toastMessage}</span>
            <span className="text-xl sm:text-2xl">✨</span>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
function fire(arg0: number, arg1: { spread: number; startVelocity: number; }) {
  throw new Error("Function not implemented.");
}

