import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Wechselt zwischen Login und Register
  const [formData, setFormData] = useState({ benutzername: '', passwort: '' });
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const { benutzername, passwort } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // URL entscheiden: Login oder Register?
    const url = isLogin 
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    try {
      const res = await axios.post(url, formData);

      if (isLogin) {
        // Beim Login: Token speichern und weiterleiten
        login(res.data.token, res.data.user);
        navigate('/menu'); // Weiterleitung zur Quiz-Seite
      } else {
        // Nach Registrierung: Automatisch einloggen oder zum Login wechseln
        alert("Registrierung erfolgreich! Bitte einloggen.");
        setIsLogin(true);
      }
    } catch (err) {
      // Fehler vom Backend anzeigen (z.B. "Falsches Passwort")
      setError(err.response?.data?.message || 'Ein Fehler ist aufgetreten');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>{isLogin ? 'Anmelden' : 'Registrieren'}</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Benutzername" 
          name="benutzername" 
          value={benutzername} 
          onChange={handleChange}
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Passwort" 
          name="passwort" 
          value={passwort} 
          onChange={handleChange}
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
          {isLogin ? 'Einloggen' : 'Registrieren'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        {isLogin ? 'Noch keinen Account?' : 'Bereits registriert?'}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Jetzt registrieren' : 'Zum Login'}
        </button>
      </p>
    </div>
  );
};

export default LoginPage;