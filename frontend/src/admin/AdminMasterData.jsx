import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState('categories');

  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', isEdit: false, id: null });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategoryIdWorkflow, setSelectedCategoryIdWorkflow] = useState('');
  const [selectedPartnerIdWorkflow, setSelectedPartnerIdWorkflow] = useState('');

  const [categoryData, setCategoryData] = useState({ name: '', icon: '', description: '', partner_id: null });
  const [sectorData, setSectorData] = useState({ name: '', logo: null, city: 'Safi', description: '', boundaries: '' });
  const [partnerData, setPartnerData] = useState({ name: '', email: '', phone_fix: '', whatsapp: '', sla_hours: '', logo: null });

  useEffect(() => {
    fetchMasterData();
  }, []);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, sectorsRes, partnersRes] = await Promise.all([
        axiosClient.get('/admin/categories'), 
        axiosClient.get('/admin/sectors'), 
        axiosClient.get('/admin/partners')
      ]);

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
      setCategoryData(isEdit ? { name: data.name, icon: data.icon, description: data.description || '' } : { name: '', icon: '', description: '' });
    } else if (type === 'sector') {
      setSectorData(isEdit ? { name: data.name, logo: null, city: 'Safi', description: data.description || '', boundaries: data.boundaries || '' } : { name: '', logo: null, city: 'Safi' });
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

      toast.success(response.data.message || 'Opération réussie', { style: { background: '#333', color: '#fff' }});

      fetchMasterData();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde', { style: { background: '#333', color: '#fff' }});
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategoryStatus = async (id) => {
    // await axiosClient.delete(`/admin/categories/${id}`);
  };

  useEffect(() => {
    if (categories.length > 0 && partners.length > 0) {
      const catAvecPartners = categories.filter((cat) => cat.partner_id !== null).map((cat) => {
          const pat = partners.find((partner) => partner.id === cat.partner_id);

          return {
            id: cat.id,  
            category_id: cat.id,
            partner_id: cat.partner_id,
            category_name: cat.name,
            partner_name: pat?.name || 'Partenaire inconnu', 
          };
        });

      setWorkflows(catAvecPartners);
    }
  }, [categories, partners]);

  const handleAddRule = async () => {
    try {
      const response = await axiosClient.post('/admin/workflows', {
        category_id: selectedCategoryIdWorkflow,
        partner_id: selectedPartnerIdWorkflow,
      });
      toast.success(response.data.message || 'Opération réussie', { style: { background: '#333', color: '#fff' }});
      fetchMasterData();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde', { style: { background: '#333', color: '#fff' }});
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 pb-10 p-4">
      <div className="max-w-6xl mx-auto">
        <Toaster position="top-center" />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Configuration & Master Data</h2>
          <p className="text-sm text-gray-400 mt-1">Gérez les données de référence et les règles d'affectation du système.</p>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex overflow-x-auto border-b border-gray-700 mb-6 no-scrollbar">
          <button onClick={() => setActiveTab('categories')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'categories' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Catégories
          </button>
          <button onClick={() => setActiveTab('sectors')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'sectors' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Secteurs
          </button>
          <button onClick={() => setActiveTab('partners')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'partners' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Partenaires & Prestataires
          </button>
          <button onClick={() => setActiveTab('workflow')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'workflow' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Workflow d'Affectation
          </button>
        </div>

        {/* CONTENU CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold uppercase text-sm text-gray-200">Catégories d'Incidents</h3>
              <button onClick={() => openModal('category')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 font-bold uppercase rounded transition-colors">
                + Ajouter
              </button>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-8 text-center text-gray-500 font-bold bg-gray-800 border-t border-dashed border-gray-700">
                      Aucune catégorie trouvée.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <td className={`p-4 font-bold flex items-center gap-3 ${cat.is_active !== false ? 'text-gray-200' : 'text-gray-500 line-through'}`}>
                        <span className="material-symbols-outlined text-[20px] text-gray-400">{cat.icon || 'folder'}</span>
                        {cat.name}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => openModal('category', true, cat)} className="px-2 py-1 text-xs font-bold uppercase text-blue-400 hover:text-blue-300 transition-colors">
                          Éditer
                        </button>
                        <button onClick={() => toggleCategoryStatus(cat.id)} className={`ml-2 px-2 py-1 text-xs font-bold uppercase border bg-red-900/30 text-red-400 border-red-800/50 hover:bg-red-900/50 rounded transition-colors`}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENU SECTORS */}
        {activeTab === 'sectors' && (
          <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold uppercase text-sm text-gray-200">Secteurs (Moqata3at)</h3>
              <button onClick={() => openModal('sector')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 font-bold uppercase rounded transition-colors">
                + Ajouter
              </button>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {sectors.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="p-8 text-center text-gray-500 font-bold bg-gray-800 border-t border-dashed border-gray-700">
                      Aucun secteur trouvé.
                    </td>
                  </tr>
                ) : (
                  sectors.map((sec) => (
                    <tr key={sec.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 font-bold text-gray-200 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 border border-gray-600 rounded flex items-center justify-center overflow-hidden">
                          {sec.logo ? <img src={`http://localhost:8000/storage/${sec.logo.file_path}`} alt={`${sec.name}.logo`} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-500 text-sm">image</span>}
                        </div>
                        {sec.name}
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => openModal('sector', true, sec)} className="px-2 py-1 text-xs font-bold uppercase text-blue-400 hover:text-blue-300 transition-colors">
                          Éditer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CONTENU PARTNERS */}
        {activeTab === 'partners' && (
          <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-x-auto">
            <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center min-w-[600px]">
              <h3 className="font-bold uppercase text-sm text-gray-200">Répertoire des Prestataires</h3>
              <button onClick={() => openModal('partner')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 font-bold uppercase rounded transition-colors">
                + Nouveau Partenaire
              </button>
            </div>
            <table className="w-full text-left border-collapse text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-700 uppercase text-xs text-gray-400">
                  <th className="p-4 border-r border-gray-700 w-16 text-center">Logo</th>
                  <th className="p-4 border-r border-gray-700">Nom de la Société</th>
                  <th className="p-4 border-r border-gray-700">Contact</th>
                  <th className="p-4 border-r border-gray-700 text-center">SLA (Heures)</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-bold bg-gray-800 border-t border-dashed border-gray-700">
                      Aucun partenaire trouvé.
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 border-r border-gray-700 text-center">
                        <div className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-full mx-auto flex items-center justify-center overflow-hidden text-gray-400">
                          {p.logo ? <img src={`http://localhost:8000/storage/${p.logo.file_path}`} alt="logo" className="w-full h-full object-cover" /> : '🏢'}
                        </div>
                      </td>
                      <td className="p-4 border-r border-gray-700 font-bold text-gray-200">{p.name}</td>
                      <td className="p-4 border-r border-gray-700">
                        <div className="text-xs text-gray-300 mb-1">{p.email}</div>
                        <div className="text-xs text-gray-500">
                          Fixe: <span className="text-gray-400">{p.phone_fix || '-'}</span> | WA: <span className="text-gray-400">{p.whatsapp || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-gray-700 text-center font-bold text-blue-400">{p.sla_hours ? `${p.sla_hours}h` : '-'}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => openModal('partner', true, p)} className="text-blue-400 font-bold text-xs uppercase hover:text-blue-300 transition-colors">
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

        {/* CONTENU WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg p-5">
                <h3 className="font-bold uppercase text-sm mb-4 border-b border-gray-700 pb-3 text-gray-200">Nouvelle Règle</h3>
                <form className="space-y-5" onSubmit={handleFormSubmit}>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Si Catégorie :</label>
                    <select value={selectedCategoryIdWorkflow} onChange={(e) => setSelectedCategoryIdWorkflow(e.target.value)} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white outline-none focus:border-blue-500">
                      <option value="" disabled>Choisir une catégorie...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-center font-bold text-gray-600 text-xs tracking-widest">ALORS ASSIGNER À</div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Partenaire :</label>
                    <select value={selectedPartnerIdWorkflow} onChange={(e) => setSelectedPartnerIdWorkflow(e.target.value)} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white outline-none focus:border-blue-500">
                      <option value="" disabled>Choisir un partenaire...</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <button type="button" onClick={handleAddRule} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase text-xs py-3 rounded transition-colors mt-2">
                    Sauvegarder la Règle
                  </button>
                </form>
              </div>
            </div>

            <div className="w-full md:w-2/3 bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-x-auto">
              <div className="p-4 bg-gray-800/50 border-b border-gray-700 min-w-[500px]">
                <h3 className="font-bold uppercase text-sm text-gray-200">Règles d'affectation actives</h3>
              </div>
              <table className="w-full text-left border-collapse text-sm min-w-[500px]">
                <thead>
                  <tr className="bg-gray-900 border-b border-gray-700 uppercase text-xs text-gray-400">
                    <th className="p-4 border-r border-gray-700">Condition (Catégorie)</th>
                    <th className="p-4 border-r border-gray-700">Action (Partenaire)</th>
                    <th className="p-4 text-center">Supprimer</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-500 font-bold bg-gray-800 border-t border-dashed border-gray-700">
                        Aucune règle trouvée.
                      </td>
                    </tr>
                  ) : (
                    workflows.map((wf) => (
                      <tr key={wf.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors">
                        <td className="p-4 border-r border-gray-700 font-bold text-gray-200">{wf.category_name}</td>
                        <td className="p-4 border-r border-gray-700 text-blue-400 font-bold">{wf.partner_name}</td>
                        <td className="p-4 text-center">
                          <button className="text-red-400 hover:text-red-300 transition-colors p-1">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
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

        {/* --- MODALS (AJOUT / MODIFICATION) --- */}
        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-md flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center text-white sticky top-0 z-10 rounded-t-lg">
                <h3 className="font-bold uppercase text-sm tracking-wide">
                  {modalConfig.isEdit ? 'Modifier' : 'Ajouter'} {modalConfig.type === 'category' ? 'une catégorie' : modalConfig.type === 'sector' ? 'un secteur' : 'un partenaire'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-white font-bold p-1 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                {modalConfig.type === 'category' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de la catégorie *</label>
                      <input type="text" required value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description de la catégorie</label>
                      <textarea rows="3" value={categoryData.description} onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Icône (Nom Material Symbols)</label>
                      <input type="text" value={categoryData.icon} onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })} placeholder="Ex: lightbulb, water_drop..." className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                  </>
                )}

                {modalConfig.type === 'sector' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ville du secteur *</label>
                      <input type="text" disabled value={sectorData.city} onChange={(e) => setSectorData({ ...sectorData, city: e.target.value })} className="w-full border border-gray-700 rounded p-2.5 text-sm bg-gray-900/50 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom du Secteur *</label>
                      <input type="text" required value={sectorData.name} onChange={(e) => setSectorData({ ...sectorData, name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description du secteur</label>
                      <textarea rows="3" type="text" value={sectorData.description} onChange={(e) => setSectorData({ ...sectorData, description: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Image de couverture (Logo)</label>
                      <input type="file" accept="image/*" onChange={(e) => setSectorData({ ...sectorData, logo: e.target.files[0] })} className="w-full border border-gray-600 rounded p-1.5 text-sm bg-gray-900 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
                    </div>
                  </>
                )}

                {modalConfig.type === 'partner' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de la Société *</label>
                      <input type="text" required value={partnerData.name} onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email *</label>
                      <input type="email" required value={partnerData.email} onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tél Fixe</label>
                        <input type="text" value={partnerData.phone_fix} onChange={(e) => setPartnerData({ ...partnerData, phone_fix: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">WhatsApp</label>
                        <input type="text" value={partnerData.whatsapp} onChange={(e) => setPartnerData({ ...partnerData, whatsapp: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">SLA (Heures Max)</label>
                      <input type="number" min="1" value={partnerData.sla_hours} onChange={(e) => setPartnerData({ ...partnerData, sla_hours: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-blue-500" placeholder="Ex: 24, 48..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Logo du partenaire</label>
                      <input type="file" accept="image/*" onChange={(e) => setPartnerData({ ...partnerData, logo: e.target.files[0] })} className="w-full border border-gray-600 rounded p-1.5 text-sm bg-gray-900 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-5 mt-2 border-t border-gray-700">
                  <button type="button" onClick={closeModal} className="flex-1 border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded uppercase text-xs transition-colors">
                    Annuler
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded uppercase text-xs disabled:opacity-50 transition-colors">
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}