import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function ModuleInformation() {
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Ajouter ces états en haut du composant, après les autres useState
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // État des objets connectés avec leurs icônes SVG intégrées
  const [connectedDevices] = useState([
    { 
      id: 1, 
      name: 'Thermomètre salon',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,22c-4.418,0-8-3.582-8-8c0-3.584,2.385-6.615,5.649-7.605C9.879,6.266,10,6.133,10,6V3c0-0.552,0.448-1,1-1h2 c0.552,0,1,0.448,1,1v3c0,0.133,0.121,0.266,0.351,0.395C17.615,7.385,20,10.416,20,14C20,18.418,16.418,22,12,22z M13,4h-2v2h2V4z M12,20c3.314,0,6-2.686,6-6c0-3.314-2.686-6-6-6s-6,2.686-6,6C6,17.314,8.686,20,12,20z M11,14.732V10c0-0.552,0.448-1,1-1 s1,0.448,1,1v4.732c0.616,0.357,1,1.025,1,1.768c0,1.105-0.895,2-2,2s-2-0.895-2-2C10,15.757,10.384,15.089,11,14.732z"/>
        </svg>
      )
    },
    { 
      id: 2, 
      name: 'Climatiseur',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M21,9h-7V7c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v2H3C2.45,9,2,9.45,2,10v4c0,0.55,0.45,1,1,1h7v2c0,0.55,0.45,1,1,1h2 c0.55,0,1-0.45,1-1v-2h7c0.55,0,1-0.45,1-1v-4C22,9.45,21.55,9,21,9z M20,13h-7c-0.55,0-1,0.45-1,1v2h-2v-2c0-0.55-0.45-1-1-1H4 v-2h7c0.55,0,1-0.45,1-1V8h2v2c0,0.55,0.45,1,1,1h5V13z"/>
          <path d="M9,16h1.5v1.5H9V16z"/>
          <path d="M13.5,16H15v1.5h-1.5V16z"/>
          <path d="M9,12h1.5v1.5H9V12z"/>
          <path d="M13.5,12H15v1.5h-1.5V12z"/>
        </svg>
      )
    },
    { 
      id: 3, 
      name: 'Détecteur de fumée',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8 S16.4,20,12,20z"/>
          <path d="M12,6c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S15.3,6,12,6z M12,16c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S14.2,16,12,16z"/>
          <path d="M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z"/>
        </svg>
      )
    },
    { 
      id: 4, 
      name: 'Éclairage salon',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,2C8.13,2,5,5.13,5,9c0,2.38,1.19,4.47,3,5.74V17c0,0.55,0.45,1,1,1h1v2c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-2h1 c0.55,0,1-0.45,1-1v-2.26c1.81-1.27,3-3.36,3-5.74C19,5.13,15.87,2,12,2z M14,17h-4v-1h4V17z M15.74,13.32l-0.74,0.52V15h-5v-1.15 l-0.74-0.52C7.89,12.37,7,10.8,7,9c0-2.76,2.24-5,5-5s5,2.24,5,5C17,10.8,16.11,12.37,14.74,13.32z"/>
        </svg>
      )
    },
    { 
      id: 5, 
      name: 'Caméra entrée',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <circle cx="12" cy="12" r="3"/>
          <path d="M20,4h-3.17l-1.24-1.35C15.22,2.24,14.68,2,14.12,2H9.88c-0.56,0-1.1,0.24-1.48,0.65L7.17,4H4C2.9,4,2,4.9,2,6v12 c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5S14.76,17,12,17z"/>
        </svg>
      )
    },
    { 
      id: 6, 
      name: 'Volets automatiques',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M19,4H5C3.89,4,3,4.9,3,6v12c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,18H5V6h14V18z"/>
          <path d="M7,9h10v2H7V9z"/>
          <path d="M7,12h10v2H7V12z"/>
          <path d="M7,15h10v2H7V15z"/>
        </svg>
      )
    },
    { 
      id: 7, 
      name: 'Capteur de présence',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,12c2.21,0,4-1.79,4-4s-1.79-4-4-4S8,5.79,8,8S9.79,12,12,12z M12,6c1.1,0,2,0.9,2,2s-0.9,2-2,2S10,9.1,10,8 S10.9,6,12,6z"/>
          <path d="M12,13c-2.67,0-8,1.34-8,4v3h16v-3C20,14.34,14.67,13,12,13z M18,18H6v-0.99c0.2-0.72,3.3-2.01,6-2.01s5.8,1.29,6,2 V18z"/>
        </svg>
      )
    },
    { 
      id: 8, 
      name: 'Station météo',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13 c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z M19,18H6c-2.21,0-4-1.79-4-4c0-2.05,1.53-3.76,3.56-3.97l1.07-0.11 l0.5-0.95C8.08,7.14,9.94,6,12,6c2.62,0,4.88,1.86,5.39,4.43l0.3,1.5l1.53,0.11C20.78,12.14,22,13.45,22,15 C22,16.65,20.65,18,19,18z"/>
        </svg>
      )
    }
  ]);

  // Gérer le défilement pour montrer/cacher le header et footer
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowHeader(false);
        setShowFooter(true);
      } else {
        setShowHeader(true);
        setShowFooter(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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

      {/* Bouton de retour à l'accueil */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '80px',
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
      </Link>

      {/* Background Image */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: showHeader ? 0 : '-100px',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(245, 245, 245, 0.85)',
          backdropFilter: 'blur(5px)',
          borderBottom: '3px solid #D35400',
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'top 0.3s ease-in-out',
          zIndex: 10,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <img src={logoImage} alt="CYHOME Logo" style={{ height: '50px' }} />
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#D35400' }}>Module Information</h1>
        <Link
          to="/auth"
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
        </Link>
      </header>

      {/* Structure principale à deux colonnes */}
      <div style={{
        display: 'flex',
        padding: '0 2rem',
        marginTop: '120px',
        marginBottom: '120px',
        position: 'relative',
        zIndex: 1,
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '120px auto',
        gap: '2rem',
      }}>
        {/* Colonne de gauche - Information principale */}
        <main style={{
          padding: '2rem',
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '10px',
          flex: '1 1 60%',
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Module Information</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Bienvenue sur la page du module Information. Ici, vous pouvez accéder aux informations générales.
          </p>

          {/* Section Objets Connectés */}
          <section style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid #D35400', paddingBottom: '0.5rem' }}>
              Liste des Objets Connectés
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1.5rem' }}>
              {connectedDevices.map(device => (
                <div
                  key={device.id}
                  style={{
                    backgroundColor: 'rgba(211, 84, 0, 0.2)',
                    padding: '1.5rem 1rem',
                    borderRadius: '15px',
                    border: '1px solid rgba(211, 84, 0, 0.3)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '150px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(211, 84, 0, 0.5)';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(211, 84, 0, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ 
                    backgroundColor: '#D35400', 
                    borderRadius: '50%', 
                    width: '70px', 
                    height: '70px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    {device.icon}
                  </div>
                  <h3 style={{ 
                    margin: '0', 
                    fontSize: '0.9rem', 
                    color: '#fff',
                    fontWeight: 'normal',
                    marginTop: '0.5rem'
                  }}>
                    {device.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Colonne de droite - Actualités */}
        <aside style={{
          padding: '2rem',
          color: '#fff',
          backgroundColor: 'rgba(211, 84, 0, 0.8)',
          borderRadius: '10px',
          flex: '1 1 30%',
          maxWidth: '400px',
        }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', borderBottom: '2px solid #fff', paddingBottom: '0.5rem' }}>
            Actualités de la maison
          </h2>

          {/* Barre de recherche et filtres */}
          <div style={{ marginBottom: '2rem' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                marginBottom: '1rem',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  padding: '0.3rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  flex: 1,
                }}
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{
                  padding: '0.3rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  flex: 1,
                }}
              >
                <option value="all">Tous les types</option>
                <option value="maintenance">Maintenance</option>
                <option value="update">Mise à jour</option>
                <option value="alert">Alerte</option>
              </select>
            </div>
          </div>

          {/* Liste des actualités existante */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>12/03/2023 :</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>Une nouvelle mise à jour du système de sécurité a été déployée.</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>10/03/2023 :</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>Les capteurs de température ont été calibrés pour une meilleure précision.</p>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>08/03/2023 :</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>Une maintenance est prévue pour le 15 mars. Certains services pourraient être indisponibles.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer
        style={{
          position: 'fixed',
          bottom: showFooter ? 0 : '-100px',
          left: 0,
          width: '100%',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(245, 245, 245, 0.85)',
          backdropFilter: 'blur(5px)',
          borderTop: '3px solid #D35400',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'bottom 0.3s ease-in-out',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        {/* Section gauche avec logo CYHOME et créateurs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
          }}
        >
          <img src={logoImage} alt="CYHOME Logo" style={{ height: '65px' }} />
          <div>
            <p style={{ margin: 0 }}>Créé par l'équipe CYHOME</p>
          </div>
        </div>

        {/* Logo CYTECH */}
        <div>
          <img
            src={cytechLogo}
            alt="CYTECH Logo"
            style={{
              height: '50px',
            }}
          />
        </div>
      </footer>
    </div>
  );
}

export default ModuleInformation;