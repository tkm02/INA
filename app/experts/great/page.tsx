'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Home, Calendar, Clock, User } from 'lucide-react';
import Image from 'next/image';

const GreatPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const redirectingRef = useRef(false);

  // Générer un ID de transaction stable côté client seulement
  useEffect(() => {
    setTransactionId(
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0')
    );
    setShowConfetti(true);
  }, []);

  useEffect(() => {
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Gestion du compte à rebours
    const startCountdown = () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          const newCount = prev - 1;
          
          if (newCount <= 0) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
              countdownRef.current = null;
            }
            
            // Rediriger après un court délai pour éviter l'erreur de rendu
            setTimeout(() => {
              if (!redirectingRef.current) {
                redirectingRef.current = true;
                router.push('/home');
              }
            }, 100);
            
            return 0;
          }
          
          return newCount;
        });
      }, 1000);
    };

    startCountdown();

    return () => {
      clearTimeout(confettiTimer);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [router]);

  const appointmentDetails = {
    id: 'RV-2024-015',
    patient: {
      pseudonyme: '[Pseudonyme]',
      id: 'PT-7382'
    },
    professional: {
      name: 'Dr. Aïcha Koné',
      specialty: 'Psychiatre'
    },
    date: 'Lundi 15 Janvier 2024',
    time: '14h00 - 14h50',
    duration: '50 minutes'
  };

  const confettiColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  const handleRedirectNow = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    if (!redirectingRef.current) {
      redirectingRef.current = true;
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen bg-lienar-to-b from-green-50 to-white p-4 md:p-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${((i * 37) % 100)}%`, 
                top: '-20px',
                backgroundColor: confettiColors[i % confettiColors.length],
                animationDelay: `${(i * 0.02) % 3}s`,
                animationDuration: `${2 + ((i * 17) % 2)}s`, 
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-2xl mx-auto relative z-10">
       
        <div className="bg-white rounded-xl p-6 md:p-8 mb-6 border border-green-100">
          <div className="text-center mb-8">
            <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-6">
              Merci, votre réservation a été prise en compte
            </h1>
            
            <div className="space-y-4 text-lg text-gray-700 max-w-xl mx-auto">
              <p className="text-2xl font-semibold text-primary-orange">
                Votre rendez-vous est confirmé
              </p>
              <p className="text-xl">
                Nous comptons sur votre présence.
              </p>
            </div>
          </div>
          
          <div className="bg-lienar-to-r from-blue-50 to-green-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Paiement sécurisé par</p>
                <p className="text-lg font-bold text-gray-800">Moov Africa</p>
                <p className="text-sm text-gray-600">Transaction #{transactionId || '000000'}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                  <Image 
                    src={"/moov.svg"} 
                    alt="Moov Africa" 
                    width={40} 
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">10,500 FCFA</p>
                  <p className="text-sm text-primary-orange">Payé ✓</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compte à rebours */}
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="inline-flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-primary-blue flex items-center justify-center">
                  <span className="text-primary-blue font-bold">{countdown}</span>
                </div>
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-blue-500 opacity-30"></div>
              </div>
              <div className="text-left">
                <p className="text-gray-700 font-medium">
                  Redirection automatique vers l'accueil
                </p>
                <p className="text-sm text-gray-500">
                  Dans {countdown} seconde{countdown !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                onClick={handleRedirectNow}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-primary-light transition-colors"
              >
                
                Retourner à l'accueil maintenant
              </button>
            </div>
          </div>
        </div>

        {/* Informations utiles */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Prochaines étapes</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Vous recevrez un email de confirmation</p>
                <p className="text-sm text-gray-600">Avec tous les détails de votre rendez-vous</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Rappel avant le rendez-vous</p>
                <p className="text-sm text-gray-600">Nous vous enverrons un rappel 24h avant</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-800">Accès à la consultation</p>
                <p className="text-sm text-gray-600">Le lien de visioconférence vous sera envoyé par email</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          75%, 100% {
            transform: scale(1.2);
            opacity: 0;
          }
        }
        
        .animate-confetti {
          animation: confetti linear forwards;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default GreatPage;