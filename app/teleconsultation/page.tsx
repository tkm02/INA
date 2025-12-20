"use client";

import BottomNavigation from "@/components/ui/BottomNav";
import { Storage } from "@/lib/storage";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const expertImages: Record<string, string> = {
  "Dr. Koffi Jean-Jacques": "/experts/koffi.png",
  "Dr. Konan Affoué": "/experts/konan.png",
  "Dr. Kouassi Yao": "/experts/kouassi.png",
  "Dr. Diallo Aminata": "/experts/diallo.png",
};

export default function TeleconsultationPage() {
  const { theme } = useTheme();
  const [userData, setUserData] = useState<any>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const data = Storage.getData();
    setUserData(data);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInCall) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isInCall]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const upcomingAppt = userData?.appointments?.find((a: any) => a.status === 'confirmed') || userData?.appointments?.[0];

  return (
    <div className={`min-h-screen pb-20 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
    }`}>
      <div className={`p-6 flex items-center gap-4 border-b ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      }`}>
        <button onClick={() => router.push("/home")} className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
             <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} className={theme === 'dark' ? 'invert' : ''} />
        </button>
        <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Téléconsultation</h1>
      </div>

      <div className="p-4">
        {/* Prochain RDV Section - Align with Home Style */}
        <div className="mb-6">
            <h3 className={`font-semibold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Votre séance vidéo</h3>
            <div className={`rounded-2xl border p-5 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aujourd'hui</span>
                    <span className={`px-3 py-1 ${upcomingAppt?.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'} rounded-full text-[10px] font-bold`}>
                        {upcomingAppt?.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full border-2 border-primary-blue/10 overflow-hidden">
                        <img 
                            src={upcomingAppt ? (expertImages[upcomingAppt.expertName] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${upcomingAppt.expertName}`) : '/experts/koffi.png'} 
                            alt="Doctor" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{upcomingAppt?.expertName || "Prêt pour votre séance"}</p>
                        <p className="text-xs text-primary-blue font-medium">
                            {upcomingAppt ? `${upcomingAppt.date} • ${upcomingAppt.time}` : "Disponible maintenant"}
                        </p>
                    </div>
                </div>

                <button 
                    className={`w-full py-4 rounded-xl font-bold shadow-sm transition-all active:scale-[0.98] ${
                      upcomingAppt 
                        ? 'bg-primary-orange text-white' 
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!upcomingAppt}
                    onClick={() => setIsInCall(true)}
                >
                    Rejoindre la salle d'attente
                </button>
            </div>
        </div>

        {/* Comment ça marche - Section style from Home */}
        <div>
            <h3 className={`font-semibold text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Comment ça marche ?</h3>
            <div className={`rounded-2xl border p-5 space-y-4 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                {[
                  { num: '1', text: "Prenez rendez-vous avec un expert disponible." },
                  { num: '2', text: "Connectez-vous à l'heure prévue via l'application." },
                  { num: '3', text: "Échangez en toute confidentialité dans un espace sécurisé." }
                ].map((step) => (
                  <div key={step.num} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-primary-blue flex items-center justify-center font-bold shrink-0">{step.num}</div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{step.text}</p>
                  </div>
                ))}
            </div>
        </div>
      </div>

      {isInCall && (
        <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col">
            <div className="flex-1 relative flex items-center justify-center p-6">
                <div className="w-full max-w-sm aspect-[3/4] rounded-3xl bg-gray-800 flex items-center justify-center border border-gray-700 relative overflow-hidden">
                    <div className="text-center p-8">
                        <div className="w-40 h-40 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden border-4 border-primary-blue shadow-lg">
                             <img 
                                src={upcomingAppt ? (expertImages[upcomingAppt.expertName] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${upcomingAppt.expertName}`) : '/experts/koffi.png'} 
                                alt="Doctor" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-white font-bold text-2xl mb-1">{upcomingAppt?.expertName}</h3>
                        <div className="flex items-center justify-center gap-2">
                             <div className="w-2 h-2 bg-red-500 rounded-full" />
                             <p className="text-red-500 font-medium text-sm">Appel vocal en cours</p>
                        </div>
                    </div>
                </div>

                {/* Simplified INA Assistant Icon Overlay */}
                <div className="absolute top-10 left-10 w-16 h-16 bg-white shadow-lg rounded-2xl flex items-center justify-center z-20">
                    <div className="text-primary-blue flex flex-col items-center">
                        <div className="w-8 h-8 bg-primary-blue rounded-full mb-0.5 flex items-center justify-center">
                            <span className="text-white font-bold text-[10px]">INA</span>
                        </div>
                        <span className="text-[8px] font-bold uppercase">Assistant</span>
                    </div>
                </div>
            </div>

            <div className="bg-black/90 px-8 py-10 flex flex-col gap-6">
                <div className="flex items-center justify-between text-white px-2">
                    <div className="flex flex-col">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Durée</p>
                        <p className="text-3xl font-mono font-bold text-white">{formatTime(callDuration)}</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                            <span className="text-xl">🎤</span>
                        </button>
                        <button className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                            <span className="text-xl">🔊</span>
                        </button>
                    </div>
                </div>

                <button 
                    className="w-full py-5 rounded-2xl bg-red-500 text-white font-bold text-lg shadow-lg active:scale-[0.98]"
                    onClick={() => setIsInCall(false)}
                >
                    Terminer l'appel
                </button>
            </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}
