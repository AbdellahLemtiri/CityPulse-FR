import { useState } from "react";
import { Link } from "react-router-dom";

// --- MOCK DATA ---
const mockArticles = [
  {
    id: 1,
    title: "Le Festival de la Céramique de Safi attire des milliers de visiteurs",
    category: "Culture",
    scope: "global",
    status: "published",
    created_at: "2026-03-14",
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=200"
  },
  {
    id: 2,
    title: "Ouverture d'un nouveau terrain de proximité",
    category: "Sport",
    scope: "local",
    sector_id: "Quartier Plateau",
    status: "published",
    created_at: "2026-03-10",
    image: "https://images.unsplash.com/photo-1518605368461-1e1e1141505c?q=80&w=200"
  },
  {
    id: 3,
    title: "Campagne de don de sang à l'hôpital Mohammed V",
    category: "Santé",
    scope: "global",
    status: "draft",
    created_at: "2026-03-15",
    image: null
  }
];

export default function JournalisteArticles() {
  const [articles, setArticles] = useState(mockArticles);

  // Supprimer un article
  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) {
      // API: axiosClient.delete(`/articles/${id}`)
      setArticles(articles.filter(article => article.id !== id));
      alert("Article supprimé avec succès.");
    }
  };

  // Modifier un article (Simulation)
  const handleEdit = (id) => {
    alert(`Redirection vers l'éditeur pour l'article ID: ${id}`);
    // F l-bessa7 ghadi t-dir: navigate(`/journaliste/rediger/${id}`)
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
            Mes Articles
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Gérez vos publications, brouillons et alertes.
          </p>
        </div>
        <Link 
          to="/journaliste/rediger"
          className="bg-secondary-600 hover:bg-secondary-700 text-white font-bold py-2 px-6 shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">edit_document</span>
          Nouvel Article
        </Link>
      </div>

      {/* TABLEAU ADMINISTRATIF DES ARTICLES */}
      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase tracking-wider">
              <th className="p-4 border-r border-gray-200 w-16 text-center">Image</th>
              <th className="p-4 border-r border-gray-200">Article</th>
              <th className="p-4 border-r border-gray-200">Audience</th>
              <th className="p-4 border-r border-gray-200">Statut</th>
              <th className="p-4 border-r border-gray-200">Date</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 font-bold">
                  Aucun article trouvé. Commencez à rédiger !
                </td>
              </tr>
            ) : (
              articles.map(article => (
                <tr key={article.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  
                  {/* IMAGE (Thumbnail) */}
                  <td className="p-3 border-r border-gray-200 text-center">
                    {article.image ? (
                      <img src={article.image} alt="Cover" className="w-12 h-12 object-cover border border-gray-300 mx-auto" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 border border-gray-300 flex items-center justify-center mx-auto text-gray-400">
                        <span className="material-symbols-outlined text-xl">image</span>
                      </div>
                    )}
                  </td>

                  {/* TITRE & CATÉGORIE */}
                  <td className="p-3 border-r border-gray-200">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2 mb-1">{article.title}</p>
                    <span className="text-xs text-gray-500 uppercase font-bold border border-gray-300 px-2 py-0.5 bg-gray-50">
                      {article.category}
                    </span>
                  </td>

                  {/* AUDIENCE (Scope) */}
                  <td className="p-3 border-r border-gray-200">
                    <div className="flex flex-col items-start">
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase border ${
                        article.scope === 'global' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {article.scope}
                      </span>
                      {article.scope === 'local' && (
                        <span className="text-[10px] text-gray-500 mt-1">{article.sector_id}</span>
                      )}
                    </div>
                  </td>

                  {/* STATUT */}
                  <td className="p-3 border-r border-gray-200">
                    <span className={`px-2 py-1 text-[11px] font-bold uppercase border flex items-center gap-1 w-max ${
                      article.status === 'published' 
                      ? 'bg-green-50 text-green-700 border-green-300' 
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {article.status === 'published' ? 'public' : 'draft'}
                      </span>
                      {article.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-3 border-r border-gray-200 text-sm text-gray-600">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(article.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 px-3 py-1.5 text-xs font-bold transition-colors"
                        title="Modifier"
                      >
                        Éditer
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 text-xs font-bold transition-colors"
                        title="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}