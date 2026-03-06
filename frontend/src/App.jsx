import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';  
import Login from './Login';
import Register from './Register'; 
import Dashboard from './Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />  
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> 
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;