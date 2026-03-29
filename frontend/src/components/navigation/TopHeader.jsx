
export default function TopHeader() {

  return (
    <header className="sticky top-0 z-40 bg-white/90 overflow-hidden relative overflow-none dark:bg-gray-900 px-4 md:px-8 py-3 md:py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center ">
      
       <div className="flex  items-center gap-2">
        <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-white text-[18px]">favorite</span>
        </div>
        <span className="md:hidden text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          City<span className="text-primary-500">Pulse</span>
        </span>
        
         <h1 className="hidden md:block text-2xl font-bold text-gray-900 dark:text-white">
           ---------------------------------------------------------------
        </h1>
      </div>

       <div className="flex items-center gap-4">
       
        <img 
          src="https://i.pravatar.cc/150?u=abdellah" 
          className="md:hidden w-9 h-9 rounded-full border border-gray-200 dark:border-gray-700 cursor-pointer object-cover active:scale-95 transition-transform" 
          alt="Profile" 
        />
      </div>
    </header>
  );
}