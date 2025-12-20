"use client";

import Search from "@/components/ui/Search";
import { Resource, Storage } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "audio":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      );
    case "video":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case "check":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    default:
      return null;
  }
};

const RessourceCard = ({ item }: { item: Resource }) => {
  const router = useRouter();
  
  const getIconConfig = (type: "document" | "audio" | "video") => {
    switch (type) {
      case "document":
        return { icon: "document", color: "text-blue-500", bg: "bg-blue-50" };
      case "audio":
        return { icon: "audio", color: "text-purple-500", bg: "bg-purple-50" };
      case "video":
        return { icon: "video", color: "text-red-500", bg: "bg-red-50" };
    }
  };

  const config = getIconConfig(item.type);

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => router.push(`/resources/${item.id}?type=${item.type}`)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center ${config.color} shrink-0`}>
          <Icon name={config.icon} className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate pr-2">
              {item.title}
            </h3>
            {item.checked && (
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                <Icon name="check" className="w-3 h-3" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${config.bg} ${config.color}`}>
              {item.type}
            </span>
            {item.viewCount > 0 && (
              <span className="text-[10px] text-gray-400 font-medium">
                Vu {item.viewCount} fois
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RessourcesPage = () => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<"all" | "document" | "audio" | "video">("all");
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    setResources(Storage.getResources());
  }, []);

  const documents = resources.filter((item) => item.type === "document");
  const audio = resources.filter((item) => item.type === "audio");
  const video = resources.filter((item) => item.type === "video");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleFilterClick = (filter: "all" | "document" | "audio" | "video") => {
    setActiveFilter(filter);
    if (filter !== "all") {
      scrollToSection(filter);
    }
  };

  const getButtonClass = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    return `flex flex-col items-center gap-2 outline-hidden border-none bg-transparent transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'}`;
  };

  const getCircleBgColor = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    if (!isActive) return "bg-white";
    switch (type) {
      case "all": return "bg-primary-orange shadow-orange-100";
      case "document": return "bg-primary-orange shadow-orange-100";
      case "audio": return "bg-primary-orange shadow-orange-100";
      case "video": return "bg-primary-orange shadow-orange-100";
    }
  };

  const getButtonIcon = (type: "all" | "document" | "audio" | "video") => {
    const isActive = activeFilter === type;
    switch (type) {
      case "all": return isActive ? "/ressource.svg" : "/ressource.svg"; 
      case "document": return isActive ? "/doc_w.svg" : "/doc_o.svg";
      case "audio": return isActive ? "/aud_w.svg" : "/aud_o.svg";
      case "video": return isActive ? "/v_w.svg" : "/v_o.svg";
    }
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
            className="text-white hover:opacity-80 mt-2.5 transition-opacity mb-6 cursor-pointer"
            onClick={() => router.push("/home")}
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
                  alt="Vidéos" 
                  width={24} 
                  height={24} 
                />
              </div>
              <span className={`text-xs ${getTextColor("video")} transition-colors duration-300`}>
                Vidéos
              </span>
            </button>
          </div>
        </header>

        <main className="space-y-12 pb-20">
          {/* Documents Section */}
          {(activeFilter === "all" || activeFilter === "document") && documents.length > 0 && (
            <section id="document" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">
                  Documents
                </h2>
                <span className="text-xs font-medium text-gray-400">
                  {documents.length} ressources
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {documents.map((item: Resource) => (
                  <RessourceCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Audio Section */}
          {(activeFilter === "all" || activeFilter === "audio") && audio.length > 0 && (
            <section id="audio" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-purple-500 pl-3">
                  Audio
                </h2>
                <span className="text-xs font-medium text-gray-400">
                  {audio.length} ressources
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {audio.map((item: Resource) => (
                  <RessourceCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* Vidéos Section */}
          {(activeFilter === "all" || activeFilter === "video") && video.length > 0 && (
            <section id="video" className="scroll-mt-32">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 border-l-4 border-red-500 pl-3">
                  Vidéos
                </h2>
                <span className="text-xs font-medium text-gray-400">
                  {video.length} ressources
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {video.map((item: Resource) => (
                  <RessourceCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default RessourcesPage;