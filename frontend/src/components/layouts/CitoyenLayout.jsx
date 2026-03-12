import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import TopHeader from "../navigation/TopHeader";
import BottomNav from "../navigation/BottomNav";

export default function CitoyenLayout() {
  return (
    // Hna fin kay-t-appliqua l-khalfiya l-kbira dial l-app kamla
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans h-screen flex overflow-hidden transition-colors duration-300">
      
      <Sidebar />

      <main id="main-container" className="flex-1 h-full overflow-y-auto relative no-scrollbar md:ml-72">
        <TopHeader />

        <div id="app-content" className="max-w-2xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet /> 
        </div>
      </main>

      <BottomNav />
    </div>
  );
}