'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-primary-blue rounded-3xl flex items-center justify-center mb-6 shadow-xl"
      >
        <span className="text-white font-bold text-xl">INA</span>
      </motion.div>
      
      <h2 className="text-2xl font-black text-gray-900 mb-2">Oups, un petit souci !</h2>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto">
        L'application a rencontré une erreur inattendue. Ne vous inquiétez pas, vos données sont en sécurité.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="w-full py-4 bg-primary-orange text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          Réessayer
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full py-4 bg-white text-gray-600 rounded-2xl font-bold border border-gray-100 active:scale-95 transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
      
      <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest font-black">
        Code erreur: {error.digest || 'UNKNOWN_ERR'}
      </p>
    </div>
  );
}
