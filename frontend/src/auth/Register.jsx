import { Eye, EyeOff, Check, X, ArrowLeft, ArrowRight, CheckCircle2, CreditCard, Phone, Mail, Lock, MapPin, User } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axiosClient from './../config/axios-client';
import { useStateContext } from './../contexts/ContextProvider';
import { toast, Toaster } from 'react-hot-toast';

export default function Register() {
  const { user, setUser } = useStateContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [apiErrors, setApiErrors] = useState(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    cin: '',
    telephone: '',
    sector_id: '',
    city_id: '',
    adresse: '',
    email: '',
    password: '',
    terms: false,
  });

  if (user) return <Navigate to="/homefeed" />;

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target; 
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[id]) {
      setFieldErrors(prev => ({ ...prev, [id]: null }));
    }
  };

  const regexPatterns = {
    name: /^[a-zA-ZÀ-ÿ\s\-]{2,}$/, 
    cin: /^[a-zA-Z]{1,2}[0-9]{4,6}$/,   
    phone: /^0[67][0-9]{8}$/ 
  };

  const validateStep1 = () => {
    let errs = {};
    if (!regexPatterns.name.test(formData.first_name)) errs.first_name = "Prénom invalide";
    if (!regexPatterns.name.test(formData.last_name)) errs.last_name = "Nom invalide";
    if (!regexPatterns.cin.test(formData.cin)) errs.cin = "Format invalide (ex: H123456)";
    if (!regexPatterns.phone.test(formData.telephone)) errs.telephone = "Numéro invalide (ex: 06...)";
    
    setFieldErrors(errs);
    return Object.keys(errs).length === 0; 
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;  
    setStep((prev) => prev + 1);
  };
  
  const prevStep = () => setStep((prev) => prev - 1);

  const pwdRules = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)  
  };
  const isPasswordValid = pwdRules.length && pwdRules.upper && pwdRules.number && pwdRules.special;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid || !formData.terms) return;

    setApiErrors(null);
    setLoading(true);

    try {
      await axiosClient.get('http://localhost:8000/sanctum/csrf-cookie');
      const response = await axiosClient.post('/register', formData);
      
      toast.success('Inscription effectuée avec succès !');
      setUser(response.data.user);
      navigate('/homefeed'); 
      
    } catch (err) {
      if (err.response && err.response.status === 422) {
        setApiErrors(err.response.data.errors);
        toast.error("Veuillez vérifier les informations saisies.");
      } else {
        toast.error("Une erreur s'est produite lors de l'inscription.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axiosClient.get('/cities');
      setCities(response.data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handelchanageCity = async (e) => {
    const selectedCityId = e.target.value;
    setFormData({ ...formData, city_id: selectedCityId, sector_id: '' });

    if (selectedCityId) {
      try {
        const response = await axiosClient.get('sectors/city', { params: { city_id: selectedCityId } });
        setSectors(response.data);
      } catch (error) {}
    } else {
      setSectors([]);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-sans min-h-screen flex flex-col items-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-xl blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <header className="w-full max-w-lg flex items-center justify-between z-10 mb-4">
        <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 transition">
          <ArrowLeft size={18} /> Retour
        </Link>
      </header>

      <main className="flex-grow w-full max-w-lg z-10 flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Safi<span className="text-orange-600">Pulse</span></h1>
        </div>

        <div className="w-full mb-8">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
            <span className={step >= 1 ? 'text-orange-600' : ''}>Identité</span>
            <span className={step >= 2 ? 'text-orange-600' : ''}>Localisation</span>
            <span className={step >= 3 ? 'text-orange-600' : ''}>Sécurité</span>
          </div>
          <div className="flex gap-2 h-1 ">
            <div className={`flex-1 rounded-lg ${step >= 1 ? 'bg-orange-600 shadow-sm' : 'bg-gray-200 dark:bg-slate-800'}`}></div>
            <div className={`flex-1 rounded-lg ${step >= 2 ? 'bg-orange-600 shadow-sm' : 'bg-gray-200 dark:bg-slate-800'}`}></div>
            <div className={`flex-1 rounded-lg ${step >= 3 ? 'bg-orange-600 shadow-sm' : 'bg-gray-200 dark:bg-slate-800'}`}></div>
          </div>
        </div>

        {apiErrors && Object.keys(apiErrors).length > 0 && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-200">
            {Object.keys(apiErrors).map((key) => (
              <p key={key}>• {apiErrors[key][0]}</p>
            ))}
          </div>
        )}

        <div className="w-full bg-white dark:bg-slate-900 p-8 rounded-lg shadow-2xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-slate-800 relative min-h-[400px]">
          <form onSubmit={onSubmit} className="flex flex-col h-full justify-between">
            <Toaster />
            
             {step === 1 && (
              <div className="animate-fade-in space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Qui êtes-vous ?</h2>
                  <p className="text-sm text-gray-500 mb-6">Informations pour votre carte citoyenne.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 relative group">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Prénom *</label>
                    <div className="relative">
                      <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required className={` ${fieldErrors.first_name ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 rounded-lg px-10 text-gray-900 outline-none resize-none `} />
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.first_name && <p className="text-[10px] text-red-500 ml-1">{fieldErrors.first_name}</p>}
                  </div>
                  <div className="space-y-1 relative group">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Nom *</label>
                    <div className="relative">
                      <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required className={` ${fieldErrors.last_name ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 rounded-lg px-10 text-gray-900 outline-none resize-none `} />
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {fieldErrors.last_name && <p className="text-[10px] text-red-500 ml-1">{fieldErrors.last_name}</p>}
                  </div>
                </div>

                <div className="space-y-1 relative group">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">CIN (Carte Nationale) *</label>
                  <div className="relative">
                    <input type="text" id="cin" value={formData.cin} onChange={handleChange} required placeholder="H123456" className={` ${fieldErrors.cin ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 rounded-lg px-12 text-gray-900 outline-none resize-none uppercase `} />
                    <CreditCard size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {fieldErrors.cin && <p className="text-[10px] text-red-500 ml-1">{fieldErrors.cin}</p>}
                </div>

                <div className="space-y-1 relative group">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Téléphone *</label>
                  <div className="relative">
                    <input type="tel" id="telephone" value={formData.telephone} onChange={handleChange} required placeholder="06..." className={` ${fieldErrors.telephone ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 rounded-lg px-12 text-gray-900 outline-none resize-none `} />
                    <Phone size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {fieldErrors.telephone && <p className="text-[10px] text-red-500 ml-1">{fieldErrors.telephone}</p>}
                </div>

                <button type="button" onClick={nextStep} disabled={!formData.first_name || !formData.last_name || !formData.cin || !formData.telephone} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50">
                  Suivant <ArrowRight size={18} />
                </button>
              </div>
            )}

             {step === 2 && (
              <div className="animate-fade-in flex flex-col h-full justify-between space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Votre Secteur</h2>
                  <p className="text-sm text-gray-500 mb-4">Choisissez votre zone dans Safi.</p>

                  <div className="mt-3 relative group">
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 mb-1.5">Ville *</label>
                      <select name="city_id" id="city_id" value={formData.city_id} onChange={handelchanageCity} className="w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-primary-600 rounded-lg px-4 text-gray-900 outline-none appearance-none">
                      <option value="" disabled>Selectionnez Votre ville</option>
                      {cities.map((city) => ( <option key={city.id} value={city.id}>{city.name}</option> ))}
                    </select>
                  </div>

                  <div className="mt-3 relative group"> 
                  <label className="text-[10px] font-bold uppercase text-gray-400 ml-1 ">L'annexe administrative *</label>
                      <select name="sector_id" id="sector_id" value={formData.sector_id} onChange={handleChange} disabled={!formData.city_id || sectors.length === 0} className="w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-primary-600 rounded-lg px-4 text-gray-900 outline-none appearance-none disabled:opacity-50">
                      <option value="" disabled>Selectionnez Votre annexe ...</option>
                      {sectors.map((sector) => ( <option key={sector.id} value={sector.id}>{sector.name} {sector.description ? `(${sector.description})` : ''}</option> ))}
                    </select>
                  </div>

                  <div className="mt-3 relative group">
                    <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Adresse exacte (Optionnel)</label>
                    <div className="relative">
                      <textarea id="adresse" rows="2" value={formData.adresse} onChange={handleChange} placeholder="Rue, N°..." className="w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-slate-700 focus:border-primary-600 rounded-lg px-10 text-gray-900 outline-none resize-none"></textarea>
                      <MapPin size={20} className="absolute left-3.5 top-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={prevStep} className="px-6 border border-gray-200 dark:border-slate-700 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800">Retour</button>
                  <button type="button" onClick={nextStep} disabled={!formData.sector_id} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
                    Suivant <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

             {step === 3 && (
              <div className="animate-fade-in flex flex-col h-full justify-between space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Sécurisation</h2>
                  <p className="text-sm text-gray-500 mb-6">Protégez votre compte citoyen.</p>

                  <div className="space-y-4">
                    <div className="space-y-1 relative group">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Email *</label>
                      <div className="relative">
                        <input type="email" id="email" value={formData.email} onChange={handleChange} required className={` ${fieldErrors.email ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 rounded-lg px-12 text-gray-900 outline-none resize-none `} />
                        <Mail size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1 relative group">
                      <label className="text-[10px] font-bold uppercase text-gray-400 ml-1">Mot de passe *</label>
                      <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={handleChange} required className={` ${fieldErrors.password ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600 rounded-lg px-12 text-gray-900 outline-none resize-none `} />
                        <Lock size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} /> }
                        </button>
                      </div>
                      
                      {formData.password.length > 0 && (
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                          <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-2">Votre mot de passe doit contenir :</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className={`flex items-center gap-1 ${pwdRules.length ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                              {pwdRules.length ? <Check size={14} /> : <X size={14} className="text-gray-400"/>} 8 caractères min
                            </div>
                            <div className={`flex items-center gap-1 ${pwdRules.upper ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                              {pwdRules.upper ? <Check size={14} /> : <X size={14} className="text-gray-400"/>} 1 Majuscule (A-Z)
                            </div>
                            <div className={`flex items-center gap-1 ${pwdRules.number ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                              {pwdRules.number ? <Check size={14} /> : <X size={14} className="text-gray-400"/>} 1 Chiffre (0-9)
                            </div>
                            <div className={`flex items-center gap-1 ${pwdRules.special ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                              {pwdRules.special ? <Check size={14} /> : <X size={14} className="text-gray-400"/>} 1 Spécial (@, +, !...)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input type="checkbox" id="terms" checked={formData.terms} onChange={handleChange} required className="mt-1 accent-orange-600 w-4 h-4 rounded cursor-pointer border-gray-300" />
                      <label htmlFor="terms" className="text-xs text-gray-500 leading-snug cursor-pointer select-none">
                        J'accepte les <a href="#" className="text-orange-600 font-bold hover:underline">conditions d'utilisation</a> de SafiPulse. *
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={prevStep} className="px-6 border border-gray-200 dark:border-slate-700 text-gray-500 font-bold py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800">Retour</button>
                  <button type="submit" disabled={loading || !isPasswordValid || !formData.terms} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? 'Création...' : 'Terminer'} <CheckCircle2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Déjà inscrit ? <Link to="/login" className="text-orange-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </main>
    </div>
  );
}