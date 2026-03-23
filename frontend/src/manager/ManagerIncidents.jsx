import { useState } from "react";
import axiosClient from "../config/axios-client";

const mockCategories = [
  { id: 1, name: 'Éclairage Public' },
  { id: 2, name: 'Voirie & Routes' },
  { id: 3, name: 'Propreté & Déchets' },
  { id: 4, name: 'Espaces Verts' },
  { id: 5, name: 'Eau & Assainissement' },
];

const mockIncidents = [
  {
    id: 1,
    ref_num: "SAF-2026-001",
    title: "Poteau électrique dangereux",
    description: "Le poteau menace de tomber près de l'école primaire.",
    status: "pending",
    latitude: 32.2994,
    longitude: -9.2372,
    address: "Quartier Plateau, Rue 14",
    created_at: "2026-03-10T10:30:00",
    category_id: null,
    category_name: null,
    images: [
      "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=600",
      "https://images.unsplash.com/photo-1508614999368-9260051292e5?q=80&w=600",
    ],
    citizen_name: "Abdellah L.",
    citizen_phone: "0600112233"
  },
  {
    id: 2,
    ref_num: "SAF-2026-002",
    title: "Nid de poule géant",
    description: "Un trou énorme au milieu de la route cause des dégâts aux voitures.",
    status: "in_progress",
    latitude: 32.3011,
    longitude: -9.2310,
    address: "Avenue Hassan II",
    created_at: "2026-03-08T14:15:00",
    category_id: 2,
    category_name: "Voirie & Routes",
    images: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600"
    ],
    citizen_name: "Karim M.",
    citizen_phone: "0699887766"
  }
];

