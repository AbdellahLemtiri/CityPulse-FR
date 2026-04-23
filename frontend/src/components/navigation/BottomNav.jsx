import { NavLink, Navigate } from 'react-router-dom';
import { Users, Database, BrickWallShield, Newspaper, UserCog, Lightbulb, MapPinned, FolderClock, PencilLine, ScrollText } from 'lucide-react';
import { useStateContext } from '../../contexts/ContextProvider';

export default function BottomNav() {
  const { user } = useStateContext();
  const role = user?.role;

  let gridClass = 'grid-cols-4';
  if (role === 'admin') {
    gridClass = 'grid-cols-5';
  } else if (role === 'manager') {
    gridClass = 'grid-cols-6';
  }

  const mobileNavClass = ({ isActive }) => `flex flex-col items-center justify-center gap-1 relative transition-colors ${isActive ? 'text-primary-600 dark:text-primary-500 font-bold' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'}`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe z-40 transition-colors duration-300">
      <div className={`grid ${gridClass} h-[68px]`}>
        <NavLink to="/homefeed" className={mobileNavClass}>
          <Newspaper className="w-6 h-6" />
          <span className="text-[10px] font-medium text-center leading-tight">Feed</span>
        </NavLink>

        {role === 'citoyen' && (
          <>
            <NavLink to="/idees" className={mobileNavClass}>
              <Lightbulb className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Idées</span>
            </NavLink>
            <NavLink to="/signalements" className={mobileNavClass}>
              <MapPinned className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Suivi</span>
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <NavLink to="/admin/masterdata" className={mobileNavClass}>
              <Database className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Data</span>
            </NavLink>
            <NavLink to="/admin/staff" className={mobileNavClass}>
              <Users className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Staff</span>
            </NavLink>
            <NavLink to="/admin/bans" className={mobileNavClass}>
              <BrickWallShield className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Bann</span>
            </NavLink>
          </>
        )}

        {role === 'manager' && (
          <>
            <NavLink to="/manager/incidents" className={mobileNavClass}>
              <FolderClock className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Incidents</span>
            </NavLink>
            <NavLink to="/manager/idees" className={mobileNavClass}>
              <Lightbulb className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Events</span>
            </NavLink>
            <NavLink to="/manager/alertes" className={mobileNavClass}>
              <PencilLine className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Alertes</span>
            </NavLink>
            <NavLink to="/manager/moderation" className={mobileNavClass}>
              <BrickWallShield className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Modérer</span>
            </NavLink>
          </>
        )}

        {role === 'journaliste' && (
          <>
            <NavLink to="/journaliste/rediger" className={mobileNavClass}>
              <PencilLine className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Rédiger</span>
            </NavLink>
            <NavLink to="/journaliste/articles" className={mobileNavClass}>
              <ScrollText className="w-6 h-6" />
              <span className="text-[10px] font-medium text-center leading-tight">Articles</span>
            </NavLink>
          </>
        )}

        <NavLink to="/profil" className={mobileNavClass}>
          <UserCog className="w-6 h-6" />
          <span className="text-[10px] font-medium text-center leading-tight">Profil</span>
        </NavLink>
      </div>
    </nav>
  );
}
