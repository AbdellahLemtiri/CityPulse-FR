import { useState ,useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axiosClient from '../config/axios-client';
import 'moment/locale/fr';

 

export default function JournalisteArticles() {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      const response = await axiosClient.get('/editor/articles');
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
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);


  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      setArticles(articles.filter((article) => article.id !== id));
    }
  };

  const handleEdit = (id) => {
    navigate(`/editor/rediger/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto text-gray-800 dark:text-gray-200 transition-colors duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8 mt-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Mes Alertes & Articles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gérez vos publications, modifiez les brouillons ou créez de nouvelles alertes.</p>
        </div>
        <Link to="/editor/rediger" className="bg-primary-600   text-white font-bold py-2.5 px-6 rounded-lg text-sm uppercase flex items-center justify-center gap-2 shadow-sm transition-colors">
          <span className="material-symbols-outlined text-[18px]">edit_document</span>
          Rédiger une alerte
        </Link>
      </div>

       <div className="bg-white dark:bg-gray-800  shadow-sm rounded-lg p-5 transition-colors">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500  bg-gray-50 dark:bg-gray-900 rounded-lg  ">
             Aucune publication pour le moment.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {articles.map((art) => (
              <li key={art.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between   px-4 rounded-lg gap-4 transition-colors">
                 <div className="flex items-center gap-4">
                  {art.images && art.images.length > 0 ? (
                    <img src={art.images[0]} alt="Cover" className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm" />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 text-gray-400 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                  )}
                  <div className="border-l-2 border-primary-500 pl-3 py-1 max-w-lg">
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{art.content}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider">{art.scope === 'global' ? 'Global' : 'Local'}</span>
                      {art.images && art.images.length > 1 && (
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">photo_library</span>+{art.images.length - 1}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                 <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="flex items-center gap-3 border rounded-lg border-gray-200 dark:border-gray-700 pr-4 bg-gray-50 dark:bg-gray-900/50 transition-colors">
                    <span className={`px-2 py-1.5 text-[10px] font-bold uppercase rounded-lg border-r ${art.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50'}`}>{art.status === 'published' ? 'Publié' : 'Brouillon'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{moment(art.created_at).fromNow()}</span>
                  </div>

                  <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/50 p-1">
                    <button onClick={() => handleEdit(art.id)} className="text-gray-400    px-2 py-1.5 rounded transition-all" title="Modifier">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button onClick={() => handleDelete(art.id)} className="text-gray-400   px-2 py-1.5 rounded transition-all" title="Supprimer">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
