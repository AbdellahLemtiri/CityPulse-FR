import { useState, useEffect } from "react";
import axiosClient from "../config/axios-client";

// --- MOCK DATA (Mo2aqatan) ---
const initialEvents = [
  {
    id: 1,
    title: "Grand Nettoyage Plage",
    category: "BÉNÉVOLAT",
    description: "Rejoignez-nous pour nettoyer la plage de Lalla Fatna.",
    start_date: "2026-10-15T09:00",
    end_date: "2026-10-15T13:00",
    location: "Plage Lalla Fatna", // F l-backend tqder t-jma3 lat w lng
    participants_count: 42,
    max_participants: 60,
    xp_reward: 50,
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=800",
    is_approved: true,
    is_participating: false,
  },
  {
    id: 2,
    title: "Atelier Poterie Enfants",
    category: "CULTURE",
    description: "Initiation à la poterie traditionnelle de Safi pour les enfants.",
    start_date: "2026-10-22T14:00",
    end_date: "2026-10-22T16:00",
    location: "Maison des Jeunes",
    participants_count: 18,
    max_participants: 20,
    xp_reward: 20,
    image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800",
    is_approved: true,
    is_participating: true, // Deja mcharek fiha
  }
];

export default function Agenda() {
  // ==========================================
  // STATES
  // ==========================================
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);

  // States: Création d'Événement
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "BÉNÉVOLAT",
    description: "",
    start_date: "",
    end_date: "",
    location: "" // Note: F Laravel derti location_lat w location_lng, hna gha nsiftoha ki string aw n-zido l'map mn be3d
  });

  // States: Participation
  const [eventToParticipate, setEventToParticipate] = useState(null);
  const [isParticipating, setIsParticipating] = useState(false);

  // ==========================================
  // 1. API: GET /events
  // ==========================================
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    // setLoading(true);
    try {
      // ✅ KOD L-API L-7A9I9I:
      // const response = await axiosClient.get("/events");
      // setEvents(response.data.data);
    } catch (error) {
      console.error("Erreur récupération events", error);
    } finally {
      // setLoading(false);
    }
  };

  // ==========================================
  // 2. API: POST /events (Création)
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // ✅ KOD L-API L-7A9I9I:
      // await axiosClient.post('/events', formData);
      
      // Simulation pour l'UI
      const newEvent = {
        id: Date.now(),
        ...formData,
        participants_count: 0,
        max_participants: 50,
        xp_reward: 10,
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800",
        is_approved: false, // En attente de validation
        is_participating: false,
      };
      setEvents([newEvent, ...events]);

      alert("Votre activité a été soumise avec succès ! Elle est en attente de validation par un Manager.");
      
      // Reset form w sdd l-modal
      setFormData({ title: "", category: "BÉNÉVOLAT", description: "", start_date: "", end_date: "", location: "" });
      setIsModalOpen(false);

    } catch (error) {
      console.error("Erreur création event", error);
      alert("Une erreur s'est produite.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // 3. API: POST /events/{id}/participate
  // ==========================================
  const handleParticipate = async () => {
    if (!eventToParticipate) return;
    setIsParticipating(true);

    try {
      // ✅ KOD L-API L-7A9I9I (Pivot table):
      // await axiosClient.post(`/events/${eventToParticipate.id}/participate`);

      // Optimistic Update (Mettre à jour l'UI)
      setEvents(events.map(ev => {
        if (ev.id === eventToParticipate.id) {
          const isCurrentlyParticipating = ev.is_participating;
          return {
            ...ev,
            is_participating: !isCurrentlyParticipating,
            participants_count: isCurrentlyParticipating ? ev.participants_count - 1 : ev.participants_count + 1
          };
        }
        return ev;
      }));

      setEventToParticipate(null); // Sdd l-modal

    } catch (error) {
      console.error("Erreur participation", error);
      alert("Erreur lors de la participation.");
    } finally {
      setIsParticipating(false);
    }
  };


  // --- Helper: Formatage de date ---
  const formatDateDisplay = (dateString) => {
    if (!dateString) return { month: "", day: "", time: "" };
    const date = new Date(dateString);
    const month = date.toLocaleString('fr-FR', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return { month, day, time };
  };

  return (
    <>
      <div className="max-w-3xl mx-auto p-4 md:p-0 pb-24 md:pb-8">
        
        {/* HEADER AGENDA */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agenda Solidaire</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold py-2 px-4 rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">add</span> Proposer
          </button>
        </div>

        {/* LISTE DES ÉVÉNEMENTS */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {events.filter(event => event.is_approved).map((event) => {
              const { month, day, time: startTime } = formatDateDisplay(event.start_date);
              const { time: endTime } = formatDateDisplay(event.end_date);
              const progress = (event.participants_count / event.max_participants) * 100;

              return (
                <div key={event.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
                  <div className="relative h-48">
                    <img src={event.image} className="w-full h-full object-cover opacity-90" alt={event.title} />
                    
                    {/* Date Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1 text-center shadow-md">
                      <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{month}</span>
                      <span className="block text-2xl font-black text-gray-900 dark:text-white leading-none">{day}</span>
                    </div>
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 right-3 bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-400 text-xs font-bold px-2 py-1 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
                      {event.category || "ACTIVITÉ"}
                    </span>
                    
                    {/* XP Badge */}
                    <span className="absolute bottom-3 right-3 bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">stars</span> +{event.xp_reward} XP
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined text-primary-500 dark:text-primary-400">schedule</span> 
                        {startTime} - {endTime}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="material-symbols-outlined text-primary-500 dark:text-primary-400">location_on</span> 
                        {event.location}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Participants</span>
                        <span className="text-green-600 dark:text-green-400">{event.participants_count} / {event.max_participants}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setEventToParticipate(event)}
                      className={`w-full py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 ${
                        event.is_participating 
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" 
                        : "bg-primary-600 text-white hover:bg-primary-500"
                      }`}
                    >
                      {event.is_participating ? (
                        <><span className="material-symbols-outlined">check_circle</span> Inscrit (Annuler)</>
                      ) : (
                        "Je participe"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* MODAL 1 : CRÉATION D'ACTIVITÉ */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Proposer une activité</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Titre de l'événement</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                  placeholder="Ex: Distribution de couffins..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="BÉNÉVOLAT">Bénévolat</option>
                    <option value="CULTURE">Culture</option>
                    <option value="SPORT">Sport</option>
                    <option value="ÉCOLOGIE">Écologie</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Lieu</label>
                  <input 
                    type="text" 
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none" 
                    placeholder="Ex: Hay Salam" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date de début</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Date de fin</label>
                  <input 
                    type="datetime-local" 
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea 
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white outline-none resize-none"
                  placeholder="Expliquez brièvement l'activité..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-500 transition-colors disabled:opacity-50">
                  {isSubmitting ? "Envoi..." : "Soumettre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2 : CONFIRMATION PARTICIPATION */}
      {/* ========================================== */}
      {eventToParticipate && (
        <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
          <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden zoom-in text-center p-6">
            
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-500/20 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">
                {eventToParticipate.is_participating ? "event_busy" : "how_to_reg"}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {eventToParticipate.is_participating ? "Annuler l'inscription ?" : "Confirmer la participation ?"}
            </h3>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {eventToParticipate.is_participating 
                ? `Êtes-vous sûr de vouloir vous désinscrire de "${eventToParticipate.title}" ?`
                : `Vous êtes sur le point de vous inscrire à "${eventToParticipate.title}". Vous gagnerez ${eventToParticipate.xp_reward} XP à la fin de l'événement.`}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setEventToParticipate(null)} 
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-bold py-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Retour
              </button>
              <button 
                onClick={handleParticipate} 
                disabled={isParticipating}
                className={`flex-1 font-bold py-2.5 rounded-xl transition-colors text-white ${
                  eventToParticipate.is_participating 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-primary-600 hover:bg-primary-500"
                }`}
              >
                {isParticipating ? "..." : (eventToParticipate.is_participating ? "Se désinscrire" : "Confirmer")}
              </button>
            </div>

          </div>
        </div>
      )}

    </>
  );
}