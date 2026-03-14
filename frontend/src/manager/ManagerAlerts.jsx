import { useState } from "react";

export default function ManagerAlerts() {
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
      setFormData({ title: "", slug: "", content: "", scope: "local", status: "published", photo: null });
      document.getElementById('photo-upload').value = "";
      setIsSubmitting(false);
      alert("Alerte/Article créé avec succès !");
    }, 500);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      {/* COLONNE GAUCHE : FORMULAIRE DE CRÉATION */}
      <div className="w-full md:w-1/2">
        <div className="bg-white border border-gray-300 shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 pb-2 mb-4">
            Rédiger une Alerte / Article
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'alerte *</label>
              <input 
                type="text" required
                value={formData.title} onChange={handleTitleChange}
                className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500"
                placeholder="Ex: Travaux sur l'avenue..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL) *</label>
              <input 
                type="text" required
                value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm bg-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">Généré automatiquement, modifiable si besoin.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contenu (Description) *</label>
              <textarea 
                required rows="4"
                value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Portée (Scope) *</label>
                <select 
                  value={formData.scope} onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  className="w-full border border-gray-300 p-2 text-sm bg-white"
                >
                  <option value="local">Local (Mon secteur uniquement)</option>
                  <option value="global">Global (Toute la ville)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Statut *</label>
                <select 
                  value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 p-2 text-sm bg-white"
                >
                  <option value="published">Publié (Immédiat)</option>
                  <option value="draft">Brouillon (Draft)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Photo / Média</label>
              <input 
                type="file" id="photo-upload" accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-gray-300 p-1 text-sm bg-white"
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 uppercase text-sm disabled:opacity-50"
              >
                {isSubmitting ? "Enregistrement..." : "Enregistrer l'Article"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* COLONNE DROITE : HISTORIQUE DES ARTICLES */}
      <div className="w-full md:w-1/2">
        <div className="bg-white border border-gray-300 shadow-sm p-5">
          <h3 className="text-lg font-bold text-gray-800 uppercase border-b border-gray-300 pb-2 mb-4">
            Historique des Publications
          </h3>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase">
                <th className="p-2 border-r border-gray-200">Date</th>
                <th className="p-2 border-r border-gray-200">Titre</th>
                <th className="p-2 border-r border-gray-200">Scope</th>
                <th className="p-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(art => (
                <tr key={art.id} className="border-b border-gray-200 text-sm text-gray-800">
                  <td className="p-2 border-r border-gray-200">{art.created_at}</td>
                  <td className="p-2 border-r border-gray-200 font-bold truncate max-w-[150px]">{art.title}</td>
                  <td className="p-2 border-r border-gray-200">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${art.scope === 'global' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>
                      {art.scope}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${art.status === 'published' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                      {art.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}