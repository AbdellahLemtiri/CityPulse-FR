import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/homeSafiPulse.png"
          alt="Safi Poterie"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-slate-500/90 opacity-80 via-slate-900/50 to-slate-950/80 dark:to-slate-950"></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 text-center mt-10">
         

        <h1 className="  text-1xl md:text-5xl lg:text-8xl font-bold text-white leading-tight mb-6 drop-shadow-2xl reveal active">
          Safi, c'est vous. <br />
          <span className=" bg-clip-text bg-gradient-to-r from-primary-400 to-yellow-400">
            C'est nous.
          </span>
        </h1>

        <p
          className="aling-end text-lg md:text-xl font-bold text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light reveal"
          style={{ transitionDelay: "0.2s" }}>
          Bienvenue sur SafiPulse. La plateforme où l'on partage la beauté de
          notre ville, où l'on participe à son énergie, et où l'on résout ses
          défis ensemble.
        </p>

       
      </div>
    </section>
  );
}
