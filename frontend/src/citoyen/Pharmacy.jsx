import React, { useState } from 'react';

// 1. L-MOCK DATA (Kifach Laravel ghadi y-sifet lik l-JSON)
const mockSchedules = [
  {
    id: 1,
    start_date: '2026-04-01',
    end_date: '2026-04-07',
    shift_type: 'night', // night, day_holiday, 24h
    pharmacy: {
      name: 'Pharmacie Principale',
      address: 'Avenue Mohammed V, Centre Ville, Safi',
      phone: '0524461234',
      google_maps_link: '#',
      sector: { name: 'Centre Ville' }
    }
  },
  {
    id: 2,
    start_date: '2026-04-01',
    end_date: '2026-04-07',
    shift_type: '24h',
    pharmacy: {
      name: 'Pharmacie Al Amal',
      address: 'Route de Dar Si Aissa, Safi',
      phone: '0524469876',
      google_maps_link: '#',
      sector: { name: 'Sidi Abdelkrim' }
    }
  },
  {
    id: 3,
    start_date: '2026-04-05',
    end_date: '2026-04-05',
    shift_type: 'day_holiday',
    pharmacy: {
      name: 'Pharmacie Ibn Sina',
      address: 'Quartier Anas, Safi',
      phone: '0524465544',
      google_maps_link: '#',
      sector: { name: 'Quartier Anas' }
    }
  }
];

export default function Pharmacy() {
  const [activeTab, setActiveTab] = useState('night'); // 'night' awla '24h' awla 'day_holiday'

  // Kan-filtew l-Mock Data 3la 7sab l-Tab
  const filteredPharmacies = mockSchedules.filter(schedule => schedule.shift_type === activeTab);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      
      {/* --- HEADER --- */}
      <div className="mb-8 text-center mt-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 mb-4">
          <span className="material-symbols-outlined text-4xl">local_pharmacy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pharmacies de Garde
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Trouvez rapidement la pharmacie de garde la plus proche de chez vous à Safi.
        </p>
      </div>

      {/* --- LES TABS (Filtres) --- */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm inline-flex border border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => setActiveTab('night')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'night' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <span className="material-symbols-outlined text-[18px]">bedtime</span> Garde de Nuit
          </button>
          <button 
            onClick={() => setActiveTab('24h')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === '24h' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <span className="material-symbols-outlined text-[18px]">autorenew</span> 24h/24
          </button>
          <button 
            onClick={() => setActiveTab('day_holiday')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'day_holiday' ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <span className="material-symbols-outlined text-[18px]">wb_sunny</span> Jour Férié / Dimanche
          </button>
        </div>
      </div>

      {/* --- LA LISTE DES PHARMACIES --- */}
      {filteredPharmacies.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
          <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600 mb-2">event_busy</span>
          <h3 className="text-gray-500 dark:text-gray-400 font-medium">Aucune pharmacie pour ce type de garde aujourd'hui.</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPharmacies.map((schedule) => (
            <div key={schedule.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
              
               <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>

              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {schedule.pharmacy.name}
                    {schedule.shift_type === '24h' && <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">24/24</span>}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    {schedule.pharmacy.sector.name}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                {schedule.pharmacy.address}
              </p>

               <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700/50">
                <a 
                  href={`tel:${schedule.pharmacy.phone}`}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Appeler
                </a>
                <a 
                  href={schedule.pharmacy.google_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  Itinéraire
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}