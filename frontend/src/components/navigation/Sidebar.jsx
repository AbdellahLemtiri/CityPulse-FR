import { NavLink } from "react-router-dom";

export default function Sidebar() {
   const navClass = ({ isActive }) =>
    `nav-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${
      isActive
        ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-500 font-bold border border-primary-100 dark:border-primary-500/20 shadow-[inset_4px_0_0_0_#f97316]"
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
    }`;

  const iconClass = ({ isActive }) =>
    `material-symbols-outlined transition-all ${
      isActive ? "" : "icon-outline group-hover:font-variation-settings-[FILL:1]"
    }`;

  return (
    <aside className="hidden md:flex flex-col w-72  dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50  border-r border-gray-200 dark:border-gray-800 h-full fixed left-0 top-0 z-50 transition-colors duration-300">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <span className="material-symbols-outlined text-white">favorite</span>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Safi<span className="text-primary-500">Pulse</span>
        </span>
      </div>

      {/* Liens */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavLink to="/homefeed" className={navClass}>
          {({ isActive }) => (<><span className={iconClass({ isActive })}>feed</span> Fil d'actualité</>)}
        </NavLink>
        <NavLink to="/idees" className={navClass}>
          {({ isActive }) => (<><span className={iconClass({ isActive })}>lightbulb</span>Idées </>)}
        </NavLink>
        <NavLink to="/safigram" className={navClass}>
          {({ isActive }) => (<><span className={iconClass({ isActive })}>photo_camera</span> SafiGram</>)}
        </NavLink>
        <NavLink to="/signalements" className={navClass}>
          {({ isActive }) => (<><span className={iconClass({ isActive })}>assignment</span> Mes Signalements</>)}
        </NavLink>
        <NavLink to="/profil" className={navClass}>
          {({ isActive }) => (<><span className={iconClass({ isActive })}>person</span> Mon Profil</>)}
        </NavLink>
      </nav>

      {/* Profil te7t */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors">
          <img src="https://i.pravatar.cc/150?u=abdellah" className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover" alt="Profile" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">Abdellah Lemtiri</p>
            <p className="text-[10px] font-extrabold text-primary-500 uppercase tracking-wide">Niveau 5 • 1200 XP</p>
          </div>
        </div>
      </div>
    </aside>
  );
}