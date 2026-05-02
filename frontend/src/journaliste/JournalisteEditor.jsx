import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImageDown, Compass } from 'lucide-react';
import axiosClient from '../config/axios-client';
import toast from 'react-hot-toast';
import { useStateContext } from '../contexts/ContextProvider';

export default function JournalisteEditor() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    content: '',
    status: 'draft',
  });
  const { slug } = useParams();
  const isEditMode = !!slug;
  const { user } = useStateContext();

  const [mediaList, setMediaList] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newMediaItems = files.map((file) => ({
        type: 'new',
        url: URL.createObjectURL(file),
        file: file,
      }));
      setMediaList((prev) => [...prev, ...newMediaItems]);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const itemToRemove = mediaList[indexToRemove];

    if (itemToRemove.type === 'old') {
      setDeletedImages((prev) => [...prev, itemToRemove.url]);
    }

    setMediaList((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchArticle = async () => {
        try {
          const response = await axiosClient.get(`editor/articles/${slug}`);
          const data = response.data;
          setFormData({
            content: data.content,
            status: data.status,
          });

          if (data.images && Array.isArray(data.images)) {
            const existingMedia = data.images.map((url) => ({
              type: 'old',
              url: url,
              file: null,
            }));
            setMediaList(existingMedia);
          }
        } catch (error) {
          toast.error("Erreur de chargement de l'article");
          navigate('/editor/articles');
        } finally {
          setFetching(false);
        }
      };
      fetchArticle();
    }
  }, [slug, navigate, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      toast.error("Le contenu de l'alerte est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSubmit = new FormData();
      dataToSubmit.append('content', formData.content);
      dataToSubmit.append('status', formData.status);

      mediaList.forEach((item) => {
        if (item.type === 'new') {
          dataToSubmit.append('images[]', item.file);
        }
      });

      deletedImages.forEach((url) => {
        dataToSubmit.append('deleted_images[]', url);
      });

      if (isEditMode) {
        dataToSubmit.append('_method', 'PUT');
        await axiosClient.post(`/editor/articles/${slug}`, dataToSubmit, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Article modifié avec succès !');
      } else {
        await axiosClient.post('/editor/articles', dataToSubmit, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Article créé avec succès !');
      }

      navigate('/editor/articles');
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-gray-800 dark:text-gray-200 transition-colors duration-300 pb-10">
      <div className="mb-6 mt-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            {isEditMode ? 'Modifier' : 'Rédiger'} {user?.role === 'journaliste' ? 'une actualité' : 'une alerte'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Préparez l'information à diffuser aux citoyens.</p>
        </div>
        <button onClick={() => navigate('/editor/articles')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-bold text-xs uppercase flex items-center gap-1 transition-colors">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Retour
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg p-6 transition-colors">
        {fetching ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Images d'illustration </label>

              <div className="flex flex-wrap gap-4 mb-3">
                {mediaList.map((item, index) => (
                  <div key={index} className="relative w-32 h-32 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 group">
                    <img src={item.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute inset-0 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}

                <div onClick={() => fileInputRef.current.click()} className="cursor-pointer   rounded-lx w-32 h-32 flex items-center justify-center text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors">
                  <ImageDown className="w-10 h-10" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Contenu *</label>
              <textarea required rows="8" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 p-4 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 resize-y rounded  shadow-inner" placeholder="Rédigez l'information complète ici..."></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Statut de l'alerte *</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border border-gray-200 dark:border-gray-600 p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 rounded-lg cursor-pointer transition-colors">
                  <option value="published">Publier (Visible immédiatement)</option>
                  <option value="draft">Brouillon (Non visible)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => navigate('/editor/articles')} className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold py-2.5 px-6 uppercase text-xs rounded-lg transition-colors">
                Annuler
              </button>
              <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 px-8 uppercase text-xs rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-sm ">
                {isSubmitting ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                  </div>
                ) : formData.status === 'published' ? (
                  <>
                    {isEditMode ? 'Mettre à jour' : "Publier "}
                  </>
                ) : (
                  <>Sauvegarder</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
