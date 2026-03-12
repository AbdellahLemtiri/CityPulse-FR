import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './Welcome';  
import Login from './Login';
import Register from './Register'; 
import Dashboard from './Dashboard';
import SafiGram from './citoyen/SafiGram';
import HomeFeed from './citoyen/HomeFeed';
import CitoyenLayout from './components/layouts/CitoyenLayout';

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
        {/* <Route path="/profil" element={<Profil />} /> */}
      </Route>

    </Routes>
  );
}

export default App;