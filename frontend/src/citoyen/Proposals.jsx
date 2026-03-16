import { useState, useEffect } from "react";
import axiosClient from "../config/axios-client";

// --- MOCK DATA (Budget Participatif) ---
const initialProposals = [
  {
    id: 1,
    title: "Aménagement d'un espace vert",
    description:
      "Transformer le terrain vague près de la mosquée en un petit jardin public avec des bancs.",
    location_name: "Terrain près de la Mosquée, Plateau",
    votes_count: 142,
    xp_reward: 100,
    image:
      "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800",
    status: "validated", // pending, validated, implemented
    is_voted: false,
    is_mine: false,
  },
  {
    id: 2,
    title: "Éclairage public solaire",
    description:
      "Installer des lampadaires solaires dans la ruelle principale pour plus de sécurité la nuit.",
    location_name: "Ruelle Principale, Sidi Bouzid",
    votes_count: 85,
    xp_reward: 100,
    image:
      "https://images.unsplash.com/photo-1509391366360-1e97ddf8ce10?q=80&w=800",
    status: "validated",
    is_voted: true, // L-user deja dar liha vote
    is_mine: false,
  },
  {
    id: 3,
    title: "Création d'un parking vélos",
    description:
      "Mettre en place des arceaux pour garer les vélos en toute sécurité devant le marché.",
    location_name: "Marché Central, Medina",
    votes_count: 12,
    xp_reward: 100,
    image:
      "https://images.unsplash.com/photo-1552520863-125488eb7c52?q=80&w=800",
    status: "pending", // Mazal ma-banet l-nass
    is_voted: false,
    is_mine: true, // Hadi dial l-Mowatin li m-connecté
  },
];

