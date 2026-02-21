import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // باش نربطوه مع Login و Register

export default function Welcome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches),
  );

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // هادي كتبدل بين true و false وكتقلب الصفحة اوتوماتيك
  };

  // 2. Scroll Reveal Animation Logic
  useEffect(() => {
    const reveal = () => {
      var reveals = document.querySelectorAll(".reveal");
      for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", reveal);
    reveal(); // Trigger once on load

    // Cleanup function
    return () => window.removeEventListener("scroll", reveal);
  }, []);

  return (
    // درنا كاع الخصائص ديال البودي فهاد الـ div الكبير باش الديزاين ما يخسرش
    <div className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col selection:bg-primary-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 scroll-smooth">
      <header className="fixed w-full top-0 z-50 glass-nav transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-2 group">
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
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
              >
                Vision
              </a>
              <a
                href="#activities"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
              >
                Activités
              </a>
              <a
                href="#news"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
              >
                Infos
              </a>
              <a
                href="#safigram"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  photo_camera
                </span>{" "}
                SafiGram
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                {isDarkMode ? (
                  <span className="material-symbols-outlined">light_mode</span>
                ) : (
                  <span className="material-symbols-outlined">dark_mode</span>
                )}
              </button>

              <div className="hidden md:flex items-center gap-3">
                {/* بدلنا a بـ Link باش نمشيو بالـ Router */}
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-700 dark:text-white hover:text-primary-500 transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Rejoindre
                </Link>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-900 dark:text-white p-2"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
            </div>
          </div>
        </div>

        {/* المونيو ديال التليفون */}
        <div
          id="mobile-menu"
          className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl`}
        >
          <div className="flex flex-col p-4 space-y-4">
            <a
              href="#about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 font-bold text-slate-700 dark:text-slate-200"
            >
              Vision
            </a>
            <a
              href="#activities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 font-bold text-slate-700 dark:text-slate-200"
            >
              Activités
            </a>
            <a
              href="#news"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 font-bold text-slate-700 dark:text-slate-200"
            >
              Infos
            </a>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 font-bold text-primary-500"
            >
              Signaler un incident
            </Link>
            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2"></div>
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-lg bg-primary-500 text-white font-bold"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/home.png"
              alt="Safi Poterie"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-bl from-slate-900/90 opacity-80 via-slate-900/50 to-slate-50 dark:to-slate-950"></div>
          </div>

          <div className="relative z-20 container mx-auto px-4 text-center mt-10">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 animate-float">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-bold tracking-wider text-white uppercase">
                Communauté Active • Safi
              </span>
            </div>

            <h1 className="  text-1xl md:text-5xl lg:text-8xl font-bold text-white leading-tight mb-6 drop-shadow-2xl reveal active">
              Safi, c'est vous. <br />
              <span className=" bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-400">
                C'est nous.
              </span>
            </h1>

            <p
              className="aling-end text-lg md:text-xl font-bold text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light reveal"
              style={{ transitionDelay: "0.2s" }}
            >
              Bienvenue sur SafiPulse. La plateforme où l'on partage la beauté
              de notre ville, où l'on participe à son énergie, et où l'on résout
              ses défis ensemble.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 reveal"
              style={{ transitionDelay: "0.4s" }}
            >
              <Link
                to="/dashboard"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-primary-500/30 hover:-translate-y-1 transition-all w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">edit_square</span>{" "}
                Faire un signalement
              </Link>
              <a
                href="#safigram"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:-translate-y-1 transition-all w-full sm:w-auto"
              >
                Voir la galerie
              </a>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="py-24 bg-white dark:bg-slate-900 rounded-t-[3rem] -mt-10 relative z-30"
        >
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
                  SafiPulse transforme chaque citoyen en acteur du changement.
                  Nous utilisons la technologie pour réduire la distance entre
                  les habitants, la mairie et les services publics (RADEES,
                  Nettoyage).
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
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary-500 to-secondary-500 opacity-20 blur-2xl rounded-full animate-blob"></div>
                <img
                  src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000"
                  className="relative rounded-3xl shadow-2xl border-4 border-white dark:border-slate-800 rotate-2 hover:rotate-0 transition-all duration-500"
                  alt="Safi Vision"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="safigram"
          className="py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden content-center"
        >
          <div className="container mx-auto px-4 mb-10 text-center reveal">
            <span className="text-purple-500 font-bold uppercase tracking-wider text-xs">
              Communauté
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              SafiGram
            </h2>
            <p className="text-slate-500">
              Les plus beaux clichés de la ville, par vous.
            </p>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-8 px-4 md:px-20 scrollbar-hide snap-x reveal">
            <div className="min-w-[280px] md:min-w-[320px] h-96 rounded-2xl overflow-hidden relative snap-center group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1580227974542-c51722880791?q=80&w=600"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Post 1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://i.pravatar.cc/100?u=sa1"
                    className="w-6 h-6 rounded-full border border-white"
                    alt="User"
                  />
                  <span className="text-xs font-bold">@Amine_Safi</span>
                </div>
                <p className="text-sm font-medium">Château de Mer 🌊</p>
              </div>
            </div>
            <div className="min-w-[280px] md:min-w-[320px] h-96 rounded-2xl overflow-hidden relative snap-center group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1590664095641-7fa05423871d?q=80&w=600"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Post 2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://i.pravatar.cc/100?u=sa2"
                    className="w-6 h-6 rounded-full border border-white"
                    alt="User"
                  />
                  <span className="text-xs font-bold">@Leila_Art</span>
                </div>
                <p className="text-sm font-medium">Colline des Potiers 🏺</p>
              </div>
            </div>
            <div className="min-w-[280px] md:min-w-[320px] h-96 rounded-2xl overflow-hidden relative snap-center group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1517983694060-32df9c9bd82c?q=80&w=600"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Post 3"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="https://i.pravatar.cc/100?u=sa3"
                    className="w-6 h-6 rounded-full border border-white"
                    alt="User"
                  />
                  <span className="text-xs font-bold">@Youssef_Surf</span>
                </div>
                <p className="text-sm font-medium">Lalla Fatna Beach 🏄‍♂️</p>
              </div>
            </div>
            <div className="min-w-[280px] md:min-w-[320px] h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 flex flex-col items-center justify-center text-center snap-center">
              <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                add_a_photo
              </span>
              <p className="text-slate-500 font-bold">Rejoignez SafiGram</p>
              <button className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-full text-sm font-bold hover:bg-primary-600 transition">
                Poster
              </button>
            </div>
          </div>
        </section>

        <section id="activities" className="py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Quartier En Action
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  Activités Locales
                </h2>
                <p className="text-slate-500 mt-2">
                  Événements organisés par les managers de quartier.
                </p>
              </div>
              <a
                href="#"
                className="text-sm font-bold text-primary-600 hover:text-primary-700 mt-4 md:mt-0 flex items-center gap-1 group"
              >
                Voir tout l'agenda{" "}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group reveal">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-lg text-center min-w-[60px] shadow-sm">
                    <span className="block text-xs font-bold uppercase text-slate-500">
                      Fév
                    </span>
                    <span className="block text-2xl font-black font-serif">
                      12
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=500"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Event 1"
                  />
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-green-500 px-2 py-1 rounded-md">
                    Bénévolat
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Grand Nettoyage du Parc
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    Rejoignez-nous pour une matinée de nettoyage.
                  </p>
                  <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                    Je participe
                  </button>
                </div>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group reveal"
                style={{ transitionDelay: "0.1s" }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-lg text-center min-w-[60px] shadow-sm">
                    <span className="block text-xs font-bold uppercase text-slate-500">
                      Fév
                    </span>
                    <span className="block text-2xl font-black font-serif">
                      18
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe4384d4?q=80&w=500"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Event 2"
                  />
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-blue-500 px-2 py-1 rounded-md">
                    Sport
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Tournoi de Foot Ramadan
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    Inscriptions ouvertes pour le tournoi annuel.
                  </p>
                  <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                    Je participe
                  </button>
                </div>
              </div>

              <div
                className="bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group reveal"
                style={{ transitionDelay: "0.2s" }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-lg text-center min-w-[60px] shadow-sm">
                    <span className="block text-xs font-bold uppercase text-slate-500">
                      Mar
                    </span>
                    <span className="block text-2xl font-black font-serif">
                      05
                    </span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1544928147-79a77456a1f3?q=80&w=500"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt="Event 3"
                  />
                  <span className="absolute bottom-3 left-3 text-white text-xs font-bold bg-purple-500 px-2 py-1 rounded-md">
                    Débat
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Réunion Publique: Voirie
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    Discussion sur la rénovation du centre-ville.
                  </p>
                  <button className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all">
                    Je participe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="news"
          className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal">
              <div>
                <span className="flex items-center gap-2 text-red-500 font-bold tracking-wider text-sm uppercase mb-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Infos Officielles
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
                  Dernières Annonces
                </h2>
              </div>
              <a
                href="#"
                className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold transition-colors group mt-4"
              >
                Voir toutes les actualités
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Urgent */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group reveal flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=800"
                    alt="Coupure Eau"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    URGENT • RADEES
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>{" "}
                      Il y a 2h
                    </span>
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[18px] fill-current">
                        favorite
                      </span>{" "}
                      245
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
                    Coupure d'eau prévue secteur Sud
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                    En raison de travaux de maintenance sur le réseau principal,
                    une coupure d'eau affectera le secteur Sud ce mardi de 14h à
                    18h. Veuillez prendre vos précautions.
                  </p>

                  <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src="https://i.pravatar.cc/150?u=radees"
                      alt="Auteur"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Service Com' RADEES
                      </p>
                      <p className="text-xs text-slate-500">
                        Direction technique
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Transport */}
              <div
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group reveal flex flex-col"
                style={{ transitionDelay: "0.1s" }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800"
                    alt="Bus Transport"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    TRANSPORT
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">
                        schedule
                      </span>{" "}
                      Hier, 15:30
                    </span>
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-[18px] fill-current">
                        favorite
                      </span>{" "}
                      892
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
                    Lancement de la nouvelle ligne de bus N°7
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">
                    Excellente nouvelle pour les étudiants ! La nouvelle ligne
                    reliant directement la gare routière au Pôle Universitaire
                    est désormais 100% opérationnelle.
                  </p>

                  <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <img
                      src="https://i.pravatar.cc/150?u=manager1"
                      alt="Auteur"
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Youssef Amrani
                      </p>
                      <p className="text-xs text-slate-500">
                        Manager Mobilité Urbaine
                      </p>
                    </div>
                  </div>
                </div>
              </div>

          <div
  className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-md   group reveal flex flex-col gap-5"
  style={{ transitionDelay: "0.2s" }}
>
  {/* Header */}
  <div className="flex justify-between items-start">
    <div className="flex items-center gap-3">
      <img
        src="https://i.pravatar.cc/150?u=doc2"
        alt="Auteur"
        className="w-12 h-12 rounded-full ring-2 ring-primary-500/20 shadow-sm"
      />
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Dr. Amina Bennani
        </p>
        <p className="text-xs text-slate-500">
          Délégation de la Santé
        </p>
      </div>
    </div>

    <span className="flex items-center gap-1 text-xs font-medium 
    text-slate-500 dark:text-slate-400 
    bg-slate-100 dark:bg-slate-800 
    px-3 py-1 rounded-full">
      <span className="material-symbols-outlined text-[14px]">
        schedule
      </span>
      2j
    </span>
  </div>

  {/* Content */}
  <div>
    <h3 className="text-lg md:text-xl font-bold 
    text-slate-900 dark:text-white 
     transition-colors">
      Grande campagne de vaccination infantile
    </h3>

    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 
    line-clamp-3 leading-relaxed">
      Le centre de santé Massira sera ouvert exceptionnellement ce
      weekend de 9h à 16h pour la campagne de vaccination
      nationale. N'oubliez pas le carnet de santé.
    </p>
  </div>

  {/* Image */}
  <div className="relative h-60 w-full rounded-md overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=800"
      alt="Santé"
      className="w-full h-full object-cover 
       "
    />

    <div className="absolute inset-0 bg-gradient-to-t 
    from-black/40 via-black/10 to-transparent" />

    <div className="absolute top-4 left-4 
    bg-primary-500 text-white text-xs 
    uppercase tracking-wider font-bold 
    px-3 py-1.5 rounded-full shadow-lg">
      Santé Publique
    </div>
  </div>
</div>
            </div>

            <div className="mt-10 text-center md:hidden reveal">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold transition-colors"
              >
                Voir toutes les actualités
                <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        <section
          id="report"
          className="  py-24 bg-slate-900 border-t border-slate-800"
        >
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <span className="inline-block py-1 px-3 rounded bg-primary-600/20 text-primary-500 text-xs font-bold uppercase mb-4 border border-primary-500/30">
                  Espace Citoyen
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                  Un problème ? <br />
                  <span className="text-primary-500">
                    Signalez-le en 1 clic.
                  </span>
                </h2>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  Nid de poule, lampe grillée ou fuite d'eau ? Prenez une photo,
                  nous géolocalisons l'incident et informons les services
                  compétents.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-colors cursor-default">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <span className="material-symbols-outlined text-yellow-400">
                        lightbulb
                      </span>
                    </div>
                    <span className="font-bold text-slate-200">Éclairage</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-colors cursor-default">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-400">
                        water_drop
                      </span>
                    </div>
                    <span className="font-bold text-slate-200">
                      Eau & Fuites
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-colors cursor-default">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">
                        edit_road
                      </span>
                    </div>
                    <span className="font-bold text-slate-200">Routes</span>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-primary-500 transition-colors cursor-default">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <span className="material-symbols-outlined text-green-400">
                        delete
                      </span>
                    </div>
                    <span className="font-bold text-slate-200">Propreté</span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg shadow-primary-900/50 hover:-translate-y-1"
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  Commencer un signalement
                </Link>
              </div>

              <div className="md:w-1/2">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                  <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                    <div className="flex items-center gap-3 text-white">
                      <span className="material-symbols-outlined text-green-400">
                        check_circle
                      </span>
                      <div>
                        <div className="text-sm font-bold">
                          Signalement envoyé
                        </div>
                        <div className="text-xs text-slate-300">
                          Il y a 2 min • Secteur 3
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
                    className="hover:text-primary-500 transition"
                  >
                    Vision
                  </a>
                </li>
                <li>
                  <a
                    href="#activities"
                    className="hover:text-primary-500 transition"
                  >
                    Activités
                  </a>
                </li>
                <li>
                  <a href="#news" className="hover:text-primary-500 transition">
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
                    className="hover:text-primary-500 transition flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>{" "}
                    Signaler un incident
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition">
                    Suivre ma demande
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition">
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
                  <a href="#" className="hover:text-primary-500 transition">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary-500 transition">
                    Contact Mairie
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; 2026 SafiPulse. Tous droits réservés.</p>
            <p className="mt-2 md:mt-0 text-slate-600">Fait avec ❤️ à Safi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
