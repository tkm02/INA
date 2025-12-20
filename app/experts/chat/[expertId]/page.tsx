"use client";

import { ChatMessage, Storage } from "@/lib/storage";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";

export default function ExpertChatPage({ params }: { params: Promise<{ expertId: string }> }) {
  const { expertId } = use(params);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [expertName, setExpertName] = useState("Expert");
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supportedMimeType = useRef<string>("audio/webm");
  
  const router = useRouter();

  useEffect(() => {
    const data = Storage.getData();
    const appt = data.appointments.find(a => a.expertId.toString() === expertId);
    if (appt) setExpertName(appt.expertName);

    const chatKey = `expert_chat_${expertId}`;
    const saved = localStorage.getItem(chatKey);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      const initial: ChatMessage = {
        id: "1",
        role: "assistant",
        content: `Bonjour ! Je suis ${appt?.expertName || "votre expert"}. Comment puis-je vous aider aujourd'hui ?`,
        timestamp: new Date().toISOString()
      };
      setMessages([initial]);
    }

    // Detect supported MIME type
    if (typeof window !== 'undefined' && window.MediaRecorder) {
        const types = [
            "audio/webm;codecs=opus",
            "audio/mp4",
            "audio/webm",
            "audio/aac",
            "audio/wav"
        ];
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                supportedMimeType.current = type;
                break;
            }
        }
    }
  }, [expertId]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSend = (text?: string, audioData?: string) => {
    const content = text || inputValue;
    if (!content.trim() && !audioData) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: audioData ? `🎤 Message vocal (${formatTime(recordingTime)})` : content,
      audio: audioData,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    if (!audioData) setInputValue("");

    const chatKey = `expert_chat_${expertId}`;
    localStorage.setItem(chatKey, JSON.stringify(updated));

    // Simulated response
    setTimeout(() => {
        const response: ChatMessage = {
            id: Math.random().toString(36).substr(2, 9),
            role: "assistant",
            content: audioData 
                ? "Je viens d'écouter votre message vocal. C'est très clair, merci d'avoir partagé cela." 
                : "Je comprends. Nous pouvons en discuter plus en détail lors de notre prochaine séance de téléconsultation.",
            timestamp: new Date().toISOString()
        };
        const withResponse = [...updated, response];
        setMessages(withResponse);
        localStorage.setItem(chatKey, JSON.stringify(withResponse));
    }, 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const options = { mimeType: supportedMimeType.current };
      const recorder = new MediaRecorder(stream, options);
      audioChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: supportedMimeType.current });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          handleSend(undefined, base64Audio);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err: any) {
      console.error("Error accessing microphone:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert("Accès au micro refusé. Veuillez l'autoriser dans vos réglages pour enregistrer un message.");
      } else {
          alert("Une erreur est survenue lors de l'accès au micro. Veuillez réessayer.");
      }
    }
  };

  const stopRecording = (shouldSend: boolean) => {
    if (mediaRecorder && isRecording) {
      if (shouldSend) {
        mediaRecorder.stop();
      } else {
        mediaRecorder.onstop = () => {
           mediaRecorder.stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorder.stop();
      }
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const playAudio = (base64: string) => {
    const audio = new Audio(base64);
    audio.play().catch(e => {
        console.error("Playback error:", e);
        alert("Impossible de lire ce message audio sur cet appareil.");
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/experts")} className="p-2 bg-gray-50 rounded-full active:scale-95 transition-all cursor-pointer">
             <Image src="/arrow-return.svg" width={20} height={20} alt="Retour" />
          </button>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-100 rounded-2xl overflow-hidden border-2 border-primary-blue/10">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${expertName}`} alt={expertName} />
             </div>
             <div>
                <p className="font-black text-gray-900 leading-tight">{expertName}</p>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">En ligne</span>
                </div>
             </div>
          </div>
        </div>
        <button className="p-2 bg-gray-50 rounded-xl">
             <Image src="/phone.svg" width={18} height={18} alt="Call" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 flex flex-col gap-5 overflow-y-auto pb-28">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-[1.5rem] shadow-sm relative ${
              msg.role === 'user' 
                ? 'bg-primary-blue text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.audio ? (
                  <div className="flex items-center gap-3">
                      <button 
                        onClick={() => playAudio(msg.audio!)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${msg.role === 'user' ? 'bg-white/20' : 'bg-primary-blue/10'}`}
                      >
                          <span className={`text-xl`}>▶️</span>
                      </button>
                      <div className="flex-1 min-w-[120px]">
                          <div className={`h-1.5 w-full rounded-full ${msg.role === 'user' ? 'bg-white/30' : 'bg-gray-100'}`}>
                              <div className={`h-full w-1/3 rounded-full ${msg.role === 'user' ? 'bg-white' : 'bg-primary-blue'}`} />
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 block ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                              {msg.content}
                          </span>
                      </div>
                  </div>
              ) : (
                <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
              )}
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input / Voice Mode */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100">
        <div className="max-w-md mx-auto flex gap-3 items-center">
            <AnimatePresence mode="wait">
                {isRecording ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex-1 flex items-center gap-4 bg-red-50 p-4 rounded-[1.5rem] border border-red-100"
                    >
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-500 font-bold font-mono flex-1">{formatTime(recordingTime)}</span>
                        <div className="flex gap-4">
                            <button onClick={() => stopRecording(false)} className="text-gray-400 font-black text-[10px] uppercase tracking-widest">Annuler</button>
                            <button onClick={() => stopRecording(true)} className="text-red-600 font-black text-[10px] uppercase tracking-widest">Envoyer</button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex gap-2"
                    >
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Votre message..."
                            className="flex-1 bg-gray-50 border-transparent focus:border-primary-blue focus:bg-white rounded-[1.2rem] px-5 py-3.5 text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                        />
                        <button 
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim()}
                            className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center transition-all ${
                                inputValue.trim() ? 'bg-primary-blue text-white shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-300'
                            }`}
                        >
                            <span className="text-lg">➔</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            
            {!isRecording && !inputValue.trim() && (
                <button 
                    onClick={startRecording}
                    className="w-12 h-12 bg-primary-orange text-white rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                    <Image src="/mic.svg" width={20} height={20} alt="Mic" className="invert" />
                </button>
            )}
        </div>
      </div>
    </div>
  );
}
