"use client";

import Search from "@/components/ui/Search";
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
    <div className="min-h-screen bg-white">
      <div className="px-4 py-4 mt-1.5">
       <Image src="/arrow-return.svg" alt="retour" width={25} height={25} onClick={() => router.back()} className="cursor-pointer"/>
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
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-start mb-4 gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1 flex items-start ">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                       {expert.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{expert.title}</p>
                  </div>

                  <div className="shrink-0 ml-2 relative top-1">
                    <img
                      src="/verify.svg"
                      width={20}
                      height={20}
                      alt="verify"
                    />
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-700 text-sm font-medium">
                    {expert.date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-gray-700 text-sm font-medium">
                    {expert.time}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-6">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-600 text-sm">{expert.location}</span>
              </div>

              {/* Separator */}
              <div className="border-t border-gray-200 mb-4"></div>

              {/* Detail Button */}
              <button
                onClick={() => router.push(`/experts/detail?id=${expert.id}`)}
                className="w-full text-center"
              >
                <span className="text-[#00569E] font-medium text-sm">
                  Detail
                </span>
              </button>
            </div>

            {index < filteredExperts.length - 1 && (
              <div className="border-t border-gray-200 my-4"></div>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-gray-50 p-6 rounded-full mb-4">
            <Image src="/search-normal.svg" width={40} height={40} alt="no results" className="opacity-20" />
          </div>
          <p className="text-gray-500 font-medium">Aucun expert trouvé pour "{searchQuery}"</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-primary-blue text-sm mt-2 font-semibold"
          >
            Réinitialiser la recherche
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