export default function ManagerIncidents() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [currentView, setCurrentView] = useState('list');
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // States pour la gestion d'un incident
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [closurePhoto, setClosurePhoto] = useState(null);
  
  // STATE JDID: Bach n-t7ekmou f l-galerie d-tsawer
  const [activeImageIndex, setActiveImageIndex] = useState(0);
 

  const handleOpenDetail = (incident) => {
    setSelectedIncident(incident);
    setSelectedCategoryId(incident.category_id || ''); 
    setActiveImageIndex(0); // Dima n-bdaw b-tswira l-lwla mnin n-7ellou l-incident
    setCurrentView('detail');
  };

  const handleCloseDetail = () => {
    setSelectedIncident(null);
    setSelectedCategoryId('');
    setClosurePhoto(null);
    setActiveImageIndex(0);
    setCurrentView('list');
  };

  const handleQualify = () => {
    if (!selectedCategoryId) {
      alert("Veuillez sélectionner une catégorie avant de prendre en charge le ticket.");
      return;
    }

    const categorySelected = mockCategories.find(c => c.id === parseInt(selectedCategoryId));

    const updatedIncident = { 
      ...selectedIncident, 
      status: "in_progress", 
      category_id: categorySelected.id,
      category_name: categorySelected.name 
    };

    setIncidents(incidents.map(inc => inc.id === selectedIncident.id ? updatedIncident : inc));
    setSelectedIncident(updatedIncident);
    alert("Ticket qualifié 'En cours' avec succès. Le partenaire a été notifié.");
  };

  const handleWhatsAppDispatch = (incident) => {
    if (!incident.category_name) {
      alert("Ce ticket doit être qualifié avant d'être dispatché.");
      return;
    }
    const text = `🚨 *Ordre d'intervention - SafiPulse*\n`
      + `*Réf:* ${incident.ref_num}\n`
      + `*Catégorie:* ${incident.category_name}\n`
      + `*Problème:* ${incident.title}\n`
      + `*Adresse:* ${incident.address}\n`
      + `*GPS:* http://maps.google.com/maps?q=${incident.latitude},${incident.longitude}\n`
      + `*Urgent: Merci de prendre en charge ce ticket.*`;
      
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleGeneratePDF = (refNum) => {
    alert(`Génération du PDF pour le ticket ${refNum} (Simulation)`);
    window.print();
  };

  const handleClosure = (e) => {
    e.preventDefault();
    if (!closurePhoto) {
      alert("Veuillez attacher une photo de fin de travaux pour clôturer le ticket.");
      return;
    }

    const updatedIncident = { ...selectedIncident, status: "resolved" };
    setIncidents(incidents.map(inc => inc.id === selectedIncident.id ? updatedIncident : inc));
    
    alert("Ticket clôturé avec succès !");
    setSelectedIncident(updatedIncident);
    setClosurePhoto(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-md">En attente</span>;
      case 'in_progress': return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-md">En cours / Transmis</span>;
      case 'resolved': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-md">Clôturé</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-md">{status}</span>;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      
      {/* ======================================================= */}
      {/* VUE 1 : LA LISTE DES INCIDENTS                          */}
      {/* ======================================================= */}
      {currentView === 'list' && (
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Tableau de Bord : Plateau
            </h2>
            <div className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg font-medium text-gray-600 shadow-sm">
              Total : {incidents.length} signalements
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="p-4 font-semibold">Réf</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Catégorie</th>
                    <th className="p-4 font-semibold">Titre</th>
                    <th className="p-4 font-semibold">Statut</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incidents.map(incident => (
                    <tr key={incident.id} className="hover:bg-blue-50/50 transition-colors text-sm text-gray-700">
                      <td className="p-4 font-bold text-gray-900">{incident.ref_num}</td>
                      <td className="p-4">{new Date(incident.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        {incident.category_name ? (
                          <span className="text-gray-700">{incident.category_name}</span>
                        ) : (
                          <span className="text-gray-400 italic">Non qualifié</span>
                        )}
                      </td>
                      <td className="p-4 font-medium text-gray-800 truncate max-w-[200px]">{incident.title}</td>
                      <td className="p-4">{getStatusBadge(incident.status)}</td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleOpenDetail(incident)}
                          className="bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 px-4 py-1.5 rounded-md text-xs font-bold transition-all shadow-sm"
                        >
                          Gérer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* VUE 2 : LES DÉTAILS DE L'INCIDENT (Plein Écran)         */}
      {/* ======================================================= */}
      {currentView === 'detail' && selectedIncident && (
        <div className="max-w-5xl mx-auto  overflow-hidden animate-fade-in-up">
          
          {/* Header Détails */}
          <div className="bg-gray-50 p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <button 
                onClick={handleCloseDetail} 
                className="text-gray-500 border p-2 hover:text-gray-800 font-medium text-sm flex items-center gap-2 mb-2 transition-colors"
              >
                <span>←</span> Retour à la liste
              </button>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                Ticket : {selectedIncident.ref_num}
                {getStatusBadge(selectedIncident.status)}
              </h3>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500 font-medium">Déclaré le</p>
              <p className="text-sm font-bold text-gray-800">{new Date(selectedIncident.created_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Body Détails */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Colonne Gauche : Infos Citoyen & Photos */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">Informations du signalement</h4>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-3">
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Titre</span>
                    <span className="block text-sm font-bold text-gray-900">{selectedIncident.title}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Lieu exact</span>
                    <span className="block text-sm text-gray-800">{selectedIncident.address}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 font-medium">Déclarant</span>
                    <span className="block text-sm text-gray-800">{selectedIncident.citizen_name} <span className="text-gray-500">({selectedIncident.citizen_phone})</span></span>
                  </div>
                  <div className="pt-2">
                    <span className="block text-xs text-gray-500 font-medium mb-1">Description</span>
                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed">{selectedIncident.description}</p>
                  </div>
                </div>
              </div>

              {/* L-GALERIE D-TSAWER HNA */}
              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>Preuves Photographiques</span>
                  <span className="text-xs font-normal bg-gray-200 px-2 py-1 rounded-md">{selectedIncident.images?.length || 0} Photo(s)</span>
                </h4>
                
                {selectedIncident.images && selectedIncident.images.length > 0 ? (
                  <div className="space-y-2">
                    {/* Tswira l-Kbira (Active) */}
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative group">
                      <img 
                        src={selectedIncident.images[activeImageIndex]} 
                        alt="Preuve principale" 
                        className="w-full h-64 object-contain bg-black/5" 
                      />
                    </div>
                    
                    {/* Les Miniatures (Thumbnails) ila kano kter mn 1 */}
                    {selectedIncident.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {selectedIncident.images.map((img, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setActiveImageIndex(idx)}
                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                              activeImageIndex === idx 
                                ? 'border-blue-600 ring-2 ring-blue-600/20 opacity-100' 
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img} alt={`Miniature ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 h-32 flex items-center justify-center text-gray-400">
                    <p className="text-sm">Aucune photo attachée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Colonne Droite : Centre d'opérations du Manager */}
            <div className="space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
              <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Centre d'opérations</h4>
              
              {/* ETAPE 1 : Qualification (Choix de la catégorie) */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                  Qualification du Ticket
                </h5>
                
                {selectedIncident.status === 'pending' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Catégoriser l'incident (Obligatoire)</label>
                      <select 
                        value={selectedCategoryId} 
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      >
                        <option value="">-- Choisir le partenaire concerné --</option>
                        {mockCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={handleQualify}
                      disabled={!selectedCategoryId}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                      Valider et Notifier le Partenaire
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 text-green-800 p-3 rounded-lg border border-green-100 flex flex-col gap-1">
                    <span className="text-sm font-bold">✓ Ticket qualifié</span>
                    <span className="text-xs">Catégorie : {selectedIncident.category_name}</span>
                  </div>
                )}
              </div>

              {/* ETAPE 2 : Dispatching */}
              <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden transition-opacity ${selectedIncident.status === 'pending' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Dispatching Terrain
                </h5>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleWhatsAppDispatch(selectedIncident)}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Envoyer l'ordre via WhatsApp
                  </button>
                  <button 
                    onClick={() => handleGeneratePDF(selectedIncident.ref_num)}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Générer Bon d'Intervention (PDF)
                  </button>
                </div>
              </div>

              {/* ETAPE 3 : Clôture */}
              <div className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden transition-opacity ${selectedIncident.status === 'pending' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                  Clôture du Dossier
                </h5>
                <form onSubmit={handleClosure} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Preuve de résolution (Photo requise)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setClosurePhoto(e.target.files[0])}
                      disabled={selectedIncident.status === 'resolved'}
                      className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2 bg-gray-50 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={selectedIncident.status === 'resolved'}
                    className={`w-full font-bold py-2.5 rounded-lg text-sm transition-colors ${
                      selectedIncident.status === 'resolved' 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-200' 
                      : 'bg-gray-800 hover:bg-black text-white'
                    }`}
                  >
                    {selectedIncident.status === 'resolved' ? 'Dossier Clôturé ✓' : 'Valider et Clôturer'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}