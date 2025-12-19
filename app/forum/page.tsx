'use client';

import { Mic, Send } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Message {
  id: number;
  sender: 'user' | 'ina';
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ina',
      text: "Bonjour 👋\nJe suis ton compagnon d'écoute.\nTu peux parler librement ici.\nComment tu te sens aujourd'hui ?",
      timestamp: 'Mar 8:21',
    },
    {
      id: 2,
      sender: 'user',
      text: "Franchement je me sens fatigué et un peu perdu.",
      timestamp: '',
    },
    {
      id: 3,
      sender: 'ina',
      text: "Merci de me l'avoir dit.\nQuand tu dis perdu, qu'est-ce qui te traverse le plus en ce moment ?",
      timestamp: '',
    },
    {
      id: 4,
      sender: 'user',
      text: "J'ai beaucoup de pression au travail et je dors mal.",
      timestamp: '',
    },
    {
      id: 5,
      sender: 'ina',
      text: "D'accord.\nCe que tu décris est important et mérite d'être suivi sérieusement.",
      timestamp: '',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: 'user',
          text: inputText,
          timestamp: '',
        },
      ]);
      setInputText('');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
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
        <div className="ml-auto text-xs text-gray-500">Mar 8:21</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ina' && (
              <div className="w-8 h-8 bg-[#E86C00] rounded-full flex items-center justify-center mr-2 shrink-0">
                <span className="text-white font-bold text-xs">INA</span>
              </div>
            )}
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl whitespace-pre-line ${
                message.sender === 'user'
                  ? 'bg-[#00569E] text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-900 rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <button className="flex-1 px-4 py-3 bg-[#E86C00] text-white rounded-lg font-medium flex items-center justify-center gap-2">
            <span>👤</span>
            Consultez un expert
          </button>
          <button className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2">
            <span>💬</span>
            Continuer
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#00569E]"
          />
          <button className="p-3 bg-white border border-gray-300 rounded-full">
            <Mic size={20} className="text-gray-600" />
          </button>
          <button
            onClick={handleSend}
            className="p-3 bg-[#E86C00] rounded-full"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
