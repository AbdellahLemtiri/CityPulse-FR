import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './Welcome';  
import Login from './Login';
import Register from './Register'; 
import Dashboard from './Dashboard';
import SafiGram from './citoyen/SafiGram';
import HomeFeed from './citoyen/HomeFeed';
import Agenda from './citoyen/Agenda';
import Signalements from './citoyen/Signalements';
import Profil from './citoyen/Profil';import JournalisteLayout from './components/layouts/JournalisteLayout';
import JournalisteEditor from './journaliste/JournalisteEditor';
import CitoyenLayout from './components/layouts/CitoyenLayout';
import  ManagerLayout from './components/layouts/ManagerLayout';
import ManagerIncidents  from './manager/ManagerIncidents';
import ManagerEvents from './manager/ManagerEvents';import ManagerModeration from './manager/ManagerModeration';
import ManagerAlerts from './manager/ManagerAlerts';
import JournalisteArticles from './journaliste/JournalisteArticles';import AdminLayout from './components/layouts/AdminLayout';
import AdminMasterData from './admin/AdminMasterData';import AdminStaff from './admin/AdminStaff';import AdminBanMonitor from './admin/AdminBanMonitor';
import AdminSystem from './admin/AdminSystem';
function App() {
  return (
    <Routes>
      {/* Routes Publiques */}
      <Route path="/" element={<Welcome />} />  
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
       
      {/* Route de l'Espace Citoyen (Layout Parent) */}
     <Route  element={<CitoyenLayout />}>
         <Route path="/safigram" element={<SafiGram />} />
        
        <Route path="/homefeed" element={<HomeFeed />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/signalements" element={<Signalements />} />
        <Route path="/profil" element={<Profil />} /> 
      </Route>

     <Route path="/manager" element={<ManagerLayout />}>
        {/* Redirect nishan l-incidents ila dkhl l /manager */}
        <Route index element={<Navigate to="incidents" replace />} />
        <Route path="evenements" element={<ManagerEvents />} />
<Route path="alertes" element={<ManagerAlerts />} /><Route path="moderation" element={<ManagerModeration />} />
        {/* Hna ghadi n-zidou les pages dial l-manager whda b whda */}
        <Route path="incidents" element={<ManagerIncidents />} />
      </Route>


      <Route path="/journaliste" element={<JournalisteLayout />}>
        <Route index element={<Navigate to="rediger" replace />} />
        <Route path="rediger" element={<JournalisteEditor />} />
        <Route path="articles" element={<JournalisteArticles />} />
        {/* <Route path="articles" element={<JournalisteArticles />} /> Hadi n-sayboha mn b3d */}
      </Route><Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Navigate to="masterdata" replace />} />
  <Route path="masterdata" element={<AdminMasterData />} /><Route path="staff" element={<AdminStaff />} /><Route path="bans" element={<AdminBanMonitor />} />
<Route path="systeme" element={<AdminSystem />} />
  {/* <Route path="staff" element={<AdminStaff />} /> */}
</Route>
     </Routes>
  );
}

export default App;