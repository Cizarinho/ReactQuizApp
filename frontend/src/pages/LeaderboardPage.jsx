import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LeaderboardPage = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // Daten laden beim Start
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/quiz/leaderboard');
                setLeaders(res.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Fehler beim Laden:", err);
                setError("Konnte Bestenliste nicht laden.");
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    // Hilfsfunktion: Datum schön formatieren (z.B. "24.11.2023 14:30")
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Lade Bestenliste...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '30px', color: '#333' }}>🏆 Hall of Fame 🏆</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ overflowX: 'auto', boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2196F3', color: 'white' }}>
                            <th style={thStyle}>Rang</th>
                            <th style={thStyle}>Spieler</th>
                            <th style={thStyle}>Punkte</th>
                            <th style={thStyle}>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaders.length > 0 ? (
                            leaders.map((entry, index) => (
                                <tr key={index} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                                    <td style={{ ...tdStyle, fontWeight: 'bold' }}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 + '.'}
                                    </td>
                                    <td style={tdStyle}>{entry.benutzername}</td>
                                    <td style={{ ...tdStyle, color: '#4CAF50', fontWeight: 'bold' }}>{entry.punktestand}</td>
                                    <td style={{ ...tdStyle, color: '#888', fontSize: '0.9rem' }}>{formatDate(entry.gespielt_am)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ padding: '20px' }}>Noch keine Einträge vorhanden. Spiel eine Runde!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button 
                onClick={() => navigate('/menu')} 
                style={{ 
                    marginTop: '30px', 
                    padding: '10px 20px', 
                    backgroundColor: '#555', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                ⬅ Zurück zum Menü
            </button>
        </div>
    );
};

// --- STYLES ---
const thStyle = {
    padding: '15px',
    textAlign: 'left',
    fontSize: '1.1rem'
};

const tdStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd'
};

const rowEvenStyle = {
    backgroundColor: '#f9f9f9'
};

const rowOddStyle = {
    backgroundColor: '#ffffff'
};

export default LeaderboardPage;