import { Outlet, NavLink } from 'react-router-dom';

export default function AdminLayout() {
  const navLinkStyle = ({ isActive }) => `block px-4 py-3 mb-1 text-sm font-bold border-l-4 transition-colors ${isActive ? 'border-primary-500 bg-gray-800 text-white' : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`;

  return (
    <div className="flex h-screen bg-gray-900 font-sans text-gray-200">
      {/* <aside className="w-64  bg-black flex flex-col shadow-xl z-10">
        <div className="p-5 border-b border-gray-800 bg-gray-950">
          <h1 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500">admin_panel_settings</span>
            Super-Admin
          </h1>
          <p className="text-xs text-gray-500 mt-1">SafiPulse Management</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Configuration</p>
          <NavLink to="/admin/masterdata" className={navLinkStyle}>
            Master Data & Workflow
          </NavLink>

          <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 mt-6 tracking-widest">Sécurité & RH</p>
          <NavLink to="/admin/staff" className={navLinkStyle}>
            Gestion du Staff (RBAC)
          </NavLink>
          <NavLink to="/admin/bans" className={navLinkStyle}>
            Surveillance Bannissements
          </NavLink>
 
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950 text-xs text-gray-400">
          <p>Connecté en tant que :</p>
          <p className="font-bold text-white mt-1">Directeur (DSI)</p>
        </div>
      </aside> */}

       <div className="flex-1 flex flex-col overflow-hidden">
         <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-gray-800 font-bold text-sm uppercase">Console d'Administration</h2>
          <button className="text-sm text-gray-600 hover:text-red-600 font-bold flex items-center gap-1 transition-colors">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Déconnexion
          </button>
        </header>

         <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
