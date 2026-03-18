import { useState, useRef } from 'react';

export default function ManagerAlerts() {
  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] = useState('list');
  const [articles, setArticles] = useState([{ id: 1, title: "Coupure d'eau", scope: 'local', status: 'published', created_at: '2026-03-12' }]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    scope: 'local',
    status: 'published',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Référence pour l'input file caché (Bonne pratique React)
  const fileInputRef = useRef(null);

  // ==========================================
  // HANDLERS (Formulaire)
  // ==========================================
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const autoSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({ ...formData, title: newTitle, slug: autoSlug });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset l-input caché
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation de l'appel API avec FormData
    // const dataToSubmit = new FormData();
    // dataToSubmit.append('title', formData.title);
    // dataToSubmit.append('slug', formData.slug);
    // ...
    // if (coverImage) dataToSubmit.append('image', coverImage);

    setTimeout(() => {
      const newArticle = {
        id: Date.now(),
        title: formData.title,
        scope: formData.scope,
        status: formData.status,
        created_at: new Date().toISOString().split('T')[0],
      };

      setArticles([newArticle, ...articles]);

      // Reset form
      setFormData({ title: '', slug: '', content: '', scope: 'local', status: 'published' });
      handleRemoveImage(); // Kan-ms7ou tswira
      setIsSubmitting(false);

      alert('Alerte/Article créé avec succès !');
      setActiveTab('list');
    }, 500);
  };

  // ==========================================
  // HANDLERS (Gestion)
  // ==========================================
  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      setArticles(articles.filter((art) => art.id !== id));
    }
  };

  const handlePublish = (id) => {
    setArticles(articles.map((art) => (art.id === id ? { ...art, status: 'published' } : art)));
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Gestion des Alertes & Articles</h2>
        <p className="text-sm text-gray-600 mt-1">Publiez des informations officielles pour les citoyens de votre secteur.</p>
      </div>

      {/* TABS (ONGLETS) */}
      <div className="flex border-b border-gray-300 mb-6 bg-white shadow-sm">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeTab === 'list' ? 'border-b-4 border-primary-600 text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          Gérer les Articles
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeTab === 'create' ? 'border-b-4 border-primary-600 text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>
          <span className="material-symbols-outlined text-[18px]">edit_document</span>
          Rédiger un Article
        </button>
      </div>

      {/* ========================================== */}
      {/* VUE 1 : GESTION DES ARTICLES (Liste) */}
      {/* ========================================== */}
      {activeTab === 'list' && (
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
                  <td colSpan="5" className="p-6 text-center text-gray-500 font-bold">
                    Aucun article publié pour le moment.
                  </td>
                </tr>
              ) : (
                articles.map((art) => (
                  <tr key={art.id} className="border-b border-gray-200 text-sm text-gray-800 hover:bg-gray-50">
                    <td className="p-3 border-r border-gray-200">{art.created_at}</td>
                    <td className="p-3 border-r border-gray-200 font-bold">{art.title}</td>
                    <td className="p-3 border-r border-gray-200">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${art.scope === 'global' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}>{art.scope}</span>
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${art.status === 'published' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>{art.status}</span>
                    </td>
                    <td className="p-3 flex justify-center gap-2">
                      {art.status === 'draft' && (
                        <button onClick={() => handlePublish(art.id)} className="text-green-600 hover:text-green-800 font-bold text-xs uppercase">
                          Publier
                        </button>
                      )}
                      <button onClick={() => handleDelete(art.id)} className="text-red-600 hover:text-red-800 font-bold text-xs uppercase">
                        Supprimer
                      </button>
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
      {activeTab === 'create' && (
        <div className="bg-white border border-gray-300 p-6 shadow-sm fade-in max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload d'Image */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image de Couverture (Optionnelle)</label>
              {previewUrl ? (
                <div className="relative h-48 w-full bg-gray-100 border border-gray-300 rounded-md overflow-hidden">
                  <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-bold rounded shadow-md">
                    Retirer
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current.click()} className="h-32 w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer text-gray-500 transition-colors rounded-md">
                  <span className="material-symbols-outlined text-3xl mb-1 text-gray-400">add_photo_alternate</span>
                  <span className="text-sm font-bold">Ajouter une image haute résolution</span>
                </div>
              )}
              {/* Input caché, on l'appelle avec fileInputRef */}
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {/* Titre et Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'alerte *</label>
                <input type="text" required value={formData.title} onChange={handleTitleChange} className="w-full border border-gray-300 p-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 rounded-md" placeholder="Ex: Travaux sur l'avenue..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL) *</label>
                <input type="text" required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-gray-300 p-2.5 text-sm bg-gray-100 text-gray-600 rounded-md focus:outline-none focus:border-primary-500" />
              </div>
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Contenu (Description) *</label>
              <textarea
                required
                rows="6"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full border border-gray-300 p-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 resize-y rounded-md"
                placeholder="Rédigez les détails de l'alerte ici..."></textarea>
            </div>

            {/* Scope et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Portée (Scope) *</label>
                <select value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })} className="w-full border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 rounded-md">
                  <option value="local">Local (Mon secteur uniquement)</option>
                  <option value="global">Global (Toute la ville)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Statut *</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-gray-300 p-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 rounded-md">
                  <option value="published">Publié (Immédiat)</option>
                  <option value="draft">Brouillon (Draft)</option>
                </select>
              </div>
            </div>

            {/* Boutons */}
            <div className="pt-4 border-t border-gray-200 flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setActiveTab('list')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-6 uppercase text-sm rounded-md transition-colors border border-gray-300">
                Annuler
              </button>
              <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-6 uppercase text-sm rounded-md transition-colors disabled:opacity-50">
                {isSubmitting ? 'Publication...' : "Publier l'Alerte"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
