import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

// Une fonction qui retourne une icône selon le type
const getIconForType = (type) => {
  switch (type.toLowerCase()) {
    case 'thermostat':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,22c-4.418,0-8-3.582-8-8c0-3.584,2.385-6.615,5.649-7.605C9.879,6.266,10,6.133,10,6V3c0-0.552,0.448-1,1-1h2 c0.552,0,1,0.448,1,1v3c0,0.133,0.121,0.266,0.351,0.395C17.615,7.385,20,10.416,20,14C20,18.418,16.418,22,12,22z M13,4h-2v2h2V4z M12,20c3.314,0,6-2.686,6-6c0-3.314-2.686-6-6-6s-6,2.686-6,6C6,17.314,8.686,20,12,20z M11,14.732V10c0-0.552,0.448-1,1-1 s1,0.448,1,1v4.732c0.616,0.357,1,1.025,1,1.768c0,1.105-0.895,2-2,2s-2-0.895-2-2C10,15.757,10.384,15.089,11,14.732z"/>
        </svg>
      );
    case 'climatiseur':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M21,9h-7V7c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v2H3C2.45,9,2,9.45,2,10v4c0,0.55,0.45,1,1,1h7v2c0,0.55,0.45,1,1,1h2 c0.55,0,1-0.45,1-1v-2h7c0.55,0,1-0.45,1-1v-4C22,9.45,21.55,9,21,9z"/>
        </svg>
      );
    case 'volets':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M19,4H5C3.89,4,3,4.9,3,6v12c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,18H5V6h14V18z"/>
        </svg>
      );
    case 'lumière':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,2C8.13,2,5,5.13,5,9c0,2.38,1.19,4.47,3,5.74V17c0,0.55,0.45,1,1,1h1v2c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-2h1 c0.55,0,1-0.45,1-1v-2.26c1.81-1.27,3-3.36,3-5.74C19,5.13,15.87,2,12,2z"/>
        </svg>
      );
    case 'sécurité':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z"/>
        </svg>
      );
    case 'météo':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
          <path d="M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13 c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z"/>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      );
  }
};



