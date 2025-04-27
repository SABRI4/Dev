// pages/ModuleAdministration/AdminDeleteRequests.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

// Ajouter les icônes de périphériques
const DeviceIcons = {
  thermostat: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M12,22c-4.418,0-8-3.582-8-8c0-3.584,2.385-6.615,5.649-7.605C9.879,6.266,10,6.133,10,6V3c0-0.552,0.448-1,1-1h2 c0.552,0,1,0.448,1,1v3c0,0.133,0.121,0.266,0.351,0.395C17.615,7.385,20,10.416,20,14C20,18.418,16.418,22,12,22z M13,4h-2v2h2V4z M12,20c3.314,0,6-2.686,6-6c0-3.314-2.686-6-6-6s-6,2.686-6,6C6,17.314,8.686,20,12,20z M11,14.732V10c0-0.552,0.448-1,1-1 s1,0.448,1,1v4.732c0.616,0.357,1,1.025,1,1.768c0,1.105-0.895,2-2,2s-2-0.895-2-2C10,15.757,10.384,15.089,11,14.732z"/>
    </svg>
  ),
  climatiseur: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M21,9h-7V7c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v2H3C2.45,9,2,9.45,2,10v4c0,0.55,0.45,1,1,1h7v2c0,0.55,0.45,1,1,1h2 c0.55,0,1-0.45,1-1v-2h7c0.55,0,1-0.45,1-1v-4C22,9.45,21.55,9,21,9z"/>
    </svg>
  ),
  volets: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M19,4H5C3.89,4,3,4.9,3,6v12c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z"/>
    </svg>
  ),
  lumière: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M12,2C8.13,2,5,5.13,5,9c0,2.38,1.19,4.47,3,5.74V17c0,0.55,0.45,1,1,1h1v2c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-2h1 c0.55,0,1-0.45,1-1v-2.26c1.81-1.27,3-3.36,3-5.74C19,5.13,15.87,2,12,2z"/>
    </svg>
  ),
  sécurité: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z"/>
    </svg>
  ),
  météo: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13 c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z"/>
    </svg>
  )
};

const getDeviceIcon = (type) => {
  return DeviceIcons[type] || (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="#FFFFFF">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
};

function AdminDeleteRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3020/plateforme/smart-home-project/api/deleteRequest.php';
  const VALIDATE_URL = 'http://localhost:3020/plateforme/smart-home-project/api/validateDelete.php';

  useEffect(() => {
    fetch(API_URL, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setRequests(data.requests);
        } else {
          setError(data.message || 'Erreur inconnue');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur réseau');
        setLoading(false);
      });
  }, []);

  const handleValidate = async (requestId) => {
    try {
      const res = await fetch(VALIDATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ request_id: requestId }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setRequests(prev => prev.filter(r => r.id !== requestId));
        alert('Suppression effectuée');
      } else {
        alert(data.message || 'Erreur lors de la validation');
      }
    } catch {
      alert('Erreur réseau');
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        padding: '2rem',
        color: '#fff'
      }}
    >
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '2rem',
        borderRadius: '15px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ textAlign: 'center' }}>🛠️ Demandes de suppression</h2>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498DB',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            ⬅️ Retour à l'accueil
          </button>
        </div>

        {loading ? (
          <p>Chargement des demandes...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : requests.length === 0 ? (
          <p style={{ textAlign: 'center' }}>✅ Aucune demande en attente.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {requests.map(req => (
              <li key={req.id} style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '1.5rem',
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                  <div style={{
                    backgroundColor: '#D35400',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px'
                  }}>
                    {getDeviceIcon(req.item_type)}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Objet à supprimer:</h3>
                    <p style={{ margin: '0.2rem 0' }}>
                      <strong>ID:</strong> {req.item_id}
                      <span style={{ color: '#bbb' }}> ({req.item_type})</span>
                    </p>
                    <p style={{ margin: '0.2rem 0' }}>
                      <strong>Nom:</strong> {req.item_name}
                    </p>
                    <p style={{ margin: '0.2rem 0' }}>
                      <strong>Pièce:</strong> {req.item_room}
                    </p>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Demandeur:</h3>
                  <p style={{ margin: '0.2rem 0' }}>
                    <strong>ID:</strong> {req.user_id}
                  </p>
                  <p style={{ margin: '0.2rem 0' }}>
                    <strong>Nom complet:</strong> {req.user_firstname} {req.user_lastname}
                  </p>
                  <p style={{ margin: '0.2rem 0' }}>
                    <strong>Nom d'utilisateur:</strong> {req.username}
                  </p>
                  <p style={{ margin: '0.2rem 0' }}>
                    <strong>Rôle:</strong> {req.user_role} 
                    <span style={{ color: '#bbb' }}> (Niveau {req.user_level})</span>
                  </p>
                </div>

                <button
                  onClick={() => handleValidate(req.id)}
                  style={{
                    marginTop: '0.5rem',
                    backgroundColor: '#E74C3C',
                    color: 'white',
                    padding: '8px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#C0392B'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#E74C3C'}
                >
                  🗑️ Valider la suppression
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDeleteRequests;
