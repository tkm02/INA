"use client";

import { Storage } from "@/lib/storage";
import { useTheme } from "@/lib/theme-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SettingsPage = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    const data = Storage.getData();
    data.profile = null;
    Storage.saveData(data);
    router.push("/auth/login");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className={`p-6 flex items-center gap-4 border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
        }`}>
          <button onClick={() => router.back()} className="p-1">
               <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} className={theme === 'dark' ? 'invert' : ''} />
          </button>
          <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Paramètres</h1>
        </div>

        <div className="p-6">
          {/* Section Compte */}
          <div className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Compte</h2>
            <div className={`border rounded-2xl overflow-hidden ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <button className={`w-full flex items-center justify-between p-4 border-b transition-colors ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-100 hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Image src="/lock.svg" alt="Mot de passe" width={18} height={18} />
                  </div>
                  <span className="font-medium">Changer le mot de passe</span>
                </div>
                <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} className="opacity-20 rotate-180 invert" />
              </button>

              <button className={`w-full flex items-center justify-between p-4 transition-colors ${
                theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Image src="/moov.svg" alt="Paiement" width={24} height={24} />
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Moyens de paiement</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Moov Money activé</span>
                  </div>
                </div>
                <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} className="opacity-20 rotate-180 invert" />
              </button>
            </div>
          </div>

          {/* Section Préférences */}
          <div className="mb-8">
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Préférences</h2>
            <div className={`border rounded-2xl overflow-hidden ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <div className={`flex items-center justify-between p-4 border-b ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Image src="/bell.svg" alt="Notifications" width={18} height={18} />
                  </div>
                  <span className="font-medium">Notifications Push</span>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-all relative p-1 ${
                    notifications ? 'bg-primary-blue' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-4 ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <span className="text-lg">{theme === 'dark' ? '☀️' : '🌙'}</span>
                  </div>
                  <div className="text-left">
                    <span className="font-medium block">Apparence</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        {theme === 'dark' ? 'Mode sombre' : 'Mode clair'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`w-12 h-6 rounded-full transition-all relative p-1 ${
                    theme === 'dark' ? 'bg-primary-orange' : 'bg-primary-blue'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98] ${
                theme === 'dark' ? 'bg-red-500/10 text-red-500' : 'bg-red-50 bg-red-500/5 text-red-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                <Image src="/logout.svg" alt="Déconnexion" width={18} height={18} className="invert" />
              </div>
              <span className="font-bold">Déconnexion</span>
            </div>
            <span className="font-bold">×</span>
          </button>

          <p className={`mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            INA PWA v1.2.0 • 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;