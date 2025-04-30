// App.jsx
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import HomePage              from './pages/Home/HomePage';
import AuthPage              from './pages/Auth/AuthPage';
import ModuleInformation     from './pages/ModuleInformation/ModuleInformation';
import ModuleGestion         from './pages/ModuleGestion/ModuleGestion';
import ModuleVisualisation   from './pages/ModuleVisualisation/ModuleVisualisation';
import ModuleAdministration  from './pages/ModuleAdministration/ModuleAdministration';
import ProfilePage           from './pages/Profile/ProfilePage';
import UsersListPage         from './pages/UsersList/UsersListPage';

function App() {
  const stored = localStorage.getItem("user");
  const user   = stored ? JSON.parse(stored) : null;
  window.location.reload();

  const [validationMode, setValidationMode] = useState('Manuelle')

  const toggleValidationMode = () => {
    setValidationMode(m => m === 'Manuelle' ? 'Automatique' : 'Manuelle')
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/module-information" element={<ModuleInformation />} />

        {user && (
          <>
            {/* pour les simples débutants/intermédiaires */}
            {user.role === 'simple' && (user.niveau === 'debutant' || user.niveau === 'intermediaire') && (
              <Route
                path="/module-visualisation"
                element={
                  <ModuleVisualisation
                    validationMode={validationMode}
                  />
                }
              />
            )}

            {/* pour les complexes  */}
            {user.role === 'complexe' &&  (
              <>
                <Route
                  path="/module-visualisation"
                  element={
                    <ModuleVisualisation
                      validationMode={validationMode}
                    />
                  }
                />
                <Route
                  path="/module-gestion"
                  element={
                    <ModuleGestion
                      validationMode={validationMode}
                    />
                  }
                />
              </>
              
            )}

            {/* pour les admins  */}
            {user.role === 'admin' && (
              <>
                <Route
                  path="/module-visualisation"
                  element={
                    <ModuleVisualisation
                      validationMode={validationMode}
                    />
                  }
                />
                <Route
                  path="/module-gestion"
                  element={
                    <ModuleGestion
                      validationMode={validationMode}
                    />
                  }
                />
                <Route
                  path="/module-administration"
                  element={
                    <ModuleAdministration
                      validationMode={validationMode}
                      onToggleValidation={toggleValidationMode}
                    />
                  }
                />
              </>
            )}
          </>
        )}

        <Route path="/users" element={<UsersListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
