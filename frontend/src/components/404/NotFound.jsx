import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center px-4">
<<<<<<< HEAD
      <div className="text-primary-500 font-extrabold text-9xl mb-4 animate-pulse">404</div>
      <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">Page Introuvable</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        Oups ! La page que vous cherchez n'existe pas ou vous n'avez pas l'autorisation d'y accéder sur la plateforme CityPulse.
      </p>
      <Link 
        to="/" 
        className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded uppercase text-sm shadow-lg transition-colors flex items-center gap-2"
=======
      <div className="text-blue-500 font-extrabold text-9xl mb-4 animate-pulse">404</div>
      <h1 className="text-4xl font-bold text-white mb-2 uppercase tracking-wider">Page Introuvable</h1>
      <p className="text-gray-400 mb-8 max-w-md">
        Oups ! La page que vous cherchez n'existe pas ou vous n'avez pas l'autorisation d'y accéder sur la plateforme SafiPulse.
      </p>
      <Link 
        to="/" 
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded uppercase text-sm shadow-lg transition-colors flex items-center gap-2"
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
      >
        <span className="material-symbols-outlined">home</span>
        Retour à l'accueil
      </Link>
    </div>
  );
}