import { NavLink } from "react-router-dom";

export default function BottomNav() {
  const mobileNavClass = ({ isActive }) =>
    `flex flex-col items-center justify-center relative transition-colors ${
      isActive ? "text-primary-600 dark:text-primary-500" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full glass-nav pb-safe z-40 transition-colors duration-300">
      <div className="grid grid-cols-5 h-[68px]">
        <NavLink to="/homefeed" className={mobileNavClass}>
          {({ isActive }) => (<><span className={`material-symbols-outlined text-[26px] mb-0.5 ${isActive ? '' : 'icon-outline'}`}>feed</span><span className="text-[10px] font-medium">Fil</span></>)}
        </NavLink>
        <NavLink to="/agenda" className={mobileNavClass}>
          {({ isActive }) => (<><span className={`material-symbols-outlined text-[26px] mb-0.5 ${isActive ? '' : 'icon-outline'}`}>event</span><span className="text-[10px] font-medium">Agenda</span></>)}
        </NavLink>
        <NavLink to="/safigram" className={mobileNavClass}>
          {({ isActive }) => (
            <>
              {isActive && <div className="absolute top-0 w-8 h-1 bg-primary-500 rounded-b-full shadow-[0_2px_8px_#f97316]"></div>}
              <span className={`material-symbols-outlined text-[26px] mb-0.5 ${isActive ? '' : 'icon-outline'}`}>photo_camera</span>
              <span className={`text-[10px] ${isActive ? 'font-extrabold' : 'font-medium'}`}>Photos</span>
            </>
          )}
        </NavLink>
        <NavLink to="/signalements" className={mobileNavClass}>
          {({ isActive }) => (<><span className={`material-symbols-outlined text-[26px] mb-0.5 ${isActive ? '' : 'icon-outline'}`}>assignment</span><span className="text-[10px] font-medium">Suivi</span></>)}
        </NavLink>
        <NavLink to="/profil" className={mobileNavClass}>
          {({ isActive }) => (<><span className={`material-symbols-outlined text-[26px] mb-0.5 ${isActive ? '' : 'icon-outline'}`}>person</span><span className="text-[10px] font-medium">Profil</span></>)}
        </NavLink>
      </div>
    </nav>
  );
}