import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import OAuthSuccess from './pages/OAuthSuccess';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/dashboard" element={<div>Dashboard coming soon</div>} />
        {/* your other routes will go here later, e.g. /login, /dashboard */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;