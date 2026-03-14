import { useState, useEffect } from "react";

const mockPendingEvents = [
  {
    id: 1,
    title: "Distribution de couffins Ramadan",
    category: "BÉNÉVOLAT",
    location: "Mosquée Al Fath, Plateau",
    start_date: "2026-03-20T10:00",
    organizer: "Association Al Khayr",
    status: "pending"
  },
  {
    id: 2,
    title: "Tournoi de Foot Inter-Quartiers",
    category: "SPORT",
    location: "Terrain de Proximité, Secteur 12",
    start_date: "2026-03-25T15:00",
    organizer: "Yassine B. (Citoyen)",
    status: "pending"
  }
];

export default function ManagerEvents() {
  const [events, setEvents] = useState(mockPendingEvents);

  // US.54 (Bis) : Validation ou Refus
  const handleAction = (id, action) => {
    // API: axiosClient.post(`/manager/events/${id}/${action}`)
    const actionText = action === 'approve' ? 'approuvé' : 'refusé';
    
    if (window.confirm(`Êtes-vous sûr de vouloir ${action === 'approve' ? 'ACCEPTER' : 'REFUSER'} cet événement ?`)) {
      setEvents(events.filter(ev => ev.id !== id));
      alert(`L'événement a été ${actionText} avec succès.`);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
          Validation des Événements (En attente)
        </h2>
        <p className="text-sm text-gray-600 mt-1">Examinez les propositions citoyennes et associatives de votre secteur.</p>
      </div>

      <div className="bg-white border border-gray-300 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-700 uppercase">
              <th className="p-3 border-r border-gray-200">Titre</th>
              <th className="p-3 border-r border-gray-200">Catégorie</th>
              <th className="p-3 border-r border-gray-200">Date Prévue</th>
              <th className="p-3 border-r border-gray-200">Lieu</th>
              <th className="p-3 border-r border-gray-200">Organisateur</th>
              <th className="p-3">Actions (Validation)</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500 font-bold">Aucun événement en attente de validation.</td>
              </tr>
            ) : (
              events.map(ev => (
                <tr key={ev.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm text-gray-800">
                  <td className="p-3 border-r border-gray-200 font-bold">{ev.title}</td>
                  <td className="p-3 border-r border-gray-200">{ev.category}</td>
                  <td className="p-3 border-r border-gray-200">{new Date(ev.start_date).toLocaleString()}</td>
                  <td className="p-3 border-r border-gray-200">{ev.location}</td>
                  <td className="p-3 border-r border-gray-200">{ev.organizer}</td>
                  <td className="p-3 flex gap-2">
                    <button 
                      onClick={() => handleAction(ev.id, 'approve')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs font-bold uppercase"
                    >
                      Accepter
                    </button>
                    <button 
                      onClick={() => handleAction(ev.id, 'reject')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-bold uppercase"
                    >
                      Refuser
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}