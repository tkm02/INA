"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const mockRessources = {
  1: {
    id: 1,
    title: "Les déterminants de la santé mentale",
    type: "document" as const,
    description: "Techniques de gestion du stress quotidien",
    pages: 12,
    currentPage: 1,
    fileName: "guide-stress.pdf",
    fileUrl: "/docs/determinants-sante-mentale.pdf",
  },
  2: {
    id: 2,
    title: "Guide Santé",
    type: "document" as const,
    description: "PDF avec exercices de respiration profonde",
    pages: 8,
    currentPage: 1,
    fileName: "exercices-respiration.pdf",
    fileUrl: "/docs/guide_sante.pdf",
  },
  5: {
    id: 5,
    title: "Méditation Guidée",
    type: "audio" as const,
    description: "Séance de méditation de 15 minutes",
    duration: "15:00",
    currentTime: "00:00",
    fileName: "meditation-guidee.mp3",
    fileUrl: "/audio/podcast_v1.mp3",
  },
  6: {
    id: 6,
    title: "Parlons de la Santé Mentale",
    type: "audio" as const,
    description: "Sons naturels pour détente",
    duration: "30:00",
    currentTime: "00:00",
    fileName: "sons-relaxation.mp3",
    fileUrl: "/audio/podcast_v2.mp3",
  },
  7: {
    id: 7,
    title: "Avoir le Courage d'en Parler!",
    type: "video" as const,
    description: "Séance complète pour l'anxiété",
    duration: "25:00",
    currentTime: "00:00",
    fileName: "sante_mental_v1.mp4",
    fileUrl: "/video/sante_mental_v1.mp4",
  },
  8: {
    id: 8,
    title: "Pleine Conscience",
    type: "video" as const,
    description: "Introduction à la pleine conscience",
    duration: "20:00",
    currentTime: "00:00",
    fileName: "sante_mental_v2.mp4",
    fileUrl: "/video/sante_mental_v2.mp4",
  },
};

interface RessourceDetailPageProps {
  params: Promise<{ id: string }>;
}

