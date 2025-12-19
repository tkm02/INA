'use client';

import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Expert {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  image: string;
  verified: boolean;
}

const experts: Expert[] = [
  {
    id: 1,
    name: 'Dr. Joseph Brostito',
    title: 'Psychologue',
    rating: 4.8,
    reviews: 127,
    image: '👨‍⚕️',
    verified: true,
  },
  {
    id: 2,
    name: 'Dr. Bessie Coleman',
    title: 'Psychothérapeute',
    rating: 4.9,
    reviews: 203,
    image: '👩‍⚕️',
    verified: true,
  },
  {
    id: 3,
    name: 'Dr. Bessie Coleman',
    title: 'Psychanalyste',
    rating: 4.7,
    reviews: 156,
    image: '👩‍⚕️',
    verified: true,
  },
  {
    id: 4,
    name: 'Dr. Babe Didrikson',
    title: 'Sophrologue',
    rating: 4.6,
    reviews: 89,
    image: '👩‍⚕️',
    verified: true,
  },
];

export default function ExpertsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-green-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={24} className="text-[#E86C00]" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Experts</h1>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un expert"
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#00569E]"
          />
        </div>
      </div>

      {/* Expert List */}
      <div className="px-4 space-y-4">
        {experts.map((expert) => (
          <Link
            key={expert.id}
            href={`/experts/${expert.id}`}
            className="block bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#00569E] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                {expert.image}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{expert.name}</h3>
                  {expert.verified && (
                    <span className="text-[#00569E]">✓</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{expert.title}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">📅</span>
                    <span className="text-gray-600">Sunday, 12 June</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">🕐</span>
                    <span className="text-gray-600">11:00 - 12:00 AM</span>
                  </div>
                </div>
                <button className="mt-3 text-[#00569E] text-sm font-medium">
                  Detail
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
