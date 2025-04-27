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
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isSignUp) {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("nom", nom);
      formData.append("prenom", prenom);
      formData.append("birthdate", birthdate);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("member_type", memberType);
      if (profileImage) {
        formData.append("photo", profileImage);
      }
  
      try {
        const response = await fetch("http://localhost:3020/plateforme/smart-home-project/api/signup.php", {
          method: "POST",
          body: formData,
          credentials: "include", // pour les cookies si besoin
        });
  
        const data = await response.json();
        console.log(data);
  
        if (data.status === "success") {
          alert("Compte créé avec succès !");
        
          // Connexion automatique après inscription
          const loginResponse = await fetch("http://localhost:3020/plateforme/smart-home-project/api/login.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ email, password })
          });
        
          const loginData = await loginResponse.json();
        
          if (loginData.status === "success") {
            localStorage.setItem("user", JSON.stringify(loginData.user));
            navigate("/"); // Redirection vers la page d'accueil
          } else {
            alert("Inscription OK mais connexion impossible : " + loginData.message);
            setIsSignUp(false); // On bascule vers la page de connexion
          }
        }
        else {
          alert("Erreur lors de l'inscription : " + data.message);
        }
      } catch (error) {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur réseau s’est produite.");
      }
  
    } else {
      // Connexion classique
      try {
        const response = await fetch("http://localhost:3020/plateforme/smart-home-project/api/login.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ email, password })
        });
  
        const data = await response.json();
        console.log(data);
  
        if (data.status === "success") {
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/");
        } else {
          alert("Erreur lors de la connexion : " + data.message);
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur réseau s’est produite.");
      }
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
                src={previewURL || "/default-avatar.png"} 
                alt="Profile Preview" 
                style={imagePreviewStyle}
                onError={(e) => {
                  if (e.target.src.indexOf("default-avatar.png") === -1) {
                    e.target.src = "/default-avatar.png";
                  }
                }}
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
              
              {/* Champs pour nom et prénom avec le même style */}
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={inputStyle}
                onMouseEnter={(e) => e.target.style.borderColor = '#D35400'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                style={inputStyle}
                onMouseEnter={(e) => e.target.style.borderColor = '#D35400'}
                onMouseLeave={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
              
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
                <option value="M">Homme</option>
                <option value="F">Femme</option>
                <option value="Autre">Autre</option>
                <option value="PreferePasDire">Préfère ne pas préciser</option>
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
