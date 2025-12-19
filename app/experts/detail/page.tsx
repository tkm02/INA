"use client";

import { Storage } from "@/lib/storage";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const experts = [
  {
    id: 1,
    name: "Dr. Koffi Jean-Jacques",
    title: "Psychologue",
    date: "Dimanche, 12 Juin",
    time: "11:00 – 12:00",
    rating: 4.8,
    reviews: 127,
    location: "Cocody, Abidjan",
    available: true,
    image: "/experts/koffi.png",
    coordinates: "5.3484, -3.9817",
    specialties: [
      "Dépression & anxiété",
      "Burn-out professionnel",
      "Thérapie adolescents",
    ],
    consultations: [
      { type: "Vidéo", duration: "45 min", price: "10.000 XOF" },
      { type: "Forfait 4 séances", duration: "", price: "50.000 XOF" },
      { type: "Délai RDV", duration: "48h en moyenne", price: "" },
    ],
    availability: ["Lun-Ven : 9h-19h", "Sam : 9h-13h"],
    languages: ["Français", "Anglais", "Dioula"],
    detailedLocation: "Cocody, Abidjan, Côte d'Ivoire",
  },
  {
    id: 2,
    name: "Dr. Konan Affoué",
    title: "Psychothérapeute",
    date: "Dimanche, 12 Juin",
    time: "11:00 – 12:00",
    rating: 4.9,
    reviews: 89,
    location: "Riviera, Abidjan",
    available: true,
    image: "/experts/konan.png",
    coordinates: "5.3627, -3.9409",
    specialties: [
      "Troubles anxieux",
      "Gestion du stress",
      "Thérapie de couple",
    ],
    consultations: [
      { type: "Vidéo", duration: "50 min", price: "12.000 XOF" },
      { type: "Forfait 6 séances", duration: "", price: "65.000 XOF" },
      { type: "Délai RDV", duration: "24h en moyenne", price: "" },
    ],
    availability: ["Lun-Mer-Ven : 10h-18h", "Jeu : 14h-20h"],
    languages: ["Français", "Anglais"],
    detailedLocation: "Riviera Palmeraie, Abidjan, Côte d'Ivoire",
  },
  {
    id: 3,
    name: "Dr. Kouassi Yao",
    title: "Psychanalyste",
    date: "Dimanche, 12 Juin",
    time: "11:00 – 12:00",
    rating: 4.7,
    reviews: 156,
    location: "Treichville, Abidjan",
    available: false,
    image: "/experts/kouassi.png",
    coordinates: "5.3015, -4.0041",
    specialties: [
      "Psychanalyse freudienne",
      "Troubles de la personnalité",
      "Analyse des rêves",
    ],
    consultations: [
      { type: "Vidéo", duration: "60 min", price: "15.000 XOF" },
      { type: "Forfait 8 séances", duration: "", price: "110.000 XOF" },
      { type: "Délai RDV", duration: "72h en moyenne", price: "" },
    ],
    availability: ["Mar-Jeu : 8h-16h", "Sam : 8h-12h"],
    languages: ["Français", "Espagnol"],
    detailedLocation: "Treichville, Abidjan, Côte d'Ivoire",
  },
  {
    id: 4,
    name: "Dr. Diallo Aminata",
    title: "Sophrologue",
    date: "Lundi, 13 Juin",
    time: "10:00 – 11:00",
    rating: 4.6,
    reviews: 78,
    location: "Yopougon, Abidjan",
    available: true,
    image: "/experts/diallo.png",
    coordinates: "5.3533, -4.0622",
    specialties: [
      "Gestion du stress",
      "Amélioration du sommeil",
      "Préparation mentale",
    ],
    consultations: [
      { type: "Vidéo", duration: "40 min", price: "8.000 XOF" },
      { type: "Forfait 5 séances", duration: "", price: "35.000 XOF" },
      { type: "Délai RDV", duration: "12h en moyenne", price: "" },
    ],
    availability: ["Lun-Ven : 8h-20h", "Dim : 10h-14h"],
    languages: ["Français", "Dioula", "Baoulé"],
    detailedLocation: "Yopougon, Abidjan, Côte d'Ivoire",
  },
];

