import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function AuthPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // État pour basculer entre inscription et connexion
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  // Nouveaux états pour les champs additionnels
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [memberType, setMemberType] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  
  // États pour les animations
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);

  // Animation d'entrée au chargement de la page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Fonction pour basculer entre inscription et connexion
  const handleToggle = () => {
    setIsAnimating(true);
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

  // Gestion de l'upload d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const fileURL = URL.createObjectURL(file);
      setPreviewURL(fileURL);
    }
  };

  // Fonction pour déclencher le dialogue de sélection de fichier
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSignUp) {
      console.log('Inscription', { 
        email, 
        password, 
        username, 
        age, 
        gender, 
        birthdate, 
        memberType,
        profileImage: profileImage ? profileImage.name : null
      });
    } else {
      console.log('Connexion', { email, password });
    }
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
    maxHeight: isSignUp ? '80vh' : 'auto',
    overflowY: isSignUp ? 'auto' : 'visible'
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

  // Style pour le sélecteur d'image
  const imageUploadStyle = {
    width: '100%',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const uploadButtonStyle = {
    ...buttonStyle,
    width: 'auto',
    marginTop: '10px',
    padding: '8px 15px',
    fontSize: '14px'
  };

  const imagePreviewStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #D35400',
    margin: '0 auto',
    display: previewURL ? 'block' : 'none',
    marginBottom: '10px'
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
            }}>Créer un compte</h1>
            <form onSubmit={handleSubmit}>
              {/* Sélection de photo de profil */}
              <div style={imageUploadStyle}>
                <img 
                  src={previewURL || "https://via.placeholder.com/120"} 
                  alt="Profile Preview" 
                  style={imagePreviewStyle} 
                />
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <button
                  type="button"
                  onClick={triggerFileInput}
                  style={uploadButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D35400';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#D35400';
                  }}
                >
                  {previewURL ? 'Changer la photo' : 'Ajouter une photo'}
                </button>
              </div>
              
              {/* Champs existants */}
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                onMouseEnter={(e) => e.target.style.borderColor = '#D35400'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onMouseEnter={(e) => e.target.style.borderColor = '#D35400'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                onMouseEnter={(e) => e.target.style.borderColor = '#D35400'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              
              {/* Nouveaux champs */}
              <input
                type="number"
                placeholder="Âge"
                value={age}
                onChange={(e) => {
                  if (e.target.value >= 0) {
                    setAge(e.target.value);
                  }
                }}
                min="0"
                style={inputStyle}
              />
              
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{...inputStyle, appearance: 'auto'}}
                onMouseEnter={(e) => e.target.style.borderColor = '#D35400'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              >
                <option value="" disabled>Sélectionner le genre</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="other">Autre</option>
                <option value="prefer-not-to-say">Préfère ne pas préciser</option>
              </select>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666' }}>Date de naissance</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  style={inputStyle}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <select
                value={memberType}
                onChange={(e) => setMemberType(e.target.value)}
                style={{...inputStyle, appearance: 'auto'}}
              >
                <option value="" disabled>Type de membre</option>
                <option value="mother">Mère</option>
                <option value="father">Père</option>
                <option value="child">Enfant</option>
                <option value="grandparent">Grand-parent</option>
                <option value="other-relative">Autre membre de la famille</option>
                <option value="guest">Invité</option>
              </select>
              
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
                S'INSCRIRE
              </button>
            </form>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', fontFamily: 'Arial, sans-serif' }}>Vous avez déjà un compte ?</p>
              <button
                onClick={handleToggle}
                style={toggleButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                }}
              >
                ALLER À LA CONNEXION
              </button>
            </div>
          </div>
        ) : (
          // FORMULAIRE DE CONNEXION
          <div style={formStyle}>
            <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '20px', color: '#333' }}>
              Connexion
            </h1>
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
                placeholder="Mot de passe"
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
                SE CONNECTER
              </button>
            </form>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', fontFamily: 'Arial, sans-serif' }}>Vous n'avez pas de compte ?</p>
              <button
                onClick={handleToggle}
                style={toggleButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                }}
              >
                ALLER À L'INSCRIPTION
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
        <span style={{ marginRight: '5px', fontSize: '20px' }}>&#8592;</span> 
        <span>Retour à l'accueil</span>
      </a>
    </div>
  );
}

export default AuthPage;
