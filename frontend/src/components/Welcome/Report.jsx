import { Link } from "react-router-dom"; // N'oublie pas l'import dial Link lfo9

export default function Report() {
  return (
    <section
    id="report"
      className="py-24 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800  duration-300">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- PARTIE 1 : Contenu original --- */}
        <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
          {/* Colonne 1 : Le Texte et les catégories */}
          <div className="md:w-1/2">
            <span className="inline-block py-1 px-3 rounded-2xl bg-primary-100 dark:bg-primary-600/20 text-primary-600 dark:text-primary-500 text-xs font-bold uppercase mb-4 border border-primary-200 dark:border-primary-500/30">
              Espace Citoyen
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 ">
              Un problème ? <br />
              <span className="text-primary-600 dark:text-primary-500">
                Signalez-le en 1 clic.
              </span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed ">
              Nid de poule, lampe grillée ou fuite d'eau ? Prenez une photo,
              nous géolocalisons l'incident et informons les services
              compétents.
            </p>

            {/* Grille des catégories */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: "lightbulb",
                  title: "Éclairage",
                  color: "text-yellow-500 dark:text-yellow-400",
                },
                {
                  icon: "water_drop",
                  title: "Eau & Fuites",
                  color: "text-blue-500 dark:text-blue-400",
                },
                {
                  icon: "edit_road",
                  title: "Routes",
                  color: "text-gray-500 dark:text-gray-400",
                },
                {
                  icon: "delete",
                  title: "Propreté",
                  color: "text-green-500 dark:text-green-400",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500  cursor-default shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center ">
                    <span className={`material-symbols-outlined ${item.color}`}>
                      {item.icon}
                    </span>
                  </div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 ">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Le bouton li kan na9s */}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg shadow-primary-900/20 dark:shadow-primary-900/50 hover:-translate-y-1">
              <span className="material-symbols-outlined">add_a_photo</span>
              Commencer un signalement
            </Link>
          </div>

          {/* Colonne 2 : Le Grid des 4 Photos (Remplaçant l'ancienne photo) */}
          <div className="md:w-1/2 w-full">
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              {/* Photo 1 : Routes */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800  duration-300 group">
                <img
                  src="/Routes.png"
                  alt="Routes"
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-300">
                    edit_road
                  </span>
                  <span className="text-white font-bold text-sm">Routes</span>
                </div>
              </div>

              {/* Photo 2 : Eau */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800  duration-300 group">
                <img
                  src="/Eau.png"
                  alt="Eau"
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    water_drop
                  </span>
                  <span className="text-white font-bold text-sm">
                    Eau & Fuites
                  </span>
                </div>
              </div>

              {/* Photo 3 : Propreté */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800  duration-300 group">
                <img
                  src="/Propreté.png"
                  alt="Propreté"
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400">
                    delete
                  </span>
                  <span className="text-white font-bold text-sm">Propreté</span>
                </div>
              </div>

              {/* Photo 4 : Éclairage */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800  duration-300 group  hover:border-primary-500 dark:hover:border:primary-slate-800 xèu cursor-pointer">
                <img
                  src="/Éclairage.png"
                  alt="Éclairage"
                  className="w-full h-full object-cover "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-400">
                    lightbulb
                  </span>
                  <span className="text-white font-bold text-sm">
                    Éclairage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="mt-20">
          <h3 className="text-2xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-16 ">
            Votre signalement en 3 étapes
          </h3>

          <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-12 md:gap-4">
            {/* Ligne connectrice */}

            {/* Étape 1 */}
            <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/3">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl flex items-center justify-center relative mb-6 ">
                <div className="absolute -top-4 right-8 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  01
                </div>
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">
                  person_add
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Connectez-vous
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm px-4">
                Créez un compte gratuitement en quelques secondes. Vos données
                sont sécurisées.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/3">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl flex items-center justify-center relative mb-6 ">
                <div className="absolute -top-4 right-8 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  02
                </div>
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">
                  contract_edit
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Signalez l'incident
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm px-4">
                Prenez une photo du problème, ajoutez une description et la
                géolocalisation.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="flex flex-col items-center text-center relative z-10 w-full md:w-1/3">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 shadow-xl flex items-center justify-center relative mb-6 ">
                <div className="absolute -top-4 right-8 bg-teal-400 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  03
                </div>
                <span className="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500">
                  overview
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Suivez la résolution
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm px-4">
                Les services compétents sont alertés. Suivez l'état d'avancement
                en temps réel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
