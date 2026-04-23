import { useState, useEffect } from 'react';
import axiosClient from '../config/axios-client';
<<<<<<< HEAD
import { Pill, MapPin, Phone, Map,Moon, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

 
function PharmacyCard({ pharmacy }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const end = dayjs(pharmacy.end_date);
      const difference = end.diff(now); 

      if (difference <= 0) {
        setTimeLeft('Fermé');
      } else {
        const d = dayjs.duration(difference);
        const hours = String(d.hours()).padStart(2, '0');
        const minutes = String(d.minutes()).padStart(2, '0');
        const seconds = String(d.seconds()).padStart(2, '0');
        
        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    };

    calculateTimeLeft(); 
    const timer = setInterval(calculateTimeLeft, 1000);  

     return () => clearInterval(timer);
  }, [pharmacy.end_date]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
      
      <div className="space-y-3 mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{pharmacy.name}</h3>
         <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
          <MapPin size={16} className="mt-1 flex-shrink-0 text-gray-400" />
          {pharmacy.address}
        </p>
        
         <p className={`text-sm font-bold flex items-center gap-2 ${timeLeft === 'Fermé' ? 'text-red-500' : 'text-orange-500'}`}>
          <Clock size={16} />
          {timeLeft === 'Fermé' ? 'Garde terminée' : `Ferme dans : ${timeLeft}`}
        </p>
      </div>

       <div className="flex gap-2">

      <span  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm"> 
        {pharmacy.phone}
        </span>
          <a href={`tel:${pharmacy.phone}`} className="flex-1 bg-primary-600 dark:bg-primary-600 text-white dark:text-primary-400 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors text-sm">
          <Phone size={16} /> Appeler
        </a>

       
        {pharmacy.location_url && (
          <a href={pharmacy.location_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors text-sm">
            <Map size={16} /> Y aller
          </a>
        )}


      </div>
    </div>
  );
}
=======
import { Pill, MapPin, Phone, Map, Clock } from 'lucide-react';
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8

export default function PharmaciesGarde() {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const response = await axiosClient.get('/duty-pharmacies');
      setPharmacies(response.data);
    } catch (error) {
<<<<<<< HEAD
      console.error('Erreur:', error);
=======
      console.error('Erreur chargement pharmacies', error);
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  return (
    <div className="  mx-auto p-4 md:p-6 pb-24">
       <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
          <Moon size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold  ">Pharmacies de Garde</h2>
          <p className="text-sm text-gray-500">Disponibles en ce moment</p>
        </div>
      </div>

       {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Aucune pharmacie de garde pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {pharmacies.map((pharmacy) => (
            <PharmacyCard key={pharmacy.id} pharmacy={pharmacy} />
=======
  // if (loading) {
  //   return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  // }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
          <Pill size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pharmacies de Garde</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Disponibles en ce moment dans votre ville</p>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ):pharmacies.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Aucune pharmacie de garde enregistrée pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {pharmacy.name}
              </h3>

              <div className="space-y-2 mb-5">
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                  {pharmacy.address}
                </p>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${pharmacy.phone}`} className="flex-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-100 transition-colors text-sm">
                  <Phone size={16} />
                  {pharmacy.phone}
                </a>

                {pharmacy.location_url && (
                  <a href={pharmacy.location_url} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                    <Map size={16} />Y aller
                  </a>
                )}
              </div>
            </div>
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
          ))}
        </div>
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
