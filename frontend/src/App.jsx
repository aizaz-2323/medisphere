import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OAuthSuccess from './pages/OAuthSuccess';
import Dashboard from './pages/Dashboard';
import DoctorProfile from './pages/DoctorProfile';
import ClinicBuilder from './pages/ClinicBuilder';
import ClinicAvailability from './pages/ClinicAvailability';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/clinic-builder" element={<ClinicBuilder />} />
        <Route path="/clinic-availability" element={<ClinicAvailability />} />
        {/* your other routes will go here later, e.g. /login, /dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;