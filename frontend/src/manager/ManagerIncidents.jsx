import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast from 'react-hot-toast';
export default function ManagerIncidents() {
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

  const [closurePhoto, setClosurePhoto] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const fetchIncidents = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await axiosClient.get(`manager/incidents?page=${pageNum}`);
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

  const fetchincidentDEtaile = async (id) => {
    try {
      const response = await axiosClient.get(`manager/incidents/${id}`);
      setSelectedIncident(response.data);
    } catch (error) {
      console.error(error);
    }
  };
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

    const categorySelected = categories.find((c) => c.id === parseInt(selectedCategoryId));

    try {
      const response = await axiosClient.put(`manager/incidents/${selectedIncident.id}/validate`, { category_id: categorySelected.id });

      const categoryName = categories.find((c) => c.id === categorySelected.id)?.name;

      const updatedIncident = {
        ...selectedIncident,
        category_id: categorySelected.id,
        category_name: categoryName,
        status: 'in_progress',
      };

      setIncidents(incidents.map((inc) => (inc.id === selectedIncident.id ? updatedIncident : inc)));
      setSelectedIncident(updatedIncident);
      toast.success("Ticket qualifié 'Validé' avec succès. L'email au partenaire a été envoyé oumotamatic !");
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la qualification du ticket.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-800/50 text-xs font-bold rounded-md uppercase tracking-wider">En attente</span>;
      case 'validated':
        return <span className="px-2 py-1 bg-primary-900/30 text-primary-400 border border-primary-800/50 text-xs font-bold rounded-md uppercase tracking-wider">Validé & Assigné</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-800/50 text-xs font-bold rounded-md uppercase tracking-wider">Refusé</span>;
      case 'resolved':
        return <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-800/50 text-xs font-bold rounded-md uppercase tracking-wider">Clôturé</span>;
      case 'in_progress':
        return <span className="px-2 py-1 bg-orange-900/30 text-orange-400 border border-orange-800/50 text-xs font-bold rounded-md uppercase tracking-wider">En cours</span>;
      default:
        return <span className="px-2 py-1 bg-gray-700 text-gray-300 border border-gray-600 text-xs font-bold rounded-md uppercase tracking-wider">{status}</span>;
    }
  };

  const selectedCatObj = categories.find((c) => c.id === parseInt(selectedCategoryId));

  return (
    <div className="text-gray-200">
      {currentView === 'list' && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase mb-6">Tableau de Bord : Plateau</h2>

          <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="p-4 font-bold">Réf</th>
                  <th className="p-4 font-bold">Catégorie</th>
                  <th className="p-4 font-bold">Titre</th>
                  <th className="p-4 font-bold">Statut</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center bg-gray-800">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center bg-gray-800">
                      <p className="text-sm text-gray-400">Aucun ticket en cours.</p>
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr key={incident.id} className="hover:bg-gray-700/50 transition-colors text-sm">
                      <td className="p-4 font-bold text-white">{incident.ref_num}</td>
                      <td className="p-4">{incident.category || <span className="text-gray-500 italic">Non qualifié</span>}</td>
                      <td className="p-4 font-bold text-gray-200">{incident.title}</td>
                      <td className="p-4">{getStatusBadge(incident.status)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenDetail(incident)} className="bg-gray-900 border border-gray-600 hover:border-primary-500 hover:text-primary-400 text-gray-300 px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase">
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {hasMore && (
                  <div className="text-center py-4">
                    <button onClick={handleLoadMore} disabled={loadingMore} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-6 rounded-lg text-sm  disabled:opacity-50 flex items-center justify-center mx-auto gap-2">
                      {loadingMore ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                          Chargement...
                        </>
                      ) : (
                        "Afficher plus d'actualités"
                      )}
                    </button>
                  </div>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentView === 'detail' && selectedIncident && (
        <div className="max-w-6xl mx-auto overflow-hidden animate-fade-in-up">
          <div className=" p-6  flex justify-between items-center rounded-t-xl">
            <div>
              <button onClick={handleCloseDetail} className="text-gray-400 border border-gray-700 rounded bg-gray-900 px-3 py-1.5 hover:text-white hover:border-gray-500 font-bold text-xs uppercase flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span> Retour
              </button>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                Ticket : <span className="text-primary-400">{selectedIncident.ref_num}</span>
                {getStatusBadge(selectedIncident.status)}
              </h3>
            </div>
          </div>

          <div className="bg-gray-800 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-b-xl border-x border-b border-gray-700 shadow-sm">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-2 mb-4">Infos du signalement</h4>
                <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 space-y-4">
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Déclarant</span>
                    <span className="block text-sm font-bold text-gray-300 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-gray-500">person</span>
                      {selectedIncident.user?.first_name} {selectedIncident.user?.last_name}
                      <span className="text-gray-500 font-normal">({selectedIncident.user?.phone || 'Pas de N°'})</span>
                    </span>
                  </div>

                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Problème</span>
                    <span className="block text-sm font-bold text-gray-200">{selectedIncident.title}</span>
                  </div>

                  <div className="pt-2">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-2">Description</span>
                    <p className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700 leading-relaxed italic">"{selectedIncident.description}"</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between items-center border-b border-gray-700 pb-2">
                  <span>Preuves (Médias)</span>
                  <span className="text-xs font-bold bg-gray-700 text-gray-300 px-2 py-1 rounded">{selectedIncident.media?.length || 0} Fichier(s)</span>
                </h4>

                {selectedIncident.media && selectedIncident.media.length > 0 ? (
                  <div className="space-y-3">
                    <div className="rounded-xl overflow-hidden border border-gray-600 bg-gray-900 flex items-center justify-center p-2 h-64">
                      {selectedIncident.media[activeImageIndex].file_path.endsWith('.webm') || selectedIncident.media[activeImageIndex].file_path.endsWith('.mp3') ? (
                        <div className="flex flex-col items-center gap-4 w-full px-8">
                          <span className="material-symbols-outlined text-4xl text-primary-400">mic</span>
                          <audio controls className="w-full">
                            <source src={`http://127.0.0.1:8000/storage/${selectedIncident.media[activeImageIndex].file_path}`} />
                            Votre navigateur ne supporte pas l'audio.
                          </audio>
                        </div>
                      ) : (
                        <img src={`http://127.0.0.1:8000/storage/${selectedIncident.media[activeImageIndex].file_path}`} alt="Preuve" className="w-full h-full object-contain" />
                      )}
                    </div>

                    {selectedIncident.media.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {selectedIncident.media.map((m, idx) => (
                          <button key={m.id} onClick={() => setActiveImageIndex(idx)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImageIndex === idx ? 'border-primary-500 ring-2 ring-primary-500/20 opacity-100' : 'border-gray-700 opacity-50 hover:opacity-100'}`}>
                            {m.file_path.endsWith('.webm') || m.file_path.endsWith('.mp3') ? (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400">graphic_eq</span>
                              </div>
                            ) : (
                              <img src={`http://127.0.0.1:8000/storage/${m.file_path}`} className="w-full h-full object-cover" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-600 bg-gray-900 h-32 flex flex-col items-center justify-center text-gray-500">
                    <span className="material-symbols-outlined text-3xl mb-1 opacity-50">no_photography</span>
                    <p className="text-sm font-bold">Aucun média attaché</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6   lg:pl-8">
              <h4 className="text-sm font-bold text-gray-400 uppercase   mb-2 border-b border-gray-700 pb-2">Centre d'opérations</h4>

              <div className="   rounded-xl p-5   relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${selectedIncident.status === 'rejected' ? 'bg-red-500' : 'bg-primary-500/30'}`}></div>

                <h5 className="font-bold text-white mb-4 flex items-center gap-2">Décision du Responsable</h5>

                {selectedIncident.status === 'pending' && actionPhase === 'initial' && (
                  <div className="flex gap-4">
                    <button onClick={() => setActionPhase('rejecting')} className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800/50 font-bold py-3 rounded-lg text-sm uppercase transition-colors">
                      Refuser
                    </button>
                    <button onClick={() => setActionPhase('categorizing')} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg text-sm uppercase transition-colors">
                      Accepter & Continuer
                    </button>
                  </div>
                )}

                {selectedIncident.status === 'pending' && actionPhase === 'rejecting' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-red-400 uppercase mb-2">Motif du refus (Obligatoire)</label>
                      <textarea rows="3" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Expliquez pourquoi ce ticket est refusé..." className="w-full border border-gray-600 bg-gray-800 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-red-500 outline-none transition-colors" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setActionPhase('initial')} className="px-4 py-2 bg-gray-700 text-white rounded text-sm font-bold">
                        Annuler
                      </button>
                      <button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-400 text-white font-bold rounded text-sm uppercase">
                        Confirmer le Refus
                      </button>
                    </div>
                  </div>
                )}

                {selectedIncident.status === 'pending' && actionPhase === 'categorizing' && (
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-primary-400 uppercase mb-2">Assigner la catégorie</label>
                      <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full border border-gray-600 bg-gray-800 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none">
                        <option value="">-- Choisir la catégorie --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCatObj && selectedCatObj.partner && (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 animate-fade-in-up">
                        <h6 className="text-xs text-gray-400 uppercase font-bold mb-2">Partenaire Assigné :</h6>
                        <div className="flex flex-col gap-1">
                          <div className="text-white font-bold text-base flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary-400">domain</span>
                            {selectedCatObj.partner.name}
                          </div>
                          <div className="text-sm text-gray-400">{selectedCatObj.partner.email}</div>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                            <div className="text-xs text-gray-400">
                              {' '}
                              {selectedCatObj.partner.phone_fix || '-'} | WA: {selectedCatObj.partner.whatsapp || '-'}
                            </div>
                            <div className="text-xs font-bold text-orange-400 bg-orange-900/30 px-2 py-1 rounded">SLA: {selectedCatObj.partner.sla_hours}H</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setActionPhase('initial')} className="px-4 py-2 bg-gray-700 text-white rounded text-sm font-bold">
                        Retour
                      </button>
                      <button onClick={handleQualify} disabled={!selectedCategoryId} className="flex-1 bg-primary-600 hover:bg-primary-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded text-sm uppercase">
                        Valider & Assigner
                      </button>
                    </div>
                  </div>
                )}

                {selectedIncident.status === 'rejected' && (
                  <div className="bg-red-900/20 text-red-400 p-4 rounded-lg border border-red-800/50 mt-4">
                    <span className="text-sm font-bold flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-[18px]">block</span> Ticket Refusé
                    </span>
                    <p className="text-xs text-white italic bg-gray-800 p-2 rounded">"{selectedIncident.rejection_reason}"</p>
                  </div>
                )}

                {selectedIncident.status === 'in_progress' && (
                  <div className="bg-primary-900/20 text-primary-400 p-4 rounded-lg  mt-4 space-y-3">
                    <span className="text-sm font-bold flex items-center gap-2 mb-1">En cours de traitement</span>
                    <span className="text-xs text-gray-300 block mb-2">
                      Catégorie : <strong className="text-white">{selectedIncident.category?.name}</strong>
                    </span>

                    {selectedIncident.partner && (
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <h6 className="text-xs text-gray-400 uppercase font-bold mb-1">En charge :</h6>
                        <div className="text-white font-bold text-sm flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-primary-400 text-[18px]">domain</span>
                          {selectedIncident.partner.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {' '}
                          {selectedIncident.partner.phone_fix} | SLA: {selectedIncident.partner.sla_hours}H
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
