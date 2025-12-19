"use client";

import { ChevronLeft, Star, Check, Video, MapPin, Globe } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const experts = [
  {
    id: 1,
    name: "Dr. Joseph Brostito",
    title: "Psychologue",
    date: "Sunday, 12 June",
    time: "11:00 – 12:00 AM",
    rating: 4.8,
    reviews: 127,
    location: "Cocody, Côte d'Ivoire",
    available: true,
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
    detailedLocation: "Abidjan, Côte d'Ivoire",
  },
  {
    id: 2,
    name: "Dr. Bessie Coleman",
    title: "Psychothérapeute",
    date: "Sunday, 12 June",
    time: "11:00 – 12:00 AM",
    rating: 4.9,
    reviews: 89,
    location: "Plateau, Côte d'Ivoire",
    available: true,
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
    detailedLocation: "Abidjan, Côte d'Ivoire",
  },
  {
    id: 3,
    name: "Dr. Bessie Coleman",
    title: "Psychanalyste",
    date: "Sunday, 12 June",
    time: "11:00 – 12:00 AM",
    rating: 4.7,
    reviews: 156,
    location: "Treichville, Côte d'Ivoire",
    available: false,
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
    detailedLocation: "Abidjan, Côte d'Ivoire",
  },
  {
    id: 4,
    name: "Dr. Babe Didrikson",
    title: "Sophrologue",
    date: "Monday, 13 June",
    time: "10:00 – 11:00 AM",
    rating: 4.6,
    reviews: 78,
    location: "Marcory, Côte d'Ivoire",
    available: true,
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
    detailedLocation: "Abidjan, Côte d'Ivoire",
  },
];

export default function ExpertDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const expertId = parseInt(searchParams.get("id") || "1");

  const expert = experts.find((item) => item.id === expertId);

  if (!expert) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Expert non trouvé
          </h1>
          <button
            onClick={() => router.push("/experts")}
            className="mt-4 text-[#00569E] font-medium"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const roundedRating = Math.floor(expert.rating);
  const hasHalfStar = expert.rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="px-4 py-4 mt-1.5">
        <Image src={"/arrow-return.svg"} alt="retour" width={25} height={25} />
      </div>
      {/* Expert Profile */}
      <div className="px-4 py-6">
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

          <div className="flex-1 flex items-start justify-between ">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{expert.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{expert.title}</p>
            </div>

            <div className="shrink-0 ml-2 flex flex-col items-end relative top-1">
              <img src="/verify.svg" width={25} height={25} alt="verify" />
              <div className="flex items-center gap-2 mb-8">
                <span className="text-primary-light text-sm">
                  {expert.rating}/5
                </span>
                <span className="text-primary-light text-sm">
                  ({expert.reviews} avis)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Spécialités */}
        {expert.specialties && expert.specialties.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between  gap-2 mb-4">
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  📌 Spécialités :
                </h3>
              </div>
              <Image src={"/line.svg"} width={100} height={40} alt="line" />
            </div>
            <ul className="space-y-2 pl-8 bg-[#F1F1F1] rounded py-3">
              {expert.specialties.map((specialty, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-700">{specialty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Consultations */}
        {expert.consultations && expert.consultations.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between  gap-2 mb-4">
              <div className="flex items-center space-x-1">
                <Video size={20} className="text-primary-light" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  Consultations :
                </h3>
              </div>
              <Image src={"/line.svg"} width={100} height={40} alt="line" />
            </div>

            <ul className="space-y-3 pl-8 bg-[#F1F1F1] rounded py-3">
              {expert.consultations.map((consult, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-500">•</span>
                  <div>
                    <span className="text-gray-700 font-medium">
                      {consult.type}{" "}
                      {consult.duration && `: ${consult.duration}`}
                    </span>
                    {consult.price && (
                      <span className="text-gray-700 ml-2">
                        {consult.type.includes("Délai")
                          ? `: ${consult.price}`
                          : `- ${consult.price}`}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disponible */}
        {expert.availability && expert.availability.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between  gap-2 mb-4">
              <div className="flex items-center space-x-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  🕒 Disponible :
                </h3>
              </div>
              <Image src={"/line.svg"} width={100} height={40} alt="line" />
            </div>

            <div className="pl-8 bg-[#F1F1F1] rounded py-3">
              {expert.availability.map((time, index) => (
                <p key={index} className="text-gray-700">
                  {time}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Langues */}
        {expert.languages && expert.languages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between  gap-2 mb-4">
              <div className="flex items-center space-x-1">
                <Globe size={20} className="text-purple-500" />
                <h3 className="font-semibold text-gray-900 text-lg">
                  Langues :
                </h3>
              </div>
              <Image src={"/line.svg"} width={100} height={40} alt="line" />
            </div>
            <div className="pl-8 bg-[#F1F1F1] rounded py-3">
              <p className="text-gray-700">{expert.languages.join(", ")}</p>
            </div>
          </div>
        )}

        {/* Localisation */}
        <div className="mb-8 ">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin size={20} className="text-red-500" />
              <h3 className="font-semibold text-gray-900 text-lg">
                Localisation :
              </h3>
            </div>
            <Image src={"/line.svg"} width={100} height={40} alt="line" />
          </div>

          <div className="pl-8 bg-[#F1F1F1] rounded py-3">
            <p className="text-gray-700 ">
              {expert.detailedLocation || expert.location}
            </p>
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="mt-12">
          <button
            className={`w-full ${
              expert.available ? "bg-primary-orange" : "bg-orange-400"
            } text-white font-semibold py-4 px-6 rounded flex items-center justify-between text-lg hover:opacity-90 transition-opacity`}
            onClick={() => router.push('/experts/recap')}
          >
            <div className="flex items-center space-x-2">
              <Image src={"/phone.svg"} width={25} height={25} alt="phone" />

              <span>
                {expert.available ? "Prendre un RDV" : "Indisponible"}
              </span>
            </div>
            <span>
              <Image
                src={"/arrow-return-white.svg"}
                width={25}
                height={25}
                alt="arrow-right"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
