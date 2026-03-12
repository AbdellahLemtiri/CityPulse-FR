import { Link } from "react-router-dom";

export default function Safigram() {
  return (
  <section id="safigram" className="bg-slate-50 dark:bg-slate-950  py-24   text-white text-center">
      <div className="container mx-auto px-4 max-w-4xl reveal">
        <span className="material-symbols-outlined text-5xl text-purple-400 mb-4">
          photo_camera
        </span>
        <h2 className=" text-slate-90 dark:text-white text-3xl md:text-5xl font-bold mb-6">
          SafiGram : La beauté de Safi, par vous.
        </h2>
        <p className="text-slate-500 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
          Partagez vos plus beaux clichés, gagnez des points d'expérience (XP) et débloquez des badges exclusifs. SafiPulse n'est pas qu'une plateforme de signalement, c'est aussi le réseau social qui célèbre notre ville.
        </p>
        
     
      </div>
    </section>
  );
}
