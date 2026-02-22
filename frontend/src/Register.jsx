import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axiosClient from './axios-client';
import { useStateContext } from './contexts/ContextProvider';

export default function Register() {
    const { token, setToken, setUser } = useStateContext();
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '', cin: '', telephone: '', quartier: '',
    });

    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div></div>
    );
}
const handleChange = (event) => {
    setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: event.target.value,
    }));
};

const nextStep = () => setStep((prevState) => prevState + 1);
const prevStep = () => setStep((prevState) => prevState - 1);
/*************  ✨ Smart Paste 📚  *************/
/*******  be4f8d33-76a6-44e1-8a1f-45dc62e9feb7  *******/
const handleSubmit = (event) => {
    event.preventDefault();
    nextStep();
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    nextStep();
};


/*************  ✨ Smart Paste 📚  *************/
/*******  33aee643-56ac-44bf-af6d-fe08f01a414d  *******/
const onSubmit = (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);

        axiosClient.post('/register', formData)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.access_token);
            })
            .catch(err => {
                setLoading(false);
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            });
    };return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="w-full max-w-lg z-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Safi<span className="text-orange-600">Pulse</span></h1>
                    <p className="text-slate-500 mt-2">Création de votre compte citoyen</p>
                </div>
                
                {/* hnaya ghadi nzidou lbaqi */}
            </div>
        </div>
    );
<div className="mb-8">
    <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
        {[1, 2, 3].map((stepNumber, index) => (
            <span key={index} className={step >= stepNumber ? "text-orange-600" : ""}>
                {index === 0 ? "Identité" : index === 1 ? "Localisation" : "Sécurité"}
            </span>
        ))}
    </div>
    <div className="flex gap-2 h-1.5">
        {[1, 2, 3].map((stepNumber, index) => (
            <div key={index} className={`flex-1 rounded-full transition-all ${step >= stepNumber ? "bg-orange-600" : "bg-slate-200 dark:bg-slate-800"}`}></div>
        ))}
    </div>
</div>
/*************  ✨ Smart Paste 📚  *************/
/*******  1f0d39c7-4241-493d-a328-a4501869ae9e  *******/{errors && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-4">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}<div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative">
                    <form onSubmit={onSubmit} className="flex flex-col min-h-[350px] justify-between">
                        
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
                        
                    </form>
                </div>{step === 2 && (
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
                        )}{step === 3 && (
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