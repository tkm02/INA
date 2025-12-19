"use client";

import Search from "@/components/ui/Search";
import { useTheme } from "@/lib/theme-context";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const experts = [
  {
    id: 1,
    name: "Dr. Koffi Jean-Jacques",
    title: "Psychologue",
    date: "Dimanche, 12 Juin",
    time: "11:00 – 12:00",
    rating: 4.8,
    reviews: 124,
    location: "Cocody, Abidjan",
    available: true,
    image: "/experts/koffi.png",
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
  },
];

export default function ExpertsPage() {
  const { theme } = useTheme();
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter()

  const filteredExperts = experts.filter((expert) => {
    const query = searchQuery.toLowerCase();
    return (
      expert.name.toLowerCase().includes(query) ||
      expert.title.toLowerCase().includes(query) ||
      expert.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="px-4 py-4 mt-1.5 flex items-center justify-between">
       <button onClick={() => router.back()} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
         <Image src="/arrow-return.svg" alt="retour" width={25} height={25} className={theme === 'dark' ? 'invert' : ''}/>
       </button>
       <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Experts</h1>
       <div className="w-10" />
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <Search 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* Experts List */}
      <div className="px-4 pb-20">
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert, index) => (
          <div key={expert.id} className="mb-4">
            <div className={`${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
            } border rounded-3xl p-5 transition-all`}>
              <div className="flex items-start mb-4 gap-4">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl shrink-0 overflow-hidden flex items-center justify-center border-2 border-primary-blue/10">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1">
                    <h3 className={`font-black text-lg leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                       {expert.name}
                    </h3>
                    <p className={`text-sm mt-1 font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-primary-blue'}`}>{expert.title}</p>
                </div>

                <div className="shrink-0 relative top-1">
                  <Image
                    src="/verify.svg"
                    width={22}
                    height={22}
                    alt="verify"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className={`flex items-center gap-2 p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <Calendar size={14} className="text-primary-blue" />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {expert.date}
                  </span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <Clock size={14} className="text-primary-blue" />
                  <span className={`text-xs font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {expert.time}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-6 px-2">
                <MapPin size={14} className="text-red-500" />
                <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{expert.location}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push(`/experts/detail?id=${expert.id}`)}
                className={`w-full py-3 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${
                  theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-primary-blue text-white hover:bg-primary-light shadow-lg shadow-blue-500/20'
                }`}
              >
                Voir le profil
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} p-8 rounded-full mb-6`}>
            <Image src="/search-normal.svg" width={48} height={48} alt="no results" className="opacity-20" />
          </div>
          <p className={`font-black text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Aucun expert trouvé</p>
          <p className="text-gray-500 text-sm mb-6 max-w-[240px]">Désolé, nous n'avons pas trouvé de résultats pour "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-primary-blue font-black text-sm uppercase tracking-widest hover:text-primary-light transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
