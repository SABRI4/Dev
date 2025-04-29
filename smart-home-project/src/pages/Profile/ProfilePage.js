import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backgroundImage from '../../Pictures/kitchen-background.jpg';

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nom: '',
    prenom: '',
    birthdate: '',
    gender: '',
    age: '',
    member_type: ''
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [newPhoto, setNewPhoto] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        username: userData.username || '',
        email: userData.email || '',
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        birthdate: userData.birthdate || '',
        gender: userData.gender || '',
        age: userData.age || '',
        member_type: userData.member_type || ''
      });
      setPreviewURL(userData.photo || '');
    }
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPhoto(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'gender':
        if (!value) error = 'Le genre est requis';
        break;
      case 'age':
        if (!value) error = 'L\'âge est requis';
        else if (isNaN(value) || value < 0) error = 'L\'âge doit être un nombre positif';
        break;
      case 'member_type':
        if (!value) error = 'Le type de membre est requis';
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validation en temps réel
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    // Réinitialiser le message d'erreur global
    setError('');
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ['gender', 'age', 'member_type'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (newPhoto) {
      formDataToSend.append('photo', newPhoto);
    }

    try {
      const response = await fetch('http://localhost:3020/plateforme/smart-home-project/api/update_profile.php', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      const data = await response.json();
      if (data.status === 'success') {
        const updatedUser = { ...user, ...formData, photo: data.photo || user.photo };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        alert('Profil mis à jour avec succès !');
      } else {
        setError(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  const handleNavigateHome = (e) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    try {
      const response = await fetch('http://localhost:3020/plateforme/smart-home-project/api/change_password.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (data.status === 'success') {
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Mot de passe modifié avec succès');
      } else {
        setPasswordError(data.message);
      }
    } catch (error) {
      setPasswordError('Erreur lors de la modification du mot de passe');
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '2rem',
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(5px)',
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '2.5rem',
    borderRadius: '15px',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)'
  };

  const photoContainerStyle = {
    position: 'relative',
    width: '150px',
    height: '150px',
    margin: '0 auto 2rem',
    cursor: isEditing ? 'pointer' : 'default',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #D35400'
  };

  const photoOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: isEditing ? 'flex' : 'none',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    backgroundColor: isEditing ? 'white' : '#f8f8f8',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#666',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  };

  return (
    <div style={{
      ...pageStyle,
      opacity: isNavigating ? 0 : 1,
      transition: 'opacity 0.5s ease'
    }}>
      <div style={overlayStyle} />

      <Link
        to="/"
        onClick={handleNavigateHome}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 3,
          textDecoration: 'none',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0,0,0,0.3)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(211, 84, 0, 0.7)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
      >
        <span style={{ marginRight: '5px', fontSize: '20px' }}>&#8592;</span>
        <span>Retour à l'accueil</span>
      </Link>

      <div style={contentStyle}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#D35400', 
          marginBottom: '2.5rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Profil Utilisateur
        </h1>

        {user && (
          <form onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div 
                style={photoContainerStyle}
                onClick={handlePhotoClick}
                onMouseEnter={(e) => {
                  if (isEditing) {
                    e.currentTarget.querySelector('.photo-overlay').style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isEditing) {
                    e.currentTarget.querySelector('.photo-overlay').style.opacity = '0';
                  }
                }}
              >
                <img
                  src={previewURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div className="photo-overlay" style={photoOverlayStyle}>
                  <span>Changer la photo</span>
                </div>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {error && (
              <div style={{ 
                backgroundColor: '#f8d7da', 
                color: '#721c24', 
                padding: '1rem', 
                marginBottom: '2rem', 
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '2rem',
              marginBottom: '2rem' 
            }}>
              <div>
                <label style={labelStyle}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>
                  Prénom
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={labelStyle}>
                  Genre
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    ...inputStyle,
                    borderColor: errors.gender ? '#dc3545' : '#ddd'
                  }}
                >
                  <option value="">Sélectionnez un genre</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                  <option value="Autre">Autre</option>
                  <option value="Ne souhaite pas préciser">Ne souhaite pas préciser</option>
                </select>
                {errors.gender && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '0.8rem', 
                    marginTop: '-1rem', 
                    marginBottom: '1rem' 
                  }}>
                    {errors.gender}
                  </div>
                )}
              </div>
              
              <div>
                <label style={labelStyle}>
                  Âge
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    ...inputStyle,
                    borderColor: errors.age ? '#dc3545' : '#ddd'
                  }}
                />
                {errors.age && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '0.8rem', 
                    marginTop: '-1rem', 
                    marginBottom: '1rem' 
                  }}>
                    {errors.age}
                  </div>
                )}
              </div>
              
              <div>
                <label style={labelStyle}>
                  Type de membre
                </label>
                <select
                  name="member_type"
                  value={formData.member_type}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  style={{
                    ...inputStyle,
                    borderColor: errors.member_type ? '#dc3545' : '#ddd'
                  }}
                >
                  <option value="">Sélectionnez un type de membre</option>
                  <option value="mother">Mère</option>
                  <option value="father">Père</option>
                  <option value="child">Enfant</option>
                  <option value="grandparent">Grand-parent</option>
                  <option value="other-relative">Autre membre de la famille</option>
                  <option value="guest">Invité</option>
                </select>
                {errors.member_type && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '0.8rem', 
                    marginTop: '-1rem', 
                    marginBottom: '1rem' 
                  }}>
                    {errors.member_type}
                  </div>
                )}
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '2.5rem' 
            }}>
              {!isEditing ? (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#D35400',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#AF4600';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D35400';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                  >
                    Modifier le profil
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#D35400',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#AF4600';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D35400';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                  >
                    Changer le mot de passe
                  </button>
                  <Link
                    to="/users"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#D35400',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#AF4600';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D35400';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                  >
                    Voir les utilisateurs
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#D35400',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#AF4600';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#D35400';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setPreviewURL(user.photo);
                      setFormData({
                        username: user.username || '',
                        email: user.email || '',
                        nom: user.nom || '',
                        prenom: user.prenom || '',
                        birthdate: user.birthdate || '',
                        gender: user.gender || '',
                        age: user.age || '',
                        member_type: user.member_type || ''
                      });
                      setError('');
                    }}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#666',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#555';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#666';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                    }}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </form>
        )}

        {/* Modal de changement de mot de passe */}
        {showPasswordModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#D35400' }}>Changer le mot de passe</h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc'
                    }}
                    required
                  />
                </div>

                {passwordError && (
                  <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {passwordError}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    style={{
                      backgroundColor: '#999',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#D35400',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;