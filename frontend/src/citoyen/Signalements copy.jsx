import { useState, useEffect } from "react";
import axiosClient from "../config/axios-client";

// --- MOCK DATA (Mo2aqatan) ---
const mockCategories = [
  { id: 1, name: "Éclairage Public", icon: "lightbulb" },
  { id: 2, name: "Voirie & Routes", icon: "edit_road" },
  { id: 3, name: "Propreté & Déchets", icon: "delete" },
  { id: 4, name: "Espaces Verts", icon: "park" },
  { id: 5, name: "Eau & Assainissement", icon: "water_drop" },
];

const mockIncidents = [
  {
    id: 1,
    ref_num: "SAF-2026-001",
    title: "Poteau électrique dangereux",
    description: "Le poteau menace de tomber près de l'école.",
    status: "pending",
    address: "Quartier Plateau, Safi",
    created_at: "2026-03-10T10:30:00",
    category: { name: "Éclairage Public", icon: "lightbulb" },
    images: ["https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=400"],
  },
  {
    id: 2,
    ref_num: "SAF-2026-002",
    title: "Nid de poule géant",
    description: "Un trou énorme au milieu de la route cause des dégâts aux voitures.",
    status: "validated",
    address: "Avenue Hassan II",
    created_at: "2026-03-08T14:15:00",
    category: { name: "Voirie & Routes", icon: "edit_road" },
    images: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=400"],
  },
  {
    id: 3,
    ref_num: "SAF-2026-003",
    title: "Fuite d'eau potable",
    description: "L'eau coule depuis 3 jours sans arrêt.",
    status: "resolved",
    address: "Sidi Bouzid",
    created_at: "2026-02-25T09:00:00",
    resolved_at: "2026-02-28T16:00:00",
    category: { name: "Eau & Assainissement", icon: "water_drop" },
    images: ["https://images.unsplash.com/photo-1542360663-8f40200042ce?q=80&w=400"],
  }
];

