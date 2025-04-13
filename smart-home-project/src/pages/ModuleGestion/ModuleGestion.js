import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';
// Importation pour la génération de PDF
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function ModuleGestion() {

  const navigate = useNavigate(); // Ajout de la navigation
  const [isNavigating, setIsNavigating] = useState(false); // Nouvel état pour la navigation

  // Fonction de navigation avec transition
  const handleNavigateHome = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

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
  
  // État pour la modal d'ajout d'un nouvel objet
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'thermostat',
    status: 'actif',
    room: '',
    energyConsumption: 0,
    lastMaintenance: new Date().toISOString().split('T')[0],
    batteryLevel: 100
  });
  
  // Nouveaux états pour les fonctionnalités demandées
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

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

  // Fonction pour gérer le changement des champs du nouvel appareil
  const handleNewDeviceChange = (e) => {
    const { name, value } = e.target;
    setNewDevice({
      ...newDevice,
      [name]: value
    });
  };
  
  // Fonction pour ajouter un nouvel appareil
  const handleAddDevice = () => {
    // Création d'un objet avec les propriétés de base et spécifiques au type
    const deviceToAdd = {
      id: connectedDevices.length + 1,
      ...newDevice
    };
    
    // Ajout de propriétés spécifiques selon le type d'appareil
    switch(newDevice.type) {
      case 'thermostat':
        deviceToAdd.temperature = 20;
        deviceToAdd.targetTemperature = 22;
        break;
      case 'climatiseur':
        deviceToAdd.temperature = 20;
        deviceToAdd.currentMode = 'Veille';
        break;
      case 'volets':
        deviceToAdd.openPercentage = 0;
        deviceToAdd.currentPosition = 'Fermés';
        break;
      case 'lumière':
        deviceToAdd.brightness = 50;
        deviceToAdd.colorTemperature = 3000;
        break;
      case 'sécurité':
        if (newDevice.name.toLowerCase().includes('caméra')) {
          deviceToAdd.recordingStatus = 'Arrêté';
          deviceToAdd.motionSensitivity = 'Moyen';
        } else if (newDevice.name.toLowerCase().includes('présence') || 
                  newDevice.name.toLowerCase().includes('presence') ||
                  newDevice.name.toLowerCase().includes('mouvement')) {
          deviceToAdd.movementDetected = false;
          deviceToAdd.lastMovement = new Date().toISOString().replace('T', ' ').substr(0, 19);
        } else if (newDevice.name.toLowerCase().includes('fumée') || 
                  newDevice.name.toLowerCase().includes('fumee')) {
          deviceToAdd.smokeDetected = false;
          deviceToAdd.carbonMonoxideLevel = 0;
        }
        break;
      case 'météo':
        deviceToAdd.temperature = 20;
        if (newDevice.name.toLowerCase().includes('station')) {
          deviceToAdd.humidity = 50;
          deviceToAdd.windSpeed = 0;
          deviceToAdd.precipitation = 0;
        }
        break;
      default:
        break;
    }
    
    // Ajout de l'appareil à la liste
    setConnectedDevices([...connectedDevices, deviceToAdd]);
    
    // Réinitialisation et fermeture de la modal
    setNewDevice({
      name: '',
      type: 'thermostat',
      status: 'actif',
      room: '',
      energyConsumption: 0,
      lastMaintenance: new Date().toISOString().split('T')[0],
      batteryLevel: 100
    });
    setShowAddModal(false);
  };
  
  // Fonction pour ouvrir la modal de configuration d'un appareil
  const handleOpenConfigModal = (device) => {
    setDeviceToEdit({...device});
    setShowConfigModal(true);
  };
  
  // Fonction pour gérer la modification d'un appareil
  const handleDeviceEditChange = (e) => {
    const { name, value } = e.target;
    setDeviceToEdit({
      ...deviceToEdit,
      [name]: value
    });
  };
  
  // Fonction pour gérer la modification de champs numériques
  const handleNumericEditChange = (e) => {
    const { name, value } = e.target;
    setDeviceToEdit({
      ...deviceToEdit,
      [name]: Number(value)
    });
  };
  
  // Fonction pour enregistrer les modifications d'un appareil
  const handleSaveDeviceChanges = () => {
    // Mise à jour de l'appareil dans la liste
    const updatedDevices = connectedDevices.map(device => 
      device.id === deviceToEdit.id ? deviceToEdit : device
    );
    
    setConnectedDevices(updatedDevices);
    
    // Mise à jour de l'appareil sélectionné pour l'affichage des détails
    if (selectedDevice && selectedDevice.id === deviceToEdit.id) {
      setSelectedDevice(deviceToEdit);
    }
    
    // Fermeture de la modal
    setShowConfigModal(false);
  };
  
  // Fonction pour demander la suppression d'un appareil
  const handleRequestDeviceDeletion = (deviceId) => {
    setShowDeleteConfirmation(true);
  };
  
  // Fonction pour confirmer la demande de suppression
  const handleConfirmDeletion = () => {
    setShowDeleteConfirmation(false);
    setDeletionSuccess(true);
    
    // Fermeture automatique du message de succès après 3 secondes
    setTimeout(() => {
      setDeletionSuccess(false);
    }, 3000);
  };
  
  // Fonction pour générer et télécharger un rapport PDF
  const handleGenerateReport = (device) => {
    // Création d'une nouvelle instance de jsPDF
    const doc = new jsPDF();
    
    // Titre du rapport
    doc.setFontSize(22);
    doc.setTextColor(211, 84, 0); // #D35400
    doc.text('Rapport Objet Connecté - CYHOME', 105, 20, { align: 'center' });
    
    // Informations générales
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Informations Générales', 20, 40);
    
    // Ajout des informations générales
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    let yPosition = 50;
    const xPosition = 20;
    const lineHeight = 8;
    
    doc.text(`Nom : ${device.name}`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Type : ${device.type}`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Statut : ${device.status}`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Pièce : ${device.room}`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Consommation énergétique : ${device.energyConsumption} W`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Niveau de batterie : ${device.batteryLevel}%`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Dernière maintenance : ${device.lastMaintenance}`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Informations spécifiques selon le type d'appareil
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Informations Spécifiques', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    
    doc.setFontSize(12);
    
    switch(device.type) {
      case 'thermostat':
        doc.text(`Température actuelle : ${device.temperature}°C`, xPosition, yPosition);
        yPosition += lineHeight;
        doc.text(`Température cible : ${device.targetTemperature}°C`, xPosition, yPosition);
        yPosition += lineHeight;
        break;
      case 'climatiseur':
        doc.text(`Mode actuel : ${device.currentMode}`, xPosition, yPosition);
        yPosition += lineHeight;
        doc.text(`Température : ${device.temperature}°C`, xPosition, yPosition);
        yPosition += lineHeight;
        break;
      case 'volets':
        doc.text(`Position : ${device.currentPosition}`, xPosition, yPosition);
        yPosition += lineHeight;
        doc.text(`Ouverture : ${device.openPercentage}%`, xPosition, yPosition);
        yPosition += lineHeight;
        break;
      case 'lumière':
        doc.text(`Luminosité : ${device.brightness}%`, xPosition, yPosition);
        yPosition += lineHeight;
        doc.text(`Température de couleur : ${device.colorTemperature} K`, xPosition, yPosition);
        yPosition += lineHeight;
        break;
      case 'sécurité':
        if (device.name.includes('Présence')) {
          doc.text(`Mouvement détecté : ${device.movementDetected ? 'Oui' : 'Non'}`, xPosition, yPosition);
          yPosition += lineHeight;
          doc.text(`Dernier mouvement : ${device.lastMovement}`, xPosition, yPosition);
          yPosition += lineHeight;
        } else if (device.name.includes('Caméra')) {
          doc.text(`Statut d'enregistrement : ${device.recordingStatus}`, xPosition, yPosition);
          yPosition += lineHeight;
          doc.text(`Sensibilité au mouvement : ${device.motionSensitivity}`, xPosition, yPosition);
          yPosition += lineHeight;
        } else if (device.name.includes('Fumée')) {
          doc.text(`Fumée détectée : ${device.smokeDetected ? 'Oui' : 'Non'}`, xPosition, yPosition);
          yPosition += lineHeight;
          doc.text(`Niveau de monoxyde de carbone : ${device.carbonMonoxideLevel}`, xPosition, yPosition);
          yPosition += lineHeight;
        }
        break;
      case 'météo':
        doc.text(`Température : ${device.temperature}°C`, xPosition, yPosition);
        yPosition += lineHeight;
        
        if (device.humidity !== undefined) {
          doc.text(`Humidité : ${device.humidity}%`, xPosition, yPosition);
          yPosition += lineHeight;
        }
        
        if (device.windSpeed !== undefined) {
          doc.text(`Vitesse du vent : ${device.windSpeed} km/h`, xPosition, yPosition);
          yPosition += lineHeight;
        }
        
        if (device.precipitation !== undefined) {
          doc.text(`Précipitations : ${device.precipitation} mm`, xPosition, yPosition);
          yPosition += lineHeight;
        }
        break;
      default:
        break;
    }
    
    // Ajout de la date et heure de génération du rapport
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    
    yPosition += lineHeight * 2;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Rapport généré le ${dateString} à ${timeString}`, xPosition, yPosition);
    
    // Téléchargement du PDF
    doc.save(`Rapport_${device.name.replace(/\s+/g, '_')}_${dateString.replace(/\//g, '-')}.pdf`);
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
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '10px',
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto'
    },
    confirmationModal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    confirmationContent: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '10px',
      textAlign: 'center',
      maxWidth: '400px'
    },
    successNotification: {
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(39, 174, 96, 0.9)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '5px',
      zIndex: 1000,
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    formLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: '#333'
    },
    formInput: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '1rem'
    },
    button: {
      backgroundColor: '#D35400',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-block',
      textAlign: 'center',
      margin: '0 0.5rem'
    },
    transparentButton: {
      backgroundColor: 'transparent',
      color: 'white',
      border: '2px solid white',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
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
      opacity: isNavigating ? 0 : 1, // Ajout de l'effet de transition
      transition: 'opacity 0.5s ease' // Ajout de la transition
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
        onClick={handleNavigateHome} // Modification du onClick
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
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '2rem' 
          }}>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: 0 }}>
              Bienvenue sur la page du module Gestion. Ici, vous pouvez gérer vos objets connectés.
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#D35400',
                color: 'white',
                padding: '0.75rem 1.25rem',
                borderRadius: '5px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F17F2B';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#D35400';
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>+</span> Ajouter un nouvel objet
            </button>
          </div>

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
                  {selectedDevice.humidity !== undefined && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Humidité :</strong> {selectedDevice.humidity}%
                    </div>
                  )}
                  {selectedDevice.windSpeed !== undefined && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Vitesse du vent :</strong> {selectedDevice.windSpeed} km/h
                    </div>
                  )}
                  {selectedDevice.precipitation !== undefined && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Précipitations :</strong> {selectedDevice.precipitation} mm
                    </div>
                  )}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => handleOpenConfigModal(selectedDevice)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    padding: '0.75rem 1rem',
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
                    padding: '0.75rem 1rem',
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
                  Demander suppression à l'administrateur
                </button>
                <button
                  onClick={() => handleGenerateReport(selectedDevice)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '2px solid white',
                    padding: '0.75rem 1rem',
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
                  Générer un rapport
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

      {/* Modal d'ajout d'un nouvel objet */}
      {showAddModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{ color: '#D35400', marginBottom: '1.5rem', textAlign: 'center' }}>
              Ajouter un nouvel objet connecté
            </h2>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nom de l'appareil</label>
              <input
                type="text"
                name="name"
                value={newDevice.name}
                onChange={handleNewDeviceChange}
                placeholder="Ex: Thermostat Cuisine"
                style={styles.formInput}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Type d'appareil</label>
              <select 
                name="type" 
                value={newDevice.type}
                onChange={handleNewDeviceChange}
                style={styles.formInput}
              >
                <option value="thermostat">Thermostat</option>
                <option value="climatiseur">Climatiseur</option>
                <option value="volets">Volets</option>
                <option value="lumière">Éclairage</option>
                <option value="sécurité">Sécurité</option>
                <option value="météo">Météo</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Pièce</label>
              <input
                type="text"
                name="room"
                value={newDevice.room}
                onChange={handleNewDeviceChange}
                placeholder="Ex: Cuisine, Salon, Chambre..."
                style={styles.formInput}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Statut</label>
              <select 
                name="status" 
                value={newDevice.status}
                onChange={handleNewDeviceChange}
                style={styles.formInput}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Consommation énergétique (W)</label>
              <input
                type="number"
                name="energyConsumption"
                value={newDevice.energyConsumption}
                onChange={handleNewDeviceChange}
                min="0"
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Niveau de batterie (%)</label>
              <input
                type="number"
                name="batteryLevel"
                value={newDevice.batteryLevel}
                onChange={handleNewDeviceChange}
                min="0"
                max="100"
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Date de dernière maintenance</label>
              <input
                type="date"
                name="lastMaintenance"
                value={newDevice.lastMaintenance}
                onChange={handleNewDeviceChange}
                style={styles.formInput}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  ...styles.button,
                  backgroundColor: '#999',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#777';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#999';
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleAddDevice}
                style={styles.button}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F17F2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                }}
                disabled={!newDevice.name || !newDevice.room}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de configuration d'un appareil */}
      {showConfigModal && deviceToEdit && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={{ color: '#D35400', marginBottom: '1.5rem', textAlign: 'center' }}>
              Configurer {deviceToEdit.name}
            </h2>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nom de l'appareil</label>
              <input
                type="text"
                name="name"
                value={deviceToEdit.name}
                onChange={handleDeviceEditChange}
                style={styles.formInput}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Pièce</label>
              <input
                type="text"
                name="room"
                value={deviceToEdit.room}
                onChange={handleDeviceEditChange}
                style={styles.formInput}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Statut</label>
              <select 
                name="status" 
                value={deviceToEdit.status}
                onChange={handleDeviceEditChange}
                style={styles.formInput}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Consommation énergétique (W)</label>
              <input
                type="number"
                name="energyConsumption"
                value={deviceToEdit.energyConsumption}
                onChange={handleNumericEditChange}
                min="0"
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Niveau de batterie (%)</label>
              <input
                type="number"
                name="batteryLevel"
                value={deviceToEdit.batteryLevel}
                onChange={handleNumericEditChange}
                min="0"
                max="100"
                style={styles.formInput}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Date de dernière maintenance</label>
              <input
                type="date"
                name="lastMaintenance"
                value={deviceToEdit.lastMaintenance}
                onChange={handleDeviceEditChange}
                style={styles.formInput}
              />
            </div>
            
            {/* Champs spécifiques selon le type d'appareil */}
            {deviceToEdit.type === 'thermostat' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Température actuelle (°C)</label>
                  <input
                    type="number"
                    name="temperature"
                    value={deviceToEdit.temperature}
                    onChange={handleNumericEditChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Température cible (°C)</label>
                  <input
                    type="number"
                    name="targetTemperature"
                    value={deviceToEdit.targetTemperature}
                    onChange={handleNumericEditChange}
                    style={styles.formInput}
                  />
                </div>
              </>
            )}
            
            {deviceToEdit.type === 'climatiseur' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Mode actuel</label>
                  <select
                    name="currentMode"
                    value={deviceToEdit.currentMode}
                    onChange={handleDeviceEditChange}
                    style={styles.formInput}
                  >
                    <option value="Veille">Veille</option>
                    <option value="Froid">Froid</option>
                    <option value="Chaud">Chaud</option>
                    <option value="Auto">Auto</option>
                    <option value="Déshumidification">Déshumidification</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Température (°C)</label>
                  <input
                    type="number"
                    name="temperature"
                    value={deviceToEdit.temperature}
                    onChange={handleNumericEditChange}
                    style={styles.formInput}
                  />
                </div>
              </>
            )}
            
            {deviceToEdit.type === 'volets' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Position</label>
                  <select
                    name="currentPosition"
                    value={deviceToEdit.currentPosition}
                    onChange={handleDeviceEditChange}
                    style={styles.formInput}
                  >
                    <option value="Fermés">Fermés</option>
                    <option value="Mi-ouverts">Mi-ouverts</option>
                    <option value="Ouverts">Ouverts</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Pourcentage d'ouverture (%)</label>
                  <input
                    type="number"
                    name="openPercentage"
                    value={deviceToEdit.openPercentage}
                    onChange={handleNumericEditChange}
                    min="0"
                    max="100"
                    style={styles.formInput}
                  />
                </div>
              </>
            )}
            
            {deviceToEdit.type === 'lumière' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Luminosité (%)</label>
                  <input
                    type="number"
                    name="brightness"
                    value={deviceToEdit.brightness}
                    onChange={handleNumericEditChange}
                    min="0"
                    max="100"
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Température de couleur (K)</label>
                  <input
                    type="number"
                    name="colorTemperature"
                    value={deviceToEdit.colorTemperature}
                    onChange={handleNumericEditChange}
                    min="1000"
                    max="10000"
                    style={styles.formInput}
                  />
                </div>
              </>
            )}
            
            {deviceToEdit.type === 'météo' && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Température (°C)</label>
                  <input
                    type="number"
                    name="temperature"
                    value={deviceToEdit.temperature}
                    onChange={handleNumericEditChange}
                    style={styles.formInput}
                  />
                </div>
                {deviceToEdit.humidity !== undefined && (
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Humidité (%)</label>
                    <input
                      type="number"
                      name="humidity"
                      value={deviceToEdit.humidity}
                      onChange={handleNumericEditChange}
                      min="0"
                      max="100"
                      style={styles.formInput}
                    />
                  </div>
                )}
                {deviceToEdit.windSpeed !== undefined && (
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Vitesse du vent (km/h)</label>
                    <input
                      type="number"
                      name="windSpeed"
                      value={deviceToEdit.windSpeed}
                      onChange={handleNumericEditChange}
                      min="0"
                      style={styles.formInput}
                    />
                  </div>
                )}
                {deviceToEdit.precipitation !== undefined && (
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Précipitations (mm)</label>
                    <input
                      type="number"
                      name="precipitation"
                      value={deviceToEdit.precipitation}
                      onChange={handleNumericEditChange}
                      min="0"
                      style={styles.formInput}
                    />
                  </div>
                )}
              </>
            )}
            
            {deviceToEdit.type === 'sécurité' && deviceToEdit.name.includes('Caméra') && (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Statut d'enregistrement</label>
                  <select
                    name="recordingStatus"
                    value={deviceToEdit.recordingStatus}
                    onChange={handleDeviceEditChange}
                    style={styles.formInput}
                  >
                    <option value="Arrêté">Arrêté</option>
                    <option value="Actif">Actif</option>
                    <option value="En pause">En pause</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Sensibilité au mouvement</label>
                  <select
                    name="motionSensitivity"
                    value={deviceToEdit.motionSensitivity}
                    onChange={handleDeviceEditChange}
                    style={styles.formInput}
                  >
                    <option value="Faible">Faible</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Élevé">Élevé</option>
                  </select>
                </div>
              </>
            )}
            
            {deviceToEdit.type === 'sécurité' && deviceToEdit.name.includes('Fumée') && (
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Niveau de monoxyde de carbone</label>
                <input
                  type="number"
                  name="carbonMonoxideLevel"
                  value={deviceToEdit.carbonMonoxideLevel}
                  onChange={handleNumericEditChange}
                  min="0"
                  style={styles.formInput}
                />
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{
                  ...styles.button,
                  backgroundColor: '#999',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#777';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#999';
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveDeviceChanges}
                style={styles.button}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F17F2B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#D35400';
                }}
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation de demande de suppression */}
      {showDeleteConfirmation && (
        <div style={styles.confirmationModal}>
          <div style={styles.confirmationContent}>
            <h3 style={{ color: '#D35400', marginBottom: '1.5rem' }}>
              Demande de suppression
            </h3>
            <p style={{ marginBottom: '2rem' }}>
              Voulez-vous vraiment demander la suppression de cet appareil à l'administrateur ?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                style={{
                  ...styles.button,
                  backgroundColor: '#999'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#777';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#999';
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDeletion}
                style={{
                  ...styles.button,
                  backgroundColor: '#E74C3C'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C0392B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E74C3C';
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification de succès pour la demande de suppression */}
      {deletionSuccess && (
        <div style={styles.successNotification}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            <span style={{ marginRight: '10px' }}>✓</span> Demande de suppression envoyée avec succès
          </p>
        </div>
      )}

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