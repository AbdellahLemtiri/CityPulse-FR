import { useState, useEffect } from "react";
import axiosClient from "../config/axios-client";  

const currentUser = {
  name: "Abdellah Lemtiri",
  avatar: "https://i.pravatar.cc/150?u=abdellah",
  id: 99  
};
 
const initialPosts = [
  {
    id: 1,
    author: { id: 1, name: "Nadia_Art", avatar: "https://i.pravatar.cc/150?u=1", verified: true },
    location: "Château de Mer, Safi",
    time: "il y a 2h",
    image: "https://images.unsplash.com/photo-1580227974542-c51722880791?q=80&w=800",
    likes: 142,
    caption: "Coucher de soleil magique sur le Château de Mer 🌅✨ La beauté de notre ville est incroyable. J'adore cette vue ! #Safi #Maroc #Sunset",
    liked: false,
    comments: [
      { id: 101, author: "Amine_Photox", avatar: "https://i.pravatar.cc/150?u=11", text: "Tbarkellah, tswira wa3ra bzaf! 📸", time: "1h" },
    ],
  },
  {
    id: 2,
    author: { id: 2, name: "Safi_Surf_Club", avatar: "https://i.pravatar.cc/150?u=2", verified: false },
    location: "Plage Lalla Fatna",
    time: "il y a 5h",
    image: "https://images.unsplash.com/photo-1517983694060-32df9c9bd82c?q=80&w=800",
    likes: 389,
    caption: "Bonnes vagues ce matin ! 🏄‍♂️ L'eau est parfaite.",
    liked: true,
    comments: [],
  }
];

