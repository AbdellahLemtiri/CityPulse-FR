import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', global: '' });
  const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

   const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
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
    let newErrors = { email: '', password: '', global: '' };
    let isValid = true;

     if (!email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Format d'email invalide";
      isValid = false;
    }

    // Password validation
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
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email,
          password,
        });
  
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
  
        navigate('/');
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            global: 'Identifiants incorrects (Email ou mot de passe)',
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            global: 'Erreur de connexion serveur. Réessayez plus tard.',
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-4 relative overflow-x-hidden bg-[#F8FAFC] dark:bg-[#020617] text-[#0F172A] dark:text-white transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#EA580C]/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 p-8 md:p-10 relative z-10 animate-[fadeInUp_0.5s_ease-out]">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#EA580C] to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30 text-white">
            <span className="material-symbols-outlined text-3xl">waves</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bienvenue sur <span className="text-[#EA580C]">SafiPulse</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Votre portail citoyen intelligent.</p>
        </div>

        {/* Global error message */}
        {errors.global && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-200 text-red-700 text-sm text-center">
            {errors.global}
          </div>
        )}

         <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-1 uppercase">
              Identifiant (Email)
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="exemple@domaine.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className={`w-full bg-gray-50 dark:bg-slate-800 border ${
                  errors.email ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'
                } text-gray-900 dark:text-white rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/50 transition-all font-medium`}
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EA580C] transition-colors">
                mail
              </span>
            </div>
            {errors.email && <div className="text-red-600 text-xs ml-1 mt-1">{errors.email}</div>}
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                Mot de passe
              </label>
              <a href="#" className="text-xs font-bold text-[#EA580C] hover:underline">
                Oublié ?
              </a>
            </div>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-gray-50 dark:bg-slate-800 border ${
                  errors.password ? 'border-red-600' : 'border-gray-200 dark:border-slate-700'
                } text-gray-900 dark:text-white rounded-xl py-3.5 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-[#EA580C]/50 transition-all font-medium`}
              />
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EA580C] transition-colors">
                lock
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EA580C] transition"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {errors.password && (
              <div className="text-red-600 text-xs ml-1 mt-1">{errors.password}</div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#EA580C] hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-orange-500/20 transition-transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion...' : 'Se Connecter'}
            {!isLoading && <span className="material-symbols-outlined text-sm">login</span>}
          </button>
        </form>

        {/* Footer with register link */}
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