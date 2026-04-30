import { NavLink, Navigate } from 'react-router-dom';
import { useStateContext } from '../../contexts/ContextProvider';
import { Users, Database, BrickWallShield, Newspaper, Moon, MapPinned, UserCog, FolderClock, PencilLine, ScrollText } from 'lucide-react';
import Logo  from '../logos/Logo'; 

export default function Sidebar() {
  const { user } = useStateContext();
  const role = user?.role;

  const navClass = ({ isActive }) => `nav-item w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all group ${isActive ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-500 font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}`;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-800 h-full fixed left-0 top-0 z-50 transition-colors duration-300">
      
       <div className="p-4 flex items-center justify-center border-b border-transparent dark:border-gray-800/50">
         <Logo className="w-40 h-auto drop-shadow-sm" />
         
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
        <hr className="mb-4 border-gray-200 dark:border-gray-700" />

        <NavLink to="/homefeed" className={navClass}>
          <Newspaper size={20} /> <span>Fil d'actualité</span>
        </NavLink>

        {role === 'citoyen' && (
          <>
            <NavLink to="/pharmacies" className={navClass}>
              <Moon size={20} /> <span>Ph. de Garde</span>
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
              <ScrollText size={20} /> <span>Pharmacies</span>
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