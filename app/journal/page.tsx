'use client';

import { JournalEntry, Storage } from '@/lib/storage';
import { Book, Search, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JournalListPage() {
  const router = useRouter();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAccess, setAiAccess] = useState(false);

  useEffect(() => {
    setJournals(Storage.getJournals());
    setAiAccess(Storage.getJournalAiAccess());
  }, []);

  const handleToggleAi = () => {
    const newVal = !aiAccess;
    setAiAccess(newVal);
    Storage.setJournalAiAccess(newVal);
  };

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFFF0] pb-24">
      <div className="px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-1">
            <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} />
          </button>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm border border-orange-100">
           <span className="text-xs font-bold text-gray-600 uppercase">Accès INA</span>
           <button 
             id="ai-access-toggle"
             onClick={handleToggleAi}
             className={`w-10 h-5 rounded-full relative transition-colors ${aiAccess ? 'bg-[#4CAF50]' : 'bg-gray-300'}`}
           >
             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${aiAccess ? 'left-6' : 'left-1'}`} />
           </button>
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 mb-6">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
          <Image 
            src="/journal-banner.jpg" 
            alt="Journal" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10 flex items-end p-4">
             <h1 className="text-white text-2xl font-bold drop-shadow-md">Mon Journal Intime</h1>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un journal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-12 pr-4 py-4 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-[#E86C00] text-gray-800 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Recents */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Récents</h2>
        <span className="bg-[#00569E] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
          {filteredJournals.length}
        </span>
      </div>

      {/* Journal List */}
      <div className="px-4 space-y-4">
        {filteredJournals.length > 0 ? (
          filteredJournals.map((journal) => (
            <div 
              key={journal.id}
              onClick={() => router.push(`/journal/${journal.id}`)}
              className="bg-[#8E9CB2] rounded-xl p-4 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold text-lg">{journal.title}</h3>
                <div className="bg-white/20 p-2 rounded-lg">
                  <Book className="text-white" size={18} />
                </div>
              </div>
              <p className="text-white/80 text-sm line-clamp-2 pr-8">
                {journal.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-white/60 text-[10px] uppercase font-medium">
                  {new Date(journal.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                </span>
                {aiAccess && (
                  <Sparkles size={14} className="text-yellow-300 animate-pulse" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300 shadow-sm border border-gray-50">
               <Book size={32} />
            </div>
            <p className="text-gray-500 font-medium">Aucun journal trouvé</p>
            <p className="text-gray-400 text-xs mt-1">Écrivez vos pensées du jour</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-linear-to-t from-[#FFFFF0] via-[#FFFFF0]/80 to-transparent">
        <button
          id="add-journal-btn"
          onClick={() => router.push('/journal/create')}
          className="w-full bg-[#00569E] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#004a87] transition-all active:scale-95"
        >
          Ajouter un nouveau journal
        </button>
      </div>
    </div>
  );
}
