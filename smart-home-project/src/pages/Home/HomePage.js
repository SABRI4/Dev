import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';
// Importez vos logos
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';

function HomePage() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Gérer le défilement pour montrer/cacher le header et footer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Si on défile vers le bas et le header est visible, cacher le header
      if (currentScrollY > lastScrollY && showHeader && currentScrollY > 50) {
        setShowHeader(false);
      } 
      // Si on défile vers le haut et le header est caché, montrer le header
      else if (currentScrollY < lastScrollY && !showHeader) {
        setShowHeader(true);
      }
      
      // Pour le footer, comportement inverse
      if (currentScrollY > lastScrollY && !showFooter && currentScrollY > 50) {
        setShowFooter(true);
      } 
      else if (currentScrollY < lastScrollY && showFooter && 
              (document.documentElement.scrollHeight - window.innerHeight - currentScrollY > 100)) {
        setShowFooter(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showHeader, showFooter]);
  
  const modules = [
    { name: "Module Information", description: "Accès aux informations générales", path: "/module-information" },
    { name: "Module Visualisation", description: "Visualisation des données et profils", path: "/module-visualisation" },
    { name: "Module Gestion", description: "Gestion des objets connectés", path: "/module-gestion" },
    { name: "Module Administration", description: "Panneau de contrôle administrateur", path: "/module-administration" }
  ];

  // Liste des créateurs originale avec emails
  const creators = [
    { name: "EL HARSAL Abdelah", email: "abdelah.elharsal@example.com" },
    { name: "HARAR Sofien", email: "sofien.harar@example.com" },
    { name: "OUEGURD Ayman", email: "ayman.ouegurd@example.com" },
    { name: "SABRI Younes", email: "younes.sabri@example.com" },
    { name: "Clément OTERO", email: "clement.otero@example.com" }
  ];

  // Fonction de navigation avec transition pour l'authentification
  const handleAuthNavigation = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    
    setTimeout(() => {
      navigate('/auth');
    }, 500);
  };

  // Fonction de navigation avec transition pour les modules
  const handleModuleNavigation = (modulePath, e) => {
    e.preventDefault();
    
    // Définir l'état de navigation
    setIsNavigating(true);
    
    // Attendre la fin de l'animation avant de naviguer
    setTimeout(() => {
      navigate(modulePath);
    }, 500);
  };

  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      opacity: isNavigating ? 0 : 1,
      transition: 'opacity 0.5s ease'
    }}>
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
        {/* Espace réservé pour compenser le header fixe */}
        <div style={{ height: '80px' }}></div>
        {/* Header */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0.5rem 1rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          borderBottom: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderBottom: '3px solid #D35400',
          position: 'fixed',
          top: showHeader ? 0 : '-100px',
          left: 0,
          right: 0,
          zIndex: 10,
          transition: 'top 0.3s ease-in-out'
        }}>
          {/* Logo et nom du site à gauche */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}>
            <img 
              src={logoImage} 
              alt="CYHOME Logo" 
              style={{ 
                height: '50px', 
                marginRight: '10px' 
              }} 
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{ 
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: '#333',
                fontFamily: 'Arial, sans-serif'
              }}>
                CYHOME
              </span>
              <span style={{
                fontSize: '0.8rem',
                color: '#666',
                fontFamily: 'Arial, sans-serif'
              }}>
                La maison intelligente, en toute sécurité
              </span>
            </div>
          </div>
          
          {/* Message central */}
          <div style={{
            flex: 1,
            textAlign: 'center',
            borderLeft: '2px solid #D35400',
            paddingLeft: '20px',
            margin: '0 20px'
          }}>
            <span style={{ 
              fontFamily: 'Arial, sans-serif',
              fontSize: '1.1rem',
              color: '#333'
            }}>
              Connectez-vous pour accéder à votre maison intelligente
            </span>
          </div>
          
          {/* Boutons à droite */}
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            {/* Bouton de connexion/inscription */}
            <a 
              href="/auth"
              onClick={handleAuthNavigation}
              style={{ 
                color: '#D35400',
                padding: '0.4rem 1rem',
                borderRadius: '5px',
                border: '2px solid #D35400',
                textDecoration: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backgroundColor: 'transparent',
                whiteSpace: 'nowrap',
                fontSize: '0.9rem',
              }}
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
              Connexion / Inscription
            </a>
          </div>
        </header>

        <main style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '2rem',
          marginBottom: '110px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1.5rem', 
            backgroundColor: 'rgba(255,255,255,0.8)', 
            padding: '2.5rem',
            borderRadius: '15px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            {modules.map((module) => (
              <div 
                key={module.name} 
                style={{ 
                  border: '1px solid #e0e0e0', 
                  padding: '2rem', 
                  textAlign: 'center', 
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h2 style={{ 
                  marginBottom: '1rem', 
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  color: '#333'
                }}>{module.name}</h2>
                <p style={{ 
                  marginBottom: '1.5rem', 
                  color: '#666',
                  lineHeight: '1.6'
                }}>{module.description}</p>
                <Link 
                  to={module.path}
                  onClick={(e) => handleModuleNavigation(module.path, e)}
                  style={{ 
                    color: '#D35400',
                    padding: '0.4rem 1rem',
                    borderRadius: '5px',
                    border: '2px solid #D35400',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'transparent',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D35400';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#D35400';
                  }}
                >
                  Accéder
                </Link>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer style={{ 
          position: 'fixed', 
          bottom: showFooter ? 0 : '-100px',
          width: '100%', 
          padding: '0.3rem 1rem', 
          backgroundColor: 'rgba(245, 245, 245, 0.85)',
          backdropFilter: 'blur(5px)',
          borderTop: '3px solid #D35400',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'bottom 0.3s ease-in-out',
          zIndex: 10
        }}>
          {/* Section gauche avec logo CYHOME et créateurs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '25px'
          }}>
            {/* Logo CYHOME */}
            <img 
              src={logoImage} 
              alt="CYHOME Logo" 
              style={{ 
                height: '65px'
              }} 
            />
            
            {/* Liste des emails et noms des créateurs */}
            <div>
              {creators.map((creator, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>
                  <a 
                    href={`mailto:${creator.email}`} 
                    style={{ 
                      textDecoration: 'none',
                      color: '#D35400',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 'normal',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.backgroundColor = '#D35400';
                      e.currentTarget.style.padding = '1px 4px';
                      e.currentTarget.style.borderRadius = '3px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#D35400';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.padding = '0';
                    }}
                  >
                    {creator.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          {/* Logo CYTECH */}
          <div style={{
            paddingRight: '50px'
          }}>
            <img 
              src={cytechLogo} 
              alt="CYTECH Logo" 
              style={{ 
                height: '50px',
                position: 'relative',
                right: '30px'
              }} 
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;