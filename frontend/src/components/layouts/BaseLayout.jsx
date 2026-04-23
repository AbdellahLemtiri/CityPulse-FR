import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../config/axios-client';
import Sidebar from '../navigation/Sidebar';
import TopHeader from '../navigation/TopHeader';
import BottomNav from '../navigation/BottomNav';
import { Toaster } from 'react-hot-toast';

export default function BaseLayout() {
  const location = useLocation();
<<<<<<< HEAD
  const { user, isCheckingAuth } = useStateContext();
=======
  const { user, setUser } = useStateContext();
  const [loading, setLoading] = useState(false);
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8

  const wideRoutes = ['/journaliste/rediger', '/manager/idees', 'manager/incidents', 'manager/alertes', 'manager/moderation', 'journaliste/articles', 'manager/rediger', 'manager/articles', 'admin/masterdata', '/admin/staff', '/admin/bans', 'editor/articles', 'editor/rediger', 'editor/gererPharmacies', 'editor/pharmacies', '/editor/Pharmacies', '/editor/pharmacies/create'];

  const isWideRoute = wideRoutes.some((route) => location.pathname.includes(route));
<<<<<<< HEAD
  const containerMaxWidth = isWideRoute ? 'max-w-7xl' : 'max-w-3xl';

  if (isCheckingAuth) {
=======
  const containerMaxWidth = isWideRoute ? 'max-w-7xl' : 'max-w-2xl';
  console.log('helo');

  useEffect(() => {
    if (!user) {
      console.log('ok');
     setLoading(true);
      axiosClient
        .get('/user')
        .then(({ data }) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
<<<<<<< HEAD
  } 
   if (!user && !isCheckingAuth) {
=======
  }

  if (!user) {
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans h-screen flex overflow-hidden transition-colors">
      <Sidebar />

      <main id="main-container" className="flex-1 h-full overflow-y-auto relative no-scrollbar md:ml-72">
        <TopHeader />
        <div id="app-content" className={`${containerMaxWidth} mx-auto p-4 md:p-8 pb-24 md:pb-8 transition-all`}>
          <Toaster position="top-center" />
<<<<<<< HEAD
          <Outlet />
=======
          <Outlet /> 
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
