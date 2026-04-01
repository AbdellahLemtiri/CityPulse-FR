import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quartier');
  const [images, setImages] = useState([]);
  const currentProposals = activeTab === 'mes_idees' ? myProposals : proposals;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isDetailsOpen, setIsDetailOpen] = useState(false);
   const [fetchMyProposals, setFetchMyProposals] = useState(false);
  // const [isMyProposalTab, setIsMyProposalTab] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    images: [],
  });

  const [proposalToVote, setProposalToVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const fetchProposals = async () => {
    let url = '/proposals';

    if (fetchMyProposals) {
      url = '/proposals?my-proposals=1';
    }

    try {
      const response = await axiosClient.get(url);

      if (fetchMyProposals) {
        setMyProposals(response.data);
      } else {
        setProposals(response.data);
      }
      setFetchMyProposals(false);
    } catch (error) {
      console.error('Erreur récupération propositions', error);
    }
  };
  const handelTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    fetchProposals();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();

    formDataToSend.append('title', formData.title);
    formDataToSend.append('location_name', formData.location_name);
    formDataToSend.append('description', formData.description);

    formData.images.forEach((image, index) => {
      formDataToSend.append(`images[${index}]`, image.file);
    });

    try {
      const response = await axiosClient.post('/proposals', formDataToSend);

      const newProposal = {
        id: response.data.proposal.id,
        title: response.data.proposal.title,
        location_name: response.data.proposal.location_name,
        image: response.data.proposal.images,
        description: response.data.proposal.description,
        images: response.data.proposal.images,
        is_voted: false,
        votes_count: 0,
        created_at: response.data.proposal.created_at,
      };
      console.log(newProposal);

      setMyProposals([newProposal, ...myProposals]);
      setActiveTab('mes_idees');

      alert('Votre idée a été soumise ! Elle sera visible par le quartier après validation du Manager.');

      setFormData({ title: '', location_name: '', description: '', images: [] });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur création', error);
      alert("Une erreur s'est produite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async () => {
    if (!proposalToVote) return;

    setIsVoting(true);

    const likeable_type = 'Proposal';
    const likeable_id = proposalToVote.id;

    try {
      await axiosClient.post(`/likes/toggle`, { likeable_type, likeable_id });
      setProposals(
        proposals.map((p) => {
          if (p.id === proposalToVote.id) {
            const isCurrentlyVoted = p.is_voted;
            return {
              ...p,
              is_voted: !isCurrentlyVoted,
              votes_count: isCurrentlyVoted ? p.votes_count - 1 : p.votes_count + 1,
            };
          }
          return p;
        }),
      );

      setProposalToVote(null);
    } catch (error) {
      console.error('Erreur de vote', error);
      alert("Erreur lors de l'enregistrement du vote.");
    } finally {
      setIsVoting(false);
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 2) {
      alert('Vous ne pouvez télécharger que 2 images maximum.');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };
  const resetForm = () => {
    setFormData({ title: '', location_name: '', description: '', images: [] });
    setImages([]);
  };


  const removeImageFOrForm = (index)=>{
    const images = formData.images;
    images.splice(index, 1);
    setFormData({ ...formData, images });
    setImages(images);
  }
  const detailsProposal = (proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="max-w-3xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
        {!isModalOpen ? (
          <>
            <div className="flex justify-between items-center mb-6 mt-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Budget Participatif</h2>
                <p className="text-sm text-gray-500">Proposez et votez pour l'amélioration de votre quartier.</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-sm  flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span> Soumettre une idée
              </button>
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-700 ">
              <button onClick={() => setActiveTab('quartier')} className={`pb-3 px-4 text-sm font-bold  ${activeTab === 'quartier' ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Projets du Quartier
              </button>
              <button
                onClick={() => {
                  handelTabChange('mes_idees');
                  setFetchMyProposals(true);
                }}
                className={`pb-3 px-4 text-sm font-bold  ${activeTab === 'mes_idees' ? 'border-b-2 border-primary-600 text-primary-600 dark:text-primary-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
                Mes Propositions
              </button>
            </div>{' '}
          </>
        ) : (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <span className="  px-2 py-1 rounded-lg bg-primary-500/40 text-white">Annuler</span>
            </button>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500">add_circle</span>
              Nouvelle Proposition
            </h2>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        {!isModalOpen && 
          (currentProposals.length === 0 ? (
            <div className="text-center mt-8 py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">inbox</span>
              <h3 className="text-gray-600 dark:text-gray-300 font-bold">{activeTab === 'mes_idees' ? "Vous n'avez encore proposé aucune idée." : 'Aucune proposition trouvée.'}</h3>
              <p className="text-sm text-gray-500 mt-1">{activeTab === 'mes_idees' ? "Participez à l'amélioration de Safi !" : "Soyez le premier à proposer une idée d'aménagement !"}</p>
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              {currentProposals.map((proposal) => (
                <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden  relative">
                  <div className="p-5">
                    {activeTab === 'mes_idees' && (
                      <div className="mb-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${proposal.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-200' : proposal.status === 'validated' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>{proposal.status === 'pending' ? ' En cours de validation' : proposal.status === 'validated' ? ' Validé (En vote)' : 'Implémenté'}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">{proposal.created_at}</span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="w-40 h-40 rounded-md overflow-hidden shrink-0 hidden sm:block">
                        <img src={proposal.images?.[0] && `http://127.0.0.1:8000/storage/${proposal.images[0]}`} alt="Projet" className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{proposal.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                          <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                          {proposal.location_name}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{proposal.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-bold">
                          <span className="material-symbols-outlined">lightbulb_2</span>
                          {proposal.votes_count} <span className="text-sm font-normal text-gray-500">soutiens</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedProposal(proposal)} className="px-4 py-2 rounded-lg font-bold text-sm shadow-sm  flex items-center gap-2 bg-primary-600/95 text-white hover:bg-primary-500">
                          <span className="material-symbols-outlined text-[18px]">visibility</span> Voir
                        </button>
                        {activeTab === 'quartier' && (
                          <button onClick={() => setProposalToVote(proposal)} className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm  flex items-center gap-2 ${proposal.is_voted ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800' : 'bg-primary-600 text-white hover:bg-primary-500'}`}>
                            {proposal.is_voted ? (
                              <>
                                <span className="material-symbols-outlined text-[18px]">how_to_vote</span> Soutenu
                              </>
                            ) : (
                              'Voter'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        {isModalOpen && (
          <div className="bg-white mt-4 dark:bg-gray-900 w-full max-w-lg rounded-lg  dark:border-gray-700 overflow-hidden ">
            <form onSubmit={handleSubmit} className="p-6 space-y-4   ">
              <div>
                <label className="block text-sm  font-bold text-gray-700 dark:text-gray-300 mb-1">Titre de l'idée *</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" />
              </div>

              <div>
                <label className="block text-sm  font-bold text-gray-700 dark:text-gray-300 mb-1">Localisation précise *</label>
                <input type="text" required value={formData.location_name} onChange={(e) => setFormData({ ...formData, location_name: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" />
                <p className="text-[10px] mt-1 text-gray-500">Décrivez l'endroit avec des mots simples.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description détaillée *</label>
                <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50  focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" placeholder="Expliquez pourquoi cette idée est utile pour le quartier..."></textarea>
              </div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">photo de la propostion ou le localisation (optionnel) : max 2 images</label>

              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                    <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
              {images.length < 2 && (
                <div onClick={() => document.getElementById('incident-image-input').click()} className="aspect-square rounded-xl border-2  border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center cursor-pointer  text-gray-400 hover:text-primary-500">
                  <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                </div>
              )}
              <div>
                <input type="file" accept="image/*" id="incident-image-input" multiple onChange={handleImageUpload} className="hidden" multiple />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-800  text-gray-800 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 ">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-500  disabled:opacity-50">
                  {isSubmitting ? 'Envoi...' : "Soumettre l'idée"}
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedProposal && (
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedProposal.title}</h2>
              <button onClick={() => setSelectedProposal(null)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">{selectedProposal.location_name}</p>

            <div className="flex gap-2 mb-4">
              {selectedProposal.images?.map((img, idx) => (
                <img key={idx} src={`http://127.0.0.1:8000/storage/${img}`} alt={`Image ${idx}`} className="w-32 h-32 object-cover rounded-md" />
              ))}
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedProposal.description}</p>

            <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
              <span className="material-symbols-outlined">lightbulb_2</span>
              {selectedProposal.votes_count} soutiens
            </div>
          </div>
        )}
      </div>

      {proposalToVote && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in text-center p-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${proposalToVote.is_voted ? 'bg-red-100 text-red-500' : 'bg-primary-100 text-primary-500'}`}>
              <span className="material-symbols-outlined text-3xl">{proposalToVote.is_voted ? 'thumb_down' : 'thumb_up'}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{proposalToVote.is_voted ? 'Retirer votre vote ?' : 'Soutenir cette idée ?'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{proposalToVote.is_voted ? `Êtes-vous sûr de vouloir retirer votre soutien à "${proposalToVote.title}" ?` : `Vous allez voter pour "${proposalToVote.title}". Cela aidera à prioriser ce projet pour le quartier.`}</p>
            <div className="flex gap-3">
              <button onClick={() => setProposalToVote(null)} className="flex-1 bg-gray-100  text-gray-800 dark:text-white font-bold py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 ">
                Retour
              </button>
              <button onClick={handleVote} disabled={isVoting} className={`flex-1 font-bold py-2.5 rounded-xl  text-white ${proposalToVote.is_voted ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-500'}`}>
                {isVoting ? '...' : proposalToVote.is_voted ? 'Retirer' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
