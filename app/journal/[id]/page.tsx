'use client';

import { JournalEntry, Storage } from '@/lib/storage';
import { Calendar, Share2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function JournalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [aiAccess, setAiAccess] = useState(false);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const journals = Storage.getJournals();
    const entry = journals.find(j => j.id === id);
    if (entry) {
      setJournal(entry);
      setEditTitle(entry.title);
      setEditDescription(entry.description);
    }
    setAiAccess(Storage.getJournalAiAccess());
  }, [id]);

  const handleSave = () => {
    if (!journal) return;
    setIsSaving(true);
    
    const updatedEntry = Storage.updateJournal(id, {
      title: editTitle,
      description: editDescription,
      content: editDescription // Assuming content mirrors description for now
    });

    if (updatedEntry) {
      setJournal(updatedEntry);
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    if (journal) {
      setEditTitle(journal.title);
      setEditDescription(journal.description);
    }
    setIsEditing(false);
  };

  if (!journal) {
    return (
      <div className="min-h-screen bg-[#FFFFF0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-1">
          <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} />
        </button>
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[#00569E] font-medium text-sm bg-blue-50 px-3 py-1 rounded-full border border-blue-100 active:scale-95 transition-all"
            >
              Éditer
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={handleCancel}
                className="text-gray-500 font-medium text-sm px-3 py-1 active:scale-95 transition-all"
                disabled={isSaving}
              >
                Annuler
              </button>
              <button 
                onClick={handleSave}
                className="text-white font-medium text-sm bg-[#00569E] px-3 py-1 rounded-full border border-blue-100 active:scale-95 transition-all"
                disabled={isSaving}
              >
                {isSaving ? '...' : 'Enregistrer'}
              </button>
            </div>
          )}
          
          <button className="p-1">
            <Share2 size={24} className="text-[#00569E]" />
          </button>
        </div>
      </div>

      <div className="px-6 pb-12">
        {/* Title & Info */}
        <div className="text-center mb-8">
          {isEditing ? (
             <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-center text-[#00569E] text-2xl font-bold mb-2 border-b-2 border-dashed border-gray-300 focus:border-[#00569E] outline-none bg-transparent pb-1"
            />
          ) : (
            <h1 className="text-[#00569E] text-2xl font-bold mb-2">{journal.title}</h1>
          )}
          
          <div className="flex items-center justify-center gap-2 text-gray-400 text-xs uppercase tracking-widest">
            <Calendar size={12} />
            <span>{new Date(journal.timestamp).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            {aiAccess && (
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 ml-2">
                <Sparkles size={10} />
                <span className="text-[8px] font-bold">ACCÈS INA</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
          {isEditing ? (
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={10}
              className="w-full bg-gray-50 p-4 rounded-xl border border-gray-200 focus:border-[#00569E] outline-none resize-none text-gray-700"
            />
          ) : (
            journal.content.split('\n').map((para, idx) => (
              <p key={idx}>{para}</p>
            ))
          )}
        </div>

        {/* Image Gallery */}
        {journal.images && journal.images.length > 0 && !isEditing && (
          <div className="mt-12 space-y-4">
            <h2 className="text-gray-900 font-bold text-lg">Souvenirs</h2>
            <div className="grid grid-cols-2 gap-4">
              {journal.images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-gray-50">
                  <img 
                    src={img} 
                    alt={`Journal image ${idx + 1}`} 
                    className="w-full h-full object-cover transition-transform hover:scale-105" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
