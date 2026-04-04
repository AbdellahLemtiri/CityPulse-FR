import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext"; 

export default function Profil() {
  const { isDarkMode, toggleTheme } = useTheme();

   const mockUser = {
    first_name: "Abdellah",
    last_name: "Lemtiri",
    email: "abdellah.lemtiri@email.com",
    phone: "0600112233",
    cin: "HH123456",
    adresse: "Quartier Plateau, Safi",
    xp_points: 1200,
    avatar: ""
  };

  // 2. STATES
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    adresse: ""
  });

  const handleEditClick = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      adresse: user.adresse
    });
    setIsEditing(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
     setTimeout(() => {
      setUser({ ...user, ...formData });
      setIsEditing(false);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-4">
        Profil & Paramètres
      </h2>

       <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm flex items-center gap-6 transition-colors">
        <img 
          src={user.avatar} 
          alt="Profil" 
          className="w-20 h-20 rounded-full border-4 border-primary-100 dark:border-gray-700 object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user.email}</p>
          <div className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-md font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
            {user.xp_points} XP
          </div>
        </div>
      </div>

       <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500 text-[20px]">person</span>
            Mes Informations
          </h3>
          {!isEditing && (
            <button onClick={handleEditClick} className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline">
              Modifier
            </button>
          )}
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Prénom & Nom</p><p className="font-bold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">CIN</p><p className="font-bold text-gray-900 dark:text-white">{user.cin}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p><p className="font-bold text-gray-900 dark:text-white">{user.phone}</p></div>
              <div><p className="text-xs text-gray-500 dark:text-gray-400">Adresse</p><p className="font-bold text-gray-900 dark:text-white">{user.adresse}</p></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none" placeholder="Prénom" />
                <input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none" placeholder="Nom" />
              </div>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none" placeholder="Téléphone" />
              <textarea value={formData.adresse} onChange={(e) => setFormData({...formData, adresse: e.target.value})} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" placeholder="Adresse"></textarea>
              
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Annuler</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl text-sm font-bold bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50">Enregistrer</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 3. PARAMÈTRES (Settings) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500 text-[20px]">settings</span>
            Paramètres
          </h3>
        </div>
        
        <div className="p-2">
          {/* Toggle Mode Sombre */}
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined">{isDarkMode ? 'dark_mode' : 'light_mode'}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Mode Sombre</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Changer l'apparence de l'application</p>
              </div>
            </div>
            {/* Switch UI simple */}
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DÉCONNEXION */}
      <button className="w-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
        <span className="material-symbols-outlined">logout</span>
        Se déconnecter
      </button>

    </div>
  );
}