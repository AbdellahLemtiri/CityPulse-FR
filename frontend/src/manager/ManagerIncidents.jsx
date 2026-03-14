import { useState, useEffect } from "react";
// import axiosClient from "../config/axios-client";

// --- MOCK DATA (Gha n-biynou ghir les incidents dial Secteur 12 - US.50 Scope Isolation) ---
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
    category_name: "Éclairage Public",
    image: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=400",
    citizen_name: "Abdellah L.",
    citizen_phone: "0600112233"
  },
  {
    id: 2,
    ref_num: "SAF-2026-002",
    title: "Nid de poule géant",
    description: "Un trou énorme au milieu de la route cause des dégâts aux voitures.",
    status: "in_progress", // Equivaut à "validated" wla "transmis"
    latitude: 32.3011,
    longitude: -9.2310,
    address: "Avenue Hassan II",
    created_at: "2026-03-08T14:15:00",
    category_name: "Voirie & Routes",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400",
    citizen_name: "Karim M.",
    citizen_phone: "0699887766"
  }
];

export default function ManagerIncidents() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  // States pour la clôture (US.52 Validation)
  const [closurePhoto, setClosurePhoto] = useState(null);

  // --- API GET (M-commentée) ---
  useEffect(() => {
    // const fetchIncidents = async () => {
    //   const res = await axiosClient.get('/manager/incidents'); // Back-end y-filtri b sector_id
    //   setIncidents(res.data);
    // };
    // fetchIncidents();
  }, []);

  // --- ACTIONS DU MANAGER ---

  // US.51 : Qualification (Changer le statut)
  const handleQualify = (id) => {
    // Appel API: axiosClient.post(`/manager/incidents/${id}/qualify`)
    setIncidents(incidents.map(inc => 
      inc.id === id ? { ...inc, status: "in_progress" } : inc
    ));
    setSelectedIncident({ ...selectedIncident, status: "in_progress" });
    alert("Ticket qualifié 'En cours'. Le citoyen a reçu une notification push.");
  };

  // US.52 : Dispatching WhatsApp
  const handleWhatsAppDispatch = (incident) => {
    // Génération du message avec coordonnées GPS
    const text = `🚨 *Ordre d'intervention - SafiPulse*\n`
      + `*Réf:* ${incident.ref_num}\n`
      + `*Catégorie:* ${incident.category_name}\n`
      + `*Problème:* ${incident.title}\n`
      + `*Adresse:* ${incident.address}\n`
      + `*GPS:* https://maps.google.com/?q=${incident.latitude},${incident.longitude}\n`
      + `*Urgent: Merci de prendre en charge ce ticket.*`;
      
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // US.53 : Générer PDF (Bon d'Intervention)
  const handleGeneratePDF = (refNum) => {
    // F l-bessa7 ghadi t-dir appel l-API (DomPDF) w y-rj3 lik fichier
    // axiosClient.get(`/manager/incidents/${id}/pdf`, { responseType: 'blob' })
    alert(`Génération du PDF pour le ticket ${refNum} (Simulation DOMPDF)`);
    window.print(); // Simulation rapide f front-end
  };

  // US.52 (Bis) : Clôture avec Photo
  const handleClosure = (e) => {
    e.preventDefault();
    if (!closurePhoto) {
      alert("Veuillez attacher une photo de fin de travaux pour clôturer le ticket.");
      return;
    }

    // Appel API: axiosClient.post(`/manager/incidents/${selectedIncident.id}/resolve`, formData)
    
    setIncidents(incidents.map(inc => 
      inc.id === selectedIncident.id ? { ...inc, status: "resolved" } : inc
    ));
    
    alert("Ticket clôturé avec succès ! Photo enregistrée comme preuve.");
    setSelectedIncident(null);
    setClosurePhoto(null);
  };

  // --- HELPERS UI ---
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-bold border border-yellow-300">En attente</span>;
      case 'in_progress': return <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs font-bold border border-blue-300">En cours / Transmis</span>;
      case 'resolved': return <span className="px-2 py-1 bg-green-200 text-green-800 text-xs font-bold border border-green-300">Clôturé</span>;
      default: return <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-bold border border-gray-300">{status}</span>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
          Tickets du Secteur (Plateau)
        </h2>
        <div className="text-sm bg-white border border-gray-300 px-3 py-1 text-gray-600">
          Total : {incidents.length} signalements
        </div>
      </div>

      {/* TABLEAU ADMINISTRATIF (Simple, clair, sans hover scale) */}
      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase">
              <th className="p-3 border-r border-gray-200">Réf</th>
              <th className="p-3 border-r border-gray-200">Date</th>
              <th className="p-3 border-r border-gray-200">Catégorie</th>
              <th className="p-3 border-r border-gray-200">Titre</th>
              <th className="p-3 border-r border-gray-200">Statut</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(incident => (
              <tr key={incident.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm text-gray-800">
                <td className="p-3 border-r border-gray-200 font-bold">{incident.ref_num}</td>
                <td className="p-3 border-r border-gray-200">{new Date(incident.created_at).toLocaleDateString()}</td>
                <td className="p-3 border-r border-gray-200">{incident.category_name}</td>
                <td className="p-3 border-r border-gray-200">{incident.title}</td>
                <td className="p-3 border-r border-gray-200">{getStatusBadge(incident.status)}</td>
                <td className="p-3">
                  <button 
                    onClick={() => setSelectedIncident(incident)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs font-bold uppercase transition-none"
                  >
                    Gérer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE GESTION DU TICKET */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-400 w-full max-w-4xl flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="bg-gray-200 p-4 border-b border-gray-400 flex justify-between items-center">
              <h3 className="font-bold text-gray-800 uppercase">
                Traitement du Ticket : {selectedIncident.ref_num}
              </h3>
              <button 
                onClick={() => {setSelectedIncident(null); setClosurePhoto(null);}} 
                className="text-gray-600 hover:text-red-600 font-bold px-2"
              >
                X FERMER
              </button>
            </div>

            {/* Body Modal (2 Colonnes) */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
              
              {/* Colonne Gauche : Détails du citoyen */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="border border-gray-300 p-3 bg-gray-50">
                  <p className="text-xs text-gray-500 uppercase font-bold border-b border-gray-300 pb-1 mb-2">Informations</p>
                  <p className="text-sm mb-1"><strong>Titre :</strong> {selectedIncident.title}</p>
                  <p className="text-sm mb-1"><strong>Lieu :</strong> {selectedIncident.address}</p>
                  <p className="text-sm mb-1"><strong>Citoyen :</strong> {selectedIncident.citizen_name} ({selectedIncident.citizen_phone})</p>
                  <p className="text-sm mt-2 bg-white p-2 border border-gray-200">{selectedIncident.description}</p>
                </div>
                
                <div className="border border-gray-300 bg-gray-50 p-2">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">Photo Attachée</p>
                  <img src={selectedIncident.image} alt="Preuve" className="w-full h-48 object-cover border border-gray-400" />
                </div>
              </div>

              {/* Colonne Droite : Centre d'opérations */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                
                {/* ETAPE 1 : Qualification */}
                <div className="border border-gray-300 p-4">
                  <h4 className="text-sm font-bold uppercase mb-2">1. Qualification</h4>
                  {selectedIncident.status === 'pending' ? (
                    <button 
                      onClick={() => handleQualify(selectedIncident.id)}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 text-sm uppercase"
                    >
                      Prendre en charge (Notifier Citoyen)
                    </button>
                  ) : (
                    <p className="text-sm text-green-700 font-bold">✓ Ticket pris en charge.</p>
                  )}
                </div>

                {/* ETAPE 2 : Dispatching */}
                <div className={`border border-gray-300 p-4 ${selectedIncident.status === 'pending' ? 'opacity-50 pointer-events-none' : ''}`}>
                  <h4 className="text-sm font-bold uppercase mb-2">2. Dispatching & Mission</h4>
                  <div className="flex gap-2 mb-2">
                    <button 
                      onClick={() => handleWhatsAppDispatch(selectedIncident)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 text-sm uppercase"
                    >
                      Envoyer via WhatsApp
                    </button>
                  </div>
                  <button 
                    onClick={() => handleGeneratePDF(selectedIncident.ref_num)}
                    className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 text-sm uppercase"
                  >
                    Imprimer Bon d'Intervention (PDF)
                  </button>
                </div>

                {/* ETAPE 3 : Clôture */}
                <div className={`border border-gray-300 p-4 ${selectedIncident.status === 'pending' ? 'opacity-50 pointer-events-none' : 'bg-gray-50'}`}>
                  <h4 className="text-sm font-bold uppercase mb-2">3. Validation & Clôture</h4>
                  <form onSubmit={handleClosure} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-xs text-gray-700 font-bold mb-1">Preuve d'intervention (Obligatoire) :</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setClosurePhoto(e.target.files[0])}
                        className="block w-full text-sm text-gray-500 border border-gray-300 p-1 bg-white"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={selectedIncident.status === 'resolved'}
                      className={`w-full font-bold py-2 text-sm uppercase ${
                        selectedIncident.status === 'resolved' 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {selectedIncident.status === 'resolved' ? 'Déjà clôturé' : 'Clôturer le Ticket'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}