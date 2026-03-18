import { useState, useRef, useEffect } from 'react';
import axiosClient from '../config/axios-client';
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
const [isLoading, setIsLoading] = useState(false);
const [editId, setEditId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // ==========================================
  // HANDLERS (Formulaire)
  // ==========================================
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setFormData({ ...formData, title: newTitle });
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   const dataToSubmit = new FormData();
  //   dataToSubmit.append('title', formData.title);
  //   dataToSubmit.append('content', formData.content);
  //   dataToSubmit.append('scope', formData.scope);
  //   dataToSubmit.append('status', formData.status);

  //   if (coverImage) {
  //     dataToSubmit.append('image', coverImage);
  //   }

  //   try {
  //     const response = await axiosClient.post('/articles', dataToSubmit, {
  //       headers: { 'Content-Type': 'multipart/form-data' },
  //     });

  //     const newArticle = response.data.article || response.data;

  //     setArticles([newArticle, ...articles]);

  //     setFormData({ title: '', content: '', scope: 'local', status: 'published' });
  //     handleRemoveImage();

  //     alert('Alerte/Article créé avec succès !');
  //     setActiveTab('list');
  //   } catch (error) {
  //     console.error('Erreur Backend :', error);
  //     alert("Une erreur s'est produite lors de la création de l'article.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSubmit = new FormData();
    dataToSubmit.append('title', formData.title);
    dataToSubmit.append('content', formData.content);
    dataToSubmit.append('scope', formData.scope);
    dataToSubmit.append('status', formData.status);
    dataToSubmit.append('image', formData.image);


     if (isEditing) {
      dataToSubmit.append('_method', 'PUT');
    }

    try {
      const url = isEditing ? `/manager/articles/${editId}` : '/manager/articles';

       const response = await axiosClient.post(url, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
 
      alert("Article mis à jour avec succès !");
      alert(isEditing ? 'Modifié avec succès !' : 'Créé avec succès !');

       setIsEditing(false);
      setEditId(null);
      setActiveTab('list');
     } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const respanse = await axiosClient.get('/manager/articles/');
const imageUrl = `http://127.0.0.1:8000/storage/${response.data.data.file_path}`;

      let data = [{
        id: respanse.data.data.id,
        title: respanse.data.data.title,
        content: respanse.data.data.content,
        scope: respanse.data.data.scope,
        status: respanse.data.data.status,
        image: imageUrl
      }]
      }
      setArticles(data);
    } catch (error) {
      console.error('Erreur Backend :', error);
      alert("Une erreur s'est produite lors de la récupération des articles.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      setArticles(articles.filter((art) => art.id !== id));
    }
  };

  const handlePublish = (id) => {
    setArticles(articles.map((art) => (art.id === id ? { ...art, status: 'published' } : art)));
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
    console.log('bdal lll edit');

    try {
      const response = await axiosClient.get(`/manager/articles/${id}`);
      const fullArticle = response.data;
      const imageUrl = `http://127.0.0.1:8000/storage/${response.data.file_path}`;
      setPreviewUrl(imageUrl);

      setFormData({
        title: fullArticle.title,
        slug: fullArticle.slug,
        content: fullArticle.content,
        scope: fullArticle.scope,
        status: fullArticle.status,
      });
    } catch (error) {
      console.error('Erreur de récupération :', error);
      alert("Impossible de charger l'article.");
      setActiveTab('list');
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Gestion des Alertes & Articles</h2>
        <p className="text-sm text-gray-600 mt-1">Publiez des informations officielles pour les citoyens de votre secteur.</p>
      </div>

      <div className="flex border-b  mb-6 bg-white shadow-sm">
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

      {activeTab === 'list' && (
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
                  <div className="flex items-center gap-3">
                    {art.image !== null ? <img src={art.image} alt={art.title} className="w-12 h-12 object-cover rounded-md" /> : <span className="material-symbols-outlined text-gray-400 group-hover:text-primary-500 transition-colors">description</span>}

                    <span className="font-bold text-gray-800 text-sm">{art.title}</span>
                  </div>

                  {/* Bouton Éditer */}
                  <button onClick={() => handleEdit(art.id)} className="bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 px-4 py-2 rounded-md font-bold text-xs uppercase flex items-center gap-2 transition-colors border border-gray-200 hover:border-primary-200">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Éditer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* VUE 2 : CRÉATION D'UN ARTICLE (Formulaire) */}
      {/* ========================================== */}
      {activeTab === 'create' && (
        <div className="bg-white border  p-6 shadow-sm fade-in max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload d'Image */}
            <div>
              <label className=" text-sm font-bold text-gray-700 mb-2">Image de Couverture (Optionnelle)</label>
              {previewUrl ? (
                <div className="relative   bg-gray-100   rounded-md overflow-hidden">
                  <span className="text-xs text-gray-400">{previewUrl}</span>
                  <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-bold rounded shadow-md">
                    Retirer
                  </button>
                </div>
              ) : (
                <div onClick={() => fileInputRef.current.click()} className="h-32 w-full -2 border-dashed  bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center cursor-pointer text-gray-500 transition-colors rounded-md">
                  <span className="material-symbols-outlined text-3xl mb-1 text-gray-400">add_photo_alternate</span>
                  <span className="text-sm font-bold">Ajouter une image haute résolution</span>
                  <span className="text-xs text-gray-400">{previewUrl}</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {/* Titre et Slug */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Titre de l'alerte *</label>
                <input type="text" required value={formData.title} onChange={handleTitleChange} className="w-full border  p-2.5 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-primary-500 rounded-md" placeholder="Ex: Travaux sur l'avenue..." />
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
                className="w-full border  p-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:-primary-500 resize-y rounded-md"
                placeholder="Rédigez les détails de l'alerte ici..."></textarea>
            </div>

            {/* Scope et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Portée (Scope) *</label>
                <select value={formData.scope} onChange={(e) => setFormData({ ...formData, scope: e.target.value })} className="w-full border  p-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 rounded-md">
                  <option value="local">Local (Mon secteur uniquement)</option>
                  <option value="global">Global (Toute la ville)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Statut *</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border  p-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 rounded-md">
                  <option value="published">Publié (Immédiat)</option>
                  <option value="draft">Brouillon (Draft)</option>
                </select>
              </div>
            </div>

            {/* Boutons */}
            <div className="pt-4 border-t border-gray-200 grid cols-1   gap-3 mt-6">
              <button type="submit" disabled={isSubmitting} className="...">
                {isSubmitting ? 'Traitement...' : isEditing ? 'Enregistrer les modifications' : "Publier l'Alerte"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
