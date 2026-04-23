import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';

export default function AdminStaff() {
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [LoadingCategories, setLoadingCategories] = useState(false);
  const [errors, setErrors] = useState({});
  const [sectors, setSectors] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    cin: '',
    role: '',
    sector_id: '',
  });

  const handleOpenCreate = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      cin: '',
      password: '',
      role: '',
      sector_id: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const fetchSectors = async () => {
    setLoadingCategories(true);
    try {
      const response = await axiosClient.get('/sectors/city');
      setSectors(response.data);
    } catch (error) {
      console.log(error);
      alert('Impossible de charger les secteurs.');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.sector_id) {
      alert('Veuillez obligatoirement assigner un secteur à ce membre du staff.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isEditing) {
        alert('Modification en cours de dev...');
      } else {
        const response = await axiosClient.post('/admin/staff', formData);
        const newStaff = response.data.user;

        setStaffList([newStaff, ...staffList]);
        alert(response.data.message);
      }

      setIsModalOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        role: '',
        cin: '',
        sector_id: '',
      });
    } catch (error) {
      if (isEditing) {
        if (error.response.status === 422) {
          const errors = error.response.data.errors;

          Object.keys(errors).forEach((field) => {
            errors[field].forEach((msg) => {
              toast.error(msg);
            });
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchStaff = async () => {
    setLoadingList(true);
    try {
      const response = await axiosClient.get('/admin/staff');
      setStaffList(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du staff:', error);
      alert('Impossible de charger les données du staff.');
    } finally {
      setLoading(false);
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchSectors();
  }, []);

  const toggleStatus = (id) => {
    if (window.confirm('Voulez-vous vraiment modifier le statut de cet accès ?')) {
      setStaffList(staffList.map((s) => (s.id === id ? { ...s, is_banned: !s.is_banned, is_active: !s.is_active } : s)));
    }
  };

  return loading ? (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  ) : (
    <div className="max-w-6xl mx-auto text-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Gestion du Staff (RBAC)</h2>
          <p className="text-sm text-gray-400 mt-1">Créez et gérez les accès des Managers et Journalistes de secteurs.</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-2 px-6 rounded uppercase text-sm shadow-sm  flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Nouveau Compte
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-900 border-b border-gray-700 text-xs text-gray-400 uppercase tracking-wider">
              <th className="p-4 ">Nom & Prénom</th>
              <th className="p-4 ">Email Professionnel</th>
              <th className="p-4 ">Rôle</th>
              <th className="p-4 ">Secteur (Scope)</th>
              <th className="p-4  text-center">Statut</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(staffList) && staffList.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500 font-bold bg-gray-800 border-t border-dashed border-gray-700">
                  Aucun membre du staff trouvé.
                </td>
              </tr>
            )}
            {Array.isArray(staffList) &&
              staffList.map((staff) => (
                <tr key={staff.id} className={`border-b border-gray-700 text-sm  ${staff.is_banned ? 'bg-red-900/10' : 'hover:bg-gray-700/50'}`}>
<<<<<<< HEAD
                  <td className="p-4  font-bold text-gray-200">
                    {staff.first_name} {staff.last_name}
                  </td>
                  <td className="p-4  text-gray-400">{staff.email}</td>
                  <td className="p-4 ">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${staff.role === 'Journaliste' ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' : 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50'}`}>{staff.role}</span>
                  </td>

                  <td className="p-4  font-bold text-gray-300 flex items-center gap-2">
=======
                  <td className="p-4 border-r border-gray-700 font-bold text-gray-200">
                    {staff.first_name} {staff.last_name}
                  </td>
                  <td className="p-4 border-r border-gray-700 text-gray-400">{staff.email}</td>
                  <td className="p-4 border-r border-gray-700">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${staff.role === 'Journaliste' ? 'bg-purple-900/30 text-purple-400 border-purple-800/50' : 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50'}`}>{staff.role}</span>
                  </td>

                  <td className="p-4 border-r border-gray-700 font-bold text-gray-300 flex items-center gap-2">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    <span className="material-symbols-outlined text-[16px] text-gray-500">location_on</span>
                    {staff.sector || '-'}
                  </td>

<<<<<<< HEAD
                  <td className="p-4  text-center">{!staff.is_banned ? <span className="text-green-400 font-bold uppercase text-[10px] bg-green-900/30 border border-green-800/50 rounded px-2 py-1 tracking-wider">Actif</span> : <span className="text-red-400 font-bold uppercase text-[10px] bg-red-900/30 border border-red-800/50 rounded px-2 py-1 tracking-wider">Bloqué</span>}</td>
                  <td className="p-4 text-center flex justify-center items-center gap-3">
                    
=======
                  <td className="p-4 border-r border-gray-700 text-center">{!staff.is_banned ? <span className="text-green-400 font-bold uppercase text-[10px] bg-green-900/30 border border-green-800/50 rounded px-2 py-1 tracking-wider">Actif</span> : <span className="text-red-400 font-bold uppercase text-[10px] bg-red-900/30 border border-red-800/50 rounded px-2 py-1 tracking-wider">Bloqué</span>}</td>
                  <td className="p-4 text-center flex justify-center items-center gap-3">
                    <button onClick={() => handleOpenEdit(staff)} className="text-primary-400 hover:text-primary-300 font-bold text-xs uppercase ">
                      Éditer
                    </button>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
                    <span className="text-gray-600">|</span>
                    <button onClick={() => toggleStatus(staff.id)} className={`${!staff.is_banned ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'} font-bold text-xs uppercase `}>
                      {!staff.is_banned ? 'Bloquer' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-2xl flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto">
<<<<<<< HEAD
             <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center text-white rounded-t-lg sticky top-0 z-10">
=======
            {/* Header Modal */}
            <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center text-white rounded-t-lg sticky top-0 z-10">
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
              <h3 className="font-bold uppercase text-sm flex items-center gap-2 tracking-wide">
                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                {isEditing ? 'Modifier les accès du membre' : 'Créer un nouveau compte Staff'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white font-bold p-1 ">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Prénom *</label>
                  <input type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 " placeholder="Ex: Hassan" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de famille *</label>
                  <input type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 " placeholder="Ex: Alami" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">phone Professionnel *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 " placeholder="phone de travaile" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">cin d'identité *</label>
                  <input type="text" required value={formData.cin} onChange={(e) => setFormData({ ...formData, cin: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 " placeholder="phone de travaile" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Professionnel *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 " placeholder="nom@safipulse.ma" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Mot de passe {isEditing && '(Laisser vide pour garder)'} {!isEditing && '*'}
                  </label>
                  <input type="password" required={!isEditing} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 " placeholder="********" />
                </div>
              </div>

              <hr className="my-6 border-gray-700" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rôle Système *</label>
                  <select required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 ">
                    <option value="" disabled>
                      Sélectionner un rôle
                    </option>
                    <option value="journalist">Journaliste </option>
                    <option value="manager">Manager </option>
                  </select>
                </div>

                <div className={`transition-opacity duration-300 ${formData.role ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    {formData.role === 'journalist' && 'Le quartier où il habite le Journalistique'}
                    {formData.role === 'manager' && 'Secteur de travail de ce Manager'}
                    {formData.role === '' && 'Choisir un rôle'}
                  </label>{' '}
                  <select required value={formData.sector_id} onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500 ">
                    <option disabled value="">
                      Sélectionner un secteur
                    </option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-5 border-t border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded uppercase text-xs ">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded uppercase text-xs disabled:opacity-50 ">
                  {isSubmitting ? 'Enregistrement...' : 'Sauvegarder le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
