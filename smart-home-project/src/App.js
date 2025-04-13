import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import AuthPage from './pages/Auth/AuthPage';
import ModuleInformation from './pages/ModuleInformation/ModuleInformation';
import ModuleGestion from './pages/ModuleGestion/ModuleGestion';
import ModuleVisualisation from './pages/ModuleVisualisation/ModuleVisualisation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/module-information" element={<ModuleInformation />} />
        <Route path="/module-gestion" element={<ModuleGestion />} />
        <Route path="/module-visualisation" element={<ModuleVisualisation />} /> {/* New route */}
      </Routes>
    </Router>
  );
}

export default App;