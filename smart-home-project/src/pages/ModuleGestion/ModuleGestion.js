import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';
// Importation pour la génération de PDF
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Remplacer la section DeviceIcons actuelle par celle-ci :
const DeviceIcons = {
  thermostat: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M12,22c-4.418,0-8-3.582-8-8c0-3.584,2.385-6.615,5.649-7.605C9.879,6.266,10,6.133,10,6V3c0-0.552,0.448-1,1-1h2 c0.552,0,1,0.448,1,1v3c0,0.133,0.121,0.266,0.351,0.395C17.615,7.385,20,10.416,20,14C20,18.418,16.418,22,12,22z M13,4h-2v2h2V4z M12,20c3.314,0,6-2.686,6-6c0-3.314-2.686-6-6-6s-6,2.686-6,6C6,17.314,8.686,20,12,20z M11,14.732V10c0-0.552,0.448-1,1-1 s1,0.448,1,1v4.732c0.616,0.357,1,1.025,1,1.768c0,1.105-0.895,2-2,2s-2-0.895-2-2C10,15.757,10.384,15.089,11,14.732z"/>
    </svg>
  ),
  climatiseur: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M21,9h-7V7c0-0.55-0.45-1-1-1h-2c-0.55,0-1,0.45-1,1v2H3C2.45,9,2,9.45,2,10v4c0,0.55,0.45,1,1,1h7v2c0,0.55,0.45,1,1,1h2 c0.55,0,1-0.45,1-1v-2h7c0.55,0,1-0.45,1-1v-4C22,9.45,21.55,9,21,9z M20,13h-7c-0.55,0-1,0.45-1,1v2h-2v-2c0-0.55-0.45-1-1-1H4 v-2h7c0.55,0,1-0.45,1-1V8h2v2c0,0.55,0.45,1,1,1h5V13z"/>
      <path d="M9,16h1.5v1.5H9V16z"/>
      <path d="M13.5,16H15v1.5h-1.5V16z"/>
      <path d="M9,12h1.5v1.5H9V12z"/>
      <path d="M13.5,12H15v1.5h-1.5V12z"/>
    </svg>
  ),
  volets: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M19,4H5C3.89,4,3,4.9,3,6v12c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6C21,4.9,20.1,4,19,4z M19,18H5V6h14V18z"/>
      <path d="M7,9h10v2H7V9z"/>
      <path d="M7,12h10v2H7V12z"/>
      <path d="M7,15h10v2H7V15z"/>
    </svg>
  ),
  lumière: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M12,2C8.13,2,5,5.13,5,9c0,2.38,1.19,4.47,3,5.74V17c0,0.55,0.45,1,1,1h1v2c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-2h1 c0.55,0,1-0.45,1-1v-2.26c1.81-1.27,3-3.36,3-5.74C19,5.13,15.87,2,12,2z"/>
    </svg>
  ),
  sécurité: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12l6,2.12V11.09z"/>
      <path d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3 S13.66,15,12,15z"/>
    </svg>
  ),
  météo: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#FFFFFF">
      <path d="M19.35,10.04C18.67,6.59,15.64,4,12,4C9.11,4,6.6,5.64,5.35,8.04C2.34,8.36,0,10.91,0,14c0,3.31,2.69,6,6,6h13 c2.76,0,5-2.24,5-5C24,12.36,21.95,10.22,19.35,10.04z"/>
    </svg>
  )
};

