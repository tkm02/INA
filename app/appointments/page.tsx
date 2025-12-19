"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const AppointmentsPage = () => {
  const router = useRouter();
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [myExpert, setMyExpert] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  // Initialiser les données côté client uniquement
  useEffect(() => {
    const savedExpert = localStorage.getItem("myExpert");
    if (savedExpert) {
      setMyExpert(JSON.parse(savedExpert));
    }

    setCurrentDate(
      new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  const defaultExperts = [
    {
      id: "1",
      name: "Dr. Kwame Nkrumah",
      title: "Psychologue",
      rating: "4.8/5",
      reviews: "(127 avis)",
      image: "/african-expert1.jpg",
      specialty: "Thérapie cognitive",
    },
    {
      id: "2",
      name: "Dr. Amina Diop",
      title: "Psychiatre",
      rating: "4.9/5",
      reviews: "(89 avis)",
      image: "/african-expert2.jpg",
      specialty: "Santé mentale",
    },
    {
      id: "3",
      name: "Dr. Chukwuma Okeke",
      title: "Thérapeute",
      rating: "4.7/5",
      reviews: "(156 avis)",
      image: "/african-expert3.jpg",
      specialty: "Counseling",
    },
    {
      id: "4",
      name: "Dr. Fatou Sow",
      title: "Psychologue clinicien",
      rating: "4.8/5",
      reviews: "(112 avis)",
      image: "/african-expert4.jpg",
      specialty: "Traumatologie",
    },
  ];

  const experts = myExpert ? [myExpert] : defaultExperts;

  const timeSlots = {
    morning: [
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
    ],
    afternoon: [
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
    ],
    evening: [
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
    ],
  };

  const handleExpertSelect = (expertId: string) => {
    setSelectedExpert(expertId);
    if (myExpert && expertId === myExpert.id) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleTimeSelect = (time: string, period: string) => {
    setSelectedTime(time);
    setSelectedPeriod(period);
  };

  const handleConfirm = async () => {
    if (!selectedExpert || !selectedTime) {
      alert("Veuillez sélectionner un expert et un créneau horaire");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const selectedExpertInfo = experts.find(
        (expert) => expert.id === selectedExpert
      );

      const appointmentData = {
        expertId: selectedExpert,
        expertName: selectedExpertInfo?.name,
        expertTitle: selectedExpertInfo?.title,
        time: selectedTime,
        period: selectedPeriod,
        date: new Date().toLocaleDateString("fr-FR"),
        timestamp: new Date().toISOString(),
        notificationTime: "30 minutes avant la séance",
      };

      localStorage.setItem("myExpert", JSON.stringify(selectedExpertInfo));
      localStorage.setItem("appointment", JSON.stringify(appointmentData));

      setMyExpert(selectedExpertInfo);

      setLoading(false);
      setShowConfirmation(true);

      console.log(
        `Notification programmée : Vous recevrez un rappel 30 minutes avant votre séance avec ${appointmentData.expertName} à ${appointmentData.time}`
      );
    }, 1500);
  };

  const closeModal = () => {
    setShowConfirmation(false);
    router.push("/home");
  };

  return (
    <div className="p-2">
      {/*

     {myExpert && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            👨‍⚕️ Votre Expert Attitré
          </h2>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Image
                src={myExpert.image || "/user.svg"}
                alt={myExpert.name}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{myExpert.name}</h3>
              <p className="text-sm text-gray-600">{myExpert.title}</p>
            </div>
          </div>
        </div>
      )}
*/}
      <div className="p-6 md:p-8">
        <button onClick={() => router.back()} className="p-1 mb-4">
          <Image src="/arrow-return.svg" alt="Retour" width={24} height={24} />
        </button>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="mt-4 md:mt-0">
              <div className="text-lg text-center font-semibold text-gray-700">
                Today, {currentDate || "Chargement..."}
              </div>
            </div>
          </div>

          {experts.map((expert) => (
            <div
              key={expert.id}
              className={`mb-4 p-3 border rounded hover:bg-gray-50 transition-colors cursor-pointer ${
                selectedExpert === expert.id
                  ? "border-primary-blue bg-blue-50"
                  : "border-gray-200"
              }`}
              onClick={() => handleExpertSelect(expert.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <Image
                      src={expert.image || "/user.svg"}
                      alt={expert.name}
                      width={60}
                      height={60}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{expert.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-primary-light">{expert.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {expert.specialty}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Image
                    src={"/verify.svg"}
                    alt="certificate"
                    width={25}
                    height={25}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicateur de sélection */}
        {(selectedExpert || selectedTime) && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              {selectedExpert &&
                `Expert sélectionné: ${
                  experts.find((e) => e.id === selectedExpert)?.name
                }`}
              {selectedExpert && selectedTime && " • "}
              {selectedTime && `Horaire: ${selectedTime} (${selectedPeriod})`}
            </p>
          </div>
        )}

        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">La matinée</h2>
            <span className="text-primary-blue px-4 py-1 rounded-full">
              7 (disponible)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {timeSlots.morning.map((time, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(time, "matin")}
                className={`font-medium py-3 px-2 rounded-lg transition-colors duration-200 ${
                  selectedTime === time && selectedPeriod === "matin"
                    ? "bg-primary-blue text-white border-primary-blue"
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-200 text-primary-blue"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex font-medium justify-between items-center mb-4">
            <h2 className="text-lg text-gray-800">L'après midi</h2>
            <span className="text-primary-blue px-4 py-1 rounded-full">
              5 (disponible)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {timeSlots.afternoon.map((time, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(time, "après-midi")}
                className={`font-medium py-3 px-2 rounded-lg transition-colors duration-200 ${
                  selectedTime === time && selectedPeriod === "après-midi"
                    ? "bg-primary-blue text-white border-primary-blue"
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-200 text-primary-blue"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Le soir</h2>
            <span className="text-primary-blue px-4 py-1 rounded-full">
              3 (disponible)
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
            {timeSlots.evening.map((time, index) => (
              <button
                key={index}
                onClick={() => handleTimeSelect(time, "soir")}
                className={`font-medium py-3 px-2 rounded-lg transition-colors duration-200 ${
                  selectedTime === time && selectedPeriod === "soir"
                    ? "bg-primary-blue text-white border-primary-blue"
                    : "bg-blue-50 hover:bg-blue-100 border border-blue-200 text-primary-blue"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={!selectedExpert || !selectedTime || loading}
            className={`w-full py-4 px-6 rounded text-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${
              selectedExpert && selectedTime
                ? "bg-primary-blue hover:bg-primary-light text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Confirmation en cours...
              </>
            ) : (
              "Confirmer"
            )}
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/check-circle.svg"
                  alt="Succès"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ✅ Séance confirmée !
              </h3>
              <p className="text-gray-600 mb-4">
                Votre séance a été prise en compte avec succès.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="font-medium">
                  Expert: {experts.find((e) => e.id === selectedExpert)?.name}
                </p>
                <p className="font-medium">
                  Horaire: {selectedTime} ({selectedPeriod})
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  📱 Vous recevrez une notification 30 minutes avant votre
                  séance.
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg mb-6">
                <p className="text-sm text-yellow-800">
                  Votre expert est maintenant sauvegardé comme{" "}
                  <strong>votre expert attitré</strong> dans votre profil.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-full bg-primary-blue text-white py-3 rounded font-medium hover:bg-primary-light transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cet expert est déjà votre expert attitré</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
