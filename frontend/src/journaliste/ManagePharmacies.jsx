import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast from 'react-hot-toast';
import { Trash2, Pencil, CalendarClock, CalendarPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ManagePharmacies() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🚨 State jdad dyal Search w Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // 🧠 Galeb d-l-m3llmiya (Debounce): Kan-tsennawh y-sali ktaba b 500ms 3ad n-siftou l-API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // N-rddouh l-page 1 ila qleb 3la 7aja jdida
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMyPharmacies = async () => {
    setLoading(true);
    try {
      // Kan-siftou page w search l-Laravel
      const response = await axiosClient.get('/pharmacies', {
        params: {
          page: currentPage,
          search: debouncedSearch
        }
      });
      // 🚨 Red l-bal: Laravel kay-sift d-data west 'data' mnin kan-dirou paginate()
      setPharmacies(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  // Kan-3aytou l-API kola merra t-beddlat l-page awla s-search
  useEffect(() => {
    fetchMyPharmacies();
  }, [currentPage, debouncedSearch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette garde ?')) return;
    try {
      await axiosClient.delete(`/pharmacies/${id}`);
      toast.success('Garde supprimée !');
      fetchMyPharmacies(); // N-3awdou n-fetchiw bach n-qaddou l-pagination
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (id) => {
    navigate(`/editor/pharmacies/edit/${id}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      
      {/* HEADER + SEARCH BAR */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="text-primary-500" />
            Gardes Programmées (Ma Ville)
          </h2>
          <button
            onClick={() => navigate('/editor/pharmacies/create')}
            className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-colors flex items-center gap-2 active:scale-95"
          >
            Planifier <CalendarPlus size={20} />
          </button>
        </div>

        {/* INPUT RECHERCHE */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Rechercher une pharmacie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
      </div>

      {/* TABLEAU */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                <th className="p-4 font-bold">Pharmacie</th>
                <th className="p-4 font-bold">Téléphone</th>
                <th className="p-4 font-bold">Début</th>
                <th className="p-4 font-bold">Fin</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pharmacies.map((pharmacy) => {
                 const isActive = new Date() >= new Date(pharmacy.start_date) && new Date() < new Date(pharmacy.end_date);
                
                return (
                  <tr key={pharmacy.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900 dark:text-white">{pharmacy.name}</p>
                      <div className="mt-1">
                        {isActive ? (
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Actuellement en garde</span>
                        ) : (
                          <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px]">Historique</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{pharmacy.phone}</td>
                    <td className="p-4 text-sm font-medium text-green-600 dark:text-green-400">{new Date(pharmacy.start_date).toLocaleString()}</td>
                    <td className="p-4 text-sm font-medium text-red-600 dark:text-red-400">{new Date(pharmacy.end_date).toLocaleString()}</td>
                    <td className="p-4 flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(pharmacy.id)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(pharmacy.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {pharmacies.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Aucune pharmacie trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

       {!loading && totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={16} /> Précédent
          </button>
          
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Page {currentPage} sur {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
          >
            Suivant <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}