const getDeviceIcon = (type) => {
  return DeviceIcons[type] || (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
};

// Fonction utilitaire pour dessiner un graphique dans le PDF
const drawGraph = (doc, title, data, labels, startY, xPosition, height) => {
  doc.setFontSize(14);
  doc.text(title, xPosition, startY - 10);
  
  const graphStartX = 30;
  const graphStartY = startY;
  const graphWidth = 150;
  const graphHeight = height;
  const graphEndX = graphStartX + graphWidth;
  const graphEndY = graphStartY + graphHeight;
  
  // Dessiner les axes
  doc.setLineWidth(0.5);
  doc.line(graphStartX, graphStartY, graphStartX, graphEndY);
  doc.line(graphStartX, graphEndY, graphEndX, graphEndY);
  
  // Calculer le maximum pour l'échelle
  const maxValue = Math.max(...data) * 1.2;
  
  // Dessiner les graduations sur l'axe Y
  doc.setFontSize(8);
  for (let i = 0; i <= 4; i++) {
    const yPos = graphEndY - (i * graphHeight / 4);
    doc.line(graphStartX - 2, yPos, graphStartX, yPos);
    doc.text(`${(i * maxValue / 4).toFixed(1)}`, graphStartX - 15, yPos + 1);
  }
  
  // Dessiner les graduations sur l'axe X
  const step = Math.max(1, Math.floor(labels.length / 10));
  for (let i = 0; i < labels.length; i += step) {
    const xPos = graphStartX + (i * graphWidth / labels.length);
    doc.line(xPos, graphEndY, xPos, graphEndY + 2);
    doc.text(`${labels[i]}`, xPos - 2, graphEndY + 10);
  }
  
  // Tracer la courbe
  doc.setDrawColor(211, 84, 0);
  doc.setLineWidth(1);
  
  let prevX = graphStartX;
  let prevY = graphEndY - (data[0] / maxValue) * graphHeight;
  
  for (let i = 0; i < data.length; i++) {
    const xPos = graphStartX + (i * graphWidth / data.length);
    const yPos = graphEndY - (data[i] / maxValue) * graphHeight;
    
    doc.line(prevX, prevY, xPos, yPos);
    
    prevX = xPos;
    prevY = yPos;
  }
  
  return graphEndY + 20; // Retourner la position Y finale
};

// Fonction pour évaluer l'efficacité et l'état de maintenance d'un appareil
const evaluateDeviceStatus = (device) => {
  const alerts = [];
  const now = new Date();
  const lastMaintenance = new Date(device.lastMaintenance);
  const daysSinceMaintenance = Math.floor((now - lastMaintenance) / (1000 * 60 * 60 * 24));

  // Vérification de la maintenance
  if (daysSinceMaintenance > 90) {
    alerts.push({
      type: 'maintenance',
      message: 'Maintenance requise (dernière maintenance il y a plus de 3 mois)',
      severity: 'high'
    });
  }

  // Vérifications spécifiques selon le type d'appareil
  switch(device.type) {
    case 'thermostat':
      if (device.temperature > 25 || device.temperature < 18) {
        alerts.push({
          type: 'efficiency',
          message: 'Température non optimale pour l\'efficacité énergétique',
          severity: 'medium'
        });
      }
      if (device.energyConsumption > 50) {
        alerts.push({
          type: 'efficiency',
          message: 'Consommation énergétique élevée',
          severity: 'high'
        });
      }
      break;
    case 'climatiseur':
      if (device.energyConsumption > 1000) {
        alerts.push({
          type: 'efficiency',
          message: 'Consommation énergétique très élevée',
          severity: 'high'
        });
      }
      if (device.temperature < 20) {
        alerts.push({
          type: 'efficiency',
          message: 'Température trop basse pour l\'efficacité énergétique',
          severity: 'medium'
        });
      }
      break;
    case 'volets':
      if (device.energyConsumption > 20) {
        alerts.push({
          type: 'efficiency',
          message: 'Consommation énergétique anormalement élevée',
          severity: 'high'
        });
      }
      break;
    case 'lumière':
      if (device.brightness > 80 && device.energyConsumption > 30) {
        alerts.push({
          type: 'efficiency',
          message: 'Luminosité et consommation énergétique élevées',
          severity: 'medium'
        });
      }
      break;
    case 'sécurité':
      if (device.batteryLevel < 20) {
        alerts.push({
          type: 'maintenance',
          message: 'Niveau de batterie critique',
          severity: 'high'
        });
      }
      break;
  }

  // Vérification générale de la batterie
  if (device.batteryLevel < 30) {
    alerts.push({
      type: 'maintenance',
      message: 'Niveau de batterie faible',
      severity: 'medium'
    });
  }

  return alerts;
};

function ModuleGestion() {
    const [user, setUser] = useState(null);
    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      fetchDevices();
    }, []);
    

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
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = 'http://localhost:3020/plateforme/smart-home-project/api/device.php';
  const fetchDevices = async () => {
    try {
      const res = await fetch(API_BASE, { credentials: 'include' });
      if (!res.ok) throw new Error('Erreur API');
  
      const data = await res.json();
  
      // Mettre à jour l'utilisateur
      if (data.user) {
        const updatedUser = { ...data.user };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
  
      setConnectedDevices(data.devices);
      setLoading(false);
  
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };
  
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
  
  // État pour les erreurs de validation
  const [validationErrors, setValidationErrors] = useState({});
  
  // Fonction pour valider les champs selon le type d'appareil
  const validateDeviceFields = (device) => {
    const errors = {};
    
    // Validation des champs obligatoires
    if (!device.name.trim()) errors.name = 'Le nom est obligatoire';
    if (!device.room.trim()) errors.room = 'La pièce est obligatoire';
    if (!device.lastMaintenance) errors.lastMaintenance = 'La date de maintenance est obligatoire';
    
    // Validation des champs numériques
    if (device.energyConsumption < 0) errors.energyConsumption = 'La consommation doit être positive';
    if (device.batteryLevel < 0 || device.batteryLevel > 100) errors.batteryLevel = 'Le niveau de batterie doit être entre 0 et 100';
    
    // Validation selon le type d'appareil
    switch(device.type) {
      case 'thermostat':
        if (device.temperature < 5 || device.temperature > 35) errors.temperature = 'La température doit être entre 5°C et 35°C';
        if (device.targetTemperature < 5 || device.targetTemperature > 35) errors.targetTemperature = 'La température cible doit être entre 5°C et 35°C';
        break;
      case 'climatiseur':
        if (device.temperature < 16 || device.temperature > 30) errors.temperature = 'La température doit être entre 16°C et 30°C';
        break;
      case 'volets':
        if (device.openPercentage < 0 || device.openPercentage > 100) errors.openPercentage = 'Le pourcentage d\'ouverture doit être entre 0 et 100';
        break;
      case 'lumière':
        if (device.brightness < 0 || device.brightness > 100) errors.brightness = 'La luminosité doit être entre 0 et 100';
        if (device.colorTemperature < 1000 || device.colorTemperature > 10000) errors.colorTemperature = 'La température de couleur doit être entre 1000K et 10000K';
        break;
      case 'météo':
        if (device.temperature < -50 || device.temperature > 50) errors.temperature = 'La température doit être entre -50°C et 50°C';
        if (device.humidity < 0 || device.humidity > 100) errors.humidity = 'L\'humidité doit être entre 0 et 100';
        if (device.windSpeed < 0) errors.windSpeed = 'La vitesse du vent doit être positive';
        if (device.precipitation < 0) errors.precipitation = 'Les précipitations doivent être positives';
        break;
      case 'sécurité':
        if (device.name.toLowerCase().includes('fumée') && device.carbonMonoxideLevel < 0) {
          errors.carbonMonoxideLevel = 'Le niveau de monoxyde de carbone doit être positif';
        }
        break;
    }
    
    return errors;
  };
  
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
    // Création d'un objet avec les propriétés de base et spécifiques au type
    const deviceWithDetails = {
      ...device
    };
    
    // Ajout de propriétés spécifiques selon le type d'appareil
    switch(device.type) {
      case 'thermostat':
        deviceWithDetails.temperature = device.temperature || 20;
        deviceWithDetails.targetTemperature = device.targetTemperature || 22;
        break;
      case 'climatiseur':
        deviceWithDetails.temperature = device.temperature || 20;
        deviceWithDetails.currentMode = device.currentMode || 'Veille';
        break;
      case 'volets':
        deviceWithDetails.openPercentage = device.openPercentage || 0;
        deviceWithDetails.currentPosition = device.currentPosition || 'Fermés';
        break;
      case 'lumière':
        deviceWithDetails.brightness = device.brightness || 50;
        deviceWithDetails.colorTemperature = device.colorTemperature || 3000;
        break;
      case 'sécurité':
        deviceWithDetails.motionSensitivity = device.motionSensitivity || 'Moyen';
        deviceWithDetails.movementDetected = device.movementDetected || false;
        break;
      case 'météo':
        deviceWithDetails.temperature = device.temperature || 20;
        if (device.name.toLowerCase().includes('station')) {
          deviceWithDetails.humidity = device.humidity || 50;
          deviceWithDetails.windSpeed = device.windSpeed || 0;
          deviceWithDetails.precipitation = device.precipitation || 0;
        }
        break;
      default:
        break;
    }
    
    setSelectedDevice(deviceWithDetails);
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
  const addDevice = async (payload) => {
    const response = await fetch(API_BASE, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return await response.json();
  };
  
  const handleAddDevice = async () => {
    // Validation des champs obligatoires
    const errors = validateDeviceFields(newDevice);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // On crée un objet avec les champs de base pour l'envoi au backend
    const deviceToAdd = {
      name: newDevice.name,
      type: newDevice.type,
      status: newDevice.status,
      room: newDevice.room,
      energyConsumption: newDevice.energyConsumption,
      lastMaintenance: newDevice.lastMaintenance,
      batteryLevel: newDevice.batteryLevel
    };

    try {
      const response = await addDevice(deviceToAdd);
      if (response.status === 'success') {
        await fetchDevices(); // recharge
        
        // On garde les champs spécifiques dans l'interface
        const deviceWithDetails = {
          ...deviceToAdd,
          // On ajoute les champs spécifiques selon le type
          ...(newDevice.type === 'thermostat' && {
            temperature: 20,
            targetTemperature: 22
          }),
          ...(newDevice.type === 'climatiseur' && {
            temperature: 20,
            currentMode: 'Veille'
          }),
          ...(newDevice.type === 'volets' && {
            openPercentage: 0,
            currentPosition: 'Fermés'
          }),
          ...(newDevice.type === 'lumière' && {
            brightness: 50,
            colorTemperature: 3000
          }),
          ...(newDevice.type === 'sécurité' && {
            motionSensitivity: 'Moyen',
            movementDetected: false
          }),
          ...(newDevice.type === 'météo' && {
            temperature: 20,
            ...(newDevice.name.toLowerCase().includes('station') && {
              humidity: 50,
              windSpeed: 0,
              precipitation: 0
            })
          })
        };
        
        setSelectedDevice(deviceWithDetails);
        setNewDevice({
          name: '',
          type: 'thermostat',
          status: 'actif',
          room: '',
          energyConsumption: 0,
          lastMaintenance: new Date().toISOString().split('T')[0],
          batteryLevel: 100
        });
        setValidationErrors({});
        setShowAddModal(false);
      } else {
        alert('Erreur lors de l\'ajout de l\'appareil : ' + response.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'appareil :', error);
      alert('Une erreur est survenue lors de l\'ajout de l\'appareil');
    }
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
  const updateDevice = async (payload, id) => {
    const response = await fetch(`${API_BASE}?id=${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return await response.json();
  };
  
  const handleSaveDeviceChanges = async () => {
    // On crée un objet avec les champs de base modifiés depuis deviceToEdit
    const deviceToUpdate = {
      name: deviceToEdit.name,
      type: deviceToEdit.type,
      status: deviceToEdit.status,
      room: deviceToEdit.room,
      energyConsumption: deviceToEdit.energyConsumption,
      lastMaintenance: deviceToEdit.lastMaintenance,
      batteryLevel: deviceToEdit.batteryLevel
    };

    try {
      const response = await updateDevice(deviceToUpdate, selectedDevice.id);
      if (response.status === 'success') {
        await fetchDevices();
        
        // On garde les champs spécifiques dans l'interface
        const updatedDevice = {
          ...deviceToUpdate,
          id: selectedDevice.id,
          // On ajoute les champs spécifiques selon le type
          ...(deviceToEdit.type === 'thermostat' && {
            temperature: selectedDevice.temperature || 20,
            targetTemperature: selectedDevice.targetTemperature || 22
          }),
          ...(deviceToEdit.type === 'climatiseur' && {
            temperature: selectedDevice.temperature || 20,
            currentMode: selectedDevice.currentMode || 'Veille'
          }),
          ...(deviceToEdit.type === 'volets' && {
            openPercentage: selectedDevice.openPercentage || 0,
            currentPosition: selectedDevice.currentPosition || 'Fermés'
          }),
          ...(deviceToEdit.type === 'lumière' && {
            brightness: selectedDevice.brightness || 50,
            colorTemperature: selectedDevice.colorTemperature || 3000
          }),
          ...(deviceToEdit.type === 'sécurité' && {
            motionSensitivity: selectedDevice.motionSensitivity || 'Moyen',
            movementDetected: selectedDevice.movementDetected || false
          }),
          ...(deviceToEdit.type === 'météo' && {
            temperature: selectedDevice.temperature || 20,
            ...(deviceToEdit.name.toLowerCase().includes('station') && {
              humidity: selectedDevice.humidity || 50,
              windSpeed: selectedDevice.windSpeed || 0,
              precipitation: selectedDevice.precipitation || 0
            })
          })
        };
        
        setSelectedDevice(updatedDevice);
        setShowConfigModal(false);
      } else {
        alert('Erreur lors de la mise à jour : ' + response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      alert('Une erreur est survenue lors de la mise à jour');
    }
  };
  
  
  // Fonction pour demander la suppression d'un appareil
  const handleRequestDeviceDeletion = async (deviceId) => {
    if (user && user.role === 'admin') {
      // Cas ADMIN, on supprime directement
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet appareil ?");
      if (!confirmDelete) return;
  
      try {
        const response = await fetch(`${API_BASE}?id=${deviceId}`, {
          method: "DELETE",
          credentials: "include",
        });
  
        const data = await response.json();
  
        if (data.status === "success") {
          alert("Appareil supprimé avec succès !");
          await fetchDevices();
        } else {
          alert("Erreur : " + data.message);
        }
      } catch (error) {
        console.error("Erreur lors de la suppression directe :", error);
        alert("Erreur réseau.");
      }
    } else {
      // Cas utilisateur normal, on va demander la suppression à l'admin
      setShowDeleteConfirmation(true);
    }
  };
  
  
  // Fonction pour confirmer la demande de suppression
  const handleConfirmDeletion = async () => {
    try {
      const response = await fetch("http://localhost:3020/plateforme/smart-home-project/api/request_delete.php", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          item_type: selectedDevice.type,
          item_id: selectedDevice.id.toString() // Conversion en string pour être sûr
        })
      });
  
      const data = await response.json();
  
      if (data.status === "success") {
        setShowDeleteConfirmation(false);
        setDeletionSuccess(true);
        await fetchDevices();
      } else {
        alert("Erreur : " + data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Erreur réseau.");
    }
  };
  
  const handleGenerateReport = (device, energyData) => {
    // Vérification que energyData existe, sinon création d'un objet par défaut avec données détaillées
    if (!energyData || Object.keys(energyData).length === 0) {
      energyData = {
        // Données quotidiennes
        dailyAverage: '0.75',
        dailyPeak: '1.2',
        dailyLow: '0.3',
        dailyPeakTime: '19h00 - 20h00',
        
        // Données hebdomadaires
        weeklyTotal: '5.25',
        weeklyAverage: '0.75',
        weeklyPeak: '1.5',
        weeklyPeakDay: 'Mercredi',
        
        // Données mensuelles
        monthlyTotal: '22.5',
        monthlyAverage: '0.73',
        monthlyPeak: '1.8',
        monthlyPeakDate: '15/04/2024',
        
        // Comparaisons et tendances
        previousPeriodComparison: -5.2,
        yearOverYearChange: -2.5,
        seasonalAdjustment: 1.1,
        
        // Coûts et impact
        estimatedCost: '15.30',
        carbonFootprint: '3.2',
        efficiencyRating: 'B',
        
        // Données pour les graphiques
        dailyConsumption: Array(30).fill(0).map(() => (Math.random() * 0.5 + 0.5).toFixed(2)),
        weeklyConsumption: Array(7).fill(0).map(() => (Math.random() * 3 + 2).toFixed(2)),
        monthlyConsumption: Array(12).fill(0).map(() => (Math.random() * 10 + 15).toFixed(2)),
        
        // Statistiques spécifiques selon le type d'appareil
        deviceSpecificStats: {
          operatingHours: Math.floor(Math.random() * 24),
          efficiency: (Math.random() * 20 + 80).toFixed(1), // 80-100%
          maintenanceScore: (Math.random() * 20 + 80).toFixed(1), // 80-100%
          performanceIndex: (Math.random() * 20 + 80).toFixed(1), // 80-100%
          anomalies: Math.floor(Math.random() * 3), // 0-2 anomalies
          uptime: (Math.random() * 5 + 95).toFixed(1), // 95-100%
        }
      };
    }
    
    // S'assurer que les données pour le graphique existent
    if (!energyData.dailyConsumption) {
      energyData.dailyConsumption = Array(30).fill(0).map(() => (Math.random() * 0.5 + 0.5).toFixed(2));
    }
    
    // Création d'une nouvelle instance de jsPDF
    const doc = new jsPDF();
    
    // Titre du rapport
    doc.setFontSize(22);
    doc.setTextColor(211, 84, 0); // #D35400
    doc.text('Rapport Détaillé Objet Connecté - CYHOME', 105, 20, { align: 'center' });
    
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
    
    doc.text(`Consommation énergétique actuelle : ${device.energyConsumption} W`, xPosition, yPosition);
    yPosition += lineHeight;
    
    // Vérification de l'existence du niveau de batterie
    if (device.batteryLevel !== undefined) {
      doc.text(`Niveau de batterie : ${device.batteryLevel}%`, xPosition, yPosition);
      yPosition += lineHeight;
    }
    
    doc.text(`Dernière maintenance : ${device.lastMaintenance || 'Non disponible'}`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // SECTION: Statistiques détaillées de consommation énergétique
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Analyse Détaillée de la Consommation', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    
    doc.setFontSize(12);
    
    // Sous-section : Données quotidiennes
    doc.setFontSize(14);
    doc.text('Statistiques Quotidiennes', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    doc.setFontSize(12);
    
    doc.text(`Consommation moyenne : ${energyData.dailyAverage} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Pic de consommation : ${energyData.dailyPeak} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Consommation minimale : ${energyData.dailyLow} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Heure de pic : ${energyData.dailyPeakTime}`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Sous-section : Données hebdomadaires
    doc.setFontSize(14);
    doc.text('Statistiques Hebdomadaires', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    doc.setFontSize(12);
    
    doc.text(`Consommation totale : ${energyData.weeklyTotal} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Moyenne journalière : ${energyData.weeklyAverage} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Pic hebdomadaire : ${energyData.weeklyPeak} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Jour de pic : ${energyData.weeklyPeakDay}`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Sous-section : Données mensuelles
    doc.setFontSize(14);
    doc.text('Statistiques Mensuelles', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    doc.setFontSize(12);
    
    doc.text(`Consommation totale : ${energyData.monthlyTotal} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Moyenne journalière : ${energyData.monthlyAverage} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Pic mensuel : ${energyData.monthlyPeak} kWh`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Date du pic : ${energyData.monthlyPeakDate}`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Sous-section : Comparaisons et tendances
    doc.setFontSize(14);
    doc.text('Analyse des Tendances', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    doc.setFontSize(12);
    
    const trendText = energyData.previousPeriodComparison > 0 ? 'augmentation' : 'diminution';
    doc.text(`Évolution période précédente : ${Math.abs(energyData.previousPeriodComparison)}% (${trendText})`, xPosition, yPosition);
    yPosition += lineHeight;
    
    const yearTrendText = energyData.yearOverYearChange > 0 ? 'augmentation' : 'diminution';
    doc.text(`Évolution annuelle : ${Math.abs(energyData.yearOverYearChange)}% (${yearTrendText})`, xPosition, yPosition);
    yPosition += lineHeight;
    
    doc.text(`Ajustement saisonnier : ${energyData.seasonalAdjustment}x`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Sous-section : Impact environnemental et coûts
    doc.setFontSize(14);
    doc.text('Impact et Coûts', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    doc.setFontSize(12);
    
    doc.text(`Coût mensuel estimé : ${energyData.estimatedCost} €`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Empreinte carbone : ${energyData.carbonFootprint} kg CO2`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Classe énergétique : ${energyData.efficiencyRating}`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Sous-section : Statistiques spécifiques à l'appareil
    doc.setFontSize(14);
    doc.text('Performances de l\'Appareil', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    doc.setFontSize(12);
    
    const stats = energyData.deviceSpecificStats;
    doc.text(`Heures de fonctionnement : ${stats.operatingHours}h/jour`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Efficacité : ${stats.efficiency}%`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Score de maintenance : ${stats.maintenanceScore}/100`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Indice de performance : ${stats.performanceIndex}/100`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Anomalies détectées : ${stats.anomalies}`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text(`Temps de disponibilité : ${stats.uptime}%`, xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // SECTION: Graphique de consommation (s'assurer qu'il soit bien sur une page)
    // On s'assure que le graphique commence à une position qui permet de tout afficher sur la même page
    // Si on a dépassé une certaine hauteur de page, on passe à une nouvelle page
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition += lineHeight * 2;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Graphique de Consommation', xPosition, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Définir les paramètres du graphique avec une hauteur réduite pour s'assurer qu'il tient sur la page
    const graphStartX = 30;
    const graphStartY = yPosition;
    const graphWidth = 150;
    const graphHeight = 50; // Hauteur réduite
    const graphEndX = graphStartX + graphWidth;
    const graphEndY = graphStartY + graphHeight;
    
    // Dessiner les axes
    doc.setLineWidth(0.5);
    doc.line(graphStartX, graphStartY, graphStartX, graphEndY); // Axe Y
    doc.line(graphStartX, graphEndY, graphEndX, graphEndY); // Axe X
    
    // Dessiner les graduations sur l'axe Y (réduites à 3 pour plus de clarté)
    doc.setFontSize(8);
    for (let i = 0; i <= 3; i++) {
      const yPos = graphEndY - (i * graphHeight / 3);
      doc.line(graphStartX - 2, yPos, graphStartX, yPos);
      doc.text(`${(i * 0.3).toFixed(1)}`, graphStartX - 15, yPos + 1);
    }
    
    // Dessiner les graduations sur l'axe X (jours) - moins de graduations pour plus de clarté
    for (let i = 0; i <= 30; i += 6) {
      const xPos = graphStartX + (i * graphWidth / 30);
      doc.line(xPos, graphEndY, xPos, graphEndY + 2);
      doc.text(`${i + 1}`, xPos - 2, graphEndY + 10);
    }
    
    // Ajouter les titres des axes
    doc.setFontSize(10);
    doc.text("kWh", graphStartX - 20, graphStartY + graphHeight / 2, { angle: 90 });
    doc.text("Jours", graphStartX + graphWidth / 2, graphEndY + 20);
    
    // Dessiner la courbe de consommation en utilisant les données de l'objet energyData
    const dataPoints = energyData.dailyConsumption;
    const maxConsumption = Math.max(...dataPoints) * 1.2; // Marge de 20%
    
    doc.setDrawColor(211, 84, 0); // #D35400
    doc.setLineWidth(1);
    
    // Tracer la ligne du graphique
    let prevX = graphStartX;
    let prevY = graphEndY - (dataPoints[0] / maxConsumption) * graphHeight;
    
    for (let i = 0; i < dataPoints.length; i++) {
      const xPos = graphStartX + (i * graphWidth / dataPoints.length);
      const yPos = graphEndY - (dataPoints[i] / maxConsumption) * graphHeight;
      
      // Dessiner la ligne entre les points
      doc.line(prevX, prevY, xPos, yPos);
      
      // Enregistrer ce point comme précédent pour la prochaine itération
      prevX = xPos;
      prevY = yPos;
    }
    
    // Ajouter une légende pour le graphique
    yPosition = graphEndY + 25;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Consommation énergétique journalière du mois courant (kWh)", xPosition, yPosition);
    
    // SECTION: Graphiques de consommation
    doc.addPage();
    yPosition = 20;
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Graphiques de Consommation', xPosition, yPosition);
    yPosition += lineHeight * 2;
    
    // Graphique journalier
    const dailyLabels = Array.from({length: 30}, (_, i) => i + 1);
    yPosition = drawGraph(
      doc,
      'Consommation Journalière (kWh)',
      energyData.dailyConsumption,
      dailyLabels,
      yPosition + 20,
      xPosition,
      40
    );
    
    // Graphique hebdomadaire
    const weekLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    yPosition = drawGraph(
      doc,
      'Consommation Hebdomadaire (kWh)',
      energyData.weeklyConsumption,
      weekLabels,
      yPosition + 20,
      xPosition,
      40
    );
    
    // Graphique mensuel
    const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    yPosition = drawGraph(
      doc,
      'Consommation Mensuelle (kWh)',
      energyData.monthlyConsumption,
      monthLabels,
      yPosition + 20,
      xPosition,
      40
    );
    
    // Ajout de la date et heure de génération du rapport
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();
    
    yPosition += lineHeight * 3;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Rapport généré le ${dateString} à ${timeString}`, xPosition, yPosition);
    yPosition += lineHeight;
    doc.text('© CYHOME - Tous droits réservés', xPosition, yPosition);
    
    // Téléchargement du PDF
    doc.save(`Rapport_Détaillé_${device.name.replace(/\s+/g, '_')}_${dateString.replace(/\//g, '-')}.pdf`);
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
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={logoImage} alt="CYHOME Logo" style={{ height: '50px', marginRight: '10px' }} />
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>CYHOME</span>
      <span style={{ fontSize: '0.8rem', color: '#666' }}>La maison intelligente, en toute sécurité</span>
    </div>
  </div>
  {user ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={user.photo}
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
        onClick={() => {
          localStorage.removeItem("user");
          navigate("/auth");
        }}
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
      Connexion / Inscription
    </Link>
  )}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <p style={{ color: '#ddd', margin: '0' }}>Type : {device.type}</p>
                  <div style={{
                    backgroundColor: '#D35400',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px'
                  }}>
                    {DeviceIcons[device.type]}
                  </div>
                </div>
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
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Sensibilité au mouvement :</strong> {selectedDevice.motionSensitivity}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Mouvement détecté :</strong> {selectedDevice.movementDetected ? 'Oui' : 'Non'}
                  </div>
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

              {/* Dans la section des détails de l'appareil, ajouter après les informations de base */}
              {selectedDevice && (
                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '1rem',
                    color: '#fff',
                    borderBottom: '1px solid rgba(255,255,255,0.2)',
                    paddingBottom: '0.5rem'
                  }}>
                    État de l'appareil
                  </h3>
                  {(() => {
                    const alerts = evaluateDeviceStatus(selectedDevice);
                    if (alerts.length === 0) {
                      return (
                        <div style={{ 
                          backgroundColor: 'rgba(46, 204, 113, 0.2)',
                          padding: '1rem',
                          borderRadius: '5px',
                          marginBottom: '1rem'
                        }}>
                          <p style={{ margin: 0, color: '#2ecc71' }}>
                            ✓ L'appareil fonctionne de manière optimale
                          </p>
                        </div>
                      );
                    }
                    return alerts.map((alert, index) => (
                      <div 
                        key={index}
                        style={{ 
                          backgroundColor: alert.severity === 'high' 
                            ? 'rgba(231, 76, 60, 0.2)' 
                            : 'rgba(241, 196, 15, 0.2)',
                          padding: '1rem',
                          borderRadius: '5px',
                          marginBottom: '1rem'
                        }}
                      >
                        <p style={{ 
                          margin: 0, 
                          color: alert.severity === 'high' ? '#e74c3c' : '#f1c40f',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          {alert.severity === 'high' ? '⚠️' : 'ℹ️'} {alert.message}
                        </p>
                      </div>
                    ));
                  })()}
                </div>
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
                {user && user.role === 'admin' ? 'Supprimer l\'appareil' : 'Demander suppression à l\'administrateur'}
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