import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function AuthPage() {
  const navigate = useNavigate();
  
  // État pour basculer entre inscription et connexion
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');
  const [file, setFile] = useState(null);
  // État pour stocker le message d'erreur à afficher
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    setIsAnimating(true);
    setErrorMessage('');  // Réinitialiser le message d'erreur lors du changement de formulaire
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsAnimating(false);
    }, 300);
  };

  const handleNavigateHome = (e) => {
    e.preventDefault();
    setIsNavigatingHome(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      // Inscription
      const url = 'http://localhost:3020/plateforme/smart-home-project/api/signup.php';
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      if (file) {
        formData.append('photo', file);
      }
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await response.json();
        if (data.status === 'success') {
          console.log('Compte créé avec succès');
          navigate('/auth');
        } else {
          console.error(data.message);
          setErrorMessage(data.message);
        }
      } catch (error) {
        console.error("Erreur lors de l'inscription", error);

      }
    } else {
      // Connexion
      const url = 'http://localhost:3020/plateforme/smart-home-project/api/login.php';
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        const data = await response.json();
        if (data.status === 'success') {
          console.log('Connexion réussie', data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        } else {
          console.error(data.message);
          setErrorMessage(data.message);

        }
      } catch (error) {
        console.error('Erreur lors de la connexion', error);
        setErrorMessage("Erreur lors de la connexion");
      }
    }
  };

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

  const errorStyle = {
    backgroundColor: '#f8d7da',
    color: '#842029',
    border: '1px solid #f5c2c7',
    padding: '10px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px'
  };

  return (
    <div style={pageStyle}>
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
      <div style={{ position: 'relative', zIndex: 2 }}>
        {isSignUp ? (
          <div style={formStyle}>
            <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
              Create Account
            </h1>
            {errorMessage && (
              <div style={errorStyle}>
                <span style={{ marginRight: '8px', fontSize: '1.2em' }}>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                style={inputStyle}
              />
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  if (errorMessage) setErrorMessage('');
                }}
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
          <div style={formStyle}>
            <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px', color: '#333', fontFamily: 'Arial, sans-serif' }}>
              Log In
            </h1>
            {errorMessage && (
              <div style={errorStyle}>
                <span style={{ marginRight: '8px', fontSize: '1.2em' }}>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
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
        <span style={{ marginRight: '5px', fontSize: '20px' }}>&#8592;</span>
        <span>Retour à l'accueil</span>
      </a>
    </div>
  );
}

export default AuthPage;
