'use client';

import { Storage } from '@/lib/storage';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateJournalPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = () => {
    // Simulation of image upload (adding a placeholder image)
    const newImage = `/journal-image-${images.length + 1}.jpg`;
    setImages([...images, newImage]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // In a real app, 'content' would be the full entry, 
    // but here description seems to be the main content field in the UI
    Storage.addJournal({
      title,
      description,
      content: description, 
      images
    });

    setTimeout(() => {
      router.push('/journal');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0] pb-10">
      {/* Header */}
      <div className="px-4 py-4">
        <button onClick={() => router.back()} className="p-1">
          <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} />
        </button>
      </div>

      {/* Hero Image */}
      <div className="px-4 mb-8">
        <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
          <Image 
            src="/journal-banner-create.jpg" 
            alt="Hero" 
            fill 
            className="object-cover"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 space-y-8">
        <div>
          <label className="block text-gray-800 font-bold text-lg mb-2">Titre</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Donnez un titre à votre pensée"
            className="w-full bg-transparent border-b-2 border-gray-300 focus:border-[#E86C00] outline-none py-2 text-gray-800 transition-colors px-1"
            required
          />
        </div>

        <div>
          <label className="block text-gray-800 font-bold text-lg mb-2">Description</label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exprimez-vous ici..."
              rows={8}
              className="w-full bg-white/50 rounded-2xl border border-gray-200 focus:border-[#E86C00] outline-none p-4 text-gray-800 transition-colors resize-none shadow-sm"
              required
            />
          </div>
        </div>

        {/* Image Upload Area */}
        <div>
          <div 
            onClick={handleImageUpload}
            className="border-2 border-dashed border-gray-400 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors group"
          >
            <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-[#FFF5EB] transition-colors">
              <Upload className="text-gray-500 group-hover:text-[#E86C00]" size={24} />
            </div>
            <p className="text-gray-500 font-medium text-sm">Ajouter des images(optionnelles )</p>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 ml-1">Attach file. File size of your documents should not exceed 10MB</p>
        </div>

        {/* Selected Images Preview */}
        {images.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md group">
                <Image src={img} alt="preview" fill className="object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            id="create-journal-submit-btn"
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="w-full bg-[#00569E] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#004a87] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Création en cours...' : 'Créer un nouveau journal'}
          </button>
        </div>
      </form>
    </div>
  );
}
