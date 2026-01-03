import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WhatsAppLogin from './pages/WhatsAppLogin';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Kas from './pages/Kas';
import Members from './pages/Members';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/whatsapp-login" replace />} />
        <Route path="/whatsapp-login" element={<WhatsAppLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/kas" element={<Kas />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </Router>
  );
}

export default App
