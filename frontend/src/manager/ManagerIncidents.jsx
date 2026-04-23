import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
<<<<<<< HEAD
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStateContext } from '../contexts/ContextProvider';
export default function ManagerIncidents() {
  const { user } = useStateContext();
=======
import toast from 'react-hot-toast';
export default function ManagerIncidents() {
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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
<<<<<<< HEAD
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
=======

  const [closurePhoto, setClosurePhoto] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
  const fetchIncidents = async (pageNum = 1, isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
<<<<<<< HEAD
      const response = await axiosClient.get(`manager/incidents?page=${pageNum}&search=${querySearch}`);
=======
      const response = await axiosClient.get(`manager/incidents?page=${pageNum}`);
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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
<<<<<<< HEAD
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

=======

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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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

<<<<<<< HEAD
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

=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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
<<<<<<< HEAD

=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchIncidents(page + 1, true);
    }
  };
<<<<<<< HEAD

=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
  const handleQualify = async () => {
    if (!selectedCategoryId) {
      toast.error('Veuillez sélectionner une catégorie avant de prendre en charge le ticket.');
      return;
    }

<<<<<<< HEAD
    setIsQualifying(true);
=======
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    const categorySelected = categories.find((c) => c.id === parseInt(selectedCategoryId));

    try {
      const response = await axiosClient.put(`manager/incidents/${selectedIncident.id}/validate`, { category_id: categorySelected.id });

      const categoryName = categories.find((c) => c.id === categorySelected.id)?.name;
<<<<<<< HEAD
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
=======

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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
<<<<<<< HEAD
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
=======
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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    }
  };

  const selectedCatObj = categories.find((c) => c.id === parseInt(selectedCategoryId));

<<<<<<< HEAD
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
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[20px]">search</span>
                <input type="text" value={querySearch} onChange={(e) => setQuerySearch(e.target.value)} placeholder="Tapez un REF  ..." className="w-full border border-gray-600 pl-10 p-2 text-sm bg-gray-900 text-white rounded-lg focus:outline-none focus:border-red-500 " />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
=======
  return (
    <div className="text-gray-200">
      {currentView === 'list' && (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase mb-6">Tableau de Bord : Plateau</h2>

          <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                  <th className="p-4 font-bold">Réf</th>
                  <th className="p-4 font-bold">Catégorie</th>
                  <th className="p-4 font-bold">Titre</th>
                  <th className="p-4 font-bold">Statut</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
<<<<<<< HEAD
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center bg-white dark:bg-gray-800">
=======
              <tbody className="divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center bg-gray-800">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
<<<<<<< HEAD
                    <td colSpan="6" className="p-8 text-center bg-white dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Aucun ticket en cours.</p>
=======
                    <td colSpan="6" className="p-8 text-center bg-gray-800">
                      <p className="text-sm text-gray-400">Aucun ticket en cours.</p>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
<<<<<<< HEAD
                    <tr key={incident.id} className="text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{incident.ref_num}</td>
                      <td className="p-4 text-gray-700 dark:text-gray-300">{incident.category || <span className="text-gray-400 dark:text-gray-500 italic">Non qualifié</span>}</td>
                      <td className="p-4 font-bold text-gray-800 dark:text-gray-200 break-words max-w-[200px] truncate">{incident.title}</td>
                      <td className="p-4">{getStatusBadge(incident.status)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenDetail(incident)} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors">
=======
                    <tr key={incident.id} className="hover:bg-gray-700/50 transition-colors text-sm">
                      <td className="p-4 font-bold text-white">{incident.ref_num}</td>
                      <td className="p-4">{incident.category || <span className="text-gray-500 italic">Non qualifié</span>}</td>
                      <td className="p-4 font-bold text-gray-200">{incident.title}</td>
                      <td className="p-4">{getStatusBadge(incident.status)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenDetail(incident)} className="bg-gray-900 border border-gray-600 hover:border-primary-500 hover:text-primary-400 text-gray-300 px-4 py-1.5 rounded-md text-xs font-bold transition-all uppercase">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {hasMore && (
<<<<<<< HEAD
                  <tr>
                    <td colSpan="6" className="text-center py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <button onClick={handleLoadMore} disabled={loadingMore} className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-6 rounded text-sm disabled:opacity-50 flex items-center justify-center mx-auto gap-2 transition-colors">
                        {loadingMore &&!isLoading ? <></> : ' plus '}
                      </button>
                    </td>
                  </tr>
=======
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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentView === 'detail' && selectedIncident && (
<<<<<<< HEAD
        <div className="max-w-6xl mx-auto overflow-hidden">
          <div className="py-6 flex justify-between items-center">
            <div>
              <button onClick={handleCloseDetail} className="text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 px-3 py-1.5 hover:bg-gray-50 hover:text-gray-900 dark:hover:text-white dark:hover:border-gray-500 font-bold text-xs uppercase flex items-center gap-2 mb-3 transition-colors">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span> Retour
              </button>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                Ticket : <span className="text-primary-600 dark:text-primary-400">{selectedIncident.ref_num}</span>
=======
        <div className="max-w-6xl mx-auto overflow-hidden animate-fade-in-up">
          <div className=" p-6  flex justify-between items-center rounded-t-xl">
            <div>
              <button onClick={handleCloseDetail} className="text-gray-400 border border-gray-700 rounded bg-gray-900 px-3 py-1.5 hover:text-white hover:border-gray-500 font-bold text-xs uppercase flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span> Retour
              </button>
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                Ticket : <span className="text-primary-400">{selectedIncident.ref_num}</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                {getStatusBadge(selectedIncident.status)}
              </h3>
            </div>
          </div>

<<<<<<< HEAD
          <div className="bg-white dark:bg-gray-800 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Infos du signalement</h4>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-5 border border-gray-200 dark:border-gray-700 space-y-4">
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Déclarant</span>
                    <span className="block text-sm font-bold text-gray-900 dark:text-gray-300 flex items-center gap-2">
=======
          <div className="bg-gray-800 p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-b-xl border-x border-b border-gray-700 shadow-sm">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-700 pb-2 mb-4">Infos du signalement</h4>
                <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 space-y-4">
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Déclarant</span>
                    <span className="block text-sm font-bold text-gray-300 flex items-center gap-2">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                      <span className="material-symbols-outlined text-[18px] text-gray-500">person</span>
                      {selectedIncident.user?.first_name} {selectedIncident.user?.last_name}
                      <span className="text-gray-500 font-normal">({selectedIncident.user?.phone || 'Pas de N°'})</span>
                    </span>
                  </div>

<<<<<<< HEAD
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700 block">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-1">Problème</span>
                    <p className="block text-sm font-bold text-gray-900 dark:text-gray-200 break-words break-all">{selectedIncident.title}</p>
                  </div>

                  <div className="pt-2">
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-bold uppercase mb-2">Description</span>
                    <p className="text-sm text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 leading-relaxed italic break-words break-all">"{selectedIncident.description}"</p>
=======
                  <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-1">Problème</span>
                    <span className="block text-sm font-bold text-gray-200">{selectedIncident.title}</span>
                  </div>

                  <div className="pt-2">
                    <span className="block text-xs text-gray-500 font-bold uppercase mb-2">Description</span>
                    <p className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg border border-gray-700 leading-relaxed italic">"{selectedIncident.description}"</p>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                  </div>
                </div>
              </div>

              <div>
<<<<<<< HEAD
                <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase mb-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span>Preuves </span>
                  <span className="text-xs font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">{selectedIncident.media?.length || 0} Fichier(s)</span>
=======
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex justify-between items-center border-b border-gray-700 pb-2">
                  <span>Preuves (Médias)</span>
                  <span className="text-xs font-bold bg-gray-700 text-gray-300 px-2 py-1 rounded">{selectedIncident.media?.length || 0} Fichier(s)</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                </h4>

                {selectedIncident.media && selectedIncident.media.length > 0 ? (
                  <div className="space-y-3">
<<<<<<< HEAD
                    <div className=" flex items-center justify-center p-2 h-64">
                      {selectedIncident.media[activeImageIndex].file_path.endsWith('.webm') || selectedIncident.media[activeImageIndex].file_path.endsWith('.mp3') ? (
                        <div className="flex flex-col items-center gap-4 w-full px-8">
                          <span className="material-symbols-outlined text-4xl text-primary-500 dark:text-primary-400">mic</span>
=======
                    <div className="rounded-xl overflow-hidden border border-gray-600 bg-gray-900 flex items-center justify-center p-2 h-64">
                      {selectedIncident.media[activeImageIndex].file_path.endsWith('.webm') || selectedIncident.media[activeImageIndex].file_path.endsWith('.mp3') ? (
                        <div className="flex flex-col items-center gap-4 w-full px-8">
                          <span className="material-symbols-outlined text-4xl text-primary-400">mic</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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
<<<<<<< HEAD
                          <button key={m.id} onClick={() => setActiveImageIndex(idx)} className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${activeImageIndex === idx ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'}`}>
                            {m.file_path.endsWith('.webm') || m.file_path.endsWith('.mp3') ? (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">graphic_eq</span>
=======
                          <button key={m.id} onClick={() => setActiveImageIndex(idx)} className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImageIndex === idx ? 'border-primary-500 ring-2 ring-primary-500/20 opacity-100' : 'border-gray-700 opacity-50 hover:opacity-100'}`}>
                            {m.file_path.endsWith('.webm') || m.file_path.endsWith('.mp3') ? (
                              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-400">graphic_eq</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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
<<<<<<< HEAD
                  <div className="rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 h-32 flex flex-col items-center justify-center text-gray-500">
                    <span className="material-symbols-outlined text-3xl mb-1">no_photography</span>
=======
                  <div className="rounded-xl border border-dashed border-gray-600 bg-gray-900 h-32 flex flex-col items-center justify-center text-gray-500">
                    <span className="material-symbols-outlined text-3xl mb-1 opacity-50">no_photography</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    <p className="text-sm font-bold">Aucun média attaché</p>
                  </div>
                )}
              </div>
            </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                      Accepter & Continuer
                    </button>
                  </div>
                )}

                {selectedIncident.status === 'pending' && actionPhase === 'rejecting' && (
<<<<<<< HEAD
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
=======
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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                        Confirmer le Refus
                      </button>
                    </div>
                  </div>
                )}

                {selectedIncident.status === 'pending' && actionPhase === 'categorizing' && (
<<<<<<< HEAD
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-2">Assigner la catégorie</label>
                      <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded p-2 text-sm text-gray-900 dark:text-white outline-none">
=======
                  <div className="space-y-5 animate-fade-in">
                    <div>
                      <label className="block text-xs font-bold text-primary-400 uppercase mb-2">Assigner la catégorie</label>
                      <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full border border-gray-600 bg-gray-800 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-primary-500 outline-none">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                        <option value="">-- Choisir la catégorie --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCatObj && selectedCatObj.partner && (
<<<<<<< HEAD
                      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-4">
                        <h6 className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-3">Partenaire Assigné</h6>
                        <div className="text-gray-900 dark:text-white font-bold text-sm flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[18px]">domain</span>
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
=======
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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
<<<<<<< HEAD
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
                      <span className="material-symbols-outlined text-[18px]">block</span> Ticket Refusé
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
                          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[18px]">domain</span>
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
                          <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[18px]">verified_user</span>
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
=======
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
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
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
