import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axiosClient from '../config/axios-client';
import 'moment/locale/fr';
import { toast } from 'react-hot-toast';

export default function JournalisteArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const fetchArticles = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/editor/articles?page=${page}&search=${searchQuery}`);

      const articles = response.data.data;

      const current = response.data.meta.current_page;
      const last = response.data.meta.last_page;

      setCurrentPage(current);
      setLastPage(last);

      setArticles(articles);
    } catch (error) {
      console.error('Erreur Backend :', error);
      toast.error("Impossible de charger l'historique.", { style: { background: '#333', color: '#fff' } });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
         fetchArticles();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage]);

  const handleDelete = async (slug) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
    }
    try {
      await axiosClient.delete(`/editor/articles/${slug}`);
      setArticles(articles.filter((article) => article.slug !== slug));

      toast.success('Alerte supprimée !');
    } catch (error) {
      console.error('Erreur Backend :', error);
      toast.error("Impossible de supprimer l'article.");
    }
  };

  const handleEdit = (slug) => {
    navigate(`/editor/rediger/${slug}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-gray-800 dark:text-gray-200  duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Mes Alertes & Articles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos publications, modifiez les brouillons ou créez de nouvelles alertes.</p>
        </div>
        <Link to="/editor/rediger" className="bg-primary-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm uppercase flex items-center justify-center gap-2 ">
          <span className="material-symbols-outlined text-[18px]">edit_document</span>
          Rédiger
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-5 ">
        <div className="    p-5 rounded-xl mb-6  flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-400 uppercase  mb-2">Rechercher un par content : </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[20px]">search</span>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tapez des mot de content ..."  className="w-full border border-gray-600 pl-10 p-2 text-sm bg-gray-900 text-white rounded-lg focus:outline-none focus:border-red-500 " />
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}

        {!isLoading && articles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-lg">Aucune publication pour le moment.</div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
              {articles.map((art) => (
                <li key={art.slug} className="p-2 flex flex-col md:flex-row md:items-center justify-between  rounded-lg gap-4 ">
                  <div className="flex items-center gap-4">
                    {art.images && art.images.length > 0 ? (
                      <img src={art.images[0]} alt="Cover" className="w-20 h-20 object-cover rounded-l border border-gray-200 dark:border-gray-600" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 text-gray-400 rounded-l flex items-center justify-center border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined">description</span>
                      </div>
                    )}
                    <div className="border-l-2 border-primary-500 pl-3 py-1 max-w-lg">
                      <p className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-2">{art.content}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto">
                    <div className="flex items-center gap-3 border rounded-lg border-gray-200 dark:border-gray-700 pr-4 bg-gray-50 dark:bg-gray-900/50 ">
                      <span className={`px-2 py-1.5 text-[10px] font-bold uppercase rounded-lg border-r  `}>{art.status === 'published' ? 'Publié' : 'Brouillon'}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{moment(art.created_at).fromNow()}</span>
                    </div>

                    <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/50 p-1">
                      <button onClick={() => handleEdit(art.slug)} className="text-gray-400 hover:text-primary-500 px-2 py-1.5 rounded-lg " title="Modifier">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button onClick={() => handleDelete(art.slug)} className="text-gray-400 hover:text-red-500 px-2 py-1.5 rounded-lg " title="Supprimer">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {lastPage > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 ">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  Précédent
                </button>

                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  Page <span className="text-gray-900 dark:text-white">{currentPage}</span> sur <span className="text-gray-900 dark:text-white">{lastPage}</span>
                </span>

                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage} className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 ">
                  Suivant
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
