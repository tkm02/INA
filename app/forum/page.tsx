"use client";

import BottomNavigation from "@/components/ui/BottomNav";
import Search from "@/components/ui/Search";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle, Share2, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface Forum {
  id: number;
  name: string;
  image: string;
  members: string;
  rating: number;
  description: string;
  images?: string[];
}

interface Post {
  id: number;
  author: string;
  location: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  forum: string;
}

interface ForumCardProps {
  forum: Forum;
}

function ForumPage() {
  const [activeTab, setActiveTab] = useState("discussion");
  const router = useRouter();

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
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    ]
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
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop"
    ]
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
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&h=600&fit=crop"
    ]
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
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop"
    ]
  },
];

  const posts: Post[] = [
    {
      id: 1,
      author: "Dr. Koné Aminata",
      location: "Abidjan, Côte d'Ivoire",
      title: "La santé mentale en Afrique",
      content:
        "La santé mentale en Côte d'Ivoire nécessite une approche culturellement adaptée. Nos traditions et valeurs communautaires peuvent être des forces dans le processus de guérison. En tant que professionnels ivoiriens, nous travaillons à intégrer ces richesses culturelles dans nos pratiques thérapeutiques modernes.",
      likes: 234,
      comments: 45,
      forum: "Bien-être",
    },
  ];

  const ForumCard = ({ forum }: ForumCardProps) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded overflow-hidden shadow cursor-pointer"
      onClick={() => router.push(`/forum/${forum.id}`)}
    >
      <div className="relative h-48">
        <img
          src={forum.image}
          alt={forum.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-2xl font-bold mb-2">{forum.name}</h3>
          <div className="flex items-center text-white/90 text-sm">
            <Star className="w-4 h-4 fill-primary-orange text-primary-orange mr-1" />
            <span>
              {forum.rating} ({forum.members} membres)
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <button className="w-full bg-primary-blue text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
          Voir le forum
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <button
          className="mb-6 p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          onClick={() => router.push("/home")}
        >
          <Image
            src="/arrow-return.svg"
            alt="Retour"
            width={24}
            height={24}
          />
        </button>

        <div className="mb-6">
          <Search />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Tous les forums</h2>
          <button className="text-primary-orange">Voir tout</button>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {forums.map((forum) => (
            <motion.div
              key={forum.id}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 text-center cursor-pointer"
              onClick={() => router.push(`/forum/${forum.id}`)}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-2 border-2 border-white shadow-md">
                <img
                  src={forum.image}
                  alt={forum.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 font-medium">{forum.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("discussion")}
            className={`pb-3 font-medium transition-colors relative ${
              activeTab === "discussion"
                ? "text-primary-blue"
                : "text-primary-light"
            }`}
          >
            Discussion
            {activeTab === "discussion" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("mes-forums")}
            className={`pb-3 font-medium transition-colors relative ${
              activeTab === "mes-forums"
                ? "text-primary-blue"
                : "text-primary-light"
            }`}
          >
            Mes forums
            {activeTab === "mes-forums" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "discussion" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/**   <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-blue" />
                  <input
                    type="text"
                    placeholder="write your post here"
                    className="flex-1 text-gray-400"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium">
                    Publier
                  </button>
                  <button className="text-gray-400 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Add your post in
                  </button>
                </div>
              </div>*/}

              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded p-6 shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      Posté dans{" "}
                      <span className="text-primary-blue font-medium">
                        {post.forum}
                      </span>
                    </div>
                    <button className="text-gray-400 text-sm">
                      voir forum
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-primary-blue" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {post.author}
                      </h3>
                      <p className="text-sm text-gray-500">{post.location}</p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-lg mb-2">{post.title}</h4>
                  <p className="text-gray-600 mb-4">{post.content}</p>

                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-600">
                      <Heart className="w-5 h-5 fill-orange-500 text-orange-500" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 ml-auto">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "mes-forums" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6"
            >
              {forums.map((forum) => (
                <ForumCard key={forum.id} forum={forum} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default ForumPage;