const RessourceDetailPage = ({ params }: RessourceDetailPageProps) => {
  const router = useRouter();
  const [ressource, setRessource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    setTimeout(() => {
      const ressourceId = parseInt(resolvedParams.id);
      const ressourceData =
        mockRessources[ressourceId as keyof typeof mockRessources];

      if (ressourceData) {
        setRessource(ressourceData);
        setDuration("00:00");
      }
      setLoading(false);
    }, 300);
  }, [resolvedParams]);

  const getColorByType = (type: string) => {
    switch (type) {
      case "document":
        return {
          bg: "bg-primary-orange",
          text: "text-primary-orange",
          border: "border-primary-orange",
          light: "bg-orange-50",
        };
      case "audio":
        return {
          bg: "bg-primary-blue",
          text: "text-primary-blue",
          border: "border-primary-blue",
          light: "bg-blue-50",
        };
      case "video":
        return {
          bg: "bg-primary-light",
          text: "text-primary-light",
          border: "border-primary-light",
          light: "bg-blue-50",
        };
      default:
        return {
          bg: "bg-primary-orange",
          text: "text-primary-orange",
          border: "border-primary-orange",
          light: "bg-orange-50",
        };
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "document":
        return "/doc_o.svg";
      case "audio":
        return "/aud_o.svg";
      case "video":
        return "/v_o.svg";
      default:
        return "/doc_o.svg";
    }
  };

  const handlePrevPage = () => {
    if (ressource?.type === "document" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (ressource?.type === "document" && currentPage < ressource.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(formatTime(current));
      setProgress((current / total) * 100);
    }
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(formatTime(current));
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const total = audioRef.current.duration;
      setDuration(formatTime(total));
    }
    if (videoRef.current) {
      const total = videoRef.current.duration;
      setDuration(formatTime(total));
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setProgress(value);
    
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    }
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const renderContentByType = () => {
    if (!ressource) return null;

    const colors = getColorByType(ressource.type);

    switch (ressource.type) {
      case "document":
        return (
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-full h-auto rounded flex flex-col items-center justify-center relative overflow-hidden`}
            >
              <div className="w-11/12 h-125 bg-primary-light rounded p-6 flex flex-col">
                <div className="flex items-center justify-center bg-white p-2 mb-6">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-lg text-center font-medium text-gray-800">
                        {ressource.title}
                      </h2>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-white rounded-lg p-4">
                  <iframe
                    src={ressource.fileUrl}
                    className="w-full h-87.5"
                    title={ressource.title}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                      className={`px-4 py-2 ${colors.bg} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div className="text-center">
                      <span className="text-white font-medium">
                        Page {currentPage}/{ressource.pages}
                      </span>
                    </div>

                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= ressource.pages}
                      className={`px-4 py-2 ${colors.bg} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "audio":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div
              className={`w-full max-w-2xl rounded border-2 ${colors.border} flex flex-col items-center justify-center relative overflow-hidden p-6`}
            >
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="flex items-center justify-center">
                  <h2 className="text-lg font-medium text-gray-800">
                    {ressource.title}
                  </h2>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="text-5xl font-bold text-gray-800 mb-2">
                  {currentTime}
                </div>
                <div className="text-gray-500 text-lg">
                  / {duration}
                </div>
              </div>

              <div className="w-full">
                <audio
                  ref={audioRef}
                  id="audio-player"
                  src={ressource.fileUrl}
                  className="w-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                <div className="mt-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.text} ${progress}%, #e5e7eb ${progress}%)`
                    }}
                  />
                  
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-8 mt-8">
                    <button
                      onClick={handleRewind}
                      className={`p-3 ${colors.bg} text-white rounded-full hover:opacity-90 transition-opacity`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handlePlayPause}
                      className={`p-4 ${colors.bg} text-white rounded-full hover:opacity-90 transition-opacity shadow-lg`}
                    >
                      {isPlaying ? (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    
                    <button
                      onClick={handleForward}
                      className={`p-3 ${colors.bg} text-white rounded-full hover:opacity-90 transition-opacity`}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div
              className={`w-full max-w-6xl rounded border-2 ${colors.border} flex flex-col items-center justify-center relative overflow-hidden p-6`}
            >
              <div className="flex items-center justify-center gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {ressource.title}
                  </h2>
                </div>
              </div>

              <div className="w-full">
                <video
                  ref={videoRef}
                  id="video-player"
                  src={ressource.fileUrl}
                  className="w-full rounded-lg"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  poster="/video-poster.jpg"
                />
                
                <div className="mt-4 bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{currentTime}</span>
                    <span className="text-gray-700">{duration}</span>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${colors.text} ${progress}%, #e5e7eb ${progress}%)`
                    }}
                  />
                  
                  <div className="flex items-center justify-center gap-8 mt-4">
                    <button
                      onClick={handleRewind}
                      className={`p-3 ${colors.bg} text-white rounded-full hover:opacity-90 transition-opacity`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={handlePlayPause}
                      className={`p-4 ${colors.bg} text-white rounded-full hover:opacity-90 transition-opacity shadow`}
                    >
                      {isPlaying ? (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    
                    <button
                      onClick={handleForward}
                      className={`p-3 ${colors.bg} text-white rounded-full hover:opacity-90 transition-opacity`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-4xl text-gray-400 mb-4">📄</div>
              <h3 className="text-xl font-medium text-gray-600">
                Type de ressource non reconnu
              </h3>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-orange"></div>
          <p className="mt-4 text-gray-600">Chargement de la ressource...</p>
        </div>
      </div>
    );
  }

  if (!ressource) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 mb-6 flex items-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour
          </button>
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Ressource non trouvée
            </h2>
            <p className="text-gray-600 mb-6">
              La ressource que vous cherchez n'existe pas.
            </p>
            <button
              onClick={() => router.push("/resources")}
              className="px-6 py-3 bg-primary-orange text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Retour aux ressources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <button
            className="text-white hover:opacity-80 mt-2.5 transition-opacity mb-6"
            onClick={() => router.back()}
          >
            <img src="/arrow-return.svg" alt="Retour" width="28" height="28" />
          </button>
        </header>

        <main>{renderContentByType()}</main>
      </div>
    </div>
  );
};

export default RessourceDetailPage;