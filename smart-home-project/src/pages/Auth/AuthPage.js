import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function AuthPage() {
  const navigate = useNavigate();
  
  // État pour suivre si nous sommes en mode inscription ou connexion
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // États pour les animations
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);

  // Animation d'entrée au chargement de la page
  useEffect(() => {
    // Court délai pour laisser le DOM se charger
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fonction pour basculer entre inscription et connexion
  const handleToggle = () => {
    setIsAnimating(true);
    // Délai pour permettre à l'animation de se produire avant de changer l'état
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsAnimating(false);
    }, 300);
  };

  // Fonction pour retourner à l'accueil avec transition
  const handleNavigateHome = (e) => {
    e.preventDefault();
    setIsNavigatingHome(true);
    
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignUp ? 'Inscription' : 'Connexion', { email, password, username });
  };

  // Style de la page entière (avec animation d'entrée/sortie)
  const pageStyle = {
    position: 'relative',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isNavigatingHome ? 0 : (isPageVisible ? 1 : 0),
    transition: 'opacity 0.5s ease'
  };

  // Styles pour l'animation de transition entre les formulaires
  const formStyle = {
    width: '400px',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    background: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    opacity: isAnimating ? 0 : 1,
    transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
    backdropFilter: 'blur(5px)',
  };

  // Style des boutons
  const buttonStyle = {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#D35400',
    border: '2px solid #D35400',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  };
  
  // Style des champs
  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #e0e0e0',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
    backgroundColor: 'white'
  };
  
  // Style du bouton de toggle
  const toggleButtonStyle = {
    padding: '10px 20px',
    background: 'transparent',
    color: '#D35400',
    border: '2px solid #D35400',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
    transition: 'all 0.3s ease'
  };

  return (
    <div style={pageStyle}>
      {/* Overlay d'assombrissement avec effet de flou */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.4)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 1 
      }} />
      
      {/* Contenu principal avec l'élévation Z-index */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {isSignUp ? (
          // FORMULAIRE D'INSCRIPTION
          <div style={formStyle}>
            <h1 style={{ 
              textAlign: 'center', 
              fontSize: '28px', 
              marginBottom: '20px',
              color: '#333',
              fontFamily: 'Arial, sans-serif'
            }}>Create Account</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button
                type="submit"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                SIGN UP
              </button>
            </form>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', fontFamily: 'Arial, sans-serif' }}>Already have an account?</p>
              <button
                onClick={handleToggle}
                style={toggleButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                GO TO LOGIN
              </button>
            </div>
          </div>
        ) : (
          // FORMULAIRE DE CONNEXION
          <div style={formStyle}>
            <h1 style={{ 
              textAlign: 'center', 
              fontSize: '28px', 
              marginBottom: '20px',
              color: '#333',
              fontFamily: 'Arial, sans-serif'
            }}>Log In</h1>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />
              <button
                type="submit"
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                LOG IN
              </button>
            </form>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', fontFamily: 'Arial, sans-serif' }}>Don't have an account?</p>
              <button
                onClick={handleToggle}
                style={toggleButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                GO TO SIGNUP
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Bouton de retour à l'accueil */}
      <a
        href="/"
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
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#D35400'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
      >
        <span style={{ 
          marginRight: '5px', 
          fontSize: '20px'
        }}>&#8592;</span> 
        <span>Retour à l'accueil</span>
      </a>
    </div>
  );
}

export default AuthPage;