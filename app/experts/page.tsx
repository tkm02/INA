"use client";

import { useState } from "react";
import { ChevronLeft, Calendar, Clock, MapPin, Star } from "lucide-react";
import Search from "@/components/ui/Search";
import Image from "next/image";
import { useRouter } from "next/navigation";

const experts = [
  {
    id: 1,
    name: "Dr. Joseph Brostito",
    title: "Psychologue",
    date: "Sunday, 12 June",
    time: "11:00 – 12:00 AM",
    rating: 4.8,
    reviews: 124,
    location: "Cocody, Côte d'ivoire",
    available: true,
  },
  {
    id: 2,
    name: "Dr. Bessie Coleman",
    title: "Psychothérapeute",
    date: "Sunday, 12 June",
    time: "11:00 – 12:00 AM",
    rating: 4.9,
    reviews: 89,
    location: "Plateau, Côte d'ivoire",
    available: true,
  },
  {
    id: 3,
    name: "Dr. Bessie Coleman",
    title: "Psychanalyste",
    date: "Sunday, 12 June",
    time: "11:00 – 12:00 AM",
    rating: 4.7,
    reviews: 156,
    location: "Treichville, Côte d'ivoire",
    available: false,
  },
  {
    id: 4,
    name: "Dr. Babe Didrikson",
    title: "Sophrologue",
    date: "Monday, 13 June",
    time: "10:00 – 11:00 AM",
    rating: 4.6,
    reviews: 78,
    location: "Marcory, Côte d'ivoire",
    available: true,
  },
];

export default function ExpertsPage() {
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 py-4 mt-1.5">
       <Image src={"/arrow-return.svg"} alt="retour" width={25} height={25}/>
      </div>

      {/* Search Bar */}
      <div className="px-4">
        <Search />
      </div>

      {/* Experts List */}
      <div className="px-4 pb-20">
        {experts.map((expert, index) => (
          <div key={expert.id} className="mb-4">
            <div className="bg-white border border-gray-200 rounded-md p-4">
              <div className="flex items-start mb-4 gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0 flex items-center justify-center">
                  <img
                    src="/user.svg"
                    alt="user"
                    width={40}
                    height={40}
                    className="object-contain"
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

            {index < experts.length - 1 && (
              <div className="border-t border-gray-200 my-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
