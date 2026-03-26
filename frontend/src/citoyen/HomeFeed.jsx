import { useState, useEffect } from "react";
import axiosClient from "../config/axios-client"; 
// import { formatDistanceToNow } from "date-fns"; // Optionnel: ila bghiti l-we9t y-ban "Il y a 2h" (npm install date-fns)
// import { fr } from "date-fns/locale";

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("Tout");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

   useEffect(() => {
     setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchFeed(activeTab, 1, false);
  }, [activeTab]);

   const fetchFeed = async (category, pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
 
      let typeParam = 'tout';
      if (category === "Officiel") typeParam = 'office';
      if (category === "Quartier") typeParam = 'quartier';

       const response = await axiosClient.get(`/articles?type=${typeParam}&page=${pageNum}`);
      
      const newPosts = response.data.data; 

       if (isLoadMore) {
         setPosts((prev) => [...prev, ...newPosts]);
      } else {
         setPosts(newPosts);
      }
 
      setHasMore(response.data.current_page < response.data.last_page);
      setPage(response.data.current_page);

    } catch (error) {
      console.error("Erreur fetch feed:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

   const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFeed(activeTab, page + 1, true);
    }
  };

  const tabs = ["Tout", "Officiel", "Quartier"];

  return (
    <>
        <div className="sticky top-[60px] md:top-0 z-30 glass-nav pt-2 pb-4 px-4 md:px-0 mb-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl flex font-bold text-sm shadow-sm border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* FEED CONTENT */}
       <div className="space-y-6 pb-20 md:pb-0 ">
        {loading && page === 1 ? (
          <div className="text-center py-10">
            <span className="material-symbols-outlined animate-spin text-blue-500 text-4xl">autorenew</span>
            <p className="text-gray-500 mt-2">Chargement de l'actualité...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300">
            <span className="material-symbols-outlined text-4xl mb-2 text-gray-400 block">article</span>
            Aucune actualité trouvée pour la catégorie "{activeTab}".
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 md:rounded-2xl border-y md:border border-gray-200 dark:border-gray-700 shadow-sm animate-fade-in transition-colors duration-300 mb-6">
                
                {/* Header Post */}
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 flex items-center justify-center overflow-hidden">
                     {/* Affichage d-l'Avatar d l'utilisateur li posté */}
                    <span className="material-symbols-outlined text-gray-500">account_circle</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                       <h3 className="font-bold text-gray-900 dark:text-gray-100">{post.user.name || "Utilisateur"}</h3>
                      
                       {post.sector_id === null && (
                        <span className="material-symbols-outlined text-blue-500 text-[16px]" title="Compte Officiel">verified</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                       {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Texte du Post */}
                <div className="px-4 pb-3">
                  <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>
                </div>

                {/* Image du Post (Ila kant) */}
                {post.media && post.media.length > 0 && (
                  <div className="w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-700 relative cursor-pointer">
                    {/* Tأكد mn smiyet l-champ dial t-tswira f l-media (file_path wela url) */}
                    <img src={`http://localhost:8000/storage/${post.media[0].file_path}`} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Post" />
                  </div>
                )}

                 <div className="px-2 py-1 flex justify-between border-t border-gray-200 dark:border-gray-700 mt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                    <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">thumb_up</span> 
                    {post.likes_count || 0} 
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                    <span className="material-symbols-outlined group-hover:text-blue-500 transition-colors">comment</span> 
                    {post.comments_count || 0}  
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
                    <span className="material-symbols-outlined group-hover:text-green-500 transition-colors">share</span>
                  </button>
                </div>

              </div>
            ))}

             {hasMore && (
              <div className="text-center py-4">
                <button 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-full text-sm transition-colors disabled:opacity-50 flex items-center justify-center mx-auto gap-2"
                >
                  {loadingMore ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                      Chargement...
                    </>
                  ) : (
                    "Afficher plus d'actualités"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}