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
/*******  1f0d39c7-4241-493d-a328-a4501869ae9e  *******/