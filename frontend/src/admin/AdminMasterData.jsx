import { useState } from "react";

export default function AdminMasterData() {
  const [activeTab, setActiveTab] = useState("mdm"); // "mdm", "partners", "workflow"

  // --- MOCK DATA ---
  const [categories, setCategories] = useState([
    { id: 1, name: "Voirie & Routes", is_active: true },
    { id: 2, name: "Éclairage Public", is_active: true },
    { id: 3, name: "Espaces Verts", is_active: false }
  ]);
  const [sectors, setSectors] = useState([
    { id: 1, name: "Plateau" }, { id: 2, name: "Ville Nouvelle" }
  ]);
  const [partners, setPartners] = useState([
    { id: 1, name: "RADEES (Eau & Élec)", email: "contact@radees.ma", phone: "0524112233" },
    { id: 2, name: "Safi Propreté", email: "urgence@safiprop.ma", phone: "0524998877" }
  ]);
  const [workflows, setWorkflows] = useState([
    { id: 1, category_id: 1, partner_id: 2, category_name: "Voirie & Routes", partner_name: "Safi Propreté" }
  ]);

  // --- STATES DES MODALS ---
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: "", isEdit: false, id: null });
  const [catSecName, setCatSecName] = useState(""); // Pour Catégorie et Secteur
  const [partnerData, setPartnerData] = useState({ name: "", email: "", phone: "", logo: null });

  // --- FONCTIONS D'OUVERTURE DES MODALS ---
  const openModal = (type, isEdit = false, data = null) => {
    setModalConfig({ isOpen: true, type, isEdit, id: data ? data.id : null });
    
    if (type === "category" || type === "sector") {
      setCatSecName(isEdit ? data.name : "");
    } else if (type === "partner") {
      setPartnerData(isEdit ? { name: data.name, email: data.email, phone: data.phone, logo: null } : { name: "", email: "", phone: "", logo: null });
    }
  };

  const closeModal = () => setModalConfig({ isOpen: false, type: "", isEdit: false, id: null });

  // --- SOUMISSION DES FORMULAIRES ---
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { type, isEdit, id } = modalConfig;

    // Simulation API (axiosClient.post awla put)
    setTimeout(() => {
      if (type === "category") {
        if (isEdit) setCategories(categories.map(c => c.id === id ? { ...c, name: catSecName } : c));
        else setCategories([...categories, { id: Date.now(), name: catSecName, is_active: true }]);
      } 
      else if (type === "sector") {
        if (isEdit) setSectors(sectors.map(s => s.id === id ? { ...s, name: catSecName } : s));
        else setSectors([...sectors, { id: Date.now(), name: catSecName }]);
      } 
      else if (type === "partner") {
        if (isEdit) setPartners(partners.map(p => p.id === id ? { ...p, ...partnerData } : p));
        else setPartners([...partners, { id: Date.now(), ...partnerData }]);
      }
      
      closeModal();
    }, 400);
  };

  // US.62 : Activer/Désactiver (Soft Delete)
  const toggleCategoryStatus = (id) => {
    setCategories(categories.map(cat => cat.id === id ? { ...cat, is_active: !cat.is_active } : cat));
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
          Configuration & Master Data
        </h2>
        <p className="text-sm text-gray-600 mt-1">Gérez les données de référence et les règles d'affectation du système.</p>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex border-b border-gray-300 mb-6">
        <button onClick={() => setActiveTab("mdm")} className={`px-6 py-3 text-sm font-bold uppercase ${activeTab === "mdm" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Données de Référence (MDM)</button>
        <button onClick={() => setActiveTab("partners")} className={`px-6 py-3 text-sm font-bold uppercase ${activeTab === "partners" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Partenaires & Prestataires</button>
        <button onClick={() => setActiveTab("workflow")} className={`px-6 py-3 text-sm font-bold uppercase ${activeTab === "workflow" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Workflow d'Affectation</button>
      </div>

      {/* TAB 1 : Secteurs et Catégories */}
      {activeTab === "mdm" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Catégories */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-bold uppercase text-sm">Catégories d'Incidents</h3>
              <button onClick={() => openModal("category")} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 font-bold uppercase transition-colors">+ Ajouter</button>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} className="border-b border-gray-200">
                    <td className={`p-3 font-bold ${cat.is_active ? 'text-gray-800' : 'text-gray-400 line-through'}`}>{cat.name}</td>
                    <td className="p-3 text-right flex justify-end gap-2">
                      <button onClick={() => openModal("category", true, cat)} className="px-2 py-1 text-xs font-bold uppercase text-gray-500 hover:text-blue-600">Éditer</button>
                      <button onClick={() => toggleCategoryStatus(cat.id)} className={`px-2 py-1 text-xs font-bold uppercase border ${cat.is_active ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'}`}>
                        {cat.is_active ? "Désactiver" : "Activer"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Secteurs */}
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-bold uppercase text-sm">Secteurs (Quartiers)</h3>
              <button onClick={() => openModal("sector")} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 font-bold uppercase transition-colors">+ Ajouter</button>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {sectors.map(sec => (
                  <tr key={sec.id} className="border-b border-gray-200">
                    <td className="p-3 font-bold text-gray-800">{sec.name}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => openModal("sector", true, sec)} className="text-gray-500 hover:text-blue-600 font-bold text-xs uppercase px-2 py-1">Éditer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2 : Partenaires */}
      {activeTab === "partners" && (
        <div className="bg-white border border-gray-300 shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
            <h3 className="font-bold uppercase text-sm">Répertoire des Prestataires</h3>
            <button onClick={() => openModal("partner")} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 font-bold uppercase transition-colors">+ Nouveau Partenaire</button>
          </div>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 uppercase text-xs text-gray-600">
                <th className="p-3 border-r border-gray-200 w-16 text-center">Logo</th>
                <th className="p-3 border-r border-gray-200">Nom de la Société</th>
                <th className="p-3 border-r border-gray-200">Email de Contact</th>
                <th className="p-3 border-r border-gray-200">Tél. Urgence</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map(p => (
                <tr key={p.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 border-r border-gray-200 text-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500">🏢</div>
                  </td>
                  <td className="p-3 border-r border-gray-200 font-bold">{p.name}</td>
                  <td className="p-3 border-r border-gray-200">{p.email}</td>
                  <td className="p-3 border-r border-gray-200 font-mono">{p.phone}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => openModal("partner", true, p)} className="text-blue-600 font-bold text-xs uppercase hover:underline">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3 : Workflow Automatique */}
      {activeTab === "workflow" && (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="bg-white border border-gray-300 shadow-sm p-4">
              <h3 className="font-bold uppercase text-sm mb-4 border-b border-gray-200 pb-2">Nouvelle Règle</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Si Catégorie :</label>
                  <select className="w-full border border-gray-300 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500">
                    {categories.filter(c => c.is_active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="text-center font-bold text-gray-400">ALORS ASSIGNER À</div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Partenaire :</label>
                  <select className="w-full border border-gray-300 p-2 text-sm bg-gray-50 outline-none focus:border-blue-500">
                    {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs py-2 mt-2 transition-colors">
                  Sauvegarder la Règle
                </button>
              </form>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 bg-white border border-gray-300 shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-300">
              <h3 className="font-bold uppercase text-sm">Règles d'affectation actives</h3>
            </div>
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 uppercase text-xs text-gray-600">
                  <th className="p-3 border-r border-gray-200">Condition (Catégorie)</th>
                  <th className="p-3 border-r border-gray-200">Action (Partenaire)</th>
                  <th className="p-3 text-center">Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map(wf => (
                  <tr key={wf.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 border-r border-gray-200 font-bold">{wf.category_name}</td>
                    <td className="p-3 border-r border-gray-200 text-blue-700 font-bold">{wf.partner_name}</td>
                    <td className="p-3 text-center">
                      <button className="text-red-500 hover:text-red-700">
                        <span className="material-symbols-rounded text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* ========================================================= */}
      {/* MODAL GLOBAL (Catégories, Secteurs, Partenaires) */}
      {/* ========================================================= */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-gray-400 w-full max-w-md flex flex-col shadow-2xl">
            
            {/* Header Modal */}
            <div className="bg-gray-800 p-4 border-b border-gray-900 flex justify-between items-center text-white">
              <h3 className="font-bold uppercase text-sm">
                {modalConfig.isEdit ? "Modifier" : "Ajouter"} {modalConfig.type === "category" ? "une catégorie" : modalConfig.type === "sector" ? "un secteur" : "un partenaire"}
              </h3>
              <button onClick={closeModal} className="hover:text-gray-300 font-bold px-2">X</button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* INPUTS POUR CATÉGORIE OU SECTEUR */}
              {(modalConfig.type === "category" || modalConfig.type === "sector") && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Nom du {modalConfig.type === "category" ? "catégorie" : "secteur"} *
                  </label>
                  <input 
                    type="text" required
                    value={catSecName}
                    onChange={(e) => setCatSecName(e.target.value)}
                    className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                    placeholder="Saisissez le nom..."
                  />
                </div>
              )}

              {/* INPUTS POUR PARTENAIRE */}
              {modalConfig.type === "partner" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom de la Société *</label>
                    <input 
                      type="text" required
                      value={partnerData.name}
                      onChange={(e) => setPartnerData({...partnerData, name: e.target.value})}
                      className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                      placeholder="Ex: RADEES"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email de contact *</label>
                    <input 
                      type="email" required
                      value={partnerData.email}
                      onChange={(e) => setPartnerData({...partnerData, email: e.target.value})}
                      className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                      placeholder="contact@societe.ma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Téléphone d'urgence *</label>
                    <input 
                      type="text" required
                      value={partnerData.phone}
                      onChange={(e) => setPartnerData({...partnerData, phone: e.target.value})}
                      className="w-full border border-gray-300 p-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                      placeholder="0524..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Logo du partenaire</label>
                    <input 
                      type="file" accept="image/*"
                      onChange={(e) => setPartnerData({...partnerData, logo: e.target.files[0]})}
                      className="w-full border border-gray-300 p-1 text-sm bg-white"
                    />
                  </div>
                </>
              )}

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 mt-2 border-t border-gray-200">
                <button 
                  type="button" onClick={closeModal}
                  className="flex-1 border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 uppercase text-sm"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 uppercase text-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}