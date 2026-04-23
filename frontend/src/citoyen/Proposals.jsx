import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import { Lightbulb, ImageDown,Eye } from 'lucide-react';
import toast from 'react-hot-toast';
export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [myProposals, setMyProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quartier');
  const [tab, setTab] = useState('quartier');

  const [images, setImages] = useState([]);
  const currentProposals = activeTab === 'mes_idees' ? myProposals : proposals;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isDetailsOpen, setIsDetailOpen] = useState(false);
  const [fetchMyProposals, setFetchMyProposals] = useState(false);
  // const [isMyProposalTab, setIsMyProposalTab] = useState(false);
  const [isLoding, setIsLoding] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    location_name: '',
    description: '',
    images: [],
  });

  const [proposalToVote, setProposalToVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  const fetchProposals = async () => {
    setProposals([]);
    if (!activeTab) return;
    setIsLoding(true);
    setTab('null');
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
    } finally {
      if (fetchMyProposals) {
        setTab('mes_idees');
      } else {
        setTab('quartier');
      }
      setIsLoding(false);
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
      const response = await axiosClient.post('/proposals', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setActiveTab('mes_idees');
      setFetchMyProposals(true);
      toast.success('Votre idée a été soumise ! Elle sera visible par le quartier après validation du Manager.');
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur création', error);
      toast.error("Une erreur s'est produite.");
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
      toast.error("Erreur lors de l'enregistrement du vote.");
    } finally {
      setIsVoting(false);
    }
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 2) {
      toast.error('Vous ne pouvez télécharger que 2 images maximum.');
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

  const removeImageFOrForm = (index) => {
    const images = formData.images;
    images.splice(index, 1);
    setFormData({ ...formData, images });
    setImages(images);
  };
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
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  (resetForm(), setActiveTab(null));
                }}
                className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-sm  flex items-center gap-2">
                <Lightbulb />
                Proposez
              </button>
            </div>
            {!selectedProposal && (
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
              </div>
            )}
          </>
        ) : (
          <div className="px-6 py-4      border-b  border-gray-200 dark:border-gray-700  ">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Nouvelle Proposition <Lightbulb className="text-primary-500" />
            </h2>
          </div>
        )}

        {isLoding && (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
        {!isModalOpen &&
          (tab === 'mes_idees' || tab === 'quartier') &&
          !selectedProposal &&
          (currentProposals.length === 0 ? (
            <div className=" flex flex-col items-center text-center mt-8 py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg  ">
              <Lightbulb />
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
                      {proposal.images.length > 0 && (
                        <div className="w-40 h-40 rounded-md mb-4 overflow-hidden shrink-0 hidden sm:block">
                          <img src={proposal.images?.[0] && ` ${proposal.images[0]}`} alt="Projet" className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex-1">
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
                         <Eye /> detail
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
              {' '}
              {images.length < 2 && (
                <>
                  {' '}
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">photo de la propostion ou le localisation optionnel: max 2 images</label>
                  <div onClick={() => document.getElementById('incident-image-input').click()} className="  rounded-xl   hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-900  cursor-pointer  text-gray-400 hover:text-primary-500">
                    <ImageDown className="w-10 h-10" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm  font-bold text-gray-700 dark:text-gray-300 mb-1">Localisation précise *</label>
                <input type="text" required value={formData.location_name} onChange={(e) => setFormData({ ...formData, location_name: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" />
                <p className="text-[10px] mt-1 text-gray-500">Décrivez l'endroit avec des mots simples.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description détaillée *</label>
                <textarea required rows="4" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50  focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" placeholder="Expliquez pourquoi cette idée est utile pour le quartier..."></textarea>
              </div>
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
            <div className="flex items-center gap-2 mb-4"> <img src={`${selectedProposal.imageAuthor}`} alt={selectedProposal.author_name} className="w-10 h-10 rounded-xl mr-2" /> <div className="flex flex-col"> <span className="text-sm text-gray-200  " > {selectedProposal.author_name} </span> <span className="text-xs text-gray-500">{selectedProposal.created_at}</span> </div></div>
            
            <p className="text-sm text-gray-500 mb-4">{selectedProposal.location_name}</p>
     
            <div className="flex gap-2 mb-4">
              {selectedProposal.images?.map((img, idx) => (
                <img key={idx} src={`${img}`} alt={`Image ${idx}`} className="w-32 h-32 object-cover  " />
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
