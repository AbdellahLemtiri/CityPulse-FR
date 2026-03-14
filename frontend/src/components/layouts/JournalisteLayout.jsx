import { Outlet, NavLink } from "react-router-dom";

export default function JournalisteLayout() {
  const navLinkStyle = ({ isActive }) =>
    `block px-4 py-3 mb-2 text-sm font-bold border-l-4 ${
      isActive
        ? "border-secondary-600 bg-gray-200 text-gray-900" // Khedmna b l-bleu (secondary) bach n-fer9ouh 3la l-Manager
        : "border-transparent text-gray-600 bg-transparent"
    }`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300 bg-gray-50">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
            SafiPulse Media
          </h1>
          <p className="text-xs text-gray-600 mt-1">Espace Journaliste</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">
            Publication
          </p>
          
          <NavLink to="/journaliste/rediger" className={navLinkStyle}>
            Rédiger un Article
          </NavLink>
          
          <NavLink to="/journaliste/articles" className={navLinkStyle}>
            Tous les Articles
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-300 bg-gray-50 text-xs text-gray-600">
          <p>Connecté en tant que :</p>
          <p className="font-bold text-gray-900 mt-1">Kamal (Journaliste)</p>
          <p className="text-gray-500">Service Communication</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-300 flex items-center justify-between px-6">
          <h2 className="text-gray-800 font-bold text-sm uppercase">
            Système de Gestion de Contenu (CMS)
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