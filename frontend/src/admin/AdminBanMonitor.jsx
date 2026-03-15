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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
          Surveillance des Bannissements
        </h2>
        <p className="text-sm text-gray-600 mt-1">Gérez les comptes citoyens suspendus suite à la règle des 3 Strikes.</p>
      </div>

      {/* Message d'information */}
      <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 flex items-start gap-3">
        <span className="material-symbols-outlined text-red-600">warning</span>
        <div>
          <p className="text-sm font-bold text-red-800">Règle de suspension automatique activée</p>
          <p className="text-xs text-red-700 mt-1">Tout utilisateur atteignant 3 avertissements (Strikes) est automatiquement placé dans cette liste. Seul un Administrateur peut lever cette sanction.</p>
        </div>
      </div>

      {/* TABLEAU DES BANNIS */}
      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-700 uppercase tracking-wider">
              <th className="p-3 border-r border-gray-200">Citoyen Banni</th>
              <th className="p-3 border-r border-gray-200">Date de Suspension</th>
              <th className="p-3 border-r border-gray-200">Dernier Motif (3ème Strike)</th>
              <th className="p-3 border-r border-gray-200">Sanctionné par</th>
              <th className="p-3 text-center">Action Admin</th>
            </tr>
          </thead>
          <tbody>
            {bannedUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500 font-bold">
                  Aucun citoyen n'est actuellement banni.
                </td>
              </tr>
            ) : (
              bannedUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                  <td className="p-3 border-r border-gray-200">
                    <p className="font-bold text-gray-900">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="p-3 border-r border-gray-200 text-red-600 font-bold">
                    {new Date(user.ban_date).toLocaleString('fr-FR')}
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">
                    {user.last_reason}
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-600 text-xs">
                    {user.banned_by}
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => handleUnban(user.id, `${user.first_name} ${user.last_name}`)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-3 uppercase text-xs transition-colors flex items-center justify-center gap-1 mx-auto"
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