"use client";

import { Storage } from "@/lib/storage";
import { MapPin, Video } from "lucide-react";
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const expertId = parseInt(searchParams.get("id") || "1");

  const expert = experts.find((item) => item.id === expertId);

  if (!expert) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900">Expert non trouvé</h1>
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
    <div className="min-h-screen bg-white pb-20">
      <div className="px-4 py-4 mt-1.5 overflow-hidden">
        <Image src="/arrow-return.svg" alt="retour" width={25} height={25} onClick={() => router.push("/experts")} className="cursor-pointer"/>
      </div>
      
      <div className="px-4 py-6">
        <div className="flex items-start mb-4 gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full shrink-0 overflow-hidden flex items-center justify-center">
            <img src={expert.image} alt={expert.name} width={48} height={48} className="object-cover w-full h-full" />
          </div>

          <div className="flex-1 flex items-start justify-between ">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{expert.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{expert.title}</p>
            </div>
            <div className="shrink-0 ml-2 flex flex-col items-end relative top-1">
              <img src="/verify.svg" width={25} height={25} alt="verify" />
              <div className="flex items-center gap-2 mb-8">
                <span className="text-primary-light text-sm">{expert.rating}/5</span>
                <span className="text-primary-light text-sm">({expert.reviews} avis)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Spécialités */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">📌 Spécialités :</h3>
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

        {/* Consultations */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-1">
              <Video size={20} className="text-primary-light" />
              <h3 className="font-semibold text-gray-900 text-lg">Consultations :</h3>
            </div>
            <Image src={"/line.svg"} width={100} height={40} alt="line" />
          </div>
          <ul className="space-y-3 pl-8 bg-[#F1F1F1] rounded py-3">
            {expert.consultations.map((consult, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span className="text-gray-700 font-medium">
                  {consult.type} {consult.duration && `: ${consult.duration}`} {consult.price && `- ${consult.price}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disponibilité */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">🕒 Disponible :</h3>
            <Image src={"/line.svg"} width={100} height={40} alt="line" />
          </div>
          <div className="pl-8 bg-[#F1F1F1] rounded py-3">
            {expert.availability.map((time, index) => (
              <p key={index} className="text-gray-700">{time}</p>
            ))}
          </div>
        </div>

        {/* Localisation & Map */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center space-x-1">
              <MapPin size={20} className="text-red-500" />
              <h3 className="font-semibold text-gray-900 text-lg">Localisation :</h3>
            </div>
            <Image src={"/line.svg"} width={100} height={40} alt="line" />
          </div>
          <div className="pl-8 bg-[#F1F1F1] rounded py-3 mb-4">
            <p className="text-gray-700">{expert.detailedLocation}</p>
          </div>
          
          <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 bg-gray-50">
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
            className={`w-full ${expert.available ? "bg-primary-orange" : "bg-orange-400"} text-white font-semibold py-4 px-6 rounded flex items-center justify-between text-lg`}
            onClick={handleBookAppointment}
          >
            <div className="flex items-center space-x-2">
              <Image src={"/phone.svg"} width={25} height={25} alt="phone" />
              <span>{expert.available ? "Prendre un RDV" : "Indisponible"}</span>
            </div>
            <Image src={"/arrow-return-white.svg"} width={25} height={25} alt="arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function ExpertDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-[#00569E] border-t-transparent rounded-full animate-spin" />
    </div>}>
      <ExpertDetailContent />
    </Suspense>
  );
}
