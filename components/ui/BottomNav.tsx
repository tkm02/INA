'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type TabId = 'home' | 'forum' | 'agent-ai' | 'parametres';
type RoutePath = '/home' | '/forum' | '/agent-ai' | '/parametres';

export default function BottomNavigation() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('home');

  const handleNavigation = (tab: TabId, route: RoutePath) => {
    setActiveTab(tab);
    router.push(route);
  };

  const tabs: Array<{id: TabId, label: string, icon: string, route: RoutePath}> = [
    { id: 'home', label: 'Acceuil', icon: '/home_.svg', route: '/home' },
    { id: 'forum', label: 'Forum', icon: '/forum.svg', route: '/forum' },
    { id: 'agent-ai', label: 'Agent AI', icon: '/agent.svg', route: '/agent-ai' },
    { id: 'parametres', label: 'Paramètres', icon: '/profile.svg', route: '/parametres' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
      <div className="grid grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => handleNavigation(tab.id, tab.route)}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeTab === tab.id ? 'bg-[#00569E]' : 'bg-gray-100'
            }`}>
              <img 
                src={tab.icon} 
                alt={tab.label} 
                width={20} 
                height={20} 
                className={activeTab === tab.id ? 'invert brightness-0' : ''}
                style={activeTab === tab.id ? { filter: 'brightness(0) invert(1)' } : {}}
              />
            </div>
            <span className={`text-xs font-medium ${
              activeTab === tab.id ? 'text-[#00569E]' : 'text-gray-500'
            }`}>
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}