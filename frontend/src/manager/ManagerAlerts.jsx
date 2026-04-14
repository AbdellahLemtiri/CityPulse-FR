import { useState, useRef, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import moment from 'moment';
import { ImageDown, Compass } from 'lucide-react';

import 'moment/locale/fr';
import toast, { Toaster } from 'react-hot-toast';

export default function ManagerAlerts() {
  const [activeTab, setActiveTab] = useState('list');
  const [articles, setArticles] = useState([]);

  const [formData, setFormData] = useState({
    content: '',
    scope: 'local',
    status: 'published',
    images: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const newImages = [...formData.images];
    newImages[1] = file;
    if (file) {
      setCoverImage(file);
      setFormData({ ...formData, images: newImages });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setPreviewUrl(null);
    setFormData({ ...formData, images: [] });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const videFormEditing = () => {
    setFormData({
      content: '',
      scope: 'local',
      status: 'published',
      images: null,
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
    dataToSubmit.append('content', formData.content);
    dataToSubmit.append('scope', formData.scope);
    dataToSubmit.append('status', formData.status);

    if (formData.images.length > 0) {
      formData.images.forEach((image, index) => {
        dataToSubmit.append(`images[${index}]`, image);
      });
    }

    if (isEditing) {
      dataToSubmit.append('_method', 'PUT');
    }

    try {
      const url = isEditing ? `/manager/articles/${editId}` : '/manager/articles';

      const response = await axiosClient.post(url, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(isEditing ? 'Article modifié avec succès !' : 'Article créé avec succès !', { style: { background: '#333', color: '#fff' } });

      videFormEditing();
      if (!isEditing) {
        const art = response.data.article;
        const formattedData = {
          id: art.id,
          content: art.content,
          scope: art.scope,
          status: art.status,
          images: art.media && art.media[0] && art.media[0].file_path ? `http://127.0.0.1:8000/storage/${art.media[0].file_path}` : null,
          created_at: art.created_at,
        };
        setArticles((prev) => [formattedData, ...prev]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de l'enregistrement.", { style: { background: '#333', color: '#fff' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axiosClient.get('/manager/articles');
      const rawArticles = response.data.data || response.data;

      const formattedData = rawArticles.map((art) => ({
        id: art.id,
        content: art.content,
        scope: art.scope,
        status: art.status,
        images: art.file_path ? `http://127.0.0.1:8000/storage/${art.file_path}` : null,
        created_at: art.created_at,
      }));

      setArticles(formattedData);
    } catch (error) {
      console.error('Erreur Backend :', error);
      toast.error("Impossible de charger l'historique.", { style: { background: '#333', color: '#fff' } });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        await axiosClient.delete(`/manager/articles/${id}`);
        setArticles(articles.filter((art) => art.id !== id));
        toast.success('Article supprimé.', { style: { background: '#333', color: '#fff' } });
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors de la suppression.', { style: { background: '#333', color: '#fff' } });
      }
    }
  };

  // const handlePublish = async (id) => { ... } // (A garder si tu l'utilises ailleur)

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleEdit = async (id) => {
    setActiveTab('create');
    setIsLoading(true);
    setIsEditing(true);
    setEditId(id);

    try {
      const response = await axiosClient.get(`/manager/articles/${id}`);
      const fullArticle = response.data.article || response.data;

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
        images: null,
      });
    } catch (error) {
      console.error('Erreur de récupération :', error);
      toast.error("Impossible de charger l'article.", { style: { background: '#333', color: '#fff' } });
      videFormEditing();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Gestion des Alertes & Articles</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Publiez des informations officielles pour les citoyens de votre secteur.</p>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 bg-white dark:bg-gray-800 shadow-sm rounded-t-lg overflow-hidden transition-colors">
        <button
          onClick={() => {
            setActiveTab('list');
            videFormEditing();
          }}
          className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-all ${activeTab === 'list' ? 'text-primary-600 dark:text-gray-200 bg-primary-50 dark:bg-primary-500/20 border-b-2 border-primary-500' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
          Gérer les Articles
        </button>
        <button onClick={() => setActiveTab('create')} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider flex justify-center items-center gap-2 transition-all ${activeTab === 'create' ? 'text-primary-600 dark:text-gray-200 bg-primary-50 dark:bg-primary-500/20 border-b-2 border-primary-500' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
          <span className="material-symbols-outlined text-[18px]">{isEditing ? 'edit_note' : 'edit_document'}</span>
          {isEditing ? "Modifier l'Article" : 'Rédiger un Article'}
        </button>
      </div>

      <Toaster position="top-center" />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        activeTab === 'list' && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-5 transition-colors">
            {articles.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-gray-900 rounded-md border border-dashed border-gray-200 dark:border-gray-700">
                <span className="material-symbols-outlined text-4xl mb-2 text-gray-300 dark:text-gray-600 block">article</span>
                Aucun article publié pour le moment.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {articles.map((art) => (
                  <li key={art.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 px-4 rounded-lg gap-4 transition-colors">
                    <div className="flex items-center gap-4">
                      {art.images ? (
                        <img src={art.images} alt={art.title} className="w-14 h-14 object-cover rounded-md border border-gray-200 dark:border-gray-600 shadow-sm" />
                      ) : (
                        <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 text-gray-400 rounded-md flex items-center justify-center border border-gray-200 dark:border-gray-700">
                          <span className="material-symbols-outlined">description</span>
                        </div>
                      )}
                      <div className="border-l-2 border-primary-500 pl-3 py-1">
                        <span className="font-bold text-gray-800 dark:text-gray-200 text-sm block">{art.title}</span>
                        {art.scope === 'global' && <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 mt-1 block tracking-wider">Global</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="flex items-center gap-3 border rounded-md border-gray-200 dark:border-gray-700 pr-4 bg-gray-50 dark:bg-gray-900/50 transition-colors">
                        <span className={`px-2 py-1.5 text-[10px] font-bold uppercase rounded-l-md border-r ${art.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50'}`}>{art.status === 'published' ? 'Publié' : 'Brouillon'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{moment(art.created_at).fromNow()}</span>
                      </div>

                      <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/50 p-1">
                        <button onClick={() => handleEdit(art.id)} className="text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-500 px-2 py-1.5 rounded transition-all" title="Modifier">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(art.id)} className="text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500 px-2 py-1.5 rounded transition-all" title="Supprimer">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
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

      {activeTab === 'create' && (
        <div className="shadow-sm p-6 max-w-3xl mx-auto rounded-lg bg-white dark:bg-transparent border border-gray-100 dark:border-transparent transition-colors">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Image de Couverture (Optionnelle)</label>
                {previewUrl ? (
                  <div className="relative bg-gray-50 dark:bg-gray-900 text-gray-200 rounded-md overflow-hidden border border-gray-200 dark:border-gray-600 h-48">
                    <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 text-xs font-bold rounded shadow-md flex items-center gap-1 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">delete</span> Retirer
                    </button>
                  </div>
                ) : (
                  <div className="h-32 w-full border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-all flex flex-col items-center justify-center cursor-pointer rounded-md bg-gray-50 dark:bg-gray-900/30">
                    <ImageDown onClick={() => fileInputRef.current.click()} className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-bold uppercase">Cliquer pour ajouter une image</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Contenu *</label>
                <textarea required rows="6" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 resize-y rounded transition-all shadow-inner" placeholder="Rédigez les détails de l'alerte ici..."></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Portée (Scope) *</label>
                  <select value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 p-2.5 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 rounded cursor-pointer transition-colors">
                    <option value="local">Local (Mon secteur uniquement)</option>
                    <option value="global">Global (Toute la ville)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Statut *</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 p-2.5 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 rounded cursor-pointer transition-colors">
                    <option value="published">Publié (Immédiat)</option>
                    <option value="draft">Brouillon (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 mt-2">
                {isEditing && (
                  <button type="button" onClick={videFormEditing} className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold py-2.5 px-6 uppercase text-xs rounded transition-colors">
                    Annuler
                  </button>
                )}
                <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-8 uppercase text-xs rounded disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all">
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-[16px]">sync</span> Traitement...
                    </>
                  ) : isEditing ? (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span> Enregistrer les modifications
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">send</span> Publier l'Alerte
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
