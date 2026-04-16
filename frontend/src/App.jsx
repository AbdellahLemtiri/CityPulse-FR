import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import NotFound from './components/404/NotFound';
import Welcome from './Welcome';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './Dashboard';
import HomeFeed from './citoyen/HomeFeed';
import SharedArticle from './citoyen/SharedArticle';
import Proposals from './citoyen/Proposals';
import Signalements from './citoyen/Signalements';
import PharmaciesGarde from './citoyen/PharmaciesGarde';
import Profil from './citoyen/Profil';
import JournalisteLayout from './components/layouts/JournalisteLayout';
import JournalisteEditor from './journaliste/JournalisteEditor';
import BaseLayout from './components/layouts/BaseLayout';
import ManagerLayout from './components/layouts/ManagerLayout';
import ManagerIncidents from './manager/ManagerIncidents';
import ManagerIdess from './manager/ManagerIdess';
import ManagerModeration from './manager/ManagerModeration';
import ManagerAlerts from './manager/ManagerAlerts';
import JournalisteArticles from './journaliste/JournalisteArticles';
import AddDutyPharmacy from './journaliste/JournalistPharmacyForm';
import ManagePharmacies from './journaliste/ManagePharmacies';
import AdminLayout from './components/layouts/AdminLayout';
import AdminMasterData from './admin/AdminMasterData';
import AdminStaff from './admin/AdminStaff';
import AdminBanMonitor from './admin/AdminBanMonitor';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
                <Route path="/article/:slug" element={<SharedArticle />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<BaseLayout />}>
          <Route index element={<Navigate to="/homefeed" replace />} />
          <Route path="/homefeed" element={<HomeFeed />} />
          <Route element={<ProtectedRoute allowedRoles={['citoyen']} />}>
            <Route path="/idees" element={<Proposals />} />
            <Route path="/signalements" element={<Signalements />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<Navigate to="masterdata" replace />} />
            <Route path="masterdata" element={<AdminMasterData />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="bans" element={<AdminBanMonitor />} />
          </Route>

          <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route index element={<Navigate to="incidents" replace />} />
            <Route path="incidents" element={<ManagerIncidents />} />
            <Route path="idees" element={<ManagerIdess />} />
            <Route path="moderation" element={<ManagerModeration />} />
          </Route>

          <Route path="/editor" element={<ProtectedRoute allowedRoles={['journaliste', 'manager']} />}>
            <Route index element={<Navigate to="rediger" replace />} />
            <Route path="rediger" element={<JournalisteEditor />} />
            <Route path="articles" element={<JournalisteArticles />} />
            <Route path="rediger/:slug" element={<JournalisteEditor />} />
            <Route path="pharmacies/create" element={<AddDutyPharmacy />} />
            <Route path="Pharmacies" element={<ManagePharmacies />} />
            <Route path="pharmacies/  /:id" element={<AddDutyPharmacy />} />
          </Route>

          <Route path="/profil" element={<Profil />} />
          <Route path="/pharmacies" element={<PharmaciesGarde />} />
        </Route>
      </Route>

      {/* <Route path="/editor" element={<ProtectedRoute allowedRoles={['journaliste']} />}>
        <Route element={<JournalisteLayout />}>
          <Route index element={<Navigate to="rediger" replace />} />
          <Route path="rediger" element={<JournalisteEditor />} />
          <Route path="articles" element={<JournalisteArticles />} />
        </Route>
      </Route> */}
      <Route path="*" element={<NotFound />} />
      <Route path="/404" element={<NotFound />} />
    </Routes>
  );
}

export default App;
