import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from './../../contexts/ContextProvider';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useStateContext();
<<<<<<< HEAD
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn(`Accès refusé: Le rôle '${user?.role}' n'a pas accès à cette page.`);
=======

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(`Accès refusé: Le rôle '${user.role}' n'a pas accès à cette page.`);
>>>>>>> 2d33e1a36791c1f8586616795c6c96920fc697e8
    return <Navigate to="/404" replace />;
  }
  return <Outlet />;
}
