"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Shield,
  Video,
  Phone,
  CheckCircle,
  Download,
  Share2,
  Printer,
  ArrowRight,
  Banknote,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function RecapPage() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "completed" | "failed"
  >("processing");
  const [animationStep, setAnimationStep] = useState(0);
  const [moneyPosition, setMoneyPosition] = useState(0); // 0: user, 1: moov, 2: doctor
  const [currentMessage, setCurrentMessage] = useState("Initialisation du paiement...");
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const handleConfirm = () => {
    setShowPaymentModal(true);
    setPaymentStatus("processing");
    startPaymentAnimation();
  };

  const startPaymentAnimation = () => {
    setAnimationStep(0);
    setMoneyPosition(0);
    setCurrentMessage("Initialisation du paiement...");
    setShowProgressBar(false);
    setProgress(0);
    
    // Séquence réaliste avec latences
    setTimeout(() => {
      setAnimationStep(1);
      setCurrentMessage("Vérification des informations...");
      simulateProgress(15, 800);
    }, 800);

    setTimeout(() => {
      setAnimationStep(2);
      setCurrentMessage("Contact de l'opérateur Moov Africa...");
      simulateProgress(30, 1200);
    }, 2000);

    setTimeout(() => {
      setAnimationStep(3);
      setMoneyPosition(1);
      setCurrentMessage("Transfert vers Moov Africa...");
      simulateProgress(45, 1000);
    }, 3500);

    setTimeout(() => {
      setAnimationStep(4);
      setCurrentMessage("Vérification du solde...");
      simulateProgress(60, 1500);
    }, 4800);

    setTimeout(() => {
      setAnimationStep(5);
      setCurrentMessage("Débit en cours...");
      simulateProgress(75, 1200);
    }, 6500);

    setTimeout(() => {
      setAnimationStep(6);
      setCurrentMessage("Confirmation par l'opérateur...");
      simulateProgress(85, 1800);
    }, 8000);

    setTimeout(() => {
      setAnimationStep(7);
      setMoneyPosition(2);
      setCurrentMessage("Transfert vers le docteur...");
      simulateProgress(95, 1400);
    }, 10000);

    setTimeout(() => {
      setAnimationStep(8);
      setCurrentMessage("Finalisation de la transaction...");
      simulateProgress(100, 800);
    }, 11800);

    setTimeout(() => {
      setPaymentStatus("completed");
      setCurrentMessage("Paiement traité avec succès !");
      
      setTimeout(() => {
        setShowPaymentModal(false);
        setIsConfirmed(true);
        router.push("/experts/great");
      }, 2500);
    }, 12800);
  };

  const simulateProgress = (targetProgress: number, duration: number) => {
    setShowProgressBar(true);
    const steps = 20;
    const increment = (targetProgress - progress) / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(interval);
        return;
      }
      setProgress(prev => Math.min(prev + increment, targetProgress));
      currentStep++;
    }, stepDuration);
  };

  const handleDownload = () => {
    const content = `Récapitulatif de Rendez-vous\n\nID: RV-2024-015\nPatient: [Pseudonyme]\nProfessionnel: Dr. Aïcha Koné\nDate: Lundi 15 Janvier 2024\nHoraire: 14h00 - 14h50`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recap-RV-2024-015.txt`;
    a.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Récapitulatif RV RV-2024-015`,
          text: `Rendez-vous médical avec Dr. Aïcha Koné le Lundi 15 Janvier 2024 à 14h00`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Partage annulé", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papier !");
    }
  };

  const appointmentDetails = {
    id: "RV-2024-015",
    patient: {
      pseudonyme: "[Pseudonyme]",
      id: "PT-7382",
    },
    professional: {
      name: "Dr. Aïcha Koné",
      specialty: "Psychiatre",
    },
    date: "Lundi 15 Janvier 2024",
    time: "14h00 - 14h50",
    duration: "50 minutes",
    format: "Visioconférence sécurisée",
    confidentiality: "Niveau maximum",
    phone: "+225 01 02 03 04 05",
    partner: "Moov Africa",
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 relative">
      {/* Modal de paiement */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-modalIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Traitement du paiement
              </h2>
              <p className="text-gray-600">
                Votre réservation est en cours de traitement...
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-700 ${
                    moneyPosition === 0 ? "bg-green-100 ring-2 ring-green-300 shadow-md" : "bg-gray-100"
                  }`}>
                    <User className={`h-8 w-8 transition-colors duration-700 ${
                      moneyPosition === 0 ? "text-primary-orange" : "text-gray-400"
                    }`} />
                    {moneyPosition === 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-orange rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">CFA</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700">Vous</p>
                  <p className="text-xs text-gray-500">10,000 FCFA</p>
                </div>

                <div className="px-2">
                  <div className="relative">
                    <ArrowRight className={`h-6 w-6 transition-all duration-1000 ${
                      animationStep >= 3 ? "text-primary-blue" : "text-gray-300"
                    }`} />
                    {animationStep >= 3 && animationStep < 7 && (
                      <div className="absolute top-0 left-0 w-6 h-1 bg-blue-500 rounded-full animate-moneyTransfer1"></div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-700 ${
                    moneyPosition === 1 ? "bg-purple-100 ring-2 ring-purple-300 shadow-md" : "bg-gray-100"
                  }`}>
                    <div className="flex items-center justify-center">
                      <Image 
                        src={"/moov.svg"} 
                        alt="moov" 
                        width={30} 
                        height={30}
                        className={`transition-all duration-700 ${
                          moneyPosition === 1 ? "scale-110" : "scale-100"
                        }`}
                      />
                    </div>
                    {moneyPosition === 1 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">CFA</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700">Moov Africa</p>
                  <p className="text-xs text-gray-500">Opérateur</p>
                </div>

                <div className="px-2">
                  <div className="relative">
                    <ArrowRight className={`h-6 w-6 transition-all duration-1000 ${
                      animationStep >= 7 ? "text-blue-500" : "text-gray-300"
                    }`} />
                    {animationStep >= 7 && animationStep < 8 && (
                      <div className="absolute top-0 left-0 w-6 h-1 bg-blue-500 rounded-full animate-moneyTransfer2"></div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 transition-all duration-700 ${
                    moneyPosition === 2 ? "bg-blue-100 ring-2 ring-blue-300 shadow-md" : "bg-gray-100"
                  }`}>
                    <span className={`text-2xl font-bold transition-colors duration-700 ${
                      moneyPosition === 2 ? "text-primary-blue" : "text-gray-400"
                    }`}>Dr</span>
                    {moneyPosition === 2 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-xs font-bold">CFA</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-700">Dr. Koné</p>
                  <p className="text-xs text-gray-500">Psychiatre</p>
                </div>
              </div>

              {showProgressBar && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>0%</span>
                    <span>{Math.round(progress)}%</span>
                    <span>100%</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-linear-to-r from-primary-orange via-primary-light to-primary-blue transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                    <div className="absolute inset-0 flex">
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={i} 
                          className="h-full w-px bg-gray-300"
                          style={{ marginLeft: `${(i + 1) * 10}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center min-h-12 flex items-center justify-center">
                <div className="relative">
                  <p className={`text-sm font-medium transition-all duration-500 ${
                    animationStep < 8 ? "text-blue-600" : "text-green-600"
                  }`}>
                    {currentMessage}
                    {animationStep < 8 && (
                      <span className="inline-block ml-2">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>.</span>
                        <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>.</span>
                      </span>
                    )}
                  </p>
                  
                  {paymentStatus === "processing" && animationStep < 8 && (
                    <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-blue border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Consultation</span>
                  <span className="font-medium">10,000 FCFA</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Frais de transaction</span>
                  <span className="text-gray-500">500 FCFA</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total à payer</span>
                    <span className="font-bold text-lg">10,500 FCFA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages de statut */}
            {paymentStatus === "processing" && (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-blue border-t-transparent"></div>
                    <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary-blue opacity-30"></div>
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">Traitement en cours</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Veuillez ne pas fermer cette fenêtre ni rafraîchir la page
                  </p>
                </div>
              </div>
            )}

            {paymentStatus === "completed" && (
              <div className="text-center animate-successIn">
                <p className="text-primary-blue font-bold text-xl mb-2">
                  Paiement réussi !
                </p>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Votre rendez-vous est maintenant confirmé
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="h-3 w-3" />
                    <span>Transaction: #{Math.floor(Math.random() * 1000000)}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 animate-pulse">
                    Redirection vers la confirmation...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="px-4 py-4 mt-1.5">
          <Image src={"/arrow-return.svg"} alt="retour" width={25} height={25} />
        </div>
        <header className="mb-8 px-4">
          <h1 className="text-xl md:text-4xl font-bold text-gray-800 mb-2">
            Récapitulatif du Rendez-vous
          </h1>
          <p className="text-gray-600">
            Veuillez vérifier les détails de votre rendez-vous
          </p>
        </header>

        <div className="grid grid-cols-1 px-4 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card ">
              <div className="mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-light rounded-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        RENDEZ-VOUS
                      </span>
                      <h2 className="text-xl font-bold text-gray-800">
                        #{appointmentDetails.id}
                      </h2>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        isConfirmed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {isConfirmed ? "Confirmé" : "En attente"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Détails du patient */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-blue" />
                  Informations Patient
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Pseudonyme</p>
                      <p className="font-medium text-gray-800">
                        {appointmentDetails.patient.pseudonyme}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID Patient</p>
                      <p className="font-medium text-gray-800">
                        {appointmentDetails.patient.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails du professionnel */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Professionnel de santé
                </h3>
                <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-blue font-bold text-lg">Dr</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {appointmentDetails.professional.name}
                    </h4>
                    <p className="text-primary-blue font-medium">
                      {appointmentDetails.professional.specialty}
                    </p>
                  </div>
                </div>
              </div>

              {/* Détails du rendez-vous */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary-blue" />
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">{appointmentDetails.date}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-primary-blue" />
                      <div>
                        <p className="text-sm text-gray-500">Horaire</p>
                        <p className="font-medium">{appointmentDetails.time}</p>
                        <p className="text-sm text-gray-500">
                          ({appointmentDetails.duration})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Video className="h-5 w-5 text-primary-blue" />
                      <div>
                        <p className="text-sm text-gray-500">Format</p>
                        <p className="font-medium">
                          {appointmentDetails.format}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-primary-orange" />
                      <div>
                        <p className="text-sm text-gray-500">Confidentialité</p>
                        <p className="font-medium text-primary-orange">
                          {appointmentDetails.confidentiality}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary-blue" />
                    <div>
                      <p className="text-sm text-gray-500">Contact de réservation</p>
                      <p className="font-medium text-lg">
                        {appointmentDetails.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partenaire */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Sélectionnez un moyen de paiement
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {appointmentDetails.partner}
                    </p>
                    <p className="text-sm text-gray-500">
                      Partenaire technologique
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <Image src={"/moov.svg"} width={120} height={120} alt="logo-moov"/>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-6">
                Actions
              </h3>

              {/* Bouton principal */}
              <button
                onClick={handleConfirm}
                disabled={isConfirmed}
                className={`w-full mb-4 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all ${
                  isConfirmed
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-primary-blue hover:bg-primary-light text-white hover:shadow-lg"
                }`}
              >
                {isConfirmed ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Rendez-vous confirmé
                  </>
                ) : (
                  "Finaliser la réservation"
                )}
              </button>

              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Télécharger le récapitulatif
                </button>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Imprimer
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-medium text-gray-700 mb-3">Important</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="h-2 w-2 bg-primary-blue rounded-full"></div>
                    </div>
                    <span>
                      Veuillez vous connecter 5 minutes avant l'horaire
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="h-2 w-2 bg-primary-blue rounded-full"></div>
                    </div>
                    <span>
                      Assurez-vous d'avoir une connexion internet stable
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center">
                      <div className="h-2 w-2 bg-primary-blue rounded-full"></div>
                    </div>
                    <span>
                      Toutes les consultations sont strictement confidentielles
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>
            © 2025 Experts - Plateforme Médicale Sécurisée. Tous droits
            réservés.
          </p>
          <p className="mt-1">
            Ce rendez-vous est protégé par un chiffrement de niveau médical.
          </p>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes modalIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes successIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes moneyTransfer1 {
          0% {
            transform: translateX(0) scaleX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(3px) scaleX(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translateX(6px) scaleX(0);
            opacity: 0;
          }
        }
        
        @keyframes moneyTransfer2 {
          0% {
            transform: translateX(0) scaleX(0);
            opacity: 1;
          }
          50% {
            transform: translateX(3px) scaleX(0.5);
            opacity: 0.8;
          }
          100% {
            transform: translateX(6px) scaleX(0);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-modalIn {
          animation: modalIn 0.3s ease-out;
        }
        
        .animate-successIn {
          animation: successIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .animate-moneyTransfer1 {
          animation: moneyTransfer1 1.5s ease-in-out infinite;
        }
        
        .animate-moneyTransfer2 {
          animation: moneyTransfer2 1.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}