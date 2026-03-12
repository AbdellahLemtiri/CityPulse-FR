import { Link } from "react-router-dom";

    export default function Abuot() {
    return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-slate-900 rounded-t-[3rem] -mt-10 relative z-30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <span className="text-primary-600 font-bold tracking-wider text-sm uppercase mb-2 block">
              Notre Mission
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Une ville connectée, <br />{" "}
              <span className="text-primary-500">Une ville vivante.</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
              SafiPulse transforme chaque citoyen en acteur du changement. Nous
              utilisons la technologie pour réduire la distance entre les
              habitants, la mairie et les services publics .
            </p>

            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-green-500 bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  check
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Suivi en temps réel des signalements
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-500 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                  check
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Organisation d'événements bénévoles
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-purple-500 bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full">
                  check
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Valorisation de la culture Safiote
                </span>
              </li>
            </ul>
          </div>

          <div
            className="relative reveal"
             >
            <div className="absolute   bg-gradient-to-tr from-primary-500 to-secondary-500 opacity-20 blur-2xl rounded-full "></div>
            <img    id="safigram"
              src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000"
              className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800      transition-all duration-500"
              alt="Safi Vision"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
