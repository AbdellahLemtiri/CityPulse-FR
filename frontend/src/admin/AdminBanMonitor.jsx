import { useState } from "react";

// --- MOCK DATA ---
const mockBannedUsers = [
  {
    id: 3,
    first_name: "Soufiane",
    last_name: "Tariq",
    email: "soufiane@email.com",
    ban_date: "2026-03-12T14:30:00",
    strikes_count: 3,
    last_reason: "Propos haineux ou injurieux",
    banned_by: "Hassan Alami (Manager)"
  },
  {
    id: 8,
    first_name: "Youssef",
    last_name: "Karam",
    email: "youssef.k@email.com",
    ban_date: "2026-03-01T09:15:00",
    strikes_count: 3,
    last_reason: "Faux signalement répété",
    banned_by: "Nadia Fathi (Manager)"
  }
];

export default function AdminBanMonitor() {
  const [bannedUsers, setBannedUsers] = useState(mockBannedUsers);

  // US.64 : Débannir un utilisateur (Grâce)
  const handleUnban = (id, name) => {
    if (window.confirm(`⚠️ Êtes-vous sûr de vouloir grâcier et réactiver le compte de ${name} ? Son compteur de strikes sera remis à zéro.`)) {
      // Simulation API : axiosClient.post(`/admin/users/${id}/unban`)
      setBannedUsers(bannedUsers.filter(user => user.id !== id));
      alert(`Le compte de ${name} a été réactivé avec succès.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto text-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wide">
          Surveillance des Bannissements
        </h2>
        <p className="text-sm text-gray-400 mt-1">Gérez les comptes citoyens suspendus suite à la règle des 3 Strikes.</p>
      </div>

      {/* Message d'information (Adapté pour le Dark Mode) */}
      <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 flex items-start gap-3 rounded-r-lg">
        <span className="material-symbols-outlined text-red-500">warning</span>
        <div>
          <p className="text-sm font-bold text-red-400">Règle de suspension automatique activée</p>
          <p className="text-xs text-red-300 mt-1">Tout utilisateur atteignant 3 avertissements (Strikes) est automatiquement placé dans cette liste. Seul un Administrateur peut lever cette sanction.</p>
        </div>
      </div>

      {/* TABLEAU DES BANNIS */}
      <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
              <th className="p-4 border-r border-gray-700">Citoyen Banni</th>
              <th className="p-4 border-r border-gray-700">Date de Suspension</th>
              <th className="p-4 border-r border-gray-700">Dernier Motif (3ème Strike)</th>
              <th className="p-4 border-r border-gray-700">Sanctionné par</th>
              <th className="p-4 text-center">Action Admin</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500 font-bold bg-gray-800">
                  Aucun citoyen n'est actuellement banni.
                </td>
              </tr>
            ) : (
              bannedUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 text-sm transition-colors">
                  <td className="p-4 border-r border-gray-700">
                    <p className="font-bold text-gray-200">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </td>
                  <td className="p-4 border-r border-gray-700 text-red-400 font-bold">
                    {new Date(user.ban_date).toLocaleString('fr-FR')}
                  </td>
                  <td className="p-4 border-r border-gray-700 text-gray-300">
                    {user.last_reason}
                  </td>
                  <td className="p-4 border-r border-gray-700 text-gray-400 text-xs">
                    {user.banned_by}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleUnban(user.id, `${user.first_name} ${user.last_name}`)}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold py-1.5 px-3 rounded uppercase text-xs transition-colors flex items-center justify-center gap-1 mx-auto"
                      title="Réactiver le compte"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                      Grâcier
                    </button>
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