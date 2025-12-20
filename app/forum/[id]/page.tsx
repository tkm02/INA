"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Forum } from "../page";

const ForumDetailPage = () => {
  const [activeTab, setActiveTab] = useState("description");
  const router = useRouter();
  const params = useParams();
  const forumId = params.id as string;

  const forums: Forum[] = [
    {
      id: 1,
      name: "Anxiété",
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=400&fit=crop",
      members: "15K+",
      rating: 4.5,
      description:
        "Espace de soutien pour comprendre et gérer l'anxiété avec l'aide d'experts ivoiriens en santé mentale.",
      images: [
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 2,
      name: "Dépression",
      image:
        "https://images.unsplash.com/photo-1494199505258-5f95387f933c?w=400&h=400&fit=crop",
      members: "12K+",
      rating: 4.6,
      description:
        "Ressources et soutien pour faire face à la dépression, partagés par des professionnels ivoiriens.",
      images: [
        "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 3,
      name: "Stress",
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop",
      members: "18K+",
      rating: 4.4,
      description:
        "Techniques validées par des experts pour gérer le stress dans le contexte ivoirien.",
      images: [
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&h=600&fit=crop",
      ],
    },
    {
      id: 4,
      name: "Bien-être",
      image:
        "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=400&fit=crop",
      members: "20K+",
      rating: 4.7,
      description:
        "Conseils d'experts ivoiriens pour cultiver le bien-être mental et émotionnel.",
      images: [
        "https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      ],
    },
  ];

  const challenges = [
    {
      id: 1,
      title: "Programme Anti-Stress : 7 Jours",
      description:
        "Rejoignez notre programme de 7 jours conçu par des psychologues ivoiriens pour réduire le stress et retrouver la sérénité.",
      reward: "Obtenez 500 pièces",
      participants: "300+",
      slots: 8,
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
    },
    {
      id: 2,
      title: "Méditation Guidée : 5 Jours",
      description:
        "Programme de méditation guidée développé par des experts ivoiriens en pleine conscience.",
      reward: "Obtenez 500 pièces",
      participants: "250+",
      slots: 12,
      image:
        "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=600&fit=crop",
    },
  ];

  const forum = forums.find((item) => item.id.toString() === forumId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="relative h-80">
          <img
            src={forum?.image}
            alt={forum?.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="absolute top-6 left-6 p-2 bg-white/20 backdrop-blur-md rounded-full text-orange-500 cursor-pointer"
            onClick={() => router.push("/forum")}
          >
            <Image
              src="/arrow-return.svg"
              alt="Retour"
              width={24}
              height={24}
            />
          </motion.button>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-white text-4xl font-bold mb-2">
              {forum?.name}
            </h1>
            <div className="flex items-center text-white/90 mb-4">
              <Star className="w-5 h-5 fill-orange-400 text-orange-400 mr-1" />
              <span>
                {forum?.rating} ({forum?.members} membres)
              </span>
            </div>
            <p className="text-white/90 mb-4">{forum?.description}</p>
            <button className="bg-white text-primary-blue px-8 py-3 rounded-full font-medium">
              Réjoindre →
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex gap-6 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-3 font-medium transition-colors relative ${
                activeTab === "description"
                  ? "text-primary-blue"
                  : "text-gray-500"
              }`}
            >
              Description
              {activeTab === "description" && (
                <motion.div
                  layoutId="detailTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("challenges")}
              className={`pb-3 font-medium transition-colors relative ${
                activeTab === "challenges"
                  ? "text-primary-blue"
                  : "text-gray-500"
              }`}
            >
              Challenges
              {activeTab === "challenges" && (
                <motion.div
                  layoutId="detailTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"
                />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  Bienvenue dans la Communauté {forum?.name} 👋
                </h2>
                <p className="text-gray-600 mb-8">
                  Un espace de soutien où praticiens et passionnés ivoiriens se
                  réunissent pour explorer le pouvoir transformateur du
                  bien-être mental, favorisant la croissance, la connexion et
                  l'auto-guérison dans notre contexte culturel africain.
                  Rejoignez-nous dans ce voyage vers le bien-être et l'harmonie
                  intérieure.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {forum?.images?.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-2xl overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${forum?.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "challenges" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {challenges.map((challenge) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded overflow-hidden shadow"
                  >
                    <div className="relative">
                      <img
                        src={challenge.image}
                        alt={challenge.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                        {challenge.slots} slots left
                      </div>
                      <button className="absolute inset-0 m-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-gray-800 ml-1" />
                      </button>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {challenge.description}
                      </p>
                      <p className="text-primary-blue font-medium mb-4">
                        Récompense : {challenge.reward}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-primary-blue border-2 border-white"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {challenge.participants} ils m’ont rejoint
                          </span>
                        </div>
                        <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium hover:bg-orange-600 transition-colors">
                          Débuter
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForumDetailPage;
