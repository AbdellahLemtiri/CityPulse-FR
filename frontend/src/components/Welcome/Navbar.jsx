import { useState } from "react";
import { Link } from "react-router-dom";
export default function Navbar({ isDarkMode, toggleTheme, isMobileMenuOpen, setIsMobileMenuOpen }) {
  return (
    <header className="fixed  w-full top-0 z-50 glass-nav  transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white">
                favorite
              </span>
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-wide text-slate-900 dark:text-white">
                Safi<span className="text-primary-500">Pulse</span>
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 ">
              Vision
            </a>
            <a
              href="#activities"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 ">
              Activités
            </a>
            <a
              href="#news"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 ">
              Infos
            </a>
            <a
              href="#safigram"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500  flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">
                photo_camera
              </span>{" "}
              SafiGram
            </a>

            <a
              href="#report"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 ">
              report
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition">
              {isDarkMode ? (
                <span className="material-symbols-outlined">light_mode</span>
              ) : (
                <span className="material-symbols-outlined">dark_mode</span>
              )}
            </button>

            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 dark:text-white hover:text-primary-500 transition">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Rejoindre
              </Link>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-slate-900 dark:text-white p-2">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl`}>
        <div className="flex flex-col p-4 space-y-4">
          <a
            href="#about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block p-2 font-bold text-slate-700 dark:text-slate-200">
            Vision
          </a>
          <a
            href="#activities"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block p-2 font-bold text-slate-700 dark:text-slate-200">
            Activités
          </a>
          <a
            href="#news"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block p-2 font-bold text-slate-700 dark:text-slate-200">
            Infos
          </a>
          <Link
            to="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block p-2 font-bold text-primary-500">
            Signaler un incident
          </Link>
          <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
          <Link
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center py-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold">
            Connexion
          </Link>
          <Link
            to="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block w-full text-center py-3 rounded-lg bg-primary-500 text-white font-bold">
            S'inscrire
          </Link>
        </div>
      </div>
    </header>
  );
}
