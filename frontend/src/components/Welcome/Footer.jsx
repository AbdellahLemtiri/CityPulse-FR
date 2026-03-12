import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">
                  favorite
                </span>
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Safi<span className="text-primary-500">Pulse</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Plateforme collaborative pour une ville plus intelligente, plus
              propre et plus connectée.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#about"
                  className="hover:text-primary-500 transition">
                  Vision
                </a>
              </li>
              <li>
                <a
                  href="#activities"
                  className="hover:text-primary-500 transition">
                  Activités
                </a>
              </li>
              <li>
                <a
                  href="#news"
                  className="hover:text-primary-500 transition">
                  Infos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">
              Action
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-primary-500 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>{" "}
                  Signaler un incident
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition">
                  Suivre ma demande
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition">
                  Devenir bénévole
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-wider">
              Légal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition">
                  Confidentialité
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition">
                  Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-500 transition">
                  Contact Mairie
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2026 SafiPulse. Tous droits réservés.</p>
         </div>
      </div>
    </footer>
  );
}
