import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axiosClient from './axios-client';
import { useStateContext } from './contexts/ContextProvider';

export default function Register() {
    const { token, setToken, setUser } = useStateContext();
    
    // هادي كتحكم فـ أي مرحلة حنا (1, 2, أو 3)
    const [step, setStep] = useState(1);
    
    // هادي كتجمع ڭاع المعلومات ديال المواطن فدقة وحدة
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        // هادو زايدين عندك فـ الديزاين، تقدر تزيدهم فـ Database من بعد
        cin: '', 
        telephone: '',
        quartier: '',
    });

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    // إلا كان ديجا مكونيكطي، يرجع لـ Dashboard
    if (token) return <Navigate to="/dashboard" />;

    // هاد الفانكشن كتشد أي حاجة تكتبات فـ Inputs وكتحطها فـ formData
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // باش ندوزو للمرحلة الجاية (مع تأكد خفيف)
    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    // هادي لي غاتصيفط الداتا لـ Laravel
    const onSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);

        axiosClient.post('/register', formData)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token); // شدينا الـ Token!
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors); // أخطاء ديال Laravel Validation
                }
            });
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* الديكور ديال اللور */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="w-full max-w-lg z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Safi<span className="text-orange-600">Pulse</span></h1>
                    <p className="text-slate-500 mt-2">Création de votre compte citoyen</p>
                </div>

                {/* Progress Bar (ساهلة بزاف فالفهم) */}
                <div className="mb-8">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                        <span className={step >= 1 ? "text-orange-600" : ""}>Identité</span>
                        <span className={step >= 2 ? "text-orange-600" : ""}>Localisation</span>
                        <span className={step >= 3 ? "text-orange-600" : ""}>Sécurité</span>
                    </div>
                    <div className="flex gap-2 h-1.5">
                        <div className={`flex-1 rounded-full transition-all ${step >= 1 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                        <div className={`flex-1 rounded-full transition-all ${step >= 2 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                        <div className={`flex-1 rounded-full transition-all ${step >= 3 ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    </div>
                </div>

                {/* أخطاء السيرفر */}
                {errors && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}

                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative">
                    <form onSubmit={onSubmit} className="flex flex-col min-h-[350px] justify-between">
                        
                        {/* ---------------- ÉTAPE 1 ---------------- */}
                        {step === 1 && (
                            <div className="animate-fade-in space-y-4">
                                <h2 className="text-2xl font-bold mb-4">Qui êtes-vous ?</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Prénom</label>
                                        <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-orange-500 mt-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nom</label>
                                        <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-orange-500 mt-1" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">CIN</label>
                                    <input type="text" id="cin" value={formData.cin} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-orange-500 mt-1" />
                                </div>
                                <button type="button" onClick={nextStep} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all mt-4">
                                    Suivant
                                </button>
                            </div>
                        )}

                        {/* ---------------- ÉTAPE 2 ---------------- */}
                        {step === 2 && (
                            <div className="animate-fade-in space-y-4">
                                <h2 className="text-2xl font-bold mb-4">Votre Secteur</h2>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Quartier</label>
                                    <select id="quartier" value={formData.quartier} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-orange-500 mt-1">
                                        <option value="" disabled>Choisir...</option>
                                        <option value="Plateau">Plateau</option>
                                        <option value="Jrifat">Jrifat</option>
                                        <option value="Sidi Bouzid">Sidi Bouzid</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={prevStep} className="px-6 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold py-3.5 rounded-xl">Retour</button>
                                    <button type="button" onClick={nextStep} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all">Suivant</button>
                                </div>
                            </div>
                        )}

                        {/* ---------------- ÉTAPE 3 ---------------- */}
                        {step === 3 && (
                            <div className="animate-fade-in space-y-4">
                                <h2 className="text-2xl font-bold mb-4">Sécurisation</h2>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleChange} required className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-orange-500 mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mot de passe</label>
                                    <input type="password" id="password" value={formData.password} onChange={handleChange} required minLength="8" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 outline-none focus:border-orange-500 mt-1" />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={prevStep} className="px-6 border border-slate-200 dark:border-slate-700 text-slate-500 font-bold py-3.5 rounded-xl">Retour</button>
                                    <button type="submit" disabled={loading} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl transition-all">
                                        {loading ? 'Création...' : 'Terminer'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Déjà inscrit ? <Link to="/login" className="text-orange-600 font-bold hover:underline">Se connecter</Link>
                </p>
            </div>
        </div>
    );
}