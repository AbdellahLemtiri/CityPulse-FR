import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from './../../contexts/ContextProvider';

export default function GuestRoute() {
  const { user } = useStateContext();  

   if (user) {
    return <Navigate to="/homefeed" replace />; 
   }
  return <Outlet />;  
}