'use client';

import { ChatMessage, Storage } from "@/lib/storage";
import { Loader2, Mic, Send, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isInitial?: boolean;
  showActionButtons?: boolean;
  customOptions?: string[];
  recommendation?: {
    resourceId: number;
    title: string;
    type: string;
  };
}

// Fonction utilitaire pour nettoyer le texte affiché (Markdown)
const cleanDisplayText = (text: string) => {
  return text.replace(/\*\*/g, '').replace(/__/g, '');
};

// Fonction utilitaire pour nettoyer le texte lu (Emojis + Markdown)
const cleanSpeechText = (text: string) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]/gu, '')
    .replace(/\[.*?\]/g, '') // Retire les tags techniques
    .trim();
};

export default function AgentAIPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant", // Changed from 'ina' to 'assistant'
      content:
        "Bonjour ! Je suis INA, ton amie virtuelle. Je suis là pour t'écouter sans jugement. Comment te sens-tu aujourd'hui ?",
      isInitial: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // États audio
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceGender, setVoiceGender] = useState<'female' | 'male'>('female');
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  const recognitionRef = useRef<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on mount
  useEffect(() => {
    const data = Storage.getData();
    if (data.conversations.messages.length > 0) {
      // Map Storage format to component format
      const history: Message[] = data.conversations.messages.map(m => ({
        id: m.id,
        role: m.role, // Standardized role mapping
        content: m.content
      }));
      // Preserving the initial greeting
      setMessages([messages[0], ...history]);
    }
  }, []);

  // Save chat history whenever messages change
  useEffect(() => {
    if (messages.length > 1) {
      const chatMessages: ChatMessage[] = messages
        .filter(m => !m.isInitial) // Don't save initial greeting to storage as it's static
        .map(m => ({
          id: m.id,
          role: m.role, // Standardized role mapping
          content: m.content,
          timestamp: new Date().toISOString()
        }));
      Storage.saveChatHistory(chatMessages);
    }
  }, [messages]);

  // Chargement des voix
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ✅ NETTOYAGE : Arrêter la voix quand on quitte la page (démontage du composant)
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fonction de lecture Text-to-Speech améliorée
  const speakText = (text: string, forceGender?: 'male' | 'female') => {
    if (isMuted || typeof window === 'undefined') return;

    window.speechSynthesis.cancel();

    const textToRead = cleanSpeechText(text);
    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1; 
    utterance.pitch = 1.0;

    const genderToUse = forceGender || voiceGender;
    const frVoices = voices.filter(v => v.lang.startsWith('fr'));
    let selectedVoice = null;

    if (genderToUse === 'male') {
      selectedVoice = frVoices.find(v => 
        v.name.includes('Paul') || v.name.includes('Thomas') || v.name.includes('Nicolas') || v.name.includes('Male')
      );
    } else {
      selectedVoice = frVoices.find(v => 
        v.name.includes('Google') || v.name.includes('Amelie') || v.name.includes('Hortense') || v.name.includes('Female')
      );
    }

    if (!selectedVoice && frVoices.length > 0) selectedVoice = frVoices[0];
    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };

  // ✅ Voice Recognition (Speech-to-Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'fr-FR';

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech error", event.error);
          setIsListening(false);
        };
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            sendMessage(transcript);
          }
        };
      }
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      // Arrêter la voix d'INA si on commence à écouter
      window.speechSynthesis.cancel();
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Recognition error", e);
      }
    } else if (isListening) {
      recognitionRef.current.stop();
    }
  };

  // Test de voix lors du changement
  const testVoice = (gender: 'male' | 'female') => {
    setVoiceGender(gender);
    setShowVoiceMenu(false);
    // Arrêter toute voix en cours avant de tester
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    
    setTimeout(() => {
      speakText("Ceci est ma voix pour INA.", gender);
    }, 100);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Arrêter la voix si l'utilisateur parle
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();

    try {
      // Fetch journal context if allowed
      let journalContext = '';
      if (Storage.getJournalAiAccess()) {
        const journals = Storage.getJournals().slice(0, 3); // Last 3 entries for context
        if (journals.length > 0) {
          journalContext = journals.map(j => `Titre: ${j.title}\nContenu: ${j.content}`).join('\n\n');
        }
      }
      
      // Get user context for personalization
      const userContext = Storage.getUserContext();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          journalContext,
          userContext
        }),
      });

      if (!response.ok) throw new Error('Erreur de connexion');

      const data = await response.json();
      
      let assistantText = data.message;
      let showActions = false;
      let options: string[] | undefined = undefined;

      if (assistantText.includes('[SHOW_ACTIONS]')) {
        showActions = true;
        assistantText = assistantText.replace('[SHOW_ACTIONS]', '').trim();
      }

      const optionsMatch = assistantText.match(/\[OPTIONS:(.*?)\]/);
      if (optionsMatch) {
        options = optionsMatch[1].split('|').map((opt: string) => opt.trim());
        assistantText = assistantText.replace(optionsMatch[0], '').trim();
      }

      // Check for Resource recommendations
      let recommendation = undefined;
      const resourceMatch = assistantText.match(/\[RESOURCE:(\d+)\]/);
      if (resourceMatch) {
        const id = parseInt(resourceMatch[1]);
        const res = Storage.getResourceById(id);
        if (res) {
          recommendation = {
            resourceId: res.id,
            title: res.title,
            type: res.type
          };
        }
        assistantText = assistantText.replace(resourceMatch[0], '').trim();
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantText,
        showActionButtons: showActions,
        customOptions: options,
        recommendation
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakText(assistantText);

    } catch (err) {
      console.error('Chat error:', err);
      setError('Désolé, je n\'ai pas pu me connecter. Réessaie dans un instant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ✅ Fonction de retour améliorée (coupe le son + navigation)
  const handleBack = () => {
    if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm relative">
        <button onClick={handleBack}>
          <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#E86C00] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">INA</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">INA</p>
            <p className="text-xs text-[#4CAF50]">● En ligne</p>
          </div>
        </div>
        
        {/* Contrôles Audio */}
        <div className="ml-auto flex gap-2">
          {/* Menu Voix */}
          <div className="relative">
            {/* <button 
              onClick={() => setShowVoiceMenu(!showVoiceMenu)}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <Settings size={20} className="text-gray-600" />
            </button>
            
            {showVoiceMenu && (
              <div className="absolute right-0 top-12 bg-white shadow-xl rounded-xl p-2 w-48 border border-gray-100 animate-in fade-in slide-in-from-top-2 z-50">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2 px-2 tracking-wider">Voix d'INA</p>
                <button 
                  onClick={() => testVoice('female')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between mb-1 transition-colors ${voiceGender === 'female' ? 'bg-orange-50 text-[#E86C00] font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span>👩 Femme</span>
                  {voiceGender === 'female' && <Check size={14} />}
                </button>
                <button 
                  onClick={() => testVoice('male')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${voiceGender === 'male' ? 'bg-orange-50 text-[#E86C00] font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <span>👨 Homme</span>
                  {voiceGender === 'male' && <Check size={14} />}
                </button>
              </div>
            )} */}
          </div>

          {/* Mute / Unmute */}
          <button 
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted) window.speechSynthesis.cancel();
            }}
            className={`p-2 rounded-full transition-colors ${isMuted ? 'bg-gray-100' : 'bg-orange-50'}`}
          >
            {isMuted ? <VolumeX size={20} className="text-gray-500" /> : <Volume2 size={20} className="text-[#E86C00]" />}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-[#E86C00] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white font-bold text-xs">INA</span>
                </div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl whitespace-pre-line shadow-sm ${
                message.role === 'user'
                  ? 'bg-[#00569E] text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                {cleanDisplayText(message.content)}
                
                {message.role === 'assistant' && (
                  <button 
                    onClick={() => speakText(message.content)}
                    className="ml-2 inline-block opacity-50 hover:opacity-100 align-middle"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Boutons Actions */}
            {message.showActionButtons && (
              <div className="flex flex-wrap gap-2 mt-3 ml-10 max-w-[85%] animate-in fade-in slide-in-from-top-2 duration-500">
                <button 
                  onClick={() => router.push('/experts')}
                  className="px-4 py-2 bg-[#E86C00] text-white rounded-lg font-medium hover:bg-[#d66200] transition-colors shadow-sm text-sm"
                >
                  👤 Consultez un expert
                </button>
                <button 
                  onClick={() => sendMessage("Je veux continuer")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm text-sm"
                >
                  💬 Continuer
                </button>
              </div>
            )}

            {/* Boutons Quiz */}
            {message.customOptions && message.customOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-10 max-w-[90%] animate-in fade-in slide-in-from-top-2 duration-500">
                {message.customOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessages(prev => prev.map(m => 
                        m.id === message.id ? { ...m, customOptions: undefined } : m
                      ));
                      sendMessage(option);
                    }}
                    className="px-4 py-2 bg-white border border-[#E86C00] text-[#E86C00] rounded-full font-medium hover:bg-[#E86C00] hover:text-white transition-all shadow-sm text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Bouton Recommandation Ressource */}
            {message.recommendation && (
              <div className="mt-3 ml-10 animate-in fade-in slide-in-from-top-2 duration-500">
                <button 
                  onClick={() => router.push(`/resources/${message.recommendation?.resourceId}`)}
                  className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-primary-blue text-primary-blue rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {message.recommendation.type === 'document' && <Image src="/doc_w.svg" width={16} height={16} alt="doc" className="invert-0 filter brightness-50" />}
                    {message.recommendation.type === 'audio' && <Image src="/aud_w.svg" width={16} height={16} alt="audio" className="invert-0 filter brightness-50" />}
                    {message.recommendation.type === 'video' && <Image src="/v_w.svg" width={16} height={16} alt="video" className="invert-0 filter brightness-50" />}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider opacity-60">Recommandation</p>
                    <p className="text-sm">Voir : {message.recommendation.title}</p>
                  </div>
                  <svg className="w-5 h-5 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 bg-[#E86C00] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
               <span className="text-white font-bold text-xs">INA</span>
             </div>
             <div className="max-w-[70%] px-4 py-3 rounded-2xl bg-gray-100 text-gray-900 rounded-bl-none">
               <div className="flex items-center gap-2">
                 <Loader2 size={16} className="animate-spin text-[#E86C00]" />
                 <span className="text-sm text-gray-600">INA réfléchit...</span>
               </div>
             </div>
          </div>
        )}
        {isListening && (
          <div className="flex justify-end pr-4">
            <div className="bg-orange-100 text-[#E86C00] px-4 py-2 rounded-2xl flex items-center gap-2 animate-pulse border border-orange-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider">Écoute en cours...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "Parle maintenant..." : "Message..."}
            disabled={isLoading || isListening}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#00569E] focus:ring-1 focus:ring-[#00569E] disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900"
          />
          <button 
            type="button"
            onClick={startListening}
            className={`p-3 border rounded-full transition-all ${isListening ? 'bg-orange-500 border-orange-600 text-white shadow-lg scale-110' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            disabled={isLoading}
          >
            <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
          </button>
          <button
            type="submit"
            disabled={isLoading || isListening || !input.trim()}
            className="p-3 bg-[#E86C00] rounded-full hover:bg-[#d66200] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={20} className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
}
