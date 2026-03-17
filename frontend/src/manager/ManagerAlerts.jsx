import { useState } from "react";

export default function ManagerAlerts() {
  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] = useState("list"); // "list" pour gérer, "create" pour rédiger
  const [articles, setArticles] = useState([
    { id: 1, title: "Coupure d'eau", scope: "local", status: "published", created_at: "2026-03-12" }
  ]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    scope: "local",
    status: "published",
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // HANDLERS (Formulaire)
  // ==========================================
  // Auto-générer le slug à partir du titre
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title: newTitle, slug: autoSlug });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // API: axiosClient.post('/manager/articles', formData)
    setTimeout(() => {
      const newArticle = {
        id: Date.now(),
        title: formData.title,
        scope: formData.scope,
        status: formData.status,
        created_at: new Date().toISOString().split('T')[0]
      };
      
      setArticles([newArticle, ...articles]);
      
      // Reset form
      setFormData({ title: "", slug: "", content: "", scope: "local", status: "published", photo: null });
      document.getElementById('photo-upload').value = "";
      setIsSubmitting(false);
      
      alert("Alerte/Article créé avec succès !");
      setActiveTab("list"); // Kan-rj3ouh l-liste oumotamatic mn be3d l-création
    }, 500);
  };

  // ==========================================
  // HANDLERS (Gestion)
  // ==========================================
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      // API: axiosClient.delete(`/manager/articles/${id}`)
      setArticles(articles.filter(art => art.id !== id));
    }
  };

  const handlePublish = (id) => {
    // API: axiosClient.patch(`/manager/articles/${id}/publish`)
    setArticles(articles.map(art => art.id === id ? { ...art, status: "published" } : art));
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
          Gestion des Alertes & Articles
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Publiez des informations officielles pour les citoyens de votre secteur.
        </p>
      </div>

      {/* TABS (ONGLETS) */}
      <div className="flex border-b border-gray-300 mb-6 bg-white">
        <button 
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeTab === "list" ? "border-b-4 border-primary-600 text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          Gérer les Articles
        </button>
        <button 
          onClick={() => setActiveTab("create")}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeTab === "create" ? "border-b-4 border-primary-600 text-primary-700 bg-primary-50" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <span className="material-symbols-outlined text-[18px]">edit_document</span>
          Rédiger un Article
        </button>
      </div>

      {/* ========================================== */}
      {/* VUE 1 : GESTION DES ARTICLES (Liste) */}
      {/* ========================================== */}
      {activeTab === "list" && (
        <div className="bg-white border border-gray-300 shadow-sm p-5 fade-in">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase">
                <th className="p-3 border-r border-gray-200">Date</th>
                <th className="p-3 border-r border-gray-200">Titre</th>
                <th className="p-3 border-r border-gray-200">Scope</th>
                <th className="p-3 border-r border-gray-200">Statut</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500 font-bold">Aucun article publié pour le moment.</td>
                </tr>
              ) : (
                articles.map(art => (
                  <tr key={art.id} className="border-b border-gray-200 text-sm text-gray-800 hover:bg-gray-50">
                    <td className="p-3 border-r border-gray-200">{art.created_at}</td>
                    <td className="p-3 border-r border-gray-200 font-bold">{art.title}</td>
                    <td className="p-3 border-r border-gray-200">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${art.scope === 'global' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                        {art.scope}
                      </span>
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${art.status === 'published' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      {art.status === 'draft' && (
                        <button onClick={() => handlePublish(art.id)} className="text-green-600 hover:text-green-800 font-bold text-xs uppercase">Publier</button>
                      )}
                      <button onClick={() => handleDelete(art.id)} className="text-red-600 hover:text-red-800 font-bold text-xs uppercase">Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================================== */}
      {/* VUE 2 : CRÉATION D'UN ARTICLE (Formulaire) */}
      {/* ========================================== */}
      {activeTab === "create" && (
        <div className="   p-6 fade-in max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'alerte *</label>
                <input 
                  type="text" required
                  value={formData.title} onChange={handleTitleChange}
                  className="w-full  p-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500"
                  placeholder="Ex: Travaux sur l'avenue..."
                />
              </div>

               
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contenu (Description) *</label>
              <textarea 
                required rows="6"
                value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full  p-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 resize-none"
                placeholder="Rédigez les détails de l'alerte ici..."
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Portée (Scope) *</label>
                <select 
                  value={formData.scope} onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  className="w-full   p-2.5 text-sm bg-white focus:outline-none focus:border-primary-500"
                >
                  <option value="local">Local (Mon secteur uniquement)</option>
                  <option value="global">Global (Toute la ville)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Statut *</label>
                <select 
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full   p-2.5 text-sm bg-white focus:outline-none focus:border-primary-500"
                >
                  <option value="published">Publié (Immédiat)</option>
                  <option value="draft">Brouillon (Draft)</option>
                </select>
              </div>
            </div>

            <div className="bg-gray-50 p-4 ">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span> Photo / Média (Optionnel)
              </label>
              <input 
                type="file" id="photo-upload" accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm bg-white"
              />
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-3">
               
              <button 
                type="submit" disabled={isSubmitting}
                className="flex-[2] bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 uppercase text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Enregistrement..." : "Publier l'Alerte"}
              </button>
            </div>
            
          </form>
        </div>
      )}

    </div>
  );
}