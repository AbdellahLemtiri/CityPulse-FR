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
    password: '',
    role_id: '',
    sector_id: '',
  });

  const handleOpenCreate = () => {
    setFormData({
     
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      role_id: '',
      sector_id: '',
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const fetchSectors = async () => {
    setLoadingCategories(true);
    try {
      const response = await axiosClient.get('/admin/sectors');
      setLoadingCategories(false);
      setSectors(response.data);
      console.log(response.data);
    } catch (error) {
      setLoadingCategories(false);
      console.log(error);
      alert('Impossible de charger les données.');
    } finally {
      setLoadingCategories(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.role_id === '2' && !formData.sector_id) {
      alert('Veuillez assigner un secteur au Manager.');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isEditing) {
        alert('Modification en cours de dev...');
      } else {
        const response = await axiosClient.post('/admin/staff', formData);

        const sectorName = formData.role_id === '4' ? sectors.find((s) => s.id === parseInt(formData.sector_id))?.name : '-';

        const newStaff = response.data.user;

        setStaffList([newStaff, ...staffList]);
        alert(response.data.message);
      }

      setIsModalOpen(false);
      setFormData({
     
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role_id: "",
        sector_id: '',
      });
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.log(error);
        alert('Erreur Serveur: Impossible de contacter le Backend.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchStaff = async () => {
    setLoadingList(true);
    try {
      const response = await axiosClient.get('/admin/staff');
      setLoading(false);

      setStaffList(response.data);
    } catch (error) {
      setLoading(false);
      console.error('Erreur lors de la récupération du staff:', error);
      alert('Impossible de charger les données.');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);
  useEffect(() => {
    fetchSectors();
  }, []);
  const toggleStatus = (id) => {
    if (window.confirm('Voulez-vous vraiment modifier le statut de cet accès ?')) {
      setStaffList(staffList.map((s) => (s.id === id ? { ...s, is_banned: !s.is_banned } : s)));
    }
  };
  console.log(sectors);

  return loading ? (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
    </div>
  ) : (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Gestion du Staff (RBAC)</h2>
          <p className="text-sm text-gray-600 mt-1">Créez et gérez les accès des Managers et Journalistes.</p>
        </div>
        <button onClick={handleOpenCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 uppercase text-sm shadow-sm transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Nouveau Compte
        </button>
      </div>

      {/* TABLEAU ADMINISTRATIF */}
      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-700 uppercase tracking-wider">
              <th className="p-3 border-r border-gray-200">Nom & Prénom</th>
              <th className="p-3 border-r border-gray-200">Email Professionnel</th>
              <th className="p-3 border-r border-gray-200">Rôle</th>
              <th className="p-3 border-r border-gray-200">Secteur (Scope)</th>
              <th className="p-3 border-r border-gray-200 text-center">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(staffList) &&
              staffList.map((staff) => (
                <tr key={staff.id} className={`border-b border-gray-200 text-sm ${!staff.is_banned ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                  <td className="p-3 border-r border-gray-200 font-bold text-gray-900">
                    {staff.first_name} {staff.last_name}
                  </td>
                  <td className="p-3 border-r border-gray-200 text-gray-600">{staff.email}</td>
                  <td className="p-3 border-r border-gray-200">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${staff.role_id === '4' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-indigo-100 text-indigo-700 border-indigo-300'}`}>{staff.role.name}</span>
                  </td>
                  <td className="p-3 border-r border-gray-200 font-bold text-gray-700">{staff.sector_name}</td>
                  <td className="p-3 border-r border-gray-200 text-center">{staff.is_banned === true ? <span className="text-green-600 font-bold uppercase text-[10px] bg-green-100 border border-green-300 px-2 py-1">Actif</span> : <span className="text-red-600 font-bold uppercase text-[10px] bg-red-100 border border-red-300 px-2 py-1">Inactif</span>}</td>
                  <td className="p-3 text-center flex justify-center gap-2">
                    <button onClick={() => handleOpenEdit(staff)} className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase">
                      Éditer
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => toggleStatus(staff.id)} className={`${staff.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'} font-bold text-xs uppercase`}>
                      {staff.is_active ? 'Bloquer' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

   
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-400 w-full max-w-2xl flex flex-col shadow-2xl">
            {/* Header Modal */}
            <div className="bg-gray-800 p-4 border-b border-gray-900 flex justify-between items-center text-white">
              <h3 className="font-bold uppercase text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                {isEditing ? 'Modifier les accès du membre' : 'Créer un nouveau compte Staff'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-gray-300 font-bold px-2">
                X
              </button>
            </div>

            {/* Body Modal (Le Formulaire) */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Prénom */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prénom *</label>
                  <input type="text" required value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" placeholder="Ex: Hassan" />
                </div>
                {/* Nom */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom de famille *</label>
                  <input type="text" required value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" placeholder="Ex: Alami" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Professionnel *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" placeholder="nom@safipulse.ma" />
                </div>
                {/* Mot de passe */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Mot de passe {isEditing && '(Laisser vide pour ne pas modifier)'} {!isEditing && '*'}
                  </label>
                  <input
                    type="password"
                    required={!isEditing} 
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="********"
                  />
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                 <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rôle Système *</label>
                  <select
                    value={formData.role_id}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        role_id: e.target.value
                      });
                        if(e.target.value === '4'){
                          setFormData({
                            ...formData,
                            sector_id: ''
                          });
                        }
                      
                    }}
                    className="w-full border border-gray-300 p-2 text-sm bg-white focus:outline-none focus:border-blue-500">
                     <option value="4">Journaliste (Narrateur)</option>
                     <option value="2">Manager (Opérateur de secteur)</option> 
                
                  </select>
                </div>

                 <div className={`transition-opacity ${formData.role_id === '2' ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Secteur Assigné {formData.role_id === '2' && '*'}</label>
                  <select value={formData.sector_id} onChange={(e) => setFormData({ ...formData, sector_id: e.target.value })} disabled={formData.role_id !== '2'} className="w-full border border-gray-300 p-2 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option disabled selected value="">Sélectionner un secteur </option>
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                  {formData.role_id === '4' && <p className="text-[10px] text-gray-500 mt-1 italic">Un journaliste a un accès global à la ville.</p>}
                </div>
              </div>

               <div className="flex gap-3 mt-8 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 uppercase text-sm">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 uppercase text-sm disabled:opacity-50">
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
