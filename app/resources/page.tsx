"use client";

import Search from "@/components/ui/Search";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RessourceItem {
  id: number;
  title: string;
  description: string;
  type: "document" | "audio" | "video";
  version?: string;
  checked: boolean;
  icon: string;
}

const ressourcesData: RessourceItem[] = [
  {
    id: 1,
    title: "Les déterminants de la santé mentale",
    description: "Comment savoir évaluer sa santé mentale.",
    type: "document",
    checked: false,
    icon: "document",
  },
  {
    id: 2,
    title: "Guide Santé",
    description: "Prendre soin de sa santé.",
    type: "document",
    checked: true,
    icon: "document",
  },
  // Audio
  {
    id: 5,
    title: "Méditation Guidée",
    description: "Méditation guidée pour son bien-être.",
    type: "audio",
    version: "V1",
    checked: false,
    icon: "audio",
  },
  {
    id: 6,
    title: "Parlons de la Santé Mentale",
    description: "Savoir de parler de ce sujet tabou.",
    type: "audio",
    version: "V2",
    checked: true,
    icon: "audio",
  },
  // Vidéo
  {
    id: 7,
    title: "Avoir le Courage d'en Parler!",
    description: "Comment avoir ce courage là.",
    type: "video",
    version: "V1",
    checked: false,
    icon: "video",
  },
  {
    id: 8,
    title: "Pleine Conscience",
    description: "Parlons tous ensemble...",
    type: "video",
    version: "V2",
    checked: true,
    icon: "video",
  },
];

const Icon = ({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) => {
  switch (name) {
    case "document":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "audio":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      );
    case "video":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      );
    case "check":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    case "download":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    default:
      return null;
  }
};

