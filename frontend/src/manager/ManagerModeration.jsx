import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast from 'react-hot-toast';
<<<<<<< HEAD

export default function ManagerModeration() {
  const [userToStrike, setUserToStrike] = useState(null);
  const [strikeReason, setStrikeReason] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
=======
  

export default function ManagerModeration() {
 
  const [userToStrike, setUserToStrike] = useState(null);
  const [strikeReason, setStrikeReason] = useState('Faux signalement');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // ---
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
  const handleSearch = async (query) => {
    setIsLoading(true);
    if (!query.trim()) {
      setFilteredUsers([]);
      return;
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

<<<<<<< HEAD
  const handleApplyStrike = async (e) => {
    e.preventDefault();
    setUserToStrike(null);
    const response = await axiosClient.post(`/manager/users/strike?id=${userToStrike.uuid}&reason=${strikeReason}`);

    if (response.status === 200) {
      toast.success('Avertissement appliqué avec succès !');
    } else {
      toast.error("Une erreur est survenue lors de l'application de l'avertissement.");
    }
=======
  const handleApplyStrike = async (e)  => {
    e.preventDefault();
    setUserToStrike(null);
    const response = await axiosClient.post(`/manager/users/strike`, { reason: strikeReason,id : userToStrike.id })

    if(response.status === 200) {
      toast.success('Avertissement appliqué avec succès !', { style: { background: '#333', color: '#fff' } });
    } else {
      toast.error('Une erreur est survenue lors de l\'application de l\'avertissement.', { style: { background: '#333', color: '#fff' } });
    }
     
     
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8

    setUserToStrike(null);
    setStrikeReason('Faux signalement');
  };

 
  return (
    <div className="max-w-6xl mx-auto text-gray-800 dark:text-gray-200 pb-10 transition-colors duration-300">
      <div className="mb-6 mt-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Modération & Sanctions (Strikes)</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Recherchez un citoyen pour consulter son dossier disciplinaire ou lui appliquer un avertissement.</p>
      </div>

<<<<<<< HEAD
      <div className="    p-5 rounded-lg mb-6  flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-400 uppercase  mb-2">Rechercher un citoyen</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-[20px]">search</span>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tapez un Nom, Email ..." className="w-full border border-gray-600 pl-10 p-2 text-sm bg-gray-900 text-white rounded-lg focus:outline-none focus:border-red-500 " />
=======
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-end transition-colors">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Rechercher un citoyen</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 text-[20px]">search</span>
            <input 
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Tapez un Nom, Email ou CIN..." 
              className="w-full border border-gray-200 dark:border-gray-600 pl-10 p-2.5 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-red-500 dark:focus:border-red-500 transition-all shadow-inner" 
            />
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700  rounded-lg overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-black">
              <th className="p-4  dark:border-gray-700">Citoyen</th>
              <th className="p-4  dark:border-gray-700">Email / Contact</th>
              <th className="p-4  dark:border-gray-700 text-center">CIN</th>
              <th className="p-4  dark:border-gray-700 text-center">Niveau d'Infraction</th>
              <th className="p-4  dark:border-gray-700 text-center">Statut du Compte</th>
=======
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-black">
              <th className="p-4 border-r border-gray-200 dark:border-gray-700">Citoyen</th>
              <th className="p-4 border-r border-gray-200 dark:border-gray-700">Email / Contact</th>
              <th className="p-4 border-r border-gray-200 dark:border-gray-700 text-center">CIN</th>
              <th className="p-4 border-r border-gray-200 dark:border-gray-700 text-center">Niveau d'Infraction</th>
              <th className="p-4 border-r border-gray-200 dark:border-gray-700 text-center">Statut du Compte</th>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="p-12 text-center bg-transparent">
                  <div className="flex justify-center flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                    <span className="text-xs font-bold text-gray-400">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-400 font-bold bg-transparent italic">
                  Aucun utilisateur trouvé avec ces critères.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 text-sm transition-colors group">
<<<<<<< HEAD
                  <td className="p-4  dark:border-gray-700 font-bold text-gray-800 dark:text-gray-200">
                    <div className="flex flex-col">
                      <span>
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal italic">Inscrit le : {user.created_at}</span>
                    </div>
                  </td>
                  <td className="p-4  dark:border-gray-700 text-gray-600 dark:text-gray-400">
=======
                  <td className="p-4 border-r border-gray-200 dark:border-gray-700 font-bold text-gray-800 dark:text-gray-200">
                    <div className="flex flex-col">
                      <span>{user.first_name} {user.last_name}</span>
                      <span className="text-[10px] text-gray-400 font-normal italic">Inscrit le : {user.created_at}</span>
                    </div>
                  </td>
                  <td className="p-4 border-r border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"> 
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-xs">{user.phone}</span>
                    </div>
                  </td>
<<<<<<< HEAD
                  <td className="p-4  dark:border-gray-700 text-center font-mono font-bold text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-transparent">{user.cin}</td>

                  <td className="p-4  dark:border-gray-700 text-center">
                    <span className={`font-black px-3 py-1 rounded-lg border text-[10px] uppercase ${user.strikes_count >= 2 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-900/30' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-900/30'}`}>{user.strikes_count} / 3 Strikes</span>
                  </td>

                  <td className="p-4  dark:border-gray-700 text-center">
                    {user.is_banned ? (
                      <span className="text-red-500 dark:text-red-400 font-black uppercase text-[10px] flex items-center justify-center gap-1">
                         Banni
                      </span>
                    ) : (
                      <span className="text-emerald-500 dark:text-emerald-400 font-black uppercase text-[10px] flex items-center justify-center gap-1">
                      Actif
=======
                  <td className="p-4 border-r border-gray-200 dark:border-gray-700 text-center font-mono font-bold text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-transparent">
                    {user.cin}
                  </td>

                  <td className="p-4 border-r border-gray-200 dark:border-gray-700 text-center">
                    <span className={`font-black px-3 py-1 rounded-full border text-[10px] uppercase ${
                      user.strikes_count >= 2 ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 dark:border-red-900/30' : 
                      'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-900/30'
                    }`}>
                      {user.strikes_count} / 3 Strikes
                    </span>
                  </td>

                  <td className="p-4 border-r border-gray-200 dark:border-gray-700 text-center">
                    {user.is_banned ? (
                      <span className="text-red-500 dark:text-red-400 font-black uppercase text-[10px] flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">block</span> Banni
                      </span>
                    ) : (
                      <span className="text-emerald-500 dark:text-emerald-400 font-black uppercase text-[10px] flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span> Actif
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                      </span>
                    )}
                  </td>

<<<<<<< HEAD
                  <td className="p-4 text-center">
                    <button onClick={() => setUserToStrike(user)} disabled={user.is_banned} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase  flex items-center justify-center gap-2 mx-auto border ${user.is_banned ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed -none' : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white border-red-200 dark:border-red-900/50 -sm'}`}>
                   
=======
                   <td className="p-4 text-center">
                    <button 
                      onClick={() => setUserToStrike(user)} 
                      disabled={user.is_banned} 
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 mx-auto border ${
                        user.is_banned 
                        ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed shadow-none' 
                        : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-600 dark:hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white border-red-200 dark:border-red-900/50 shadow-sm'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{user.is_banned ? 'lock' : 'report'}</span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                      {user.is_banned ? 'Suspendu' : 'Avertir'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {userToStrike && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
<<<<<<< HEAD
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-w-md flex flex-col -2xl overflow-hidden transition-colors">
            <div className="bg-red-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
      
                Sanction
              </h3>
              <button onClick={() => setUserToStrike(null)} className="hover:bg-white/20 rounded-lg p-1 transition-colors leading-none">
=======
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden transition-colors">
            <div className="bg-red-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">gavel</span>
                Sanction
              </h3>
              <button onClick={() => setUserToStrike(null)} className="hover:bg-white/20 rounded-full p-1 transition-colors leading-none">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <div className="p-6">
<<<<<<< HEAD
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-lg text-sm transition-colors">
=======
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl text-sm transition-colors">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Cible :</span>
                  <span className="font-black text-gray-900 dark:text-white underline decoration-red-500 decoration-2">
                    {userToStrike.first_name} {userToStrike.last_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px]">Strikes Actuels :</span>
<<<<<<< HEAD
                  <span className={`font-black px-2 py-0.5 rounded-lg border text-xs ${userToStrike.strikes_count >= 2 ? 'text-red-500 border-red-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>{userToStrike.strikes_count} / 3</span>
=======
                  <span className={`font-black px-2 py-0.5 rounded border text-xs ${userToStrike.strikes_count >= 2 ? 'text-red-500 border-red-500/20' : 'text-emerald-500 border-emerald-500/20'}`}>
                    {userToStrike.strikes_count} / 3
                  </span>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                </div>

                {userToStrike.strikes_count === 2 && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 rounded-lg flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[20px]">warning</span>
<<<<<<< HEAD
                    <p className="font-black text-red-600 dark:text-red-300 text-[10px] uppercase leading-tight">Dernier avertissement : Le compte sera banni après validation.</p>
=======
                    <p className="font-black text-red-600 dark:text-red-300 text-[10px] uppercase leading-tight">
                      Dernier avertissement : Le compte sera banni après validation.
                    </p>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                  </div>
                )}
              </div>

              <form onSubmit={handleApplyStrike} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Motif de la sanction *</label>
<<<<<<< HEAD

                  <input value={strikeReason} onChange={(e) => setStrikeReason(e.target.value)} className="w-full border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red-500    " />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setUserToStrike(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-black py-3 rounded-lg uppercase text-[10px] transition-colors">
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-lg uppercase text-[10px]  -lg -red-600/20 flex justify-center items-center gap-2">
=======
                  <select 
                    value={strikeReason} 
                    onChange={(e) => setStrikeReason(e.target.value)} 
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-red-500 appearance-none cursor-pointer transition-all"
                  >
                    <option value="Faux signalement">Faux signalement (Abus du système)</option>
                    <option value="Photo inappropriée">Photo inappropriée / Hors sujet</option>
                    <option value="Propos haineux ou injurieux">Propos haineux ou injurieux</option>
                    <option value="Autre infraction">Autre infraction des conditions</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setUserToStrike(null)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-black py-3 rounded-xl uppercase text-[10px] transition-colors">
                    Annuler
                  </button>
                  <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl uppercase text-[10px] transition-all shadow-lg shadow-red-600/20 flex justify-center items-center gap-2">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    <span className="material-symbols-outlined text-[18px]">gavel</span>
                    Confirmer
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
