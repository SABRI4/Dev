import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function ModuleInformation() {
  const navigate = useNavigate();

  // Pour gérer l'affichage du header/footer lors du scroll
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // État pour stocker l'utilisateur connecté
  const [user, setUser] = useState(null);

  // Au montage, lire l'utilisateur dans localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Gérer le scroll pour montrer/cacher header/footer
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

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      const response = await fetch(
        'http://localhost:3020/plateforme/smart-home-project/api/logout.php',
        { method: 'GET', credentials: 'include' }
      );
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  // Exemple d'objets connectés (8 objets)
  const [connectedDevices] = useState([
    { id: 1, name: 'Thermomètre salon' },
    { id: 2, name: 'Climatiseur' },
    { id: 3, name: 'Détecteur de fumée' },
    { id: 4, name: 'Éclairage salon' },
    { id: 5, name: 'Caméra entrée' },
    { id: 6, name: 'Volets automatiques' },
    { id: 7, name: 'Capteur de présence' },
    { id: 8, name: 'Station météo' }
  ]);

  // États pour la recherche et les filtres
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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

      {/* HEADER */}
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
        {/* Logo CYHOME */}
        <img src={logoImage} alt="CYHOME Logo" style={{ height: '50px' }} />

        {/* Titre */}
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#D35400' }}>
          Module Information
        </h1>

        {/* Partie droite : affichage du profil ou bouton Log in / Sign up */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {user ? (
            // Utilisateur connecté : affichage élégant du profil
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
                <span
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '1rem',
                  }}
                >
                  {user.username}
                </span>
                <span
                  style={{
                    fontFamily: 'Arial, sans-serif',
                    color: '#777',
                    fontSize: '0.85rem',
                  }}
                >
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
          )}
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <div
        style={{
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
        }}
      >
        {/* Colonne de gauche - Information principale */}
        <main
          style={{
            padding: '2rem',
            color: '#fff',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '10px',
            flex: '1 1 60%',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Module Information
          </h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Bienvenue sur la page du module Information. Ici, vous pouvez accéder aux informations générales.
          </p>

          {/* Section Objets Connectés */}
          <section style={{ marginTop: '2rem' }}>
            <h2
              style={{
                fontSize: '1.8rem',
                marginBottom: '1.5rem',
                borderBottom: '2px solid #D35400',
                paddingBottom: '0.5rem',
              }}
            >
              Liste des Objets Connectés
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {connectedDevices.map((device) => (
                <div
                  key={device.id}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
                    {device.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Colonne de droite - Actualités */}
        <aside
          style={{
            padding: '2rem',
            color: '#fff',
            backgroundColor: 'rgba(211, 84, 0, 0.8)',
            borderRadius: '10px',
            flex: '1 1 30%',
            maxWidth: '400px',
          }}
        >
          <h2
            style={{
              fontSize: '1.8rem',
              marginBottom: '1.5rem',
              borderBottom: '2px solid #fff',
              paddingBottom: '0.5rem',
            }}
          >
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

          {/* Liste des actualités */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>12/03/2023 :</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>
                Une nouvelle mise à jour du système de sécurité a été déployée.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>10/03/2023 :</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>
                Les capteurs de température ont été calibrés pour une meilleure précision.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ margin: '0', fontWeight: 'bold' }}>08/03/2023 :</p>
              <p style={{ margin: '0.2rem 0 0 0' }}>
                Une maintenance est prévue pour le 15 mars. Certains services pourraient être indisponibles.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* FOOTER */}
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
