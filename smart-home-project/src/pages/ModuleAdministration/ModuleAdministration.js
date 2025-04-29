import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../../Pictures/cyhome-logo.png';
import cytechLogo from '../../Pictures/cytech-logo.png';
import backgroundImage from '../../Pictures/kitchen-background.jpg';
import Modulerequete from '../Modulerequete/AdminDeleteRequests.jsx';
import ModuleGestion from '../ModuleGestion/ModuleGestion.js';

// Importation pour la génération de PDF
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ModuleAdministration = ({validationMode, onToggleValidation }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const API_URL = '  http://localhost:3020/Plateforme/smart-home-project/api/User-manager.php';
  const DEVICES_API = 'http://localhost:3020/Plateforme/smart-home-project/api/device.php';
  const CATEGORY_API = 'http://localhost:3020/Plateforme/smart-home-project/api/category.php';
  const [selectedBackup, setSelectedBackup] = useState('');


  const [users, setUsers] = useState([]);                
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);

  const [connectedDevices, setConnectedDevices] = useState([]); 
  const initialNewUserState = {
    username: '',   
    password: '',   
    nom: '', prenom: '',
    email: '',
    photoFile: null,       
    role: '',
    points: 0,
    niveau: '',
    birthdate: '',
    gender: '',
    age: null,
    memberType : ''
  };
  
  const [newUser,   setNewUser]   = useState(initialNewUserState);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers]     = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showAddDeviceForm, setShowAddDeviceForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [globalRules, setGlobalRules] = useState({
    energyPriority: 'équilibré',
    autoShutdownInactive: true,
    alertSensitivity: 'moyenne'
  });
  const [showGlobalRulesModal, setShowGlobalRulesModal] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // États pour les effets de hover
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredSearch, setHoveredSearch] = useState(false);
  const [focusedSearch, setFocusedSearch] = useState(false);
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [backups, setBackups] = useState([]);


  useEffect(() => {
    fetch('http://localhost:3020/Plateforme/smart-home-project/api/Backup.php?action=list', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === 'success') {
        setBackups(json.files);
      }
    })
    .catch(console.error);
  }, []);


  async function apiGet(params) {
    const url = DEVICES_API + '?' + new URLSearchParams(params).toString();
    const res = await fetch(url, { credentials: 'include' });
    return res.json();
  }
  
  async function apiPost(params, payload) {
    const url = DEVICES_API + '?' + new URLSearchParams(params).toString();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  
  // Fonction de navigation avec transition
    const handleNavigateHome = (e) => {
      e.preventDefault();
      setIsNavigating(true);
      setTimeout(() => {
        navigate('/');
      }, 500);
    };

  // Gestionnaires d'événements pour les effets de hover
  const handleCardHover = (cardId) => {
    setHoveredCard(cardId);
  };

  const handleBackup = async () => {
    try {
      const res = await fetch("http://localhost:3020/Plateforme/smart-home-project/api/Backup.php", {
        credentials: 'include'
      });
  
      const data = await parseJSONSafely(res);
  
      if (data && data.status === 'success') {
        alert(`Sauvegarde créée : ${data.file}`);
        await fetchList();
      } else {
        console.error(data);
        alert('Erreur lors de la sauvegarde : ' + (data?.message || data?.output?.join('\n') || 'Réponse vide'));
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau lors de la sauvegarde');
    }
  };
  
  

  const fetchList = async () => {
    try {
      const res = await fetch("http://localhost:3020/Plateforme/smart-home-project/api/Backup.php?action=list", {
        credentials: 'include'
      });
  
      const json = await parseJSONSafely(res);
  
      if (json && json.status === 'success') {
        setBackups(json.files);
      } else {
        console.error('Liste backups échouée', json);
      }
    } catch (err) {
      console.error('Erreur liste backups', err);
    }
  };

  const parseJSONSafely = async (res) => {
    const text = await res.text();
  
    console.log("Réponse brute du backend :", text); 
  
    try {
      return JSON.parse(text);
    } catch (err) {
      console.error('Erreur JSON.parse:', err.message);
      return null;
    }
  };
  
  
  
  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const handleButtonHover = (buttonId) => {
    setHoveredButton(buttonId);
  };


  const handleRestoreLatest = async () => {
    try {
      const res = await fetch("http://localhost:3020/Plateforme/smart-home-project/api/Backup.php?action=restore-latest", {
        credentials: 'include'
      });
  
      const data = await parseJSONSafely(res);
  
      if (data && data.status === 'success') {

        alert(`Restauration réussie depuis le fichier : ${data.file}`);
      } else {
        alert('Erreur : ' + data.message);
        console.error(data);
      }
    } catch (err) {
      alert('Erreur réseau');
      console.error(err);
    }
  };
  
  useEffect(() => {
    const fetchBackups = async () => {
      try {
        const res = await fetch('http://localhost:3020/plateforme/smart-home-project/api/Backup.php?action=list', {
          credentials: 'include'
        });
        const json = await res.json();
        setBackups(json.files || []);
        if (json.files.length > 0) {
          setSelectedBackup(json.files[0]); 
        }
      } catch (error) {
        console.error(error);
        alert('Erreur lors du chargement des sauvegardes.');
      }
    };

    fetchBackups();
  }, []);

  
  
  
  const handleButtonLeave = () => {
    setHoveredButton(null);
  };

  const handleSearchHover = () => {
    setHoveredSearch(true);
  };

  

  const handleSearchLeave = () => {
    setHoveredSearch(false);
  };

  const handleSearchFocus = () => {
    setFocusedSearch(true);
  };

  const handleSearchBlur = () => {
    setFocusedSearch(false);
  };

  const handlePanelHover = (panelKey) => {
    setHoveredPanel(panelKey);
  };

  const handlePanelLeave = () => {
    setHoveredPanel(null);
  };

  // Styles dynamiques basés sur les états
  const getCardStyle = (cardId) => ({
    backgroundColor: hoveredCard === cardId ? 'rgba(211, 84, 0, 0.3)' : 'rgba(211, 84, 0, 0.15)',
    padding: '2rem',
    borderRadius: '10px',
    border: `1px solid ${hoveredCard === cardId ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`,
    transform: hoveredCard === cardId ? 'translateY(-5px)' : 'none',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: hoveredCard === cardId ? '0 6px 12px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.2)'
  });


  

  const getButtonStyle = (buttonId) => ({
    backgroundColor: themeStyles[theme].buttonBackground,
    color: themeStyles[theme].buttonText,
    padding: '0.8rem 1.5rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    '&:hover': {
      backgroundColor: themeStyles[theme].buttonHover,
      transform: 'translateY(-3px) scale(1.05)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
      letterSpacing: '0.5px'
    },
    '&:active': {
      transform: 'translateY(1px) scale(0.95)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
  });


  const getSearchStyle = () => ({
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: `1px solid ${focusedSearch ? '#E67E22' : hoveredSearch ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`,
    backgroundColor: focusedSearch ? 'rgba(211, 84, 0, 0.3)' : hoveredSearch ? 'rgba(211, 84, 0, 0.25)' : 'rgba(211, 84, 0, 0.15)',
    color: '#f5f5f5',
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
    transition: 'all 0.3s ease',
    transform: focusedSearch ? 'scale(1.02)' : hoveredSearch ? 'scale(1.01)' : 'none',
    boxShadow: focusedSearch ? '0 0 0 2px rgba(230, 126, 34, 0.2)' : 'none'
  });

  const [theme, setTheme] = useState('dark'); // État pour gérer le thème

  // Styles pour les thèmes
  const themeStyles = {
    dark: {
      background: '#1a1a1a',
      text: '#ffffff',
      cardBackground: 'rgba(211, 84, 0, 0.15)',
      cardBorder: 'rgba(211, 84, 0, 0.3)',
      modalBackground: '#343a40',
      modalText: '#ffffff',
      buttonBackground: '#D35400',
      buttonText: '#ffffff',
      buttonHover: '#E67E22',
      headerBackground: 'rgba(245, 245, 245, 0.85)',
      headerText: '#333',
      footerBackground: 'rgba(245, 245, 245, 0.85)',
      footerText: '#333'
    },
    light: {
      background: '#ffffff',
      text: '#333333',
      cardBackground: 'rgba(211, 84, 0, 0.05)',
      cardBorder: 'rgba(211, 84, 0, 0.2)',
      modalBackground: '#ffffff',
      modalText: '#333333',
      buttonBackground: '#D35400',
      buttonText: '#ffffff',
      buttonHover: '#E67E22',
      headerBackground: 'rgba(255, 255, 255, 0.9)',
      headerText: '#333',
      footerBackground: 'rgba(255, 255, 255, 0.9)',
      footerText: '#333'
    }
  };

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Fonction pour obtenir les couleurs du thème actuel
  const getCurrentModalColors = () => themeStyles[theme];


  const handleUpdatePassword = async (userId) => {
    const newPwd = prompt("Entrez le nouveau mot de passe :");
    if (!newPwd) return;
  
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, newPassword: newPwd })
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
  
      alert("Mot de passe mis à jour !");
     
      setActiveModal('users');
  
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du mot de passe : " + err.message);
    }
  };
  

  useEffect(() => {
    document.body.style.backgroundColor = themeStyles[theme].background;
    document.body.style.color = themeStyles[theme].text;
  }, [theme]);


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${CATEGORY_API}?action=getCategories`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          setDeviceTypeOptions(data.categories);
        } else {
          console.error('Erreur chargement catégories :', data.message);
        }
      } catch (err) {
        console.error('Erreur réseau chargement catégories', err);
      }
    })();
  }, []);
  
  


  useEffect(() => {
    const fetchDeleteRequests = async () => {
      try {
        const response = await fetch('http://localhost:3020/Plateforme/smart-home-project/api/User-manager.php');
        const data = await response.json();
        setDeleteRequests(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des demandes de suppression', error);
      }
    };
  
    fetchDeleteRequests();
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(DEVICES_API, {
          credentials: 'include'
        });
        const { devices } = await res.json();     
        setConnectedDevices(devices);
      } catch (err) {
        console.error('Erreur chargement devices', err);
      }
    })();
  }, []);
  
  
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: '',
    status: '',
    room: '',
    energyConsumption: 0,
    lastMaintenance: '',
    batteryLevel: 100
  });
  const [editDevice,setEditDevice] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [history, setHistory] = useState([]);
  const [validationRule, setValidationRule] = useState('Manuelle');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
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
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Fonction pour ouvrir les détails d'un appareil
    const handleDeviceDetails = (device) => {
      setSelectedDevice(device);
    };

    const handleDeleteDevice = async (deviceId) => {
      if (!window.confirm('Confirmer la suppression ?')) return;
      try {
        await fetch(`${DEVICES_API}?id=${deviceId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        setConnectedDevices(ds => ds.filter(d => d.id !== deviceId));
        setSelectedDevice(null);
      } catch (err) {
        alert(`Erreur suppression : ${err.message}`);
      }
    };
    

    const handleSaveDeviceEdit = async () => {
      try {
        await fetch(`${DEVICES_API}?id=${editDevice.id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editDevice)
        });
        setConnectedDevices(devs =>
          devs.map(d => d.id === editDevice.id ? editDevice : d)
        );
        setEditDevice(null);
        setSelectedDevice(editDevice);
      } catch (err) {
        alert(`Erreur mise à jour : ${err.message}`);
      }
    };
    

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(API_URL, { credentials: 'include' });
        const json = await res.json();            // { status:'success', users:[…] }
        if (json.status !== 'success') throw new Error(json.message);
        setUsers(json.users);
      } catch (err) {
        setErrorUsers(err.message);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/auth');
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setEditUser(user);
    setActiveModal('userDetails');
  };

  const fetchUsers = async () => {
    try {
      const res  = await fetch(API_URL, { credentials: 'include' });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
      setUsers(json.users);
    } catch (err) {
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!window.confirm('Supprimer définitivement ?')) return;
  
    try {
      const res = await fetch(API_URL, {
        method : 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body   : `id=${selectedUser.id}`,
        credentials: 'include'
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
  
      setActiveModal(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };
  
  const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSaveEdit = async () => {
      try {
        const res = await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(editUser)
        });
        const json = await res.json();
        if (json.status !== 'success') throw new Error(json.message);
    
        setUsers(us => us.map(u => u.id === editUser.id ? editUser : u));
        setActiveModal(null);
      } catch (err) {
        alert(err.message);
      }
    };
    
    
  
    const handleOpenEdit = (user) => {
      setEditUser(user);
      setActiveModal('editUser');
    };
    

  const statusOptions = ['actif', 'inactif'];
  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.type || !newDevice.room) return;
  
    try {
      const res = await fetch(DEVICES_API, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDevice)
      });
      const json = await res.json();
  
      if (!json.status) {
        throw new Error(json.message || 'Erreur création device');
      }
  
      // on récupère l’ID (json.id si c’est le nom) et on ajoute
      setConnectedDevices(devices => [
        ...devices,
        { ...newDevice, id: json.id }
      ]);
  
      setShowAddDeviceForm(false);
      setNewDevice({
        name: '',
        type: '',
        status: '',
        room: '',
        energyConsumption: 0,
        batteryLevel: 100,
        lastMaintenance: ''
      });
    } catch (err) {
      alert(`Erreur création : ${err.message}`);
    }
  };
  
  
  const handleAddCategory = async () => {
    if (newCategory && !deviceTypeOptions.some(c => (typeof c === 'object' ? c.name : c) === newCategory)) {
      try {
        console.log('Contenu de newCategory avant envoi :', JSON.stringify(newCategory));

        const response = await fetch(`${CATEGORY_API}?action=addCategory`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name: newCategory }),
        });
  
        const data = await response.json();
        if (data.success) {
          setDeviceTypeOptions(prev => [...prev, { id: data.data.id, name: newCategory }]);
          setNewCategory('');
        } else {
          alert('Erreur lors de l\'ajout de la catégorie : ' + data.message);
        }
      } catch (error) {
        console.error('Erreur ajout catégorie', error);
        alert('Erreur réseau lors de l\'ajout de la catégorie.');
      }
    }
  };
  
  const handleDeleteCategory = async (categoryToDelete) => {
    try {
      // Trouver l'objet complet ou le nom
      const cat = deviceTypeOptions.find(c => (typeof c === 'object' ? c.name : c) === categoryToDelete);
      if (!cat) {
        alert('Catégorie non trouvée.');
        return;
      }
  
      const categoryId = typeof cat === 'object' ? cat.id : null;
      if (!categoryId) {
        alert('Impossible de trouver l\'ID pour supprimer.');
        return;
      }
  
      const response = await fetch(`${CATEGORY_API}?action=deleteCategory&id=${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      const data = await response.json();
      if (data.success) {
        // MAJ des options : on enlève la catégorie supprimée
        setDeviceTypeOptions(prev => prev.filter(c => (typeof c === 'object' ? c.name : c) !== categoryToDelete));
        // MAJ des devices connectés
        setConnectedDevices(prev => prev.filter(device => device.type !== categoryToDelete));
  
        alert(`La catégorie "${categoryToDelete}" et ses appareils ont été supprimés.`);
      } else {
        alert('Erreur suppression catégorie : ' + data.message);
      }
    } catch (error) {
      console.error('Erreur suppression catégorie', error);
      alert('Erreur réseau lors de la suppression de la catégorie.');
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
  };

  const styles = {
      modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: theme === 'dark' ? '#343a40' : '#ffffff',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      width: '90%',
      maxWidth: '1400px',
      height: '85vh',
      overflowY: 'auto',
      zIndex: 1000,
      border: '1px solid #D35400',
      backdropFilter: 'blur(10px)',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    },
    modalContent: {
          display: 'flex',
          flexDirection: 'column',
      gap: '1.5rem',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      width: '100%',
      minHeight: '100%'
        },
    modalHeader: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #D35400'
        },
    modalTitle: {
      fontSize: '2.5rem',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      margin: 0,
      fontWeight: 'bold'
    },
    cardTitle: {
      fontSize: '1.8rem',
      color: theme === 'dark' ? '#ffffff' : '#000000',
      marginBottom: '1.5rem',
      borderBottom: `2px solid ${theme === 'dark' ? 'rgba(211, 84, 0, 0.3)' : 'rgba(211, 84, 0, 0.2)'}`,
      paddingBottom: '0.5rem',
      fontWeight: 'bold',
      textShadow: theme === 'dark' ? '1px 1px 2px rgba(0,0,0,0.5)' : 'none',
      transition: 'all 0.3s ease'
    },
    cardContent: {
      color: theme === 'dark' ? '#ffffff' : '#000000',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& p': {
        color: theme === 'dark' ? '#ffffff' : '#000000',
        transition: 'all 0.3s ease',
        margin: '0.5rem 0'
      }
    },
    formLabel: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    },
    formInput: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      backgroundColor: theme === 'dark' ? '#343a40' : '#ffffff',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    
    },
    closeButton: {
          backgroundColor: 'transparent',
      border: '2px solid rgba(211, 84, 0, 0.3)',
          color: '#f5f5f5',
      padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
          fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      '&:hover': {
        backgroundColor: 'rgba(211, 84, 0, 0.3)',
        transform: 'translateY(-3px) scale(1.05)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        borderColor: '#E67E22',
        color: '#ffffff',
        letterSpacing: '0.5px'
        },
      '&:active': {
        transform: 'translateY(1px) scale(0.95)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }
    },
    searchBar: {
          width: '100%',
          padding: '1rem',
      borderRadius: '8px',
      border: '1px solid rgba(211, 84, 0, 0.3)',
      backgroundColor: 'rgba(211, 84, 0, 0.15)',
      color: '#f5f5f5',
      fontSize: '1.1rem',
      marginBottom: '1.5rem',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(211, 84, 0, 0.25)',
        borderColor: '#E67E22',
        transform: 'scale(1.01)'
      },
      '&:focus': {
        outline: 'none',
        borderColor: '#E67E22',
        backgroundColor: 'rgba(211, 84, 0, 0.3)',
        boxShadow: '0 0 0 2px rgba(230, 126, 34, 0.2)',
        transform: 'scale(1.02)'
      }
    },
    addButton: {
      backgroundColor: 'rgba(211, 84, 0, 0.2)',
      color: '#f5f5f5',
      border: '1px solid rgba(211, 84, 0, 0.3)',
      padding: '1rem 2rem',
      borderRadius: '8px',
          cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
          marginBottom: '1.5rem',
      width: '100%',
          fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      '&:hover': {
        backgroundColor: 'rgba(211, 84, 0, 0.4)',
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        borderColor: '#E67E22',
        color: '#ffffff',
        letterSpacing: '0.5px'
      },
      '&:active': {
        transform: 'translateY(1px) scale(0.98)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
      gap: '2rem',
      marginTop: '1rem',
      paddingBottom: '2rem'
    },
    card: {
      backgroundColor: themeStyles[theme].cardBackground,
      padding: '2rem',
      borderRadius: '10px',
      border: `1px solid ${themeStyles[theme].cardBorder}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      minHeight: '200px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
      '&:hover': {
        transform: 'translateY(-5px)',
        backgroundColor: theme === 'dark' ? 'rgba(211, 84, 0, 0.3)' : 'rgba(211, 84, 0, 0.1)',
        boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
        borderColor: '#E67E22',
        '& h3': {
          color: '#E67E22',
          borderBottomColor: '#E67E22'
        },
        '& p': {
          color: themeStyles[theme].text,
          transform: 'scale(1.02)'
        }
      }
    },
    cardContent: {
      color: themeStyles[theme].text,
      fontSize: '1.1rem',
      lineHeight: '1.6',
      flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
      '& p': {
        transition: 'all 0.3s ease',
        margin: '0.5rem 0'
      }
    },
    formButton: {
          backgroundColor: 'rgba(211, 84, 0, 0.2)',
      color: '#f5f5f5',
      border: '1px solid rgba(211, 84, 0, 0.3)',
      padding: '1rem 2rem',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
      marginRight: '1rem',
      marginBottom: '1rem',
      width: '100%',
          fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      '&:hover': {
        backgroundColor: 'rgba(211, 84, 0, 0.4)',
        transform: 'translateY(-3px) scale(1.02)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        borderColor: '#E67E22',
        color: '#ffffff',
        letterSpacing: '0.5px'
      },
      '&:active': {
        transform: 'translateY(1px) scale(0.98)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }
    },
    backdrop: {
          position: 'fixed',
          top: 0,
          left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 999
        },
    userModal: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(211, 84, 0, 0.95)',
          padding: '2rem',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      width: '400px',
      maxWidth: '90%',
      zIndex: 2000,
      color: 'white'
    },
    userModalHeader: {
          display: 'flex',
          alignItems: 'center',
      marginBottom: '1.5rem',
      borderBottom: '2px solid white',
      paddingBottom: '1rem'
    },
    userModalPhoto: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginRight: '1rem',
      border: '3px solid white'
    },
    userModalTitle: {
      fontSize: '1.8rem',
      margin: 0,
      fontWeight: 'bold'
    },
    userModalContent: {
          display: 'flex',
          flexDirection: 'column',
      gap: '0.8rem'
        },
    userModalInfo: {
          display: 'flex',
          justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(255,255,255,0.2)'
    },
    userModalLabel: {
          fontWeight: 'bold',
      color: 'rgba(255,255,255,0.9)'
    },
    userModalValue: {
      color: 'white'
    },
    userModalClose: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
          backgroundColor: 'transparent',
      border: 'none',
          color: 'white',
      fontSize: '1.5rem',
          cursor: 'pointer',
      padding: '0.5rem'
    },
    userModalOverlay: {
          position: 'fixed',
          top: 0,
          left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1999
    },
    addUserModal: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      width: '400px',
      maxWidth: '90%',
          maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 2000,
      color: '#333'
    },
    backgroundOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 998
    },
    header: {
      position: 'fixed',
      top: showHeader ? 0 : '-100px',
      left: 0,
      right: 0,
      backgroundColor: themeStyles[theme].headerBackground,
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

  const panels = [
    { key: 'users', title: 'Utilisateurs', features: [
      'Gestion complète des profils utilisateurs',
      'Création et modification des comptes',
      'Suivi des activités et permissions'
    ]},
    { key: 'devices', title: 'Objets Connectés', features: [
      'Configuration des appareils intelligents',
      'Gestion des catégories et types',
      'Suivi de la maintenance et des performances'
    ]},
    { key: 'maintenance', title: 'Maintenance', features: [
      'Sauvegarde et restauration des données',
      'Vérification de la sécurité'
    ]},
    { key: 'customization', title: 'Personnalisation', features: [
      'Personnalisation de l\'interface',
      'Gestion des thèmes et apparences',
      'Configuration des notifications'
    ]},
    { key: 'reports', title: 'Rapports', features: [
      'Analyse des données et statistiques',
      'Exportation des rapports',
      'Suivi des performances'
    ]},
    { key: 'request', title: 'Requêtes', features: [
      'Gestion des demandes utilisateurs',
      'Suivi des tickets de support',
      'Historique des actions'
        ]}
  ];
    {showHistoryModal && (
      <div style={styles.modalOverlay}>
        <div style={styles.historyModal}>
          <h3 style={styles.historyTitle}>Historique de {activeUser?.name}</h3>
          {history
            .filter(h => h.includes(activeUser?.name))
            .map((h, i) => (
              <div key={i} style={styles.historyItem}>{h}</div>
            ))}
          <button style={styles.historyBackButton} onClick={() => setShowHistoryModal(false)}>Retour</button>
        </div>
      </div>
    )}
  const addHistory = (entry) => setHistory([...history, `${new Date().toLocaleString()} - ${entry}`]);

  const handleAddUser = async () => {
    const {
      username, password, email,
      role, points, niveau, birthdate, gender, age, photoFile, memberType
    } = newUser;
  
    // Validation des champs obligatoires
    if (!username  || !password || !email || !role || !niveau || !birthdate || !gender || !memberType || points == null || age == null) {
      return alert('Tous les champs sont obligatoires !');
    }

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return alert('Veuillez entrer une adresse email valide !');
    }
  
    // on construit le FormData
    const formData = new FormData();
    formData.append('username',  username);
    formData.append('password',  password);
    formData.append('email',     email);
    formData.append('role',      role);
    formData.append('points',    points);
    formData.append('niveau',    niveau);
    formData.append('memberType', memberType);
    formData.append('birthdate', birthdate);
    formData.append('gender',    gender);
    formData.append('age',       age);
  
    
    if (photoFile instanceof File) {
      formData.append('photo', photoFile);
    } 
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        credentials: 'include',
        body: formData,      
      });
      const json = await res.json();
      if (json.status !== 'success') throw new Error(json.message);
  
      fetchUsers();
      setShowAddUserForm(false);
      setNewUser(initialNewUserState);
    } catch (err) {
      alert(err.message);
    }
  };
  


  const renderModalContent = (key) => {
    switch (key) {
      case 'users':
        if (loadingUsers) {
          return (
            <p style={{ color: '#fff', textAlign: 'center', marginTop: '20vh' }}>
              Chargement des utilisateurs…
            </p>
          );
        }
        
        if (errorUsers) {
          return (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '20vh' }}>
              Erreur : {errorUsers}
            </p>
          );
        }
        
        return (
            <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Gestion des Utilisateurs</h2>
                <button 
                  style={getButtonStyle('close')}
                  onMouseEnter={() => handleButtonHover('close')}
                  onMouseLeave={handleButtonLeave}
                  onClick={closeModal}
                >
                  Fermer
                </button>
              </div>
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                style={getSearchStyle()}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                onMouseEnter={handleSearchHover}
                onMouseLeave={handleSearchLeave}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
                      <button
                style={getButtonStyle('addUser')}
                onMouseEnter={() => handleButtonHover('addUser')}
                onMouseLeave={handleButtonLeave}
                onClick={() => setShowAddUserForm(true)}
              >
                Ajouter un utilisateur
                      </button>
              <div style={styles.cardContainer}>
                {filteredUsers.map((user, index) => (
                  <div 
                    key={index} 
                    style={getCardStyle(`user-${index}`)}
                    onMouseEnter={() => handleCardHover(`user-${index}`)}
                    onMouseLeave={handleCardLeave}
                    onClick={() => handleUserClick(user)}
                  >
                    <h3 style={{
                      ...styles.cardTitle,
                      color: hoveredCard === `user-${index}` ? '#E67E22' : '#f5f5f5',
                      borderBottom: `2px solid ${hoveredCard === `user-${index}` ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`
                    }}>
                      {user.name}
                    </h3>
                    <div style={styles.cardContent}>
                      <p style={{
                        transform: hoveredCard === `user-${index}` ? 'scale(1.02)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        Email: {user.email}
                      </p>
                      <p style={{
                        transform: hoveredCard === `user-${index}` ? 'scale(1.02)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        Rôle: {user.role}
                      </p>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        );
      case 'devices':
        return (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Gestion des Objets Connectés</h2>
                <button 
                  style={getButtonStyle('close')}
                  onMouseEnter={() => handleButtonHover('close')}
                  onMouseLeave={handleButtonLeave}
                  onClick={closeModal}
                >
                  Fermer
                </button>
              </div>
                    <input
                      type="text"
                placeholder="Rechercher un appareil..."
                style={getSearchStyle()}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onMouseEnter={handleSearchHover}
                onMouseLeave={handleSearchLeave}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button 
                  style={getButtonStyle('addDevice')}
                  onMouseEnter={() => handleButtonHover('addDevice')}
                  onMouseLeave={handleButtonLeave}
                  onClick={() => setShowAddDeviceForm(true)}
                >
                  Ajouter un appareil
                </button>
                <button 
                  style={getButtonStyle('manageCategories')}
                  onMouseEnter={() => handleButtonHover('manageCategories')}
                  onMouseLeave={handleButtonLeave}
                  onClick={() => setShowCategoryModal(true)}
                >
                  Gérer les catégories
                </button>
              </div>
              <div style={styles.cardContainer}>
                {connectedDevices.filter(device => device.name.toLowerCase().includes(searchTerm.toLowerCase())).map((device, index) => (
                  <div 
                    key={index} 
                    style={getCardStyle(`device-${index}`)}
                    onMouseEnter={() => handleCardHover(`device-${index}`)}
                    onMouseLeave={handleCardLeave}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <h3 style={{
                      ...styles.cardTitle,
                      color: hoveredCard === `device-${index}` ? '#E67E22' : '#f5f5f5',
                      borderBottom: `2px solid ${hoveredCard === `device-${index}` ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`
                    }}>
                      {device.name}
                    </h3>
                    <div style={styles.cardContent}>
                      <p style={{
                        transform: hoveredCard === `device-${index}` ? 'scale(1.02)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        Type: {device.type}
                      </p>
                      <p style={{
                        transform: hoveredCard === `device-${index}` ? 'scale(1.02)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        Statut: {device.status}
                      </p>
                      <p style={{
                        transform: hoveredCard === `device-${index}` ? 'scale(1.02)' : 'none',
                        transition: 'all 0.3s ease'
                      }}>
                        Pièce: {device.room}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'maintenance':
        return (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Maintenance</h2>
                    <button
                  style={getButtonStyle('close')}
                  onMouseEnter={() => handleButtonHover('close')}
                  onMouseLeave={handleButtonLeave}
                  onClick={closeModal}
                    >
                  Fermer
                    </button>
              </div>
              <div style={styles.cardContainer}>
                <div 
                  style={getCardStyle('backup')}
                  onMouseEnter={() => handleCardHover('backup')}
                  onMouseLeave={handleCardLeave}
                >
                  <h3 style={{
                    ...styles.cardTitle,
                    color: hoveredCard === 'backup' ? '#E67E22' : '#f5f5f5',
                    borderBottom: `2px solid ${hoveredCard === 'backup' ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`
                  }}>
                    Sauvegarde et Restauration
                  </h3>
                  <div style={styles.cardContent}>
                    <button
                      style={getButtonStyle('backup')}
                      onMouseEnter={() => handleButtonHover('backup')}
                      onMouseLeave={handleButtonLeave}
                      onClick={handleBackup}
                    >
                      Effectuer une sauvegarde
                    </button>
                    <button 
                      style={getButtonStyle('restore')}
                      onMouseEnter={() => handleButtonHover('restore')}
                      onMouseLeave={handleButtonLeave}
                      onClick={handleRestoreLatest}
                    >
                      Restaurer les données
                    </button>
                  </div>
                </div>
                
                <div 
                  style={getCardStyle('security')}
                  onMouseEnter={() => handleCardHover('security')}
                  onMouseLeave={handleCardLeave}
                >
                  <h3 style={{
                    ...styles.cardTitle,
                    color: hoveredCard === 'security' ? '#E67E22' : '#f5f5f5',
                    borderBottom: `2px solid ${hoveredCard === 'security' ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`
                  }}>
                    Sécurité
                  </h3>
                  <div style={styles.cardContent}>
                  <label style={{ color: '#f5f5f5', marginBottom: '.5rem' }}>
                    Choisir un utilisateur :
                  </label>
                  <select
                    value={selectedUser?.id || ''}
                    onChange={e => {
                      const userId = parseInt(e.target.value, 10);
                      const u = users.find(u => u.id === userId);
                      setSelectedUser(u || null);
                    }}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
                  >
                    <option value="">-- aucun --</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>

                  <button
                    style={{ marginTop: '1rem', ...getButtonStyle('updatePassword') }}
                    disabled={!selectedUser}
                    onClick={() => handleUpdatePassword(selectedUser.id)}
                  >
                    Mettre à jour le mot de passe
                  </button>
                </div>

                  </div>
              </div>
            </div>
          </div>
        );
      case 'customization':
        return (
                  <div style={styles.modal}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Personnalisation</h2>
                <button
                  style={{
                    ...getButtonStyle('close'),
                    color: themeStyles[theme].buttonText
                  }}
                  onMouseEnter={() => handleButtonHover('close')}
                  onMouseLeave={handleButtonLeave}
                  onClick={closeModal}
                                          >
                  Fermer
                                          </button>
                                        </div>
              <div style={styles.cardContainer}>
                <div 
                  style={getCardStyle('theme')}
                  onMouseEnter={() => handleCardHover('theme')}
                  onMouseLeave={handleCardLeave}
                >
                  <h3 style={{
                    ...styles.cardTitle,
                    color: '#f5f5f5',
                    borderBottom: `2px solid ${themeStyles[theme].cardBorder}`
                  }}>
                    Thème
                  </h3>
                  <div style={styles.cardContent}>
                    <p style={{
                      color: themeStyles[theme].text,
                      transform: hoveredCard === 'theme' ? 'scale(1.02)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Thème actuel : {theme === 'dark' ? 'Sombre' : 'Clair'}
                    </p>
                    <button 
                      style={{
                        ...getButtonStyle('changeTheme'),
                        color: themeStyles[theme].buttonText
                      }}
                      onMouseEnter={() => handleButtonHover('changeTheme')}
                      onMouseLeave={handleButtonLeave}
                      onClick={toggleTheme}
                    >
                      Changer de thème
                    </button>
                      </div>
                </div>
                <div 
                  style={getCardStyle('interface')}
                  onMouseEnter={() => handleCardHover('interface')}
                  onMouseLeave={handleCardLeave}
                >
                  <h3 style={{
                    ...styles.cardTitle,
                    color: hoveredCard === 'interface' ? '#E67E22' : '#f5f5f5',
                    borderBottom: `2px solid ${hoveredCard === 'interface' ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`
                  }}>
                    Interface
                  </h3>
                  <div style={styles.cardContent}>
                    <p style={{
                      color: themeStyles[theme].text,
                      transform: hoveredCard === 'interface' ? 'scale(1.02)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      Validation : {validationMode}
                    </p>
                    <button
                      style={getButtonStyle('changeValidation')}
                      onClick={onToggleValidation}
                    >
                      Mode de validation : {validationMode}
                    </button>
                  </div>
                </div>
                <div 
                  style={getCardStyle('notifications')}
                  onMouseEnter={() => handleCardHover('notifications')}
                  onMouseLeave={handleCardLeave}
                >
                  <h3 style={{
                    ...styles.cardTitle,
                    color: hoveredCard === 'notifications' ? '#E67E22' : '#f5f5f5',
                    borderBottom: `2px solid ${hoveredCard === 'notifications' ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`
                  }}>
                    Notifications
                  </h3>
                  <div style={styles.cardContent}>
                                                          <button
                      style={getButtonStyle('configureNotifications')}
                      onMouseEnter={() => handleButtonHover('configureNotifications')}
                      onMouseLeave={handleButtonLeave}
                      onClick={() => alert('Préférences de notifications mises à jour !')}
                                                          >
                      Configurer les notifications
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                          </div>
                      </div>
        );
      case 'reports':
        return (
          <div style={{
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
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '10px',
              width: '400px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#000000'
            }}>
              <h2 style={{...styles.modalTitle, color: '#D35400', textAlign: 'center', marginBottom: '2rem'}}>Rapports</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={handleGenerateReport}
                  style={{
                    backgroundColor: '#D35400',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F17F2B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#D35400';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Générer un rapport de suivi</span>
                </button>
                
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#95A5A6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7F8C8D';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#95A5A6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Annuler</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 'request':
        return (
          <div style={styles.modal}>
            <Modulerequete />
          </div>
        );
          
      case 'userDetails':
        return (
          <div style={{
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
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '10px',
              width: '400px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#000000'
            }}>
              <h2 style={{...styles.modalTitle, color: '#D35400', textAlign: 'center', marginBottom: '1rem'}}>Détails de l'utilisateur</h2>
              
              {/* Photo de l'utilisateur */}
              {selectedUser.photo && selectedUser.photo !== 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg' && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                  <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '3px solid #D35400',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={selectedUser.photo}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={e => { e.target.onerror = null; e.target.src = 'http://localhost:3020/plateforme/smart-home-project/api/uploads/avatar.jpg'; }}
                    />
                  </div>
                </div>
              )}
              
              {/* Section Informations personnelles */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#D35400', marginBottom: '1rem', borderBottom: '1px solid #D35400', paddingBottom: '0.5rem' }}>
                  Informations personnelles
                </h3>
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, color: '#000000'}}>Nom</label>
                  <p style={{margin: '0.5rem 0', color: '#000000', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    {selectedUser.name}
                  </p>
                </div>
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, color: '#000000'}}>Email</label>
                  <p style={{margin: '0.5rem 0', color: '#000000', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    {selectedUser.email}
                  </p>
                </div>
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, color: '#000000'}}>Genre</label>
                  <p style={{margin: '0.5rem 0', color: '#000000', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    {getGenderText(selectedUser.gender)}
                  </p>
                </div>
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, color: '#000000'}}>Âge</label>
                  <p style={{margin: '0.5rem 0', color: '#000000', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    {selectedUser.age} ans
                  </p>
                </div>
              </div>

              {/* Section Informations du compte */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#D35400', marginBottom: '1rem', borderBottom: '1px solid #D35400', paddingBottom: '0.5rem' }}>
                  Informations du compte
                </h3>
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, color: '#000000'}}>Rôle</label>
                  <p style={{margin: '0.5rem 0', color: '#000000', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    {selectedUser.role}
                  </p>
                </div>
                <div style={styles.formGroup}>
                  <label style={{...styles.formLabel, color: '#000000'}}>Points</label>
                  <p style={{margin: '0.5rem 0', color: '#000000', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    {selectedUser.points}
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={handleDeleteUser}
                  style={{
                    backgroundColor: '#E74C3C',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#C0392B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E74C3C';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Supprimer</span>
                </button>
                <button
                  onClick={() => handleOpenEdit(selectedUser)}
                  style={{
                    backgroundColor: '#D35400',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F17F2B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#D35400';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Modifier</span>
                </button>
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#95A5A6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7F8C8D';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#95A5A6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Annuler</span>
                </button>
              </div>
              </div>
            </div>
          );
      case 'editUser':
        return (
          <div style={{
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
          }}>
            <div style={{
              backgroundColor: '#fff',
              padding: '2rem',
              borderRadius: '10px',
              width: '400px',
              maxWidth: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              color: '#000000'
            }}>
              <h2 style={{...styles.modalTitle, color: '#D35400', textAlign: 'center', marginBottom: '0rem'}}>Modifier l'utilisateur</h2>
              
              {/* Section Informations personnelles */}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                {/* Photo de profil */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Photo de profil
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e =>
                      setNewUser({
                        ...editUser,
                        photoFile: e.target.files[0]
                      })
                    }
                  />
                </div>

                {/* Nom d’utilisateur */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Nom d’utilisateur
                  </label>
                  <input
                    type="text"
                    placeholder="Nom d’utilisateur"
                    value={editUser.username}
                    onChange={e => setEditUser({ ...editUser, username: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={editUser.email}
                    onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                {/* Mot de passe */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={editUser.password}
                    onChange={e => setEditUser({ ...editUser, password: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                {/* Âge */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Âge
                  </label>
                  <input
                    type="number"
                    placeholder="Âge"
                    value={editUser.age}
                    onChange={e => setEditUser({ ...editUser, age: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                {/* Genre */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Genre
                  </label>
                  <select
                    value={editUser.gender}
                    onChange={e => setEditUser({ ...editUser, gender: e.target.value })}
                    style={styles.formInput}
                  >
                    <option value="">Sélectionner le genre</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                {/* Rôle */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Rôle
                  </label>
                  <select
                    value={editUser.role}
                    onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                    style={styles.formInput}
                  >
                    <option value="">Sélectionner le rôle</option>
                    <option value="visiteur">Visiteur</option>
                    <option value="simple">Simple</option>
                    <option value="complexe">Complexe</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                {/* Points */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Points
                  </label>
                  <input
                    type="number"
                    placeholder="Points"
                    value={editUser.points}
                    onChange={e => setEditUser({ ...editUser, points: e.target.value })}
                    style={styles.formInput}
                  />
                </div>

                {/* Niveau */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Niveau
                  </label>
                  <select
                    value={editUser.niveau}
                    onChange={e => setEditUser({ ...editUser, niveau: e.target.value })}
                    style={styles.formInput}
                  >
                    <option value="">Sélectionner le niveau</option>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>

                {/* Date de naissance */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    value={editUser.birthdate}
                    onChange={e => setEditUser({ ...editUser, birthdate: e.target.value })}
                    style={styles.formInput}
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    backgroundColor: '#D35400',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F17F2B';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#D35400';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Enregistrer</span>
                        </button>
                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: '#95A5A6',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7F8C8D';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#95A5A6';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                  }}
                >
                  <span>Annuler</span>
                        </button>
                      </div>
                    </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getPanelStyle = (panelKey) => ({
    backgroundColor: hoveredPanel === panelKey ? 'rgba(211, 84, 0, 0.3)' : 'rgba(211, 84, 0, 0.15)',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: `1px solid ${hoveredPanel === panelKey ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`,
    transform: hoveredPanel === panelKey ? 'translateY(-5px)' : 'none',
    '@media (max-width: 1200px)': {
      padding: '1.5rem'
    },
    '@media (max-width: 768px)': {
      padding: '1rem'
    }
  });

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

  const handleGenerateReport = () => {
    const doc = new jsPDF();
    
    // Titre du rapport
    doc.setFontSize(20);
    doc.text('Rapport de suivi de la plateforme', 105, 20, { align: 'center' });
    
    // Date de génération
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
    
    // Statistiques des utilisateurs
    doc.setFontSize(16);
    doc.text('Statistiques des utilisateurs', 20, 50);
    
    const userData = [
      ['Total utilisateurs', users.length],
      ['Administrateurs', users.filter(u => u.role === 'admin').length],
      ['Utilisateurs complexe', users.filter(u => u.role === 'complexe').length],
      ['Utilisateurs simple', users.filter(u => u.role === 'simple').length],
      ['Utilisateurs visiteur', users.filter(u => u.role === 'visiteur').length],
    ];
    
    autoTable(doc, {
      startY: 60,
      head: [['Métrique', 'Valeur']],
      body: userData,
      theme: 'grid',
      headStyles: { fillColor: [211, 84, 0] }
    });
    
    // Statistiques des objets connectés
    doc.setFontSize(16);
    doc.text('Statistiques des objets connectés', 20, doc.lastAutoTable.finalY + 20);
    
    const deviceData = [
      ['Total objets', connectedDevices.length],
      ['Objets actifs', connectedDevices.filter(d => d.status === 'actif').length],
      ['Objets inactifs', connectedDevices.filter(d => d.status === 'inactif').length],
      ['Objets en maintenance', connectedDevices.filter(d => d.status === 'en maintenance').length]
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Métrique', 'Valeur']],
      body: deviceData,
      theme: 'grid',
      headStyles: { fillColor: [211, 84, 0] }
    });
    
    // Statistiques de consommation énergétique
    doc.setFontSize(16);
    doc.text('Consommation énergétique', 20, doc.lastAutoTable.finalY + 20);
    
    // Calcul de la consommation totale
    const consommationTotale = connectedDevices.reduce((total, device) => {
      return total + (device.energyConsumption || 0);
    }, 0);

    // Calcul de la consommation moyenne par appareil
    const consommationMoyenne = connectedDevices.length > 0 
      ? consommationTotale / connectedDevices.length 
      : 0;

    // Calcul de la consommation par catégorie
    const consommationParCategorie = {};
    connectedDevices.forEach(device => {
      if (!consommationParCategorie[device.type]) {
        consommationParCategorie[device.type] = 0;
      }
      consommationParCategorie[device.type] += device.energyConsumption || 0;
    });

    const consommationData = [
      ['Consommation totale', `${consommationTotale.toFixed(2)} W`],
      ['Consommation moyenne par appareil', `${consommationMoyenne.toFixed(2)} W`],
      ...Object.entries(consommationParCategorie).map(([categorie, consommation]) => [
        `Consommation ${categorie}`,
        `${consommation.toFixed(2)} W`
      ])
    ];
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Métrique', 'Valeur']],
      body: consommationData,
      theme: 'grid',
      headStyles: { fillColor: [211, 84, 0] }
    });
    
    // Liste des utilisateurs récents
    doc.setFontSize(16);
    doc.text('Utilisateurs récents', 20, doc.lastAutoTable.finalY + 20);
    
    const recentUsers = users.slice(-5).map(user => [
      user.username,
      user.email,
      user.role, 
      user.member_type,
      user.points
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 30,
      head: [['Pseudo', 'Email', 'Rôle', 'Type de membre', 'Points']],
      body: recentUsers,
      theme: 'grid',
      headStyles: { fillColor: [211, 84, 0] }
    });
    
    // Sauvegarder le PDF
    doc.save('rapport_plateforme.pdf');
  };

  // Fonction pour convertir le code de genre en texte lisible
  const getGenderText = (code) => {
    switch(code) {
      case 'Homme': return 'Homme';
      case 'Femme': return 'Femme';
      case 'Autre': return 'Autre';
      case 'PreferePasDire': return 'Préfère ne pas préciser';
      default: return code || 'Non spécifié';
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
      opacity: isNavigating ? 0 : 1,
      transition: 'opacity 0.5s ease'
    }}>
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
        onClick={handleNavigateHome}
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
      <main style={{ 
        maxWidth: '1200px', 
        margin: '150px auto 100px', 
        backgroundColor: 'rgba(0,0,0,0.75)', 
        padding: '2rem', 
        borderRadius: '10px', 
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '2rem', 
          textAlign: 'center', 
          color: 'white',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          '@media (max-width: 1200px)': {
            fontSize: '2.2rem',
            marginBottom: '1.5rem'
          },
          '@media (max-width: 768px)': {
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }
        }}>Module Administration</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          '@media (max-width: 1200px)': {
            gap: '1.5rem'
          },
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr',
            gap: '1rem'
          }
        }}>
          {panels.map(panel => (
            <div 
              key={panel.key} 
              style={getPanelStyle(panel.key)}
              onMouseEnter={() => handlePanelHover(panel.key)}
              onMouseLeave={handlePanelLeave}
              onClick={() => setActiveModal(panel.key)}
            >
              <h3 style={{ 
                fontSize: '1.8rem', 
                marginBottom: '1.5rem', 
                color: 'white',
                textAlign: 'center',
                borderBottom: `2px solid ${hoveredPanel === panel.key ? '#E67E22' : 'rgba(211, 84, 0, 0.3)'}`,
                paddingBottom: '0.5rem',
                fontWeight: 'bold',
                '@media (max-width: 1200px)': {
                  fontSize: '1.6rem',
                  marginBottom: '1rem'
                },
                '@media (max-width: 768px)': {
                  fontSize: '1.4rem',
                  marginBottom: '0.8rem'
                }
              }}>{panel.title}</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.5rem',
                color: 'white',
                fontSize: '1.1rem',
                padding: '0 1rem',
                '@media (max-width: 1200px)': {
                  fontSize: '1rem',
                  padding: '0 0.8rem'
                },
                '@media (max-width: 768px)': {
                  fontSize: '0.9rem',
                  padding: '0 0.5rem'
                }
              }}>
                {panel.features.map((feature, index) => (
                  <div 
                    key={index} 
                    style={{
                      padding: '0.5rem 0',
                      transform: hoveredPanel === panel.key ? 'scale(1.02)' : 'none',
                      transition: 'all 0.3s ease',
                      '@media (max-width: 768px)': {
                        padding: '0.3rem 0'
                      }
                    }}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

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

      {showHistoryModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.historyModal}>
            <h3 style={styles.historyTitle}>Historique de {activeUser?.name}</h3>
            {history
              .filter(h => h.includes(activeUser?.name))
              .map((h, i) => (
                <div key={i} style={styles.historyItem}>{h}</div>
              ))}
            <button style={styles.historyBackButton} onClick={() => setShowHistoryModal(false)}>Retour</button>
          </div>
        </div>
      )}
      {panels.map(panel => (
        activeModal === panel.key && (
          <div key={panel.key} style={styles.modal}>
              {renderModalContent(panel.key)}
          </div>
        )
      ))}
      {showUserModal && selectedUser && (
        <>
          <div style={styles.userModalOverlay} onClick={() => setShowUserModal(false)} />
          <div style={styles.userModal}>
            <button style={styles.userModalClose} onClick={() => setShowUserModal(false)}>×</button>
            <div style={styles.userModalHeader}>
              <img 
                src={selectedUser.photo}
                alt={selectedUser.name}
                style={styles.userModalPhoto}
                onError={e => { e.target.onerror = null; 
                }}
              />
              <h2 style={styles.userModalTitle}>{selectedUser.name}</h2>
            </div>
            <div style={styles.userModalContent}>
              <div style={styles.userModalInfo}>
                <span style={styles.userModalLabel}>Email :</span>
                <span style={styles.userModalValue}>{selectedUser.email}</span>
              </div>
              <div style={styles.userModalInfo}>
                <span style={styles.userModalLabel}>Âge :</span>
                <span style={styles.userModalValue}>{selectedUser.age} ans</span>
              </div>
              <div style={styles.userModalInfo}>
                <span style={styles.userModalLabel}>Genre :</span>
                <span style={styles.userModalValue}>{getGenderText(selectedUser.gender)}</span>
              </div>
              <div style={styles.userModalInfo}>
                <span style={styles.userModalLabel}>Rôle :</span>
                <span style={styles.userModalValue}>{selectedUser.role}</span>
              </div>
             
              <div style={styles.userModalInfo}>
                <span style={styles.userModalLabel}>Points :</span>
                <span style={styles.userModalValue}>{selectedUser.points}</span>
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              marginTop: '20px',
              gap: '10px'
            }}>
              <button
                onClick={handleDeleteUser}
                style={{
                  backgroundColor: '#E74C3C',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#C0392B';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E74C3C';
                }}
              >
                Supprimer
              </button>
              <button
                onClick={() => setActiveModal('editUser')}
                style={{
                  backgroundColor: '#3498DB',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2980B9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3498DB';
                }}
              >
                Modifier
              </button>
            </div>
          </div>
        </>
      )}
      {showAddUserForm && (
  <div style={styles.modalOverlay} onClick={() => setShowAddUserForm(false)}>
    <div style={styles.addUserModal} onClick={e => e.stopPropagation()}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#D35400' }}>
        Ajouter un utilisateur
      </h2>
    

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        {/* Aperçu de la photo de profil */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        
        </div>
        {/* Photo de profil */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Photo de profil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e =>
              setNewUser({
                ...newUser,
                photoFile: e.target.files[0]
              })
            }
          />
        </div>

        {/* Nom d’utilisateur */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Nom d’utilisateur
          </label>
          <input
            type="text"
            placeholder="Nom d’utilisateur"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            required
            style={styles.input}
          />
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            required
            style={styles.input}
          />
        </div>

        {/* Mot de passe */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            required
            style={styles.input}
          />
        </div>

        {/* Âge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Âge
          </label>
          <input
            type="number"
            placeholder="Âge"
            value={newUser.age}
            onChange={e => setNewUser({ ...newUser, age: e.target.value })}
            required
            style={styles.input}
          />
        </div>

        {/* Genre */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Genre <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={newUser.gender}
            onChange={e => setNewUser({ ...newUser, gender: e.target.value })}
            style={styles.formInput}
            required
          >
            <option value="">Sélectionner le genre</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        {/* Rôle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Rôle <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            style={styles.formInput}
            required
          >
            <option value="">Sélectionner le rôle</option>
            <option value="visiteur">Visiteur</option>
            <option value="simple">Simple</option>
            <option value="complexe">Complexe</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>

        {/* Points */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Points
          </label>
          <input
            type="number"
            placeholder="Points"
            value={newUser.points}
            onChange={e => setNewUser({ ...newUser, points: parseInt(e.target.value) })}
            required
            min="0"
            style={styles.input}
          />
        </div>

        {/* Niveau */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Niveau <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={newUser.niveau}
            onChange={e => setNewUser({ ...newUser, niveau: e.target.value })}
            style={styles.formInput}
            required
          >
            <option value="">Sélectionner le niveau</option>
            <option value="debutant">Débutant</option>
            <option value="intermediaire">Intermédiaire</option>
            <option value="avance">Avancé</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Type de membre <span style={{ color: 'red' }}>*</span>
          </label>
          <select
            value={newUser.memberType}
            onChange={e => setNewUser({ ...newUser, memberType: e.target.value })}
            style={styles.formInput}
            required
          >
            <option value="">Sélectionner le type</option>
            <option value="Père">Père</option>
            <option value="Grand-parent">Grand-parent</option>
            <option value="Fils">Fils</option>
            <option value="Enfant">Enfant</option>
            <option value="Mère">Mère</option>
          </select>
        </div>

        {/* Date de naissance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
            Date de naissance <span style={{ color: 'red' }}>*</span>
          </label>
          <input
            type="date"
            value={newUser.birthdate}
            onChange={e => setNewUser({ ...newUser, birthdate: e.target.value })}
            style={styles.formInput}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
        <button
          style={{
            ...styles.button,
            backgroundColor: '#D35400',
            color: 'white',
            flex: 1,
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
          onClick={handleAddUser}
        >
          Ajouter
        </button>
        <button
          style={{
            ...styles.button,
            backgroundColor: '#999',
            color: 'white',
            flex: 1,
            padding: '0.5rem 1rem',
            fontSize: '1rem'
          }}
          onClick={() => setShowAddUserForm(false)}
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}

      {showAddDeviceForm && (
        <div style={styles.modalOverlay} onClick={() => setShowAddDeviceForm(false)}>
          <div style={styles.addUserModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#D35400' }}>Ajouter un appareil</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Nom de l'appareil</label>
                <input
                  type="text"
                  placeholder="Nom de l'appareil"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  style={styles.formInput}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Type d'appareil</label>
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                  style={styles.formInput}
                >
                  <option value="">Sélectionner le type</option>
                  {deviceTypeOptions.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Statut</label>
                <select
                  value={newDevice.status}
                  onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
                  style={styles.formInput}
                >
                  <option value="">Sélectionner le statut</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en maintenance">En maintenance</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Pièce</label>
                <input
                  type="text"
                  placeholder="Pièce de l'appareil"
                  value={newDevice.room}
                  onChange={(e) => setNewDevice({ ...newDevice, room: e.target.value })}
                  style={styles.formInput}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Consommation d'énergie (W)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="Consommation d'énergie"
                    value={newDevice.energyConsumption}
                    onChange={(e) => setNewDevice({ ...newDevice, energyConsumption: e.target.value === '' ? '' : parseInt(e.target.value) })}
                    style={styles.formInput}
                  />
                  <select
                    value={newDevice.energyConsumption}
                    onChange={(e) => setNewDevice({ ...newDevice, energyConsumption: parseInt(e.target.value) })}
                    style={styles.formInput}
                  >
                    <option value="">Sélectionner</option>
                    <option value="10">10W</option>
                    <option value="20">20W</option>
                    <option value="50">50W</option>
                    <option value="100">100W</option>
                    <option value="200">200W</option>
                    <option value="500">500W</option>
                    <option value="1000">1000W</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Dernière maintenance</label>
                <input
                  type="date"
                  value={newDevice.lastMaintenance}
                  onChange={(e) => setNewDevice({ ...newDevice, lastMaintenance: e.target.value })}
                  style={styles.formInput}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Niveau de batterie (%)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Niveau de batterie"
                    value={newDevice.batteryLevel}
                    onChange={(e) => setNewDevice({ ...newDevice, batteryLevel: e.target.value === '' ? '' : parseInt(e.target.value) })}
                    style={styles.formInput}
                  />
                  <select
                    value={newDevice.batteryLevel}
                    onChange={(e) => setNewDevice({ ...newDevice, batteryLevel: parseInt(e.target.value) })}
                    style={styles.formInput}
                  >
                    <option value="">Sélectionner</option>
                    <option value="0">0%</option>
                    <option value="25">25%</option>
                    <option value="50">50%</option>
                    <option value="75">75%</option>
                    <option value="100">100%</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#D35400',
                  color: 'white',
                  flex: 1,
                  padding: '0.5rem 1rem',
                  fontSize: '1rem'
                }}
                onClick={handleAddDevice}
              >
                Ajouter
              </button>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#999',
                  color: 'white',
                  flex: 1,
                  padding: '0.5rem 1rem',
                  fontSize: '1rem'
                }}
                onClick={() => setShowAddDeviceForm(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {showCategoryModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCategoryModal(false)}>
          <div style={styles.addUserModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#D35400' }}>Gérer les catégories</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Nouvelle catégorie"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={styles.formInput}
                />
                <button
                  style={{
                    ...styles.button,
                    backgroundColor: '#D35400',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    fontSize: '1rem'
                  }}
                  onClick={handleAddCategory}
                >
                  Ajouter
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {deviceTypeOptions.map((type, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(211, 84, 0, 0.1)',
                    borderRadius: '5px'
                  }}>
                    <span style={{ color: '#333' }}>{type}</span>
                    <button
                      style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.3rem 0.6rem',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDeleteCategory(type)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#999',
                  color: 'white',
                  flex: 1,
                  padding: '0.5rem 1rem',
                  fontSize: '1rem'
                }}
                onClick={() => setShowCategoryModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedDevice && (
        <div style={styles.modalOverlay} onClick={() => setSelectedDevice(null)}>
          <div style={styles.addUserModal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#D35400' }}>Détails de l'appareil</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Nom de l'appareil</label>
                <span style={{ color: '#333' }}>{selectedDevice.name}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Type d'appareil</label>
                <span style={{ color: '#333' }}>{selectedDevice.type}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Statut</label>
                <span style={{ color: '#333' }}>{selectedDevice.status}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Pièce</label>
                <span style={{ color: '#333' }}>{selectedDevice.room}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Consommation d'énergie</label>
                <span style={{ color: '#333' }}>{selectedDevice.energyConsumption}W</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Dernière maintenance</label>
                <span style={{ color: '#333' }}>{selectedDevice.lastMaintenance}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Niveau de batterie</label>
                <span style={{ color: '#333' }}>{selectedDevice.batteryLevel}%</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#ff4444',
                  color: 'white',
                  flex: 1,
                  padding: '0.5rem 1rem',
                  fontSize: '1rem'
                }}
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer cet appareil ?')) {
                    handleDeleteDevice(selectedDevice.id);
                  }
                }}
              >
                Supprimer l'appareil
              </button>
              <button
                style={{
                  ...styles.button,
                  backgroundColor: '#999',
                  color: 'white',
                  flex: 1,
                  padding: '0.5rem 1rem',
                  fontSize: '1rem'
                }}
                onClick={() => setSelectedDevice(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            padding: '2rem',
            borderRadius: '10px',
            width: '400px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
          }}>
            {renderModalContent(activeModal)}
          </div>
        </div>
      )}
    </div>
  );
};
export default ModuleAdministration;