export default function Proposals() {
  // ==========================================
  // STATES
  // ==========================================
  const [proposals, setProposals] = useState(initialProposals);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("quartier"); // "quartier" awla "mes_idees"

  // States: Création d'une Proposition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location_name: "",
    description: "",
  });

  // States: Système de Vote
  const [proposalToVote, setProposalToVote] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  // ==========================================
  // 1. API: GET /proposals
  // ==========================================
  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    // setLoading(true);
    try {
      // ✅ KOD L-API L-7A9I9I:
      // const response = await axiosClient.get("/proposals");
      // setProposals(response.data.data);
    } catch (error) {
      console.error("Erreur récupération propositions", error);
    } finally {
      // setLoading(false);
    }
  };

  // ==========================================
  // 2. API: POST /proposals (Création)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // ✅ KOD L-API L-7A9I9I:
      // await axiosClient.post('/proposals', formData);

      // Simulation pour l'UI
      const newProposal = {
        id: Date.now(),
        ...formData,
        votes_count: 0,
        xp_reward: 100,
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800",
        status: "pending", // En attente de validation par le Manager
        is_voted: false,
        is_mine: true,
      };

      setProposals([newProposal, ...proposals]);
      setActiveTab("mes_idees"); // Kan-diwh l-onglet dialo oumotamatic

      alert(
        "Votre idée a été soumise ! Elle sera visible par le quartier après validation du Manager.",
      );

      // Reset form w sdd l-modal
      setFormData({ title: "", location_name: "", description: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur création", error);
      alert("Une erreur s'est produite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 3. API: POST /proposals/{id}/like (Vote)
  // ==========================================
  const handleVote = async () => {
    if (!proposalToVote) return;
    setIsVoting(true);

    try {
      // ✅ KOD L-API L-7A9I9I (Table polymorphique Likes):
      // await axiosClient.post(`/proposals/${proposalToVote.id}/like`);

      // Optimistic Update (Mise à jour UI instantanée)
      setProposals(
        proposals.map((p) => {
          if (p.id === proposalToVote.id) {
            const isCurrentlyVoted = p.is_voted;
            return {
              ...p,
              is_voted: !isCurrentlyVoted,
              votes_count: isCurrentlyVoted
                ? p.votes_count - 1
                : p.votes_count + 1,
            };
          }
          return p;
        }),
      );

      setProposalToVote(null); // Sdd l-modal
    } catch (error) {
      console.error("Erreur de vote", error);
      alert("Erreur lors de l'enregistrement du vote.");
    } finally {
      setIsVoting(false);
    }
  };

  // ==========================================
  // FILTRAGE DES ONGLETS (Tabs Logic)
  // ==========================================
  const displayedProposals =
    activeTab === "quartier"
      ? proposals.filter((p) => p.status === "validated") // Quartier: ghir les validés
      : proposals.filter((p) => p.is_mine); // Mes idées: ghir diali (pending + validated)

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
        {/* HEADER & BOUTON PROPOSER */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Budget Participatif
            </h2>
            <p className="text-sm text-gray-500">
              Proposez et votez pour l'amélioration de votre quartier.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-sm transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">
              lightbulb
            </span>{" "}
            Soumettre une idée
          </button>
        </div>

        {/* ONGLETS (TABS) */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("quartier")}
            className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === "quartier" ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            Projets du Quartier
          </button>
          <button
            onClick={() => setActiveTab("mes_idees")}
            className={`pb-3 px-4 text-sm font-bold transition-colors ${activeTab === "mes_idees" ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-400" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            Mes Propositions
          </button>
        </div>

        {/* LISTE DES PROPOSITIONS */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : displayedProposals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">
              inbox
            </span>
            <h3 className="text-gray-600 dark:text-gray-300 font-bold">
              Aucune proposition trouvée.
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Soyez le premier à proposer une idée d'aménagement !
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors relative">
                <div className="p-5">
                  {/* Status Badge pour "Mes Propositions" */}
                  {activeTab === "mes_idees" && (
                    <div className="mb-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${
                          proposal.status === "pending"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : proposal.status === "validated"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}>
                        {proposal.status === "pending"
                          ? "⏳ En cours de validation"
                          : proposal.status === "validated"
                            ? "✅ Validé (En vote)"
                            : "🚀 Implémenté"}
                      </span>
                    </div>
                  )}

                  <div className="hidden flex justify-between items-start gap-4"><div className="w-40 h-40 rounded-md overflow-hidden shrink-0 hidden sm:block">
                      <img
                        src={proposal.image}
                        alt="Projet"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {proposal.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
                        <span className="material-symbols-outlined text-[16px]">
                          pin_drop
                        </span>
                        {proposal.location_name}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {proposal.description}
                      </p>
                    </div>
                    {/* Miniature Image (Optionnelle) */}
                    
                  </div>

                  {/* Footer Card: Votes & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-200 font-bold">
                        <span class="material-symbols-outlined">
                          lightbulb_2
                        </span>
                        {proposal.votes_count}{" "}
                        <span className="text-sm font-normal text-gray-500">
                          soutiens
                        </span>
                      </div>
                    </div>

                    {/* Bouton de vote (Uniquement si validé et pas dans l'onglet "mes_idees" pour éviter de voter pour soi-même) */}
                    {activeTab === "quartier" && (
                      <button
                        onClick={() => setProposalToVote(proposal)}
                        className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm transition-colors flex items-center gap-2 ${
                          proposal.is_voted
                            ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-800"
                            : "bg-primary-600 text-white hover:bg-primary-500"
                        }`}>
                        {proposal.is_voted ? (
                          <>
                            <span className="material-symbols-outlined text-[18px]">
                              how_to_vote
                            </span>{" "}
                            Soutenu
                          </>
                        ) : (
                          "Voter"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL 1 : SOUMETTRE UNE PROPOSITION */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">
                  add_circle
                </span>
                Nouvelle Proposition
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Titre de l'idée *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Ex: Création d'un parc de jeux..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Localisation précise *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location_name}
                  onChange={(e) =>
                    setFormData({ ...formData, location_name: e.target.value })
                  }
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none"
                  placeholder="Ex: Terrain vague près du marché municipal"
                />
                <p className="text-[10px] mt-1 text-gray-500">
                  Décrivez l'endroit avec des mots simples.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description détaillée *
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none"
                  placeholder="Expliquez pourquoi cette idée est utile pour le quartier..."></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-500 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Envoi..." : "Soumettre l'idée"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2 : CONFIRMATION VOTE */}
      {/* ========================================== */}
      {proposalToVote && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in text-center p-6">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${proposalToVote.is_voted ? "bg-red-100 text-red-500" : "bg-primary-100 text-primary-500"}`}>
              <span className="material-symbols-outlined text-3xl">
                {proposalToVote.is_voted ? "thumb_down" : "thumb_up"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {proposalToVote.is_voted
                ? "Retirer votre vote ?"
                : "Soutenir cette idée ?"}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {proposalToVote.is_voted
                ? `Êtes-vous sûr de vouloir retirer votre soutien à "${proposalToVote.title}" ?`
                : `Vous allez voter pour "${proposalToVote.title}". Cela aidera à prioriser ce projet pour le quartier.`}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setProposalToVote(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Retour
              </button>
              <button
                onClick={handleVote}
                disabled={isVoting}
                className={`flex-1 font-bold py-2.5 rounded-xl transition-colors text-white ${
                  proposalToVote.is_voted
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-primary-600 hover:bg-primary-500"
                }`}>
                {isVoting
                  ? "..."
                  : proposalToVote.is_voted
                    ? "Retirer"
                    : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
