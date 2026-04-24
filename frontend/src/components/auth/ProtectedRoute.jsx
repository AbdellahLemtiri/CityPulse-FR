import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from './../../contexts/ContextProvider';

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useStateContext();
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    console.warn(`Accès refusé: Le rôle '${user?.role}' n'a pas accès à cette page.`);
    return <Navigate to="/404" replace />;
  }
  return <Outlet />;
}
