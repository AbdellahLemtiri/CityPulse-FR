import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axiosClient from "./config/axios-client";
import { useStateContext } from "./contexts/ContextProvider";
import axios from "axios";

const secteursSafi = [
  {
    id: 1,
    nom: "Quartier Plateau",
    img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=200&auto=format&fit=crop",
    lat: "32.2994",
    lng: "-9.2372",
  },
  {
    id: 2,
    nom: "Médina Ancienne",
    img: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=200&auto=format&fit=crop",
    lat: "32.3008",
    lng: "-9.2272",
  },
  {
    id: 3,
    nom: "Sidi Bouzid",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&auto=format&fit=crop",
    lat: "32.3167",
    lng: "-9.2500",
  },
  {
    id: 4,
    nom: "KaoKi / Anas",
    img: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=200&auto=format&fit=crop",
    lat: "32.2833",
    lng: "-9.2167",
  },
];

export default function Register() {
  const { token, setToken, setUser } = useStateContext();
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    cin: "",
    telephone: "",
    sector_id: "",
    adresse: "",
    email: "",
    password: "",
    terms: false,
  });

  const [pwdStrength, setPwdStrength] = useState({
    score: 0,
    length: false,
    upper: false,
    number: false,
    special: false,
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (token) return <Navigate to="/dashboard" />;

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });

    if (id === "password") checkPasswordStrength(value);
  };

  const checkPasswordStrength = (pwd) => {
    const reqs = {
      length: pwd.length >= 4,
      upper: true,
      number: true,
      special: true,
    };
    let score =
      (reqs.length ? 1 : 0) +
      (reqs.upper ? 1 : 0) +
      (reqs.number ? 1 : 0) +
      (reqs.special ? 1 : 0);
    setPwdStrength({ score, ...reqs });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (pwdStrength.score < 3 || !formData.terms) return;

    setErrors(null);
    setLoading(true);

    try {
      const response = await axiosClient.post("/register", formData);
      console.log(response.data.message);
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (err) {
      console.log(err);

      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({
          global: "Erreur de connexion serveur. Réessayez plus tard.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const strengthColors = [
    "bg-gray-200",
    "bg-red-600",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-600",
  ];
  const strengthLabels = [
    "Très faible",
    "Très faible",
    "Faible",
    "Moyen",
    "Fort",
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans min-h-screen flex flex-col items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <header className="w-full max-w-lg flex items-center justify-between z-10 mb-4">
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition">
          <span className="material-symbols-outlined">arrow_back</span> Retour
        </Link>
      </header>

      <main className="flex-grow w-full max-w-lg z-10 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Safi<span className="text-orange-600">Pulse</span>
          </h1>
        </div>

        <div className="w-full mb-8">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
            <span className={step >= 1 ? "text-orange-600" : ""}>Identité</span>
            <span className={step >= 2 ? "text-orange-600" : ""}>
              Localisation
            </span>
            <span className={step >= 3 ? "text-orange-600" : ""}>Sécurité</span>
          </div>
          <div className="flex gap-2 h-1.5">
            <div
              className={`flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-orange-600 shadow-sm shadow-orange-500/50" : "bg-gray-200 dark:bg-slate-800"}`}></div>
            <div
              className={`flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-orange-600 shadow-sm shadow-orange-500/50" : "bg-gray-200 dark:bg-slate-800"}`}></div>
            <div
              className={`flex-1 rounded-full transition-all duration-500 ${step >= 3 ? "bg-orange-600 shadow-sm shadow-orange-500/50" : "bg-gray-200 dark:bg-slate-800"}`}></div>
          </div>
        </div>

        {errors && Object.keys(errors).length > 2 && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-200">
            {Object.keys(errors).map((key) => (
              <p key={key}>• {errors[key][0]}</p>
            ))}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4 border border-green-200">
            {message}
          </div>
        )}

        <div className="w-full bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 relative min-h-[400px]">
          <form
            onSubmit={onSubmit}
            className="flex flex-col h-full justify-between">
            {step === 1 && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Qui êtes-vous ?</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Informations pour votre carte citoyenne.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1 relative group">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                    CIN (Carte Nationale) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="cin"
                      value={formData.cin}
                      onChange={handleChange}
                      required
                      placeholder="H123456"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 uppercase focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      badge
                    </span>
                  </div>
                </div>
                <div className="space-y-1 relative group">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                      placeholder="06..."
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"
                    />
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      smartphone
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    !formData.first_name ||
                    !formData.last_name ||
                    !formData.cin ||
                    !formData.telephone
                  }
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                  Suivant{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in flex flex-col h-full justify-between space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Votre Secteur</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Choisissez votre zone dans Safi.
                  </p>

                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 mb-2 block">
                    Secteurs disponibles *
                  </label>

                  <div className="grid grid-cols-2 gap-3 mb-4 max-h-[220px] overflow-y-auto pr-1">
                    {secteursSafi.map((sec) => (
                      <div
                        key={sec.id}
                        onClick={() =>
                          setFormData({ ...formData, sector_id: sec.id })
                        }
                        className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          formData.sector_id === sec.id
                            ? "border-orange-600 shadow-md scale-[1.02]"
                            : "border-transparent hover:border-gray-300"
                        }`}>
                        <img
                          src={sec.img}
                          alt={sec.nom}
                          className="w-full h-20 object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2">
                          <span className="text-white text-xs font-bold">
                            {sec.nom}
                          </span>
                          <span className="text-[9px] text-gray-300 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">
                              location_on
                            </span>
                            {sec.lat}, {sec.lng}
                          </span>
                        </div>

                        {formData.sector_id === sec.id && (
                          <div className="absolute top-1 right-1 bg-orange-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[12px]">
                              check
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                      Adresse exacte (Optionnel)
                    </label>
                    <textarea
                      id="adresse"
                      rows="2"
                      value={formData.adresse}
                      onChange={handleChange}
                      placeholder="Rue, N°..."
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3 px-4 resize-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"></textarea>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 border border-gray-200 dark:border-slate-700 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.sector_id}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    Suivant{" "}
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in flex flex-col h-full justify-between space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Sécurisation</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Protégez votre compte citoyen.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"
                        />
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          mail
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 relative">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">
                        Mot de passe *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl py-3.5 pl-11 pr-10 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-600 outline-none transition-all"
                        />
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          lock
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600">
                          <span className="material-symbols-outlined text-sm">
                            {showPassword ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                      </div>

                      {formData.password.length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                          <div className="flex justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400">
                              Force
                            </span>
                            <span
                              className={`text-[10px] font-bold ${pwdStrength.score >= 3 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`}>
                              {strengthLabels[pwdStrength.score]}
                            </span>
                          </div>

                          <div className="flex gap-1 h-1.5 mb-2">
                            {[1, 2, 3, 4].map((num) => (
                              <div
                                key={num}
                                className={`flex-1 rounded-full ${pwdStrength.score >= num ? strengthColors[pwdStrength.score] : "bg-gray-200 dark:bg-slate-700"}`}></div>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                            <div
                              className={`flex items-center gap-1 ${pwdStrength.length ? "text-green-600 dark:text-green-400" : ""}`}>
                              <span className="material-symbols-outlined text-[12px]">
                                {pwdStrength.length ? "check" : "close"}
                              </span>{" "}
                              8 caractères
                            </div>
                            <div
                              className={`flex items-center gap-1 ${pwdStrength.upper ? "text-green-600 dark:text-green-400" : ""}`}>
                              <span className="material-symbols-outlined text-[12px]">
                                {pwdStrength.upper ? "check" : "close"}
                              </span>{" "}
                              1 Majuscule
                            </div>
                            <div
                              className={`flex items-center gap-1 ${pwdStrength.number ? "text-green-600 dark:text-green-400" : ""}`}>
                              <span className="material-symbols-outlined text-[12px]">
                                {pwdStrength.number ? "check" : "close"}
                              </span>{" "}
                              1 Chiffre
                            </div>
                            <div
                              className={`flex items-center gap-1 ${pwdStrength.special ? "text-green-600 dark:text-green-400" : ""}`}>
                              <span className="material-symbols-outlined text-[12px]">
                                {pwdStrength.special ? "check" : "close"}
                              </span>{" "}
                              Spécial (!@#...)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.terms}
                        onChange={handleChange}
                        required
                        className="mt-1 accent-orange-600 w-4 h-4 rounded cursor-pointer"
                      />
                      <label
                        htmlFor="terms"
                        className="text-xs text-gray-500 leading-snug cursor-pointer select-none">
                        J'accepte les{" "}
                        <a
                          href="#"
                          className="text-orange-600 font-bold hover:underline">
                          conditions d'utilisation
                        </a>{" "}
                        de SafiPulse et le traitement de mes données. *
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 border border-gray-200 dark:border-slate-700 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={
                      loading || pwdStrength.score < 3 || !formData.terms
                    }
                    className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? "Création..." : "Terminer"}{" "}
                    <span className="material-symbols-outlined text-sm">
                      check_circle
                    </span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            className="text-orange-600 font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </main>
    </div>
  );
}
