import { Link } from "react-router-dom";

export default function News() {
return (
<section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 reveal">
          <span className="inline-block py-1 px-3 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase mb-4">
            Alertes en temps réel
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Restez informé de tout ce qui se passe à Safi
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
            SafiPulse vous connecte directement aux annonces officielles de votre ville. Recevez des notifications instantanées sur les coupures d'eau, les travaux routiers, ou les urgences dans votre quartier.
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
              <span className="material-symbols-outlined text-primary-500">check_circle</span>
              Informations 100% vérifiées par les managers locaux.
            </li>
            <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
              <span className="material-symbols-outlined text-primary-500">check_circle</span>
              Alertes ciblées selon votre secteur (Plateau, Médina, etc.).
            </li>
          </ul>
        </div>
        
        {/* L'Illustration f blast l'fake post */}
        <div className="flex-1 w-full reveal">
          <div className="relative w-full h-80 bg-gradient-to-br from-primary-100 to-primary-50 rounded-3xl border border-primary-200 shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[100px] text-primary-500 opacity-80">
              campaign
            </span>
          </div>
        </div>
      </div> 
    </section>
  );
}
