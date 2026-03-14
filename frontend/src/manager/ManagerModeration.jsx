import { useState } from "react";

// --- MOCK DATA ---
const mockUsers = [
  { id: 1, first_name: "Yassine", last_name: "Bourk", email: "yassine@email.com", cin: "HH112233", strikes: 0, is_banned: false },
  { id: 2, first_name: "Ayoub", last_name: "Malki", email: "ayoub@email.com", cin: "HH445566", strikes: 2, is_banned: false },
  { id: 3, first_name: "Soufiane", last_name: "Tariq", email: "soufiane@email.com", cin: "HH778899", strikes: 3, is_banned: true },
  { id: 4, first_name: "Nadia", last_name: "Safi", email: "nadia@email.com", cin: "HH000000", strikes: 1, is_banned: false },
];

export default function ManagerModeration() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State pour le Modal de Strike
  const [userToStrike, setUserToStrike] = useState(null);
  const [strikeReason, setStrikeReason] = useState("Faux signalement");

  // Fonction de recherche locale
  const filteredUsers = users.filter(user => 
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.cin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction pour appliquer le Strike
  const handleApplyStrike = (e) => {
    e.preventDefault();
    
    // API: axiosClient.post(`/manager/users/${userToStrike.id}/strike`, { reason: strikeReason })
    
    setUsers(users.map(u => {
      if (u.id === userToStrike.id) {
        const newStrikes = u.strikes + 1;
        // US.53 : Si le compteur atteint 3, le compte est automatiquement suspendu
        const isNowBanned = newStrikes >= 3; 
        return { ...u, strikes: newStrikes, is_banned: isNowBanned };
      }
      return u;
    }));

    alert(`Strike appliqué à ${userToStrike.first_name} pour : ${strikeReason}`);
    setUserToStrike(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
          Modération & Sanctions (Strikes)
        </h2>
        <p className="text-sm text-gray-600 mt-1">Recherchez un utilisateur pour consulter son dossier ou appliquer une sanction.</p>
      </div>

      {/* BARRE DE RECHERCHE */}
      <div className="bg-white border border-gray-300 p-4 mb-6 shadow-sm flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rechercher un citoyen</label>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom, Email ou CIN..."
            className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-red-500"
          />
        </div>
        <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 uppercase text-sm h-[38px]">
          Chercher
        </button>
      </div>

      {/* TABLEAU DES UTILISATEURS */}
      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase">
              <th className="p-3 border-r border-gray-200">Citoyen</th>
              <th className="p-3 border-r border-gray-200">Email / Contact</th>
              <th className="p-3 border-r border-gray-200">CIN</th>
              <th className="p-3 border-r border-gray-200 text-center">Niveau d'Infraction</th>
              <th className="p-3 border-r border-gray-200 text-center">Statut du Compte</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 font-bold">Aucun utilisateur trouvé.</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm text-gray-800">
                  <td className="p-3 border-r border-gray-200 font-bold">{user.first_name} {user.last_name}</td>
                  <td className="p-3 border-r border-gray-200">{user.email}</td>
                  <td className="p-3 border-r border-gray-200">{user.cin}</td>
                  
                  {/* Affichage des Strikes (0/3, 1/3, etc.) */}
                  <td className="p-3 border-r border-gray-200 text-center">
                    <span className={`font-bold px-2 py-1 border ${
                      user.strikes === 0 ? 'bg-green-100 text-green-800 border-green-300' : 
                      user.strikes === 1 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                      user.strikes === 2 ? 'bg-orange-100 text-orange-800 border-orange-300' :
                      'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {user.strikes} / 3
                    </span>
                  </td>

                  {/* Statut (Banni ou Actif) */}
                  <td className="p-3 border-r border-gray-200 text-center">
                    {user.is_banned ? (
                      <span className="text-red-600 font-bold uppercase text-xs">⛔ Banni</span>
                    ) : (
                      <span className="text-green-600 font-bold uppercase text-xs">✓ Actif</span>
                    )}
                  </td>

                  {/* Bouton d'action */}
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => setUserToStrike(user)}
                      disabled={user.is_banned}
                      className={`px-3 py-1 text-xs font-bold uppercase ${
                        user.is_banned 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {user.is_banned ? "Suspendu" : "Avertir (Strike)"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL : APPLIQUER UN STRIKE */}
      {userToStrike && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-400 w-full max-w-md flex flex-col shadow-xl">
            
            <div className="bg-red-600 p-4 border-b border-gray-400 flex justify-between items-center text-white">
              <h3 className="font-bold uppercase">
                Avertissement Disciplinaire
              </h3>
              <button 
                onClick={() => setUserToStrike(null)} 
                className="hover:text-gray-200 font-bold px-2"
              >
                X
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-800">
                <p><strong>Utilisateur :</strong> {userToStrike.first_name} {userToStrike.last_name}</p>
                <p><strong>Strikes actuels :</strong> {userToStrike.strikes} / 3</p>
                {userToStrike.strikes === 2 && (
                  <p className="mt-2 font-bold uppercase">⚠️ Attention : Ce 3ème strike entraînera la suspension définitive du compte.</p>
                )}
              </div>

              <form onSubmit={handleApplyStrike}>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Motif du Strike *</label>
                  <select 
                    value={strikeReason}
                    onChange={(e) => setStrikeReason(e.target.value)}
                    className="w-full border border-gray-300 p-2 text-sm bg-white"
                  >
                    <option value="Faux signalement">Faux signalement (Abus)</option>
                    <option value="Photo inappropriée">Photo inappropriée / Hors sujet</option>
                    <option value="Propos haineux ou injurieux">Propos haineux ou injurieux dans les commentaires</option>
                    <option value="Autre infraction">Autre infraction des conditions d'utilisation</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setUserToStrike(null)}
                    className="flex-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 uppercase text-sm"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 uppercase text-sm"
                  >
                    Confirmer le Strike
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}