function ExpertDetailContent() {
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const expertId = parseInt(searchParams.get("id") || "1");

  const expert = experts.find((item) => item.id === expertId);

  if (!expert) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="text-center">
          <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Expert non trouvé</h1>
          <button onClick={() => router.push("/experts")} className="mt-4 text-[#00569E] font-medium">
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const handleBookAppointment = () => {
    if (expert && expert.available) {
      Storage.addAppointment({
        expertId: expert.id,
        expertName: expert.name,
        date: expert.date,
        time: expert.time,
        status: 'pending'
      });
      router.push('/experts/recap');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 pb-24 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
    }`}>
      <div className="px-4 py-4 mt-1.5 flex items-center justify-between">
        <button onClick={() => router.back()} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
          <Image src="/arrow-return.svg" alt="retour" width={25} height={25} className={theme === 'dark' ? 'invert' : ''}/>
        </button>
        <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Détails de l'expert</h1>
        <div className="w-10" />
      </div>
      
      <div className="px-4 py-6">
        <div className="flex items-start mb-8 gap-5">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-3xl shrink-0 overflow-hidden flex items-center justify-center border-2 border-primary-blue/20">
            <img src={expert.image} alt={expert.name} className="object-cover w-full h-full" />
          </div>

          <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-black text-2xl leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{expert.name}</h3>
                <Image src="/verify.svg" width={20} height={20} alt="verify" className="shrink-0" />
              </div>
              <p className={`text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-blue-400' : 'text-primary-blue'}`}>{expert.title}</p>
              
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5">
                    <span className="text-yellow-500 text-lg">⭐</span>
                    <span className="text-sm font-black">{expert.rating}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{expert.reviews} avis</span>
              </div>
          </div>
        </div>

        {/* Spécialités */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Spécialités</h3>
            <div className={`h-1 w-12 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`} />
          </div>
          <div className="flex flex-wrap gap-2">
            {expert.specialties.map((specialty, index) => (
              <span key={index} className={`px-4 py-3 rounded-2xl text-sm font-medium ${
                theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-blue-50 text-primary-light'
              }`}>
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Consultations */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4">
            <h3 className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Consultations</h3>
            <div className={`h-1 w-12 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`} />
          </div>
          <div className="space-y-3">
            {expert.consultations.map((consult, index) => (
              <div key={index} className={`p-5 rounded-3xl flex items-center justify-between ${
                theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                        {consult.type === 'Vidéo' ? '📹' : '📦'}
                    </div>
                   <div>
                      <p className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{consult.type}</p>
                      {consult.duration && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{consult.duration}</p>}
                   </div>
                </div>
                {consult.price && <span className="font-black text-primary-blue">{consult.price}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Disponibilité */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Disponibilités</h3>
            <div className={`h-1 w-12 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`} />
          </div>
          <div className={`p-6 rounded-3xl ${theme === 'dark' ? 'bg-gray-800/50 border border-gray-700' : 'bg-blue-50/50'}`}>
            {expert.availability.map((time, index) => (
              <p key={index} className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{time}</p>
            ))}
          </div>
        </div>

        {/* Localisation & Map */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-black text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Localisation</h3>
            <div className={`h-1 w-12 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-blue-50'}`} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-4 px-1">{expert.detailedLocation}</p>
          
          <div className={`relative w-full h-64 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 ${
            theme === 'dark' ? 'border-gray-800 bg-gray-800' : 'border-white bg-gray-50 shadow-blue-900/10'
          }`}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              title="Localisation de l'expert"
              srcDoc={`
                <style>body{margin:0;overflow:hidden}</style>
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameborder="0" 
                  scrolling="no" 
                  marginheight="0" 
                  marginwidth="0" 
                  src="https://maps.google.com/maps?q=${expert.coordinates}&z=15&output=embed"
                ></iframe>
              `}
            ></iframe>
          </div>
        </div>

        {/* Bouton Action */}
        <div className="mt-12">
          <button
            className={`w-full ${expert.available ? "bg-primary-orange shadow-orange-500/30" : "bg-gray-400"} text-white font-black py-5 px-8 rounded-[2rem] flex items-center justify-between text-lg shadow-2xl transition-all active:scale-[0.98]`}
            onClick={handleBookAppointment}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                 <Image src={"/phone.svg"} width={20} height={20} alt="phone" className="invert" />
              </div>
              <span>{expert.available ? "Prendre un RDV" : "Indisponible"}</span>
            </div>
            <Image src={"/arrow-return-white.svg"} width={24} height={24} alt="arrow-right" className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function ExpertDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-primary-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExpertDetailContent />
    </Suspense>
  );
}
