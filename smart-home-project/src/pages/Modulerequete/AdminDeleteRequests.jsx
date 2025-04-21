// pages/ModuleAdministration/AdminDeleteRequests.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

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
                padding: '1rem',
                borderRadius: '10px',
                marginBottom: '1rem'
              }}>
                <p><strong>🔧 Objet ID:</strong> {req.item_id} <em>({req.item_type})</em></p>
                <p><strong>👤 Utilisateur ID:</strong> {req.user_id}</p>
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
                    fontWeight: 'bold'
                  }}
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
