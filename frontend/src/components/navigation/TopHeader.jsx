import { useTheme } from "../../contexts/ThemeContext";

export default function TopHeader() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl px-4 md:px-8 py-3 md:py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center shadow-sm transition-colors duration-300">
      
      {/* Mobile Logo & PC Title */}
      <div className="flex items-center gap-2">
        <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-white text-[18px]">favorite</span>
        </div>
        <span className="md:hidden text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Safi<span className="text-primary-500">Pulse</span>
        </span>
        
        {/* Titre dynamique (n9drou n-bedlouh mn be3d b react-router) */}
        <h1 className="hidden md:block text-2xl font-bold text-gray-900 dark:text-white">
          Espace Citoyen
        </h1>
      </div>

      {/* Actions: Dark Mode & Profile (Mobile) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
        <img 
          src="https://i.pravatar.cc/150?u=abdellah" 
          className="md:hidden w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer object-cover active:scale-95 transition-transform" 
          alt="Profile" 
        />
      </div>
    </header>
  );
}