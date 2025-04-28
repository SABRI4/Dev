import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import AuthPage from './pages/Auth/AuthPage';
import ModuleInformation from './pages/ModuleInformation/ModuleInformation';
import ModuleGestion from './pages/ModuleGestion/ModuleGestion';
import AdminDeleteRequests from './pages/Modulerequete/AdminDeleteRequests.jsx';
import ModuleVisualisation from './pages/ModuleVisualisation/ModuleVisualisation';
import ModuleAdministration from './pages/ModuleAdministration/ModuleAdministration';
import ProfilePage from './pages/Profile/ProfilePage';

function App() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Accessible à tout le monde */}
        <Route path="/module-information" element={<ModuleInformation />} />

        {/* Accessible SEULEMENT si connecté */}
        {user && (
          <>
            {/* Accessible aux utilisateurs simples (débutant ou intermédiaire) */}
            {(user.role === 'simple' && (user.niveau === 'debutant' || user.niveau === 'intermediaire')) && (
              <Route path="/module-visualisation" element={<ModuleVisualisation />} />
            )}

            {/* Accessible aux utilisateurs complexes (niveau avancé) */}
            {(user.role === 'complexe' && user.niveau === 'avance') && (
              <>
                <Route path="/module-visualisation" element={<ModuleVisualisation />} />
                <Route path="/module-gestion" element={<ModuleGestion />} />
              </>
            )}

            {/* Accessible aux administrateurs (niveau expert) */}
            {(user.role === 'admin' && user.niveau === 'expert') && (
              <>
                <Route path="/module-visualisation" element={<ModuleVisualisation />} />
                <Route path="/module-gestion" element={<ModuleGestion />} />
                <Route path="/module-administration" element={<ModuleAdministration />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
