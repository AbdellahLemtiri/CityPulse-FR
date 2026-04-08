import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './Welcome';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './Dashboard';
import HomeFeed from './citoyen/HomeFeed';
import Proposals from './citoyen/Proposals';
import Signalements from './citoyen/Signalements';
import Pharmacy from './citoyen/pharmacy';
import Profil from './citoyen/Profil';
import JournalisteLayout from './components/layouts/JournalisteLayout';
import JournalisteEditor from './journaliste/JournalisteEditor';
import CitoyenLayout from './components/layouts/CitoyenLayout';
import ManagerLayout from './components/layouts/ManagerLayout';
import ManagerIncidents from './manager/ManagerIncidents';
import ManagerEvents from './manager/ManagerEvents';
import ManagerModeration from './manager/ManagerModeration';
import ManagerAlerts from './manager/ManagerAlerts';
import JournalisteArticles from './journaliste/JournalisteArticles';
import AdminLayout from './components/layouts/AdminLayout';
import AdminMasterData from './admin/AdminMasterData';
import AdminStaff from './admin/AdminStaff';
import AdminBanMonitor from './admin/AdminBanMonitor';
 function App() {
  return (
    <Routes>
       <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

       <Route element={<CitoyenLayout />}>
        <Route index element={<Navigate to="/homefeed" replace />} />
        <Route path="/homefeed" element={<HomeFeed />} />
        <Route path="/idees" element={<Proposals />} />
        <Route path="/signalements" element={<Signalements />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/parmacy" element={<Pharmacy />} />
      </Route>

      <Route path="/manager"  element={<ManagerLayout />}>
        <Route index element={<Navigate to="incidents" replace />} />
        <Route path="evenements" element={<ManagerEvents />} />
        <Route path="alertes" element={<ManagerAlerts />} />
        <Route path="moderation" element={<ManagerModeration />} />
        <Route path="incidents" element={<ManagerIncidents />} />
      </Route>

      <Route path="/journaliste" element={<JournalisteLayout />}>
        <Route index element={<Navigate to="rediger" replace />} />
        <Route path="rediger" element={<JournalisteEditor />} />
        <Route path="articles" element={<JournalisteArticles />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="masterdata" replace />} />
        <Route path="masterdata" element={<AdminMasterData />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="bans" element={<AdminBanMonitor />} />
       </Route>
    </Routes>
  );
}

export default App;
