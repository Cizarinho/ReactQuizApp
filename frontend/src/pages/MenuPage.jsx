import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const MenuPage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div style={containerStyle}>
            <h1 style={{ marginBottom: '40px', color: '#333' }}>Hauptmenü</h1>
            
            <p style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                Willkommen zurück, <strong>{user?.username}</strong>!
            </p>

            <div style={gridStyle}>
                {/* 1. Quiz Starten Button */}
                <button onClick={() => navigate('/quiz')} style={bigButtonStyle('#4CAF50')}>
                    🚀 Quiz Starten
                </button>

                {/* 2. Leaderboard Button */}
                <button onClick={() => navigate('/leaderboard')} style={bigButtonStyle('#2196F3')}>
                    🏆 Bestenliste
                </button>

                {/* 3. Admin Button (Nur sichtbar für Admins) */}
                {user && user.isAdmin === 1 && (
                    <button onClick={() => navigate('/admin')} style={bigButtonStyle('#ff4444')}>
                        ⚙️ Admin Bereich
                    </button>
                )}

                {/* 4. Logout Button */}
                <button onClick={logout} style={bigButtonStyle('#777')}>
                    🚪 Abmelden
                </button>
            </div>
        </div>
    );
};

// --- STYLES ---
const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh', // Fast volle Bildschirmhöhe
    textAlign: 'center'
};

const gridStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    maxWidth: '300px'
};

// Eine Funktion für den Style, damit wir die Farbe ändern können
const bigButtonStyle = (bgColor) => ({
    padding: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: bgColor,
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    transition: 'transform 0.1s',
});

export default MenuPage;