'use client';

import { motion } from 'framer-motion';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-primary-blue flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl"
        >
          <span className="text-primary-blue font-black text-2xl">INA</span>
        </motion.div>
        
        <h2 className="text-3xl font-black text-white mb-4">Erreur Critique</h2>
        <p className="text-white/70 mb-10 max-w-xs mx-auto text-lg">
          Une erreur majeure est survenue. Veuillez redémarrer l'application.
        </p>

        <button
          onClick={() => reset()}
          className="px-10 py-5 bg-white text-primary-blue rounded-3xl font-black text-xl shadow-xl active:scale-95 transition-all"
        >
          Redémarrer INA
        </button>
      </body>
    </html>
  );
}
