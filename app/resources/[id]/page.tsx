"use client";

import { Resource, Storage } from "@/lib/storage";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface RessourceDetailPageProps {
  params: Promise<{ id: string }>;
}

const RessourceDetailPage = ({ params }: RessourceDetailPageProps) => {
  const router = useRouter();
  const [ressource, setRessource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const ressourceId = parseInt(resolvedParams.id);
    const ressourceData = Storage.getResourceById(ressourceId);

    if (ressourceData) {
      setRessource(ressourceData);
      setDuration(ressourceData.duration || "00:00");
      setCurrentPage(ressourceData.currentPage || 1);
      if (ressourceData.currentTime) {
        setCurrentTime(ressourceData.currentTime);
      }
      
      // Track resource view in localStorage
      Storage.trackResourceView(
        ressourceData.id,
        ressourceData.title,
        ressourceData.type,
        `/resources/${ressourceData.id}`
      );
    }
    setLoading(false);
  }, [resolvedParams]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getColorByType = (type: string) => {
    switch (type) {
      case 'document': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      case 'audio': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
      case 'video': return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' };
    }
  };

  const handlePlayPause = () => {
    if (ressource?.type === 'video' && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    } else if (ressource?.type === 'audio' && audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    const media = ressource?.type === 'video' ? videoRef.current : audioRef.current;
    if (media) {
      const timeStr = formatTime(media.currentTime);
      setCurrentTime(timeStr);
      if (media.duration) {
        setDuration(formatTime(media.duration));
      }
      
      // Save progress occasionally or on update
      // To avoid too many localStorage writes, we could debounce or only save every few seconds
      // But for now, we save it directly to ensure "lecture directe" works well
      Storage.updateResourceProgress(ressource!.id, { currentTime: timeStr });
    }
  };

  const handleLoadedMetadata = () => {
    const media = ressource?.type === 'video' ? videoRef.current : audioRef.current;
    if (media && media.duration) {
      setDuration(formatTime(media.duration));
    }
  };

  const calculateProgress = () => {
    const media = ressource?.type === 'video' ? videoRef.current : audioRef.current;
    if (media && media.duration) {
      return (media.currentTime / media.duration) * 100;
    }
    return 0;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const media = ressource?.type === 'video' ? videoRef.current : audioRef.current;
    if (media && media.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      media.currentTime = pos * media.duration;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (!ressource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ressource non trouvée</h1>
        <button 
          onClick={() => router.push("/resources")}
          className="text-primary-orange font-semibold hover:underline cursor-pointer"
        >
          Retourner aux ressources
        </button>
      </div>
    );
  }

  const colors = getColorByType(ressource.type);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b flex items-center gap-4 sticky top-0 z-10">
        <button 
          onClick={() => router.push("/resources")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <img src="/arrow-return.svg" alt="Retour" width="24" height="24" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-lg text-gray-900 truncate">{ressource.title}</h1>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>
              {ressource.type}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Document Viewer */}
          {ressource.type === 'document' && (
            <div className={`flex flex-col w-full ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-full min-h-[600px]'}`}>
              <div className="flex-1 bg-gray-100 relative group">
                <iframe 
                  src={`${ressource.fileUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
                  className="w-full h-full border-none"
                  style={{ minHeight: isFullscreen ? '100vh' : '600px' }}
                  title={ressource.title}
                />
                
                {/* Fullscreen Toggle Button */}
                <button 
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
                  title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                >
                  {isFullscreen ? (
                    <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3v5H3M21 8h-5V3M3 16h5v5M16 21v-5h5" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className={`bg-white px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t gap-4 shadow-sm ${isFullscreen ? 'fixed bottom-4 left-4 right-4 rounded-2xl mx-auto max-w-lg shadow-2xl' : ''}`}>
                <div className="flex items-center justify-center gap-2 sm:gap-4 w-full sm:w-auto">
                  <button 
                    disabled={currentPage <= 1}
                    onClick={() => {
                      const newPage = currentPage - 1;
                      setCurrentPage(newPage);
                      Storage.updateResourceProgress(ressource.id, { currentPage: newPage });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl disabled:opacity-30 transition-all font-bold text-primary-orange flex items-center gap-1 text-sm shrink-0"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span className="hidden xs:inline">Précédent</span>
                  </button>
                  <span className="font-bold text-gray-600 text-xs sm:text-sm whitespace-nowrap">
                    Page {currentPage} / {ressource.pages}
                  </span>
                  <button 
                    disabled={currentPage >= (ressource.pages || 1)}
                    onClick={() => {
                      const newPage = currentPage + 1;
                      setCurrentPage(newPage);
                      Storage.updateResourceProgress(ressource.id, { currentPage: newPage });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl disabled:opacity-30 transition-all font-bold text-primary-orange flex items-center gap-1 text-sm shrink-0"
                  >
                    <span className="hidden xs:inline">Suivant</span>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => window.open(ressource.fileUrl, '_blank')}
                    className="text-xs font-bold text-gray-400 hover:text-primary-orange transition-colors flex items-center gap-1 py-1 px-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Télécharger
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Audio Player */}
          {ressource.type === 'audio' && (
            <div className="flex flex-col items-center p-8 md:p-12">
              <div className={`w-48 h-48 rounded-[2rem] ${colors.bg} flex items-center justify-center ${colors.text} mb-8 shadow-2xl shadow-purple-100 relative group`}>
                <svg className="w-24 h-24 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <audio 
                  ref={audioRef} 
                  src={ressource.fileUrl} 
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>

              <div className="w-full text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{ressource.title}</h2>
                <p className="text-gray-500">{ressource.description}</p>
              </div>

              <div className="w-full max-w-md space-y-6">
                <div className="space-y-2">
                  <div 
                    className="h-2 bg-gray-100 rounded-full overflow-hidden cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className={`h-full ${colors.bg.replace('bg-', 'bg-').split('-')[1] === 'purple' ? 'bg-purple-600' : 'bg-blue-600'} rounded-full relative`}
                      style={{ width: `${calculateProgress()}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-inherit rounded-full shadow-md"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-gray-400">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6L11 18zM21.5 6L13 12l8.5 6V6z"/></svg>
                  </button>
                  <button 
                    onClick={handlePlayPause}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl transition-transform active:scale-95 ${colors.bg.replace('bg-', 'bg-').split('-')[1] === 'purple' ? 'bg-purple-600' : 'bg-blue-600'}`}
                  >
                    {isPlaying ? (
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                  <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Video Player */}
          {ressource.type === 'video' && (
            <div className="flex flex-col">
              <div className="aspect-video bg-black relative group">
                <video 
                  ref={videoRef}
                  className="w-full h-full"
                  poster="/video/poster.jpg"
                  src={ressource.fileUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handlePlayPause}
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border-2 border-white/50"
                  >
                    {isPlaying ? (
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    ) : (
                      <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    )}
                  </button>
                </div>
                
                {/* Custom Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                  <div 
                    className="h-1 bg-white/30 rounded-full mb-4 relative cursor-pointer"
                    onClick={handleSeek}
                  >
                    <div 
                      className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <button onClick={handlePlayPause}>
                        {isPlaying ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </button>
                      <span className="text-sm font-medium">{currentTime} / {duration}</span>
                    </div>
                    <button>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{ressource.title}</h2>
                <p className="text-gray-500 leading-relaxed">
                  {ressource.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">Santé Mentale</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">Bien-être</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">Conseils</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RessourceDetailPage;