function ModuleInformation() {

  const [user, setUser] = useState(null);

  const [newNewsText, setNewNewsText] = useState('');
  const [newNewsType, setNewNewsType] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchText, setSearchText] = useState('');


  const handleAddNews = () => {
    if (newNewsText.trim() === '' || newNewsType.trim() === '') return;
  
    const newEntry = {
      date: new Date().toLocaleDateString('fr-FR'),
      dateRaw: new Date().toISOString(), 
      text: newNewsText.trim(),
      type: newNewsType.trim()
    };
    
    
    const updatedNews = [newEntry, ...news];
    setNews(updatedNews);
    localStorage.setItem('news', JSON.stringify(updatedNews));
    setNewNewsText('');
    setNewNewsType('');
  };
  
  
  const fetchDevices = async () => {
    try {
      const response = await fetch('http://localhost:3020/plateforme/smart-home-project/api/device.php', { credentials: 'include' });
      const data = await response.json();
      const devicesWithIcons = data.devices.map(device => ({
        ...device,
        icon: getIconForType(device.type)
      }));
      setConnectedDevices(devicesWithIcons);
    } catch (error) {
      console.error('Erreur fetchDevices:', error);
    }
  };
  
  useEffect(() => {
    fetchDevices();
  }, []);
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [dateFilter, setDateFilter] = useState('all');

  // État des objets connectés avec leurs icônes SVG intégrées
  const [connectedDevices, setConnectedDevices] = useState([]);

  const [news, setNews] = useState(() => {
    const savedNews = localStorage.getItem('news');
    return savedNews ? JSON.parse(savedNews) : [];
  });
  
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

  const typeCounts = connectedDevices.reduce((acc, device) => {
    acc[device.type] = (acc[device.type] || 0) + 1;
    return acc;
  }, {});

  // Créer une liste unique des types d'appareils
  const uniqueDevicesByType = Object.keys(typeCounts).map((type) => ({
    type,
    icon: connectedDevices.find((device) => device.type === type)?.icon || null,
  }));

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
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <img
                src={user.photo || "/default-avatar.png"}
                alt="Profil"
                style={{
                  height: '40px',
                  width: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #D35400'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.85rem' }}>
                <span style={{ color: '#D35400', fontWeight: 'bold' }}>{user.username}</span>
                <span style={{ color: '#666' }}>{user.role} – {user.points} pts</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                color: '#D35400',
                padding: '0.4rem 0.8rem',
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
              Déconnexion
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
            {/* Nombre total d'objets */}
            <p style={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
              color: '#D35400',
              fontWeight: 'bold'
            }}>
              Nombre total d'objets connectés : {connectedDevices.length}
            </p>

            {/* Nombre par type */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              {Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} style={{
                  backgroundColor: '#D35400',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '0.9rem'
                }}>
                  {type} ({count})
                </div>
              ))}
            </div>


            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1.5rem' }}>
              {uniqueDevicesByType.map(device => (
                <div
                  key={device.type}
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
                    {device.type}
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

  {/* Champ pour ajouter une actualité si admin */}
    {user?.role === 'admin' && (
      <div style={{ marginBottom: '1rem' }}>
        <textarea
          value={newNewsText}
          onChange={(e) => setNewNewsText(e.target.value)}
          placeholder="Écrire une nouvelle actualité..."
          style={{
            width: '100%',
            height: '80px',
            padding: '0.5rem',
            borderRadius: '5px',
            border: 'none',
            marginBottom: '0.5rem',
          }}
        />
        <select
          value={newNewsType}
          onChange={(e) => setNewNewsType(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <option value="">Choisir le type</option>
          <option value="maintenance">🛠️ Maintenance</option>
          <option value="update">🔄 Mise à jour</option>
          <option value="alert">⚠️ Alerte</option>
          <option value="info">ℹ️ Information</option>
        </select>

        <button
          onClick={handleAddNews}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            backgroundColor: '#D35400',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Ajouter
        </button>
      </div>
    )}

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
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      {/* Champ pour filtrer par date */}
      <select
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
        style={{
          flex: 1,
          padding: '0.5rem',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <option value="all">Toutes les dates</option>
        <option value="today">Aujourd'hui</option>
        <option value="week">Cette semaine</option>
        <option value="month">Ce mois</option>
      </select>

      {/* Champ pour filtrer par type */}
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        style={{
          flex: 1,
          padding: '0.5rem',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }}
      >
        <option value="all">Tous les types</option>
        <option value="maintenance">Maintenance</option>
        <option value="update">Mise à jour</option>
        <option value="alert">Alerte</option>
        <option value="info">Information</option>
      </select>
    </div>

    </div>

    {/* Liste des actualités dynamiques */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    {/* Filtrage des news selon texte, date et type */}
{(() => {
 const filteredNews = news.filter(entry => {
  const matchesText = entry.text.toLowerCase().includes(searchText.toLowerCase());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // lundi
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);
  const entryDate = new Date(entry.dateRaw);

const matchesDate =
  dateFilter === 'all' ||
  (dateFilter === 'today' &&
    entryDate.getFullYear() === today.getFullYear() &&
    entryDate.getMonth() === today.getMonth() &&
    entryDate.getDate() === today.getDate()
  ) ||
  (dateFilter === 'week' &&
    entryDate >= startOfWeek && entryDate <= endOfWeek
  ) ||
  (dateFilter === 'month' &&
    entryDate >= startOfMonth && entryDate <= endOfMonth
  );

  const matchesType = typeFilter === 'all' || entry.type === typeFilter;

  return matchesText && matchesDate && matchesType;
});

  return filteredNews.length === 0 ? (
    <p>Aucune actualité pour le moment.</p>
  ) : (
    filteredNews.map((entry, index) => (
      <div key={`${entry.date}-${entry.text}-${index}`} style={{ marginBottom: '1rem' }}>
        <p style={{ margin: '0', fontWeight: 'bold' }}>{entry.date} :</p>
        <p style={{ margin: '0.2rem 0 0 0' }}>{entry.text}</p>
        {entry.type && (
          <span style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            backgroundColor: '#D35400',
            padding: '0.2rem 0.5rem',
            borderRadius: '5px',
            fontSize: '0.8rem',
            color: 'white'
          }}>
            {entry.type === 'maintenance' ? '🛠️ Maintenance' :
             entry.type === 'update' ? '🔄 Mise à jour' :
             entry.type === 'alert' ? '⚠️ Alerte' :
             'ℹ️ Information'}
          </span>
        )}
      </div>
    ))
  );
})()}

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