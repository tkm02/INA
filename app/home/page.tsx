"use client";

import BottomNavigation from "@/components/ui/BottomNav";
import Search from "@/components/ui/Search";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const moodOptions = [
  { label: "Très bien", emoji: "😄" },
  { label: "Bien", emoji: "😊" },
  { label: "Moyen", emoji: "😐" },
  { label: "Mal", emoji: "😔" },
  { label: "Très mal", emoji: "🖤" },
];

const dailyMoodData = [
  { day: "Lun", color: "bg-[#4CAF50]", height: "h-16" },
  { day: "Mar", color: "bg-[#FFC107]", height: "h-12" },
  { day: "Mer", color: "bg-[#FF9800]", height: "h-20" },
  { day: "Jeu", color: "bg-[#F44336]", height: "h-8" },
  { day: "Ven", color: "bg-[#4CAF50]", height: "h-14" },
  { day: "Sam", color: "bg-[#2196F3]", height: "h-10" },
  { day: "Dim", color: "bg-[#FFC107]", height: "h-18" },
];

export default function HomePage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const router = useRouter();

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
                onClick={() => setSelectedMood(idx)}
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

        {/* Daily Mood Graph */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 text-lg mb-4">
            Mon Bilan Journalier
          </h3>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            {/* Graph */}
            <div className="flex items-end justify-between h-48 mb-8">
              {dailyMoodData.map((data, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 flex-1"
                >
                  <div className="flex flex-col items-center justify-end h-40">
                    <div
                      className={`${data.color} ${data.height} w-8 rounded-t-lg`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>

            {/* Color Legend */}
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
                  <span className="text-xs text-gray-600">VERT</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FFC107]" />
                  <span className="text-xs text-gray-600">JAUNE</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#FF9800]" />
                  <span className="text-xs text-gray-600">ORANGE</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#F44336]" />
                  <span className="text-xs text-gray-600">ROUGE</span>
                </div>
              </div>
              <button className="text-[#00569E] text-sm font-medium">
                Acceuil
              </button>
            </div>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
}
