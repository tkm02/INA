"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SettingsPage = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header avec bouton retour */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image
              src="/arrow-return.svg"
              alt="Retour"
              width={24}
              height={24}
            />
          </button>
        </div>

        <div className="bg-white rounded shadow p-6 mb-6">
          {/* Options */}
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Image src="/lock.svg" alt="Mot de passe" width={20} height={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800">Changer le mot de passe</h4>
                  <p className="text-gray-500 text-sm">Mettez à jour votre mot de passe régulièrement</p>
                </div>
              </div>
              <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} />
            </button>

            {/* Add Payment Method */}
            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Image src="/card.svg" alt="Paiement" width={20} height={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800">Ajouter un moyen de paiement</h4>
                  <p className="text-gray-500 text-sm">Ajouter une carte de crédit ou mobile money</p>
                </div>
              </div>
              <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* Section Push Notifications */}
        <div className="bg-white rounded shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Notifications push</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Image src="/bell.svg" alt="Notifications" width={20} height={20} />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Activer les notifications</h4>
                <p className="text-gray-500 text-sm">Recevoir des mises à jour et rappels</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? 'bg-primary-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  notifications ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section Dark Mode */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Mode sombre</h2>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <Image src="/moon.svg" alt="Mode sombre" width={20} height={20} className="invert" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Thème sombre</h4>
                <p className="text-gray-500 text-sm">Passer à l'apparence sombre</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                darkMode ? 'bg-primary-blue' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  darkMode ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Additional Settings */}
        <div className="mt-6 space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-primary-light rounded transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <Image src="/privacy.svg" alt="Confidentialité" width={20} height={20} />
              </div>
              <h4 className="font-medium text-white">Confidentialité & Sécurité</h4>
            </div>
            <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-primary-light rounded shadow transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <Image src="/help.svg" alt="Aide" width={20} height={20} />
              </div>
              <h4 className="font-medium text-white">Aide & Support</h4>
            </div>
            <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} />
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-primary-orange rounded shadow transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                <Image src="/logout.svg" alt="Déconnexion" width={20} height={20} />
              </div>
              <h4 className="font-medium text-white ">Déconnexion</h4>
            </div>
            <Image src="/arrow-return-white.svg" alt="Flèche" width={16} height={16} />
          </button>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 INA CI. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;