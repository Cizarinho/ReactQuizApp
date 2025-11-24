import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    // State für manuelle Frage
    const [manualForm, setManualForm] = useState({
        frage_text: '',
        right_answer: '',
        wrong_answer_1: '',
        wrong_answer_2: '',
        wrong_answer_3: '',
        schwierigkeit: 'easy'
    });

    // State für API Import
    const [importAmount, setImportAmount] = useState(10);
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- MANUELLE FRAGE ERSTELLEN ---
    const handleManualChange = (e) => {
        setManualForm({ ...manualForm, [e.target.name]: e.target.value });
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');

        try {
            await axios.post('http://localhost:5000/api/questions', manualForm);
            setMessage('Frage erfolgreich erstellt!');
            // Formular leeren
            setManualForm({
                frage_text: '', right_answer: '', wrong_answer_1: '', wrong_answer_2: '', wrong_answer_3: '', schwierigkeit: 'easy'
            });
        } catch (err) {
            console.error(err);
            setError('Fehler beim Erstellen der Frage.');
        }
    };

    // --- API IMPORT ---
    const handleImportSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/questions/import', {
                amount: importAmount
            });
            setMessage(res.data.message);
        } catch (err) {
            console.error(err);
            setError('Fehler beim Importieren der Fragen.');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>⚙️ Admin Dashboard</h1>
                <button onClick={() => navigate('/menu')} style={{ padding: '8px 15px', cursor: 'pointer' }}>Zurück zum Menü</button>
            </div>

            {/* Feedback Nachrichten */}
            {message && <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '20px', borderRadius: '5px' }}>{message}</div>}
            {error && <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '20px', borderRadius: '5px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* --- LINKE SEITE: Manuelle Erstellung --- */}
                <div style={cardStyle}>
                    <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>Manuelle Frage</h2>
                    <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <label>Fragetext:</label>
                        <textarea name="frage_text" value={manualForm.frage_text} onChange={handleManualChange} required rows="3" style={inputStyle} />
                        
                        <label>Richtige Antwort:</label>
                        <input type="text" name="right_answer" value={manualForm.right_answer} onChange={handleManualChange} required style={{...inputStyle, borderColor: 'green'}} />
                        
                        <label>Falsche Antwort 1:</label>
                        <input type="text" name="wrong_answer_1" value={manualForm.wrong_answer_1} onChange={handleManualChange} required style={inputStyle} />
                        
                        <label>Falsche Antwort 2:</label>
                        <input type="text" name="wrong_answer_2" value={manualForm.wrong_answer_2} onChange={handleManualChange} required style={inputStyle} />
                        
                        <label>Falsche Antwort 3:</label>
                        <input type="text" name="wrong_answer_3" value={manualForm.wrong_answer_3} onChange={handleManualChange} required style={inputStyle} />
                        
                        <label>Schwierigkeit:</label>
                        <select name="schwierigkeit" value={manualForm.schwierigkeit} onChange={handleManualChange} style={inputStyle}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <button type="submit" style={{ ...buttonStyle, backgroundColor: '#4CAF50', marginTop: '10px' }}>Frage Speichern</button>
                    </form>
                </div>

                {/* --- RECHTE SEITE: API Import --- */}
                <div style={cardStyle}>
                    <h2 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>Mass-Import (API)</h2>
                    <p style={{ marginBottom: '15px' }}>Importiere zufällige Fragen von der Open Trivia Database.</p>
                    
                    <form onSubmit={handleImportSubmit}>
                        <label style={{ display: 'block', marginBottom: '10px' }}>Anzahl der Fragen:</label>
                        <input 
                            type="number" 
                            value={importAmount} 
                            onChange={(e) => setImportAmount(e.target.value)} 
                            min="1" max="50" 
                            style={{ ...inputStyle, width: '100px', marginBottom: '20px' }} 
                        />
                        
                        <button type="submit" style={{ ...buttonStyle, backgroundColor: '#2196F3' }}>
                            🚀 Import Starten
                        </button>
                    </form>

                    <div style={{ marginTop: '30px', fontSize: '0.9rem', color: '#666' }}>
                        <p>Hinweis: Importiert nur Multiple-Choice Fragen. Duplikate sind möglich.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- STYLES ---
const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    border: '1px solid #eee'
};

const inputStyle = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px'
};

const buttonStyle = {
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%'
};

export default AdminPage;