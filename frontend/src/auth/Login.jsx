import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, UserKey, DoorOpen } from 'lucide-react';
import Logo  from '../components/logos/logo'; 
import axiosClient from './../config/axios-client';
import { useStateContext } from './../contexts/ContextProvider';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useStateContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailBlur = () => {
    if (email.trim() && !validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Format d'email invalide" }));
    } else if (email.trim()) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Veuillez entrer votre mot de passe';
      isValid = false;
    } else if (!validatePassword(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await axiosClient.post('/login', {
        email: email,
        password: password,
      });
      localStorage.setItem('ACCESS_TOKEN', response.data.token);

      setUser(response.data.user);
      toast.success('Connexion effectuée avec succès !');
      navigate('/homefeed');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          toast.error('Identifiants incorrects (Email ou mot de passe)');
        } else if (err.response.status === 422) {
          toast.error('Veuillez vérifier les informations saisies.');
        } else if (err.response.status >= 500) {
          toast.error('Erreur Serveur. Notre équipe est sur le coup !');
        }
      } else {
        toast.error('Erreur réseau. Vérifiez votre connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-white ">
      <div className="absolute top-0 left-0 w-full h-64  pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg 2xl border border-gray-100 dark:border-slate-800 p-8 md:p-10 relative z-10  ">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Bienvenue 
         
          </h1>    <div className="p-6 flex items-center justify-center border-b border-transparent dark:border-gray-800/50">
         <Logo className="w-40 h-auto drop-shadow-sm" />
         
      </div>
          <p className="text-gray-400 text-sm mt-2">Votre portail citoyen intelligent.</p>
        </div>

        <Toaster />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">Identifiant (Email)</label>
            <div className="relative group">
              <input type="text" placeholder="exemple@domaine.com" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} className={`  ${errors.email ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'} w-full bg-gray-50 py-3   dark:text-white  border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600  rounded-lg px-12   text-gray-900 dark:text-white outline-none resize-none `} />
              <Mail className="  absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400  " />
            </div>
            {errors.email && <div className="text-red-600 text-xs ml-1 mt-1">{errors.email}</div>}
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Mot de passe</label>
            </div>
            <div className="relative group">
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`  ${errors.password ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'}  w-full bg-gray-50 py-3  dark:text-white  border dark:bg-slate-800 border-gray-200 dark:border-gray-600 focus:border-primary-600 dark:focus:border-primary-600  rounded-lg px-12   text-gray-900 dark:text-white outline-none resize-none`} />
              <UserKey className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400  ">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <div className="text-red-600 text-xs ml-1 mt-1">{errors.password}</div>}
          </div>
          <div className="mt-8 flex justify-center items-center">
            <button type="submit" disabled={isLoading} className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-3  rounded-lg shadow-lg shadow-orange-500/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2   disabled:opacity-70 disabled:cursor-not-allowed ">
              {isLoading ? (
                <div className="flex justify-center  ">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                'Se Connecter'
              )}
              {!isLoading && <DoorOpen />}
            </button>
          </div>{' '}
        </form>
        <p className="text-sm mt-3 text-gray-500">
          <Link to="/forgotPassword" className="text-[#EA580C] font-bold hover:underline ml-1">
            mot de pass oublie ?
          </Link>
        </p>
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-sm text-gray-500">
            Nouveau citoyen ?
            <Link to="/register" className="text-[#EA580C] font-bold hover:underline ml-1">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
