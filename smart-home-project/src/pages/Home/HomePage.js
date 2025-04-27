import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';

function HomePage() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && showHeader && currentScrollY > 50) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY && !showHeader) {
        setShowHeader(true);
      }
      if (currentScrollY > lastScrollY && !showFooter && currentScrollY > 50) {
        setShowFooter(true);
      } else if (currentScrollY < lastScrollY && showFooter &&
        (document.documentElement.scrollHeight - window.innerHeight - currentScrollY > 100)) {
        setShowFooter(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showHeader, showFooter]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/auth");
  };

  const modules = [
    { name: "Module Information", description: "Accès aux informations générales", path: "/module-information" },
    ...(user ? [
      ...(((user.role === 'simple' && (user.niveau === 'debutant' || user.niveau === 'intermediaire')) || 
           (user.role === 'complexe' && user.niveau === 'avance') || 
           (user.role === 'admin' && user.niveau === 'expert')) ? 
        [{ name: "Module Visualisation", description: "Visualisation des données", path: "/module-visualisation" }] : []),
      ...((user.role === 'complexe' && user.niveau === 'avance') || 
          (user.role === 'admin' && user.niveau === 'expert') ? 
        [{ name: "Module Gestion", description: "Gestion des objets connectés", path: "/module-gestion" }] : []),
      ...(user.role === 'admin' && user.niveau === 'expert' ? 
        [
          { name: "Module Administration", description: "Administration système", path: "/module-administration" },
          { name: "Module Requête", description: "Demandes de suppression", path: "/module-requête" }
        ] : [])
    ] : [])
  ];
  

  const creators = [
    { name: "EL HARSAL Abdelah", email: "abdelah.elharsal@example.com" },
    { name: "HARAR Sofien", email: "sofien.harar@example.com" },
    { name: "OUEGURD Ayman", email: "ayman.ouegurd@example.com" },
    { name: "SABRI Younes", email: "younes.sabri@example.com" },
    { name: "Clément OTERO", email: "clement.otero@example.com" }
  ];

  const handleAuthNavigation = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/auth');
    }, 500);
  };

  const handleModuleNavigation = (modulePath, e) => {
    e.preventDefault();
    setIsNavigating(true);
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
        <div style={{ height: '80px' }}></div>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0.5rem 1rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
          borderBottom: '3px solid #D35400',
          position: 'fixed',
          top: showHeader ? 0 : '-100px',
          left: 0,
          right: 0,
          zIndex: 10,
          transition: 'top 0.3s ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logoImage} alt="CYHOME Logo" style={{ height: '50px', marginRight: '10px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>CYHOME</span>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>La maison intelligente, en toute sécurité</span>
            </div>
          </div>
          {!user && (
          <div style={{ flex: 1, textAlign: 'center', borderLeft: '2px solid #D35400', paddingLeft: '20px', margin: '0 20px' }}>
            <span style={{ fontSize: '1.1rem', color: '#333' }}>
              Connectez-vous pour accéder à votre maison intelligente
            </span>
          </div>
          )}
          <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        border: '2px solid #D35400',  
        borderRadius: '10px',        
        padding: '10px'               
      }}
        >
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={user.photo || "/default-avatar.png"}
                    alt="Profil"
                    style={{
                      height: '40px',
                      width: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginRight: '8px'
                    }}
                  />
                  <span style={{ color: '#D35400', fontWeight: 'bold' }}>
                    {user.username} ({user.role}) - {user.points} pts
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    color: '#D35400',
                    padding: '0.4rem 1rem',
                    borderRadius: '5px',
                    border: '2px solid #D35400',
                    backgroundColor: 'transparent',
                    fontWeight: 'bold',
                    cursor: 'pointer'
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
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              style={{
                color: '#D35400',
                padding: '0.4rem 1rem',
                borderRadius: '5px',
                border: '2px solid #D35400',
                textDecoration: 'none',
                fontWeight: 'bold',
                backgroundColor: 'transparent'
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
              Connexion / Inscription
            </Link>
          )}
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