import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axiosClient from '../config/axios-client';
import { UserPen, Pencil, MapPin, Moon, Sun } from 'lucide-react';
import { useStateContext } from './../contexts/ContextProvider';
import toast from 'react-hot-toast';

export default function Profil() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, setUser } = useStateContext();

  const handlephotoClick = () => {
    const fileInput = document.getElementById('filephotoInput');
    fileInput.click();
  };

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    adresse: '',
  });
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [locationData, setLocationData] = useState({
    city_id: '',
    sector_id: '',
  });
  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (!window.confirm('Action irréversible ! Êtes-vous vraiment sûr ?')) return;

    try {
      await axiosClient.delete('/profile/account', {
        data: { password: deletePassword },
      });

      localStorage.removeItem('ACCESS_TOKEN');

      toast.success('Votre compte a été supprimé.');

      window.location.href = '/register';
    } catch (error) {
      toast.error('Mot de passe incorrect ou erreur réseau.');
    }
  };
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put('/profile/password', passwordData);
      toast.success('Mot de passe changé avec succès !');

      setPasswordData({ current_password: '', password: '', password_confirmation: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de mot de passe');
    }
  };
  const handleEditLocationClick = async () => {
    setLocationData({
      city_id: user.city_id || '',
      sector_id: user.sector_id || '',
    });
    setIsEditingLocation(true);

    if (cities.length === 0) {
      try {
        const res = await axiosClient.get('/cities');
        setCities(res.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (user.city_id) {
      fetchSectors(user.city_id);
    }
  };

  const fetchSectors = async (cityId) => {
    try {
      const res = await axiosClient.get(`sectors/city`, { params: { city_id: cityId } });
      setSectors(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCityChange = (e) => {
    const newCityId = e.target.value;

    setSectors([]);
    if (newCityId) {
      fetchSectors(newCityId);
    }
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoadingLocation(true);

    try {
      const response = await axiosClient.put('/profile/location', locationData);
      setUser(response.data);
      setIsEditingLocation(false);
      toast.success('Votre localisation a été mise à jour !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de mise à jour');
      console.log(error);
    } finally {
      setLoadingLocation(false);
    }
  };
  const handleEditClick = () => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      adresse: user.adresse,
    });
    setIsEditing(true);
  };

  const handleChangeImage = async (file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosClient.post('/profile/photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser((prev) => ({
        ...prev,
        image: response.data.image,
      }));

      toast.success('Photo de profil mise à jour avec succès !');
    } catch (error) {
      setPreview(null);
      toast.error(response?.message);
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post('/logout').then(() => {
        setUser(null);
        window.location.href = '/login';
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    setLoadingInfo(true);
    try {
      const response = await axiosClient.get('/user');
      setUser(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingInfo(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingInfo(true);
    try {
      const response = await axiosClient.put('/profile/info', formData);
      setIsEditing(false);
      setUser((prev) => ({
        ...prev,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        adresse: formData.adresse,
      }));
      toast.success('Vos informations ont été mises à jour avec succès !');
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingInfo(false);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-4">Profil & Paramètres</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm flex items-center gap-6 transition-colors">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              <img src={preview || user.image} onClick={handlephotoClick} id="profileImage" alt="Photo de Profil" className="w-20 h-20 rounded-full border-4 border-primary-100 dark:border-gray-700 object-cover" /> <Pencil className="absolute   left-14 h-6 w-4 -top-2 text-primary-500  " />{' '}
            </div>
          </>
        )}

        <input
          type="file"
          id="filephotoInput"
          className="hidden"
          onChange={(e) => {
            handleChangeImage(e.target.files[0]);
          }}
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user.email}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500 text-[20px]">person</span>
            Mes Informations
          </h3>
          {!isEditing && (
            <button onClick={handleEditClick} className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline">
              <UserPen />
            </button>
          )}
        </div>

        <div className="p-6">
          {!isEditing ? (
            <>
              {loadingInfo ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Prénom & Nom</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CIN</p>
                    <p className="font-bold text-gray-900 dark:text-white">{user.cin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Téléphone</p>
                    <p className="font-bold text-gray-900 dark:text-white">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Adresse</p>
                    <p className="font-bold text-gray-900 dark:text-white">{user.adresse}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="first_name" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none" placeholder="Prénom" />
                <input type="text" name="last_name" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none" placeholder="Nom" />
              </div>
              <input type="text" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none" placeholder="Téléphone" />
              <textarea name="adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" placeholder="Adresse"></textarea>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50">
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="text-primary-500 " />
            Ma Localisation
          </h3>
          {!isEditingLocation && (
            <button onClick={handleEditLocationClick} className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline">
              <UserPen className=" " />
            </button>
          )}
        </div>

        <div className="p-6">
          {!isEditingLocation ? (
            <>
              {loadingLocation ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ville</p>
                    <p className="font-bold text-gray-900 dark:text-white">{user.city_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Quartier</p>
                    <p className="font-bold text-gray-900 dark:text-white">{user.sector_name}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={handleLocationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="city_id" value={locationData.city_id} onChange={handleCityChange} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none" required>
                  <option disabled selected value="">
                    Sélectionner une ville
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>

                <select name="sector_id" value={locationData.sector_id} onChange={(e) => setLocationData({ ...locationData, sector_id: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none disabled:opacity-50" disabled={sectors.length === 0} required>
                  <option disabled selected value="">
                    Sélectionner un quartier
                  </option>
                  {sectors.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditingLocation(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Annuler
                </button>
                <button type="submit" disabled={loadingLocation || !locationData.city_id || !locationData.sector_id} className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50">
                  Enregistrer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-colors overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-gray-500 text-[20px]">settings</span>
            Paramètres
          </h3>
        </div>

        <div className="p-2">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors cursor-pointer" onClick={toggleTheme}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-gray-600 dark:text-gray-400">
                <span className="material-symbols-outlined">{isDarkMode ? <Moon /> : <Sun />}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">Mode Sombre</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Changer l'apparence de l'application</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-colors overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500 text-[20px]">lock</span>
            Sécurité & Mot de passe
          </h3>
          {!isEditingPassword && (
            <button onClick={() => setIsEditingPassword(true)} className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline">
              <UserPen className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          {!isEditingPassword ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Mot de passe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dernière modification : il y a longtemps</p>
              </div>
              <span className="text-2xl text-gray-400 tracking-widest">••••••••</span>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Mot de passe actuel</label>
                <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Nouveau mot de passe</label>
                  <input type="password" value={passwordData.password} onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Confirmer le mot de passe</label>
                  <input type="password" value={passwordData.password_confirmation} onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500/50" required />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEditingPassword(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Annuler
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg text-sm font-bold bg-primary-600 text-white hover:bg-primary-500">
                  Mettre à jour
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-900/30 p-6 mb-6">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-500 flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined">warning</span>
          Zone de danger
        </h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Veuillez être certain.</p>
        <button onClick={() => setShowDeleteModal(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm">
          Supprimer mon compte
        </button>
      </div>
      {/* ////////// ///////////////*/}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-500">
                <span className="material-symbols-outlined text-[28px]">delete_forever</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Supprimer le compte</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cette action est définitive.</p>
              </div>
            </div>

            <form onSubmit={handleDeleteAccount}>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Pour confirmer, veuillez saisir votre mot de passe actuel. Toutes vos données seront effacées de SafiPulse.</p>

              <input type="password" placeholder="Votre mot de passe" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white outline-none mb-6 focus:ring-2 focus:ring-red-500/50" required />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg font-bold text-gray-700 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={!deletePassword} className="flex-1 px-4 py-2.5 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-colors">
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="w-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
        <span className="material-symbols-outlined">logout</span>
        Se déconnecter
      </button>
    </div>
  );
}
