import { useState } from "react";

// --- MOCK DATA (Audit Logs) ---
const mockLogs = [
  { id: 1001, timestamp: "2026-03-14 09:12:45", user: "Hassan Alami (Manager)", action: "Qualification Ticket SAF-001 (En cours)", ip: "192.168.1.45" },
  { id: 1002, timestamp: "2026-03-14 09:30:11", user: "Admin", action: "Création compte Staff (Kamal Radi)", ip: "10.0.0.5" },
  { id: 1003, timestamp: "2026-03-14 10:05:00", user: "Kamal Radi (Journaliste)", action: "Publication Article (Festival Céramique)", ip: "192.168.1.88" },
  { id: 1004, timestamp: "2026-03-14 11:22:10", user: "Nadia Fathi (Manager)", action: "Application Strike (Youssef Karam)", ip: "192.168.1.50" },
  { id: 1005, timestamp: "2026-03-14 11:22:11", user: "SYSTÈME", action: "Bannissement automatique (Youssef Karam - 3 Strikes)", ip: "localhost" },
];

export default function AdminSystem() {
  const [logs] = useState(mockLogs);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // US.67 : Disaster Recovery (Backup SQL)
  const handleBackup = () => {
    setIsBackingUp(true);
    
    // Simulation API: axiosClient.get('/admin/backup', { responseType: 'blob' })
    setTimeout(() => {
      setIsBackingUp(false);
      alert("✅ Sauvegarde générée avec succès ! Le fichier 'safipulse_backup_20260314.zip' a été téléchargé.");
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
          Système, Audit & Sécurité
        </h2>
        <p className="text-sm text-gray-600 mt-1">Traçabilité des actions et gestion des sauvegardes d'urgence.</p>
      </div>

      {/* SECTION 1 : DISASTER RECOVERY (US.67) */}
      <div className="bg-white border border-gray-300 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">database</span>
            Sauvegarde et Restauration (Dump SQL)
          </h3>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            Générez une archive complète et sécurisée (.zip contenant le .sql) de la base de données. Le lien généré expirera après 15 minutes par mesure de sécurité.
          </p>
        </div>
        <button 
          onClick={handleBackup}
          disabled={isBackingUp}
          className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 uppercase text-sm transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
        >
          {isBackingUp ? (
            <><span className="material-symbols-outlined animate-spin">sync</span> Génération...</>
          ) : (
            <><span className="material-symbols-outlined">download</span> Télécharger Backup</>
          )}
        </button>
      </div>

      {/* SECTION 2 : AUDIT LOG (US.66) */}
      <div className="bg-white border border-gray-300 shadow-sm flex-1">
        <div className="p-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 uppercase flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-gray-500">history</span>
            Journal d'Audit (Actions Staff)
          </h3>
          <div className="flex gap-2">
            <input 
              type="date" 
              className="border border-gray-300 px-2 py-1 text-xs outline-none focus:border-blue-500"
            />
            <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs font-bold uppercase border border-gray-300">
              Filtrer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-xs text-gray-600 uppercase tracking-wider">
                <th className="p-3 border-r border-gray-200">ID</th>
                <th className="p-3 border-r border-gray-200">Date & Heure</th>
                <th className="p-3 border-r border-gray-200">Utilisateur / Acteur</th>
                <th className="p-3 border-r border-gray-200">Action effectuée</th>
                <th className="p-3">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              {logs.map(log => (
                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 border-r border-gray-200 text-gray-500">#{log.id}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-700">{log.timestamp}</td>
                  <td className="p-3 border-r border-gray-200 font-bold text-blue-800">{log.user}</td>
                  <td className="p-3 border-r border-gray-200 text-gray-800">{log.action}</td>
                  <td className="p-3 text-gray-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}