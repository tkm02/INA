'use client';

import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Clock, Languages, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ExpertDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={24} className="text-[#E86C00]" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Experts - Detail</h1>
      </div>

      {/* Expert Info */}
      <div className="px-6 py-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl flex-shrink-0">
            👨‍⚕️
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">Dr. Joseph Brostito</h2>
              <span className="text-[#00569E]">✓</span>
            </div>
            <p className="text-gray-600">Psychologue</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-semibold">4.8/5</span>
              <span className="text-gray-500 text-sm">(127 avis)</span>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💼</span>
            <h3 className="font-semibold text-gray-900">Spécialités :</h3>
          </div>
          <div className="bg-blue-50 border-l-4 border-[#00569E] p-4 rounded-r-lg">
            <ul className="space-y-1 text-gray-700">
              <li>• Dépression & anxiété</li>
              <li>• Burn-out professionnel</li>
              <li>• Thérapie adolescents</li>
            </ul>
          </div>
        </div>

        {/* Consultations */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💻</span>
            <h3 className="font-semibold text-gray-900">Consultations :</h3>
          </div>
          <div className="space-y-2 text-gray-700">
            <p>• Vidéo : 45 min - 10,000 XOF</p>
            <p>• Forfait 4 séances : 50,000 XOF</p>
            <p>• Délai RDV : 48h en moyenne</p>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={20} className="text-gray-700" />
            <h3 className="font-semibold text-gray-900">Disponible :</h3>
          </div>
          <div className="space-y-1 text-gray-700">
            <p>Lun-Ven : 9h-19h</p>
            <p>Sam : 9h-13h</p>
          </div>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Languages size={20} className="text-gray-700" />
            <h3 className="font-semibold text-gray-900">Langues :</h3>
          </div>
          <p className="text-gray-700">Français, Anglais, Dioula</p>
        </div>

        {/* Location */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={20} className="text-gray-700" />
            <h3 className="font-semibold text-gray-900">Localisation :</h3>
          </div>
          <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center text-gray-500">
            <span>🗺️ Map placeholder</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="primary-orange"
          fullWidth
          onClick={() => alert('Booking functionality')}
          icon={<Calendar size={20} />}
        >
          Prendre un RDV
        </Button>
      </div>
    </div>
  );
}