const RessourceCard = ({ item }: { item: RessourceItem }) => {
  const router = useRouter();
  
  const getIconConfig = (type: "document" | "audio" | "video") => {
    switch (type) {
      case "document":
        return { src: "/doc_w.svg", bgColor: "bg-primary-orange" };
      case "audio":
        return { src: "/aud_w.svg", bgColor: "bg-primary-blue" };
      case "video":
        return { src: "/v_w.svg", bgColor: "bg-primary-light" };
      default:
        return { src: "/doc_w.svg", bgColor: "bg-primary-orange" };
    }
  };

  const iconConfig = getIconConfig(item.type);

  return (
    <div 
      className="bg-white rounded border border-gray-200 p-3 duration-200 active:scale-[0.99] cursor-pointer" 
      onClick={() => router.push(`/resources/${item.id}?type=${item.type}`)}
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 flex items-center justify-center ${iconConfig.bgColor} rounded mt-0.5 w-20 h-20`}>
          <Image 
            src={iconConfig.src} 
            alt={item.type} 
            width={30} 
            height={30} 
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-base truncate">
            {item.title}
          </h3>
          <p className="text-primary-blue font-light text-sm mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const RessourcesPage = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "document" | "audio" | "video">("all");

  const documents = ressourcesData.filter((item) => item.type === "document");
  const audio = ressourcesData.filter((item) => item.type === "audio");
  const video = ressourcesData.filter((item) => item.type === "video");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFilterClick = (filter: "all" | "document" | "audio" | "video") => {
    setActiveFilter(filter);
    
    if (filter === "document") {
      scrollToSection("documents-section");
    } else if (filter === "audio") {
      scrollToSection("audio-section");
    } else if (filter === "video") {
      scrollToSection("video-section");
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getButtonClass = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    const baseClass = "flex flex-col items-center gap-2";
    
    if (isActive) {
      switch (type) {
        case "all":
          return `${baseClass}`;
        case "document":
          return `${baseClass}`;
        case "audio":
          return `${baseClass}`;
        case "video":
          return `${baseClass}`;
        default:
          return baseClass;
      }
    }
    return baseClass;
  };

  const getButtonIcon = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    
    switch (type) {
      case "all":
        return isActive ? "/journal-icon.svg" : "/journal-icon.svg";
      case "document":
        return isActive ? "/doc_w.svg" : "/doc_o.svg";
      case "audio":
        return isActive ? "/aud_w.svg" : "/aud_o.svg";
      case "video":
        return isActive ? "/v_w.svg" : "/v_o.svg";
      default:
        return "/journal-icon.svg";
    }
  };

  const getCircleBgColor = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    
    if (isActive) {
      switch (type) {
        case "all":
          return "bg-primary-light";
        case "document":
          return "bg-primary-orange";
        case "audio":
          return "bg-primary-blue";
        case "video":
          return "bg-primary-light";
        default:
          return "bg-white";
      }
    }
    return "bg-white";
  };

  const getTextColor = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    return isActive ? "text-primary-orange font-semibold" : "text-primary-light font-medium";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 md:mb-10">
          <button 
            className="text-white hover:opacity-80 mt-2.5 transition-opacity mb-6"
            onClick={() => router.back()}
          >
            <img src="/arrow-return.svg" alt="Retour" width="28" height="28" />
          </button>

          <div>
            <Search />
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => handleFilterClick("all")}
              className={getButtonClass("all")}
            >
              <div className={`w-20 h-20 ${getCircleBgColor("all")} rounded-full flex items-center justify-center shadow transition-all duration-300`}>
                <img
                  src={getButtonIcon("all")}
                  alt="Toutes les ressources"
                  width={24}
                  height={24}
                />
              </div>
              <span className={`text-xs ${getTextColor("all")} transition-colors duration-300`}>
                Tous
              </span>
            </button>

            <button
              onClick={() => handleFilterClick("document")}
              className={getButtonClass("document")}
            >
              <div className={`w-20 h-20 ${getCircleBgColor("document")} rounded-full flex items-center justify-center shadow transition-all duration-300`}>
                <img 
                  src={getButtonIcon("document")} 
                  alt="Documents" 
                  width={24} 
                  height={24} 
                />
              </div>
              <span className={`text-xs ${getTextColor("document")} transition-colors duration-300`}>
                Documents
              </span>
            </button>

            <button
              onClick={() => handleFilterClick("audio")}
              className={getButtonClass("audio")}
            >
              <div className={`w-20 h-20 ${getCircleBgColor("audio")} rounded-full flex items-center justify-center shadow transition-all duration-300`}>
                <img 
                  src={getButtonIcon("audio")} 
                  alt="Audio" 
                  width={24} 
                  height={24} 
                />
              </div>
              <span className={`text-xs ${getTextColor("audio")} transition-colors duration-300`}>
                Audio
              </span>
            </button>

            <button
              onClick={() => handleFilterClick("video")}
              className={getButtonClass("video")}
            >
              <div className={`w-20 h-20 ${getCircleBgColor("video")} rounded-full flex items-center justify-center shadow transition-all duration-300`}>
                <img 
                  src={getButtonIcon("video")} 
                  alt="Vidéo" 
                  width={24} 
                  height={24} 
                />
              </div>
              <span className={`text-xs ${getTextColor("video")} transition-colors duration-300`}>
                Vidéo
              </span>
            </button>
          </div>
        </header>

        <section id="documents-section" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-800 flex items-center gap-2">
              Documents
            </h2>
            <span className="text-xs w-5 flex items-center justify-center text-white h-5 bg-primary-light md:text-sm p-1 rounded-full">
              {documents.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {documents.map((item) => (
              <RessourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section id="audio-section" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-800 flex items-center gap-2">
              Audio
            </h2>
            <span className="text-xs w-5 flex items-center justify-center text-white h-5 bg-primary-light md:text-sm p-1 rounded-full">
              {audio.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {audio.map((item) => (
              <RessourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section id="video-section" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-800 flex items-center gap-2">
              Video
            </h2>
            <span className="text-xs w-5 flex items-center justify-center text-white h-5 bg-primary-light md:text-sm p-1 rounded-full">
              {video.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {video.map((item) => (
              <RessourceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RessourcesPage;