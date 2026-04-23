import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axiosClient from '../config/axios-client';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: "L'adresse email est requise." });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await axiosClient.post('/forgot-password', { email });

      toast.success('Code envoyé à votre email !');
      setStep(2);
    } catch (error) {
      setErrors({ email: 'Email introuvable.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      setErrors({ code: 'Le code doit contenir 6 chiffres.' });
      return;
    }
    setIsLoading(true);
    setErrors({});

    try {
      await axiosClient.post('/verify-reset-code', { email, code });
      toast.success('Code vérifié avec succès !');

      setStep(3);
    } catch (error) {
      setErrors({ code: 'Code invalide ou expiré.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setErrors({ password: 'Les mots de passe ne correspondent pas.' });
      return;
    }

    setIsLoading(true);
    setErrors({});

    console.log('74 line');

    try {
      await axiosClient.post('/reset-password', { email, code, password, password_confirmation: passwordConfirmation });
      console.log('74 line');
      toast.success('Mot de passe modifié ! Connectez-vous.');
      navigate('/login');
    } catch (error) {
      console.log(error);

      toast.error('Erreur lors de la modification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-white">
      <div className="absolute top-0 left-0 w-full h-64 pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-slate-800 p-8 md:p-10 relative z-10 shadow-sm">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            City<span className="text-[#EA580C]">Pulse</span>
          </h1>
          <h2 className="text-xl font-bold mt-4">Mot de passe oublié ?</h2>
          <p className="text-gray-400 text-sm mt-2">
            {step === 1 && 'Entrez votre email pour recevoir un code de réinitialisation.'}
            {step === 2 && 'Entrez le code à 6 chiffres envoyé à votre email.'}
            {step === 3 && 'Créez votre nouveau mot de passe sécurisé.'}
          </p>
        </div>

        <Toaster position="top-center" />

        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Identifiant (Email)</label>
              <div className="relative group">
                <input type="email" placeholder="exemple@domaine.com" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 focus:border-[#EA580C] dark:focus:border-[#EA580C] rounded-lg px-12 text-gray-900 outline-none transition-colors ${errors.email ? 'border-red-600' : 'border-gray-200 dark:border-gray-600'}`} />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.email && <div className="text-red-600 text-xs ml-1 mt-1">{errors.email}</div>}
            </div>

            <div className="mt-8 flex justify-center items-center">
              <button type="submit" disabled={isLoading} className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Envoyer le code'}
                {!isLoading && <ArrowRight size={20} />}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Code de vérification</label>
              <div className="relative group">
                <input type="text" maxLength="6" placeholder="123456" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} className={`w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 focus:border-[#EA580C] dark:focus:border-[#EA580C] rounded-lg px-12 text-gray-900 text-center text-xl tracking-[0.5em] font-bold outline-none transition-colors ${errors.code ? 'border-red-600' : 'border-gray-200 dark:border-gray-600'}`} />
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.code && <div className="text-red-600 text-xs text-center mt-1">{errors.code}</div>}
            </div>

            <div className="mt-8 flex justify-center items-center">
              <button type="submit" disabled={isLoading} className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Vérifier le code'}
              </button>
            </div>

            <button type="button" onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-500 hover:text-[#EA580C] mt-4">
              Changer d'adresse email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Nouveau mot de passe</label>
              <div className="relative group">
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 focus:border-[#EA580C] rounded-lg px-12 text-gray-900 outline-none transition-colors ${errors.password ? 'border-red-600' : 'border-gray-200 dark:border-gray-600'}`} />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="space-y-1 mt-4">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Confirmer le mot de passe</label>
              <div className="relative group">
                <input type="password" placeholder="••••••••" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className={`w-full bg-gray-50 py-3 dark:text-white border dark:bg-slate-800 focus:border-[#EA580C] rounded-lg px-12 text-gray-900 outline-none transition-colors ${errors.password ? 'border-red-600' : 'border-gray-200 dark:border-gray-600'}`} />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {errors.password && <div className="text-red-600 text-xs ml-1 mt-1">{errors.password}</div>}
            </div>

            <div className="mt-8 flex justify-center items-center">
              <button type="submit" disabled={isLoading} className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Enregistrer'}
                {!isLoading && <CheckCircle size={20} />}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
          <Link to="/login" className="text-sm text-gray-500 flex items-center justify-center gap-2 hover:text-[#EA580C] transition-colors">
            <ArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
