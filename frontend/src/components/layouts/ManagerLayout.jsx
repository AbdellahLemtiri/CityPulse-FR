import { Outlet, NavLink } from "react-router-dom";

export default function ManagerLayout() {
   const navLinkStyle = ({ isActive }) =>
    `block px-4 py-3 mb-2 text-sm font-bold border-l-4 ${
      isActive
        ? "border-primary-600 bg-gray-200 text-gray-900"
        : "border-transparent text-gray-600 bg-transparent"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
       <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
         <div className="p-4 border-b border-gray-300 bg-gray-50">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
            SafiPulse Admin
          </h1>
          <p className="text-xs text-gray-600 mt-1">Espace Manager</p>
        </div>

        {/* Menu de Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">
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

         <div className="p-4 border-t border-gray-300 bg-gray-50 text-xs text-gray-600">
          <p>Connecté en tant que :</p>
          <p className="font-bold text-gray-900 mt-1">Manager - Plateau</p>
          <p className="text-gray-500">ID Secteur : 12</p>
        </div>
      </aside>

       <div className="flex-1 flex flex-col overflow-hidden">
        
         <header className="h-14 bg-white border-b border-gray-300 flex items-center justify-between px-6">
          <h2 className="text-gray-800 font-bold text-sm uppercase">
            Tableau de Bord Opérationnel
          </h2>
          <button className="text-sm text-red-600 font-bold underline bg-transparent border-none cursor-pointer">
            Déconnexion
          </button>
        </header>

         <main className="flex-1 overflow-auto p-6 bg-gray-100">
          <Outlet />
        </main>

      </div>
    </div>
  );
}