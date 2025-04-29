import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function UsersListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3020/plateforme/smart-home-project/api/get_users.php', {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.status === 'success') {
          setUsers(data.users);
        } else {
          setError(data.message || 'Erreur lors de la récupération des utilisateurs');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleNavigateHome = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '2rem',
    position: 'relative',
    opacity: isNavigating ? 0 : 1,
    transition: 'opacity 0.5s ease'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(5px)',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '2.5rem',
    borderRadius: '15px',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)'
  };

  const userCardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      <div style={overlayStyle} />

      <Link
        to="/"
        onClick={handleNavigateHome}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 3,
          textDecoration: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(211, 84, 0, 0.7)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
      >
        <span style={{ marginRight: '5px', fontSize: '20px' }}>&#8592;</span>
        <span>Retour à l'accueil</span>
      </Link>

      <div style={contentStyle}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#D35400', 
          marginBottom: '2.5rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Liste des Utilisateurs
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#666' }}>Chargement des utilisateurs...</p>
          </div>
        ) : error ? (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '1rem', 
            marginBottom: '2rem', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        ) : (
          <div>
            {users.map(user => (
              <div 
                key={user.id}
                style={{
                  ...userCardStyle,
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <img
                  src={user.photo || 'https://via.placeholder.com/100'}
                  alt={`${user.username}'s profile`}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #D35400'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 0.5rem 0', 
                    color: '#D35400',
                    fontSize: '1.2rem'
                  }}>
                    {user.username}
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem'
                  }}>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Âge:</strong> {user.age} ans
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Genre:</strong> {user.gender}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Date de naissance:</strong> {new Date(user.birthdate).toLocaleDateString('fr-FR')}
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                      <strong>Type de membre:</strong> {user.member_type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersListPage; 