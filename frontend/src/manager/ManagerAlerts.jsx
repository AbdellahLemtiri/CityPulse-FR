import { useState, useRef, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import moment from 'moment';
import 'moment/locale/fr';
// import toast, { Toaster } from 'react-hot-toast';
import toast, { Toaster } from 'react-hot-toast';
export default function ManagerAlerts() {
  // ==========================================
  // STATES
  // ==========================================
  const [activeTab, setActiveTab] = useState('list');
  const [articles, setArticles] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    scope: 'local',
    status: 'published',
    image: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setPreviewUrl(null);
    setFormData({ ...formData, image: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const videFormEditing = () => {
    setFormData({
      title: '',
      content: '',
      scope: 'local',
      status: 'published',
      image: null,
    });
    setPreviewUrl(null);
    setCoverImage(null);
    setIsEditing(false);
    setEditId(null);
    setActiveTab('list');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = new FormData();
    dataToSubmit.append('title', formData.title);
    dataToSubmit.append('content', formData.content);
    dataToSubmit.append('scope', formData.scope);
    dataToSubmit.append('status', formData.status);

    if (formData.image) {
      dataToSubmit.append('image', formData.image);
    }

    if (isEditing) {
      dataToSubmit.append('_method', 'PUT');
    }

    try {
      const url = isEditing ? `/manager/articles/${editId}` : '/manager/articles';

      const response = await axiosClient.post(url, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(isEditing ? 'Article modifié avec succès !' : 'Article créé avec succès !');

      videFormEditing();
      if (!isEditing) {
        const art = response.data.article;
        const formattedData = {
          id: art.id,
          title: art.title,
          content: art.content,
          scope: art.scope,
          status: art.status,
          image: art.media[0].file_path ? `http://127.0.0.1:8000/storage/${art.file_path}` : null,
          created_at: art.created_at,
        };
        setArticles((prev) => [formattedData, ...prev]);
        console.log(articles);
        console.log(formattedData);
        console.log('=====================================================');
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axiosClient.get('/manager/articles');
      const rawArticles = response.data.data;

      const formattedData = rawArticles.map((art) => ({
        id: art.id,
        title: art.title,
        content: art.content,
        scope: art.scope,
        status: art.status,
        image: art.file_path ? `http://127.0.0.1:8000/storage/${art.file_path}` : null,
        created_at: art.created_at,
      }));

      setArticles(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur Backend :', error);
      alert("Impossible de charger l'historique.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        await axiosClient.delete(`/manager/articles/${id}`);
        setArticles(articles.filter((art) => art.id !== id));
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression.');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await axiosClient.patch(`/manager/articles/${id}/publish`);
      setArticles(articles.map((art) => (art.id === id ? { ...art, status: 'published' } : art)));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // ================================================================

  const handleEdit = async (id) => {
    setActiveTab('create');
    setIsLoading(true);
    setIsEditing(true);
    setEditId(id);

    try {
      const response = await axiosClient.get(`/manager/articles/${id}`);
      const fullArticle = response.data; // wla response.data.article

      if (fullArticle.file_path) {
        setPreviewUrl(`http://127.0.0.1:8000/storage/${fullArticle.file_path}`);
      } else {
        setPreviewUrl(null);
      }

      setFormData({
        title: fullArticle.title,
        content: fullArticle.content,
        scope: fullArticle.scope,
        status: fullArticle.status,
        image: null,
      });
    } catch (error) {
      console.error('Erreur de récupération :', error);
      alert("Impossible de charger l'article.");
      videFormEditing();
    } finally {
      setIsLoading(false);
    }
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
          onClick={() => {
            setActiveTab('list');
            videFormEditing();
          }}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeTab === 'list' ? 'border-b-4 border-primary-600 text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          Gérer les Articles
        </button>
        <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${activeTab === 'create' ? 'border-b-4 border-primary-600 text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'}`}>
          <span className="material-symbols-outlined text-[18px]">{isEditing ? 'edit_note' : 'edit_document'}</span>
          {isEditing ? "Modifier l'Article" : 'Rédiger un Article'}
        </button>
      </div>
      <Toaster />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        activeTab === 'list' && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-md p-5 fade-in">
            {articles.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-bold bg-gray-50 rounded-md border border-dashed border-gray-300">
                <span className="material-symbols-outlined text-4xl mb-2 text-gray-400 block">article</span>
                Aucun article publié pour le moment.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {articles.map((art) => (
                  <li key={art.id} className="py-3 flex items-center justify-between hover:bg-gray-50 px-3 transition-colors rounded-md group">
                    <div className="flex items-center gap-4">
                      {art.image ? (
                        <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-md border border-gray-200" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                          <span className="material-symbols-outlined text-gray-400">description</span>
                        </div>
                      )}
                      <div className="border-l-2 border-primary-500 pl-3 py-1">
                        <span className="font-bold text-gray-800 text-sm block">{art.title}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 border rounded-md border-gray-400 pr-4">
                        <span className={`px-2 py-1 text-[10px]   font-bold uppercase rounded-sm border ${art.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>{art.status}</span>
                        <span className="text-xs text-gray-500 font-medium">{moment(art.created_at).fromNow()}</span>
                      </div>

                      <div className="flex items-center gap-2 border border-gray-400 rounded-md">
                        <button onClick={() => handleEdit(art.id)} className="bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 px-3 py-1.5 rounded-md font-bold text-xs uppercase flex items-center gap-1 transition-colors border border-gray-200 hover:border-primary-200 shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(art.id)} className="bg-white text-red-500 hover:bg-red-50 hover:text-red-700 px-3 py-1.5 rounded-md font-bold text-xs uppercase flex items-center gap-1 transition-colors border border-gray-200 hover:border-red-200 shadow-sm">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      )}

      {/* ========================================== */}
      {/* VUE 2 : CRÉATION / MODIFICATION (Formulaire) */}
      {/* ========================================== */}
      {activeTab === 'create' && (
        <div className="bg-gray-100   p-6   fade-in max-w-3xl mx-auto rounded-md">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Image de Couverture (Optionnelle)</label>
                {previewUrl ? (
                  <div className="relative   bg-gray-100 rounded-md overflow-hidden border border-gray-300">
                    <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-bold rounded shadow-md transition-colors">
                      Retirer l'image
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current.click()} className="h-32 w-full border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer text-gray-500 transition-colors rounded-md">
                    <span className="material-symbols-outlined text-3xl mb-1 text-gray-400">add_photo_alternate</span>
                    <span className="text-sm font-bold">Ajouter une image haute résolution</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'alerte *</label>
                <input type="text" required value={formData.title} onChange={handleTitleChange} className="w-full border border-gray-300 p-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 rounded-md transition-colors" placeholder="Ex: Travaux sur l'avenue..." />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Contenu (Description) *</label>
                <textarea required rows="6" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full border border-gray-300 p-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 resize-y rounded-md transition-colors" placeholder="Rédigez les détails de l'alerte ici..."></textarea>
              </div>

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

              {/* Boutons (Annuler + Submit) */}
              <div className="pt-6 border-t grid grid-cols-1  border-gray-200 flex justify-end gap-3 mt-6">
                {isEditing && (
                  <button type="button" onClick={videFormEditing} className="bg-white border  border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-6 uppercase text-sm rounded-md transition-colors shadow-sm">
                    Annuler
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700     text-white font-bold py-2.5 px-8 uppercase text-sm rounded-md transition-colors disabled:opacity-50 shadow-sm">
                  {isSubmitting ? 'Traitement...' : isEditing ? 'Enregistrer les modifications' : "Publier l'Alerte"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
