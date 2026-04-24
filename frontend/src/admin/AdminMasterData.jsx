import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState('sectors');

  const [categories, setCategories] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: '', isEdit: false, id: null });

  const [categoryData, setCategoryData] = useState({ name: '', icon: '', description: '' });
  const [sectorData, setSectorData] = useState({ name: '', logo: null, description: '' });
  const [partnerData, setPartnerData] = useState({ name: '', email: '', phone_fix: '', whatsapp: '', sla_hours: '', logo: null });

  const [selectedCategoryIdWorkflow, setSelectedCategoryIdWorkflow] = useState('');
  const [selectedPartnerIdWorkflow, setSelectedPartnerIdWorkflow] = useState('');

  useEffect(() => {
    fetchMasterData();
  }, []);

  const categoriesDisponibles = categories.filter((cat) => !workflows.some((wf) => wf.category_id === cat.id));
  const fetchMasterData = async () => {
    setLoading(true);
    try {
      const [categoriesRes, sectorsRes, partnersRes, workflowsRes] = await Promise.all([axiosClient.get('/admin/categories'), axiosClient.get('sectors/city'), axiosClient.get('/admin/partners'), axiosClient.get('/admin/workflows')]);

      setCategories(categoriesRes.data);
      setSectors(sectorsRes.data);
      setPartners(partnersRes.data);
      setWorkflows(workflowsRes.data);
    } catch (error) {
      console.error('Erreur Backend:', error);
      toast.error('Impossible de charger les données du serveur.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Gestion des Modals
  const openModal = (type, isEdit = false, data = null) => {
    setModalConfig({ isOpen: true, type, isEdit, id: data ? data.id : null });

    if (type === 'sector') {
      setSectorData(isEdit ? { ...data, logo: null } : { name: '', logo: null, description: '' });
    } else if (type === 'partner') {
      setPartnerData(isEdit ? { ...data, logo: null } : { name: '', email: '', phone_fix: '', whatsapp: '', sla_hours: '', logo: null });
    }
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: '', isEdit: false, id: null });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    let endpoint = '';

    if (modalConfig.isEdit) {
      formData.append('_method', 'PUT');
    }

    switch (modalConfig.type) {
      case 'sector':
        endpoint = modalConfig.isEdit ? `/admin/sectors/${modalConfig.id}` : '/admin/sectors';
        formData.append('name', sectorData.name);
        if (sectorData.logo) formData.append('logo', sectorData.logo);
        break;
      case 'partner':
        endpoint = modalConfig.isEdit ? `/admin/partners/${modalConfig.id}` : '/admin/partners';
        formData.append('name', partnerData.name);
        formData.append('email', partnerData.email);
        if (partnerData.phone_fix) formData.append('phone_fix', partnerData.phone_fix);
        if (partnerData.whatsapp) formData.append('whatsapp', partnerData.whatsapp);
        if (partnerData.sla_hours) formData.append('sla_hours', partnerData.sla_hours);
        if (partnerData.logo) formData.append('logo', partnerData.logo);
        break;
      default:
        return;
    }

    try {
      const response = await axiosClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.message || 'Enregistré avec succès', { style: { background: '#333', color: '#fff' } });
      fetchMasterData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde', { style: { background: '#333', color: '#fff' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddRule = async () => {
    if (!selectedCategoryIdWorkflow || !selectedPartnerIdWorkflow) {
      toast.error('Veuillez sélectionner une catégorie et un partenaire.', { style: { background: '#333', color: '#fff' } });
      return;
    }

    try {
      const response = await axiosClient.post('/admin/workflows', {
        category_id: selectedCategoryIdWorkflow,
        partner_id: selectedPartnerIdWorkflow,
      });
      toast.success(response.data.message || 'Règle ajoutée', { style: { background: '#333', color: '#fff' } });

      setSelectedCategoryIdWorkflow('');
      setSelectedPartnerIdWorkflow('');
      fetchMasterData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cette règle existe peut-être déjà.', { style: { background: '#333', color: '#fff' } });
    }
  };

  const handleDeleteRule = async (categoryId, partnerId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette règle d'affectation ?")) {
      try {
        await axiosClient.delete(`/admin/workflows/${categoryId}/${partnerId}`);
        toast.success('Règle supprimée', { style: { background: '#333', color: '#fff' } });
        fetchMasterData();
      } catch (error) {
        toast.error('Erreur lors de la suppression.', { style: { background: '#333', color: '#fff' } });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 pb-10 p-4">
      <div className="max-w-6xl mx-auto">
        <Toaster position="top-center" />

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Configuration & Master Data</h2>
          <p className="text-sm text-gray-400 mt-1">Gérez les données de référence et les règles d'affectation du système.</p>
        </div>
        <div className="flex overflow-x-auto border-b border-gray-700 mb-6 no-scrollbar">
          <button onClick={() => setActiveTab('sectors')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'sectors' ? 'border-b-2 border-primary-500 text-primary-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Secteurs
          </button>
          <button onClick={() => setActiveTab('partners')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'partners' ? 'border-b-2 border-primary-500 text-primary-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Prestataires
          </button>
          <button onClick={() => setActiveTab('workflow')} className={`px-6 py-3 text-sm font-bold uppercase whitespace-nowrap ${activeTab === 'workflow' ? 'border-b-2 border-primary-500 text-primary-400' : 'text-gray-500 hover:text-gray-300'}`}>
            Workflow d'Affectation
          </button>
        </div>

        {}

        {loading ? (
          <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          activeTab === 'sectors' && (
            <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-hidden animate-fade-in">
              <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center">
                <h3 className="font-bold uppercase text-sm text-gray-200">Secteurs (Arrondissements)</h3>
                <button onClick={() => openModal('sector')} className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 font-bold uppercase rounded ">
                  + Ajouter
                </button>
              </div>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4 font-bold text-gray-200">Nom</th>
                    <th className="p-4 font-bold text-gray-200">Statut</th>
                    <th className="p-4 font-bold text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sectors.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-8 text-center text-gray-500 font-bold bg-gray-800">
                        Aucun secteur trouvé.
                      </td>
                    </tr>
                  ) : (
                    sectors.map((sec) => (
                      <tr key={sec.id} className="border-b border-gray-700 hover:bg-gray-700/50 ">
                        <td className="p-4 font-bold text-gray-200 flex items-center gap-3">{sec.name}</td>
                        <td className="p-4 text-right">{sec.status === true ? <span className="px-3 py-1 text-xs font-bold uppercase text-primary-400 hover:text-primary-600">Actif</span> : <span className="px-3 py-1 text-xs font-bold uppercase text-red-400 hover:text-red-600">Inactif</span>}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => openModal('sector', true, sec)} className="px-3 py-1 text-xs font-bold uppercase text-primary-400 hover:text-primary-600">
                            Éditer
                          </button>
                        </td>
                        <button onClick={() => openModal('sector', true, sec)} className="px-3 py-1 text-xs font-bold uppercase text-primary-400 hover:text-primary-600 ">
                          chnage status
                        </button>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )
        )}

        {activeTab === 'partners' && (
          <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg overflow-x-auto animate-fade-in">
            <div className="p-4 bg-gray-800/50 border-b border-gray-700 flex justify-between items-center min-w-[600px]">
              <h3 className="font-bold uppercase text-sm text-gray-200">Répertoire des Prestataires</h3>
              <button onClick={() => openModal('partner')} className="text-xs bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 font-bold uppercase rounded ">
                + Nouveau Partenaire
              </button>
            </div>
            <table className="w-full text-left border-collapse text-sm min-w-[600px]">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-700 uppercase text-xs text-gray-400">
                  <th className="p-4 border-r border-gray-700 w-16 text-center">Logo</th>
                  <th className="p-4 border-r border-gray-700">Société</th>
                  <th className="p-4 border-r border-gray-700">Contact</th>
                  <th className="p-4 border-r border-gray-700 text-center">SLA</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500 font-bold bg-gray-800">
                      Aucun partenaire trouvé.
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50 ">
                      <td className="p-4 border-r border-gray-700 text-center">
                        <div className="w-10 h-10 bg-gray-700 border border-gray-600 rounded-full mx-auto flex items-center justify-center overflow-hidden text-gray-400">{p.logo ? <img src={`http://localhost:8000/storage/${p.logo.file_path}`} alt="logo" className="w-full h-full object-cover" /> : '🏢'}</div>
                      </td>
                      <td className="p-4 border-r border-gray-700 font-bold text-gray-200">{p.name}</td>
                      <td className="p-4 border-r border-gray-700">
                        <div className="text-xs text-gray-300 mb-1">{p.email}</div>
                        <div className="text-xs text-gray-500">
                          Fixe: <span className="text-gray-400">{p.phone_fix || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4 border-r border-gray-700 text-center font-bold text-primary-400">{p.sla_hours ? `${p.sla_hours}h` : '-'}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => openModal('partner', true, p)} className="text-primary-400 font-bold text-xs uppercase hover:text-primary-300">
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
          <div className="flex flex-col md:flex-row gap-6 animate-fade-in">
            <div className="w-full md:w-1/3">
              <div className="bg-gray-800 border border-gray-700 shadow-sm rounded-lg p-5 sticky top-5">
                <h3 className="font-bold uppercase text-sm mb-4 border-b border-gray-700 pb-3 text-gray-200">Nouvelle Règle</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Si Catégorie :</label>
                    <select value={selectedCategoryIdWorkflow} onChange={(e) => setSelectedCategoryIdWorkflow(e.target.value)} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white outline-none focus:border-primary-500">
                      <option value="" disabled>
                        Choisir une catégorie...
                      </option>

                      {categoriesDisponibles.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    {categoriesDisponibles.length === 0 && <p className="text-[10px] text-yellow-500 mt-2 font-bold italic">Toutes les catégories ont déjà un partenaire assigné.</p>}
                  </div>

                  <div className="text-center font-bold text-gray-600 text-xs tracking-widest flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span> ALORS <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Transférer le ticket à :</label>
                    <select value={selectedPartnerIdWorkflow} onChange={(e) => setSelectedPartnerIdWorkflow(e.target.value)} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white outline-none focus:border-primary-500">
                      <option value="" disabled>
                        -- Partenaire --
                      </option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button type="button" onClick={handleAddRule} className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold uppercase text-xs py-3 rounded  mt-2">
                    Sauvegarder la Règle
                  </button>
                </div>
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
                    <th className="p-4 text-center w-24">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-gray-500 font-bold bg-gray-800">
                        Aucune règle trouvée.
                      </td>
                    </tr>
                  ) : (
                    workflows.map((wf) => (
                      <tr key={wf.pivot_id || wf.category_id} className="border-b border-gray-700 hover:bg-gray-700/50 ">
                        <td className="p-4 border-r border-gray-700 font-bold text-gray-200">{wf.category_name}</td>
                        <td className="p-4 border-r border-gray-700 text-primary-400 font-bold">{wf.partner_name}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleDeleteRule(wf.category_id, wf.partner_id)} className="text-red-400 hover:text-red-300  p-1" title="Supprimer la règle">
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

        {modalConfig.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-md flex flex-col shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center text-white sticky top-0 z-10 rounded-t-lg">
                <h3 className="font-bold uppercase text-sm tracking-wide">
                  {modalConfig.isEdit ? 'Modifier' : 'Ajouter'} {modalConfig.type === 'category' ? 'une catégorie' : modalConfig.type === 'sector' ? 'un secteur' : 'un partenaire'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-white font-bold p-1 ">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
                {modalConfig.type === 'category' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de la catégorie *</label>
                      <input type="text" required value={categoryData.name} onChange={(e) => setCategoryData({ ...categoryData, name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Icône (Nom Material Symbols)</label>
                      <input type="text" value={categoryData.icon} onChange={(e) => setCategoryData({ ...categoryData, icon: e.target.value })} placeholder="Ex: lightbulb, water_drop..." className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                      <textarea rows="3" value={categoryData.description} onChange={(e) => setCategoryData({ ...categoryData, description: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                  </>
                )}

                {modalConfig.type === 'sector' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom du Secteur *</label>
                      <input type="text" required value={sectorData.name} onChange={(e) => setSectorData({ ...sectorData, name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
                      <textarea rows="3" value={sectorData.description} onChange={(e) => setSectorData({ ...sectorData, description: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                  </>
                )}

                {modalConfig.type === 'partner' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nom de la Société *</label>
                      <input type="text" required value={partnerData.name} onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email *</label>
                      <input type="email" required value={partnerData.email} onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tél Fixe</label>
                        <input type="text" value={partnerData.phone_fix} onChange={(e) => setPartnerData({ ...partnerData, phone_fix: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">WhatsApp</label>
                        <input type="text" value={partnerData.whatsapp} onChange={(e) => setPartnerData({ ...partnerData, whatsapp: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">SLA (Heures Max)</label>
                      <input type="number" min="1" value={partnerData.sla_hours} onChange={(e) => setPartnerData({ ...partnerData, sla_hours: e.target.value })} className="w-full border border-gray-600 rounded p-2.5 text-sm bg-gray-900 text-white focus:outline-none focus:border-primary-500" placeholder="Ex: 24, 48..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Logo du partenaire</label>
                      <input type="file" accept="image/*" onChange={(e) => setPartnerData({ ...partnerData, logo: e.target.files[0] })} className="w-full border border-gray-600 rounded p-1.5 text-sm bg-gray-900 text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer" />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-5 mt-2 border-t border-gray-700">
                  <button type="button" onClick={closeModal} className="flex-1 border border-gray-600 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2.5 rounded uppercase text-xs ">
                    Annuler
                  </button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-2.5 rounded uppercase text-xs disabled:opacity-50 ">
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
