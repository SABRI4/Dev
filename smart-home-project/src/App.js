import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import AuthPage from './pages/Auth/AuthPage';
import ModuleInformation from './pages/ModuleInformation/ModuleInformation'; // Importez la nouvelle page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/module-information" element={<ModuleInformation />} /> {/* Nouvelle route */}
      </Routes>
    </Router>
  );
}

export default App;