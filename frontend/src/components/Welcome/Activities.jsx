import { Link } from "react-router-dom";

export default function Activities() {
  return (
   <section className="py-20 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col-reverse md:flex-row items-center gap-12">
        {/* L'Illustration l'issar hna */}
        <div className="flex-1 w-full reveal">
          <div className="relative w-full h-80 bg-gradient-to-br from-green-100 to-emerald-50 rounded-3xl border border-green-200 shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[100px] text-green-500 opacity-80">
              diversity_3
            </span>
          </div>
        </div>

        <div className="flex-1 reveal">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-600 text-xs font-bold uppercase mb-4">
            Engagement Citoyen
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Participez à la vie de votre quartier
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
            Ne soyez plus un simple habitant, devenez acteur du changement. Découvrez notre Agenda Solidaire et rejoignez des initiatives locales qui ont un vrai impact.
          </p>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-2xl text-slate-700 dark:text-slate-300 mb-2">volunteer_activism</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Bénévolat</h4>
              <p className="text-xs text-slate-500 mt-1">Nettoyage de plages, aide aux démunis...</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-2xl text-slate-700 dark:text-slate-300 mb-2">event_available</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Événements</h4>
              <p className="text-xs text-slate-500 mt-1">Rencontres sportives, réunions publiques...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
