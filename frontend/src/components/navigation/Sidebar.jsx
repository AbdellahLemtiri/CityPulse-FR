import { NavLink, Navigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { Users, Database, BrickWallShield, Newspaper, Moon, MapPinned, UserCog, FolderClock, PencilLine, ScrollText } from 'lucide-react';

export default function Sidebar() {

  const { user } = useStateContext();
  const role = user?.role;

  const navClass = ({ isActive }) => `nav-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${isActive ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-500 font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-800 h-full fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
        <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          <span className="text-primary-500">Pulse</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        <NavLink to="/homefeed" className={navClass}>
          <Newspaper size={20} /> <span>Fil d'actualité</span>
        </NavLink>

        {role === 'citoyen' && (
          <>
            <NavLink to="/pharmacies" className={navClass}>
              <Moon size={20} /> <span>Pharmacies de Garde</span>
            </NavLink>
            <NavLink to="/signalements" className={navClass}>
              <MapPinned size={20} /> <span>Mes Signalements</span>
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <NavLink to="/admin/masterdata" className={navClass}>
              <Database size={20} /> <span>Data & Workflow</span>
            </NavLink>
            <NavLink to="/admin/staff" className={navClass}>
              <Users size={20} /> <span>Staff</span>
            </NavLink>
            <NavLink to="/admin/bans" className={navClass}>
              <BrickWallShield size={20} /> <span>Bannissements</span>
            </NavLink>
          </>
        )}

        {role === 'manager' && (
          <>
            <NavLink to="/manager/incidents" className={navClass}>
              <FolderClock size={20} /> <span>Gestion des Incidents</span>
            </NavLink>
            {/* <NavLink to="/manager/idees" className={navClass}>
              <Lightbulb size={20} /> <span>Animation Territoriale</span>
            </NavLink> */}
            <NavLink to="/editor/articles" className={navClass}>
              <ScrollText size={20} /> <span>Mes Articles</span>
            </NavLink>
            <NavLink to="/manager/moderation" className={navClass}>
              <BrickWallShield size={20} /> <span>Modération</span>
            </NavLink>
          </>
        )}

        {role === 'journaliste' && (
          <>
            <NavLink to="/editor/articles" className={navClass}>
              <ScrollText size={20} /> <span>Mes Articles</span>
            </NavLink>
            <NavLink to="/editor/Pharmacies" className={navClass}>
              <ScrollText size={20} /> <span>pharmacies </span>
            </NavLink>
          </>
        )}

        <hr className="my-4 border-gray-200 dark:border-gray-700" />

        <NavLink to="/profil" className={navClass}>
          <UserCog size={20} /> <span>Mon Profil</span>
        </NavLink>
      </nav>
    </aside>
  );
}
