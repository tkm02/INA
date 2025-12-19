'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mb-8"
      >
        <div className="text-[120px] font-black text-gray-200 leading-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-16 h-16 bg-primary-blue rounded-2xl flex items-center justify-center shadow-lg rotate-12">
             <span className="text-white font-bold text-lg">INA</span>
           </div>
        </div>
      </motion.div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2">Où êtes-vous ?</h2>
      <p className="text-gray-500 mb-10 max-w-xs mx-auto">
        Il semblerait que cette page n'existe plus ou n'ait jamais existé.
      </p>

      <Link
        href="/home"
        className="px-10 py-4 bg-primary-blue text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all inline-block"
      >
        Retourner à l'accueil
      </Link>
    </div>
  );
}