export default function Signalements() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [loading, setLoading] = useState(false);

  // States: Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [descriptionType, setDescriptionType] = useState("text"); // 'text' wla 'audio'
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null); // { lat, lng }
  
  const [images, setImages] = useState([]); // Tableau dial tsawer (Max 4)

  // ==========================================
  // 1. API: GET /incidents
  // ==========================================
  useEffect(() => {
    // fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      // const res = await axiosClient.get('/incidents');
      // setIncidents(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================
  // 2. GESTION DES IMAGES (Max 4)
  // ==========================================
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 4) {
      alert("Vous ne pouvez télécharger que 4 images maximum.");
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // ==========================================
  // 3. GESTION LOCALISATION (GPS)
  // ==========================================
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setAddress("Position GPS détectée ✓");
        },
        (error) => {
          alert("Erreur de géolocalisation. Veuillez écrire l'adresse.");
        }
      );
    }
  };

  // ==========================================
  // 4. API: POST /incidents
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      /* ✅ KOD L-API L-7A9I9I (M3a Polymorphic Photos w Audio):
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category_id', categoryId);
      formData.append('description', description);
      if (location) {
        formData.append('latitude', location.lat);
        formData.append('longitude', location.lng);
      }
      formData.append('address', address);
      
      // Ajouter les images
      images.forEach((img, index) => {
        formData.append(`photos[${index}]`, img.file);
      });

      // Ila kayn audio, khass yt-convert a file (Hadi advanced chwia nkhliwaha hta twsel liha)
      // if(audioBlob) formData.append('audio', audioBlob, 'record.wav');

      const response = await axiosClient.post('/incidents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      */

      // Simulation
      const newIncident = {
        id: Date.now(),
        ref_num: `SAF-2026-00${incidents.length + 1}`,
        title: title,
        description: description,
        status: "pending",
        address: address || "Position Inconnue",
        created_at: new Date().toISOString(),
        category: mockCategories.find(c => c.id === Number(categoryId)),
        images: images.length > 0 ? [images[0].url] : []
      };

      setIncidents([newIncident, ...incidents]);
      resetForm();
      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategoryId(1);
    setDescription("");
    setImages([]);
    setAddress("");
    setLocation(null);
    setAudioUrl(null);
  };

  // ==========================================
  // HELPERS POUR L'AFFICHAGE (Status & Date)
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500', icon: 'schedule', text: 'En attente' };
      case 'validated': return { color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-500', icon: 'settings', text: 'En cours' };
      case 'resolved': return { color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500', icon: 'check_circle', text: 'Résolu' };
      case 'rejected': return { color: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-500', icon: 'cancel', text: 'Rejeté' };
      default: return { color: 'bg-gray-100 text-gray-700', icon: 'info', text: status };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 mt-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mes Signalements</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Aidez-nous à améliorer Safi en signalant les anomalies.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined">campaign</span>
            Nouveau Signalement
          </button>
        </div>

        {/* LISTE DES INCIDENTS (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {incidents.map((incident) => {
            const badge = getStatusBadge(incident.status);
            return (
              <div key={incident.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="flex h-full">
                  
                  {/* Image (ila kayna) */}
                  <div className="w-1/3 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
                    {incident.images && incident.images.length > 0 ? (
                      <img src={incident.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Incident" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                        <span className="material-symbols-outlined text-4xl">broken_image</span>
                      </div>
                    )}
                    {/* Icon Category */}
                    <div className="absolute top-2 left-2 w-8 h-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-primary-600 dark:text-primary-500">
                      <span className="material-symbols-outlined text-[18px]">{incident.category.icon}</span>
                    </div>
                  </div>

                  {/* Infos */}
                  <div className="w-2/3 p-4 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{incident.ref_num}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${badge.color}`}>
                        <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                        {badge.text}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-base leading-tight mb-1 line-clamp-2">
                      {incident.title}
                    </h3>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1 line-clamp-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {incident.address}
                    </p>

                    <div className="mt-auto flex justify-between items-center border-t border-gray-100 dark:border-gray-700 pt-3">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">Le {formatDate(incident.created_at)}</span>
                      <button className="text-primary-600 dark:text-primary-500 text-xs font-bold hover:underline flex items-center gap-1">
                        Détails <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL CRÉATION SIGNALEMENT */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">campaign</span>
                Signaler un problème
              </h2>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto no-scrollbar flex-1 space-y-6">
              
              {/* Titre & Catégorie */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Que se passe-t-il ? *</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                    placeholder="Ex: Fuite d'eau, nid de poule..." 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Catégorie *</label>
                  <select 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {mockCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photos (Max 4) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 flex justify-between">
                  <span>Photos pour appuyer votre demande</span>
                  <span className="text-gray-400 font-normal">{images.length}/4 max</span>
                </label>
                
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="aspect-square relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
                      <img src={img.url} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                  
                  {images.length < 4 && (
                    <div 
                      onClick={() => document.getElementById("incident-image-input").click()} 
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-400 hover:text-primary-500"
                    >
                      <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                    </div>
                  )}
                </div>
                <input type="file" id="incident-image-input" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </div>

              {/* Description (Texte aw Audio) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Détails (Texte ou Audio) *</label>
                  <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
                    <button 
                      type="button"
                      onClick={() => setDescriptionType("text")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${descriptionType === 'text' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                    >
                      Texte
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDescriptionType("audio")}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${descriptionType === 'audio' ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500'}`}
                    >
                      <span className="material-symbols-outlined text-[14px] text-red-500">mic</span> Audio
                    </button>
                  </div>
                </div>

                {descriptionType === "text" ? (
                  <textarea 
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                    placeholder="Détaillez le problème ici..."
                  ></textarea>
                ) : (
                  <div className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center gap-3">
                    {!audioUrl ? (
                      <>
                        <button 
                          type="button"
                          onClick={() => { setIsRecording(!isRecording); if(isRecording) setAudioUrl("mock_audio.mp3"); }}
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-primary-100 text-primary-500 hover:bg-primary-200'}`}
                        >
                          <span className="material-symbols-outlined text-3xl">{isRecording ? "stop" : "mic"}</span>
                        </button>
                        <p className="text-sm text-gray-500">{isRecording ? "Enregistrement en cours... (Cliquez pour arrêter)" : "Cliquez pour enregistrer une note vocale"}</p>
                      </>
                    ) : (
                      <div className="w-full flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button type="button" className="text-primary-500"><span className="material-symbols-outlined text-3xl">play_circle</span></button>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"><div className="w-1/3 h-full bg-primary-500 rounded-full"></div></div>
                        <span className="text-xs text-gray-500 font-bold">0:12</span>
                        <button type="button" onClick={() => setAudioUrl(null)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 p-1 rounded-md"><span className="material-symbols-outlined">delete</span></button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Où se trouve le problème ? *</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                    placeholder="Saisissez l'adresse ou le quartier..." 
                  />
                  <button 
                    type="button" 
                    onClick={getLocation}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-4 rounded-xl transition-colors flex items-center justify-center"
                    title="Détecter ma position GPS"
                  >
                    <span className="material-symbols-outlined">my_location</span>
                  </button>
                </div>
                {location && <p className="text-[10px] text-green-600 mt-1 ml-1 font-bold">Coordonnées GPS capturées ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})</p>}
              </div>

            </div>

            {/* Footer Form */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 shrink-0 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setIsModalOpen(false); resetForm(); }}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                disabled={!title || (!description && !audioUrl) || !address || isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Envoi..." : "Envoyer le signalement"}
                {!isSubmitting && <span className="material-symbols-outlined text-[20px]">send</span>}
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}