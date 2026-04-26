import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast from 'react-hot-toast';

export default function AdminBanMonitor() {
  const [userToStrike, setUserToStrike] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSearch = async (query) => {
    setIsLoading(true);
    if (!query.trim()) {
      setFilteredUsers([]);
      return;
    }
    try {
      const response = await axiosClient.get(`/admin/users?search=${query}`);
      setFilteredUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

    const handleApplyBan = async (userToStrike) => {
      try {
        const response = await axiosClient.post(`/admin/users/ban`, { uuid: userToStrike.uuid });
        toast.success('Banissement appliqué avec succès !');
      } catch (error) {
        toast.error("Une erreur est survenue lors de l'application de l'avertissement.");
      } finally {
        setUserToStrike(null);
      }
      try {
        const response = await axiosClient.get(`/manager/users?search=${query}`);
        setFilteredUsers(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleApplyStrike = async (e) => {
    e.preventDefault();
    setUserToStrike(null);
    const response = await axiosClient.post(`/manager/users/strike`, { reason: strikeReason, id: userToStrike.id });

    if (response.status === 200) {
      toast.success('Avertissement appliqué avec succès !', { style: { background: '#333', color: '#fff' } });
    } else {
      toast.error("Une erreur est survenue lors de l'application de l'avertissement.", { style: { background: '#333', color: '#fff' } });
    }

    setUserToStrike(null);
    setStrikeReason('Faux signalement');
  };

  return (
    <div className="max-w-6xl mx-auto text-gray-200 pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Modération & Sanctions (Strikes)</h2>
        <p className="text-sm text-gray-400 mt-1">Recherchez un citoyen pour consulter son dossier disciplinaire ou lui appliquer un avertissement.</p>
      </div>

      <div className="    p-5 rounded-lg mb-6  flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase  mb-2">Rechercher un citoyen</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[20px]">search</span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tapez un Nom, Email ..." className="w-full border border-gray-600 pl-10 p-2 text-sm bg-gray-900 text-white rounded-lg focus:outline-none focus:border-red-500 " />
          </div>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700  rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700 text-xs text-gray-400 uppercase ">
              <th className="p-4   "> User </th>
              <th className="p-4 ">Email / Contact</th>
              <th className="p-4  text-center">CIN</th>
              <th className="p-4  text-center">Niveau d'Infraction</th>
              <th className="p-4  text-center">Statut du Compte</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center bg-gray-800">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 font-bold bg-gray-800">
                  Aucun utilisateur trouvé avec ces critères.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/30 text-sm ">
                  <td className="p-4  font-bold text-gray-200">
                    {user.first_name + '  ' + user.last_name} <hr /> {user.created_at}
                  </td>
                  <td className="p-4  text-gray-400">
                    {' '}
                    {user.email} {user.phone}
                  </td>
                  <td className="p-4  text-center font-medium text-gray-300">{user.cin}</td>

                  <td className="p-4  text-center">
                    <span className={`font-bold px-2.5 py-1 rounded-lg    text-[11px] uppercase `}>{user.strikes_count} / 3 Strikes</span>
                  </td>

                  <td className="p-4  text-center">
                    {user.is_banned ? (
                      <span className="text-red-400 font-bold uppercase text-xs flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">block</span> Banni
                      </span>
                    ) : (
                      <span className="text-green-400 font-bold uppercase text-xs flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Actif
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center ">
                    <div className="flex flex-col   gap-3">
                      <button onClick={() => handleApplyBan(user)} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase  flex items-center justify-center gap-1 mx-auto ${user.is_banned ? 'bg-gray-900 border border-gray-700 text-gray-600 cursor-not-allowed' : 'bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white border border-red-800/50 hover:border-red-600'}`}>
                        <span className="material-symbols-outlined text-[16px]">{user.is_banned ? 'lock' : 'warning'}</span>
                        {user.is_banned ? 'desbaner' : 'baner '}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {userToStrike && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-red-900/40 p-4 border-b border-red-800/50 flex justify-between items-center text-red-200">
              <h3 className="font-bold uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined">gavel</span>
                Avertissement Disciplinaire
              </h3>
              <button onClick={() => setUserToStrike(null)} className="hover:text-white font-bold p-1 ">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-red-900/10 border border-red-900/30 rounded-lg text-sm text-gray-300">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Utiloyen concerné :</span>
                  <span className="font-bold text-white">
                    {userToStrike.first_name} {userToStrike.last_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Dossier actuel :</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-xs border  `}>{userToStrike.strikes} / 3 Strikes</span>
                </div>

                {userToStrike.strikes === 2 && (
                  <div className="mt-4 p-3 bg-red-900/40 border border-red-500/50 rounded flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-400 text-[18px]">error</span>
                    <p className="font-bold text-red-300 text-xs uppercase leading-tight mt-0.5">Attention : Ce 3ème avertissement entraînera la suspension définitive du compte de ce citoyen.</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleApplyStrike}>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Motif de la sanction *</label>
                  <select value={strikeReason} onChange={(e) => setStrikeReason(e.target.value)} className="w-full border border-gray-600 rounded-lg p-3 text-sm bg-gray-900 text-white focus:outline-none focus:border-red-500 ">
                    <option value="Faux signalement">Faux signalement (Abus du système)</option>
                    <option value="Photo inappropriée">Photo inappropriée / Hors sujet</option>
                    <option value="Propos haineux ou injurieux">Propos haineux ou injurieux dans les commentaires</option>
                    <option value="Autre infraction">Autre infraction des conditions d'utilisation</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-700 mt-2">
                  <button type="button" onClick={() => setUserToStrike(null)} className="flex-1 border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded-lg uppercase text-xs ">
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-lg uppercase text-xs  flex justify-center items-center gap-2 shadow-lg shadow-red-900/20">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
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
