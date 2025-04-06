import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function ModuleGestion() {
  // États pour la gestion des objets connectés
  const [connectedDevices, setConnectedDevices] = useState([
    {
      id: 1,
      name: 'Thermostat Salon',
      type: 'thermostat',
      status: 'actif',
      room: 'Salon',
      temperature: 22,
      targetTemperature: 23,
      energyConsumption: 45,
      lastMaintenance: '2024-03-15',
      batteryLevel: 85
    },
    {
      id: 2,
      name: 'Climatiseur Chambre',
      type: 'climatiseur',
      status: 'inactif',
      room: 'Chambre Principale',
      currentMode: 'Veille',
      temperature: 18,
      energyConsumption: 0,
      lastMaintenance: '2024-02-20',
      batteryLevel: 100
    },
    {
      id: 3,
      name: 'Volets Automatiques Salon',
      type: 'volets',
      status: 'actif',
      room: 'Salon',
      openPercentage: 50,
      currentPosition: 'Mi-ouverts',
      energyConsumption: 15,
      lastMaintenance: '2024-04-01',
      batteryLevel: 75
    },
    {
      id: 4,
      name: 'Capteur de Présence Entrée',
      type: 'sécurité',
      status: 'actif',
      room: 'Entrée',
      movementDetected: false,
      lastMovement: '2024-04-05 10:35:22',
      energyConsumption: 5,
      lastMaintenance: '2024-03-25',
      batteryLevel: 90
    },
    {
      id: 5,
      name: 'Station Météo Extérieure',
      type: 'météo',
      status: 'actif',
      room: 'Extérieur',
      temperature: 15,
      humidity: 65,
      windSpeed: 12,
      precipitation: 0,
      energyConsumption: 10,
      lastMaintenance: '2024-03-10',
      batteryLevel: 95
    },
    {
      id: 6,
      name: 'Caméra de Sécurité Jardin',
      type: 'sécurité',
      status: 'inactif',
      room: 'Jardin',
      recordingStatus: 'Arrêté',
      motionSensitivity: 'Moyen',
      energyConsumption: 0,
      lastMaintenance: '2024-02-15',
      batteryLevel: 60
    },
    {
      id: 7,
      name: 'Éclairage Salon Intelligent',
      type: 'lumière',
      status: 'actif',
      room: 'Salon',
      brightness: 70,
      colorTemperature: 3000,
      energyConsumption: 25,
      lastMaintenance: '2024-03-30',
      batteryLevel: 100
    },
    {
      id: 8,
      name: 'Détecteur de Fumée Cuisine',
      type: 'sécurité',
      status: 'actif',
      room: 'Cuisine',
      smokeDetected: false,
      carbonMonoxideLevel: 0,
      energyConsumption: 3,
      lastMaintenance: '2024-03-20',
      batteryLevel: 88
    },
    {
      id: 9,
      name: 'Thermomètre Salon',
      type: 'météo',
      status: 'actif',
      room: 'Salon',
      temperature: 21,
      energyConsumption: 5,
      lastMaintenance: '2024-04-03',
      batteryLevel: 80
    }
  ]);

  // États pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // États pour la gestion de l'interface
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Gestion du scroll pour header et footer
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

  // Fonction de filtrage des appareils
  const filteredDevices = connectedDevices.filter(device =>
    (typeFilter === 'all' || device.type === typeFilter) &&
    (statusFilter === 'all' || device.status === statusFilter) &&
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour ouvrir les détails d'un appareil
  const handleDeviceDetails = (device) => {
    setSelectedDevice(device);
  };

  // Fonction de demande de suppression d'un appareil
  const handleRequestDeviceDeletion = (deviceId) => {
    console.log(`Demande de suppression pour l'appareil ${deviceId}`);
  };

  // Styles réutilisables
  const styles = {
    backgroundOverlay: {
      position: 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.4)', 
      backdropFilter: 'blur(8px)', 
      zIndex: 1 
    },
    header: {
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
    },
    footer: {
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
    }
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100%',
      minHeight: '100vh',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Overlay d'assombrissement */}
      <div style={styles.backgroundOverlay} />

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

      {/* Header */}
      <header style={styles.header}>
        <img src={logoImage} alt="CYHOME Logo" style={{ height: '50px' }} />
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#D35400' }}>Module Gestion</h1>
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

      {/* Contenu Principal */}
      <div style={{
        display: 'flex',
        padding: '0 2rem',
        marginTop: '120px',
        marginBottom: '120px',
        position: 'relative',
        zIndex: 1,
        justifyContent: 'space-between',
        maxWidth: '1400px',
        margin: '120px auto',
        gap: '2rem',
      }}>
        {/* Colonne Gauche - Liste des Objets Connectés */}
        <main style={{
          padding: '2rem',
          color: '#fff',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '10px',
          flex: '1 1 60%',
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Module Gestion</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Bienvenue sur la page du module Gestion. Ici, vous pouvez gérer vos objets connectés.
          </p>

          {/* Barre de recherche et filtres */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '1.5rem',
            gap: '1rem'
          }}>
            <input
              type="text"
              placeholder="Rechercher un appareil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}
            >
              <option value="all">Tous les types</option>
              <option value="thermostat">Thermostats</option>
              <option value="climatiseur">Climatiseurs</option>
              <option value="volets">Volets</option>
              <option value="lumière">Éclairages</option>
              <option value="sécurité">Sécurité</option>
              <option value="météo">Météo</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: 'rgba(255,255,255,0.9)'
              }}
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>

          {/* Liste des appareils */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {filteredDevices.map(device => (
              <div 
                key={device.id}
                style={{
                  backgroundColor: 'rgba(211, 84, 0, 0.2)',
                  padding: '1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(211, 84, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  transform: 'scale(1)',
                  boxShadow: 'none',
                }}
                onClick={() => handleDeviceDetails(device)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
                  e.currentTarget.style.backgroundColor = 'rgba(211, 84, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.backgroundColor = 'rgba(211, 84, 0, 0.2)';
                }}
              >
                <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>{device.name}</h3>
                <p style={{ color: '#ddd', margin: '0 0 0.5rem 0' }}>Type : {device.type}</p>
                <p style={{ color: '#ddd', margin: '0 0 0.5rem 0' }}>Statut : {device.status}</p>
                <p style={{ color: '#ddd', margin: '0' }}>Consommation : {device.energyConsumption} W</p>
              </div>
            ))}
          </div>
        </main>

        {/* Colonne Droite - Détails et Actions */}
        <aside style={{
          padding: '2rem',
          color: '#fff',
          backgroundColor: 'rgba(211, 84, 0, 0.8)',
          borderRadius: '10px',
          flex: '1 1 30%',
          maxWidth: '400px',
        }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            marginBottom: '1.5rem', 
            borderBottom: '2px solid #fff', 
            paddingBottom: '0.5rem' 
          }}>
            {selectedDevice ? selectedDevice.name : 'Détails de l\'appareil'}
          </h2>

          {selectedDevice ? (
            <div>
              {/* Informations de base */}
              <div style={{ marginBottom: '1rem' }}>
                <strong>Type :</strong> {selectedDevice.type}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Pièce :</strong> {selectedDevice.room}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Statut :</strong> {selectedDevice.status}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Dernière maintenance :</strong> {selectedDevice.lastMaintenance}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Consommation énergétique :</strong> {selectedDevice.energyConsumption} W
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Niveau de batterie :</strong> {selectedDevice.batteryLevel}%
              </div>

              {/* Informations spécifiques au type d'appareil */}
              {selectedDevice.type === 'thermostat' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Température actuelle :</strong> {selectedDevice.temperature}°C
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Température cible :</strong> {selectedDevice.targetTemperature}°C
                  </div>
                </>
              )}

              {selectedDevice.type === 'climatiseur' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Mode actuel :</strong> {selectedDevice.currentMode}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Température :</strong> {selectedDevice.temperature}°C
                  </div>
                </>
              )}

              {selectedDevice.type === 'volets' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Position :</strong> {selectedDevice.currentPosition}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Ouverture :</strong> {selectedDevice.openPercentage}%
                  </div>
                </>
              )}

              {selectedDevice.type === 'sécurité' && (
                <>
                  {selectedDevice.name.includes('Présence') && (
                    <>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Mouvement détecté :</strong> {selectedDevice.movementDetected ? 'Oui' : 'Non'}
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Dernier mouvement :</strong> {selectedDevice.lastMovement}
                      </div>
                    </>
                  )}
                  {selectedDevice.name.includes('Caméra') && (
                    <>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Statut d'enregistrement :</strong> {selectedDevice.recordingStatus}
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Sensibilité au mouvement :</strong> {selectedDevice.motionSensitivity}
                      </div>
                    </>
                  )}
                  {selectedDevice.name.includes('Fumée') && (
                    <>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Fumée détectée :</strong> {selectedDevice.smokeDetected ? 'Oui' : 'Non'}
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <strong>Niveau de monoxyde de carbone :</strong> {selectedDevice.carbonMonoxideLevel}
                      </div>
                    </>
                  )}
                </>
              )}

              {selectedDevice.type === 'météo' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Température :</strong> {selectedDevice.temperature}°C
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Humidité :</strong> {selectedDevice.humidity}%
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Vitesse du vent :</strong> {selectedDevice.windSpeed} km/h
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Précipitations :</strong> {selectedDevice.precipitation} mm
                  </div>
                </>
              )}

              {selectedDevice.type === 'lumière' && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Luminosité :</strong> {selectedDevice.brightness}%
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Température de couleur :</strong> {selectedDevice.colorTemperature} K
                  </div>
                </>
              )}

              {/* Boutons d'action */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => console.log(`Configurer ${selectedDevice.name}`)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#D35400';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Configurer
                </button>
                <button
                  onClick={() => handleRequestDeviceDeletion(selectedDevice.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    padding: '0.5rem 1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#D35400';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Demander Suppression
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.7)',
              padding: '2rem 0'
            }}>
              Sélectionnez un appareil pour voir ses détails
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        {/* Section gauche avec logo CYHOME */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '25px',
          }}
        >
          <img src={logoImage} alt="CYHOME Logo" style={{ height: '65px' }} />
          <div>
            <p style={{ margin: 0, color: '#333' }}>Créé par l'équipe CYHOME</p>
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

export default ModuleGestion;
