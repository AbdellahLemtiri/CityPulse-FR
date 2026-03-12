// src/citoyen/HomeFeed.jsx
import { useState, useEffect } from "react";
// import axiosClient from "../config/axiosClient"; // N-7lha mnin y-wjed l-backend

// --- MOCK DATA (Gha n-sta3mlouha 7ta n-rbtou m3a l'API) ---
const mockPosts = [
  {
    id: 1,
    type: "Officiel",
    author: "Rédaction SafiPulse",
    avatar: "https://i.pravatar.cc/150?u=journaliste",
    time: "Il y a 2h",
    isUrgent: true,
    content: "⚠️ Avis important aux habitants du secteur Sud. Coupure d'eau prévue demain de 09h00 à 16h00.",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800",
    likes: 145,
    comments: 34,
  },
  {
    id: 2,
    type: "Quartier",
    author: "Association Al Amal",
    avatar: "https://i.pravatar.cc/150?u=assoc",
    time: "Il y a 5h",
    isUrgent: false,
    content: "Campagne de nettoyage ce dimanche au quartier Plateau. Rejoignez-nous nombreux ! 🧹🌳",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?q=80&w=800",
    likes: 89,
    comments: 12,
  },
  {
    id: 3,
    type: "Officiel",
    author: "Commune de Safi",
    avatar: "https://i.pravatar.cc/150?u=commune",
    time: "Hier",
    isUrgent: false,
    content: "Inauguration du nouveau parc de jeux pour enfants à Lalla Fatna. Un espace moderne et sécurisé pour nos petits.",
    image: "https://images.unsplash.com/photo-1596423735880-5f2a689b903e?q=80&w=800",
    likes: 312,
    comments: 45,
  }
];

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("Tout");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect kay-t3eyet kolma t-beddel 'activeTab'
  useEffect(() => {
    fetchFeed(activeTab);
  }, [activeTab]);

  const fetchFeed = async (category) => {
    setLoading(true);
    
    try {
      /* === KIFASH GHADI T-KHEDMHA M3A L-API B'DESSA7 ===
      let url = "/feed";
      if (category !== "Tout") {
        url = `/feed?type=${category.toLowerCase()}`;
      }
      const response = await axiosClient.get(url);
      setPosts(response.data);
      */

      // === SIMULATION B MOCK DATA ===
      // Kan-simuliw bli l'API kat-tle3 b-ze3ma 0.5s bach n-tchoufou l-chargement
      setTimeout(() => {
        if (category === "Tout") {
          setPosts(mockPosts);
        } else {
          // Kan-filtriw l'mockPosts 3la 7sab l-choix (Officiel wla Quartier)
          const filtered = mockPosts.filter(p => p.type === category);
          setPosts(filtered);
        }
        setLoading(false);
      }, 500);

    } catch (error) {
      console.error("Erreur fetch feed:", error);
      setLoading(false);
    }
  };

  const tabs = ["Tout", "Officiel", "Quartier"];

  return (
    <>
      {/* 1. Les Filtres Fixes (Sticky) */}
      <div className="sticky top-[60px] md:top-0 z-30 glass-nav pt-2 pb-4 px-4 md:px-0 mb-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl flex font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-700 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. L'Affichage dial les Posts */}
      <div className="space-y-6 pb-20 md:pb-0">
        {loading ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined animate-spin text-primary-500 text-4xl">autorenew</span>
            <p className="text-gray-500 mt-2">Chargement de l'actualité...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            Aucune actualité trouvée pour la catégorie "{activeTab}".
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 md:rounded-2xl border-y md:border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in transition-colors duration-300">
              
              {/* Header Post */}
              <div className="p-4 flex items-center gap-3">
                <img src={post.avatar} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" alt="Avatar" />
                <div>
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{post.author}</h3>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">{post.time}</p>
                </div>
                {post.isUrgent && (
                  <span className="ml-auto bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full border border-red-200 dark:border-red-700">
                    URGENT
                  </span>
                )}
              </div>

              {/* Texte du Post */}
              <div className="px-4 pb-3">
                <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed">{post.content}</p>
              </div>

              {/* Image du Post */}
              <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-700 relative cursor-pointer">
                <img src={post.image} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Post" />
              </div>

              {/* Actions (Like, Comment, Share) */}
              <div className="px-2 py-1 flex justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                  <span className="material-symbols-outlined group-hover:text-primary-500 transition-colors">thumb_up</span> {post.likes}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                  <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">comment</span> {post.comments}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                  <span className="material-symbols-outlined group-hover:text-green-500 transition-colors">share</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </>
  );
}