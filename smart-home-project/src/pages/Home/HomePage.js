import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';

function HomePage() {
  const navigate = useNavigate();

  // État pour gérer la transition quand on quitte la page
  const [isNavigating, setIsNavigating] = useState(false);

  // États pour l'affichage / masquage du header et footer
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // État pour stocker l'utilisateur connecté
  const [user, setUser] = useState(null);

  // 1) Au montage, on lit l'utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    console.log('storedUser (raw):', storedUser); // DEBUG: Affiche la valeur brute dans la console

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('parsedUser:', parsedUser); // DEBUG: voir ce qu'on obtient
      setUser(parsedUser);
    }
  }, []);

  // 2) Gérer le défilement pour cacher/montrer header/footer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Cache le header si on descend
      if (currentScrollY > lastScrollY && showHeader && currentScrollY > 50) {
        setShowHeader(false);
      } 
      // Montre le header si on remonte
      else if (currentScrollY < lastScrollY && !showHeader) {
        setShowHeader(true);
      }

      // Montre le footer si on descend
      if (currentScrollY > lastScrollY && !showFooter && currentScrollY > 50) {
        setShowFooter(true);
      } 
      // Cache le footer si on remonte
      else if (
        currentScrollY < lastScrollY &&
        showFooter &&
        document.documentElement.scrollHeight - window.innerHeight - currentScrollY > 100
      ) {
        setShowFooter(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, showHeader, showFooter]);

  // Liste de modules
  const modules = [
    { name: 'Module Information', description: 'Accès aux informations générales' },
    { name: 'Module Visualisation', description: 'Visualisation des données et profils' },
    { name: 'Module Gestion', description: 'Gestion des objets connectés' },
    { name: 'Module Administration', description: 'Panneau de contrôle administrateur' }
  ];

  // Créateurs
  const creators = [
    { name: 'EL HARSAL Abdelah', email: 'abdelah.elharsal@example.com' },
    { name: 'HARAR Sofien', email: 'sofien.harar@example.com' },
    { name: 'OUEGURD Ayman', email: 'ayman.ouegurd@example.com' },
    { name: 'SABRI Younes', email: 'younes.sabri@hotmail.fr' },
    { name: 'Clément OTERO', email: 'clement.otero@example.com' }
  ];

  // 3) Quand on clique sur "Log in / Sign up"
  const handleNavigation = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/auth');
    }, 500);
  };

  // 4) Gérer la déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3020/plateforme/smart-home-project/api/logout.php', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Logout response:', data); // DEBUG

      if (data.status === 'success') {
        // Vider localStorage
        localStorage.removeItem('user');
        // Vider le state local
        setUser(null);
        // Revenir éventuellement à la Home
        navigate('/');
      } else {
        console.error('Erreur de logout:', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  console.log('Rendered HomePage with user:', user); // DEBUG: voir la valeur de user à chaque rendu

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        opacity: isNavigating ? 0 : 1,
        transition: 'opacity 0.5s ease'
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ height: '80px' }}></div>
        
        {/* HEADER */}
        <header
          style={{
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
          }}
        >
          {/* Logo + Titre */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={logoImage}
              alt="CYHOME Logo"
              style={{ height: '50px', marginRight: '10px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  color: '#333',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                CYHOME
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: '#666',
                  fontFamily: 'Arial, sans-serif'
                }}
              >
                La maison intelligente, en toute sécurité
              </span>
            </div>
          </div>

          {/* Message au milieu, visible si pas connecté */}
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              borderLeft: '2px solid #D35400',
              paddingLeft: '20px',
              margin: '0 20px'
            }}
          >
            {!user && (
              <span
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '1.1rem',
                  color: '#333'
                }}
              >
                Connectez-vous pour accéder à votre maison intelligente
              </span>
            )}
          </div>

         {/* Partie droite : utilisateur ou bouton login/signup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {user ? (
              // Utilisateur connecté : affichage dans un "card" stylisé
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#f8f8f8',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <img
                  src={user.photo}
                  alt="Photo de profil"
                  style={{
                    height: '40px',
                    width: '40px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                  <span style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>
                    {user.username}
                  </span>
                  <span style={{ fontFamily: 'Arial, sans-serif', color: '#777', fontSize: '0.85rem' }}>
                    ({user.role}) – Points : {user.points}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #D35400',
                    color: '#D35400',
                    padding: '0.4rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
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
            ) : (
              // Si pas connecté : bouton Log in / Sign up
              <a
                href="/auth"
                onClick={handleNavigation}
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
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#D35400';
                }}
              >
                Log in / Sign up
              </a>
            )}
          </div>

        </header>

        {/* MAIN */}
        <main
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            marginBottom: '110px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              backgroundColor: 'rgba(255,255,255,0.8)',
              padding: '2.5rem',
              borderRadius: '15px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}
          >
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
                <h2
                  style={{
                    marginBottom: '1rem',
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    color: '#333'
                  }}
                >
                  {module.name}
                </h2>
                <p
                  style={{
                    marginBottom: '1.5rem',
                    color: '#666',
                    lineHeight: '1.6'
                  }}
                >
                  {module.description}
                </p>
                <Link
                  to={`/${module.name.toLowerCase().replace(/\s+/g, '-')}`}
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

        {/* FOOTER */}
        <footer
          style={{
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <img
              src={logoImage}
              alt="CYHOME Logo"
              style={{ height: '65px' }}
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
          <div style={{ paddingRight: '50px' }}>
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
