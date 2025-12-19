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

// Nettoyage affichage (Markdown)
const cleanDisplayText = (text: string) => {
  return text.replace(/\*\*/g, '').replace(/__/g, '');
};

// Nettoyage TTS (Markdown + emojis)
const cleanSpeechText = (text: string) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]/gu, '')
    .replace(/\[.*?\]/g, '')
    .trim();
};

export default function AgentAIPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Bonjour ! Je suis INA, ton amie virtuelle. Je suis là pour t'écouter sans jugement. Comment te sens-tu aujourd'hui ?",
      isInitial: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio
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

  // Charger l'historique du chat
  useEffect(() => {
    const data = Storage.getData();
    if (data.conversations.messages.length > 0) {
      const history: Message[] = data.conversations.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
      }));
      setMessages((prev) => [prev[0], ...history]);
    }
  }, []);

  // Sauver l'historique
  useEffect(() => {
    if (messages.length > 1) {
      const chatMessages: ChatMessage[] = messages
        .filter((m) => !m.isInitial)
        .map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date().toISOString(),
        }));
      Storage.saveChatHistory(chatMessages);
    }
  }, [messages]);

  // Charger les voix
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Nettoyage TTS au démontage
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Text-to-Speech
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
    const frVoices = voices.filter((v) => v.lang.startsWith('fr'));
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (genderToUse === 'male') {
      selectedVoice =
        frVoices.find(
          (v) =>
            v.name.includes('Paul') ||
            v.name.includes('Thomas') ||
            v.name.includes('Nicolas') ||
            v.name.includes('Male')
        ) || null;
    } else {
      selectedVoice =
        frVoices.find(
          (v) =>
            v.name.includes('Google') ||
            v.name.includes('Amelie') ||
            v.name.includes('Hortense') ||
            v.name.includes('Female')
        ) || null;
    }

    if (!selectedVoice && frVoices.length > 0) selectedVoice = frVoices[0];
    if (selectedVoice) utterance.voice = selectedVoice;

    window.speechSynthesis.speak(utterance);
  };

  // Initialisation SpeechRecognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'fr-FR';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert(
          "L’accès au micro est bloqué ou refusé.\n\n" +
            "➡ Vérifie les paramètres du navigateur et autorise le micro pour ce site,\n" +
            "puis recharge la page."
        );
      }
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        sendMessage(transcript);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Démarrer l'écoute (avec vérification de mediaDevices)
  const startListening = async () => {
    if (!recognitionRef.current || isListening) return;

    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
    }

    // Vérifier le support de mediaDevices et getUserMedia
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      alert(
        "Ton navigateur ou ton environnement ne supporte pas correctement l’accès au micro.\n\n" +
          "Essaye avec un navigateur récent (Chrome/Edge) en HTTPS ou en localhost."
      );
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.start();
    } catch (e: any) {
      console.error("getUserMedia error:", e);
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        alert(
          "Accès au micro refusé.\n\n" +
            "➡ Autorise le micro dans les paramètres de ton navigateur pour parler avec INA."
        );
      } else {
        alert("Impossible d’accéder au micro. Vérifie ton navigateur ou ton appareil.");
      }
    }
  };

  // Test de voix (si tu réactives le menu)
  const testVoice = (gender: 'male' | 'female') => {
    setVoiceGender(gender);
    setShowVoiceMenu(false);
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

    if (typeof window !== 'undefined') window.speechSynthesis.cancel();

    try {
      let journalContext = '';
      if (Storage.getJournalAiAccess()) {
        const journals = Storage.getJournals().slice(0, 3);
        if (journals.length > 0) {
          journalContext = journals
            .map((j) => `Titre: ${j.title}\nContenu: ${j.content}`)
            .join('\n\n');
        }
      }

      const userContext = Storage.getUserContext();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          journalContext,
          userContext,
        }),
      });

      if (!response.ok) throw new Error('Erreur de connexion');

      const data = await response.json();

      let assistantText = data.message;
      let showActions = false;
      let options: string[] | undefined;
      let recommendation: Message['recommendation'] | undefined;

      if (assistantText.includes('[SHOW_ACTIONS]')) {
        showActions = true;
        assistantText = assistantText.replace('[SHOW_ACTIONS]', '').trim();
      }

      const optionsMatch = assistantText.match(/\[OPTIONS:(.*?)\]/);
      if (optionsMatch) {
        options = optionsMatch[1].split('|').map((opt: string) => opt.trim());
        assistantText = assistantText.replace(optionsMatch[0], '').trim();
      }

      const resourceMatch = assistantText.match(/\[RESOURCE:(\d+)\]/);
      if (resourceMatch) {
        const id = parseInt(resourceMatch[1]);
        const res = Storage.getResourceById(id);
        if (res) {
          recommendation = {
            resourceId: res.id,
            title: res.title,
            type: res.type,
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
        recommendation,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      speakText(assistantText);
    } catch (err) {
      console.error('Chat error:', err);
      setError("Désolé, je n'ai pas pu me connecter. Réessaie dans un instant.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

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
          <div className="relative">{/* menu voix optionnel */}</div>

          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              if (newMuted && typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
              }
            }}
            className={`p-2 rounded-full transition-colors ${
              isMuted ? 'bg-gray-100' : 'bg-orange-50'
            }`}
          >
            {isMuted ? (
              <VolumeX size={20} className="text-gray-500" />
            ) : (
              <Volume2 size={20} className="text-[#E86C00]" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-[#E86C00] rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <span className="text-white font-bold text-xs">INA</span>
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl whitespace-pre-line shadow-sm ${
                  message.role === 'user'
                    ? 'bg-[#00569E] text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                }`}
              >
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

            {message.showActionButtons && (
              <div className="flex flex-wrap gap-2 mt-3 ml-10 max-w-[85%] animate-in fade-in slide-in-from-top-2 duration-500">
                <button
                  onClick={() => router.push('/experts')}
                  className="px-4 py-2 bg-[#E86C00] text-white rounded-lg font-medium hover:bg-[#d66200] transition-colors shadow-sm text-sm"
                >
                  👤 Consultez un expert
                </button>
                <button
                  onClick={() => sendMessage('Je veux continuer')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors bg-white shadow-sm text-sm"
                >
                  💬 Continuer
                </button>
              </div>
            )}

            {message.customOptions && message.customOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 ml-10 max-w-[90%] animate-in fade-in slide-in-from-top-2 duration-500">
                {message.customOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === message.id ? { ...m, customOptions: undefined } : m
                        )
                      );
                      sendMessage(option);
                    }}
                    className="px-4 py-2 bg-white border border-[#E86C00] text-[#E86C00] rounded-full font-medium hover:bg-[#E86C00] hover:text-white transition-all shadow-sm text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {message.recommendation && (
              <div className="mt-3 ml-10 animate-in fade-in slide-in-from-top-2 duration-500">
                <button
                  onClick={() =>
                    router.push(`/resources/${message.recommendation?.resourceId}`)
                  }
                  className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-primary-blue text-primary-blue rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {message.recommendation.type === 'document' && (
                      <Image
                        src="/doc_w.svg"
                        width={16}
                        height={16}
                        alt="doc"
                        className="invert-0 filter brightness-50"
                      />
                    )}
                    {message.recommendation.type === 'audio' && (
                      <Image
                        src="/aud_w.svg"
                        width={16}
                        height={16}
                        alt="audio"
                        className="invert-0 filter brightness-50"
                      />
                    )}
                    {message.recommendation.type === 'video' && (
                      <Image
                        src="/v_w.svg"
                        width={16}
                        height={16}
                        alt="video"
                        className="invert-0 filter brightness-50"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-wider opacity-60">
                      Recommandation
                    </p>
                    <p className="text-sm">Voir : {message.recommendation.title}</p>
                  </div>
                  <svg
                    className="w-5 h-5 ml-auto"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
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
              <span className="text-xs font-bold uppercase tracking-wider">
                Écoute en cours...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
            className={`p-3 border rounded-full transition-all ${
              isListening
                ? 'bg-orange-500 border-orange-600 text-white shadow-lg scale-110'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
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