export default function SafiGram() {
  const [posts, setPosts] = useState(initialPosts); // غنردوها useState([]) ملي يخدم API
  const [loading, setLoading] = useState(false);
  
  // States l-formulaire création
  const [isCreating, setIsCreating] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // States l-Modal dial l-post (Affichage complet)
  const [activePost, setActivePost] = useState(null); 
  const [commentText, setCommentText] = useState("");
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  // States l-Modal dial Confirmation (Delete)
  const [postToDelete, setPostToDelete] = useState(null);

  // ==========================================
  // 1. FETCH DATA (GET /api/posts)
  // ==========================================
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // setLoading(true);
    try {
      // ✅ الكود الحقيقي للـ API:
      // const response = await axiosClient.get("/posts");
      // setPosts(response.data); 
    } catch (error) {
      console.error("Erreur récupération posts", error);
    } finally {
      // setLoading(false);
    }
  };

  // ==========================================
  // 2. CREATE POST (POST /api/posts)
  // ==========================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsCreating(true);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    document.getElementById("post-image-input").value = "";
  };

  const cancelPost = () => {
    setCaption("");
    removeImage();
    setIsCreating(false);
  };

  const publishPost = async () => {
    if (!caption && !selectedImage) return;
    setIsPublishing(true);

    try {
      // ✅ الكود الحقيقي للـ API:
      /*
      const formData = new FormData();
      formData.append("caption", caption);
      if (selectedImage) formData.append("image", selectedImage);
      // location تقدر تزيدها حتى هي
      
      const response = await axiosClient.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // نزيدو البوست الجديد فليست
      setPosts([response.data.post, ...posts]);
      */

      // محاكاة (Simulation) باش يبان ليك خدام دابا
      const newPost = {
        id: Date.now(),
        author: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, verified: false },
        location: "Safi",
        time: "À l'instant",
        image: previewUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800",
        likes: 0,
        caption: caption,
        liked: false,
        comments: [],
      };
      setPosts([newPost, ...posts]);
      
      cancelPost();
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error("Erreur publication post", error);
      // hna tqder tzid toast dial l'erreur
    } finally {
      setIsPublishing(false);
    }
  };

  // ==========================================
  // 3. LIKE POST (POST /api/posts/{id}/like)
  // ==========================================
  const toggleLike = async (postId) => {
    // 1. Optimistic Update (نبدلو فالواجهة قبل ما يجاوب السيرفر باش تبان سريعة)
    const isCurrentlyLiked = posts.find(p => p.id === postId)?.liked;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.liked;
        // تحديث المودال إيلا كان محلول
        if (activePost && activePost.id === postId) {
          setActivePost({ ...activePost, liked: isLiked, likes: isLiked ? activePost.likes + 1 : activePost.likes - 1 });
        }
        return { ...post, liked: isLiked, likes: isLiked ? post.likes + 1 : post.likes - 1 };
      }
      return post;
    }));

    // 2. API Call
    try {
      // ✅ الكود الحقيقي للـ API:
      // await axiosClient.post(`/posts/${postId}/like`);
    } catch (error) {
      console.error("Erreur like", error);
      // إيلا وقع موشكيل فالسيرفر، نرجعو البوست كيف كان
      fetchPosts(); 
    }
  };

  const handleModalDoubleClickLike = () => {
    if (activePost && !activePost.liked) {
      toggleLike(activePost.id);
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
  };

  // ==========================================
  // 4. ADD COMMENT (POST /api/posts/{id}/comments)
  // ==========================================
  const submitComment = async () => {
    if (commentText.trim() === "" || !activePost || isCommenting) return;
    setIsCommenting(true);

    try {
      // ✅ الكود الحقيقي للـ API:
      /*
      const response = await axiosClient.post(`/posts/${activePost.id}/comments`, {
        text: commentText
      });
      const newComment = response.data.comment;
      */

      // محاكاة (Simulation)
      const newComment = {
        id: Date.now(),
        author: currentUser.name,
        avatar: currentUser.avatar,
        text: commentText,
        time: "À l'instant",
      };

       const updatedActivePost = { ...activePost, comments: [...activePost.comments, newComment] };
      setActivePost(updatedActivePost);
      setPosts(posts.map(p => p.id === activePost.id ? updatedActivePost : p));
      setCommentText("");

    } catch (error) {
      console.error("Erreur commentaire", error);
    } finally {
      setIsCommenting(false);
    }
  };

  // ==========================================
  // 5. DELETE POST (DELETE /api/posts/{id})
  // ==========================================
  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    try {
      // ✅ الكود الحقيقي للـ API:
      // await axiosClient.delete(`/posts/${postToDelete.id}`);
      
      setPosts(posts.filter(p => p.id !== postToDelete.id));
      setPostToDelete(null);
      if(activePost && activePost.id === postToDelete.id) setActivePost(null);

    } catch (error) {
      console.error("Erreur suppression", error);
    }
  };


  return (
    <>
      {/* ---------------------------------------------------- */}
      {/* ZONE DE CRÉATION */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-8 shadow-sm transition-colors duration-300">
        <div className="flex items-start gap-3">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" alt="Profile" />
          <div className="flex-1">
            <input
              type="text"
              value={caption}
              onChange={(e) => { setCaption(e.target.value); setIsCreating(true); }}
              onFocus={() => setIsCreating(true)}
              placeholder="Partagez une photo de Safi..."
              className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 transition-all cursor-text"
            />

            <div className={`transition-all duration-300 overflow-hidden ${isCreating ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
              <input type="file" id="post-image-input" accept="image/*" className="hidden" onChange={handleImageChange} />

              {!previewUrl ? (
                <div onClick={() => document.getElementById("post-image-input").click()} className="mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-900 rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-colors group mb-4">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-primary-500 dark:group-hover:text-primary-500 text-3xl mb-2 transition-colors">image</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-500 transition-colors">Ajouter une photo</span>
                </div>
              ) : (
                <div className="overflow-x-auto mt-4 relative mb-4 animate-fade-in">
                  <img src={previewUrl} className="w-full max-h-[250px] object-contain bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700" alt="Preview" />
                  <button onClick={removeImage} className="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-1 hover:bg-red-500 transition-colors shadow-md backdrop-blur-sm">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex gap-2">
                  <button className="p-2 rounded-full text-primary-500 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center" title="Ajouter un lieu">
                    <span className="material-symbols-outlined text-[20px] icon-outline">location_on</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={cancelPost} className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 transition-colors">Annuler</button>
                  <button
                    onClick={publishPost}
                    disabled={(!caption && !selectedImage) || isPublishing}
                    className={`bg-primary-500 text-white font-bold py-2 px-6 rounded-full transition-colors shadow-lg shadow-primary-500/30 ${(!caption && !selectedImage) || isPublishing ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-600 active:scale-95"}`}
                  >
                    {isPublishing ? "Publication..." : "Publier"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* FEED CONTAINER */}
      {/* ---------------------------------------------------- */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow animate-fade-in">
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.author.avatar} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" alt="Avatar" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                      {post.author.name} {post.author.verified && <span className="material-symbols-outlined text-secondary-500 text-[14px]">verified</span>}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{post.location} • {post.time}</p>
                  </div>
                </div>
                
                {/* Menu (Options du post) */}
                {post.author.id === currentUser.id && (
                  <button onClick={() => setPostToDelete(post)} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                )}
              </div>

              <div onClick={() => setActivePost(post)} className="w-full bg-gray-100 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700 relative group cursor-pointer aspect-video md:aspect-[4/3] overflow-hidden">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Post" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">fullscreen</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition-colors active:scale-90 group ${post.liked ? "text-red-500" : "text-gray-500 dark:text-gray-400 hover:text-red-500"}`}>
                    <span className={`material-symbols-outlined text-[26px] ${post.liked ? "" : "icon-outline"} group-hover:scale-110 transition-transform`}>favorite</span>
                  </button>
                  <button onClick={() => setActivePost(post)} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors active:scale-90 group">
                    <span className="material-symbols-outlined text-[26px] icon-outline group-hover:scale-110 transition-transform">chat_bubble</span>
                  </button>
                </div>
                
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">{post.likes} J'aime</p>
                
                <div className="text-sm text-gray-800 dark:text-gray-300 leading-relaxed line-clamp-2">
                  <span className="font-bold text-gray-900 dark:text-gray-100 mr-2">{post.author.name}</span>
                  {post.caption}
                </div>

                <button onClick={() => setActivePost(post)} className="text-sm text-gray-500 dark:text-gray-400 mt-2 hover:text-gray-700 dark:hover:text-gray-200 transition-colors font-medium">
                  Afficher les {post.comments.length} commentaires
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 1 : Affichage du POST COMPLET (Instagram Style) */}
      {/* ---------------------------------------------------- */}
      {activePost && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm transition-opacity flex items-center justify-center p-0 md:p-6 fade-in">
          <button onClick={() => setActivePost(null)} className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors active:scale-90">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <div className="bg-white dark:bg-gray-900 w-full h-full md:max-w-6xl md:h-[90vh] md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl zoom-in relative">
            {/* Image (Gauche) */}
            <div onDoubleClick={handleModalDoubleClickLike} className="w-full md:w-[55%] lg:w-[65%] bg-black flex items-center justify-center h-72 md:h-full relative group select-none">
              <img src={activePost.image} className="max-w-full max-h-full object-contain" alt="Post full" />
              {showHeartAnim && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none zoom-in">
                  <span className="material-symbols-outlined text-white text-[100px] drop-shadow-2xl">favorite</span>
                </div>
              )}
            </div>

            {/* Commentaires et Infos (Droite) */}
            <div className="w-full md:w-[45%] lg:w-[35%] flex flex-col h-[calc(100vh-18rem)] md:h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
              {/* Header de l'auteur */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center gap-3">
                  <img src={activePost.author.avatar} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover" />
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 flex items-center gap-1">
                      {activePost.author.name} {activePost.author.verified && <span className="material-symbols-outlined text-secondary-500 text-[14px]">verified</span>}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activePost.location}</p>
                  </div>
                </div>
              </div>

              {/* Liste des commentaires */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-3">
                  <img src={activePost.author.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      <span className="font-bold text-gray-900 dark:text-gray-100 mr-1">{activePost.author.name}</span>
                      {activePost.caption}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activePost.time}</p>
                  </div>
                </div>

                <hr className="border-gray-200 dark:border-gray-700" />

                <div className="space-y-5">
                  {activePost.comments.map(c => (
                    <div key={c.id} className="flex gap-3 group">
                      <img src={c.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 flex-shrink-0 object-cover" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                          <span className="font-bold text-gray-900 dark:text-gray-100 mr-1">{c.author}</span>
                          {c.text}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{c.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Formulaire d'ajout de commentaire */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
                <div className="flex items-center gap-4 mb-2">
                  <button onClick={() => toggleLike(activePost.id)} className={`transition-colors active:scale-90 group ${activePost.liked ? "text-red-500" : "text-gray-600 dark:text-gray-400 hover:text-red-500"}`}>
                    <span className={`material-symbols-outlined text-3xl ${activePost.liked ? "" : "icon-outlined"} group-hover:scale-110 transition-transform`}>favorite</span>
                  </button>
                </div>
                
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-4">{activePost.likes} J'aime</p>

                <div className="flex items-center gap-3 relative">
                  <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700" />
                  <input
                    type="text"
                    id="modal-comment-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && submitComment()}
                    placeholder="Ajouter un commentaire..."
                    disabled={isCommenting}
                    className="flex-1 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 focus:ring-1 focus:ring-primary-500 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 transition-all disabled:opacity-50"
                  />
                  <button onClick={submitComment} disabled={isCommenting} className="text-primary-600 dark:text-primary-500 font-bold text-sm px-2 hover:text-primary-700 transition-colors disabled:opacity-50">
                    {isCommenting ? "..." : "Publier"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2 : CONFIRMATION SUPPRESSION (Delete) */}
      {/* ---------------------------------------------------- */}
      {postToDelete && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl zoom-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">delete</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Supprimer la publication ?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex border-t border-gray-200 dark:border-gray-700">
              <button onClick={() => setPostToDelete(null)} className="flex-1 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-r border-gray-200 dark:border-gray-700">
                Annuler
              </button>
              <button onClick={handleDeletePost} className="flex-1 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}