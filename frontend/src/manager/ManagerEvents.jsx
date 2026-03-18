import { useState, useEffect } from "react";

// --- MOCK DATA (Propositions en attente) ---
const mockPendingProposals = [
  {
    id: 1,
    title: "Aménagement d'un espace vert",
    description:
      "Transformer le terrain vague en un Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs. petitTransformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs. jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs.Transformer le terrain vague en un petit jardin public avec des bancs. 111Transformer le terrain vague en un petit jardin public avec des bancs.",
    location_name: "Terrain près de la Mosquée, Plateau",
    created_at: "2026-03-15T10:30",
    author: "Yassine B.",
    status: "pending",
  },
  {
    id: 2,
    title: "Création d'un parking vélos",
    description:
      "Mettre en place des arceaux pour garer les vélos en toute sécurité.",
    location_name: "Marché Central, Medina",
    created_at: "2026-03-16T14:15",
    author: "Amina F.",
    status: "pending",
  },
];

export default function ManagerProposals() {
  const [proposals, setProposals] = useState(mockPendingProposals);

  // Validation ou Refus de la proposition
  const handleAction = async (id, action) => {
    const actionText = action === "approve" ? "VALIDER" : "REFUSER";
    const newStatus = action === "approve" ? "validated" : "rejected";

    if (
      window.confirm(
        `Êtes-vous sûr de vouloir ${actionText} cette proposition citoyenne ?`,
      )
    ) {
      try {
        // ✅ KOD L-API L-7A9I9I (Mise à jour du statut via PUT/PATCH) :
        // await axiosClient.patch(`/manager/proposals/${id}/status`, { status: newStatus });

        // Optimistic Update: Kan-7iydouha mn l-liste des "pending"
        setProposals(proposals.filter((prop) => prop.id !== id));
        alert(
          `La proposition a été ${action === "approve" ? "validée et publiée pour le vote" : "refusée"}.`,
        );
      } catch (error) {
        console.error("Erreur de modification du statut:", error);
        alert("Une erreur s'est produite lors de l'opération.");
      }
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
          Validation des Propositions (Budget Participatif)
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Examinez les idées d'aménagement soumises par les citoyens de votre
          arrondissement.
        </p>
      </div>

      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase">
              <th className="p-3 border-r border-gray-200 w-1/3">
                Idée & Description
              </th>
              <th className="p-3 border-r border-gray-200">Localisation</th>
              <th className="p-3 border-r border-gray-200">Citoyen</th>
              <th className="p-3 border-r border-gray-200">
                Date de soumission
              </th>
              <th className="p-3 text-center w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {proposals.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center text-gray-500 font-bold bg-gray-50/50"
                >
                  <span className="material-symbols-outlined text-3xl block mb-2 text-gray-400">
                    task_alt
                  </span>
                  Aucune proposition en attente de validation dans votre
                  secteur.
                </td>
              </tr>
            ) : (
              proposals.map((prop) => (
                <tr
                  key={prop.id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-sm text-gray-800 transition-colors"
                >
                  {/* Titre et Description combinés pour gagner de l'espace */}
                  <td className="p-3 border-r border-gray-200">
                    <p className="font-bold text-gray-900 mb-1">{prop.title}</p>
                    <p className="text-xs text-gray-600 ">{prop.description}</p>
                  </td>

                  <td className="p-3 border-r border-gray-200 font-medium text-gray-700">
                    {prop.location_name}
                  </td>

                  <td className="p-3 border-r border-gray-200">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 text-xs font-bold">
                      {prop.author}
                    </span>
                  </td>

                  <td className="p-3 border-r border-gray-200 text-gray-500 text-xs font-medium">
                    {new Date(prop.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAction(prop.id, "approve")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 text-xs font-bold uppercase rounded shadow-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          check
                        </span>{" "}
                        Valider
                      </button>
                      <button
                        onClick={() => handleAction(prop.id, "reject")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs font-bold uppercase rounded shadow-sm flex items-center justify-center gap-1 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          close
                        </span>{" "}
                        Refuser
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
