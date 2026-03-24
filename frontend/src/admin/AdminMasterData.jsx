import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState('mdm');

  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', isEdit: false, id: null });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categoryData, setCategoryData] = useState({ name: '', icon: '', description: '' });
  const [sectorData, setSectorData] = useState({ name: '', logo: null, city: 'Safi', description: '', boundaries: '' });
  const [partnerData, setPartnerData] = useState({ name: '', email: '', phone_fix: '', whatsapp: '', sla_hours: '', logo: null });

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, sectorsRes, partnersRes] = await Promise.all([axiosClient.get('/admin/categories'), axiosClient.get('/admin/sectors'), axiosClient.get('/admin/partners')]);

      setCategories(categoriesRes.data);
      setSectors(sectorsRes.data);
      setPartners(partnersRes.data);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur de connexion avec le serveur.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, isEdit = false, data = null) => {
    setModalConfig({ isOpen: true, type, isEdit, id: data ? data.id : null });

    if (type === 'category') {
      setCategoryData(isEdit ? { name: data.name, icon: data.icon || '' } : { name: '', icon: '' });
    } else if (type === 'sector') {
      setSectorData(isEdit ? { name: data.name, logo: null, city: 'Safi' } : { name: '', logo: null, city: 'Safi' });
    } else if (type === 'partner') {
      setPartnerData(isEdit ? { name: data.name, email: data.email, phone_fix: data.phone_fix || '', whatsapp: data.whatsapp || '', sla_hours: data.sla_hours || '', logo: null } : { name: '', email: '', phone_fix: '', whatsapp: '', sla_hours: '', logo: null });
    }
  };

  const closeModal = () => setModalConfig({ isOpen: false, type: '', isEdit: false, id: null });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { type, isEdit, id } = modalConfig;

    try {
      const formData = new FormData();

      if (isEdit) {
        formData.append('_method', 'PUT');
      }

      let endpoint = '';

      if (type === 'category') {
        endpoint = isEdit ? `/admin/categories/${id}` : '/admin/categories';
        formData.append('name', categoryData.name);
        if (categoryData.icon) formData.append('icon', categoryData.icon);
        if (categoryData.description) formData.append('description', categoryData.description);
      } else if (type === 'sector') {
        endpoint = isEdit ? `/admin/sectors/${id}` : '/admin/sectors';
        formData.append('name', sectorData.name);
        formData.append('city', sectorData.city);
        if (sectorData.logo) formData.append('logo', sectorData.logo);
      } else if (type === 'partner') {
        endpoint = isEdit ? `/admin/partners/${id}` : '/admin/partners';
        formData.append('name', partnerData.name);
        formData.append('email', partnerData.email);
        if (partnerData.phone_fix) formData.append('phone_fix', partnerData.phone_fix);
        if (partnerData.whatsapp) formData.append('whatsapp', partnerData.whatsapp);
        if (partnerData.sla_hours) formData.append('sla_hours', partnerData.sla_hours);
        if (partnerData.logo) formData.append('logo', partnerData.logo);
      }

      const response = await axiosClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(response.data.message || 'Opération réussie');

      fetchMasterData();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategoryStatus = async (id) => {
    //  await axiosClient.delete(`/admin/categories/${id}`);
    toast.error("Fonctionnalité de désactivation à relier à l'API");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-10 p-4">
      <Toaster position="top-center" />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Configuration & Master Data</h2>
        <p className="text-sm text-gray-600 mt-1">Gérez les données de référence et les règles d'affectation du système.</p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto border-b border-gray-300 mb-6 no-scrollbar">
        <button onClick={() => setActiveTab('mdm')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'mdm' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Données de Référence
        </button>
        <button onClick={() => setActiveTab('partners')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'partners' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Partenaires & Prestataires
        </button>
        <button onClick={() => setActiveTab('workflow')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'workflow' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}>
          Workflow d'Affectation
        </button>
      </div>

      {activeTab === 'mdm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Catégories */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-bold uppercase text-sm">Catégories d'Incidents</h3>
              <button onClick={() => openModal('category')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 font-bold uppercase transition-colors">
                + Ajouter
              </button>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-8 text-center text-gray-500 font-bold bg-gray-50 border-t border-dashed border-gray-300">
                      Aucune catégorie trouvée.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className={`p-3 font-bold flex items-center gap-2 ${cat.is_active !== false ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                        <span className="material-symbols-outlined text-[18px]">{cat.icon || 'folder'}</span>
                        {cat.name}
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => openModal('category', true, cat)} className="px-2 py-1 text-xs font-bold uppercase text-gray-500 hover:text-blue-600">
                          Éditer
                        </button>
                        <button onClick={() => toggleCategoryStatus(cat.id)} className={`ml-2 px-2 py-1 text-xs font-bold uppercase border bg-red-50 text-red-600 border-red-200 hover:bg-red-100`}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-bold uppercase text-sm">Secteurs (Moqata3at)</h3>
              <button onClick={() => openModal('sector')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 font-bold uppercase transition-colors">
                + Ajouter
              </button>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {sectors.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-8 text-center text-gray-500 font-bold bg-gray-50 border-t border-dashed border-gray-300">
                      Aucun secteur trouvé.
                    </td>
                  </tr>
                ) : (
                  sectors.map((sec) => (
                    <tr key={sec.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-800 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center overflow-hidden">{sec.logo ? <img src={`http://localhost:8000/storage/${sec.logo.file_path}`} alt={`${sec.name}.logo`} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 text-sm">image</span>}</div>
                        {sec.name}
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => openModal('sector', true, sec)} className="text-gray-500 hover:text-blue-600 font-bold text-xs uppercase px-2 py-1">
                          Éditer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
          <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center min-w-[600px]">
            <h3 className="font-bold uppercase text-sm">Répertoire des Prestataires</h3>
            <button onClick={() => openModal('partner')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 font-bold uppercase transition-colors">
              + Nouveau Partenaire
            </button>
          </div>
          <table className="w-full text-left border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 uppercase text-xs text-gray-600">
                <th className="p-3 border-r border-gray-200 w-12 text-center">Logo</th>
                <th className="p-3 border-r border-gray-200">Nom de la Société</th>
                <th className="p-3 border-r border-gray-200">Contact</th>
                <th className="p-3 border-r border-gray-200">SLA (Heures)</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 font-bold bg-gray-50 border-t border-dashed border-gray-300">
                    Aucun partenaire trouvé.
                  </td>
                </tr>
              ) : (
                partners.map((p) => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto flex items-center justify-center overflow-hidden text-gray-500">{p.logo ? <img src={`http://localhost:8000/storage/${p.logo.file_path}`} alt="logo" className="w-full h-full object-cover" /> : '🏢'}</div>
                    </td>
                    <td className="p-3 border-r border-gray-200 font-bold">{p.name}</td>
                    <td className="p-3 border-r border-gray-200">
                      <div className="text-xs">{p.email}</div>
                      <div className="text-xs text-gray-500">
                        Fixe: {p.phone_fix || '-'} | WA: {p.whatsapp || '-'}
                      </div>
                    </td>
                    <td className="p-3 border-r border-gray-200 text-center font-bold">{p.sla_hours ? `${p.sla_hours}h` : '-'}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => openModal('partner', true, p)} className="text-blue-600 font-bold text-xs uppercase hover:underline">
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'workflow' && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="bg-white border border-gray-300 shadow-sm p-4">
              <h3 className="font-bold uppercase text-sm mb-4 border-b border-gray-200 pb-2">Nouvelle Règle</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Si Catégorie :</label>
                  <select className="w-full border border-gray-300 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500">
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-center font-bold text-gray-400">ALORS ASSIGNER À</div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Partenaire :</label>
                  <select className="w-full border border-gray-300 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500">
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs py-2 mt-2 transition-colors">
                  Sauvegarder la Règle
                </button>
              </form>
            </div>
          </div>

          <div className="w-full md:w-2/3 bg-white border border-gray-300 shadow-sm overflow-x-auto">
            <div className="p-4 bg-gray-50 border-b border-gray-300 min-w-[500px]">
              <h3 className="font-bold uppercase text-sm">Règles d'affectation actives</h3>
            </div>
            <table className="w-full text-left border-collapse text-sm min-w-[500px]">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 uppercase text-xs text-gray-600">
                  <th className="p-3 border-r border-gray-200">Condition (Catégorie)</th>
                  <th className="p-3 border-r border-gray-200">Action (Partenaire)</th>
                  <th className="p-3 text-center">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500 font-bold bg-gray-50 border-t border-dashed border-gray-300">
                      Aucune règle trouvée.
                    </td>
                  </tr>
                ) : (
                  workflows.map((wf) => (
                    <tr key={wf.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-3 border-r border-gray-200 font-bold">{wf.category_name}</td>
                      <td className="p-3 border-r border-gray-200 text-blue-700 font-bold">{wf.partner_name}</td>
                      <td className="p-3 text-center">
                        <button className="text-red-500 hover:text-red-700">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-400 w-full max-w-md flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gray-800 p-4 border-b border-gray-900 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold uppercase text-sm">
                {modalConfig.isEdit ? 'Modifier' : 'Ajouter'} {modalConfig.type === 'category' ? 'une catégorie' : modalConfig.type === 'sector' ? 'un secteur' : 'un partenaire'}
              </h3>
              <button onClick={closeModal} className="hover:text-gray-300 font-bold px-2">
                X
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {modalConfig.type === 'category' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom de la catégorie *</label>
                    <input type="text" required value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description de la catégorie </label>
                    <input type="text" value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Icône (Nom Material Symbols)</label>
                    <input type="text" value={categoryData.icon} onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })} placeholder="Ex: lightbulb, water_drop..." className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                  </div>
                </>
              )}

              {modalConfig.type === 'sector' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City de sectuer *</label>
                    <input type="text" disabled value={sectorData.city} onChange={(e) => setSectorData({ ...sectorData, city: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom du Secteur *</label>
                    <input type="text" required value={sectorData.name} onChange={(e) => setSectorData({ ...sectorData, name: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description du secteur </label>
                    <input type="text" value={sectorData.description} onChange={(e) => setSectorData({ ...sectorData, description: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image de couverture (Logo)</label>
                    <input type="file" accept="image/*" onChange={(e) => setSectorData({ ...sectorData, logo: e.target.files[0] })} className="w-full border border-gray-300 p-1 text-sm bg-white" />
                  </div>
                </>
              )}

              {modalConfig.type === 'partner' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom de la Société *</label>
                    <input type="text" required value={partnerData.name} onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email *</label>
                    <input type="email" required value={partnerData.email} onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tél Fixe</label>
                      <input type="text" value={partnerData.phone_fix} onChange={(e) => setPartnerData({ ...partnerData, phone_fix: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">WhatsApp</label>
                      <input type="text" value={partnerData.whatsapp} onChange={(e) => setPartnerData({ ...partnerData, whatsapp: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SLA (Heures Max d'intervention)</label>
                    <input type="number" min="1" value={partnerData.sla_hours} onChange={(e) => setPartnerData({ ...partnerData, sla_hours: e.target.value })} className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none" placeholder="Ex: 24, 48..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Logo du partenaire</label>
                    <input type="file" accept="image/*" onChange={(e) => setPartnerData({ ...partnerData, logo: e.target.files[0] })} className="w-full border border-gray-300 p-1 text-sm bg-white" />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 uppercase text-sm">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 uppercase text-sm disabled:opacity-50">
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
