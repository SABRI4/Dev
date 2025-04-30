import React, { useState, useEffect, useRef  } from 'react';
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
  const mounted = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  useEffect(() => {
    if (!mounted.current && user) {
      updateUserPoints();
      mounted.current = true;
    }
  }, [user]);

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
    { 
      name: "Module Information", 
      description: "Accès aux informations générales", 
      path: "/module-information",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#D35400">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
      )
    },
    ...(user ? [
      ...(((user.role === 'simple' && (user.niveau === 'debutant' || user.niveau === 'intermediaire')) || 
           (user.role === 'complexe') || 
           (user.role === 'admin')) ? 
        [{ 
          name: "Module Visualisation", 
          description: "Visualisation des données", 
          path: "/module-visualisation",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#D35400">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
              <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
            </svg>
          )
        }] : []),
      ...((user.role === 'complexe') || 
          (user.role === 'admin') ? 
        [{ 
          name: "Module Gestion", 
          description: "Gestion des objets connectés", 
          path: "/module-gestion",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#D35400">
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
            </svg>
          )
        }] : []),
      ...(user.role === 'admin' ? 
        [
          { 
            name: "Module Administration", 
            description: "Administration système", 
            path: "/module-administration",
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48" fill="#D35400">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            )
          }
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

  const updateUserPoints = async () => {
    if (!user) return;
    try {
      const response = await fetch('http://localhost:3020/plateforme/smart-home-project/api/User-manager.php', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();

      const serverUser = data.users.find(u => u.id === user.id);
      console.log('front id:', user.id, typeof user.id);
      console.log('back ids:', data.users.map(u=>[u.id, typeof u.id]));
      if (!serverUser) return;
      const updatedUser = {
        ...user,
        points: serverUser.points,
        niveau: serverUser.niveau,
        role: serverUser.role,
        is_verified: serverUser.is_verified
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Erreur lors de la mise à jour des points :', err);
    }
  };
  
  

  const handleModuleNavigation = (modulePath, e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate(modulePath);
    }, 500);
  };

  // Fonction pour rendre une carte de module individuelle
  const renderModuleCard = (module, isSingle = false) => {
    return (
      <div 
        key={module.name} 
        style={{ 
          border: '1px solid rgba(211, 84, 0, 0.2)', 
          padding: '1.5rem', 
          textAlign: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '15px',
          transition: 'all 0.3s ease',
          width: isSingle ? '50%' : '100%',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '280px',
          position: 'relative',
          overflow: 'hidden',
          margin: '0.5rem',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(211, 84, 0, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '1rem',
          flex: 1
        }}>
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60px'
          }}>
            {module.icon}
          </div>
          <h2 style={{ 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            fontSize: '1.3rem',
            color: '#D35400',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>{module.name}</h2>
          <p style={{ 
            color: '#666',
            lineHeight: '1.4',
            fontSize: '1rem',
            maxWidth: '90%',
            margin: '0 auto',
            marginBottom: '1rem',
            flex: 1
          }}>{module.description}</p>
        </div>
        <div style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Link 
            to={module.path}
            onClick={(e) => handleModuleNavigation(module.path, e)}
            style={{ 
              color: '#D35400',
              padding: '0.5rem 1.5rem',
              borderRadius: '6px',
              border: '2px solid #D35400',
              textDecoration: 'none',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent',
              display: 'inline-block',
              width: 'auto',
              minWidth: '120px',
              fontSize: '0.9rem',
              margin: '1rem 0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D35400';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#D35400';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            Accéder
          </Link>
        </div>
      </div>
    );
  };

  // Fonction pour générer la grille en fonction du nombre de modules
  const renderModulesGrid = () => {
    const moduleCount = modules.length;
    
    // Pour le cas où il n'y a qu'un seul module
    if (moduleCount === 1) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          padding: '2rem'
        }}>
          {renderModuleCard(modules[0], true)}
        </div>
      );
    }
    
    // Pour le cas où il y a 2 modules (côte à côte)
    if (moduleCount === 2) {
      return (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem',
          width: '100%',
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          {modules.map(module => renderModuleCard(module))}
        </div>
      );
    }
    
    // Pour le cas où il y a 3 modules (2 côte à côte en haut, 1 centré en bas)
    if (moduleCount === 3) {
      return (
        <div style={{ width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            {modules.slice(0, 2).map(module => renderModuleCard(module))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center'
          }}>
            {renderModuleCard(modules[2], true)}
          </div>
        </div>
      );
    }
    
    // Pour 4 modules (2x2)
    if (moduleCount === 4) {
      return (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '4rem',
          width: '100%',
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          {modules.map(module => renderModuleCard(module))}
        </div>
      );
    }
    
    // Pour 5 modules (2x2 + 1 centré en bas)
    if (moduleCount === 5) {
      return (
        <div style={{ width: '100%', padding: '2rem', boxSizing: 'border-box' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '4rem',
            marginBottom: '4rem'
          }}>
            {modules.slice(0, 4).map(module => renderModuleCard(module))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center'
          }}>
            {renderModuleCard(modules[4], true)}
          </div>
        </div>
      );
    }
    
    // Pour plus de modules ou autres cas
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '4rem',
        width: '100%',
        padding: '2rem'
      }}>
        {modules.map(module => renderModuleCard(module))}
      </div>
    );
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
        backgroundColor: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 1 
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: '80px' }}></div>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '1rem 2rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(5px)',
          borderBottom: '3px solid #D35400',
          position: 'fixed',
          top: showHeader ? 0 : '-100px',
          left: 0,
          right: 0,
          zIndex: 10,
          transition: 'top 0.3s ease-in-out',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={logoImage} alt="CYHOME Logo" style={{ height: '50px' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem', color: '#333' }}>CYHOME</span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>La maison intelligente, en toute sécurité</span>
            </div>
          </div>
          {!user && (
            <div style={{ flex: 1, textAlign: 'center', borderLeft: '2px solid #D35400', paddingLeft: '20px', margin: '0 20px' }}>
              <span style={{ fontSize: '1.1rem', color: '#333' }}>
                Connectez-vous pour accéder à votre maison intelligente
              </span>
            </div>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            border: '2px solid #D35400',  
            borderRadius: '10px',        
            padding: '10px',
            backgroundColor: 'rgba(211, 84, 0, 0.05)'               
          }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <Link
                    to="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <img
                      src={user.photo || "/default-avatar.png"}
                      alt="Profil"
                      style={{
                        height: '40px',
                        width: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginRight: '8px',
                        border: '2px solid #D35400'
                      }}
                    />
                    <span style={{ color: '#D35400', fontWeight: 'bold' }}>
                      {user.username} ({user.role}) - {user.points} pts
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      color: '#D35400',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '8px',
                      border: '2px solid #D35400',
                      backgroundColor: 'transparent',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#D35400';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#D35400';
                      e.currentTarget.style.transform = 'scale(1)';
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
                  padding: '0.6rem 1.2rem',
                  borderRadius: '8px',
                  border: '2px solid #D35400',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  backgroundColor: 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                  e.currentTarget.style.transform = 'scale(1)';
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
          marginBottom: '110px',
          minHeight: 'calc(100vh - 190px)'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.9)', 
            padding: '2.5rem',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            width: '90%',
            maxWidth: '1400px',
            backdropFilter: 'blur(5px)'
          }}>
            {renderModulesGrid()}
          </div>
        </main>

        <footer style={{ 
          position: 'fixed', 
          bottom: showFooter ? 0 : '-100px',
          width: '100%', 
          padding: '1rem 2rem', 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(5px)',
          borderTop: '3px solid #D35400',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'bottom 0.3s ease-in-out',
          zIndex: 10,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '25px'
          }}>
            <img 
              src={logoImage} 
              alt="CYHOME Logo" 
              style={{ 
                height: '65px'
              }} 
            />
            <div>
              {creators.map((creator, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>
                  <a 
                    href={`mailto:${creator.email}`} 
                    style={{ 
                      textDecoration: 'none',
                      color: '#D35400',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 'normal',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.backgroundColor = '#D35400';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#D35400';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {creator.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img 
              src={cytechLogo} 
              alt="CYTECH Logo" 
              style={{ 
                height: '50px'
              }} 
            />
          </div>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;