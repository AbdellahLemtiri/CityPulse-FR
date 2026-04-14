import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import { toast  } from "react-hot-toast";

export default function ManagerIdess() {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProposals = async () => {
    try {
      const response = await axiosClient.get('/manager/pending-proposals');
      setProposals(response.data);
    } catch (error) {
      console.error('Erreur de chargement des propositions:', error);
    }
  };
  useEffect(() => {
    fetchProposals();
  }, []);

  const handleOpenDetail = (proposal) => {
    setSelectedProposal(proposal);
  };

  const handleCloseDetail = () => {
    setSelectedProposal(null);
  };

  const handleAction = async (id, action) => {
    const actionText = action === 'approve' ? 'VALIDER' : 'REFUSER';
    const newStatus = action === 'approve' ? 'validated' : 'rejected';

    if (window.confirm(` Êtes-vous sûr de vouloir ${actionText} cette proposition citoyenne ?`)) {
      try {
        await axiosClient.patch(`/manager/proposals/${id}/status`, { status: newStatus });

        setProposals(proposals.filter((prop) => prop.id !== id));
        toast.success(`La proposition a été ${action === 'approve' ? 'validée et publiée pour le vote' : 'refusée et archivée'}.`);
        handleCloseDetail();
      } catch (error) {
        console.error('Erreur de modification du statut:', error);
        toast.error("Une erreur s'est produite lors de l'opération.");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <div className="mb-8 mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Validation des Propositions </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Examinez les idées d'aménagement soumises par les citoyens de votre secteur avant de les soumettre au vote.</p>
      </div>

      {!selectedProposal && (
        <div className="animate-fade-in">
          {proposals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-5xl mb-3 text-gray-300 dark:text-gray-600 block">task_alt</span>
              <h3 className="text-lg font-bold text-gray-400 dark:text-gray-300">Aucune proposition en attente</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md">Toutes les idées citoyennes de votre secteur ont été traitées. Bon travail !</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {proposals.map((prop) => (
                <div key={prop.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800/50 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">En attente</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{new Date(prop.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>

 
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">{prop.description}</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="truncate">{prop.location_name}</span>
                    </div>
                    <button onClick={() => handleOpenDetail(prop)} className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 rounded-lg text-sm transition-colors mt-1">
                      Voir les détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
 
      {selectedProposal && (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
          <button onClick={handleCloseDetail} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-bold text-xs uppercase flex items-center gap-2 mb-6 transition-colors bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg w-fit">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Retour aux propositions
          </button>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden transition-colors">
             <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-2 items-center mb-3">
                <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800/50 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Proposition Citoyenne</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {new Date(selectedProposal.created_at).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
             </div>

             <div className="p-6 md:p-8 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl flex items-center gap-4 transition-colors">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-lg">{selectedProposal.first_name}</div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Proposé par</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200">{selectedProposal.user.first_name} {selectedProposal.user.last_name}</p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl flex items-center gap-4 transition-colors">
                  <div className="w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-400 rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Localisation</p>
                    <p className="font-bold text-gray-800 dark:text-gray-200 truncate" title={selectedProposal.location_name}>
                      {selectedProposal.location_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description complète */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">Description détaillée</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-100 dark:border-gray-700/50">{selectedProposal.description}</p>
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="bg-gray-50 dark:bg-gray-900 p-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-end transition-colors">
              <button onClick={() => handleAction(selectedProposal.id, 'reject')} className="w-full sm:w-auto bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-gray-700 hover:border-red-600 dark:hover:border-red-600 px-6 py-3 font-bold uppercase rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[18px]">close</span>
                Refuser l'idée
              </button>

              <button onClick={() => handleAction(selectedProposal.id, 'approve')} className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-3 font-bold uppercase rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all">
                <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                Valider pour le Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
