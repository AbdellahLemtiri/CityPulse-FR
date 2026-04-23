import { Outlet, NavLink } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

export default function ManagerLayout() {
  
  // 💡 L-Galeb dial NavLink f Dark Mode
  const navLinkStyle = ({ isActive }) =>
    `block py-2.5 px-4 rounded transition duration-200 text-sm font-bold mb-1 border-l-4 ${
      isActive
        ? 'bg-primary-900/30 text-primary-400 border-primary-500' // Loun zreq m-dowwi ila kan f had l-page
        : 'text-gray-400 border-transparent hover:bg-gray-800 hover:text-gray-200' // Rmadi ila kan 3adi
    }`;

  return (
     <div className="flex h-screen bg-gray-900 font-sans text-gray-200">
      
       <aside className="w-64 bg-gray-950 flex flex-col shadow-xl z-10 border-r border-gray-800">
        <div className="p-5 border-b border-gray-800 bg-gray-950">
          <h1 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500">location_city</span>
            SafiPulse Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">Espace Manager</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto no-scrollbar">
          <p className="text-[10px] font-bold text-gray-600 uppercase mb-3 tracking-widest">
            Opérations
          </p>
          
          <NavLink to="/manager/incidents" className={navLinkStyle}>
            Gestion des Incidents
          </NavLink>
          
          <NavLink to="/manager/evenements" className={navLinkStyle}>
            Animation Territoriale
          </NavLink>
          
          <NavLink to="/manager/alertes" className={navLinkStyle}>
            Diffusion d'Alertes
          </NavLink>
          
          <NavLink to="/manager/moderation" className={navLinkStyle}>
            Modération (Strikes)
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950 text-xs text-gray-400">
          <p>Connecté en tant que :</p>
           <p className="font-bold text-white mt-1">Manager - Plateau</p>
          <p className="text-gray-500 mt-0.5">ID Secteur : 12</p>
        </div>
      </aside>

       <div className="flex-1 flex flex-col overflow-hidden">
        
         <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shadow-sm z-10">
          <h2 className="text-gray-200 font-bold text-sm uppercase tracking-wide">
            Tableau de Bord Opérationnel
          </h2>
          <button className="text-sm text-gray-400 hover:text-red-400 font-bold flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Déconnexion
          </button>
        </header>

         <main className="flex-1 overflow-auto p-6 bg-gray-900">
          <Toaster position="top-center" />
          <Outlet />
        </main>

      </div>
    </div>
  );
}