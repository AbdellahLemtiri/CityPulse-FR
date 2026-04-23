import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axiosClient from '../config/axios-client';
import toast from 'react-hot-toast';
import { Pill, MapPin, Phone, Calendar, Link as LinkIcon,Moon, PlusCircle, Save } from 'lucide-react';

export default function AddDutyPharmacy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    location_url: '',
    start_date: '',
    end_date: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchPharmacy = async () => {
        try {
          const response = await axiosClient.get(`/pharmacies/${id}`);
          const data = response.data;

          const formatDateTime = (dateStr) => (dateStr ? dateStr.replace(' ', 'T').slice(0, 16) : '');

          setFormData({
            name: data.name,
            address: data.address,
            phone: data.phone,
            location_url: data.location_url || '',
            start_date: formatDateTime(data.start_date),
            end_date: formatDateTime(data.end_date),
          });
        } catch (error) {
          toast.error('Erreur de chargement de la pharmacie');
          navigate('/editor/Pharmacies');
        } finally {
          setFetching(false);
        }
      };
      fetchPharmacy();
    }
  }, [id, navigate, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error('La date de fin doit être après la date de début !');
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axiosClient.put(`/pharmacies/${id}`, formData);
        toast.success('Pharmacie mise à jour avec succès !');
        navigate('/editor/Pharmacies');
      } else {
        await axiosClient.post('/pharmacies', formData);
        toast.success('Pharmacie de garde ajoutée avec succès !');
        navigate('/editor/Pharmacies');  
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className=" mx-auto      overflow-hidden">
      <div className="  px-6 py-4   flex items-center gap-3">
        <div className="bg-green-100 dark:bg-primary-800 p-2 rounded-lg text-green-600 dark:text-primary-300">
          <Moon size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{isEditMode ? 'Modifier la Pharmacie' : 'Nouvelle Pharmacie de Garde'}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">{isEditMode ? 'Mettre à jour les informations de garde' : 'Programmer une garde pour la semaine'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 border rounded-lg border-gray-200 dark:border-gray-700 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nom de la pharmacie *</label>
            <div className="relative">
              <Moon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Pharmacie Centrale" className=" w-full bg-gray-50 py-3  dark:text-white  border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600  rounded-lg px-12   text-gray-900 dark:text-white outline-none resize-none border-gray-200 dark:border-slate-700" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Téléphone *</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="05 24..." className=" w-full bg-gray-50 py-3  dark:text-white  border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600  rounded-lg px-12   text-gray-900 dark:text-white outline-none resize-none border-gray-200 dark:border-slate-700" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lien Google Maps (Optionnel)</label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="url" name="location_url" value={formData.location_url} onChange={handleChange} placeholder="https://maps.google.com/" className=" w-full bg-gray-50 py-3  dark:text-white  border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600  rounded-lg px-12   text-gray-900 dark:text-white outline-none resize-none border-gray-200 dark:border-slate-700" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Adresse complète *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea name="address" value={formData.address} onChange={handleChange} required rows="2" placeholder="Quartier, Rue, N°..." className=" w-full bg-gray-50 py-3  dark:text-white  border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600  rounded-lg px-12   text-gray-900 dark:text-white outline-none resize-none border-gray-200 dark:border-slate-700"></textarea>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary-500" /> Début de la garde *
            </label>
            <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleChange} required className="²w-full px-10 bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" /> Fin de la garde *
            </label>
            <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleChange} required className="w-full px-10 bg-gray-100 dark:bg-gray-900 dark:text-white  border border-gray-50/50 focus:border-primary-200 dark:focus:border-primary-600  rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none" />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/editor/pharmacies')} className="px-6 py-3 rounded-lg font-bold text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            Annuler
          </button>
          <button type="submit" disabled={loading} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : isEditMode ? <Save size={20} /> : <PlusCircle size={20} />}
            {isEditMode ? 'Enregistrer ' : 'Programmer '}
          </button>
        </div>
      </form>
    </div>
  );
}
