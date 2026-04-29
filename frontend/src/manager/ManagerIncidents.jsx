import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStateContext } from '../contexts/ContextProvider';
export default function ManagerIncidents() {
  const { user } = useStateContext();
  const [incidents, setIncidents] = useState([]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actionPhase, setActionPhase] = useState('initial');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [fetchingDetail, setFetchingDetail] = useState(false);
  const [closurePhoto, setClosurePhoto] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isQualifing, setIsQualifying] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [querySearch, setQuerySearch] = useState('');

  const fetchCategories = async () => {
    setIsLoading(true);

    try {
      const response = await axiosClient.get('manager/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////fetchIncidents///////////////////////////////////////////
  const fetchIncidents = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await axiosClient.get(`manager/incidents?page=${pageNum}&search=${querySearch}`);
      const incidentsRes = response.data.data;

      const metaData = response.data.meta;
      if (isLoadMore) {
        setIncidents((prev) => [...prev, ...incidentsRes]);
      } else {
        setIncidents(incidentsRes);
      }
      setHasMore(metaData.current_page < metaData.last_page);
      setPage(metaData.current_page);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (querySearch) {
        setHasMore(false);
        fetchIncidents();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [querySearch]);

  /////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////
  const fetchincidentDEtaile = async (id) => {
    try {
      setFetchingDetail(true);
      const response = await axiosClient.get(`manager/incidents/${id}`);
      setSelectedIncident(response.data);
    } catch (error) {
      toast.error('Une erreur est survenue lors de la chargement des données.');
    } finally {
      setFetchingDetail(false);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleOpenDetail = (incident) => {
    if (incident.status === 'pending') {
      fetchCategories();
    }
    fetchincidentDEtaile(incident.id);
    setSelectedIncident(incident);
    setSelectedCategoryId(incident.category_id || '');
    setRejectionReason(incident.rejection_reason || '');

    setActionPhase(incident.status === 'pending' ? 'initial' : 'categorizing');

    setActiveImageIndex(0);
    setCurrentView('detail');
  };

  const handleCloseDetail = () => {
    setSelectedIncident(null);
    setSelectedCategoryId('');
    setRejectionReason('');
    setActionPhase('initial');
    setClosurePhoto(null);
    setActiveImageIndex(0);
    setCurrentView('list');
  };

  const handleResolveIncident = async () => {
    if (!selectedIncident) return;
    setIsResolving(true);
    try {
      const response = await axiosClient.put(`manager/incidents/${selectedIncident.id}/resolve`);
      toast.success('Ticket résolu avec succès.');
      setIncidents(incidents.filter((incident) => incident.id != selectedIncident.id));
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la résolution du ticket.');
    } finally {
      setIsResolving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez saisir un motif de rejet.');
      return;
    }

    try {
      await axiosClient.put(`manager/incidents/${selectedIncident.id}/reject`, { rejection_reason: rejectionReason });

      const updatedIncident = {
        ...selectedIncident,
        status: 'rejected',
        rejection_reason: rejectionReason,
      };

      setIncidents(incidents.map((inc) => (inc.id === selectedIncident.id ? updatedIncident : inc)));
      setSelectedIncident(updatedIncident);
      toast.success('Le signalement a été refusé avec succès.');
      handleCloseDetail();
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du rejet du ticket.');
    }
  };
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchIncidents(page + 1, true);
    }
  };
  const handleQualify = async () => {
    if (!selectedCategoryId) {
      toast.error('Veuillez sélectionner une catégorie avant de prendre en charge le ticket.');
      return;
    }

    setIsQualifying(true);
    const categorySelected = categories.find((c) => c.id === parseInt(selectedCategoryId));

    try {
      const response = await axiosClient.put(`manager/incidents/${selectedIncident.id}/validate`, { category_id: categorySelected.id });

      const categoryName = categories.find((c) => c.id === categorySelected.id)?.name;
      setSelectedIncident(response.data.incident);

      toast.success("Ticket qualifié 'Validé' avec succès. L'email au partenaire a été envoyé automatiquement !");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Une erreur inattendue s'est produite. Veuillez réessayer.");
      }
    } finally {
      setIsQualifying(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 border dark:border-yellow-800 text-xs font-bold rounded uppercase">En attente</span>;
      case 'validated':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 border dark:border-blue-800 text-xs font-bold rounded uppercase">Validé & Assigné</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 border dark:border-red-800 text-xs font-bold rounded uppercase">Refusé</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 border dark:border-green-800 text-xs font-bold rounded uppercase">Clôturé</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 border dark:border-orange-800 text-xs font-bold rounded uppercase">En cours</span>;
      default:
        return <span className="px-2 py-1 bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 border dark:border-gray-600 text-xs font-bold rounded uppercase">{status}</span>;
    }
  };

  const selectedCatObj = categories.find((c) => c.id === parseInt(selectedCategoryId));

  if (fetchingDetail) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="text-gray-900 dark:text-gray-200 transition-colors duration-300">
      {currentView === 'list' && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight uppercase mb-6">Tableau de Bord des Incidents secteur : {user.sector_name}</h2>
          <div className="    p-5 rounded-xl mb-6  flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase  mb-2">Rechercher un Incident Par REF </label>
              <div className="relative">
                 <input type="text" value={querySearch} onChange={(e) => setQuerySearch(e.target.value)} placeholder="Tapez un REF  ..." className="w-full border border-gray-600 pl-10 p-2 text-sm bg-gray-900 text-white rounded-lg focus:outline-none focus:border-red-500 " />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="p-4 font-bold">Réf</th>
                  <th className="p-4 font-bold">Catégorie</th>
                  <th className="p-4 font-bold">Titre</th>
                  <th className="p-4 font-bold">Statut</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center bg-white dark:bg-gray-800">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center bg-white dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Aucun ticket en cours.</p>
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{incident.ref_num}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{incident.category || <span className="text-gray-400 dark:text-gray-500 italic">Non qualifié</span>}</td>
                      <td className="p-4 font-bold text-gray-800 dark:text-gray-200 break-words max-w-[200px] truncate">{incident.title}</td>
                      <td className="p-4">{getStatusBadge(incident.status)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenDetail(incident)} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors">
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {hasMore && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <button onClick={handleLoadMore} disabled={loadingMore} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-6 rounded text-sm disabled:opacity-50 flex items-center justify-center mx-auto gap-2 transition-colors">
                        {loadingMore && !isLoading ? <></> : ' plus '}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentView === 'detail' && selectedIncident && (
        <div className="max-w-6xl mx-auto overflow-hidden">
          <div className="py-6 flex justify-between items-center">
            <div>
              <button onClick={handleCloseDetail} className="text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 px-3 py-1.5 hover:bg-gray-50 hover:text-gray-900 dark:hover:text-white dark:hover:border-gray-500 font-bold text-xs uppercase flex items-center gap-2 mb-3 transition-colors">
             Retour
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                Ticket : <span className="text-primary-600 dark:text-primary-400">{selectedIncident.ref_num}</span>
                {getStatusBadge(selectedIncident.status)}
              </h3>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Infos du signalement</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Déclarant</span>
                    <span className="block text-sm font-bold text-gray-900 dark:text-gray-300 flex items-center gap-2">
                       {selectedIncident.user?.first_name} {selectedIncident.user?.last_name}
                      <span className="text-gray-500 font-normal">({selectedIncident.user?.phone || 'Pas de N°'})</span>
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 block">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Problème</span>
                    <p className="block text-sm font-bold text-gray-900 dark:text-gray-200 break-words break-all">{selectedIncident.title}</p>
                  </div>

                  <div className="pt-2">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-2">Description</span>
                    <p className="text-sm text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 leading-relaxed italic break-words break-all">"{selectedIncident.description}"</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase mb-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span>Preuves </span>
                 </h4>

                {selectedIncident.media && selectedIncident.media.length > 0 ? (
                  <div className="space-y-3">
                    <div className=" flex items-center justify-center p-2 h-64">
                      {selectedIncident.media[activeImageIndex].file_path.endsWith('.webm') || selectedIncident.media[activeImageIndex].file_path.endsWith('.mp3') ? (
                        <div className="flex flex-col items-center gap-4 w-full px-8">
                           <audio controls className="w-full">
                            <source src={`${selectedIncident.media[activeImageIndex].file_path}`} />
                            Votre navigateur ne supporte pas l'audio.
                          </audio>
                        </div>
                      ) : (
                        <img src={`${selectedIncident.media[activeImageIndex].file_path}`} alt="Preuve" className="w-full h-full object-contain" />
                      )}
                    </div>

                    {selectedIncident.media.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {selectedIncident.media.map((m, idx) => (
                          <button key={m.id} onClick={() => setActiveImageIndex(idx)} className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${activeImageIndex === idx ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'}`}>
                            {m.file_path.endsWith('.webm') || m.file_path.endsWith('.mp3') ? (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                               </div>
                            ) : (
                              <img src={`${m.file_path}`} className="w-full h-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-32 flex flex-col items-center justify-center text-gray-500">
                     <p className="text-sm font-bold">Aucun média attaché</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6 lg:pl-8">
              <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">Centre d'opérations</h4>

              <div className="bg-gray-50 dark:bg-gray-800 rounded p-4 border border-gray-200 dark:border-gray-700">
                <h5 className="font-bold text-gray-900 dark:text-white mb-4">Décision du Responsable</h5>

                {selectedIncident.status === 'pending' && actionPhase === 'initial' && (
                  <div className="flex gap-4">
                    <button onClick={() => setActionPhase('rejecting')} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded text-sm uppercase transition-colors">
                      Refuser
                    </button>
                    <button onClick={() => setActionPhase('categorizing')} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 rounded text-sm uppercase transition-colors">
                      Accepter & Continuer
                    </button>
                  </div>
                )}

                {selectedIncident.status === 'pending' && actionPhase === 'rejecting' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-red-500 dark:text-red-400 uppercase mb-2">Motif du refus (Obligatoire)</label>
                      <textarea rows="3" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Expliquez pourquoi ce ticket est refusé..." className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded p-3 text-sm text-gray-900 dark:text-white outline-none break-words break-all" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setActionPhase('initial')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded text-sm font-bold uppercase transition-colors">
                        Annuler
                      </button>
                      <button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-sm uppercase transition-colors">
                        Confirmer le Refus
                      </button>
                    </div>
                  </div>
                )}

                {selectedIncident.status === 'pending' && actionPhase === 'categorizing' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Assigner la catégorie</label>
                      <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded p-2 text-sm text-gray-900 dark:text-white outline-none">
                        <option value="" selected disabled>
                          -- Choisir la catégorie --
                        </option>
                        {categories.length === 0 ? (
                          <option value="" disabled >Aucune catégorie disponible</option>
                        ) : (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {selectedCatObj && selectedCatObj.partner && (
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4">
                        <h6 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-3">Partenaire Assigné</h6>
                        <div className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-3">
                           {selectedCatObj.partner.name}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 pt-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">Email</span>
                            <span className="break-words break-all">{selectedCatObj.partner.email}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">Tél Fixe</span>
                            <span>{selectedCatObj.partner.phone_fix || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">WhatsApp</span>
                            <span>{selectedCatObj.partner.whatsapp || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">SLA</span>
                            <span>{selectedCatObj.partner.sla_hours} Heures</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setActionPhase('initial')} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded text-sm font-bold uppercase transition-colors">
                        Retour
                      </button>
                      <button onClick={handleQualify} disabled={!selectedCategoryId || isQualifing} className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded text-sm uppercase transition-colors">
                        {isQualifing ? (
                          <div className="flex justify-center py-1">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          </div>
                        ) : (
                          'Valider & Assigner'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {selectedIncident.status === 'rejected' && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded mt-4">
                    <span className="text-sm font-bold flex items-center gap-2 text-red-600 dark:text-red-500 mb-2">
                      Ticket Refusé
                    </span>
                    <p className="text-xs text-gray-700 dark:text-gray-300 break-words break-all">Motif : {selectedIncident.rejection_reason}</p>
                  </div>
                )}

                {selectedIncident.status === 'in_progress' && (
                  <div className="  p-4 rounded mt-4 space-y-4">
                    <div className="flex flex-col mb-2">
                      <span className="text-sm font-bold flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">En cours de traitement</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Catégorie : <strong className="text-gray-900 dark:text-white ml-1">{selectedIncident.category?.name}</strong>
                      </span>
                    </div>

                    {selectedIncident.partner && (
                      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                        <h6 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-3">Entité en charge</h6>
                        <div className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-3">
                           {selectedIncident.partner.name}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">Email</span>
                            <span className="break-words break-all">{selectedIncident.partner.email}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">Tél Fixe</span>
                            <span>{selectedIncident.partner.phone_fix || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">WhatsApp</span>
                            <span>{selectedIncident.partner.whatsapp || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">SLA</span>
                            <span>{selectedIncident.partner.sla_hours} Heures</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <button disabled={isResolving} onClick={() => handleResolveIncident(selectedIncident.id)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                      {isResolving ? (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Marquer comme résolu
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedIncident.status === 'resolved' && (
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded mt-4 space-y-4">
                    <div className="flex flex-col mb-2">
                      <span className="text-sm font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-1">Incident Clôturé</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Catégorie : <strong className="text-gray-900 dark:text-white ml-1">{selectedIncident.category?.name}</strong>
                      </span>
                    </div>

                    {selectedIncident.partner && (
                      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4">
                        <h6 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-3">Traité et résolu par</h6>
                        <div className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-3">
                           {selectedIncident.partner.name}
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-3">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">Email</span>
                            <span className="break-words break-all">{selectedIncident.partner.email}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">Tél Fixe</span>
                            <span>{selectedIncident.partner.phone_fix || '-'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">WhatsApp</span>
                            <span>{selectedIncident.partner.whatsapp || '-'}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
